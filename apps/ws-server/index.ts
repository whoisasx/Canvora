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
		}

		if (parsedData.type === "leave-room") {
			const roomId = parsedData.roomId;
			for (let user of users) {
				if (user.ws == ws) {
					user.rooms = user.rooms.filter((room) => room != roomId);
				}
			}
		}

		if (parsedData.type === "shape") {
			const message = parsedData.message;
			const roomId = parsedData.roomId;
			for (let user of users) {
				for (let room of user.rooms) {
					if (room == roomId) {
						user.ws.send(
							JSON.stringify({
								type: "shape",
								message,
							})
						);
					}
				}
			}
		}

		if (parsedData.type === "delete-message") {
			const id = parsedData.id;
			const roomId = parsedData.roomId;
			for (let user of users) {
				for (let room of user.rooms) {
					if (room == roomId) {
						user.ws.send(
							JSON.stringify({
								type: "delete",
								id,
							})
						);
					}
				}
			}
		}

		if (parsedData.type === "update-message") {
			const id = parsedData.id;
			const newMessage = parsedData.newMessage;
			const roomId = parsedData.roomId;
			for (let user of users) {
				for (let room of user.rooms) {
					if (room == roomId) {
						user.ws.send(
							JSON.stringify({
								type: "update",
								id,
								newMessage,
							})
						);
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
					u.ws.send(
						JSON.stringify({
							type: "cursor",
							username,
							pos,
						})
					);
				}
			}
		}

		if (parsedData.type === "sync-all") {
			const messages = parsedData.messages;
			const roomId = parsedData.roomId;
			for (let u of users) {
				if (u.rooms.includes(roomId)) {
					u.ws.send(
						JSON.stringify({
							type: "sync",
							messages,
							socket: parsedData.socket,
							flag: parsedData.flag,
						})
					);
				}
			}
		}
	});

	ws.on("close", () => {
		console.log("client disconneted.");
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
