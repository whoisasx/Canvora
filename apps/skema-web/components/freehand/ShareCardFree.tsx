"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { localUser } from "@/app/freehand/page";
import { IndexDB, SessionDB, StoredSession } from "@/lib/indexdb";

interface LocalSession {
	id: string;
	isActive: boolean;
	username: string;
}

export default function ShareCardFree({
	onSessionCreate,
	indexdb,
	user,
	sessiondb,
}: {
	onSessionCreate?: (roomId: string) => void;
	indexdb: IndexDB;
	user: localUser;
	sessiondb: SessionDB;
}) {
	const router = useRouter();
	const [localSession, setLocalSession] = useState<LocalSession | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [creating, setCreating] = useState(false);
	const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
	const [websocket, setWebsocket] = useState<WebSocket | null>(null);

	useEffect(() => {
		if (!user) return;

		async function localSessionSetter() {
			const sessions = await sessiondb.getAllSessions();
			// const storedRoom = localStorage.getItem("localRoom");
			const currentPath = window.location.pathname;
			const freehandMatch = currentPath.match(/^\/freehand\/(.+)$/);
			const session =
				sessions.find(
					(s) => s.id === (freehandMatch && freehandMatch[1])
				) || null;

			// If user is on a session URL and has matching localStorage
			if (freehandMatch && freehandMatch[1] && session) {
				setLocalSession({
					id: session.id,
					isActive: true,
					username: user.username,
				});
			} else if (session && session.id && !freehandMatch) {
				// User has localStorage but not on session URL - clear localStorage
				// localStorage.removeItem("localRoom");
				setLocalSession(null);
			}
		}
		localSessionSetter();
	}, [user]);

	useEffect(() => {
		return () => {
			if (websocket && websocket.readyState === WebSocket.OPEN) {
				if (localSession) {
					websocket.send(
						JSON.stringify({
							type: "leave-room",
							roomId: localSession.id,
						})
					);
				}
				websocket.close(1000, "Component unmounted");
			}
		};
	}, [websocket, localSession]);

	const handleCreateSession = async () => {
		if (!user) {
			toast.error("User data not available. Please refresh the page.");
			return;
		}

		setCreating(true);
		try {
			// Validate user data before making API call
			if (!user.id || !user.username) {
				throw new Error(
					"Invalid user data. User is missing id or username."
				);
			}

			const roomId = crypto.randomUUID();

			const response = await axios.post("/api/freehand-token", {
				user,
			});

			const { token } = response.data;
			if (!token) {
				throw new Error("No token received from server");
			}

			const ws = new WebSocket(
				`${process.env.NEXT_PUBLIC_WS_URL ?? "wss:canvora.asxcode.com"}?token=${token}&authflag=freehand`
			);

			if (!ws) {
				throw new Error("error getting connection");
			}

			ws.onopen = async () => {
				setWebsocket(ws);

				const messages = await indexdb.getAllMessages();
				ws.send(
					JSON.stringify({
						type: "join-room",
						roomId,
						userRole: "creator",
						messages,
					})
				);

				await sessiondb.createSession(roomId, messages);

				setLocalSession({
					id: roomId,
					isActive: true,
					username: user.username,
				});

				// Notify parent component with roomId
				if (onSessionCreate) {
					onSessionCreate(roomId);
				}

				// Navigate to the session URL in the same tab
				router.push(`/freehand/${roomId}`);

				toast.success("Session created! 🎉");

				// Close the modal since we're navigating
				setModalOpen(false);
			};

			ws.onerror = (error) => {
				toast.error("Server error 😢");
				router.push("/");
			};

			ws.onclose = (event) => {
				setWebsocket(null);

				if (event.code !== 1000 && !creating) {
					toast("Disconnected from server", {
						icon: "⚠️",
					});
				}
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorMessage =
					error.response?.data?.error ||
					"Failed to get authentication token";
				toast.error(`Connection failed: ${errorMessage} 😢`);
			} else if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Failed to create session 😢");
			}
		} finally {
			setCreating(false);
		}
	};

	const handleCopyShareLink = async () => {
		if (!localSession) return;

		try {
			const shareUrl = `${window.location.origin}/freehand/${localSession.id}`;
			await navigator.clipboard.writeText(shareUrl);
			toast.success("Share link copied to clipboard 📋");
		} catch (error) {
			toast.error("Failed to copy link");
		}
	};

	const handleLeaveSession = async () => {
		setShowLeaveConfirmation(true);
	};

	const confirmLeaveSession = async () => {
		try {
			if (
				websocket &&
				websocket.readyState === WebSocket.OPEN &&
				localSession
			) {
				websocket.send(
					JSON.stringify({
						type: "leave-room",
						roomId: localSession.id,
					})
				);

				websocket.close(1000, "User left session");
			}

			localSession && (await sessiondb.deleteSession(localSession.id));

			setWebsocket(null);

			setLocalSession(null);
			setShowLeaveConfirmation(false);

			router.push("/freehand");
			toast.success("Left the session 👋");
		} catch (error) {
			toast.error("Failed to leave session");
		}
	};

	return (
		<>
			<motion.div
				className={`w-15 h-9 rounded-lg transition-all duration-300 ease-in-out border ${
					localSession?.isActive
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
					{localSession?.isActive ? (
						<div className="flex items-center gap-1">
							<div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
							Live
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
											localSession?.isActive
												? "bg-green-500 animate-pulse"
												: "bg-gray-400"
										}`}
									></div>
									<div>
										<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
											{localSession?.isActive
												? "Live Session"
												: "Create Session"}
										</h3>
										<p className="text-xs text-canvora-600 dark:text-canvora-400">
											Freehand Canvas
										</p>
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

							{/* Session Info */}
							{localSession?.isActive ? (
								<div className="space-y-4">
									<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
										<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Session Status
										</span>
										<span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
											Active
										</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
										<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Session ID
										</span>
										<span className="text-sm text-gray-900 dark:text-white font-mono">
											{localSession.id}
										</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
										<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Username
										</span>
										<span className="text-sm text-gray-900 dark:text-white font-medium">
											{user.username}
										</span>
									</div>{" "}
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
											{`${typeof window !== "undefined" ? window.location.origin : ""}/freehand/${localSession.id}`}
										</div>
									</div>
									{/* Action Buttons */}
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
								</div>
							) : (
								<div className="space-y-4">
									<div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
										<div className="mb-3">
											<div className="w-12 h-12 bg-canvora-100 dark:bg-canvora-800 rounded-full flex items-center justify-center mx-auto mb-2">
												<svg
													className="w-6 h-6 text-canvora-600 dark:text-canvora-400"
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
											<h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
												Start Collaborative Session
											</h4>
											<p className="text-xs text-gray-600 dark:text-gray-400">
												Create a shareable link to
												invite others to your canvas
											</p>
										</div>
									</div>
									<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
										<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Your Username
										</span>
										<span className="text-sm text-gray-900 dark:text-white font-medium">
											{user.username}
										</span>
									</div>
									{/* Create Session Button */}
									<div className="mt-6">
										<motion.button
											onClick={handleCreateSession}
											disabled={creating}
											className="w-full px-4 py-2 bg-canvora-500 hover:bg-canvora-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
											whileHover={{
												scale: creating ? 1 : 1.02,
											}}
											whileTap={{
												scale: creating ? 1 : 0.98,
											}}
										>
											{creating ? (
												<div className="flex items-center justify-center gap-2">
													<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
													Creating Session...
												</div>
											) : (
												"Create Session"
											)}
										</motion.button>
									</div>
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
									This will end the session for you.
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
