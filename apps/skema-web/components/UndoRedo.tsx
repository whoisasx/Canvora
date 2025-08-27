"use client";
import { Game } from "@/app/draw/draw";
import { useEffect } from "react";

export default function UndoRedo({ game }: { game: Game | undefined }) {
	useEffect(() => {
		if (!game) return;
	}, [game]);
	return (
		<div className="h-10 w-20 border rounded-lg bg-oc-gray-3 dark:bg-[#232329] border-gray-300 dark:border-gray-600 flex">
			<button
				className="h-full hover:bg-oc-gray-2 flex-1 flex items-center justify-center rounded-l-lg dark:hover:bg-oc-gray-8"
				onClick={() => (game !== undefined ? game.undo() : "")}
			>
				{"u"}
			</button>

			<button
				className="h-full hover:bg-oc-gray-2 flex-1 flex items-center justify-center rounded-r-lg dark:hover:bg-oc-gray-8"
				onClick={() => (game !== undefined ? game.redo() : "")}
			>
				{"r"}
			</button>
		</div>
	);
}
