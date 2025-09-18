"use client";

import { useEffect, useState } from "react";
import { localUser } from "../page";
import { IndexDB, SessionDB } from "@/lib/indexdb";
import { generateUsername } from "unique-username-generator";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import FreeRoomCanvas from "@/components/freehand/FreeRoomCanvas";
import { Message } from "@/app/draw/draw";
import axios from "axios";

export default function FreehandSlugPage() {
	const router = useRouter();
	const params = useParams();
	const slug = params.slug as string;

	const [roomId, setRoomId] = useState<string | null>(null);
	const [user, setUser] = useState<localUser | null>(null);
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [indexdb, setIndexdb] = useState<IndexDB | null>(null);
	const [sessiondb, setSessiondb] = useState<SessionDB | null>(null);
	const [mounted, setMounted] = useState(false);

	// Handle client-side mounting
	useEffect(() => {
		setMounted(true);
	}, []);

	// Validate slug on mount
	useEffect(() => {
		if (!slug) {
			router.push("/");
			toast.error("invalid link. ❌");
			return;
		}
	}, [slug, router]);

	useEffect(() => {
		if (!slug || !mounted) return;

		if (!indexdb) {
			const tempIndexdb = new IndexDB();
			setIndexdb(tempIndexdb);
		}
		if (!sessiondb) {
			const sdb = new SessionDB();
			setSessiondb(sdb);
		}

		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			try {
				const parsedUser = JSON.parse(storedUser);
				setUser(parsedUser);
			} catch (error) {
				const newUser: localUser = {
					id: crypto.randomUUID(),
					username: generateUsername("", 0),
				};
				localStorage.setItem("user", JSON.stringify(newUser));
				setUser(newUser);
			}
		} else {
			const newUser: localUser = {
				id: crypto.randomUUID(),
				username: generateUsername("", 0),
			};
			localStorage.setItem("user", JSON.stringify(newUser));
			setUser(newUser);
		}

		setRoomId(slug);
	}, [slug, mounted, indexdb]);

	useEffect(() => {
		if (!roomId || !indexdb || !mounted || !user || !sessiondb) {
			return;
		}

		let ws: WebSocket | null = null;

		const connectToWebSocket = async () => {
			try {
				const storedUser = localStorage.getItem("user");
				if (!storedUser) {
					toast.error(
						"User data not found. Please refresh the page."
					);
					router.push("/freehand");
					return;
				}

				const user = JSON.parse(storedUser);
				const response = await axios.post("/api/freehand-token", {
					user,
				});

				const { token } = response.data;
				if (!token) {
					throw new Error("No token received from server");
				}

				ws = new WebSocket(
					`${process.env.NEXT_PUBLIC_WS_URL ?? "wss:canvora.asxcode.com"}?token=${token}&authflag=freehand`
				);

				ws.onopen = () => {
					setSocket(ws);

					ws?.send(
						JSON.stringify({
							type: "join-room",
							roomId,
							userRole: "participant",
						})
					);
				};

				ws.onerror = (error) => {
					toast.error("Server error 😢");
					router.push("/");
				};

				ws.onclose = (event) => {
					setSocket(null);

					if (event.code !== 1000) {
						toast("Disconnected from server. Reconnecting...", {
							icon: "🔄",
						});

						setTimeout(() => {
							connectToWebSocket();
						}, 2000);
					}
				};
			} catch (error) {
				if (axios.isAxiosError(error)) {
					const errorMessage =
						error.response?.data?.error ||
						"Failed to get authentication token";
					toast.error(`Connection failed: ${errorMessage} 😢`);
				} else {
					toast.error("Failed to connect to server 😢");
				}

				router.push("/");
			}
		};

		connectToWebSocket();

		return () => {
			if (ws && ws.readyState === WebSocket.OPEN) {
				ws.send(
					JSON.stringify({
						type: "leave-room",
						roomId: roomId,
					})
				);
				ws.close(1000, "User navigated away");
				sessiondb && sessiondb.deleteSession(roomId);
			}
		};
	}, [roomId, indexdb, router, mounted, sessiondb]);

	if (!mounted || !indexdb || !roomId || !socket || !user || !sessiondb) {
		return (
			<div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
				{/* Animated Logo */}
				<div className="relative mb-8">
					<div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse shadow-2xl"></div>
					<div className="absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 animate-ping opacity-20"></div>
				</div>

				{/* Loading Text */}
				<div className="text-center space-y-2">
					<h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 animate-pulse">
						Loading Workspace
					</h2>
					<p className="text-slate-600 dark:text-slate-400">
						Preparing your canvas...
					</p>
				</div>

				{/* Loading Dots */}
				<div className="flex space-x-2 mt-6">
					<div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
					<div
						className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
						style={{ animationDelay: "0.1s" }}
					></div>
					<div
						className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
						style={{ animationDelay: "0.2s" }}
					></div>
				</div>
			</div>
		);
	}

	return (
		<FreeRoomCanvas
			sessionData={{ roomId, socket }}
			indexdb={indexdb}
			user={user}
			sessiondb={sessiondb}
		/>
	);
}
