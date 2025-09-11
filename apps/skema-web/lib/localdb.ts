// lib/db.ts
import Dexie, { Table } from "dexie";

export interface LocalUser {
	id: string;
	username: string;
}
export interface Chat {
	id: string;
	chat: object;
}

export interface LocalRoom {
	id: string;
	slug: string;
	isActive: boolean;
	chat: Chat;
}

export class LocalDB extends Dexie {
	users!: Table<LocalUser>;
	rooms!: Table<LocalRoom>;

	constructor() {
		super("SkemaLocalDB");
		this.version(1).stores({
			users: "id, username",
			rooms: "id, slug, isActive",
		});
	}
}

export const db = new LocalDB();
