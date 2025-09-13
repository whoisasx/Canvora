import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@repo/db/prisma";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ roomId: string }> }
) {
	try {
		const { roomId } = await params;

		if (!roomId) {
			return NextResponse.json(
				{ error: "roomId is required" },
				{ status: 400 }
			);
		}

		const chats = await prisma.chat.findMany({
			where: { roomId },
			orderBy: { createdAt: "desc" }, // fetch newest first
			take: 50,
		});
		// return in chronological order (oldest first) for display
		chats.reverse();

		const messages = chats.map((c) => c.chat);

		return NextResponse.json({ messages }, { status: 200 });
	} catch (err: any) {
		console.error("get-chats error:", err?.message ?? err);
		return NextResponse.json(
			{ error: err?.message ?? "Internal Server Error" },
			{ status: 500 }
		);
	}
}
