import axios from "axios";

export async function getExistingMessages(roomId: string) {
	console.log("roomId", roomId);
	try {
		const response = await axios.get(
			`${process.env.NEXTAUTH_URL}/api/get-chats/${roomId}`
		);
		if (response.status === 200) {
			const messages = response.data.messages;
			console.log("messages", messages);
			return messages;
		} else {
			return [];
		}
	} catch (err) {
		if (axios.isAxiosError(err)) {
			// return err.response?.data?.message;
			console.log("get chat error");
			return [];
		}
		return [];
	}
}
