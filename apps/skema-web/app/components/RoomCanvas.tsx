"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Canvas from "./Canvas";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RoomCanvas({ roomId }: { roomId: string }) {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const router = useRouter();
	const { data: session, status } = useSession();
	let token: string;

	useEffect(() => {
		if (status == "loading") return;
		if (!session) {
			router.push("/signin");
			return;
		}

		const user = session.user;

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
				const ws = new WebSocket(`ws://localhost:8080/${token}`);
				ws.onopen = (e: Event) => {
					setSocket(ws);
					ws.send(
						JSON.stringify({
							type: "join-room",
							roomId,
						})
					);
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
		getConnection();
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
