"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function () {
	const router = useRouter();
	return (
		<div className="min-w-screen min-h-screen p-10 bg-gray-400">
			<div>
				<button
					className="h-10 w-40 rounded-2xl border-1 border-purple-700 mx-5"
					onClick={() => {
						signIn("google", { redirectTo: "/dashboard" });
					}}
				>
					sign up with google
				</button>
				<button
					className="h-10 w-40 rounded-2xl border-1 border-purple-700 mx-5"
					onClick={() => {
						router.push("/signin");
					}}
				>
					sign in
				</button>
			</div>
		</div>
	);
}
