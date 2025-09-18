import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { createMessage, deleteMessage, updateMessage } from "./server";
import { Logger } from "./logger";
import http from "http";
import url from "url";
import type {
	User,
	MessageData,
	JwtPayload,
	Op,
	OpWithIndex,
	ServerConfig,
} from "./types";
import { validateMessage, validateRoomId, validateUserId } from "./types";
import { MessageHandlers } from "./messageHandlers";

const wsToUser = new WeakMap<WebSocket, User>();
const roomToUsers = new Map<string, Set<User>>();

const server = http.createServer((req, res) => {
	const parsedUrl = url.parse(req.url!, true);

	if (parsedUrl.pathname === "/health") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({
				status: "healthy",
				timestamp: new Date().toISOString(),
				service: "skema-ws-server",
				connectedUsers: users.length,
				activeRooms: messagesByRoom.size,
				optimizedRooms: roomToUsers.size,
				rateLimitedUsers: userBuckets.size,
				uptime: process.uptime(),
				performance: {
					wsToUserOptimization: "Active (WeakMap for O(1) lookups)",
					roomToUsersMapSize: roomToUsers.size,
					throttledUsers: userThrottles.size,
					activeBuckets: userBuckets.size,
					messagePoolSize: messagePool.getPoolSize(),
				},
			})
		);
		return;
	}

	res.writeHead(404, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ error: "Not found" }));
});

const wss = new WebSocketServer({
	server,
	clientTracking: true,
});

server.listen(
	process.env.PORT ? Number(process.env.PORT) : 8080,
	"0.0.0.0",
	() => {
		Logger.info("WebSocket server running on port 8080");
	}
);

const config: ServerConfig = {
	port: process.env.PORT ? Number(process.env.PORT) : 8080,
	jwtSecret: process.env.JWT_SECRET || "duplicate-secret",
	baseUrl: process.env.BASE_URL || "http://localhost:3000",
	drawThrottleMs: Number(process.env.DRAW_THROTTLE_MS) || 100,
	maxHistorySize: Number(process.env.MAX_HISTORY_SIZE) || 1000,
	roomCleanupInterval: 30 * 60 * 1000,
};

const users: User[] = [];
const messagesByRoom = new Map<string, any[]>();
const historyByRoom = new Map<string, Op[]>();
const redoByRoomUser = new Map<string, Map<string, Op[]>>();

const userThrottles = new Map<string, number>();

class TokenBucket {
	private tokens: number;
	private lastRefill: number;

	constructor(
		private capacity: number,
		private refillRate: number
	) {
		this.tokens = capacity;
		this.lastRefill = Date.now();
	}

	consume(): boolean {
		this.refill();
		if (this.tokens >= 1) {
			this.tokens--;
			return true;
		}
		return false;
	}

	private refill() {
		const now = Date.now();
		const timePassed = (now - this.lastRefill) / 1000;
		this.tokens = Math.min(
			this.capacity,
			this.tokens + timePassed * this.refillRate
		);
		this.lastRefill = now;
	}
}

const userBuckets = new Map<string, TokenBucket>();

class MessagePool {
	private pool: any[] = [];

	acquire(): any {
		return this.pool.pop() || {};
	}

	release(obj: any) {
		for (const key in obj) {
			delete obj[key];
		}
		this.pool.push(obj);
	}

	getPoolSize(): number {
		return this.pool.length;
	}
}
const messagePool = new MessagePool();

const roomCursorBroadcasters = new Map<string, NodeJS.Timeout>();

function startCursorBroadcasting(roomId: string) {
	if (roomCursorBroadcasters.has(roomId)) {
		clearInterval(roomCursorBroadcasters.get(roomId)!);
	}

	const interval = setInterval(() => {
		const roomUsers = roomToUsers.has(roomId)
			? Array.from(roomToUsers.get(roomId)!)
			: users.filter((user) => user.rooms.includes(roomId));

		if (roomUsers.length <= 1) return;

		const now = Date.now();
		const cursors: Array<{
			username: string;
			pos: { x: number; y: number };
			lastSeen: number;
		}> = [];

		for (const user of roomUsers) {
			if (user.lastCursorPos && user.lastCursorUpdate) {
				const timeSinceUpdate = now - user.lastCursorUpdate;
				if (timeSinceUpdate < 10000) {
					cursors.push({
						username: user.username,
						pos: user.lastCursorPos,
						lastSeen: user.lastCursorUpdate,
					});
				}
			}
		}

		if (cursors.length === 0) return;

		for (const user of roomUsers) {
			if (user.ws.readyState !== WebSocket.OPEN) continue;

			const otherCursors = cursors.filter(
				(cursor) => cursor.username !== user.username
			);

			if (otherCursors.length > 0) {
				try {
					user.ws.send(
						JSON.stringify({
							type: "cursors-batch",
							cursors: otherCursors,
						})
					);
				} catch (error) {}
			}
		}
	}, 500);

	roomCursorBroadcasters.set(roomId, interval);
}

function stopCursorBroadcasting(roomId: string) {
	if (roomCursorBroadcasters.has(roomId)) {
		clearInterval(roomCursorBroadcasters.get(roomId)!);
		roomCursorBroadcasters.delete(roomId);
	}
}

const messageHandlers = new MessageHandlers(
	users,
	messagesByRoom,
	historyByRoom,
	redoByRoomUser,
	{ maxHistorySize: config.maxHistorySize },
	startCursorBroadcasting,
	stopCursorBroadcasting,
	wsToUser,
	roomToUsers,
	messagePool
);

wss.on("connection", (ws, req) => {
	const newUrl = new URL(req.url!, `http://${req.headers.host}`);
	const token = newUrl.searchParams.get("token");
	const authflag = newUrl.searchParams.get("authflag");
	if (!token) {
		ws.send("authorisation token is misssing.");
		ws.close();
		return;
	}

	let user: JwtPayload | null = null;
	try {
		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET ?? "duplicate-secret"
		) as JwtPayload;
		if (!payload || typeof payload !== "object" || !("id" in payload)) {
			ws.send("unauthorised, missing required fields.");
			ws.close();
			return;
		}
		user = payload;
		if (authflag) {
			if (authflag === "freehand") {
				ws.send(
					JSON.stringify({
						message: "connected to server.",
						user: payload,
					})
				);
			} else {
				ws.send("invalid authflag.");
				ws.close();
				return;
			}
		} else {
			ws.send(
				JSON.stringify({
					message: "connected to server.",
					user: payload,
				})
			);
		}
	} catch (error) {
		ws.send("invalid token.");
		ws.close();
		return;
	}

	if (user) {
		const newUser = {
			username: user.username,
			userId: user.id,
			ws,
			rooms: [],
		};
		users.push(newUser);

		wsToUser.set(ws, newUser);
	}

	ws.on("message", async (data) => {
		let parsedData: MessageData;
		try {
			parsedData = JSON.parse(data.toString());
			if (!validateMessage(parsedData)) {
				ws.send(
					JSON.stringify({
						type: "error",
						message: "Invalid message format",
					})
				);
				return;
			}
		} catch (error) {
			ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
			return;
		}

		const currentUser = wsToUser.get(ws) || users.find((u) => u.ws === ws);
		if (!currentUser) {
			ws.send(
				JSON.stringify({ type: "error", message: "User not found" })
			);
			return;
		}

		try {
			switch (parsedData.type) {
				case "join-room":
					await messageHandlers.handleJoinRoom(ws, parsedData);
					break;
				case "leave-room":
					await messageHandlers.handleLeaveRoom(ws, parsedData);
					break;
				case "draw-message":
					const userId = parsedData.clientId;
					if (validateUserId(userId)) {
						if (!userBuckets.has(userId)) {
							userBuckets.set(userId, new TokenBucket(10, 20));
						}

						if (!userBuckets.get(userId)!.consume()) {
							return;
						}
					}
					await messageHandlers.handleDrawMessage(ws, parsedData);
					break;
				case "create-message":
					await messageHandlers.handleCreateMessage(ws, parsedData);
					break;
				case "delete-message":
					await messageHandlers.handleDeleteMessage(ws, parsedData);
					break;
				case "update-message":
					await messageHandlers.handleUpdateMessage(ws, parsedData);
					break;
				case "cursor":
					await messageHandlers.handleCursor(ws, parsedData);
					break;
				case "sync-all":
					await messageHandlers.handleSyncAll(ws, parsedData);
					break;
				case "undo":
					await messageHandlers.handleUndo(
						ws,
						parsedData,
						currentUser.userId
					);
					break;
				case "redo":
					await messageHandlers.handleRedo(
						ws,
						parsedData,
						currentUser.userId
					);
					break;
				case "reset-canvas":
					await messageHandlers.handleResetCanvas(ws, parsedData);
					break;
				default:
					ws.send(
						JSON.stringify({
							type: "error",
							message: "Unknown message type",
						})
					);
			}
		} catch (error) {
			Logger.error("Error handling message:", error);
			ws.send(
				JSON.stringify({
					type: "error",
					message: "Internal server error",
				})
			);
		}
	});

	ws.on("close", () => {
		const user = wsToUser.get(ws);
		if (user) {
			Logger.info("User disconnected:", user.userId);

			for (const roomId of user.rooms) {
				const roomUsers = roomToUsers.get(roomId);
				if (roomUsers) {
					roomUsers.delete(user);
					if (roomUsers.size < 2) {
						stopCursorBroadcasting(roomId);
					}
				} else {
					const remainingUsers = users.filter(
						(u) => u !== user && u.rooms.includes(roomId)
					);
					if (remainingUsers.length < 2) {
						stopCursorBroadcasting(roomId);
					}
				}
			}

			const idx = users.findIndex((u) => u.ws === ws);
			if (idx !== -1) {
				users.splice(idx, 1);
			}
			wsToUser.delete(ws);
		}
	});
});

setInterval(() => {
	for (const [roomId, messages] of messagesByRoom.entries()) {
		const hasActiveUsers = roomToUsers.has(roomId)
			? roomToUsers.get(roomId)!.size > 0
			: users.some((user) => user.rooms.includes(roomId));

		if (!hasActiveUsers) {
			messagesByRoom.delete(roomId);
			historyByRoom.delete(roomId);
			redoByRoomUser.delete(roomId);
			roomToUsers.delete(roomId);
			stopCursorBroadcasting(roomId);
			Logger.info(`Cleaned up inactive room: ${roomId}`);
		} else {
			const history = historyByRoom.get(roomId);
			if (history && history.length > config.maxHistorySize) {
				history.splice(0, history.length - config.maxHistorySize);
			}

			const roomUsers = roomToUsers.has(roomId)
				? Array.from(roomToUsers.get(roomId)!)
				: users.filter((user) => user.rooms.includes(roomId));

			if (roomUsers.length >= 2 && !roomCursorBroadcasters.has(roomId)) {
				startCursorBroadcasting(roomId);
			} else if (roomUsers.length < 2) {
				stopCursorBroadcasting(roomId);
			}
		}
	}
}, config.roomCleanupInterval);

setInterval(() => {
	for (let i = users.length - 1; i >= 0; i--) {
		const user = users[i];
		if (!user) continue;

		if (user.ws.readyState === WebSocket.CLOSED) {
			Logger.info("Removing dead connection:", user.userId);

			for (const roomId of user.rooms) {
				const roomUsers = roomToUsers.get(roomId);
				if (roomUsers) {
					roomUsers.delete(user);
				}
			}

			users.splice(i, 1);
			wsToUser.delete(user.ws);
		} else if (user.ws.readyState === WebSocket.OPEN) {
			try {
				user.ws.ping();
			} catch (error) {
				Logger.error(`Failed to ping user ${user.username}:`, error);
			}
		}
	}
}, 30000);

wss.on("listening", () => {
	Logger.info("WebSocket server is listening on port " + config.port);
});

wss.on("error", (error) => {
	Logger.error("WebSocket server error:", error);
});

wss.on("close", () => {
	Logger.info("WebSocket connection closed");
});
