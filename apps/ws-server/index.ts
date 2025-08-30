import WebSocket, { WebSocketServer } from "ws";
import jwt, { type JwtPayload } from "jsonwebtoken";

const wss = new WebSocketServer({
	port: 8080,
	host: "localhost",
	clientTracking: true,
});

interface User {
	username: string;
	userId: string;
	ws: WebSocket;
	rooms: string[];
}
const users: User[] = [];

const messagesByRoom = new Map<string, any[]>();
type Op =
	| { type: "create"; userId: string; message: any }
	| { type: "delete"; userId: string; message: any }
	| {
			type: "update";
			userId: string;
			id: string;
			prevMessage: any;
			newMessage: any;
	  };
type OpWithIndex = Op & { index?: number };
const historyByRoom = new Map<string, Op[]>();
const redoByRoomUser = new Map<string, Map<string, Op[]>>();

wss.on("connection", (ws, req) => {
	const newUrl = new URL(req.url!, `http://${req.headers.host}`);
	const token = newUrl.searchParams.get("token");
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
		ws.send(
			JSON.stringify({
				message: "connected to server.",
				user: payload,
			})
		);
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
		const parsedData = JSON.parse(data.toString());

		if (parsedData.type === "join-room") {
			const roomId = parsedData.roomId;
			for (let user of users) {
				if (user.ws === ws) {
					user.rooms.push(roomId);
				}
			}
			// ensure room structures exist
			if (!messagesByRoom.has(roomId)) messagesByRoom.set(roomId, []);
			if (!historyByRoom.has(roomId)) historyByRoom.set(roomId, []);
			if (!redoByRoomUser.has(roomId))
				redoByRoomUser.set(roomId, new Map());

			// send current room state to the joining client
			const current = messagesByRoom.get(roomId) || [];
			ws.send(
				JSON.stringify({
					type: "sync",
					messages: current,
				})
			);
		}

		if (parsedData.type === "leave-room") {
			const roomId = parsedData.roomId;
			for (let user of users) {
				if (user.ws == ws) {
					user.rooms = user.rooms.filter((room) => room != roomId);
				}
			}
		}

		if (parsedData.type === "draw-message") {
			const roomId = parsedData.roomId;
			const message = parsedData.message;
			const userId = parsedData.clientId;
			if (!userId) {
				try {
					ws.send(
						JSON.stringify({
							type: "error",
							message: "missing clientId",
						})
					);
				} catch (err) {}
				return;
			}

			for (let user of users) {
				if (user.rooms.includes(roomId)) {
					try {
						user.ws.send(
							JSON.stringify({
								type: "draw",
								message,
							})
						);
					} catch (err) {
						// ignore send errors
					}
				}
			}
		}

		if (parsedData.type === "create-message") {
			const message = parsedData.message;
			const roomId = parsedData.roomId;
			const userId = parsedData.clientId;
			// require userId
			if (!userId) {
				try {
					ws.send(
						JSON.stringify({
							type: "error",
							message: "missing clientId",
						})
					);
				} catch (err) {}
				return;
			}

			// persist on server and record op
			if (!messagesByRoom.has(roomId)) messagesByRoom.set(roomId, []);
			const roomMsgs = messagesByRoom.get(roomId)!;
			const index = roomMsgs.length;
			roomMsgs.push(message);

			const hist = historyByRoom.get(roomId)!;
			const op: OpWithIndex = {
				type: "create",
				userId,
				message,
				index,
			} as OpWithIndex;
			hist.push(op);
			historyByRoom.set(roomId, hist);

			// clear redo for this user
			const roomRedo = redoByRoomUser.get(roomId)!;
			roomRedo.set(userId, []);

			// broadcast create event to all clients in room
			for (let user of users) {
				if (user.rooms.includes(roomId)) {
					try {
						user.ws.send(
							JSON.stringify({
								type: "create",
								message,
								previewId: parsedData.previewId,
							})
						);
					} catch (err) {
						// ignore send errors
					}
				}
			}
		}

		if (parsedData.type === "delete-message") {
			const id = parsedData.id;
			const roomId = parsedData.roomId;
			const userId = parsedData.clientId;

			if (!userId) {
				try {
					ws.send(
						JSON.stringify({
							type: "error",
							message: "missing clientId",
						})
					);
				} catch (err) {}
				return;
			}
			if (!messagesByRoom.has(roomId)) messagesByRoom.set(roomId, []);
			const roomMsgs = messagesByRoom.get(roomId)!;
			const idx = roomMsgs.findIndex((m: any) => m.id === id);
			if (idx !== -1) {
				const removed = roomMsgs.splice(idx, 1)[0];
				const hist = historyByRoom.get(roomId)!;
				const op: OpWithIndex = {
					type: "delete",
					userId,
					message: removed,
					index: idx,
				} as OpWithIndex;
				hist.push(op);
				historyByRoom.set(roomId, hist);

				// clear redo for this user
				const roomRedo = redoByRoomUser.get(roomId)!;
				roomRedo.set(userId, []);
			}

			for (let user of users) {
				if (user.rooms.includes(roomId)) {
					try {
						user.ws.send(
							JSON.stringify({
								type: "delete",
								id,
							})
						);
					} catch (err) {
						// ignore
					}
				}
			}
		}

		if (parsedData.type === "update-message") {
			const id = parsedData.id;
			const newMessage = parsedData.newMessage;
			const roomId = parsedData.roomId;
			const userId = parsedData.clientId;

			if (!userId) {
				try {
					ws.send(
						JSON.stringify({
							type: "error",
							message: "missing clientId",
						})
					);
				} catch (err) {}
				return;
			}
			if (!messagesByRoom.has(roomId)) messagesByRoom.set(roomId, []);
			const roomMsgs = messagesByRoom.get(roomId)!;
			const idx = roomMsgs.findIndex((m: any) => m.id === id);
			if (idx !== -1) {
				const prev = JSON.parse(JSON.stringify(roomMsgs[idx]));
				roomMsgs[idx] = newMessage;
				const hist = historyByRoom.get(roomId)!;
				const op: OpWithIndex = {
					type: "update",
					userId,
					id,
					prevMessage: prev,
					newMessage,
				} as OpWithIndex;
				hist.push(op);
				historyByRoom.set(roomId, hist);

				// clear redo for this user
				const roomRedo = redoByRoomUser.get(roomId)!;
				roomRedo.set(userId, []);
			}

			for (let user of users) {
				if (user.rooms.includes(roomId)) {
					try {
						user.ws.send(
							JSON.stringify({
								type: "update",
								id,
								newMessage,
							})
						);
					} catch (err) {
						// ignore
					}
				}
			}
		}

		if (parsedData.type === "cursor") {
			const username = parsedData.username;
			const pos = parsedData.pos;
			const roomId = parsedData.roomId;

			for (let u of users) {
				// don't echo back to sender
				if (u.ws === ws) continue;
				if (u.rooms.includes(roomId)) {
					try {
						u.ws.send(
							JSON.stringify({
								type: "cursor",
								username,
								pos,
							})
						);
					} catch (err) {
						// ignore
					}
				}
			}
		}

		if (parsedData.type === "sync-all") {
			const messages = parsedData.messages;
			const roomId = parsedData.roomId;
			// // persist incoming authoritative state and snapshot for undo
			// if (!messagesByRoom.has(roomId)) messagesByRoom.set(roomId, []);
			// const roomMsgs = messagesByRoom.get(roomId)!;
			// const hist = historyByRoom.get(roomId) || [];
			// hist.push(JSON.parse(JSON.stringify(roomMsgs)));
			// historyByRoom.set(roomId, hist);
			// // clear redo stack on new operation
			// redoByRoom.set(roomId, []);
			// messagesByRoom.set(
			// 	roomId,
			// 	JSON.parse(JSON.stringify(messages || []))
			// );

			for (let u of users) {
				if (u.rooms.includes(roomId)) {
					try {
						u.ws.send(
							JSON.stringify({
								type: "sync",
								messages,
							})
						);
					} catch (err) {
						// ignore
					}
				}
			}
		}
		// server-side undo/redo handlers (per-user)
		if (parsedData.type === "undo") {
			const roomId = parsedData.roomId;
			const userId = parsedData.clientId;
			if (!messagesByRoom.has(roomId)) messagesByRoom.set(roomId, []);
			if (!historyByRoom.has(roomId)) historyByRoom.set(roomId, []);
			if (!redoByRoomUser.has(roomId))
				redoByRoomUser.set(roomId, new Map());

			const hist = historyByRoom.get(roomId)!;
			const roomMsgs = messagesByRoom.get(roomId)!;
			if (!userId) {
				try {
					ws.send(JSON.stringify({ type: "undo-empty", roomId }));
				} catch (err) {}
				return;
			}

			// find last op by this user
			let idx = -1;
			for (let i = hist.length - 1; i >= 0; i--) {
				if ((hist[i] as any).userId === userId) {
					idx = i;
					break;
				}
			}
			if (idx === -1) {
				try {
					ws.send(JSON.stringify({ type: "undo-empty", roomId }));
				} catch (err) {}
				return;
			}

			const op = hist.splice(idx, 1)[0] as OpWithIndex | undefined;
			historyByRoom.set(roomId, hist);

			// push to this user's redo stack
			if (!op) {
				try {
					ws.send(JSON.stringify({ type: "undo-empty", roomId }));
				} catch (err) {}
				return;
			}

			const roomRedo = redoByRoomUser.get(roomId)!;
			const userRedo = roomRedo.get(userId) || [];
			userRedo.push(op);
			roomRedo.set(userId, userRedo);

			// apply inverse
			if (op.type === "create") {
				// remove the created message by id
				const mid = (op as any).message.id;
				const i = roomMsgs.findIndex((m: any) => m.id === mid);
				if (i !== -1) roomMsgs.splice(i, 1);
			} else if (op.type === "delete") {
				// re-insert at original index
				const insertAt = (op as OpWithIndex).index ?? roomMsgs.length;
				roomMsgs.splice(insertAt, 0, (op as any).message);
			} else if (op.type === "update") {
				const up = op as any;
				const i = roomMsgs.findIndex((m: any) => m.id === up.id);
				if (i !== -1) roomMsgs[i] = up.prevMessage;
			}

			// broadcast new state
			for (let u of users) {
				if (u.rooms.includes(roomId)) {
					try {
						u.ws.send(
							JSON.stringify({
								type: "sync",
								messages: roomMsgs,
								flag: "undo",
								userId,
							})
						);
					} catch (err) {}
				}
			}
		}

		if (parsedData.type === "redo") {
			const roomId = parsedData.roomId;
			const userId = parsedData.clientId;
			if (!messagesByRoom.has(roomId)) messagesByRoom.set(roomId, []);
			if (!historyByRoom.has(roomId)) historyByRoom.set(roomId, []);
			if (!redoByRoomUser.has(roomId))
				redoByRoomUser.set(roomId, new Map());

			const hist = historyByRoom.get(roomId)!;
			const roomMsgs = messagesByRoom.get(roomId)!;
			if (!userId) {
				try {
					ws.send(JSON.stringify({ type: "redo-empty", roomId }));
				} catch (err) {}
				return;
			}

			const roomRedo = redoByRoomUser.get(roomId)!;
			const userRedo = roomRedo.get(userId) || [];
			if (userRedo.length === 0) {
				try {
					ws.send(JSON.stringify({ type: "redo-empty", roomId }));
				} catch (err) {}
				return;
			}

			const op = userRedo.pop()!;
			roomRedo.set(userId, userRedo);

			// re-apply op and push back to history
			hist.push(op);
			historyByRoom.set(roomId, hist);

			if (op.type === "create") {
				const insAt = (op as any).index ?? roomMsgs.length;
				roomMsgs.splice(insAt, 0, (op as any).message);
			} else if (op.type === "delete") {
				const mid = (op as any).message.id;
				const i = roomMsgs.findIndex((m: any) => m.id === mid);
				if (i !== -1) roomMsgs.splice(i, 1);
			} else if (op.type === "update") {
				const up = op as any;
				const i = roomMsgs.findIndex((m: any) => m.id === up.id);
				if (i !== -1) roomMsgs[i] = up.newMessage;
			}

			for (let u of users) {
				if (u.rooms.includes(roomId)) {
					try {
						u.ws.send(
							JSON.stringify({
								type: "sync",
								messages: roomMsgs,
								flag: "redo",
								userId,
							})
						);
					} catch (err) {}
				}
			}
		}
	});

	ws.on("close", () => {
		// remove user from users list
		const idx = users.findIndex((u) => u.ws === ws);
		if (idx !== -1) users.splice(idx, 1);
		console.log("client disconnected.");
	});
});

// utility events
wss.on("listening", () => {
	console.log("websocket server is listening.");
});
wss.on("error", (error) => {
	console.error("server error: ", error);
});
wss.on("close", () => {
	console.log("connection closed");
});
