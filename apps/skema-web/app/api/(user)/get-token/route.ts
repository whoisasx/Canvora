import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import { NextResponse as res } from "next/server";
import jwt from "jsonwebtoken";

export const GET = auth(async function GET(req: NextAuthRequest) {
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
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			return res.json(
				{
					message: "secret is absent",
					success: false,
				},
				{
					status: 400,
				}
			);
		}

		const token = jwt.sign(req.auth.user, secret, { expiresIn: "1h" });

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
