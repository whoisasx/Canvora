import { auth } from "@/auth";
import { prisma } from "@repo/db/prisma";
import { NextAuthRequest } from "next-auth";
import { NextResponse as res } from "next/server";

export const DELETE = auth(async function DELETE(req: NextAuthRequest) {
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
		const isUserExist = await prisma.user.delete({
			where: {
				id: req.auth.user.id,
			},
		});

		return res.json(
			{
				message: "user removed.",
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
