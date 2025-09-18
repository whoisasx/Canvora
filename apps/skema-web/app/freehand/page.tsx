"use client";

import FreeRoomCanvas from "@/components/freehand/FreeRoomCanvas";
import { IndexDB } from "@/lib/indexdb";
import { useEffect, useState } from "react";
import { generateUsername } from "unique-username-generator";

export interface localUser {
	id: string;
	username: string;
}
export type localRoom = string;

export default function () {
	const [user, setUser] = useState<localUser | null>(null);
	const [indexdb, setIndexdb] = useState<IndexDB | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const db = new IndexDB();
		setIndexdb(db);

		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			try {
				const parsedUser = JSON.parse(storedUser);
				setUser(parsedUser);
			} catch (error) {
				console.error("Failed to parse stored user:", error);
				// Create new user if parsing fails
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
	}, [mounted]);

	if (!mounted || !indexdb || !user) {
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

	return <FreeRoomCanvas indexdb={indexdb} user={user} />;
}
