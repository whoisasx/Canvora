export const config = {
	database: {
		url: process.env.DATABASE_URL ?? "",
	},
	auth: {
		secret: process.env.AUTH_SECRET ?? "",
		nextAuthSecret: process.env.NEXTAUTH_SECRET ?? "",
		url: process.env.NEXTAUTH_URL ?? "https://canvora.asxcode.com",
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
		},
		resend: {
			apiKey: process.env.AUTH_RESEND_KEY ?? "",
		},
	},
	app: {
		nodeEnv: process.env.NODE_ENV ?? "development",
		port: Number(process.env.PORT) ?? 8080,
		baseUrl: process.env.BASE_URL ?? "https://canvora.asxcode.com",
		wsUrl: process.env.WS_URL ?? "wss://canvora.asxcode.com",
		publicWsUrl:
			process.env.NEXT_PUBLIC_WS_URL ?? "wss://canvora.asxcode.com",
	},
	jwt: {
		secret: process.env.JWT_SECRET ?? "",
	},
} as const;

export type Config = typeof config;
