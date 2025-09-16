"use client";

import { motion, AnimatePresence } from "motion/react";
import { useDemoDashboardStore } from "@/utils/dashBoardStore";
import { ThemeToggle } from "./ThemeToggle";
import {
	HomeIcon,
	StarIcon,
	ClockIcon,
	TrashIcon,
	CogIcon,
	PlusIcon,
	MagnifyingGlassIcon,
	LinkIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { CanvoraIcon } from "@/ui/Canvora";
import { JoinSessionModal } from "./JoinSessionModal";

const navigation = [
	{ name: "All Projects", icon: HomeIcon, filter: "all" as const },
	{ name: "Recent", icon: ClockIcon, filter: "recent" as const },
	{ name: "Favorites", icon: StarIcon, filter: "favorites" as const },
	{ name: "Trash", icon: TrashIcon, filter: "trash" as const },
];

export function Sidebar() {
	const {
		sidebarOpen,
		setSidebarOpen,
		toggleSidebar,
		selectedFilter,
		setSelectedFilter,
		viewMode,
		setViewMode,
		searchQuery,
		setSearchQuery,
		setCreateModalOpen,
	} = useDemoDashboardStore();

	const [joinModalOpen, setJoinModalOpen] = useState(false);

	useEffect(() => {
		const handleWindowResize = () => {
			if (window.innerWidth > 1024) {
				setSidebarOpen(true);
			}
		};

		handleWindowResize(); // run on mount
		window.addEventListener("resize", handleWindowResize);

		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, [setSidebarOpen]);

	return (
		<>
			{/* Mobile overlay */}
			<AnimatePresence>
				{sidebarOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
						onClick={toggleSidebar}
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<AnimatePresence>
				{sidebarOpen && (
					<motion.aside
						initial={{ x: -320, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -320, opacity: 0 }}
						transition={{
							type: "spring",
							damping: 30,
							stiffness: 300,
						}}
						className="fixed lg:static inset-y-0 left-0 z-50 w-80 bg-canvora-50/50 dark:bg-gray-800/50 backdrop-blur-md border-r border-canvora-200 dark:border-canvora-600 flex flex-col shadow-xl shadow-canvora-100 dark:shadow-canvora-800"
					>
						{/* Header */}
						<div className="flex items-center justify-between p-7 border-b border-canvora-200 dark:border-canvora-600">
							<Link
								href="/"
								className="flex items-center space-x-3"
							>
								<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-canvora-400 to-canvora-600 dark:from-canvora-600 dark:to-canvora-800 flex items-center justify-center shadow-lg">
									<span className="text-white font-bold text-sm">
										<CanvoraIcon className="w-5 h-5" />
									</span>
								</div>
								<span className="text-2xl font-extrabold text-canvora-900 dark:text-white">
									Canvora
								</span>
							</Link>
							<button
								onClick={toggleSidebar}
								className="lg:hidden p-2 rounded-lg hover:bg-canvora-100 dark:hover:bg-canvora-800 transition-colors"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
						{/* Search */}
						<div className="p-6 border-b border-canvora-200 dark:border-canvora-600">
							<div className="relative">
								<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-canvora-400" />
								<input
									type="text"
									placeholder="Search projects..."
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									className="w-full pl-10 pr-4 py-2 bg-canvora-50/80 dark:bg-canvora-800/50 border border-canvora-200 dark:border-canvora-600 rounded-lg focus:ring-2 focus:ring-canvora-500 focus:border-transparent transition-all backdrop-blur-sm"
								/>
							</div>
						</div>

						{/* Navigation */}
						<nav className="flex-1 p-6 space-y-2">
							{navigation.map((item) => (
								<motion.button
									key={item.name}
									onClick={() =>
										setSelectedFilter(item.filter)
									}
									className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
										selectedFilter === item.filter
											? "bg-canvora-500 dark:bg-canvora-600 text-white shadow-lg"
											: "text-canvora-600 dark:text-canvora-400 hover:bg-canvora-100 dark:hover:bg-canvora-800 hover:text-canvora-900 dark:hover:text-white"
									}`}
									whileHover={{ x: 4 }}
									whileTap={{ scale: 0.98 }}
								>
									<item.icon className="w-5 h-5" />
									<span className="font-medium">
										{item.name}
									</span>
								</motion.button>
							))}
						</nav>

						{/* View Controls */}
						<div className="p-6 border-t border-canvora-200 dark:border-canvora-600">
							<div className="flex items-center justify-between mb-4">
								<span className="text-sm font-medium text-canvora-600 dark:text-canvora-400">
									View Mode
								</span>
								<div className="flex bg-canvora-100 dark:bg-canvora-800 rounded-lg p-1">
									<button
										onClick={() => setViewMode("grid")}
										className={`p-1.5 rounded-md transition-all ${
											viewMode === "grid"
												? "bg-white dark:bg-canvora-700 shadow-sm"
												: "hover:bg-canvora-200 dark:hover:bg-canvora-700"
										}`}
									>
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<rect
												x="3"
												y="3"
												width="8"
												height="8"
												rx="1"
												strokeWidth={2}
											/>
											<rect
												x="13"
												y="3"
												width="8"
												height="8"
												rx="1"
												strokeWidth={2}
											/>
											<rect
												x="3"
												y="13"
												width="8"
												height="8"
												rx="1"
												strokeWidth={2}
											/>
											<rect
												x="13"
												y="13"
												width="8"
												height="8"
												rx="1"
												strokeWidth={2}
											/>
										</svg>
									</button>
									<button
										onClick={() => setViewMode("list")}
										className={`p-1.5 rounded-md transition-all ${
											viewMode === "list"
												? "bg-white dark:bg-canvora-700 shadow-sm"
												: "hover:bg-canvora-200 dark:hover:bg-canvora-700"
										}`}
									>
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 6h16M4 12h16M4 18h16"
											/>
										</svg>
									</button>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="space-y-3">
								<motion.button
									onClick={() => setCreateModalOpen(true)}
									className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-canvora-500 to-canvora-600 text-white py-2.5 rounded-lg font-medium hover:from-canvora-600 hover:to-canvora-700 transition-all shadow-lg hover:shadow-xl"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<PlusIcon className="w-4 h-4" />
									<span>New Canvas</span>
								</motion.button>

								<motion.button
									onClick={() => setJoinModalOpen(true)}
									className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-canvora-400 to-canvora-500 text-white py-2.5 rounded-lg font-medium hover:from-canvora-500 hover:to-canvora-600 transition-all shadow-lg hover:shadow-xl"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<LinkIcon className="w-4 h-4" />
									<span>Join Session</span>
								</motion.button>
							</div>
						</div>

						{/* Footer */}
						<div className="p-6 border-t border-canvora-200 dark:border-canvora-600">
							<div className="flex items-center justify-between">
								<ThemeToggle />
								<button
									onClick={() => signOut(redirect("/"))}
									className="flex items-center space-x-2 text-canvora-600 dark:text-canvora-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										/>
									</svg>
									<span className="text-sm font-medium">
										Sign Out
									</span>
								</button>
							</div>
						</div>
					</motion.aside>
				)}
			</AnimatePresence>

			{/* Join Session Modal */}
			<JoinSessionModal
				isOpen={joinModalOpen}
				onClose={() => setJoinModalOpen(false)}
			/>
		</>
	);
}
