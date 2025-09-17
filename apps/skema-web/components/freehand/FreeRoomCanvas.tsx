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
	user,
	indexdb,
}: {
	sessionData?: SessionData;
	user: localUser;
	indexdb: IndexDB;
}) {
	return (
		<SessionProvider>
			<FreeCanvas
				sessionData={sessionData}
				user={user}
				indexdb={indexdb}
			/>
		</SessionProvider>
	);
}
