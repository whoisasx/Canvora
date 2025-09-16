"use client";

import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function FloatingThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<motion.div
			className="fixed top-6 right-6 z-50"
			initial={{ scale: 0, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.5, delay: 0.5 }}
		>
			<motion.button
				onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				className="w-12 h-12 rounded-full bg-gradient-to-br from-canvora-100/90 to-canvora-200/90 dark:from-canvora-700/90 dark:to-canvora-800/90 hover:from-canvora-200 hover:to-canvora-300 dark:hover:from-canvora-600 dark:hover:to-canvora-700 flex items-center justify-center transition-all duration-300 ease-in-out border border-canvora-300/60 dark:border-canvora-600/60 hover:border-canvora-400 dark:hover:border-canvora-500 shadow-lg hover:shadow-xl backdrop-blur-md group relative overflow-hidden"
				aria-label="Toggle theme"
				whileHover={{ scale: 1.1, rotate: 180 }}
				whileTap={{ scale: 0.9 }}
			>
				{/* Glowing ring effect */}
				<motion.div
					className="absolute inset-0 rounded-full bg-gradient-to-r from-canvora-400/20 to-canvora-500/20 dark:from-canvora-500/20 dark:to-canvora-400/20"
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.6, 0.3],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				{/* Shimmer effect */}
				<div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>

				<motion.div
					key={theme}
					initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
					animate={{ rotate: 0, opacity: 1, scale: 1 }}
					exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
					transition={{
						duration: 0.4,
						type: "spring",
						stiffness: 200,
					}}
					className="relative z-10"
				>
					{theme === "dark" ? (
						<svg
							className="w-6 h-6 text-yellow-400 drop-shadow-sm"
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
							className="w-6 h-6 text-canvora-600 drop-shadow-sm"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
						</svg>
					)}
				</motion.div>

				{/* Tooltip */}
				<motion.div
					className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none"
					initial={{ opacity: 0, y: -5 }}
					whileHover={{ opacity: 1, y: 0 }}
				>
					Switch to {theme === "dark" ? "light" : "dark"} mode
					<div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45"></div>
				</motion.div>
			</motion.button>
		</motion.div>
	);
}
