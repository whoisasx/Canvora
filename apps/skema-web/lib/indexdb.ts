import { Message } from "@/app/draw/draw";
import { openDB } from "idb";
import type { IDBPDatabase } from "idb";

interface CanvoraChatsDB {
	chats: {
		id: string;
		message: Message;
		createdAt: number;
		updatedAt: number;
	};
}

interface CanvoraSessionsDB {
	sessions: {
		id: string;
		data: {
			id: string;
			message: Message;
			createdAt: number;
			updatedAt: number;
		}[];
	};
}

type StoredMessage = CanvoraChatsDB["chats"];
export type StoredSession = CanvoraSessionsDB["sessions"];

export class IndexDB {
	private DB_NAME: string = "canvora-chats-db";
	private version: number = 1;
	public storeName: keyof CanvoraChatsDB = "chats";
	private db!: IDBPDatabase<CanvoraChatsDB>;
	private dbReady: Promise<void>;

	constructor() {
		this.dbReady = this.initDB();
	}

	private async initDB(): Promise<void> {
		try {
			this.db = await openDB<CanvoraChatsDB>(this.DB_NAME, this.version, {
				upgrade: (db) => {
					if (!db.objectStoreNames.contains("chats")) {
						db.createObjectStore("chats", { keyPath: "id" });
					}
				},
			});
		} catch (error) {
			console.error("Failed to initialize IndexedDB:", error);
		}
	}

	async addMessage(message: Message): Promise<void> {
		const wholeMessage = {
			id: message.id,
			message: message,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		await this.dbReady;
		try {
			await this.db.add(this.storeName, wholeMessage);
		} catch (error) {
			console.error("Failed to add message:", error);
		}
	}

	async deleteMessage(id: string): Promise<void> {
		await this.dbReady;
		try {
			await this.db.delete(this.storeName, id);
		} catch (error) {
			console.error("Failed to delete message:", error);
		}
	}

	async getMessage(id: string): Promise<StoredMessage | undefined> {
		await this.dbReady;
		try {
			const message = await this.db.get(this.storeName, id);
			return message;
		} catch (error) {
			console.error("Failed to get message:", error);
			return undefined;
		}
	}

	async updateMessage(newMessage: Message): Promise<void> {
		await this.dbReady;
		try {
			const existingMessage = await this.getMessage(newMessage.id);
			if (!existingMessage) {
				return;
			} else {
				const wholeMessage = {
					id: newMessage.id,
					message: newMessage,
					createdAt: existingMessage.createdAt,
					updatedAt: Date.now(),
				};
				await this.db.put(this.storeName, wholeMessage);
			}
		} catch (error) {
			console.error("Failed to update message:", error);
		}
	}

	async getAllMessages(): Promise<Message[]> {
		await this.dbReady;
		try {
			const storedMessages = await this.db.getAll(this.storeName);
			const messages = storedMessages
				.sort((a, b) => a.createdAt - b.createdAt)
				.map((msg) => ({ ...msg.message }));
			return messages;
		} catch (error) {
			console.error("Failed to get all messages:", error);
			return [];
		}
	}

	async clearCanvas(): Promise<void> {
		await this.dbReady;
		try {
			await this.db.clear(this.storeName);
		} catch (error) {
			console.error("Failed to clear canvas:", error);
			throw error;
		}
	}
}

export class SessionDB {
	private DB_NAME: string = "canvora-sessions-db";
	private version: number = 1;
	public storeName: keyof CanvoraSessionsDB = "sessions";
	private db!: IDBPDatabase<CanvoraSessionsDB>;
	private dbReady: Promise<void>;

	constructor() {
		this.dbReady = this.initDB();
	}

	private async initDB(): Promise<void> {
		try {
			this.db = await openDB<CanvoraSessionsDB>(
				this.DB_NAME,
				this.version,
				{
					upgrade: (db) => {
						if (!db.objectStoreNames.contains("sessions")) {
							db.createObjectStore("sessions", { keyPath: "id" });
						}
					},
				}
			);
		} catch (error) {
			console.error("Failed to initialize SessionDB:", error);
		}
	}

	async createSession(
		sessionId: string,
		messages: Message[] = []
	): Promise<void> {
		const sessionData = messages.map((message) => ({
			id: message.id,
			message: message,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		}));

		const session = {
			id: sessionId,
			data: sessionData,
		};

		await this.dbReady;
		try {
			await this.db.add(this.storeName, session);
		} catch (error) {
			console.error("Failed to create session:", error);
		}
	}

	async getSession(
		sessionId: string
	): Promise<CanvoraSessionsDB["sessions"] | undefined> {
		await this.dbReady;
		try {
			const session = await this.db.get(this.storeName, sessionId);
			return session;
		} catch (error) {
			console.error("Failed to get session:", error);
			return undefined;
		}
	}

	async updateSession(sessionId: string, messages: Message[]): Promise<void> {
		await this.dbReady;
		try {
			const existingSession = await this.getSession(sessionId);
			if (!existingSession) {
				await this.createSession(sessionId, messages);
				return;
			}

			const sessionData = messages.map((message) => ({
				id: message.id,
				message: message,
				createdAt:
					existingSession.data.find(
						(item: any) => item.id === message.id
					)?.createdAt || Date.now(),
				updatedAt: Date.now(),
			}));

			const updatedSession = {
				id: sessionId,
				data: sessionData,
			};

			await this.db.put(this.storeName, updatedSession);
		} catch (error) {
			console.error("Failed to update session:", error);
		}
	}

	async deleteSession(sessionId: string): Promise<void> {
		await this.dbReady;
		try {
			await this.db.delete(this.storeName, sessionId);
		} catch (error) {
			console.error("Failed to delete session:", error);
		}
	}

	async getAllSessions(): Promise<CanvoraSessionsDB["sessions"][]> {
		await this.dbReady;
		try {
			const sessions = await this.db.getAll(this.storeName);
			return sessions;
		} catch (error) {
			console.error("Failed to get all sessions:", error);
			return [];
		}
	}

	async getSessionMessages(sessionId: string): Promise<Message[]> {
		await this.dbReady;
		try {
			const session = await this.getSession(sessionId);
			if (!session) {
				return [];
			}

			const messages = session.data
				.sort((a: any, b: any) => a.createdAt - b.createdAt)
				.map((item: any) => ({ ...item.message }));
			return messages;
		} catch (error) {
			console.error("Failed to get session messages:", error);
			return [];
		}
	}

	async addMessageToSession(
		sessionId: string,
		message: Message
	): Promise<void> {
		await this.dbReady;
		try {
			const session = await this.getSession(sessionId);
			if (!session) {
				await this.createSession(sessionId, [message]);
				return;
			}

			const newMessageData = {
				id: message.id,
				message: message,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};

			const updatedData = [...session.data, newMessageData];
			const updatedSession = {
				id: sessionId,
				data: updatedData,
			};

			await this.db.put(this.storeName, updatedSession);
		} catch (error) {
			console.error("Failed to add message to session:", error);
		}
	}

	async removeMessageFromSession(
		sessionId: string,
		messageId: string
	): Promise<void> {
		await this.dbReady;
		try {
			const session = await this.getSession(sessionId);
			if (!session) {
				return;
			}

			const updatedData = session.data.filter(
				(item: any) => item.id !== messageId
			);
			const updatedSession = {
				id: sessionId,
				data: updatedData,
			};

			await this.db.put(this.storeName, updatedSession);
		} catch (error) {
			console.error("Failed to remove message from session:", error);
		}
	}

	async updateMessageInSession(
		sessionId: string,
		updatedMessage: Message
	): Promise<void> {
		await this.dbReady;
		try {
			const session = await this.getSession(sessionId);
			if (!session) {
				return;
			}

			const updatedData = session.data.map((item: any) => {
				if (item.id === updatedMessage.id) {
					return {
						id: updatedMessage.id,
						message: updatedMessage,
						createdAt: item.createdAt, // Preserve original creation time
						updatedAt: Date.now(),
					};
				}
				return item;
			});

			const updatedSession = {
				id: sessionId,
				data: updatedData,
			};

			await this.db.put(this.storeName, updatedSession);
		} catch (error) {
			console.error("Failed to update message in session:", error);
		}
	}

	async clearAllSessions(): Promise<void> {
		await this.dbReady;
		try {
			await this.db.clear(this.storeName);
		} catch (error) {
			console.error("Failed to clear all sessions:", error);
			throw error;
		}
	}
}
