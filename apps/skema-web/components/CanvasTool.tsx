"use client";

import { Tool } from "@/app/draw/types";
import ButtonAction from "@/ui/ButtonAction";
import ButtonTool from "@/ui/ButtonTool";
import toolsIcon from "@/ui/icons/tools";
import { useThemeStore } from "@/utils/canvasStore";
import useToolStore, { useLockStore } from "@/utils/toolStore";
import { useState } from "react";
import { useEffect, useRef } from "react";

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
		setLock(theme === "light" ? "b197fc" : "7950f2");
	}, [theme, lockClicked]);

	return (
		<div
			ref={containerRef}
			className="w-full h-full flex items-center justify-between py-1.5 px-2 gap-2 relative"
		>
			<ButtonTool
				children={toolsIcon["lock"]}
				color={lock}
				onClick={() => {
					setLockClicked(!lockClicked);
					if (lock.length > 0) setLock("");
					else setLock(theme === "light" ? "b197fc" : "7950f2");
				}}
			/>
			<div className="h-[70%] border-r-1 border-r-gray-300 dark:border-gray-600"></div>
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
				<ButtonTool
					key={i}
					children={toolsIcon[val]}
					color={`${val === tool ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
					// className={`${val === tool ? (theme === "light" ? "bg-oc-grape-3" : "bg-oc-grape-6") : ""}`}
					onClick={() => {
						setTool(val as Tool);
						setProps(val as Tool);
						setOptionsClicked(false);
					}}
				/>
			))}
			<div className="h-[70%] border-r-1 border-r-gray-300 dark:border-gray-600"></div>
			<ButtonTool
				children={toolsIcon["options"]}
				color={`${tool === "web" || tool === "laser" ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
				onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
					e.stopPropagation();
					setOptionsClicked((prev) => !prev);
				}}
			/>
			{optionsClicked && (
				<div
					className="w-50 h-fit py-2 px-2 border-1 border-gray-300 rounded-lg shadow-lg absolute top-[115%] right-0 z-40 flex flex-col gap-2 justify-center items-start bg-white dark:bg-[#232329]"
					aria-expanded={optionsClicked}
				>
					<ButtonAction
						children={"W"}
						color={`${tool === "web" ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
						onClick={() => {
							setTool("web");
							setProps("web");
							setOptionsClicked((prev) => !prev);
						}}
					/>
					<ButtonAction
						children={"Ls"}
						color={`${tool === "laser" ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
						onClick={() => {
							setTool("laser");
							setProps("laser");
							setOptionsClicked((prev) => !prev);
						}}
					/>
				</div>
			)}
		</div>
	);
}
