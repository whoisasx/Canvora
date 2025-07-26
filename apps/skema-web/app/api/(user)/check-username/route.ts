import { auth } from "@/auth";
import { usernameSchema } from "@/lib/zod";
import { prisma } from "@repo/db/prisma";
import { NextAuthRequest } from "next-auth";
import { NextResponse as res } from "next/server";

export const GET = auth(async function GET(req: NextAuthRequest) {
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

	const { searchParams } = req.nextUrl;
	const rawUsername = searchParams.get("username");
	if (!rawUsername) {
		return res.json(
			{
				message: "username is missing in query.",
				success: false,
			},
			{
				status: 400,
			}
		);
	}
	const parsed = usernameSchema.safeParse(rawUsername);
	if (!parsed.success) {
		return res.json(
			{
				message: "username is invalid.",
				success: false,
			},
			{
				status: 400,
			}
		);
	}

	try {
		const username = parsed.data;
		const isUserExist = await prisma.user.findUnique({
			where: {
				username,
			},
		});
		if (isUserExist) {
			return res.json(
				{
					message: "username already taken",
					success: false,
				},
				{
					status: 400,
				}
			);
		}

		return res.json(
			{
				message: "username available.",
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
