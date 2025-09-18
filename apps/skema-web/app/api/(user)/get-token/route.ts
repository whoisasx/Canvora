import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import { NextResponse as res } from "next/server";
import jwt from "jsonwebtoken";
import { config } from "@/config";

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
		const secret = config.jwt.secret;
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

		const token = jwt.sign(
			{ id: req.auth.user.id, username: req.auth.user.username },
			secret,
			{ expiresIn: "1h" }
		);

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

export async function POST(req: NextAuthRequest) {
	try {
		const { user } = await req.json();
		if (!user) {
			return res.json(
				{
					message: "user detail is absent",
					success: false,
				},
				{
					status: 400,
				}
			);
		}
		const secret = config.jwt.secret;
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

		const token = jwt.sign(user, secret, { expiresIn: "1h" });

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
}
