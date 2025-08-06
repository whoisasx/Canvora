"use client";

import { Tool } from "@/app/draw/types";
import ButtonAction from "@/ui/ButtonAction";
import ButtonTool from "@/ui/ButtonTool";
import toolsIcon from "@/ui/icons/tools";
import useToolStore from "@/utils/toolStore";
import { useState } from "react";
import { useEffect, useRef } from "react";

export default function CanvasTool() {
	const tool = useToolStore((state) => state.tool);
	const setTool = useToolStore((state) => state.setTool);
	const setProps = useToolStore((state) => state.setProps);

	const [optionsClicked, setOptionsClicked] = useState<boolean>(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const [lock, setLock] = useState<string>("");

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

	return (
		<div
			ref={containerRef}
			className="w-full h-full flex items-center justify-between py-1.5 px-2 gap-2 relative"
		>
			<ButtonTool
				children={toolsIcon["lock"]}
				color={lock}
				onClick={() => {
					if (lock.length > 0) setLock("");
					else setLock("b197fc");
				}}
			/>
			<div className="h-[70%] border-r-1 border-r-gray-300"></div>
			{[
				"mouse",
				"rhombus",
				"rectangle",
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
					color={`${val === tool ? "d0bfff" : ""}`}
					onClick={() => {
						setTool(val as Tool);
						setProps(val as Tool);
						setOptionsClicked(false);
					}}
				/>
			))}
			<div className="h-[70%] border-r-1 border-r-gray-300"></div>
			<ButtonTool
				children={toolsIcon["options"]}
				color={`${tool === "web" || tool === "laser" ? "b197fc" : ""}`}
				onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
					e.stopPropagation();
					setOptionsClicked((prev) => !prev);
				}}
			/>
			{optionsClicked && (
				<div
					className="w-50 h-fit py-2 px-2 border-1 border-gray-300 rounded-lg shadow-lg absolute top-[115%] right-0 z-20 flex flex-col gap-2 justify-center items-start"
					aria-expanded={optionsClicked}
				>
					<ButtonAction
						children={"W"}
						color={`${tool === "web" ? "b197fc" : ""}`}
						onClick={() => {
							setTool("web");
							setProps("web");
							setOptionsClicked((prev) => !prev);
						}}
					/>
					<ButtonAction
						children={"Ls"}
						color={`${tool === "laser" ? "b197fc" : ""}`}
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
