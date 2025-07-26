import { auth } from "@/auth";
import { prisma } from "@repo/db/prisma";
import { NextAuthRequest } from "next-auth";
import { NextRequest, NextResponse as res } from "next/server";
import { z } from "zod";

const nameSchema = z.object({
	name: z.string().min(3, "name must have atleast 3 characters."),
});

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
		const parsed = nameSchema.safeParse(body);
		if (!parsed.success) {
			return res.json(
				{
					message: "name can not be empty.",
					success: false,
				},
				{
					status: 400,
				}
			);
		}

		const name = parsed.data.name;
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
				name,
			},
		});

		return res.json(
			{
				message: "name updated successfully.",
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
