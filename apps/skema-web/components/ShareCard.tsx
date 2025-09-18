"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";

interface Room {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
	adminId: string;
}

export default function ShareCard({
	roomId,
	username,
	socket,
}: {
	roomId: string;
	username: string | undefined | null;
	socket?: WebSocket;
}) {
	const { data: session } = useSession();
	const [room, setRoom] = useState<Room | null>(null);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [toggling, setToggling] = useState(false);
	const [isParticipant, setIsParticipant] = useState(false);
	const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);

	// Fetch room information
	useEffect(() => {
		const fetchRoomInfo = async () => {
			if (!roomId) return;

			try {
				// Use the new public room-info API to get room details
				const roomResponse = await axios.get(
					`/api/room-info/${roomId}`
				);

				if (roomResponse.data.roomInfo) {
					const roomInfo = roomResponse.data.roomInfo;

					// Try to get full room details as owner if user is authenticated
					if (session?.user?.id) {
						try {
							const ownerResponse = await axios.get(
								`/api/get-rooms/${session.user.id}`
							);
							if (ownerResponse.data.success) {
								const rooms = ownerResponse.data.data;
								const currentRoom = rooms.find(
									(r: Room) => r.id === roomId
								);
								if (currentRoom) {
									// User is the owner
									setRoom(currentRoom);
									setIsParticipant(false);
									return;
								}
							}
						} catch (ownerError) {
							// Not an owner, continue as participant
						}
					}

					// User is a participant or not authenticated - use public room info
					setRoom({
						id: roomInfo.id,
						name: "Session",
						slug: roomInfo.slug,
						isActive: roomInfo.isActive,
						adminId: "", // Unknown admin ID for participants
					});
					setIsParticipant(true);
				}
			} catch (error) {
				console.error("Failed to fetch room info:", error);
				toast.error("Failed to load room information");

				// Fallback to default values if API fails
				setRoom({
					id: roomId,
					name: "Session",
					slug: "",
					isActive: true, // Assume active if user can access the canvas
					adminId: "",
				});
				setIsParticipant(true);
			} finally {
				setLoading(false);
			}
		};

		fetchRoomInfo();
	}, [roomId, session?.user?.id]);

	const handleToggleSession = async () => {
		if (!room || !session?.user) return;

		setToggling(true);
		try {
			const response = await axios.post("/api/toggle-roomstate", {
				roomId: room.id,
			});

			if (response.data.success) {
				const newState = !room.isActive;
				setRoom({ ...room, isActive: newState });
				toast.success(
					newState ? "Session started 🎉" : "Session stopped 🛑"
				);
			}
		} catch (error) {
			console.error("Failed to toggle session:", error);
			toast.error("Failed to update session 😢");
		} finally {
			setToggling(false);
		}
	};

	const handleCopyShareLink = async () => {
		if (!room) return;

		try {
			let shareUrl;
			if (room.slug) {
				shareUrl = `${window.location.origin}/canvas/${room.slug}`;
			} else {
				// Fallback to current URL if slug is not available
				shareUrl = window.location.href;
			}
			await navigator.clipboard.writeText(shareUrl);
			toast.success("Share link copied to clipboard 📋");
		} catch (error) {
			toast.error("Failed to copy link");
		}
	};

	const handleLeaveSession = async () => {
		if (!isParticipant) return;
		setShowLeaveConfirmation(true);
	};

	const confirmLeaveSession = async () => {
		try {
			// Send leave-room message if WebSocket is connected
			if (socket && socket.readyState === WebSocket.OPEN && room) {
				console.log(
					"Sending leave-room message for authenticated session"
				);
				socket.send(
					JSON.stringify({
						type: "leave-room",
						roomId: room.id,
					})
				);

				// Give a small delay to ensure message is sent before navigation
				await new Promise((resolve) => setTimeout(resolve, 100));
			}

			setShowLeaveConfirmation(false);
			// Navigate away from the room
			window.location.href = "/dashboard";
			toast.success("Left the session 👋");
		} catch (error) {
			console.error("Error leaving session:", error);
			toast.error("Failed to leave session");
		}
	};

	const isOwner = session?.user?.id === room?.adminId;

	if (loading) {
		return (
			<div className="w-15 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
		);
	}

	return (
		<>
			<motion.div
				className={`w-15 h-9 rounded-lg transition-all duration-300 ease-in-out border ${
					room?.isActive
						? "bg-green-500 hover:bg-green-600 border-green-600 dark:bg-green-600 dark:hover:bg-green-700 dark:border-green-700"
						: "bg-canvora-600 dark:bg-canvora-800 hover:bg-canvora-700 dark:hover:bg-canvora-600 border-canvora-600 dark:border-canvora-800"
				} shadow-lg hover:shadow-xl backdrop-blur-md`}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
			>
				<button
					className="w-full h-full flex justify-center items-center cursor-pointer text-white font-medium text-sm"
					onClick={() => setModalOpen(true)}
				>
					{room?.isActive ? (
						<div className="flex items-center gap-1">
							<div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
							{isParticipant ? "Joined" : "Live"}
						</div>
					) : (
						"Share"
					)}
				</button>
			</motion.div>

			{/* Session Modal */}
			<AnimatePresence>
				{modalOpen && (
					<motion.div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setModalOpen(false)}
					>
						<motion.div
							className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-canvora-200 dark:border-canvora-600 shadow-2xl"
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header */}
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3">
									<div
										className={`w-3 h-3 rounded-full ${
											room?.isActive
												? "bg-green-500 animate-pulse"
												: "bg-gray-400"
										}`}
									></div>
									<div>
										<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
											Session Status
										</h3>
										{isParticipant && (
											<p className="text-xs text-canvora-600 dark:text-canvora-400">
												Participant
											</p>
										)}
										{isOwner && (
											<p className="text-xs text-green-600 dark:text-green-400">
												Room Owner
											</p>
										)}
									</div>
								</div>
								<button
									onClick={() => setModalOpen(false)}
									className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
								>
									<svg
										className="w-5 h-5 text-gray-500"
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

							{/* Status Info */}
							<div className="space-y-4">
								<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
									<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Session
									</span>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${
											room?.isActive
												? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
												: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
										}`}
									>
										{room?.isActive ? "Active" : "Inactive"}
									</span>
								</div>

								{username && (
									<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
										<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Username
										</span>
										<span className="text-sm text-gray-900 dark:text-white font-medium">
											{username}
										</span>
									</div>
								)}

								{room?.isActive && (
									<div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
												Share Link
											</span>
											<button
												onClick={handleCopyShareLink}
												className="px-2 py-1 text-xs bg-canvora-100 hover:bg-canvora-200 dark:bg-canvora-800 dark:hover:bg-canvora-700 text-canvora-700 dark:text-canvora-300 rounded transition-colors"
											>
												Copy
											</button>
										</div>
										<div className="text-xs text-gray-500 dark:text-gray-400 break-all">
											{room.slug
												? `${typeof window !== "undefined" ? window.location.origin : ""}/canvas/${room.slug}`
												: window.location.href}
										</div>
									</div>
								)}
							</div>

							{/* Action Buttons */}
							{isOwner ? (
								<div className="mt-6 flex gap-3">
									<motion.button
										onClick={handleToggleSession}
										disabled={toggling}
										className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
											room?.isActive
												? "bg-red-500 hover:bg-red-600 text-white"
												: "bg-green-500 hover:bg-green-600 text-white"
										} disabled:opacity-50 disabled:cursor-not-allowed`}
										whileHover={{
											scale: toggling ? 1 : 1.02,
										}}
										whileTap={{
											scale: toggling ? 1 : 0.98,
										}}
									>
										{toggling ? (
											<div className="flex items-center justify-center gap-2">
												<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
												Updating...
											</div>
										) : room?.isActive ? (
											"Stop Session"
										) : (
											"Start Session"
										)}
									</motion.button>
								</div>
							) : isParticipant && room?.isActive ? (
								<div className="mt-6 flex gap-2">
									<motion.button
										onClick={handleCopyShareLink}
										className="flex-1 px-4 py-2 bg-canvora-500 hover:bg-canvora-600 text-white rounded-lg font-medium transition-all duration-200"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										Share Link
									</motion.button>
									<motion.button
										onClick={handleLeaveSession}
										className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										Leave
									</motion.button>
								</div>
							) : room?.isActive ? (
								<div className="mt-6">
									<motion.button
										onClick={handleCopyShareLink}
										className="w-full px-4 py-2 bg-canvora-500 hover:bg-canvora-600 text-white rounded-lg font-medium transition-all duration-200"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										Copy Share Link
									</motion.button>
								</div>
							) : (
								<div className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
									<p className="text-sm text-amber-700 dark:text-amber-300">
										This session is currently inactive.
										Contact the room owner to start the
										session.
									</p>
								</div>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Leave Confirmation Modal */}
			<AnimatePresence>
				{showLeaveConfirmation && (
					<motion.div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowLeaveConfirmation(false)}
					>
						<motion.div
							className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-red-200 dark:border-red-600 shadow-2xl"
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header */}
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
										<svg
											className="w-5 h-5 text-red-600 dark:text-red-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
											/>
										</svg>
									</div>
									<div>
										<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
											Leave Session
										</h3>
										<p className="text-xs text-red-600 dark:text-red-400">
											Confirm your action
										</p>
									</div>
								</div>
								<button
									onClick={() =>
										setShowLeaveConfirmation(false)
									}
									className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
								>
									<svg
										className="w-5 h-5 text-gray-500"
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

							{/* Content */}
							<div className="mb-6">
								<p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
									Are you sure you want to leave this session?
								</p>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3">
								<motion.button
									onClick={() =>
										setShowLeaveConfirmation(false)
									}
									className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-200"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									Cancel
								</motion.button>
								<motion.button
									onClick={confirmLeaveSession}
									className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									Leave Session
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
