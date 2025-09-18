import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { config } from "@/config";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const { user } = body;

		if (!user || !user.id || !user.username) {
			console.log("Invalid user data:", user);
			return NextResponse.json(
				{ error: "Invalid user data. User must have id and username." },
				{ status: 400 }
			);
		}

		console.log("Generating token for user:", user);
		const token = jwt.sign(user, config.jwt.secret, {
			expiresIn: "1h",
		});

		console.log("Token generated successfully");
		return NextResponse.json({ token });
	} catch (error) {
		console.error("Error in freehand-token API:", error);
		return NextResponse.json(
			{ error: "Failed to generate token" },
			{ status: 500 }
		);
	}
}
