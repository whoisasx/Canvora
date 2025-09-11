import { prisma } from "@repo/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		// expected shape: { roomId: string, userId: string, message: any }
		const { id, roomId, userId, message } = body ?? {};

		if (!id || !roomId || !userId || message === undefined) {
			return NextResponse.json(
				{ error: "roomId, userId and message are required" },
				{ status: 400 }
			);
		}

		const created = await prisma.chat.create({
			data: {
				id,
				roomId,
				userId,
				chat: message,
			},
		});

		return NextResponse.json({ chat: created }, { status: 201 });
	} catch (err: any) {
		console.error("create-chat error:", err?.message ?? err);
		return NextResponse.json(
			{ error: err?.message ?? "Internal Server Error" },
			{ status: 500 }
		);
	}
}
