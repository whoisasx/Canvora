"use client";

import { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SessionProvider } from "next-auth/react";

export default function CanvasClient({
	roomId,
	user,
	isActive,
}: {
	roomId: string;
	user: { username: string; id: string };
	isActive: boolean;
}) {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const router = useRouter();
	if (!roomId || !user) {
		toast.error("invalid link");
		router.push("/");
	}

	useEffect(() => {
		let token: string;
		const getConnection = async function () {
			try {
				const getToken = async function () {
					try {
						const response = await axios.post("/api/get-token", {
							user,
						});

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
				};

				ws.onerror = () => {
					toast.error("Server error 😢");
					router.push("/");
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
				router.push("/");
			}
		};
		if (user) getConnection();
	}, [roomId, user]);

	if (!socket) {
		return (
			<div className="flex h-screen w-screen items-center justify-center">
				<p>loading...</p>
			</div>
		);
	}

	return (
		<SessionProvider>
			<Canvas
				roomId={roomId}
				socket={socket}
				user={user}
				authenticated={false}
				isActive={isActive}
			/>
		</SessionProvider>
	);
}
