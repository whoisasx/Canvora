"use client";
import { signIn } from "next-auth/react";

export default function () {
	return (
		<div className="min-w-screen min-h-screen p-10 bg-gray-400">
			<div>
				<button
					className="h-10 w-40 rounded-2xl border-1 border-purple-700"
					onClick={() => {
						signIn("google", { redirectTo: "/dashboard" });
					}}
				>
					sign in with google
				</button>
			</div>
		</div>
	);
}
