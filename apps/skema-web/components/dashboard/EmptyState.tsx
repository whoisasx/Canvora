"use client";

import { motion } from "motion/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface EmptyStateProps {
	type: "no-projects" | "no-search-results" | "no-favorites" | "no-recent";
	onCreateProject?: () => void;
	onClearSearch?: () => void;
}

export function EmptyState({
	type,
	onCreateProject,
	onClearSearch,
}: EmptyStateProps) {
	const getContent = () => {
		switch (type) {
			case "no-projects":
				return {
					icon: (
						<div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
							<PlusIcon className="w-12 h-12 text-blue-500" />
						</div>
					),
					title: "No projects yet",
					description:
						"Get started by creating your first canvas and collaborating with your team.",
					action: {
						text: "Create Your First Canvas",
						onClick: onCreateProject,
					},
				};
			case "no-search-results":
				return {
					icon: (
						<div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
							<MagnifyingGlassIcon className="w-12 h-12 text-slate-400" />
						</div>
					),
					title: "No projects found",
					description:
						"Try adjusting your search terms or filters to find what you're looking for.",
					action: onClearSearch
						? {
								text: "Clear Search",
								onClick: onClearSearch,
							}
						: undefined,
				};
			case "no-favorites":
				return {
					icon: (
						<div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center">
							<svg
								className="w-12 h-12 text-yellow-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
								/>
							</svg>
						</div>
					),
					title: "No favorite projects",
					description:
						"Star projects you love to see them here for quick access.",
					action: undefined,
				};
			case "no-recent":
				return {
					icon: (
						<div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full flex items-center justify-center">
							<svg
								className="w-12 h-12 text-green-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					),
					title: "No recent activity",
					description:
						"Projects you've worked on recently will appear here.",
					action: undefined,
				};
		}
	};

	const content = getContent();

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
			className="text-center py-16 px-6"
		>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.1, duration: 0.3 }}
				className="mb-6"
			>
				{content.icon}
			</motion.div>

			<motion.h3
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2, duration: 0.3 }}
				className="text-xl font-semibold text-slate-900 dark:text-white mb-2"
			>
				{content.title}
			</motion.h3>

			<motion.p
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.3 }}
				className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto"
			>
				{content.description}
			</motion.p>

			{content.action && (
				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.3 }}
					onClick={content.action.onClick}
					className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					{content.action.text}
				</motion.button>
			)}
		</motion.div>
	);
}
