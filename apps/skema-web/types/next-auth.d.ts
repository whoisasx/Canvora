import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			email: string;
			name: string | null;
			username: string | null;
			image: string | null;
			emailVerified: Date | null;
		} & DefaultSession["user"];
	}
	interface User {
		id: string;
		email: string;
		name: string | null;
		username: string | null;
		image: string | null;
		emailVerified: Date | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		user: {
			id: string;
			email: string;
			name: string | null;
			username: string | null;
			image: string | null;
			emailVerified: Date | null;
		};
	}
}
