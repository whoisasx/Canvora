"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useDemoDashboardStore } from "@/utils/demoDashboardStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import toast from "react-hot-toast";

const categories = [
	{ value: "design", label: "Design", color: "bg-pink-500" },
	{ value: "development", label: "Development", color: "bg-blue-500" },
	{ value: "marketing", label: "Marketing", color: "bg-green-500" },
	{ value: "personal", label: "Personal", color: "bg-purple-500" },
];

const colors = [
	"#3B82F6", // blue
	"#8B5CF6", // purple
	"#EC4899", // pink
	"#10B981", // green
	"#F59E0B", // amber
	"#EF4444", // red
	"#06B6D4", // cyan
	"#84CC16", // lime
];

export function CreateProjectModal() {
	const { createModalOpen, setCreateModalOpen, addRoom } =
		useDemoDashboardStore();

	type FormData = {
		name: string;
		description: string;
		category: "design" | "development" | "marketing" | "personal";
		color: string;
	};

	const [formData, setFormData] = useState<FormData>({
		name: "",
		description: "",
		category: "design",
		color: colors[0] ?? "#3B82F6",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name.trim()) return;

		try {
			const response = await axios.post("/api/create-room", {
				name: formData.name,
				description: formData.description,
				category: formData.category,
				color: formData.color,
				participants: Math.floor(Math.random() * 10),
			});

			if (response.status === 201) {
				const room = response.data.data;
				const projectCreated = {
					id: room.id,
					name: room.name,
					slug: room.slug,
					isActive: room.isActive,
					createdAt: room.isActive,
					description: room.description,
					category: room.category,
					color: room.color,
					participants: room.participants,
					lastActivity: room.lastActivity,
				};
				toast.success("Room created.🎉");
				addRoom(projectCreated);
			} else {
				toast.error("Error creating project.❌");
			}
		} catch (err) {
			toast.error("Error creating project. ❌");
		} finally {
			setCreateModalOpen(false);
			setFormData({
				name: "",
				description: "",
				category: "design",
				color: colors[0] ?? "#3B82F6",
			});
		}
	};

	const handleClose = () => {
		setCreateModalOpen(false);
		setFormData({
			name: "",
			description: "",
			category: "design",
			color: colors[0] ?? "#3B82F6",
		});
	};

	return (
		<AnimatePresence>
			{createModalOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					onClick={handleClose}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{
							type: "spring",
							damping: 25,
							stiffness: 300,
						}}
						className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
							<h2 className="text-xl font-semibold text-slate-900 dark:text-white">
								Create New Project
							</h2>
							<button
								onClick={handleClose}
								className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
							>
								<XMarkIcon className="w-5 h-5 text-slate-400" />
							</button>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className="p-6 space-y-6">
							{/* Project Name */}
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Project Name
								</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) =>
										setFormData({
											...formData,
											name: e.target.value,
										})
									}
									placeholder="Enter project name..."
									className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									required
									autoFocus
								/>
							</div>

							{/* Description */}
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Description (Optional)
								</label>
								<textarea
									value={formData.description}
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
									placeholder="Enter project description..."
									rows={3}
									className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
								/>
							</div>

							{/* Category */}
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Category
								</label>
								<div className="grid grid-cols-2 gap-2">
									{categories.map((category) => (
										<button
											key={category.value}
											type="button"
											onClick={() =>
												setFormData({
													...formData,
													category:
														category.value as any,
												})
											}
											className={`p-3 rounded-lg border-2 transition-all ${
												formData.category ===
												category.value
													? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
													: "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
											}`}
										>
											<div className="flex items-center space-x-2">
												<div
													className={`w-3 h-3 rounded-full ${category.color}`}
												/>
												<span className="text-sm font-medium text-slate-700 dark:text-slate-300">
													{category.label}
												</span>
											</div>
										</button>
									))}
								</div>
							</div>

							{/* Color */}
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Color
								</label>
								<div className="flex space-x-2">
									{colors.map((color) => (
										<button
											key={color}
											type="button"
											onClick={() =>
												setFormData({
													...formData,
													color,
												})
											}
											className={`w-8 h-8 rounded-full border-2 transition-all ${
												formData.color === color
													? "border-slate-400 scale-110"
													: "border-slate-200 dark:border-slate-600 hover:scale-105"
											}`}
											style={{ backgroundColor: color }}
										/>
									))}
								</div>
							</div>

							{/* Preview */}
							<div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
								<div className="flex items-center space-x-3">
									<div
										className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
										style={{
											backgroundColor: formData.color,
										}}
									>
										{formData.name
											.charAt(0)
											.toUpperCase() || "P"}
									</div>
									<div>
										<h4 className="font-medium text-slate-900 dark:text-white">
											{formData.name || "Project Name"}
										</h4>
										<p className="text-sm text-slate-500 dark:text-slate-400">
											{formData.description ||
												"No description"}
										</p>
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className="flex space-x-3 pt-4">
								<button
									type="button"
									onClick={handleClose}
									className="flex-1 px-4 py-3 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={!formData.name.trim()}
									className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
								>
									Create Project
								</button>
							</div>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
