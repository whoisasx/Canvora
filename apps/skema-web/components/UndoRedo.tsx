"use client";
import { Game } from "@/app/draw/draw";
import { useEffect } from "react";

export default function UndoRedo({ game }: { game: Game | undefined }) {
	useEffect(() => {
		if (!game) return;
	}, [game]);
	return (
		<div className="h-10 w-20 border rounded-xl bg-white/80 dark:bg-gray-900/80 border-canvora-200/50 dark:border-canvora-600/30 flex shadow-lg backdrop-blur-md hover:shadow-xl transition-all duration-300">
			<button
				className="h-full hover:bg-canvora-100/50 dark:hover:bg-canvora-800/50 flex-1 flex items-center justify-center rounded-l-xl transition-all duration-200"
				onClick={() => (game !== undefined ? game.undo() : "")}
			>
				<div
					className="w-full h-full flex items-center justify-center"
					aria-hidden="true"
					aria-disabled="false"
				>
					<svg
						aria-hidden="true"
						focusable="false"
						role="img"
						viewBox="0 0 20 20"
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path
							d="M7.5 10.833 4.167 7.5 7.5 4.167M4.167 7.5h9.166a3.333 3.333 0 0 1 0 6.667H12.5"
							strokeWidth="1.25"
						></path>
					</svg>
				</div>
			</button>

			<button
				className="h-full hover:bg-canvora-100/50 dark:hover:bg-canvora-800/50 flex-1 flex items-center justify-center rounded-r-xl transition-all duration-200"
				onClick={() => (game !== undefined ? game.redo() : "")}
			>
				<div
					className="w-full h-full flex items-center justify-center"
					aria-hidden="true"
					aria-disabled="true"
				>
					<svg
						aria-hidden="true"
						focusable="false"
						role="img"
						viewBox="0 0 20 20"
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path
							d="M12.5 10.833 15.833 7.5 12.5 4.167M15.833 7.5H6.667a3.333 3.333 0 1 0 0 6.667H7.5"
							strokeWidth="1.25"
						></path>
					</svg>
				</div>
			</button>
		</div>
	);
}
