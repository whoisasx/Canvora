"use client";
import AuthPage from "@/components/AuthPageProvider";
import BottomSvg from "@/components/BottomSvg";
import LeftSvg from "@/components/LeftSvg";
import RightSvg from "@/components/RightSvg";
import { CanvoraIcon, CanvoraTitle } from "@/ui/Canvora";
import { useTheme } from "next-themes";
import Link from "next/link";
import { motion } from "motion/react";

export default function () {
	const { theme, setTheme, resolvedTheme } = useTheme();
	return (
		<div className="min-w-screen min-h-screen relative overflow-hidden bg-oc-yellow-0/50 dark:bg-dark-bg-alt">
			<LeftSvg />
			<RightSvg />
			<BottomSvg />
			<div className="min-h-screen h-fit w-full relative p-10 lg:p-12 overflow-hidden flex flex-col items-center justify-center">
				<div className="relative z-10">
					<Link
						href={"/"}
						className="p-2 flex items-center justify-center"
					>
						<CanvoraIcon className="w-10 h-10" />
						<CanvoraTitle className="w-50 h-15 hidden md:block" />
					</Link>
				</div>
				<div className="my-12 w-full flex flex-col items-center justify-center">
					<div className="w-full max-w-6xl">
						<div className="w-full h-1/2 flex items-center justify-center">
							<div className="relative mx-auto h-150 p-15 lg:px-8 lg:py-8 flex flex-col items-center gap-30 rounded-4xl bg-light-yellow-light shadow-2xl dark:bg-dark-bg">
								<div
									className="w-20 h-10 border rounded-full relative px-1 flex items-center cursor-pointer"
									onClick={() =>
										setTheme(
											resolvedTheme === "dark"
												? "light"
												: "dark"
										)
									}
								>
									<motion.div
										layout
										transition={{
											type: "spring",
											stiffness: 500,
											damping: 30,
										}}
										animate={{
											x:
												resolvedTheme === "dark"
													? 34
													: 0,
										}}
										className="w-9 h-9 rounded-full bg-dark-bg dark:bg-light-yellow-light shadow-2xl"
									/>
								</div>
								<AuthPage type="signup" />
							</div>
						</div>
						<div className="relative flex items-center justify-center">
							<div className="flex items-center justify-center lg:max-w-[480px]">
								<p className="text-center text-light-gray-70 mt-3 text-sm">
									By continuing you are agreeing to our
									<br />
									<a
										href="/"
										className="text-canvora-600 no-underline"
										target="_blank"
										rel="noreferrer"
									>
										Terms of Use
									</a>{" "}
									and{" "}
									<a
										href="/"
										className="text-canvora-600 no-underline"
										target="_blank"
										rel="noreferrer"
									>
										Privacy Policy
									</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
