import RoomCanvas from "@/components/RoomCanvas";
import { auth } from "@/auth";
import { prisma } from "@repo/db/prisma";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function ({ params }: { params: { slug: string } }) {
	const session = await auth();
	if (!session) {
		redirect("/signin");
	}
	const slug = (await params).slug;
	const user = session.user;
	let roomId: string;

	try {
		const isRoomExist = await prisma.room.findUnique({
			where: {
				slug,
			},
		});
		if (!isRoomExist) {
			console.log("room not exist");
			redirect("/dashboard");
		}
		if (!isRoomExist.isActive && isRoomExist.adminId !== user.id) {
			redirect("/dashboard");
		}
		roomId = isRoomExist.id;
	} catch (error) {
		redirect("/dashboard");
	} finally {
	}

	return (
		<SessionProvider>
			<RoomCanvas roomId={roomId} />
		</SessionProvider>
	);
}
