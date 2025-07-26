import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { prisma } from "@repo/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";

const nextAuth = NextAuth({
	...authConfig,
	adapter: PrismaAdapter(prisma),
	providers: [
		...authConfig.providers,
		Resend({
			from: "noreply@mail.asxcode.com",
		}),
	],
	events: {
		async createUser({ user }) {
			const username = user.email.trim().split("@")[0];
			try {
				await prisma.user.update({
					where: {
						email: user.email,
					},
					data: {
						username,
					},
				});
			} catch (err) {}
		},
	},
});

export const { handlers, signIn, signOut, auth } = nextAuth;
// export const auth: typeof nextAuth.auth = nextAuth.auth;
