import ButtonProps from "@/ui/ButtonProps";
import { useActiveBg, useBgShades, useBgStore } from "@/utils/propsStore";
import { ChangeEvent } from "react";
import { useState } from "react";

export default function OptionalBg() {
	const bg = useBgStore((state) => state.currentColor);
	const setBg = useBgStore((state) => state.setCurrentColor);

	const setCurrentBg = useActiveBg((state) => state.setCurrent);
	const currentBg = useActiveBg((state) => state.current);

	const bgShades = useBgShades((state) => state.shades);
	const setBgShades = useBgShades((state) => state.setShades);

	const [activeShade, setActiveShade] = useState<number>(1);

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
		setBg(val);
	};

	return (
		<div className="py-2 px-2 flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<p className="text-xs">Colors</p>
				<div className="w-full h-full grid grid-cols-5 gap-x-1 gap-y-2">
					<ButtonProps
						children={"-"}
						className={`bg-transparent  ${currentBg == 0 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("transparent");
							setCurrentBg(0);
							setBgShades([]);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-white  ${currentBg == 6 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("ffffff");
							setCurrentBg(6);
							setBgShades([]);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#e9ecef]  ${currentBg == 7 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("e9ecef");
							setCurrentBg(7);
							setBgShades([
								"f8f9fa",
								"e9ecef",
								"ced4da",
								"868e96",
								"343a40",
							]);
							setActiveShade(1);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#1e1e1e]  ${currentBg == 5 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("1e1e1e");
							setCurrentBg(5);
							setBgShades([]);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#eaddd7]  ${currentBg == 8 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("eaddd7");
							setCurrentBg(8);
							setBgShades([
								"f8f1ee",
								"eaddd7",
								"d2bab0",
								"a18072",
								"846358",
							]);
							setActiveShade(1);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#99e9f2]  ${currentBg == 9 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("99e9f2");
							setCurrentBg(9);
							setBgShades([
								"e3fafc",
								"99e9f2",
								"3bc9db",
								"15aabf",
								"0c8599",
							]);
							setActiveShade(1);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#a5d8ff]  ${currentBg == 3 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("a5d8ff");
							setCurrentBg(3);
							setBgShades([
								"e7f5ff",
								"a5d8ff",
								"4dabf7",
								"228be6",
								"1971c2",
							]);
							setActiveShade(1);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#d0bfff]  ${currentBg == 10 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("d0bfff");
							setCurrentBg(10);
							setBgShades([
								"f3f0ff",
								"d0bfff",
								"9775fa",
								"7950f2",
								"6741d9",
							]);
							setActiveShade(1);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#eebefa]  ${currentBg == 11 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("eebefa");
							setCurrentBg(11);
							setBgShades([
								"f8f0fc",
								"eebefa",
								"da77f2",
								"be4bdb",
								"9c36b5",
							]);
							setActiveShade(1);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#fcc2d7]  ${currentBg == 12 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("fcc2d7");
							setCurrentBg(12);
							setBgShades([
								"fff0f6",
								"fcc2d7",
								"f783ac",
								"e64980",
								"c2255c",
							]);
							setActiveShade(1);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#b2f2bb]  ${currentBg == 2 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("b2f2bb");
							setCurrentBg(2);
							setBgShades([
								"ebfbee",
								"b2f2bb",
								"69db7c",
								"40c057",
								"2f9e44",
							]);
							setActiveShade(1);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#96f2d7]  ${currentBg == 13 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("96f2d7");
							setCurrentBg(13);
							setBgShades([
								"e6fcf5",
								"96f2d7",
								"38d9a9",
								"12b886",
								"099268",
							]);
							setActiveShade(1);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#ffec99]  ${currentBg == 4 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("ffec99");
							setCurrentBg(4);
							setBgShades([
								"fff9db",
								"ffec99",
								"ffd43b",
								"fab005",
								"f08c00",
							]);
							setActiveShade(1);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#ffd8a8]  ${currentBg == 14 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("ffd8a8");
							setCurrentBg(14);
							setBgShades([
								"fff4e6",
								"ffd8a8",
								"ffa94d",
								"fd7e14",
								"e8590c",
							]);
							setActiveShade(1);
						}}
					/>
					<ButtonProps
						children={""}
						className={`bg-[#ffc9c9]  ${currentBg == 1 ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
						onClick={() => {
							setBg("ffc9c9");
							setCurrentBg(1);
							setBgShades([
								"fff5f5",
								"ffc9c9",
								"ff8787",
								"fa5252",
								"e03131",
							]);
							setActiveShade(1);
						}}
					/>
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<p className="text-xs">Shades</p>
				<div>
					{bgShades.length > 0 && (
						<div className="w-full h-full flex justify-between items-center gap-2">
							{bgShades.map((shade, i) => (
								<ButtonProps
									key={i}
									children={""}
									className={` ${activeShade == i ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
									color={`${shade}`}
									onClick={() => {
										setActiveShade(i);
										setBg(shade);
									}}
								/>
							))}
						</div>
					)}
					{bgShades.length == 0 && (
						<div className="w-full h-full text-xs flex items-center">
							no shades available for this color.
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<p className="text-xs">Hexcode</p>
				<div className="group focus-within:border-0.5 focus-within:border-gray-600 w-full h-full border-[0.5] border-gray-300 rounded-lg flex py-1">
					<div className="px-2">{"#"}</div>
					<input
						className="appearance-none outline-none border-none px-1 w-full flex items-center text-sm"
						type="text"
						value={bg}
						onChange={handleOnChange}
					/>
				</div>
			</div>
		</div>
	);
}
