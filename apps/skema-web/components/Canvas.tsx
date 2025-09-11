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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Canvas({
	roomId,
	socket,
	user,
	authenticated,
	isActive,
}: {
	roomId: string;
	socket: WebSocket;
	user?: { username: string; id: string };
	authenticated: boolean;
	isActive?: boolean;
}) {
	const { data: session } = useSession();
	const background = useCanvasBgStore((state) => state.background);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [game, setGame] = useState<Game>();

	// track viewport size so we can re-create the Game on resize if requested
	const [dimensions, setDimensions] = useState(() => ({
		w: typeof window !== "undefined" ? window.innerWidth : 0,
		h: typeof window !== "undefined" ? window.innerHeight : 0,
	}));

	const tool = useToolStore((state) => state.tool);
	const props = usePropsStore();

	// keep previous props to avoid reacting to identity-only changes
	const prevPropsRef = useRef<any>(null);
	// keep previous tool to detect tool-only changes
	const prevToolRef = useRef<string | null>(null);

	const shallowEq = (a: any, b: any) => {
		if (a === b) return true;
		if (!a || !b) return false;
		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);
		if (aKeys.length !== bKeys.length) return false;
		for (const k of aKeys) {
			const va = a[k];
			const vb = b[k];
			if (Array.isArray(va) && Array.isArray(vb)) {
				if (va.length !== vb.length) return false;
				for (let i = 0; i < va.length; i++)
					if (va[i] !== vb[i]) return false;
				continue;
			}
			if (
				typeof va === "object" &&
				va !== null &&
				typeof vb === "object" &&
				vb !== null
			) {
				const vaKeys = Object.keys(va);
				const vbKeys = Object.keys(vb);
				if (vaKeys.length !== vbKeys.length) return false;
				for (const kk of vaKeys) if (va[kk] !== vb[kk]) return false;
				continue;
			}
			if (va !== vb) return false;
		}
		return true;
	};
	const setSelectedMessage = useSelectedMessageStore(
		(state) => state.setSelectedMessage
	);

	const propsSize = useToolStore((state) => state.props.length);

	useEffect(() => {
		if (!game) return;

		// clear selected message when switching away from mouse
		if (tool !== "mouse") {
			setSelectedMessage(null);
		}

		const prev = prevPropsRef.current;
		const propsChanged = !shallowEq(prev ?? {}, props);
		const prevTool = prevToolRef.current;
		const toolChanged = prevTool !== tool;

		// call selectTool when tool changed or props changed meaningfully (or first run)
		if (propsChanged || prev === null || toolChanged) {
			prevPropsRef.current = props;
			prevToolRef.current = tool;
			game.selectTool(tool, props);
		}
	}, [game, tool, props]);

	useEffect(() => {
		if (canvasRef.current) {
			// ensure canvas element has current dimensions before creating Game
			canvasRef.current.width = dimensions.w;
			canvasRef.current.height = dimensions.h;

			const g = new Game(
				socket,
				canvasRef.current,
				roomId,
				authenticated,
				isActive
			);
			setGame(g);

			return () => {
				g.destructor();
			};
		}
	}, [canvasRef, dimensions.w, dimensions.h]);

	// update dimensions on window resize (debounced) and resize the canvas element
	useEffect(() => {
		let timer: number | null = null;
		const onResize = () => {
			if (timer) window.clearTimeout(timer);
			timer = window.setTimeout(() => {
				const w = window.innerWidth;
				const h = window.innerHeight;
				setDimensions({ w, h });
				if (canvasRef.current) {
					canvasRef.current.width = w;
					canvasRef.current.height = h;
				}
			}, 120);
		};

		window.addEventListener("resize", onResize);
		// run once to sync
		onResize();

		return () => {
			if (timer) window.clearTimeout(timer);
			window.removeEventListener("resize", onResize);
		};
	}, []);

	const router = useRouter();

	useEffect(() => {
		if (!game) return;
		if (user) {
			game.setUser(user);
			return;
		}
		if (!session) {
			router.push("/dashboard");
			return;
		}
		game.setUser({ username: session.user.username!, id: session.user.id });
	}, [session, game, router]);

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
				className={`w-full px-4 absolute top-3 flex items-center justify-between pointer-events-none z-60`}
			>
				<div className="pointer-events-auto rounded-lg z-50">
					<ActionCard />
				</div>
				<div className="pointer-events-auto">
					<div className="w-xl h-12 border border-gray-200 dark:border-0 rounded-lg shadow-md z-40 bg-white dark:bg-[#232329]">
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
					<UndoRedo game={game} />
				</div>
			</div>
			{propsSize > 0 && (
				<div className="w-55 max-h-[70vh] overflow-auto border border-gray-200 dark:border-0 fixed top-20 left-3 rounded-lg shadow-xl z-40 flex flex-col custom-scrollbar dark:custom-scrollbar bg-oc-white dark:bg-[#232329]">
					<CanvasOpt />
				</div>
			)}
		</div>
	);
}
