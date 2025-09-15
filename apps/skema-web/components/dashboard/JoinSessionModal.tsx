"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useDemoDashboardStore } from "@/utils/demoDashboardStore";
import { XMarkIcon, LinkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface JoinSessionModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function JoinSessionModal({ isOpen, onClose }: JoinSessionModalProps) {
	const [link, setLink] = useState("");

	const validateUrl = (
		url: string
	): { isValid: boolean; slug?: string; error?: string } => {
		try {
			// Remove any whitespace
			const cleanUrl = url.trim();

			// If it's just a slug, prepend the current origin
			if (!cleanUrl.includes("://")) {
				const slug = cleanUrl.replace(/^\/+|\/+$/g, ""); // Remove leading/trailing slashes
				if (slug && !slug.includes("/")) {
					return { isValid: true, slug };
				}
			}

			// Parse the URL
			const urlObj = new URL(cleanUrl);
			const currentOrigin = window.location.origin;

			// Check if the origin matches
			if (urlObj.origin !== currentOrigin) {
				return {
					isValid: false,
					error: `URL must be from ${currentOrigin}`,
				};
			}

			// Check if the path matches /canvas/[slug] pattern
			const pathMatch = urlObj.pathname.match(/^\/canvas\/([^\/]+)$/);
			if (!pathMatch) {
				return {
					isValid: false,
					error: "URL must be in the format /canvas/[slug]",
				};
			}

			return { isValid: true, slug: pathMatch[1] };
		} catch (error) {
			return {
				isValid: false,
				error: "Invalid URL format",
			};
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!link.trim()) return;

		const validation = validateUrl(link);
		if (!validation.isValid) {
			toast.error(validation.error || "Invalid URL");
			return;
		}

		// Open canvas in new tab
		window.open(`/canvas/${validation.slug}`, "_blank");
		onClose();
		setLink("");
	};

	const handleClose = () => {
		onClose();
		setLink("");
	};

	const handlePaste = async () => {
		try {
			const text = await navigator.clipboard.readText();
			setLink(text);
		} catch (error) {
			toast.error("Failed to read clipboard");
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
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
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
									<LinkIcon className="w-5 h-5 text-white" />
								</div>
								<div>
									<h2 className="text-xl font-semibold text-slate-900 dark:text-white">
										Join Session
									</h2>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										Paste a session link to join
									</p>
								</div>
							</div>
							<button
								onClick={handleClose}
								className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
							>
								<XMarkIcon className="w-5 h-5 text-slate-400" />
							</button>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className="p-6 space-y-6">
							{/* Link Input */}
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									Session Link
								</label>
								<div className="relative">
									<input
										type="text"
										value={link}
										onChange={(e) =>
											setLink(e.target.value)
										}
										placeholder="Paste session link or enter slug..."
										className="w-full px-4 py-3 pr-20 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
										required
										autoFocus
									/>
									<button
										type="button"
										onClick={handlePaste}
										className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
									>
										Paste
									</button>
								</div>
								<p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
									Enter a full URL or just the slug (e.g.,
									"my-session")
								</p>
							</div>

							{/* Examples */}
							<div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
								<h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
									Examples:
								</h4>
								<div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
									<p>
										• {window.location.origin}
										/canvas/my-session
									</p>
									<p>• my-session</p>
									<p>• /canvas/team-meeting</p>
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
									disabled={!link.trim()}
									className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center space-x-2"
								>
									<LinkIcon className="w-4 h-4" />
									<span>Join Session</span>
								</button>
							</div>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
