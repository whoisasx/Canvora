"use client";
import { SessionProvider } from "next-auth/react";
import FreeCanvas from "./FreeCanvas";
import { IndexDB } from "@/lib/indexdb";
import { localUser } from "@/app/freehand/page";

export interface SessionData {
	roomId: string;
	socket: WebSocket;
}

export default function FreeRoomCanvas({
	sessionData,
	indexdb,
	user,
}: {
	sessionData?: SessionData;
	indexdb: IndexDB;
	user: localUser | null;
}) {
	return (
		<SessionProvider>
			<FreeCanvas
				sessionData={sessionData}
				indexdb={indexdb}
				user={user}
			/>
		</SessionProvider>
	);
}
