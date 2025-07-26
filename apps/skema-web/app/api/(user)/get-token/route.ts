import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import { NextResponse as res } from "next/server";
import jwt from "jsonwebtoken";

export const POST = auth(async function POST(req: NextAuthRequest) {
	if (!req.auth) {
		return res.json(
			{
				message: "unauthenticated",
				success: false,
			},
			{ status: 401 }
		);
	}
	try {
		const { user } = await req.json();
		const secret = process.env.JWT_SECRET;
		if (!user || !secret) {
			return res.json(
				{
					message: "user or secret is absent",
					success: false,
				},
				{
					status: 400,
				}
			);
		}

		const token = jwt.sign(user, secret, { expiresIn: "10m" });

		return res.json(
			{
				message: "token generated.",
				success: true,
				data: token,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res.json(
			{
				message: "error",
				success: false,
			},
			{
				status: 500,
			}
		);
	}
});
