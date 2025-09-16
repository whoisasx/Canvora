"use client";
import AuthPage from "@/components/AuthPageProvider";
import AnimatedBackground from "@/components/AnimatedBackground";
import FloatingElements from "@/components/FloatingElements";
import BottomSvg from "@/components/BottomSvg";
import LeftSvg from "@/components/LeftSvg";
import RightSvg from "@/components/RightSvg";
import { CanvoraIcon, CanvoraTitle } from "@/ui/Canvora";
import Link from "next/link";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

export default function SignInPage() {
	const { theme, setTheme, resolvedTheme } = useTheme();

	return (
		<div className="min-w-screen min-h-screen relative overflow-hidden bg-gradient-to-br from-canvora-50 via-white to-canvora-100 dark:from-gray-900 dark:via-gray-800 dark:to-canvora-900">
			{/* Background SVG elements */}
			<LeftSvg />
			<RightSvg />
			<BottomSvg />

			{/* Animated background */}
			<AnimatedBackground variant="signin" />

			{/* Floating elements */}
			<FloatingElements count={12} />

			<div className="min-h-screen h-fit w-full relative p-4 sm:p-6 lg:p-12 overflow-hidden flex flex-col items-center justify-center">
				{/* Logo section */}
				<motion.div
					className="relative z-10 mb-6 sm:mb-8"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					<Link
						href="/"
						className="p-2 flex items-center justify-center gap-2 sm:gap-3 group"
					>
						<motion.div
							whileHover={{ rotate: 360 }}
							transition={{ duration: 0.6, ease: "easeInOut" }}
						>
							<CanvoraIcon className="w-10 h-10 sm:w-12 sm:h-12" />
						</motion.div>
						<CanvoraTitle className="w-24 h-6 sm:w-32 sm:h-8 hidden sm:block group-hover:scale-105 transition-transform duration-300" />
					</Link>
				</motion.div>

				{/* Main content */}
				<motion.div
					className="w-full max-w-6xl mx-auto"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					<div className="w-full flex items-center justify-center">
						<motion.div
							className="relative mx-auto w-full max-w-md p-8 lg:p-10 flex flex-col items-center gap-6 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-700/20"
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								duration: 0.6,
								delay: 0.4,
								type: "spring",
								stiffness: 100,
								damping: 15,
							}}
							whileHover={{
								scale: 1.02,
								boxShadow:
									"0 25px 50px -12px rgba(0, 0, 0, 0.25)",
							}}
						>
							{/* Decorative border animation */}
							<div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-canvora-500 via-purple-500 to-blue-500 p-[1px]">
								<div className="h-full w-full rounded-3xl bg-white dark:bg-gray-900" />
							</div>

							{/* Theme toggle */}
							<motion.div
								className="absolute -top-6 -right-6 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer group z-10"
								onClick={() =>
									setTheme(
										resolvedTheme === "dark"
											? "light"
											: "dark"
									)
								}
								whileHover={{ scale: 1.1, rotate: 180 }}
								whileTap={{ scale: 0.9 }}
								transition={{ duration: 0.3 }}
							>
								<motion.div
									animate={{
										rotate:
											resolvedTheme === "dark" ? 180 : 0,
									}}
									transition={{
										duration: 0.5,
										ease: "easeInOut",
									}}
								>
									{resolvedTheme === "dark" ? (
										<svg
											className="w-5 h-5 text-yellow-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
												clipRule="evenodd"
											/>
										</svg>
									) : (
										<svg
											className="w-5 h-5 text-gray-700"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
										</svg>
									)}
								</motion.div>
							</motion.div>

							{/* Auth component */}
							<div className="relative z-10 w-full">
								<AuthPage type="signin" />
							</div>
						</motion.div>
					</div>

					{/* Terms and privacy */}
					<motion.div
						className="relative flex items-center justify-center mt-8"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.8 }}
					>
						<div className="flex items-center justify-center max-w-md">
							<p className="text-center text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
								By continuing you are agreeing to our{" "}
								<motion.a
									href="/"
									className="text-canvora-600 dark:text-canvora-400 font-medium no-underline hover:underline"
									target="_blank"
									rel="noreferrer"
									whileHover={{ scale: 1.05 }}
									transition={{ duration: 0.2 }}
								>
									Terms of Use
								</motion.a>{" "}
								and{" "}
								<motion.a
									href="/"
									className="text-canvora-600 dark:text-canvora-400 font-medium no-underline hover:underline"
									target="_blank"
									rel="noreferrer"
									whileHover={{ scale: 1.05 }}
									transition={{ duration: 0.2 }}
								>
									Privacy Policy
								</motion.a>
							</p>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
