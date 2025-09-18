import { SessionData } from "@/components/freehand/FreeRoomCanvas";
import { IndexDB, SessionDB } from "@/lib/indexdb";

export async function getExistingMessagesLocal(
	roomId: string | undefined,
	socket: WebSocket | undefined,
	indexdb: IndexDB,
	sessiondb: SessionDB
) {
	try {
		if (socket && roomId) {
			const messages = await sessiondb.getSessionMessages(roomId);
			return messages;
		} else {
			const messages = await indexdb.getAllMessages();
			return messages;
		}
	} catch (err) {}
	return [];
}
