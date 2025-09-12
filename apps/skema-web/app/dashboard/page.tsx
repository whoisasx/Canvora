"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "next-auth/react";
import { useDemoDashboardStore, DemoRoom } from "@/utils/demoDashboardStore";
import { Sidebar } from "@/components/demo/Sidebar";
import { ProjectCard } from "@/components/demo/ProjectCard";
import { CreateProjectModal } from "@/components/demo/CreateProjectModal";
import {
	Bars3Icon,
	MagnifyingGlassIcon,
	PlusIcon,
	FunnelIcon,
	LinkIcon,
} from "@heroicons/react/24/outline";
import { NotificationPanel } from "@/components/demo/NotificationPanel";
import { EmptyState } from "@/components/demo/EmptyState";
import { JoinSessionModal } from "@/components/demo/JoinSessionModal";
import toast from "react-hot-toast";
import axios from "axios";

export default function DemoDashboard() {
	const { data: session, status } = useSession();
	const [mounted, setMounted] = useState(false);
	const [joinModalOpen, setJoinModalOpen] = useState(false);

	const {
		sidebarOpen,
		toggleSidebar,
		rooms,
		setRooms,
		updateRoom,
		deleteRoom,
		selectedFilter,
		searchQuery,
		viewMode,
		createModalOpen,
		setCreateModalOpen,
		notifications,
		addNotification,
	} = useDemoDashboardStore();

	useEffect(() => {
		if (!session) {
			setMounted(true);
			return;
		}
		const fetchRooms = async () => {
			try {
				const response = await axios.get(
					`api/get-rooms/${session.user.id}`
				);
				if (!response.data.success) return;
				const allRooms = response.data.data;
				const pulledRooms = allRooms.map((room: any) => ({
					id: room.id,
					name: room.name,
					slug: room.slug,
					createdAt: room.createdAt,
					isActive: room.isActive,
					description: room.description,
					category: room.category,
					color: room.color,
					participants: room.participants,
					lastActivity: room.lastActivity,
				}));
				setRooms(pulledRooms as DemoRoom[]);
			} catch (error) {}
		};
		fetchRooms();
		setMounted(true);
	}, [session]);

	// Filter projects based on selected filter and search query
	const filteredProjects = rooms.filter((project) => {
		const matchesSearch =
			project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.description
				?.toLowerCase()
				.includes(searchQuery.toLowerCase());

		if (selectedFilter === "all") return matchesSearch;
		if (selectedFilter === "recent") {
			const recentDate = new Date();
			recentDate.setDate(recentDate.getDate() - 7);
			return matchesSearch && project.lastActivity > recentDate;
		}
		if (selectedFilter === "favorites") {
			// For demo purposes, we'll consider projects with high participant count as favorites
			return matchesSearch && project.participants > 5;
		}
		if (selectedFilter === "trash") {
			// For demo purposes, we'll consider old projects as trash
			const oldDate = new Date();
			oldDate.setMonth(oldDate.getMonth() - 3);
			return matchesSearch && project.createdAt < oldDate;
		}
		return matchesSearch;
	});

	const handleToggleActive = async (id: string) => {
		const project = rooms.find((p) => p.id === id);
		if (project) {
			updateRoom(id, { isActive: !project.isActive });
			addNotification({
				title: "Project Updated",
				message: `${project.name} session ${!project.isActive ? "started" : "stopped"}`,
				type: "info",
				read: false,
			});
			toast.success(
				`Session ${!project.isActive ? "started" : "stopped"}`
			);
			try {
				await axios.post("api/toggle-roomstate", {
					roomId: id,
				});
			} catch (err) {}
		}
	};

	const handleDelete = async (id: string) => {
		const project = rooms.find((p) => p.id === id);
		if (project) {
			deleteRoom(id);
			addNotification({
				title: "Project Deleted",
				message: `${project.name} has been deleted`,
				type: "warning",
				read: false,
			});
			toast.success("Canvas deleted");
			try {
				await axios.delete("/api/delete-room", {
					data: {
						id,
					},
				});
			} catch (error) {}
		}
	};

	const handleShare = (project: DemoRoom) => {
		const url = `${window.location.origin}/canvas/${project.slug}`;
		navigator.clipboard.writeText(url);
		addNotification({
			title: "Link Copied",
			message: `Share link for ${project.name} copied to clipboard`,
			type: "success",
			read: false,
		});
		toast.success("Link copied to clipboard");
	};

	if (!mounted || status === "loading") {
		return (
			<div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="h-screen w-screen bg-slate-50 dark:bg-slate-900 flex">
			{/* Sidebar */}
			<Sidebar />

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Header */}
				<header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<button
								onClick={toggleSidebar}
								className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
							>
								<Bars3Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
							</button>
							<div>
								<h1 className="text-2xl font-bold text-slate-900 dark:text-white">
									Projects
								</h1>
								<p className="text-slate-500 dark:text-slate-400">
									{filteredProjects.length} Project
									{filteredProjects.length !== 1 ? "s" : ""}
								</p>
							</div>
						</div>

						<div className="flex items-center space-x-3">
							{/* Search */}
							<div className="hidden md:block relative">
								<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
								<input
									type="text"
									placeholder="Search projects..."
									value={searchQuery}
									onChange={(e) =>
										useDemoDashboardStore
											.getState()
											.setSearchQuery(e.target.value)
									}
									className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-64"
								/>
							</div>

							{/* Notifications */}
							<NotificationPanel />

							{/* Join Session Button */}
							<motion.button
								onClick={() => setJoinModalOpen(true)}
								className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<LinkIcon className="w-4 h-4" />
								<span className="hidden sm:inline">
									Join Session
								</span>
							</motion.button>

							{/* Create Button */}
							<motion.button
								onClick={() => setCreateModalOpen(true)}
								className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<PlusIcon className="w-4 h-4" />
								<span className="hidden sm:inline">
									New Canvas
								</span>
							</motion.button>
						</div>
					</div>
				</header>

				{/* Content */}
				<main className="flex-1 overflow-auto p-6 demo-scrollbar">
					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover-lift"
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										Total Projects
									</p>
									<p className="text-2xl font-bold text-slate-900 dark:text-white">
										{rooms.length}
									</p>
								</div>
								<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
									<svg
										className="w-6 h-6 text-blue-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
										/>
									</svg>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover-lift"
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										Active Sessions
									</p>
									<p className="text-2xl font-bold text-slate-900 dark:text-white">
										{rooms.filter((p) => p.isActive).length}
									</p>
								</div>
								<div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
									<svg
										className="w-6 h-6 text-green-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover-lift"
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										Total Participants
									</p>
									<p className="text-2xl font-bold text-slate-900 dark:text-white">
										{rooms.reduce(
											(acc, p) => acc + p.participants,
											0
										)}
									</p>
								</div>
								<div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
									<svg
										className="w-6 h-6 text-purple-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
										/>
									</svg>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover-lift"
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										This Week
									</p>
									<p className="text-2xl font-bold text-slate-900 dark:text-white">
										{
											rooms.filter((p) => {
												const weekAgo = new Date();
												weekAgo.setDate(
													weekAgo.getDate() - 7
												);
												return p.lastActivity > weekAgo;
											}).length
										}
									</p>
								</div>
								<div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
									<svg
										className="w-6 h-6 text-orange-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
										/>
									</svg>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Projects Grid/List */}
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-slate-900 dark:text-white">
								{selectedFilter === "all"
									? "All Projects"
									: selectedFilter === "recent"
										? "Recent Projects"
										: selectedFilter === "favorites"
											? "Favorite Projects"
											: "Trash"}
							</h2>
							<div className="flex items-center space-x-2">
								<FunnelIcon className="w-4 h-4 text-slate-400" />
								<span className="text-sm text-slate-500 dark:text-slate-400">
									{filteredProjects.length} project
									{filteredProjects.length !== 1 ? "s" : ""}
								</span>
							</div>
						</div>

						{filteredProjects.length === 0 ? (
							<EmptyState
								type={
									searchQuery
										? "no-search-results"
										: "no-projects"
								}
								onCreateProject={() => setCreateModalOpen(true)}
								onClearSearch={
									searchQuery
										? () =>
												useDemoDashboardStore
													.getState()
													.setSearchQuery("")
										: undefined
								}
							/>
						) : (
							<div
								className={
									viewMode === "grid"
										? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
										: "space-y-4"
								}
							>
								<AnimatePresence>
									{filteredProjects.map((project, index) => (
										<motion.div
											key={project.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{
												opacity: 0,
												y: -20,
												scale: 0.95,
											}}
											transition={{ delay: index * 0.1 }}
										>
											<ProjectCard
												project={project}
												viewMode={viewMode}
												onToggleActive={
													handleToggleActive
												}
												onDelete={handleDelete}
												onShare={handleShare}
											/>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						)}
					</div>
				</main>
			</div>

			{/* Create Project Modal */}
			<CreateProjectModal />

			{/* Join Session Modal */}
			<JoinSessionModal
				isOpen={joinModalOpen}
				onClose={() => setJoinModalOpen(false)}
			/>
		</div>
	);
}
