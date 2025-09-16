"use client";

import { Tool } from "@/app/draw/types";
import ButtonAction from "@/ui/ButtonAction";
import ButtonTool from "@/ui/ButtonTool";
import toolsIcon from "@/ui/icons/tools";
import { useThemeStore } from "@/utils/canvasStore";
import useToolStore, { useLockStore } from "@/utils/toolStore";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function CanvasTool() {
	const theme = useThemeStore((state) => state.theme);
	const tool = useToolStore((state) => state.tool);
	const setTool = useToolStore((state) => state.setTool);
	const setProps = useToolStore((state) => state.setProps);

	const [optionsClicked, setOptionsClicked] = useState<boolean>(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const [lock, setLock] = useState<string>("");
	const lockClicked = useLockStore((state) => state.lockClicked);
	const setLockClicked = useLockStore((state) => state.setLockClicked);

	useEffect(() => {
		function handleClickOutside(event: PointerEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOptionsClicked(false);
			}
		}

		document.addEventListener("pointerdown", handleClickOutside, true);
		return () => {
			document.removeEventListener(
				"pointerdown",
				handleClickOutside,
				true
			);
		};
	}, []);

	useEffect(() => {
		if (!lockClicked) return;
		setLock(theme === "light" ? "a78bfa" : "8b5cf6");
	}, [theme, lockClicked]);

	const toolGroups = [
		{
			name: "Navigation",
			tools: ["hand", "mouse"],
		},
		{
			name: "Shapes",
			tools: ["rectangle", "rhombus", "arc"],
		},
		{
			name: "Drawing",
			tools: ["arrow", "line", "pencil"],
		},
		{
			name: "Content",
			tools: ["text", "image", "eraser"],
		},
	];

	return (
		<motion.div
			ref={containerRef}
			className="w-full h-full flex items-center justify-between py-2 px-2 gap-2 relative backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-canvora-200/50 dark:border-canvora-600/30 rounded-xl shadow-lg"
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
		>
			{/* Lock Button */}
			<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
				<ButtonTool
					children={toolsIcon["lock"]}
					color={lock}
					onClick={() => {
						setLockClicked(!lockClicked);
						if (lock.length > 0) setLock("");
						else setLock(theme === "light" ? "a78bfa" : "8b5cf6");
					}}
				/>
			</motion.div>

			{/* Divider */}
			<div className="h-8 w-px bg-gradient-to-b from-transparent via-canvora-300/50 to-transparent dark:via-canvora-600/50"></div>

			{/* Main Tools */}
			<div className="flex items-center gap-1">
				{[
					"hand",
					"mouse",
					"rectangle",
					"rhombus",
					"arc",
					"arrow",
					"line",
					"pencil",
					"text",
					"image",
					"eraser",
				].map((val, i) => (
					<motion.div
						key={i}
						whileHover={{ scale: 1.02, y: -1 }}
						whileTap={{ scale: 0.98 }}
						transition={{
							type: "spring",
							stiffness: 500,
							damping: 25,
						}}
					>
						<ButtonTool
							children={toolsIcon[val]}
							color={`${val === tool ? (theme === "light" ? "c4b5fd" : "4945a9") : ""}`}
							onClick={() => {
								setTool(val as Tool);
								setProps(val as Tool);
								setOptionsClicked(false);
							}}
						/>
					</motion.div>
				))}
			</div>

			{/* Divider */}
			<div className="h-8 w-px bg-gradient-to-b from-transparent via-canvora-300/50 to-transparent dark:via-canvora-600/50"></div>

			{/* Options Button */}
			<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
				<ButtonTool
					children={toolsIcon["options"]}
					color={`${tool === "web" || tool === "laser" ? (theme === "light" ? "c4b5fd" : "4945a9") : ""}`}
					onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
						e.stopPropagation();
						setOptionsClicked((prev) => !prev);
					}}
				/>
			</motion.div>

			{/* Options Dropdown */}
			<AnimatePresence>
				{optionsClicked && (
					<motion.div
						className="w-48 py-3 px-3 border border-canvora-200/50 dark:border-canvora-600/30 rounded-xl shadow-xl absolute top-[120%] right-0 z-50 flex flex-col gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md"
						aria-expanded={optionsClicked}
						initial={{ opacity: 0, scale: 0.98, y: -5 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.98, y: -5 }}
						transition={{ type: "spring", duration: 0.15 }}
					>
						<div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
							Advanced Tools
						</div>
						<motion.div
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
						>
							<ButtonAction
								children={toolsIcon["web"]}
								color={`${tool === "web" ? (theme === "light" ? "c4b5fd" : "4945a9") : ""}`}
								onClick={() => {
									setTool("web");
									setProps("web");
									setOptionsClicked((prev) => !prev);
								}}
							/>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
						>
							<ButtonAction
								children={toolsIcon["laser"]}
								color={`${tool === "laser" ? (theme === "light" ? "c4b5fd" : "4945a9") : ""}`}
								onClick={() => {
									setTool("laser");
									setProps("laser");
									setOptionsClicked((prev) => !prev);
								}}
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
