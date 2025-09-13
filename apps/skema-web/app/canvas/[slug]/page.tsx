import RoomCanvas from "@/components/RoomCanvas";
import { auth } from "@/auth";
import { prisma } from "@repo/db/prisma";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function ({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const session = await auth();
	const slug = (await params).slug;
	if (!session) {
		// redirect(`/free-canvas/${slug}`);
		redirect("/signin");
	}
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
		} else if (isRoomExist.isActive) {
			roomId = isRoomExist.id;
		} else if (isRoomExist.adminId !== user.id) {
			const room_name = `${isRoomExist.name}-${Math.floor(Math.random() * 1000000).toString()}`;
			const baseSlug = room_name
				.toLowerCase()
				.trim()
				.replace(/[^a-z0-9\s-]/g, "")
				.replace(/\s+/g, "-")
				.replace(/-+/g, "-");
			const timeStamp = Date.now();

			const slug = `${baseSlug}-${timeStamp}`;

			const newRoom = await prisma.room.create({
				data: {
					name: room_name,
					slug,
					adminId: user.id,
					description: isRoomExist.description,
					participants: isRoomExist.participants,
					color: isRoomExist.color,
					category: isRoomExist.category,
				},
			});

			const chats = await prisma.chat.findMany({
				where: { roomId: isRoomExist.id },
				orderBy: { createdAt: "asc" },
			});
			for (let c of chats) {
				await prisma.chat.create({
					data: {
						chat: c.chat!,
						roomId: newRoom.id,
					},
				});
			}
			redirect(`/canvas/${newRoom.slug}`);
		} else {
			roomId = isRoomExist.id;
		}
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
