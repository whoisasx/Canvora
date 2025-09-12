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
import { Button } from "@/ui/Button";
import Link from "next/link";
import { excali } from "@/app/font";
import { CanvoraIcon, CanvoraTitle } from "@/ui/Canvora";

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

	const [dimensions, setDimensions] = useState(() => ({
		w: typeof window !== "undefined" ? window.innerWidth : 0,
		h: typeof window !== "undefined" ? window.innerHeight : 0,
	}));

	const tool = useToolStore((state) => state.tool);
	const props = usePropsStore();
	const prevPropsRef = useRef<any>(null);
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
	const router = useRouter();

	const [showIntro, setShowIntro] = useState(false);
	const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);

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

	// Effect to handle intro overlay visibility based on canvas state
	useEffect(() => {
		if (!game) return;

		// Check if canvas is empty when game is initialized
		const checkCanvasEmpty = () => {
			const messages = game.getMessages ? game.getMessages() : [];
			const isEmpty = messages.length === 0;
			setIsCanvasEmpty(isEmpty);
			setShowIntro(isEmpty);
		};

		// Check initially
		checkCanvasEmpty();

		// Listen for message changes to update empty state
		const handleMessageChange = () => {
			const messages = game.getMessages ? game.getMessages() : [];
			const isEmpty = messages.length === 0;
			setIsCanvasEmpty(isEmpty);

			// Hide intro when user starts drawing (canvas is no longer empty)
			if (!isEmpty) {
				setShowIntro(false);
			}
		};

		// Set up message change listener
		game.onMessageChange = handleMessageChange;

		return () => {
			game.onMessageChange = undefined;
		};
	}, [game]);

	// Effect to hide intro when tool is selected
	useEffect(() => {
		if (tool !== "mouse" && showIntro) {
			setShowIntro(false);
		}
	}, [tool, showIntro]);

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

	useEffect(() => {
		socket.addEventListener("message", (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "reload" && data.roomId === roomId) {
				// Show intro overlay when canvas is reset
				setShowIntro(true);
				setIsCanvasEmpty(true);
			}
		});
	}, [socket, roomId]);

	return (
		<div className="min-h-screen min-w-screen relative">
			{!authenticated && (
				<div className="w-screen z-50 h-10 absolute bottom-10 pointer-events-none flex items-center justify-center gap-5">
					<p className="pointer-events-auto text-oc-red-9 dark:text-oc-red-2">
						Page is under progress. please sign in.
					</p>
					<Link
						href={"/signin"}
						target="_blank"
						className="pointer-events-auto"
					>
						<Button
							size="small"
							level="primary"
							onClick={() => console.log("sign in")}
						>
							Sign in
						</Button>
					</Link>
				</div>
			)}
			{showIntro && (
				<div className="h-screen w-screen fixed inset-0 flex flex-col gap-5 items-center justify-center pointer-events-none">
					<div className="text-center">
						<div className="flex items-center justify-center gap-2">
							<CanvoraIcon className="w-15 h-15" />
							<h1
								className={`text-7xl font-extrabold font-excali ${excali.variable} dark:text-canvora-300 text-canvora-600`}
							>
								Canvora
							</h1>
						</div>
					</div>

					<div className={`font-excali ${excali.variable}`}>
						All your data is saved.
					</div>

					<div className="flex flex-col gap-3 w-80 text-xs opacity-60">
						<button
							type="button"
							className="flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity"
						>
							<div className="size-8">
								<svg
									className="size-8"
									viewBox="0 0 20 20"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.25"
								>
									<path d="m9.257 6.351.183.183H15.819c.34 0 .727.182 1.051.506.323.323.505.708.505 1.05v5.819c0 .316-.183.7-.52 1.035-.337.338-.723.522-1.037.522H4.182c-.352 0-.74-.181-1.058-.5-.318-.318-.499-.705-.499-1.057V5.182c0-.351.181-.736.5-1.054.32-.321.71-.503 1.057-.503H6.53l2.726 2.726Z" />
								</svg>
							</div>
							<div>Cmd+O</div>
						</button>

						<button
							type="button"
							className="flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity"
						>
							<div className="size-8">
								<svg
									className="size-8"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.25"
								>
									<g>
										<path
											stroke="none"
											d="M0 0h24v24H0z"
											fill="none"
										/>
										<circle cx="9" cy="7" r="4" />
										<path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
										<path d="M16 3.13a4 4 0 0 1 0 7.75" />
										<path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
									</g>
								</svg>
							</div>
							<div>Live collaboration...</div>
						</button>

						<a
							href="#"
							className="flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity"
						>
							<div className="size-8">
								<svg
									className="size-8"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.25"
								>
									<g>
										<path
											stroke="none"
											d="M0 0h24v24H0z"
											fill="none"
										/>
										<path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
										<path d="M21 12h-13l3 -3" />
										<path d="M11 15l-3 -3" />
									</g>
								</svg>
							</div>
							<div>Sign up</div>
						</a>
					</div>

					<div
						className={`absolute top-15 left-10 text-xl text-gray-400 flex items-center gap-3 font-excali ${excali.variable} flex items-baseline-last`}
					>
						<svg
							className="w-16 h-16 text-gray-400"
							viewBox="0 0 100 100"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M90 90 Q40 70 20 20" />
							<polygon
								points="14,24 20,18 26,24"
								fill="currentColor"
							/>
						</svg>
						<span className="mt-12">
							Export, preferences, languages…
						</span>
					</div>
					<div
						className={`absolute top-15 left-1/2 text-xl text-gray-400 flex flex-col items-start font-excali ${excali.variable} flex items-baseline-last w-auto`}
					>
						<svg
							className="w-16 h-16 text-gray-400 "
							viewBox="0 0 100 100"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M90 90 Q40 70 20 20" />
							<polygon
								points="14,24 20,18 26,24"
								fill="currentColor"
							/>
						</svg>
						<div className="ml-16">
							<p>Pick a tool &</p>
							<p> start drawing!</p>
						</div>
					</div>
				</div>
			)}
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
					<ActionCard roomId={roomId} game={game} />
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
