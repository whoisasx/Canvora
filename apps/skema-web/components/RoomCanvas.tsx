"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function RoomCanvas({ roomId }: { roomId: string }) {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "loading") return;
		if (!session) {
			router.push("/signin");
			return;
		}

		let token: string;
		const getConnection = async function () {
			try {
				const getToken = async function () {
					try {
						const response = await axios.get("/api/get-token");

						if (response.data.success) {
							token = response.data.data;
							return;
						}
						throw new Error("error response");
					} catch (error) {
						throw new Error("error");
					}
				};
				await getToken();

				const ws = new WebSocket(
					`${process.env.NEXT_PUBLIC_WS_URL ?? "wss:canvora.asxcode.com"}?token=${token}`
				);

				ws.onopen = () => {
					setSocket(ws);
					ws.send(JSON.stringify({ type: "join-room", roomId }));
					// toast.success("Connected to room 🎉");
				};

				ws.onerror = () => {
					toast.error("Server error 😢");
					router.push("/dashboard");
				};

				ws.onclose = () => {
					toast("Disconnected from server");
				};

				return () => {
					ws.close();
				};
			} catch (error) {
				console.log("error: ", error);
				toast.error("Failed to connect ❌");
				router.push("/dashboard");
			}
		};

		if (session) getConnection();
	}, [session, status, roomId, router]);

	if (!socket || status === "loading" || !session) {
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

	return <Canvas roomId={roomId} socket={socket} authenticated={true} />;
}
