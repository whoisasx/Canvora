"use client";

import { Button } from "@/ui/Button";
import { CanvoraIcon } from "@/ui/Canvora";
import FloatingThemeToggle from "@/components/FloatingThemeToggle";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

// Custom SVG icons
const HomeIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
		/>
	</svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M10 19l-7-7m0 0l7-7m-7 7h18"
		/>
	</svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
		/>
	</svg>
);

const CompassIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 12l4-4 4 4-4 4-4-4z"
		/>
	</svg>
);

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="min-h-screen min-w-screen transition-colors duration-500">
			<FloatingThemeToggle />
			<div className="min-h-screen min-w-screen p-5 relative bg-gradient-to-br from-canvora-50 via-canvora-100 to-canvora-200 dark:from-gray-900 dark:via-gray-800 dark:to-canvora-900 flex items-center justify-center">
				{/* Floating background elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<motion.div
						className="absolute top-20 left-10 w-32 h-32 bg-canvora-200 dark:bg-canvora-800 rounded-full opacity-20"
						animate={{
							y: [0, -20, 0],
							rotate: [0, 180, 360],
						}}
						transition={{
							duration: 6,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
					<motion.div
						className="absolute top-40 right-20 w-20 h-20 bg-canvora-300 dark:bg-canvora-700 rounded-full opacity-30"
						animate={{
							y: [0, 30, 0],
							x: [0, -10, 0],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
					<motion.div
						className="absolute bottom-32 left-1/4 w-24 h-24 bg-canvora-400 dark:bg-canvora-600 rounded-full opacity-25"
						animate={{
							scale: [1, 1.2, 1],
							rotate: [0, -180, -360],
						}}
						transition={{
							duration: 5,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				</div>

				{/* Main content */}
				<div className="text-center z-10 max-w-2xl mx-auto px-4">
					{/* 404 Animation */}
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="mb-8"
					>
						<div className="relative">
							<motion.h1
								className="text-8xl md:text-9xl font-bold text-canvora-600 dark:text-canvora-400 opacity-20 select-none"
								animate={{
									textShadow: [
										"0 0 0px rgba(105, 101, 219, 0.3)",
										"0 0 20px rgba(105, 101, 219, 0.5)",
										"0 0 0px rgba(105, 101, 219, 0.3)",
									],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							>
								404
							</motion.h1>
							<div className="absolute inset-0 flex items-center justify-center">
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.3, duration: 0.5 }}
									className="w-24 h-24 bg-gradient-to-br from-canvora-400 to-canvora-600 dark:from-canvora-500 dark:to-canvora-700 rounded-2xl flex items-center justify-center shadow-2xl"
								>
									<CanvoraIcon className="w-12 h-12 text-white" />
								</motion.div>
							</div>
						</div>
					</motion.div>

					{/* Error message */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.6 }}
						className="mb-8"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
							Oops! Page Not Found
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
							The page you're looking for seems to have vanished
							into the digital void.
						</p>
						<p className="text-base text-gray-500 dark:text-gray-500">
							Don't worry, even the best explorers sometimes take
							a wrong turn.
						</p>
					</motion.div>

					{/* Action buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.6 }}
						className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
					>
						<Link href="/">
							<Button
								size="large"
								level="primary"
								onClick={() => {}}
								className="!flex !items-center !space-x-2 !bg-gradient-to-r !from-canvora-500 !to-canvora-600 hover:!from-canvora-600 hover:!to-canvora-700 !text-white !px-6 !py-3 !rounded-xl !font-medium !shadow-lg hover:!shadow-xl !transition-all !duration-300 transform hover:!scale-105"
							>
								<span className="flex items-center justify-center gap-5">
									<HomeIcon className="w-5 h-5" />
									<div>Go Home</div>
								</span>
							</Button>
						</Link>

						<Button
							size="large"
							level="secondary"
							onClick={() => router.back()}
							className="!flex !items-center !space-x-2 !bg-white dark:!bg-gray-800 !border-2 !border-canvora-300 dark:!border-canvora-600 !text-canvora-600 dark:!text-canvora-400 hover:!bg-canvora-50 dark:hover:!bg-canvora-900/20 !px-6 !py-3 !rounded-xl !font-medium !shadow-lg hover:!shadow-xl !transition-all !duration-300 transform hover:!scale-105"
						>
							<span className="flex items-center justify-center gap-5">
								<ArrowLeftIcon className="w-5 h-5" />
								<span>Go Back</span>
							</span>
						</Button>
					</motion.div>

					{/* Quick navigation */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.6 }}
						className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto"
					>
						<Link
							href="/dashboard"
							className="group p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-canvora-200 dark:border-canvora-700 hover:border-canvora-400 dark:hover:border-canvora-500 transition-all duration-300 hover:shadow-lg"
						>
							<div className="flex flex-col items-center space-y-2">
								<div className="w-10 h-10 bg-gradient-to-br from-canvora-400 to-canvora-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<CompassIcon className="w-5 h-5 text-white" />
								</div>
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Dashboard
								</span>
							</div>
						</Link>

						<Link
							href="/free-board"
							className="group p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-canvora-200 dark:border-canvora-700 hover:border-canvora-400 dark:hover:border-canvora-500 transition-all duration-300 hover:shadow-lg"
						>
							<div className="flex flex-col items-center space-y-2">
								<div className="w-10 h-10 bg-gradient-to-br from-canvora-300 to-canvora-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<svg
										className="w-5 h-5 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
										/>
									</svg>
								</div>
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Free Board
								</span>
							</div>
						</Link>

						<div className="group p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-canvora-200 dark:border-canvora-700 cursor-not-allowed opacity-60">
							<div className="flex flex-col items-center space-y-2">
								<div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
									<SearchIcon className="w-5 h-5 text-white" />
								</div>
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Search
								</span>
							</div>
						</div>
					</motion.div>

					{/* Footer text */}
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1, duration: 0.6 }}
						className="mt-8 text-sm text-gray-500 dark:text-gray-500"
					>
						Lost? Let Canvora guide you back to creativity.
					</motion.p>
				</div>
			</div>
		</div>
	);
}
