import { NextResponse } from "next/server";

export async function GET() {
	try {
		// Basic health check - you can add more checks here like database connectivity
		return NextResponse.json({
			status: "healthy",
			timestamp: new Date().toISOString(),
			service: "skema-web",
			version: process.env.npm_package_version || "1.0.0",
		});
	} catch (error) {
		return NextResponse.json(
			{
				status: "unhealthy",
				timestamp: new Date().toISOString(),
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
