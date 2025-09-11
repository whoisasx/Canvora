import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db/prisma";

export async function PATCH(req: NextRequest) {
	try {
		const body = await req.json();
		const { id, message } = body ?? {};

		if (!id || message === undefined) {
			return NextResponse.json(
				{ error: "id and message are required" },
				{ status: 400 }
			);
		}

		const existing = await prisma.chat.findUnique({ where: { id } });
		if (!existing) {
			return NextResponse.json(
				{ error: "Chat not found" },
				{ status: 404 }
			);
		}

		const updated = await prisma.chat.update({
			where: { id },
			data: { chat: message },
		});

		return NextResponse.json({ chat: updated }, { status: 200 });
	} catch (err: any) {
		console.error("update-chat error:", err?.message ?? err);
		return NextResponse.json(
			{ error: err?.message ?? "Internal Server Error" },
			{ status: 500 }
		);
	}
}
