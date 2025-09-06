import { Button } from "@/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { signIn } from "next-auth/react";

export default function AuthPage({ type }: { type: "signup" | "signin" }) {
	return (
		<div className=" flex flex-col items-center justify-center gap-4">
			<h2 className="text-2xl font-extrabold dark:text-white">
				Hi there!
			</h2>
			<div className="text-sm dark:text-white">
				Choose a provider to{" "}
				{`${type === "signup" ? "sign up" : "sign in"}`}.
			</div>
			<div className="flex lg:flex-row flex-col items-center justify-center gap-4">
				<Button
					size="large"
					level="primary"
					onClick={() =>
						signIn("github", { redirectTo: "/dashboard" })
					}
				>
					<Image
						src={"/github.svg"}
						alt="github-logo"
						width={50}
						height={50}
						className="w-auto h-auto dark:filter dark:hue-rotate-180 dark:invert-[93]"
					/>
				</Button>
				<Button
					size="large"
					level="primary"
					onClick={() =>
						signIn("google", { redirectTo: "/dashboard" })
					}
				>
					<Image
						src={"/google.svg"}
						alt="google-logo"
						width={50}
						height={50}
						className="w-auto h-auto"
					/>
				</Button>
			</div>
			<div className="relative flex h-7 items-center justify-center gap-2 w-full">
				<div className="w-full border-t border-light-yellow-darker dark:border-[#B9B9C6]"></div>
				<span className="flex-shrink text-sm text-light-yellow-darker dark:text-[#B9B9C6]">
					or
				</span>
				<div className="w-full border-t border-yellow-darker dark:border-[#B9B9C6]"></div>
			</div>
			<div className="flex items-center justify-center">
				<Link
					className="text-canvora-600 mt-4 text-sm"
					href={`${type === "signup" ? "/signin" : "/signup"}`}
				>
					{`${type === "signup" ? "Already have an account?" : "Don't have an account?"}`}
				</Link>
			</div>
		</div>
	);
}
