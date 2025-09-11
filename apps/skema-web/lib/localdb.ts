// lib/db.ts
import { Message } from "@/app/draw/draw";
import Dexie, { Table } from "dexie";

export interface LocalUser {
	id: string;
	username: string;
}
export interface LocalRoom {
	id: string;
	roomname: string;
	slug: string;
	isActive: boolean;
	chats: Message[];
}

export class LocalDB extends Dexie {
	users!: Table<LocalUser>;
	rooms!: Table<LocalRoom>;

	constructor() {
		super("SkemaLocalDB");
		this.version(1).stores({
			users: "id, username",
			rooms: "id, roomname, slug, isActive",
		});
	}
}

export const db = new LocalDB();
