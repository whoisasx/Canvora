"use client";

import { motion } from "motion/react";
import { DemoRoom } from "@/utils/demoDashboardStore";
import {
	StarIcon,
	EyeIcon,
	ShareIcon,
	EllipsisVerticalIcon,
	PlayIcon,
	PauseIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { MouseEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProjectCardProps {
	project: DemoRoom;
	viewMode: "grid" | "list";
	onToggleActive: (id: string) => void;
	onDelete: (id: string) => void;
	onShare: (project: DemoRoom) => void;
}

export function ProjectCard({
	project,
	viewMode,
	onToggleActive,
	onDelete,
	onShare,
}: ProjectCardProps) {
	const [isFavorited, setIsFavorited] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const router = useRouter();

	const handleShare: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.stopPropagation();
		onShare(project);
		setShowMenu(false);
	};

	const handleToggleActive: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.stopPropagation();
		onToggleActive(project.id);
		setShowMenu(false);
	};

	const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.stopPropagation();
		onDelete(project.id);
		setShowMenu(false);
	};

	if (viewMode === "list") {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.2 }}
				className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-all duration-300 group"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4 flex-1">
						<div
							className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
							style={{ backgroundColor: project.color }}
						>
							{project.name.charAt(0).toUpperCase()}
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
								{project.name}
							</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400 truncate">
								{project.description || "No description"}
							</p>
							<div className="flex items-center space-x-4 mt-1">
								<span className="text-xs text-slate-400 dark:text-slate-500">
									{project.participants} participants
								</span>
								<span className="text-xs text-slate-400 dark:text-slate-500">
									{project.category}
								</span>
								<span className="text-xs text-slate-400 dark:text-slate-500">
									{new Date(
										project.lastActivity
									).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<button
							onClick={() => setIsFavorited(!isFavorited)}
							className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
						>
							{isFavorited ? (
								<StarSolidIcon className="w-4 h-4 text-yellow-500" />
							) : (
								<StarIcon className="w-4 h-4 text-slate-400" />
							)}
						</button>
						<div className="relative">
							<button
								onClick={() => setShowMenu(!showMenu)}
								className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
							>
								<EllipsisVerticalIcon className="w-4 h-4 text-slate-400" />
							</button>
							{showMenu && (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20"
								>
									<button
										onClick={handleToggleActive}
										className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2"
									>
										{project.isActive ? (
											<>
												<PauseIcon className="w-4 h-4" />
												<span>Stop Session</span>
											</>
										) : (
											<>
												<PlayIcon className="w-4 h-4" />
												<span>Start Session</span>
											</>
										)}
									</button>
									<button
										onClick={handleShare}
										className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2"
									>
										<ShareIcon className="w-4 h-4" />
										<span>Share</span>
									</button>
									<button
										onClick={handleDelete}
										className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
									>
										<TrashIcon className="w-4 h-4" />
										<span>Delete</span>
									</button>
								</motion.div>
							)}
						</div>
					</div>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.2 }}
			className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
		>
			{/* Header */}
			<div
				className="h-32 relative "
				style={{ backgroundColor: project.color + "20" }}
			>
				<div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
				<div className="absolute top-4 left-4 right-4 flex justify-between items-start">
					<div
						className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
						style={{ backgroundColor: project.color }}
					>
						{project.name.charAt(0).toUpperCase()}
					</div>
					<div className="flex items-center space-x-1">
						<button
							onClick={(e) => {
								e.stopPropagation();
								setIsFavorited(!isFavorited);
							}}
							className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
						>
							{isFavorited ? (
								<StarSolidIcon className="w-4 h-4 text-yellow-400" />
							) : (
								<StarIcon className="w-4 h-4 text-white" />
							)}
						</button>
						<div className="relative">
							<button
								onClick={(e) => {
									e.stopPropagation();
									setShowMenu(!showMenu);
								}}
								className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
							>
								<EllipsisVerticalIcon className="w-4 h-4 text-white" />
							</button>
							{showMenu && (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									className="z-10 absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1"
								>
									<button
										onClick={handleToggleActive}
										className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2"
									>
										{project.isActive ? (
											<>
												<PauseIcon className="w-4 h-4" />
												<span>Stop Session</span>
											</>
										) : (
											<>
												<PlayIcon className="w-4 h-4" />
												<span>Start Session</span>
											</>
										)}
									</button>
									<button
										onClick={handleShare}
										className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2"
									>
										<ShareIcon className="w-4 h-4" />
										<span>Share</span>
									</button>
									<button
										onClick={handleDelete}
										className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
									>
										<TrashIcon className="w-4 h-4" />
										<span>Delete</span>
									</button>
								</motion.div>
							)}
						</div>
					</div>
				</div>
				<div className="absolute bottom-4 left-4 right-4">
					<h3 className="text-white font-semibold text-lg truncate drop-shadow-lg">
						{project.name}
					</h3>
					<p className="text-white/80 text-sm truncate drop-shadow">
						{project.description || "No description"}
					</p>
				</div>
			</div>

			{/* Content */}
			<Link href={`/canvas/${project.slug}`} target="_blank">
				<div className="p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300 ease-in-out">
					<div className="flex items-center justify-between mb-3">
						<span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
							{project.category}
						</span>
						<div className="flex items-center space-x-1 text-slate-400">
							<EyeIcon className="w-4 h-4" />
							<span className="text-sm">
								{project.participants}
							</span>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-xs text-slate-500 dark:text-slate-400">
							{new Date(
								project.lastActivity
							).toLocaleDateString()}
						</span>
						<div
							className={`px-2 py-1 rounded-full text-xs font-medium ${
								project.isActive
									? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
									: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
							}`}
						>
							{project.isActive ? "Active" : "Inactive"}
						</div>
					</div>
				</div>
			</Link>
		</motion.div>
	);
}
