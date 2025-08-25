"use client";
import ButtonAction from "@/ui/ButtonAction";
import ButtonTool from "@/ui/ButtonTool";
import { useCanvasBgStore, useThemeStore } from "@/utils/canvasStore";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useState } from "react";
import { ChangeEvent } from "react";

export default function ActionCard() {
	const backgrounds = useCanvasBgStore((state) => state.backgrounds);
	const setBackgrounds = useCanvasBgStore((state) => state.setBackgrounds);
	const background = useCanvasBgStore((state) => state.background);
	const setBackground = useCanvasBgStore((state) => state.setBackground);

	const { theme, setTheme, resolvedTheme } = useTheme();

	const themeTool = useThemeStore((state) => state.theme);
	const setThemeTool = useThemeStore((state) => state.setTheme);

	const [clicked, setClicked] = useState<boolean>(false);

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
		setBackground(val);
	};

	useEffect(() => {
		if (resolvedTheme === "dark") setThemeTool("dark" as "dark");
		else setThemeTool("light" as "light");
		setBackgrounds();
		setBackground(resolvedTheme === "dark" ? "121212" : "ffffff");
	}, [resolvedTheme, theme]);

	return (
		<div className="h-10 w-10 rounded-lg z-50 relative">
			<ButtonTool
				children={"a"}
				onClick={() => setClicked((prev) => !prev)}
				className="bg-oc-gray-3 dark:bg-[#232329]"
				color={`${clicked ? (theme === "light" ? "d0bfff" : "495057") : ""}`}
			/>
			{clicked && (
				<div className="w-65 py-2 px-2 border border-gray-300 dark:bg-[#232329] bg-white shadow-xl absolute top-[110%] flex flex-col gap-2 rounded-lg z-20">
					<ButtonAction
						children={"reset"}
						onClick={() => console.log("hi")}
					/>
					<ButtonAction
						children={"github"}
						onClick={() => console.log("hi")}
					/>
					<ButtonAction
						children={"sign out"}
						onClick={() => console.log("hi")}
					/>
					<div className="w-full border-t-[0.5px] border-t-gray-300 dark:border-t-gray-600 mx-auto"></div>
					<div className="w-full flex justify-between items-center border rounded-lg border-gray-300 dark:border-gray-600 px-1 py-1">
						<p className="text-sm">Theme</p>
						<div className="w-auto h-full px-1 flex gap-1.5 border border-oc-violet-2 dark:border-oc-violet-6 py-1 rounded-xl">
							{["light", "dark", "system"].map((val, i) => (
								<button
									key={i}
									className={`w-8 h-6 rounded-md flex items-center justify-center cursor-pointer ${theme === val ? "border-oc-violet-6 bg-oc-violet-7" : ""}`}
									onClick={() => {
										setTheme(val);
									}}
								>
									{val.charAt(0).toUpperCase()}
								</button>
							))}
						</div>
					</div>
					<div className="w-full flex flex-col gap-1">
						<p className="text-xs">canvas background</p>
						<div className=" w-full h-10 flex gap-1.5 items-center">
							{backgrounds.map((val, i) => (
								<button
									key={i}
									className={` w-8 h-8 rounded-lg cursor-pointer ${background === val ? "outline outline-offset-1 outline-oc-violet-8" : ""}`}
									style={{
										backgroundColor: `#${val}`,
									}}
									onClick={() => setBackground(val)}
								>
									{"b"}
								</button>
							))}
							<div className="h-[60%] border-r-1 border-r-gray-300 mx-0.5"></div>
							<div
								className={`w-8 h-8 outline outline-offset-1 outline-gray-800 rounded-lg`}
								style={{
									backgroundColor: `#${background}`,
								}}
							></div>
						</div>
						<div className="flex flex-col gap-1">
							<p className="text-xs">Hexcode</p>
							<div className="group focus-within:border-0.5 focus-within:border-gray-600 w-full h-full border-[0.5] border-gray-300 rounded-lg flex py-1">
								<div className="px-2">{"#"}</div>
								<input
									className="appearance-none outline-none border-none px-1 w-full flex items-center text-sm"
									type="text"
									value={background}
									onChange={handleOnChange}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
