"use client";

import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
		);
	}

	return (
		<motion.button
			onClick={() =>
				setTheme(resolvedTheme === "dark" ? "light" : "dark")
			}
			className="relative w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden group"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			transition={{ type: "spring", stiffness: 400, damping: 17 }}
		>
			<motion.div
				className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
				animate={{ opacity: resolvedTheme === "dark" ? 0.1 : 0 }}
			/>

			<motion.div
				key={theme}
				initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
				animate={{ opacity: 1, scale: 1, rotate: 0 }}
				exit={{ opacity: 0, scale: 0.8, rotate: 180 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="relative z-10"
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
						className="w-5 h-5 text-slate-700"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
					</svg>
				)}
			</motion.div>
		</motion.button>
	);
}
