import axios from "axios";

export async function createMessage(
	message: any,
	userId: string,
	roomId: string
) {
	try {
		const response = await axios.post(
			`${process.env.BASE_URL}/api/create-chat`,
			{
				id: message.id,
				message,
				roomId,
			}
		);
	} catch (err) {}
}

export async function updateMessage(message: any, id: string) {
	try {
		const response = await axios.patch(
			`${process.env.BASE_URL}/api/update-chat`,
			{
				id: message.id,
				message,
			}
		);
	} catch (err) {}
}

export async function deleteMessage(id: string) {
	try {
		const response = await axios.delete(
			`${process.env.BASE_URL}/api/delete-chat`,
			{
				data: {
					id,
				},
			}
		);
	} catch (error) {}
}
