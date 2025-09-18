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

		const room = await prisma.room.findUnique({
			where: { id: roomId },
		});
		if (!room) {
			return NextResponse.json(
				{ error: "room not found" },
				{ status: 400 }
			);
		}

		const roomInfo = {
			id: room.id,
			slug: room.slug,
			isActive: room.isActive,
		};

		return NextResponse.json({ roomInfo }, { status: 200 });
	} catch (err: any) {
		console.error("get-room info  error:", err?.message ?? err);
		return NextResponse.json(
			{ error: err?.message ?? "Internal Server Error" },
			{ status: 500 }
		);
	}
}
