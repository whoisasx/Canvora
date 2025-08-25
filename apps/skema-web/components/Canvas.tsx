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
import { usePropsStore } from "@/utils/propsStore";
import { useCanvasBgStore, useSelectedMessageStore } from "@/utils/canvasStore";

export default function Canvas({
	roomId,
	socket,
}: {
	roomId: string;
	socket: WebSocket;
}) {
	const background = useCanvasBgStore((state) => state.background);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [game, setGame] = useState<Game>();

	const tool = useToolStore((state) => state.tool);
	const props = usePropsStore();
	const setSelectedMessage = useSelectedMessageStore(
		(state) => state.setSelectedMessage
	);

	const propsSize = useToolStore((state) => state.props.length);

	useEffect(() => {
		if (!game) return;
		if (tool !== "mouse") {
			setSelectedMessage(null);
		}
		game.selectTool(tool, props);
	}, [game, tool, props]);

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
				style={{
					backgroundColor: `#${background}`,
				}}
				className={`min-h-screen min-w-screen`}
			/>

			<div
				className={`w-full px-3 absolute top-4 flex items-center justify-between pointer-events-none z-60`}
			>
				<div className="pointer-events-auto rounded-lg z-50">
					<ActionCard />
				</div>
				<div className="pointer-events-auto">
					<div className="w-xl h-12 border border-gray-300 rounded-lg shadow-md z-40 bg-white dark:bg-[#232329]">
						<CanvasTool />
					</div>
				</div>
				<div className="pointer-events-auto z-40">
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
				<div className="w-60 max-h-[70vh] overflow-auto border border-gray-300 fixed top-20 left-3 rounded-lg shadow-xl z-40 flex flex-col custom-scrollbar dark:custom-scrollbar bg-oc-white dark:bg-[#232329]">
					<CanvasOpt />
				</div>
			)}
		</div>
	);
}
