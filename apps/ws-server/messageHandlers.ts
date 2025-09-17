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
		private stopCursorBroadcasting: (roomId: string) => void
	) {}

	async handleJoinRoom(ws: WebSocket, data: MessageData) {
		const roomId = data.roomId;
		if (!validateRoomId(roomId)) {
			ws.send(
				JSON.stringify({ type: "error", message: "Invalid roomId" })
			);
			return;
		}

		for (let user of this.users) {
			if (user.ws === ws) {
				if (!user.rooms.includes(roomId)) {
					user.rooms.push(roomId);
				}
			}
		}

		// Initialize room structures
		if (!this.messagesByRoom.has(roomId))
			this.messagesByRoom.set(roomId, []);
		if (!this.historyByRoom.has(roomId)) this.historyByRoom.set(roomId, []);
		if (!this.redoByRoomUser.has(roomId))
			this.redoByRoomUser.set(roomId, new Map());

		if (data.userRole === "creator") {
			const messages = data.messages;
			this.messagesByRoom.set(roomId, messages ? messages : []);
		}
		const current = this.messagesByRoom.get(roomId) || [];
		ws.send(JSON.stringify({ type: "sync", messages: current }));

		// Start cursor broadcasting for this room if multiple users
		const roomUsers = this.users.filter((user) =>
			user.rooms.includes(roomId)
		);
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

		for (let user of this.users) {
			if (user.ws === ws) {
				user.rooms = user.rooms.filter((room) => room !== roomId);
			}
		}
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

		// Send to other users, not back to sender
		for (let user of this.users) {
			if (user.ws === ws) {
				console.log("user");
				continue;
			}
			if (user.rooms.includes(roomId) && user.ws !== ws) {
				try {
					if (data.flag === "text-preview" && user.ws === ws)
						continue;
					user.ws.send(
						JSON.stringify({
							type: "draw",
							message,
							clientId: userId,
						})
					);
				} catch (err) {
					// ignore send errors
				}
			}
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

		// Add to history for undo/redo
		const hist = this.historyByRoom.get(roomId)!;
		hist.push({ type: "create", userId, message });

		// Limit history size
		if (hist.length > this.config.maxHistorySize) {
			hist.splice(0, hist.length - this.config.maxHistorySize);
		}
		this.historyByRoom.set(roomId, hist);

		// Clear redo stacks when new action is performed
		const roomRedo = this.redoByRoomUser.get(roomId)!;
		roomRedo.clear();

		// Broadcast to all users in the room
		for (let user of this.users) {
			if (user.rooms.includes(roomId)) {
				try {
					user.ws.send(
						JSON.stringify({
							type: "create",
							message: message,
							previewId: data.previewId,
							authflag,
						})
					);
				} catch (err) {
					// ignore send errors
				}
			}
		}

		if (authflag === "freehand") return;
		// Persist to database
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

			// Limit history size
			if (hist.length > this.config.maxHistorySize) {
				hist.splice(0, hist.length - this.config.maxHistorySize);
			}
			this.historyByRoom.set(roomId, hist);

			roomMsgs.splice(msgIndex, 1);

			// Clear redo stacks
			const roomRedo = this.redoByRoomUser.get(roomId)!;
			roomRedo.clear();

			// Broadcast to all users in the room
			for (let user of this.users) {
				if (user.rooms.includes(roomId)) {
					try {
						user.ws.send(
							JSON.stringify({ type: "delete", id, authflag })
						);
					} catch (err) {
						// ignore send errors
					}
				}
			}

			if (authflag === "freehand") return;
			// Persist to database
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
			//only if preview flag is not there.
			if (!flag) {
				const prevMessage = { ...roomMsgs[msgIndex] };
				roomMsgs[msgIndex] = newMessage;

				// Add to history
				const hist = this.historyByRoom.get(roomId)!;
				hist.push({
					type: "update",
					userId: data.clientId!,
					id,
					prevMessage,
					newMessage,
				});

				// Limit history size
				if (hist.length > this.config.maxHistorySize) {
					hist.splice(0, hist.length - this.config.maxHistorySize);
				}
				this.historyByRoom.set(roomId, hist);

				// Clear redo stacks
				const roomRedo = this.redoByRoomUser.get(roomId)!;
				roomRedo.clear();
			}

			// Broadcast to all users in the room
			for (let user of this.users) {
				if (user.rooms.includes(roomId)) {
					try {
						user.ws.send(
							JSON.stringify({
								type: "update",
								flag,
								id,
								newMessage,
								clientId: data.clientId,
								authflag,
							})
						);
					} catch (err) {
						// ignore send errors
					}
				}
			}

			if (authflag === "freehand") return;
			// Persist to database
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

		// Update user's cursor position in memory
		for (let user of this.users) {
			if (user.ws === ws) {
				user.lastCursorPos = pos;
				user.lastCursorUpdate = Date.now();
				break;
			}
		}

		// Note: No immediate broadcasting here - the interval will handle it
	}

	async handleSyncAll(ws: WebSocket, data: MessageData) {
		const roomId = data.roomId;

		if (!validateRoomId(roomId)) {
			ws.send(
				JSON.stringify({
					type: "error",
					message: "missing roomId",
				})
			);
			return;
		}

		const current = this.messagesByRoom.get(roomId) || [];
		ws.send(
			JSON.stringify({
				type: "sync",
				messages: current,
			})
		);
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

		// Remove from history
		hist.splice(lastOpIndex, 1);

		// Add to redo stack
		const roomRedo = this.redoByRoomUser.get(roomId)!;
		if (!roomRedo.has(userId)) roomRedo.set(userId, []);
		const userRedo = roomRedo.get(userId)!;
		userRedo.push(lastOp);

		// Apply the undo operation
		const roomMsgs = this.messagesByRoom.get(roomId)!;

		if (lastOp.type === "create") {
			const msgIndex = roomMsgs.findIndex(
				(msg) => msg.id === lastOp.message.id
			);
			if (msgIndex !== -1) {
				roomMsgs.splice(msgIndex, 1);
				// Broadcast delete
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
			// Broadcast create
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
				// Broadcast update
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

		// Add back to history
		const hist = this.historyByRoom.get(roomId)!;
		hist.push(opToRedo);

		// Apply the redo operation
		const roomMsgs = this.messagesByRoom.get(roomId)!;

		if (opToRedo.type === "create") {
			roomMsgs.push(opToRedo.message);
			// Broadcast create
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
				// Broadcast delete
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
				// Broadcast update
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

		// Clear all messages for the room
		this.messagesByRoom.set(roomId, []);
		this.historyByRoom.set(roomId, []);
		this.redoByRoomUser.set(roomId, new Map());

		// Broadcast reset to all users in the room
		for (let user of this.users) {
			if (user.rooms.includes(roomId)) {
				try {
					user.ws.send(JSON.stringify({ type: "reset-canvas" }));
				} catch (err) {
					// ignore send errors
				}
			}
		}
	}
}
