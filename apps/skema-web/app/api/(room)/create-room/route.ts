import { auth } from "@/auth";
import { roomNameSchem } from "@/lib/zod";
import { prisma } from "@repo/db/prisma";
import { NextAuthRequest } from "next-auth";
import { NextResponse as res } from "next/server";
import { z } from "zod";

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
		const parsed = roomNameSchem.safeParse(body);
		if (!parsed.success) {
			return res.json(
				{
					message: "room must have a valid name.",
					success: false,
				},
				{
					status: 400,
				}
			);
		}

		const name = parsed.data.name;
		const isRoomExist = await prisma.room.findFirst({
			where: {
				name,
				adminId: req.auth.user.id,
			},
		});
		if (isRoomExist) {
			return res.json(
				{
					message: "room already exist with the same name.",
					success: false,
				},
				{
					status: 400,
				}
			);
		}

		const baseSlug = name
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-");
		const timeStamp = Date.now();

		const slug = `${baseSlug}-${timeStamp}`;

		const newRoom = await prisma.room.create({
			data: {
				name,
				slug,
				adminId: req.auth.user.id,
			},
		});

		return res.json(
			{
				message: "room created.",
				success: true,
				data: { newRoom },
			},
			{
				status: 201,
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
