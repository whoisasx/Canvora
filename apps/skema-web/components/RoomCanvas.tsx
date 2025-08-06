"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RoomCanvas({ roomId }: { roomId: string }) {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status == "loading") return;
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

				const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
				ws.onopen = (e: Event) => {
					setSocket(ws);
					ws.send(JSON.stringify({ type: "join-room", roomId }));
				};

				ws.onerror = () => {
					console.log("server error");
					router.push("/dashboard");
				};

				return () => {
					ws.close();
				};
			} catch (error) {
				console.log("error: ", error);
				router.push("/dashboard");
			}
		};
		if (session) getConnection();
	}, [session, status, roomId, router]);

	if (!socket || status === "loading" || !session) {
		return (
			<>
				<div>loading...</div>
			</>
		);
	}

	return (
		<>
			<Canvas roomId={roomId} socket={socket} />
		</>
	);
}
