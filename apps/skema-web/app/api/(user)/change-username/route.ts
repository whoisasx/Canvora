import { auth } from "@/auth";
import { usernameSchema } from "@/lib/zod";
import { prisma } from "@repo/db/prisma";
import { NextAuthRequest } from "next-auth";
import { NextRequest, NextResponse as res } from "next/server";

export const POST = auth(async function POST(req: NextAuthRequest) {
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
		const body = await req.json();
		const parsed = usernameSchema.safeParse(body.username);
		if (!parsed.success) {
			return res.json(
				{
					message: "username can not be invalid.",
					success: false,
				},
				{
					status: 400,
				}
			);
		}

		const username = parsed.data;
		const isUserExist = await prisma.user.findUnique({
			where: {
				email: req.auth.user.email,
			},
		});
		if (!isUserExist) {
			return res.json(
				{
					message: "user does not exist",
					success: false,
				},
				{
					status: 404,
				}
			);
		}

		const updatedUser = await prisma.user.update({
			where: {
				email: req.auth.user.email,
			},
			data: {
				username,
			},
		});

		return res.json(
			{
				message: "username updated successfully.",
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
					error instanceof Error ? error.message : "Unknown error",
				success: false,
			},
			{
				status: 500,
			}
		);
	}
});
