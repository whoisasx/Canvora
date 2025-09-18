export const config = {
	auth: {
		secret: process.env.AUTH_SECRET ?? "",
		nextAuthSecret: process.env.NEXTAUHTH_SECRET ?? "",
		url: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
		authUrl: process.env.AUTH_URL ?? "http://localhost:3000",
		trustHost: process.env.AUTH_TRUST_HOST === "true",
		providers: {
			google: {
				clientId: process.env.AUTH_GOOGLE_ID ?? "",
				clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
			},
			github: {
				clientId: process.env.AUTH_GITHUB_ID ?? "",
				clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
			},
			discord: {
				clientId: process.env.AUTH_DISCORD_ID ?? "",
				clientSecret: process.env.AUTH_DISCORD_SECRET ?? "",
			},
		},
		resend: {
			apiKey: process.env.AUTH_RESEND_KEY ?? "",
		},
	},
	app: {
		baseUrl: process.env.BASE_URL ?? "http://localhost:3000",
		wsUrl: process.env.WS_URL ?? "ws://localhost:8080",
		publicWsUrl: process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080",
	},
	jwt: {
		secret: process.env.JWT_SECRET ?? "",
	},
} as const;

export type Config = typeof config;
