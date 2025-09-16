"use client";

import CanvasClient from "@/components/FreeRoomCanvas";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { generateUsername } from "unique-username-generator";
import { v4 } from "uuid";

export default function () {
	// const [user, setUser] = useState<LocalUser | undefined>(undefined);
	// const [room, setRoom] = useState<LocalRoom | undefined>(undefined);

	// const [loading, setLoading] = useState(true);

	// useEffect(() => {
	// 	async function setLocalCanvas() {
	// 		const totalUsers = await db.users.count();
	// 		if (totalUsers > 0) {
	// 			const user = await db.users.toCollection().first();
	// 			setUser(user);
	// 		} else {
	// 			const user = {
	// 				id: v4(),
	// 				username: generateUsername("-"),
	// 			};
	// 			setUser(user);
	// 			await db.users.add(user);
	// 		}

	// 		const totalRooms = await db.rooms.count();
	// 		if (totalRooms > 0) {
	// 			const room = await db.rooms.toCollection().first();
	// 			setRoom(room);
	// 		} else {
	// 			const roomname = randomNamegenerator();
	// 			const room = {
	// 				id: v4(),
	// 				roomname,
	// 				slug: `${roomname}-${Date.now()}`,
	// 				isActive: false,
	// 				chats: [],
	// 			};
	// 			setRoom(room);
	// 			await db.rooms.add(room);
	// 		}
	// 	}
	// 	setLoading(false);
	// 	setLocalCanvas().catch((e) => console.error(e));

	// 	return () => {
	// 		setLoading(true);
	// 	};
	// }, []);

	return (
		<SessionProvider>
			{room && user ? (
				<CanvasClient
					roomId={room.id}
					user={user}
					isActive={room.isActive}
				/>
			) : (
				<div>Loading...</div>
			)}
		</SessionProvider>
	);
}

function randomNamegenerator(): string {
	const alphabet = "abcdefghijklmnopqrstuvwxyz";
	const bytes = crypto.getRandomValues(new Uint8Array(6));
	return Array.from(bytes)
		.map((b) => alphabet[b % alphabet.length])
		.join("");
}
