import { auth } from "@/auth";
import { prisma } from "@repo/db/prisma";
import { NextRequest, NextResponse as res } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ userId: string }> }
) {
	try {
		const session = await auth();
		if (!session) {
			return res.json(
				{
					message: "unauthenticated",
					success: false,
				},
				{
					status: 401,
				}
			);
		}
		const { userId } = await params;
		if (!userId) {
			return res.json(
				{
					message: "missing required fields.",
					success: false,
				},
				{
					status: 400,
				}
			);
		}

		const rooms = await prisma.room.findMany({
			where: {
				admin: {
					id: userId,
				},
			},
		});

		return res.json(
			{
				message: "rooms of the user",
				success: true,
				data: rooms,
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
}
