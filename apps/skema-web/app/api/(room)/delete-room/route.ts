import { auth } from "@/auth";
import { prisma } from "@repo/db/prisma";
import { NextAuthRequest } from "next-auth";
import { NextResponse as res } from "next/server";

export const DELETE = auth(async function DELETE(req: NextAuthRequest) {
	if (!req.auth) {
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
	try {
		const { slug } = await req.json();
		if (!slug) {
			return res.json(
				{
					message: "room name invalid.",
					success: false,
				},
				{ status: 400 }
			);
		}

		const result = await prisma.room.deleteMany({
			where: {
				slug,
				adminId: req.auth.user.id,
			},
		});
		if (result.count === 0) {
			return res.json(
				{
					message: "room not found",
					success: false,
				},
				{
					status: 400,
				}
			);
		}

		return res.json(
			{
				message: "room data was deleted and removed.",
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
			{ status: 500 }
		);
	}
});
