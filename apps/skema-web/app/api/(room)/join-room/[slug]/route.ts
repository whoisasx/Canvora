import { auth } from "@/auth";
import { prisma } from "@repo/db/prisma";
import { NextRequest, NextResponse as res } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const session = await auth();
		if (!session) {
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
		const { slug } = await params;
		if (!slug) {
			return res.json(
				{
					message: "slug is missing.",
					success: false,
				},
				{
					status: 400,
				}
			);
		}

		const isRoomExist = await prisma.room.findUnique({
			where: {
				slug,
			},
		});
		if (!isRoomExist) {
			return res.json(
				{
					message: "invalid slug",
					success: false,
				},
				{
					status: 400,
				}
			);
		}

		if (isRoomExist.adminId === session.user.id) {
			return res.json(
				{
					message: "join the room",
					success: true,
					data: isRoomExist,
				},
				{
					status: 200,
				}
			);
		}

		if (!isRoomExist.isActive) {
			return res.json(
				{
					message: "session is closed",
					success: false,
				},
				{
					status: 400,
				}
			);
		}

		return res.json({
			message: "join the room",
			success: true,
			data: {
				roomId: isRoomExist.id,
			},
		});
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
}
