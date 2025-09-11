import FreeRoomCanvas from "@/components/FreeRoomCanvas";
import RoomCanvas from "@/components/RoomCanvas";
import { prisma } from "@repo/db/prisma";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import { generateUsername } from "unique-username-generator";
import { v4 as uuidv4, v4 } from "uuid";

export default async function ({ params }: { params: { slug: string } }) {
	let roomId: string = v4();
	let isActive: boolean = true;
	const username = generateUsername("-");
	const id = uuidv4();
	const user = {
		username,
		id,
	};
	const slug = (await params).slug;
	try {
		const isRoomExist = await prisma.room.findUnique({
			where: {
				slug,
			},
		});
		if (!isRoomExist) {
			console.log("room not exist");
			redirect("/");
		} else if (isRoomExist.isActive) {
			roomId = isRoomExist.id;
			isActive = true;
		} else {
			roomId = isRoomExist.id;
			isActive = false;
		}
	} catch (error) {
		redirect("/dashboard");
	} finally {
	}
	return <FreeRoomCanvas roomId={roomId} user={user} isActive={isActive} />;
}
