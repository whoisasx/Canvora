import { auth } from "@/auth";
import { prisma } from "@repo/db/prisma";
import { NextAuthRequest } from "next-auth";
import { NextResponse as res } from "next/server";

export const POST = auth(async function POST(req: NextAuthRequest) {
	if (!req.auth) {
		return res.json(
			{
				message: "unauthenticated.",
				success: false,
			},
			{
				status: 401,
			}
		);
	}
	try {
		const { roomId } = await req.json();
		const user = req.auth.user;
		if (!roomId) {
			return res.json(
				{
					message: "missing room id.",
					success: false,
				},
				{
					status: 400,
				}
			);
		}

		// First, fetch the current room state
		const room = await prisma.room.findUnique({
			where: {
				id: roomId,
			},
		});

		if (!room || room.adminId !== user.id) {
			return res.json(
				{
					message: "room not found or unauthorized.",
					success: false,
				},
				{
					status: 404,
				}
			);
		}

		const updatedRoomStatus = await prisma.room.update({
			where: {
				id: roomId,
			},
			data: {
				isActive: !room.isActive,
			},
		});

		return res.json(
			{
				message: "room state toggled successfully.",
				success: true,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res.json(
			{
				message:
					error instanceof Error ? error.message : "unknown error",
				success: false,
			},
			{
				status: 500,
			}
		);
	}
});
