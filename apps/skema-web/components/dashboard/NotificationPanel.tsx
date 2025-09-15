"use client";

import { motion, AnimatePresence } from "motion/react";
import { useDemoDashboardStore } from "@/utils/dashBoardStore";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function NotificationPanel() {
	const { notifications, markNotificationAsRead, clearAllNotifications } =
		useDemoDashboardStore();
	const [isOpen, setIsOpen] = useState(false);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case "success":
				return (
					<div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
						<svg
							className="w-4 h-4 text-green-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
				);
			case "warning":
				return (
					<div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
						<svg
							className="w-4 h-4 text-yellow-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
							/>
						</svg>
					</div>
				);
			case "error":
				return (
					<div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
						<svg
							className="w-4 h-4 text-red-500"
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
					</div>
				);
			default:
				return (
					<div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
						<svg
							className="w-4 h-4 text-blue-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
				);
		}
	};

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative"
			>
				<BellIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
				{unreadCount > 0 && (
					<motion.span
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
					>
						{unreadCount > 9 ? "9+" : unreadCount}
					</motion.span>
				)}
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: -10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -10 }}
						transition={{ duration: 0.2 }}
						className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50"
					>
						<div className="p-4 border-b border-slate-200 dark:border-slate-700">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-slate-900 dark:text-white">
									Notifications
								</h3>
								{notifications.length > 0 && (
									<button
										onClick={clearAllNotifications}
										className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
									>
										Clear all
									</button>
								)}
							</div>
						</div>

						<div className="max-h-96 overflow-y-auto">
							{notifications.length === 0 ? (
								<div className="p-6 text-center">
									<div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
										<BellIcon className="w-6 h-6 text-slate-400" />
									</div>
									<p className="text-slate-500 dark:text-slate-400">
										No notifications
									</p>
								</div>
							) : (
								<div className="divide-y divide-slate-200 dark:divide-slate-700">
									{notifications.map((notification) => (
										<motion.div
											key={notification.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
												!notification.read
													? "bg-blue-50 dark:bg-blue-900/10"
													: ""
											}`}
											onClick={() =>
												markNotificationAsRead(
													notification.id
												)
											}
										>
											<div className="flex items-start space-x-3">
												{getNotificationIcon(
													notification.type
												)}
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-slate-900 dark:text-white">
														{notification.title}
													</p>
													<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
														{notification.message}
													</p>
													<p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
														{new Date(
															notification.createdAt
														).toLocaleString()}
													</p>
												</div>
												{!notification.read && (
													<div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
												)}
											</div>
										</motion.div>
									))}
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
