"use client";
import { Game } from "@/app/draw/draw";
import { useEffect, useRef, useState } from "react";
import CanvasTool from "./CanvasTool";
import CanvasOpt from "./CanvasOpt";
import useToolStore from "@/utils/toolStore";
import ActionCard from "./ActionCard";
import ShareCard from "./ShareCard";
import ZoomBar from "./ZoomBar";
import UndoRedo from "./UndoRedo";
import { useZoomStore } from "@/utils/canvasStore";

export default function Canvas({
	roomId,
	socket,
}: {
	roomId: string;
	socket: WebSocket;
}) {
	const zoom = useZoomStore((state) => state.zoom);
	const setZoom = useZoomStore((state) => state.setZoom);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [game, setGame] = useState<Game>();

	const propsSize = useToolStore((state) => state.props.length);

	// useEffect(() => {
	// 	if (!game) return;
	// 	game.selectTool(tool);
	// }, [game, tool]);

	useEffect(() => {
		if (canvasRef.current) {
			const g = new Game(socket, canvasRef.current, roomId);
			setGame(g);

			return () => {
				g.destructor();
			};
		}
	}, [canvasRef]);

	return (
		<div className="min-h-screen min-w-screen relative">
			<canvas
				ref={canvasRef}
				height={window.innerHeight}
				width={window.innerWidth}
				className="bg-zinc-100 min-h-screen min-w-screen"
			/>

			<div className="w-full px-3 absolute top-4 flex items-center justify-between pointer-events-none">
				<div className="pointer-events-auto rounded-lg">
					<ActionCard />
				</div>
				<div className="pointer-events-auto">
					<div className="w-xl h-12 border border-gray-300 rounded-lg shadow-md z-10 bg-white dark:bg-[#232329]">
						<CanvasTool />
					</div>
				</div>
				<div className="pointer-events-auto">
					<ShareCard />
				</div>
			</div>
			<div className="w-auto flex gap-2 pointer-events-none absolute bottom-4 px-3">
				<div className="pointer-events-auto">
					<ZoomBar />
				</div>
				<div className="pointer-events-auto">
					<UndoRedo />
				</div>
			</div>
			{propsSize > 0 && (
				<div className="w-60 max-h-[70vh] overflow-auto border border-gray-300 fixed top-20 left-3 rounded-lg shadow-xl z-10 flex flex-col custom-scrollbar dark:custom-scrollbar bg-oc-white dark:bg-[#232329]">
					<CanvasOpt />
				</div>
			)}
		</div>
	);
}
