import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db/prisma";

export async function DELETE(req: NextRequest) {
	try {
		const body = await req.json();
		const { id } = body ?? {};

		if (!id) {
			return NextResponse.json(
				{ error: "id is required" },
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

		await prisma.chat.delete({ where: { id } });

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (err: any) {
		console.error("delete-chat error:", err?.message ?? err);
		return NextResponse.json(
			{ error: err?.message ?? "Internal Server Error" },
			{ status: 500 }
		);
	}
}
