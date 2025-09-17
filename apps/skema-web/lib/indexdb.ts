import { Message } from "@/app/draw/draw";
import { openDB } from "idb";
import type { IDBPDatabase } from "idb";

interface CanvoraDB {
	chats: {
		id: string;
		message: Message;
		createdAt: number;
		updatedAt: number;
	};
}

type StoredMessage = CanvoraDB["chats"];

export class IndexDB {
	private DB_NAME: string = "canvora-db";
	private version: number = 1;
	public storeName: keyof CanvoraDB = "chats";
	private db!: IDBPDatabase<CanvoraDB>;
	private dbReady: Promise<void>;

	constructor() {
		this.dbReady = this.initDB();
	}

	private async initDB(): Promise<void> {
		try {
			this.db = await openDB<CanvoraDB>(this.DB_NAME, this.version, {
				upgrade: (db) => {
					if (!db.objectStoreNames.contains(this.storeName)) {
						db.createObjectStore(this.storeName, { keyPath: "id" });
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
			console.error("Failed to add message:", message);
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
