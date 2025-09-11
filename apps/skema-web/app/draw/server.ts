import axios from "axios";

export async function getExistingMessages(roomId: string) {
	try {
		const response = await axios.get(
			`${process.env.NEXTAUTH_URL}/get-chats/${roomId}`
		);
		if (response.status === 200) {
			const chats = response.data.messages;
			const shapes = chats.map((x: any) => {
				const shape = JSON.parse(x.message);
				return shape;
			});
			return shapes;
		} else {
			return "An error occured while getting shapes.";
		}
	} catch (err) {
		if (axios.isAxiosError(err)) {
			return err.response?.data?.message;
		}
		return null;
	} finally {
		return "this is the final block , meaning request not handled.";
	}
}
