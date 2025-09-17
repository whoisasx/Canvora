import { SessionData } from "@/components/freehand/FreeRoomCanvas";
import { IndexDB } from "@/lib/indexdb";

export async function getExistingMessagesLocal(
	roomId: string | undefined,
	socket: WebSocket | undefined,
	indexdb: IndexDB
) {
	try {
		if (socket && roomId) {
			await indexdb.clearCanvas();
			//TODO: pull the messages from websocket server and put it into the indexDb and return the message
			return [];
		} else {
			const messages = await indexdb.getAllMessages();
			return messages;
		}
	} catch (err) {
		console.error("error", err);
	}
	return [];
}
