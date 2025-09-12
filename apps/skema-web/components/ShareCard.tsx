import { DemoRoom, useDemoDashboardStore } from "@/utils/demoDashboardStore";
import { useEffect, useState } from "react";

export default function ShareCard({ roomId }: { roomId: string }) {
	const { rooms } = useDemoDashboardStore();
	const [room, setRoom] = useState<DemoRoom | null>(null);
	useEffect(() => {
		if (!roomId) return;
		rooms.forEach((room) => {
			if (room.id === roomId) setRoom(room);
		});
	}, [roomId]);

	return (
		<div
			className={`w-15 h-9 rounded-lg bg-canvora-600 dark:bg-canvora-800 hover:bg-canvora-300 hover:text-black dark:hover:bg-canvora-600 dark:hover:text-white transition-all duration-300 ease-in-out`}
		>
			<button className="w-full h-full flex justify-center items-center cursor-pointer text-white dark:text-black font-light">
				Share
			</button>
		</div>
	);
}
