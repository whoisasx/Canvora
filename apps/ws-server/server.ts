import axios from "axios";

export async function createMessage(
	message: any,
	userId: string,
	roomId: string
) {
	try {
		const response = await axios.post(
			`${process.env.NEXTAUTH_URL}/api/create-chat`,
			{
				id: message.id,
				message,
				roomId,
				userId,
			}
		);
		console.log("create");
	} catch (err) {
		console.log("create error");
	}
}

export async function updateMessage(message: any, id: string) {
	console.log("function");
	try {
		const response = await axios.post(
			`${process.env.NEXTAUTH_URL}/api/update-chat`,
			{
				id: message.id,
				message,
			}
		);
		console.log("update");
	} catch (err) {
		console.log("update error");
	}
}

export async function deleteMessage(id: string) {
	try {
		const response = await axios.delete(
			`${process.env.NEXTAUTH_URL}/api/create-chat`,
			{
				data: {
					id,
				},
			}
		);
		console.log("delete");
	} catch (error) {
		console.log("delete error");
	}
}
