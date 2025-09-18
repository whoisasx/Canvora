"use client";
import { SessionProvider } from "next-auth/react";
import FreeCanvas from "./FreeCanvas";
import { IndexDB, SessionDB } from "@/lib/indexdb";
import { localUser } from "@/app/freehand/page";

export interface SessionData {
	roomId: string;
	socket: WebSocket;
}

export default function FreeRoomCanvas({
	sessionData,
	indexdb,
	user,
	sessiondb,
}: {
	sessionData?: SessionData;
	indexdb: IndexDB;
	user: localUser | null;
	sessiondb: SessionDB;
}) {
	return (
		<SessionProvider>
			<FreeCanvas
				sessionData={sessionData}
				indexdb={indexdb}
				sessiondb={sessiondb}
				user={user}
			/>
		</SessionProvider>
	);
}
