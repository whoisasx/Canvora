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

// Create HTTP server for health checks
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
				uptime: process.uptime(),
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

// Configuration
const config: ServerConfig = {
	port: process.env.PORT ? Number(process.env.PORT) : 8080,
	jwtSecret: process.env.JWT_SECRET || "duplicate-secret",
	baseUrl: process.env.BASE_URL || "http://localhost:3000",
	drawThrottleMs: Number(process.env.DRAW_THROTTLE_MS) || 100,
	maxHistorySize: Number(process.env.MAX_HISTORY_SIZE) || 1000,
	roomCleanupInterval: 30 * 60 * 1000, // 30 minutes
};

const users: User[] = [];
const messagesByRoom = new Map<string, any[]>();
const historyByRoom = new Map<string, Op[]>();
const redoByRoomUser = new Map<string, Map<string, Op[]>>();

// Add throttling for draw messages
const userThrottles = new Map<string, number>();

// Cursor broadcasting system
const roomCursorBroadcasters = new Map<string, NodeJS.Timeout>();

// Cursor broadcasting functions
function startCursorBroadcasting(roomId: string) {
	// Clear existing interval if any
	if (roomCursorBroadcasters.has(roomId)) {
		clearInterval(roomCursorBroadcasters.get(roomId)!);
	}

	const interval = setInterval(() => {
		const roomUsers = users.filter((user) => user.rooms.includes(roomId));

		// Only broadcast if there are multiple users in the room
		if (roomUsers.length <= 1) return;

		// Collect all cursor positions for this room
		const cursors: Array<{
			username: string;
			pos: { x: number; y: number };
			lastSeen: number;
		}> = [];

		for (const user of roomUsers) {
			if (user.lastCursorPos && user.lastCursorUpdate) {
				// Only include recent cursor positions (within last 10 seconds)
				const timeSinceUpdate = Date.now() - user.lastCursorUpdate;
				if (timeSinceUpdate < 10000) {
					cursors.push({
						username: user.username,
						pos: user.lastCursorPos,
						lastSeen: user.lastCursorUpdate,
					});
				}
			}
		}

		// Broadcast to each user (excluding their own cursor)
		for (const user of roomUsers) {
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
				} catch (error) {
					// Handle send errors silently
				}
			}
		}
	}, 500); // Broadcast every 500ms

	roomCursorBroadcasters.set(roomId, interval);
}

function stopCursorBroadcasting(roomId: string) {
	if (roomCursorBroadcasters.has(roomId)) {
		clearInterval(roomCursorBroadcasters.get(roomId)!);
		roomCursorBroadcasters.delete(roomId);
	}
}

// Initialize message handlers
const messageHandlers = new MessageHandlers(
	users,
	messagesByRoom,
	historyByRoom,
	redoByRoomUser,
	{ maxHistorySize: config.maxHistorySize },
	startCursorBroadcasting,
	stopCursorBroadcasting
);

wss.on("connection", (ws, req) => {
	const newUrl = new URL(req.url!, `http://${req.headers.host}`);
	const token = newUrl.searchParams.get("token");
	const authflag = newUrl.searchParams.get("authflag");
	const roomId = newUrl.searchParams.get("roomId");
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
				if (!roomId) {
					ws.send("invalid roomId.");
					ws.close();
					return;
				} else {
					if (roomId in messagesByRoom) {
						ws.send(
							JSON.stringify({
								message: "connected to server.",
								user: payload,
							})
						);
					} else {
						ws.send("invalid roomId.");
						ws.close();
						return;
					}
				}
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
		users.push({
			username: user.username,
			userId: user.id,
			ws,
			rooms: [],
		});
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

		// Get current user
		const currentUser = users.find((u) => u.ws === ws);
		if (!currentUser) {
			ws.send(
				JSON.stringify({ type: "error", message: "User not found" })
			);
			return;
		}

		// Route messages to appropriate handlers
		try {
			switch (parsedData.type) {
				case "join-room":
					await messageHandlers.handleJoinRoom(ws, parsedData);
					break;
				case "leave-room":
					await messageHandlers.handleLeaveRoom(ws, parsedData);
					break;
				case "draw-message":
					// Add throttling for draw messages
					const userId = parsedData.clientId;
					if (validateUserId(userId)) {
						const now = Date.now();
						const lastSent = userThrottles.get(userId) || 0;
						if (now - lastSent < config.drawThrottleMs) {
							return; // Skip this message
						}
						userThrottles.set(userId, now);
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
		// Remove user from users list
		const idx = users.findIndex((u) => u.ws === ws);
		if (idx !== -1) {
			const user = users[idx];
			if (user) {
				Logger.info("User disconnected:", user.userId);

				// Check if any rooms need cursor broadcasting updates
				for (const roomId of user.rooms) {
					const remainingUsers = users.filter(
						(u) => u !== user && u.rooms.includes(roomId)
					);
					if (remainingUsers.length < 2) {
						stopCursorBroadcasting(roomId);
					}
				}
			}
			users.splice(idx, 1);
		}
	});
});

// Add memory management and cleanup
setInterval(() => {
	for (const [roomId, messages] of messagesByRoom.entries()) {
		const hasActiveUsers = users.some((user) =>
			user.rooms.includes(roomId)
		);

		if (!hasActiveUsers) {
			// Clean up empty rooms after some time
			messagesByRoom.delete(roomId);
			historyByRoom.delete(roomId);
			redoByRoomUser.delete(roomId);
			stopCursorBroadcasting(roomId); // Stop cursor broadcasting
			Logger.info(`Cleaned up inactive room: ${roomId}`);
		} else {
			// Limit history size
			const history = historyByRoom.get(roomId);
			if (history && history.length > config.maxHistorySize) {
				history.splice(0, history.length - config.maxHistorySize);
			}

			// Start cursor broadcasting if multiple users
			const roomUsers = users.filter((user) =>
				user.rooms.includes(roomId)
			);
			if (roomUsers.length >= 2 && !roomCursorBroadcasters.has(roomId)) {
				startCursorBroadcasting(roomId);
			} else if (roomUsers.length < 2) {
				stopCursorBroadcasting(roomId);
			}
		}
	}
}, config.roomCleanupInterval);

// Add connection health monitoring
setInterval(() => {
	users.forEach((user, index) => {
		if (user.ws.readyState === WebSocket.CLOSED) {
			Logger.info("Removing dead connection:", user.userId);
			users.splice(index, 1);
		} else if (user.ws.readyState === WebSocket.OPEN) {
			// Send ping to check connection
			try {
				user.ws.ping();
			} catch (error) {
				Logger.error(`Failed to ping user ${user.username}:`, error);
			}
		}
	});
}, 30000); // Check every 30 seconds

// Utility events
wss.on("listening", () => {
	Logger.info("WebSocket server is listening on port " + config.port);
});

wss.on("error", (error) => {
	Logger.error("WebSocket server error:", error);
});

wss.on("close", () => {
	Logger.info("WebSocket connection closed");
});
