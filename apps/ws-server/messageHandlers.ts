import { WebSocket } from "ws";
import type { User, MessageData, Op } from "./types";
import { validateRoomId, validateUserId } from "./types";
import { createMessage, deleteMessage, updateMessage } from "./server";
import { Logger } from "./logger";

export class MessageHandlers {
	constructor(
		private users: User[],
		private messagesByRoom: Map<string, any[]>,
		private historyByRoom: Map<string, Op[]>,
		private redoByRoomUser: Map<string, Map<string, Op[]>>,
		private config: { maxHistorySize: number },
		private startCursorBroadcasting: (roomId: string) => void,
		private stopCursorBroadcasting: (roomId: string) => void,
		private wsToUser?: WeakMap<WebSocket, User>,
		private roomToUsers?: Map<string, Set<User>>,
		private messagePool?: { acquire(): any; release(obj: any): void }
	) {}

	private findUser(ws: WebSocket): User | undefined {
		return this.wsToUser?.get(ws) || this.users.find((u) => u.ws === ws);
	}

	private getRoomUsers(roomId: string): User[] {
		return this.roomToUsers?.has(roomId)
			? Array.from(this.roomToUsers.get(roomId)!)
			: this.users.filter((user) => user.rooms.includes(roomId));
	}

	private updateRoomMembership(
		user: User,
		roomId: string,
		action: "join" | "leave"
	) {
		if (action === "join") {
			if (this.roomToUsers) {
				if (!this.roomToUsers.has(roomId)) {
					this.roomToUsers.set(roomId, new Set());
				}
				this.roomToUsers.get(roomId)!.add(user);
			}

			if (!user.rooms.includes(roomId)) {
				user.rooms.push(roomId);
			}
		} else {
			if (this.roomToUsers) {
				const roomUsers = this.roomToUsers.get(roomId);
				if (roomUsers) {
					roomUsers.delete(user);
					if (roomUsers.size === 0) {
						this.roomToUsers.delete(roomId);
					}
				}
			}

			const roomIndex = user.rooms.indexOf(roomId);
			if (roomIndex !== -1) {
				user.rooms.splice(roomIndex, 1);
			}
		}
	}

	async handleJoinRoom(ws: WebSocket, data: MessageData) {
		const roomId = data.roomId;
		if (!validateRoomId(roomId)) {
			ws.send(
				JSON.stringify({ type: "error", message: "Invalid roomId" })
			);
			return;
		}

		const user = this.findUser(ws);
		if (!user) {
			ws.send(
				JSON.stringify({ type: "error", message: "User not found" })
			);
			return;
		}

		this.updateRoomMembership(user, roomId, "join");

		if (!this.messagesByRoom.has(roomId))
			this.messagesByRoom.set(roomId, []);
		if (!this.historyByRoom.has(roomId)) this.historyByRoom.set(roomId, []);
		if (!this.redoByRoomUser.has(roomId))
			this.redoByRoomUser.set(roomId, new Map());

		if (data.userRole === "creator" && data.messages) {
			const messages = data.messages;
			this.messagesByRoom.set(roomId, messages);
		}

		const current = this.messagesByRoom.get(roomId) || [];
		ws.send(JSON.stringify({ type: "sync", messages: current }));

		const roomUsers = this.getRoomUsers(roomId);
		if (roomUsers.length >= 2) {
			this.startCursorBroadcasting(roomId);
		}
	}

	async handleLeaveRoom(ws: WebSocket, data: MessageData) {
		const roomId = data.roomId;
		if (!validateRoomId(roomId)) {
			ws.send(
				JSON.stringify({ type: "error", message: "Invalid roomId" })
			);
			return;
		}

		const user = this.findUser(ws);
		if (!user) {
			ws.send(
				JSON.stringify({ type: "error", message: "User not found" })
			);
			return;
		}

		this.updateRoomMembership(user, roomId, "leave");

		const remainingUsers = this.getRoomUsers(roomId);

		if (remainingUsers.length < 2) {
			this.stopCursorBroadcasting(roomId);
		}

		ws.send(
			JSON.stringify({
				type: "leave-room-success",
				roomId: roomId,
			})
		);
	}

	async handleDrawMessage(ws: WebSocket, data: MessageData) {
		const userId = data.clientId;
		const roomId = data.roomId;
		const message = data.message;

		if (!validateUserId(userId)) {
			ws.send(
				JSON.stringify({
					type: "error",
					message: "missing or invalid clientId",
				})
			);
			return;
		}

		if (!validateRoomId(roomId)) {
			ws.send(
				JSON.stringify({
					type: "error",
					message: "missing or invalid roomId",
				})
			);
			return;
		}

		const roomUsers = this.getRoomUsers(roomId);

		let serializedMessage: string;
		if (this.messagePool) {
			const messageObj = this.messagePool.acquire();
			messageObj.type = "draw";
			messageObj.message = message;
			messageObj.clientId = userId;

			serializedMessage = JSON.stringify(messageObj);
			this.messagePool.release(messageObj);
		} else {
			serializedMessage = JSON.stringify({
				type: "draw",
				message,
				clientId: userId,
			});
		}

		for (const user of roomUsers) {
			if (user.ws === ws) continue;
			if (data.flag === "text-preview" && user.ws === ws) continue;

			try {
				if (user.ws.readyState === WebSocket.OPEN) {
					user.ws.send(serializedMessage);
				}
			} catch (err) {}
		}
	}

	async handleCreateMessage(ws: WebSocket, data: MessageData) {
		const message = data.message;
		const roomId = data.roomId;
		const userId = data.clientId;
		const authflag = data.authflag;

		if (!validateUserId(userId)) {
			ws.send(
				JSON.stringify({ type: "error", message: "missing userId" })
			);
			return;
		}

		if (!validateRoomId(roomId)) {
			ws.send(
				JSON.stringify({ type: "error", message: "missing roomId" })
			);
			return;
		}

		if (!this.messagesByRoom.has(roomId))
			this.messagesByRoom.set(roomId, []);
		const roomMsgs = this.messagesByRoom.get(roomId)!;
		roomMsgs.push(message);

		const hist = this.historyByRoom.get(roomId)!;
		hist.push({ type: "create", userId, message });

		if (hist.length > this.config.maxHistorySize) {
			hist.splice(0, hist.length - this.config.maxHistorySize);
		}
		this.historyByRoom.set(roomId, hist);

		const roomRedo = this.redoByRoomUser.get(roomId)!;
		roomRedo.clear();

		const roomUsers = this.getRoomUsers(roomId);

		let serializedMessage: string;
		if (this.messagePool) {
			const messageObj = this.messagePool.acquire();
			messageObj.type = "create";
			messageObj.message = message;
			messageObj.previewId = data.previewId;
			messageObj.authflag = authflag;

			serializedMessage = JSON.stringify(messageObj);
			this.messagePool.release(messageObj);
		} else {
			serializedMessage = JSON.stringify({
				type: "create",
				message: message,
				previewId: data.previewId,
				authflag,
			});
		}

		for (const user of roomUsers) {
			try {
				if (user.ws.readyState === WebSocket.OPEN) {
					user.ws.send(serializedMessage);
				}
			} catch (err) {}
		}

		if (authflag === "freehand") return;
		try {
			await createMessage(message, userId, roomId);
		} catch (error) {
			Logger.error("Failed to persist message:", error);
		}
	}

	async handleDeleteMessage(ws: WebSocket, data: MessageData) {
		const id = data.id;
		const roomId = data.roomId;
		const authflag = data.authflag;

		if (!id) {
			ws.send(JSON.stringify({ type: "error", message: "missing id" }));
			return;
		}

		if (!validateRoomId(roomId)) {
			ws.send(
				JSON.stringify({ type: "error", message: "missing roomId" })
			);
			return;
		}

		if (!this.messagesByRoom.has(roomId))
			this.messagesByRoom.set(roomId, []);
		const roomMsgs = this.messagesByRoom.get(roomId)!;
		const msgIndex = roomMsgs.findIndex((msg) => msg.id === id);

		if (msgIndex !== -1) {
			const deletedMessage = roomMsgs[msgIndex];
			const hist = this.historyByRoom.get(roomId)!;
			hist.push({
				type: "delete",
				userId: data.clientId!,
				message: deletedMessage,
			});

			if (hist.length > this.config.maxHistorySize) {
				hist.splice(0, hist.length - this.config.maxHistorySize);
			}
			this.historyByRoom.set(roomId, hist);

			roomMsgs.splice(msgIndex, 1);

			const roomRedo = this.redoByRoomUser.get(roomId)!;
			roomRedo.clear();

			const roomUsers = this.getRoomUsers(roomId);

			let serializedMessage: string;
			if (this.messagePool) {
				const messageObj = this.messagePool.acquire();
				messageObj.type = "delete";
				messageObj.id = id;
				messageObj.authflag = authflag;

				serializedMessage = JSON.stringify(messageObj);
				this.messagePool.release(messageObj);
			} else {
				serializedMessage = JSON.stringify({
					type: "delete",
					id,
					authflag,
				});
			}

			for (const user of roomUsers) {
				try {
					if (user.ws.readyState === WebSocket.OPEN) {
						user.ws.send(serializedMessage);
					}
				} catch (err) {}
			}

			if (authflag === "freehand") return;
			try {
				await deleteMessage(id);
			} catch (error) {
				Logger.error("Failed to delete message:", error);
			}
		}
	}

	async handleUpdateMessage(ws: WebSocket, data: MessageData) {
		const id = data.id;
		const newMessage = data.newMessage;
		const roomId = data.roomId;
		const flag = data.flag;
		const authflag = data.authflag;

		if (!id || !newMessage) {
			ws.send(
				JSON.stringify({
					type: "error",
					message: "missing id or newMessage",
				})
			);
			return;
		}

		if (!validateRoomId(roomId)) {
			ws.send(
				JSON.stringify({ type: "error", message: "missing roomId" })
			);
			return;
		}

		if (!this.messagesByRoom.has(roomId))
			this.messagesByRoom.set(roomId, []);
		const roomMsgs = this.messagesByRoom.get(roomId)!;
		const msgIndex = roomMsgs.findIndex((msg) => msg.id === id);

		if (msgIndex !== -1) {
			if (!flag) {
				const prevMessage = { ...roomMsgs[msgIndex] };
				roomMsgs[msgIndex] = newMessage;

				const hist = this.historyByRoom.get(roomId)!;
				hist.push({
					type: "update",
					userId: data.clientId!,
					id,
					prevMessage,
					newMessage,
				});

				if (hist.length > this.config.maxHistorySize) {
					hist.splice(0, hist.length - this.config.maxHistorySize);
				}
				this.historyByRoom.set(roomId, hist);

				const roomRedo = this.redoByRoomUser.get(roomId)!;
				roomRedo.clear();
			}

			const roomUsers = this.getRoomUsers(roomId);

			let serializedMessage: string;
			if (this.messagePool) {
				const messageObj = this.messagePool.acquire();
				messageObj.type = "update";
				messageObj.flag = flag;
				messageObj.id = id;
				messageObj.newMessage = newMessage;
				messageObj.clientId = data.clientId;
				messageObj.authflag = authflag;

				serializedMessage = JSON.stringify(messageObj);
				this.messagePool.release(messageObj);
			} else {
				serializedMessage = JSON.stringify({
					type: "update",
					flag,
					id,
					newMessage,
					clientId: data.clientId,
					authflag,
				});
			}

			for (const user of roomUsers) {
				try {
					if (user.ws.readyState === WebSocket.OPEN) {
						user.ws.send(serializedMessage);
					}
				} catch (err) {}
			}

			if (!flag && authflag !== "freehand") {
				try {
					await updateMessage(id, newMessage);
				} catch (error) {
					Logger.error("Failed to update message:", error);
				}
			}

			if (authflag === "freehand") return;
			if (!flag) {
				try {
					await updateMessage(newMessage, id);
				} catch (error) {
					Logger.error("Failed to update message:", error);
				}
			}
		}
	}

	async handleCursor(ws: WebSocket, data: MessageData) {
		const roomId = data.roomId;
		const username = data.username;
		const pos = data.pos;

		if (!validateRoomId(roomId)) {
			ws.send(
				JSON.stringify({ type: "error", message: "missing roomId" })
			);
			return;
		}

		for (let user of this.users) {
			if (user.ws === ws) {
				user.lastCursorPos = pos;
				user.lastCursorUpdate = Date.now();
				break;
			}
		}
	}

	async handleSyncAll(ws: WebSocket, data: MessageData) {
		const roomId = data.roomId;
		const messages = data.messages;

		if (!validateRoomId(roomId)) {
			ws.send(
				JSON.stringify({
					type: "error",
					message: "missing roomId",
				})
			);
			return;
		}

		if (messages) {
			this.messagesByRoom.set(roomId, messages);
		}

		const current = this.messagesByRoom.get(roomId) || [];

		for (let user of this.users) {
			if (user.rooms.includes(roomId)) {
				try {
					user.ws.send(
						JSON.stringify({
							type: "sync",
							messages: current,
						})
					);
				} catch (err) {}
			}
		}
	}

	async handleUndo(ws: WebSocket, data: MessageData, userId: string) {
		const roomId = data.roomId;

		if (!validateRoomId(roomId)) {
			ws.send(
				JSON.stringify({ type: "error", message: "missing roomId" })
			);
			return;
		}

		const hist = this.historyByRoom.get(roomId) || [];
		const userOps = hist.filter((op) => op.userId === userId);

		if (userOps.length === 0) return;

		const lastOp = userOps[userOps.length - 1];
		if (!lastOp) return;

		const lastOpIndex = hist.lastIndexOf(lastOp);

		hist.splice(lastOpIndex, 1);

		const roomRedo = this.redoByRoomUser.get(roomId)!;
		if (!roomRedo.has(userId)) roomRedo.set(userId, []);
		const userRedo = roomRedo.get(userId)!;
		userRedo.push(lastOp);

		const roomMsgs = this.messagesByRoom.get(roomId)!;

		if (lastOp.type === "create") {
			const msgIndex = roomMsgs.findIndex(
				(msg) => msg.id === lastOp.message.id
			);
			if (msgIndex !== -1) {
				roomMsgs.splice(msgIndex, 1);
				for (let user of this.users) {
					if (user.rooms.includes(roomId)) {
						try {
							user.ws.send(
								JSON.stringify({
									type: "delete",
									id: lastOp.message.id,
								})
							);
						} catch (err) {}
					}
				}
			}
		} else if (lastOp.type === "delete") {
			roomMsgs.push(lastOp.message);
			for (let user of this.users) {
				if (user.rooms.includes(roomId)) {
					try {
						user.ws.send(
							JSON.stringify({
								type: "create",
								message: lastOp.message,
							})
						);
					} catch (err) {}
				}
			}
		} else if (lastOp.type === "update") {
			const msgIndex = roomMsgs.findIndex((msg) => msg.id === lastOp.id);
			if (msgIndex !== -1) {
				roomMsgs[msgIndex] = lastOp.prevMessage;
				for (let user of this.users) {
					if (user.rooms.includes(roomId)) {
						try {
							user.ws.send(
								JSON.stringify({
									type: "update",
									id: lastOp.id,
									newMessage: lastOp.prevMessage,
								})
							);
						} catch (err) {}
					}
				}
			}
		}
	}

	async handleRedo(ws: WebSocket, data: MessageData, userId: string) {
		const roomId = data.roomId;

		if (!validateRoomId(roomId)) {
			ws.send(
				JSON.stringify({ type: "error", message: "missing roomId" })
			);
			return;
		}

		const roomRedo = this.redoByRoomUser.get(roomId)!;
		const userRedo = roomRedo.get(userId) || [];

		if (userRedo.length === 0) return;

		const opToRedo = userRedo.pop();
		if (!opToRedo) return;

		const hist = this.historyByRoom.get(roomId)!;
		hist.push(opToRedo);

		const roomMsgs = this.messagesByRoom.get(roomId)!;

		if (opToRedo.type === "create") {
			roomMsgs.push(opToRedo.message);
			for (let user of this.users) {
				if (user.rooms.includes(roomId)) {
					try {
						user.ws.send(
							JSON.stringify({
								type: "create",
								message: opToRedo.message,
							})
						);
					} catch (err) {}
				}
			}
		} else if (opToRedo.type === "delete") {
			const msgIndex = roomMsgs.findIndex(
				(msg) => msg.id === opToRedo.message.id
			);
			if (msgIndex !== -1) {
				roomMsgs.splice(msgIndex, 1);
				for (let user of this.users) {
					if (user.rooms.includes(roomId)) {
						try {
							user.ws.send(
								JSON.stringify({
									type: "delete",
									id: opToRedo.message.id,
								})
							);
						} catch (err) {}
					}
				}
			}
		} else if (opToRedo.type === "update") {
			const msgIndex = roomMsgs.findIndex(
				(msg) => msg.id === opToRedo.id
			);
			if (msgIndex !== -1) {
				roomMsgs[msgIndex] = opToRedo.newMessage;
				for (let user of this.users) {
					if (user.rooms.includes(roomId)) {
						try {
							user.ws.send(
								JSON.stringify({
									type: "update",
									id: opToRedo.id,
									newMessage: opToRedo.newMessage,
								})
							);
						} catch (err) {}
					}
				}
			}
		}
	}

	async handleResetCanvas(ws: WebSocket, data: MessageData) {
		const roomId = data.roomId;

		if (!validateRoomId(roomId)) {
			ws.send(
				JSON.stringify({ type: "error", message: "missing roomId" })
			);
			return;
		}

		this.messagesByRoom.set(roomId, []);
		this.historyByRoom.set(roomId, []);
		this.redoByRoomUser.set(roomId, new Map());

		for (let user of this.users) {
			if (user.rooms.includes(roomId)) {
				try {
					user.ws.send(JSON.stringify({ type: "reset-canvas" }));
				} catch (err) {}
			}
		}
	}
}
