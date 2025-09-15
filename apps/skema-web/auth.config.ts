import type { NextAuthConfig } from "next-auth";
import Discord from "next-auth/providers/discord";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import { prisma } from "@repo/db/prisma";

const authConfig = {
	providers: [Discord, GitHub, Google],
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "api/auth/signin",
		signOut: "api/auth/signin",
		verifyRequest: "/api/auth/signin",
		error: "api/auth/signin",
		newUser: "/",
	},
	callbacks: {
		async jwt({ token, user, account, profile, trigger }) {
			if (trigger === "update") {
				if (process.env.NEXT_RUNTIME !== "edge") {
					const updatedUser = await prisma.user.findUnique({
						where: {
							id: token.user.id,
						},
					});
					if (updatedUser) {
						token.user = {
							id: updatedUser.id,
							email: updatedUser.email,
							name: updatedUser.name,
							username: updatedUser.username,
							image: updatedUser.image,
							emailVerified: updatedUser.emailVerified,
						};
						return token;
					}
				}
			}
			if (user) {
				token.user = {
					id: user.id,
					email: user.email,
					name: user.name,
					username: user.username,
					image: user.image,
					emailVerified: user.emailVerified,
				};
			}
			return token;
		},
		async session({ session, token, trigger }) {
			if (token) {
				session.user = token.user;
			}
			return session;
		},
		async authorized({ auth }) {
			return !!auth;
		},
	},
} satisfies NextAuthConfig;

export default authConfig;
