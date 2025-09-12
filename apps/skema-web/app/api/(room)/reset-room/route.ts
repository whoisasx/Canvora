import { auth } from "@/auth";
import { prisma } from "@repo/db/prisma";
import { NextAuthRequest } from "next-auth";
import { NextResponse as res } from "next/server";

export const DELETE = auth(async function DELETE(req: NextAuthRequest) {
	if (!req.auth) {
		return res.json(
			{ message: "unauthenticated", success: false },
			{ status: 401 }
		);
	}

	try {
		const { roomId } = await req.json();

		if (!roomId) {
			return res.json(
				{ message: "roomId absent", success: false },
				{ status: 400 }
			);
		}

		const existingRoom = await prisma.room.findUnique({
			where: {
				id: roomId,
				adminId: req.auth.user.id,
			},
		});

		if (!existingRoom) {
			return res.json(
				{ message: "You are not admin.", success: false },
				{ status: 404 }
			);
		}

		await prisma.chat.deleteMany({
			where: {
				roomId: roomId,
			},
		});

		return res.json(
			{ message: "canvas cleared.", success: true },
			{ status: 200 }
		);
	} catch (error) {
		return res.json(
			{
				message:
					error instanceof Error ? error.message : "unknown error",
				success: false,
			},
			{ status: 500 }
		);
	}
});
