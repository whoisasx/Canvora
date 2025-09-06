import ButtonProps from "@/ui/ButtonProps";
import { useThemeStore } from "@/utils/canvasStore";
import {
	useActiveStroke,
	useStrokeShades,
	useStrokeStore,
} from "@/utils/propsStore";
import { useTheme } from "next-themes";
import { ChangeEvent, useState } from "react";

export default function OptionalStroke() {
	const theme = useThemeStore((state) => state.theme);
	// const { theme, setTheme, resolvedTheme } = useTheme();

	const stroke = useStrokeStore((state) => state.currentColor);
	const setStroke = useStrokeStore((state) => state.setCurrentColor);

	const setCurrentStroke = useActiveStroke((state) => state.setCurrent);
	const currentStroke = useActiveStroke((state) => state.current);

	const strokeShades = useStrokeShades((state) => state.shades);
	const setStrokeShades = useStrokeShades((state) => state.setShades);

	const [activeShade, setActiveShade] = useState<number>(4);

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
		setStroke(val);
	};

	return (
		<div className="py-2 px-2 flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<p className="text-xs">Colors</p>
				<div className="w-full h-full grid grid-cols-5 gap-x-1 gap-y-2">
					<ButtonProps
						children={"-"}
						className={`bg-transparent ${currentStroke == 5 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("transparent");
							setCurrentStroke(5);
							setStrokeShades([]);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-white ${currentStroke == (theme === "light" ? 6 : 0) ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("ffffff");
							setCurrentStroke(theme === "light" ? 6 : 0);
							setStrokeShades([]);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#343a40] ${currentStroke == 7 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("343a40");
							setCurrentStroke(7);
							setStrokeShades([
								"f8f9fa",
								"e9ecef",
								"ced4da",
								"868e96",
								"343a40",
							]);
							setActiveShade(4);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#1e1e1e] ${currentStroke == (theme === "light" ? 0 : 6) ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("1e1e1e");
							setCurrentStroke(theme === "light" ? 0 : 6);
							setStrokeShades([]);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#846358] ${currentStroke == 8 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("846358");
							setCurrentStroke(8);
							setStrokeShades([
								"f8f1ee",
								"eaddd7",
								"d2bab0",
								"a18072",
								"846358",
							]);
							setActiveShade(4);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#0c8599] ${currentStroke == 9 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("0c8599");
							setCurrentStroke(9);
							setStrokeShades([
								"e3fafc",
								"99e9f2",
								"3bc9db",
								"15aabf",
								"0c8599",
							]);
							setActiveShade(4);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#1971c2] ${currentStroke == 3 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("1971c2");
							setCurrentStroke(3);
							setStrokeShades([
								"e7f5ff",
								"a5d8ff",
								"4dabf7",
								"228be6",
								"1971c2",
							]);
							setActiveShade(4);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#6741d9] ${currentStroke == 10 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("6741d9");
							setCurrentStroke(10);
							setStrokeShades([
								"f3f0ff",
								"d0bfff",
								"9775fa",
								"7950f2",
								"6741d9",
							]);
							setActiveShade(4);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#9c36b5] ${currentStroke == 11 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("9c36b5");
							setCurrentStroke(11);
							setStrokeShades([
								"f8f0fc",
								"eebefa",
								"da77f2",
								"be4bdb",
								"9c36b5",
							]);
							setActiveShade(4);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#c2255c] ${currentStroke == 12 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("c2255c");
							setCurrentStroke(12);
							setStrokeShades([
								"fff0f6",
								"fcc2d7",
								"f783ac",
								"e64980",
								"c2255c",
							]);
							setActiveShade(4);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#2f994e] ${currentStroke == 2 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("2f994e");
							setCurrentStroke(2);
							setStrokeShades([
								"ebfbee",
								"b2f2bb",
								"69db7c",
								"40c057",
								"2f9e44",
							]);
							setActiveShade(4);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#099268] ${currentStroke == 13 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("099268");
							setCurrentStroke(13);
							setStrokeShades([
								"e6fcf5",
								"96f2d7",
								"38d9a9",
								"12b886",
								"099268",
							]);
							setActiveShade(4);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#f08c00] ${currentStroke == 4 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("f08c00");
							setCurrentStroke(4);
							setStrokeShades([
								"fff9db",
								"ffec99",
								"ffd43b",
								"fab005",
								"f08c00",
							]);
							setActiveShade(4);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#e8590c] ${currentStroke == 14 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("e8590c");
							setCurrentStroke(14);
							setStrokeShades([
								"fff4e6",
								"ffd8a8",
								"ffa94d",
								"fd7e14",
								"e8590c",
							]);
							setActiveShade(4);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#e03131] ${currentStroke == 1 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setStroke("e03131");
							setCurrentStroke(1);
							setStrokeShades([
								"fff5f5",
								"ffc9c9",
								"ff8787",
								"fa5252",
								"e03131",
							]);
							setActiveShade(4);
						}}
					/>
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<p className="text-xs">Shades</p>
				<div>
					{strokeShades.length > 0 && (
						<div className="w-full h-full flex justify-between items-center gap-2">
							{strokeShades.map((shade, i) => (
								<ButtonProps
									key={i}
									children={""}
									className={` ${activeShade == i ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
									color={`${shade}`}
									onClick={() => {
										setActiveShade(i);
										setStroke(shade);
									}}
								/>
							))}
						</div>
					)}
					{strokeShades.length == 0 && (
						<div className="w-full h-full text-xs flex items-center">
							no shades available for this color.
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<p className="text-xs">Hexcode</p>
				<div className="group focus-within:border-0.5 focus-within:border-gray-600 w-full h-full border-[0.5] border-gray-300 dark:border-gray-600 rounded-lg flex py-1">
					<div className="px-2">{"#"}</div>
					<input
						className="appearance-none outline-none border-none px-1 w-full flex items-center text-sm"
						type="text"
						value={stroke ?? ""}
						onChange={handleOnChange}
					/>
				</div>
			</div>
		</div>
	);
}
