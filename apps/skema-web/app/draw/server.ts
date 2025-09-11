import axios from "axios";

export async function getExistingMessages(
	roomId: string,
	authenticated: boolean,
	isActive: boolean | undefined
) {
	try {
		const response = await axios.get(
			`http://localhost:3000/api/get-chats/${roomId}`
		);
		if (response.status === 200) {
			const messages = response.data.messages;
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
