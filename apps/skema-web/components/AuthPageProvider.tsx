import { Button } from "@/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { signIn } from "next-auth/react";
import { useState, useMemo } from "react";

export default function AuthPage({ type }: { type: "signup" | "signin" }) {
	const [isLoading, setIsLoading] = useState(false);

	const handleSignIn = async (provider: string) => {
		setIsLoading(true);
		try {
			await signIn(provider, { redirectTo: "/dashboard" });
		} catch (error) {
			console.error("Sign in error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Generate consistent floating particles to avoid hydration issues
	const floatingParticles = useMemo(() => {
		// Use a seeded random function to ensure consistent values
		const seededRandom = (seed: number) => {
			const x = Math.sin(seed) * 10000;
			return x - Math.floor(x);
		};

		return Array.from({ length: 6 }, (_, i) => ({
			id: i,
			left: seededRandom(i * 1.7) * 100,
			top: seededRandom(i * 2.3) * 100,
			duration: 3 + seededRandom(i * 3.1) * 2,
			delay: seededRandom(i * 4.7) * 2,
		}));
	}, []);

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
	};

	const floatingVariants = {
		animate: {
			y: [0, -10, 0],
			transition: {
				duration: 2,
				repeat: Infinity,
				ease: "easeInOut",
			},
		},
	};

	return (
		<motion.div
			className="flex flex-col items-center justify-center gap-6 w-full max-w-md mx-auto"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			{/* Floating particles background */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{floatingParticles.map((particle) => (
					<motion.div
						key={particle.id}
						className="absolute w-2 h-2 bg-canvora-300/30 rounded-full"
						style={{
							left: `${particle.left}%`,
							top: `${particle.top}%`,
						}}
						animate={{
							y: [0, -20, 0],
							opacity: [0.3, 0.8, 0.3],
							scale: [1, 1.2, 1],
						}}
						transition={{
							duration: particle.duration,
							repeat: Infinity,
							delay: particle.delay,
							ease: "easeInOut",
						}}
					/>
				))}
			</div>

			{/* Header with icon */}
			<motion.div
				className="flex flex-col items-center gap-4"
				variants={itemVariants}
			>
				<motion.div
					className="relative"
					variants={containerVariants}
					animate="animate"
				>
					<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-canvora-400 to-canvora-600 dark:from-canvora-600 dark:to-canvora-800 flex items-center justify-center shadow-2xl mb-2">
						<svg
							className="w-8 h-8 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					{/* Pulse effect */}
					<div className="absolute inset-0 w-16 h-16 rounded-2xl bg-canvora-400/20 animate-pulse" />
				</motion.div>

				<div className="text-center">
					<h2 className="text-3xl font-bold bg-gradient-to-r from-canvora-600 to-canvora-800 dark:from-canvora-400 dark:to-canvora-600 bg-clip-text text-transparent mb-2">
						{type === "signup" ? "Join Canvora" : "Welcome Back"}
					</h2>
					<p className="text-gray-600 dark:text-gray-300 text-sm">
						{type === "signup"
							? "Create your account and start collaborating"
							: "Sign in to continue your creative journey"}
					</p>
				</div>
			</motion.div>

			{/* Provider buttons */}
			<motion.div
				className="flex flex-col w-full gap-3"
				variants={itemVariants}
			>
				<motion.div
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					<button
						className="w-full h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={() => handleSignIn("github")}
						disabled={isLoading}
					>
						<Image
							src="/github.svg"
							alt="GitHub"
							width={20}
							height={20}
							className="w-5 h-5 dark:filter dark:invert group-hover:scale-110 transition-transform duration-200"
						/>
						<span className="text-gray-700 dark:text-gray-200 font-medium">
							Continue with GitHub
						</span>
					</button>
				</motion.div>

				<motion.div
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					<button
						className="w-full h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={() => handleSignIn("google")}
						disabled={isLoading}
					>
						<Image
							src="/google.svg"
							alt="Google"
							width={20}
							height={20}
							className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
						/>
						<span className="text-gray-700 dark:text-gray-200 font-medium">
							Continue with Google
						</span>
					</button>
				</motion.div>
			</motion.div>

			{/* Divider */}
			<motion.div
				className="relative flex h-5 items-center justify-center gap-4 w-full"
				variants={itemVariants}
			>
				<div className="flex-1 border-t border-gray-300 dark:border-gray-600" />
				<span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-transparent px-2 font-medium">
					OR
				</span>
				<div className="flex-1 border-t border-gray-300 dark:border-gray-600" />
			</motion.div>

			{/* Switch auth type link */}
			<motion.div className="text-center" variants={itemVariants}>
				<p className="text-sm text-gray-600 dark:text-gray-400">
					{type === "signup"
						? "Already have an account?"
						: "Don't have an account?"}
				</p>
				<Link
					href={type === "signup" ? "/signin" : "/signup"}
					className="text-canvora-600 dark:text-canvora-400 font-semibold hover:text-canvora-700 dark:hover:text-canvora-300 transition-colors duration-200 text-sm mt-1 inline-block"
				>
					{type === "signup" ? "Sign in instead" : "Create account"}
				</Link>
			</motion.div>

			{/* Loading state */}
			{isLoading && (
				<motion.div
					className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-4xl"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<div className="flex items-center gap-2">
						<div className="w-5 h-5 border-2 border-canvora-600 border-t-transparent rounded-full animate-spin" />
						<span className="text-sm text-gray-600 dark:text-gray-300">
							Signing you in...
						</span>
					</div>
				</motion.div>
			)}
		</motion.div>
	);
}
