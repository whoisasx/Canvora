import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextRequest, NextResponse as res } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req: NextRequest) => {
	const session = await auth();
	console.log(session);
	console.log(req);
	if (!session) {
		const newUrl = new URL("/", req.nextUrl.origin);
		return res.redirect(newUrl);
	}
	return res.next();
});

export const config = {
	matcher: ["/signin", "/signup"],
};

// const nextAuth = NextAuth(authConfig);

// const auth: typeof nextAuth.auth = nextAuth.auth;
// export default auth;

// const middleware = auth(async function middleware(req: NextRequest) {
// 	const session = await auth();
// 	console.log(session);
// 	console.log(req);
// 	if (!session?.user) {
// 		const newUrl = new URL("/", req.url);
// 		console.log(newUrl);
// 		return res.redirect(newUrl);
// 	}
// 	return res.next();
// });

// export default middleware as (
// 	req: NextRequest
// ) => Promise<Response | undefined>;
