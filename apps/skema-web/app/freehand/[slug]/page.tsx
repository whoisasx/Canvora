"use client";

import { useEffect, useState } from "react";
import { localRoom, localUser } from "../page";
import { IndexDB } from "@/lib/indexdb";
import { generateUsername } from "unique-username-generator";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import FreeRoomCanvas from "@/components/freehand/FreeRoomCanvas";
import jwt from "jsonwebtoken";
import { Message } from "@/app/draw/draw";

export default async function ({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const router = useRouter();
	const slug = (await params).slug;
	if (!slug) {
		router.push("/");
		toast.error("invalid link. ❌");
	}

	const [user, setUser] = useState<localUser | null>(null);
	const [roomId, setRoomId] = useState<localRoom | null>(null);
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [indexdb, setIndexdb] = useState<IndexDB | null>(null);

	useEffect(() => {
		if (!indexdb) {
			const tempIndexdb = new IndexDB();
			setIndexdb(tempIndexdb);
		}
		const getNewUser = (): localUser => {
			return {
				id: crypto.randomUUID(),
				username: generateUsername("", 0),
			};
		};

		const storedUser = localStorage.getItem("user");
		if (!storedUser) {
			const newUser = getNewUser();
			localStorage.setItem("user", JSON.stringify(newUser));
			setUser(newUser);
		} else {
			setUser(JSON.parse(storedUser));
		}
		setRoomId(slug);
	}, []);

	useEffect(() => {
		if (!user || !roomId || !indexdb) {
			return;
		}

		const token = jwt.sign(user, process.env.JWT_SECRET ?? "wrong-secret", {
			expiresIn: "1h",
		});

		const ws = new WebSocket(
			`${process.env.NEXT_PUBLIC_WS_URL ?? "wss:canvora.asxcode.com"}?token=${token}&authflag=freehand&roomId=${roomId}`
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
	}, [user, roomId, indexdb]);

	if (!user || !indexdb || !roomId || !socket) {
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
			user={user}
			sessionData={{ roomId, socket }}
			indexdb={indexdb}
		/>
	);
}
