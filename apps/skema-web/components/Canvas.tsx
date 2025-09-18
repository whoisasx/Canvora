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
import { motion, AnimatePresence } from "motion/react";
import CanvasIntroOverlay from "./CanvasIntroOverlay";

export default function Canvas({
	roomId,
	socket,
}: {
	roomId: string;
	socket: WebSocket;
}) {
	const { data: session } = useSession();
	const background = useCanvasBgStore((state) => state.background);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [game, setGame] = useState<Game>();

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
	const [hideInstantly, setHideInstantly] = useState(false);
	const [hasUserInteracted, setHasUserInteracted] = useState(false);

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
			// Only show intro if canvas is truly empty (initial state) and user hasn't interacted yet
			if (isEmpty && !hasUserInteracted) {
				setHideInstantly(false); // Reset instant hide flag
				setShowIntro(true);
			}
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
				setHasUserInteracted(true); // Mark that user has interacted
				setHideInstantly(true);
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
			setHasUserInteracted(true); // Mark that user has interacted
			setHideInstantly(true);
			setShowIntro(false);
		}
	}, [tool, showIntro]);

	useEffect(() => {
		if (canvasRef.current) {
			// ensure canvas element has current dimensions before creating Game
			canvasRef.current.width = window.innerWidth;
			canvasRef.current.height = window.innerHeight;

			const g = new Game(socket, canvasRef.current, roomId);
			setGame(g);

			return () => {
				g.destructor();
			};
		}
	}, [canvasRef]);

	useEffect(() => {
		if (!game) return;
		if (!session?.user) {
			router.push("/dashboard");
			return;
		}
		game.setUser({ username: session.user.username!, id: session.user.id });
	}, [session, game, router]);

	useEffect(() => {
		socket.addEventListener("message", (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "reload" && data.roomId === roomId) {
				// Show intro overlay when canvas is reset - reset interaction state
				setHasUserInteracted(false); // Reset interaction state on canvas reset
				setHideInstantly(false); // Reset instant hide flag for reset scenario
				setShowIntro(true);
				setIsCanvasEmpty(true);
			}
		});
	}, [socket, roomId]);

	if (!canvasRef) {
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
						Loading canvas
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
		<div className="min-h-screen min-w-screen relative">
			<CanvasIntroOverlay
				showIntro={showIntro}
				hideInstantly={hideInstantly}
			/>
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
				<motion.div
					className="pointer-events-auto rounded-lg z-50"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
				>
					<ActionCard
						sessionData={{ socket, roomId }}
						authenticated={true}
					/>
				</motion.div>
				<motion.div
					className="pointer-events-auto"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
				>
					<div className="w-xl h-12 border border-canvora-200/50 dark:border-canvora-600/30 rounded-xl shadow-lg backdrop-blur-md z-40 bg-white/80 dark:bg-gray-900/80 hover:shadow-xl transition-all duration-300">
						<CanvasTool />
					</div>
				</motion.div>
				<motion.div
					className="pointer-events-auto z-40"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
				>
					<ShareCard
						roomId={roomId}
						username={session?.user.username}
						socket={socket}
					/>
				</motion.div>
			</div>
			<div className="w-auto flex gap-3 pointer-events-none absolute bottom-4 px-3">
				<motion.div
					className="pointer-events-auto"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
				>
					<ZoomBar />
				</motion.div>
				<motion.div
					className="pointer-events-auto"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
				>
					<UndoRedo game={game} />
				</motion.div>
			</div>
			<AnimatePresence>
				{propsSize > 0 && (
					<motion.div
						className="w-55 max-h-[70vh] overflow-auto border border-canvora-200/50 dark:border-canvora-600/30 fixed top-20 left-3 rounded-xl shadow-xl backdrop-blur-md z-40 flex flex-col custom-scrollbar dark:custom-scrollbar bg-white/90 dark:bg-gray-900/90"
						initial={{ opacity: 0, x: -20, scale: 0.95 }}
						animate={{ opacity: 1, x: 0, scale: 1 }}
						exit={{ opacity: 0, x: -20, scale: 0.95 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
					>
						<CanvasOpt />
					</motion.div>
				)}
			</AnimatePresence>
			{/* Permanent End-to-End Encryption Icon */}
			<motion.div
				className="fixed bottom-6 right-6 group pointer-events-auto z-50"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.4, delay: 0.5 }}
			>
				<div className="relative">
					<div className="p-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-lg border border-canvora-200/30 dark:border-canvora-600/30 text-green-600 dark:text-green-400 shadow-lg">
						<svg
							className="w-6 h-6"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M11.553 22.894a.998.998 0 00.894 0s3.037-1.516 5.465-4.097C19.616 16.987 21 14.663 21 12V5a1 1 0 00-.649-.936l-8-3a.998.998 0 00-.702 0l-8 3A1 1 0 003 5v7c0 2.663 1.384 4.987 3.088 6.797 2.428 2.581 5.465 4.097 5.465 4.097zm-1.303-8.481l6.644-6.644a.856.856 0 111.212 1.212l-7.25 7.25a.856.856 0 01-1.212 0l-3.75-3.75a.856.856 0 111.212-1.212l3.144 3.144z" />
						</svg>
					</div>

					{/* Tooltip */}
					<div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
						<div className="bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
							End-to-end encrypted
							<div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
