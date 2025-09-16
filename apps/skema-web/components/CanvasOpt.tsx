import React, { useEffect } from "react";
import useToolStore from "@/utils/toolStore";
import ButtonProps from "@/ui/ButtonProps";
import {
	useActiveStroke,
	useBgStore,
	useStrokeStore,
	useStrokeShades,
	useBgShades,
	useActiveBg,
	useFillStore,
	useStrokeWidthStore,
	useStrokeStyleStore,
	useSlopinessStore,
	useEdgesStore,
	useArrowTypeStore,
	useFontFamilyStore,
	useFontSizeStore,
	useTextAlignStore,
	useLayersStore,
	useOpacityStore,
	useArrowHeadStore,
	useFrontArrowStore,
	useBackArrowStore,
} from "@/utils/propsStore";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import OptionalStroke from "./OptionalStroke";
import OptionalBg from "./OptionalBg";
import fillIcons from "@/ui/icons/fill";
import {
	arrowType,
	backArrow,
	edges,
	fill,
	fontFamily,
	fontSize,
	frontArrow,
	layers,
	slopiness,
	strokeStyle,
	strokeWidth,
	textAlign,
} from "@/app/draw/types";
import strokeWidthIcon from "@/ui/icons/strokeWidth";
import strokeStyleIcon from "@/ui/icons/strokeStyle";
import slopinessIcon from "@/ui/icons/slopiness";
import edgesIcon from "@/ui/icons/edges";
import arrowTypeIcon from "@/ui/icons/arrowType";
import fontFamilyIcon from "@/ui/icons/fontFamily";
import fontSizeIcon from "@/ui/icons/fontSize";
import textAlignIcon from "@/ui/icons/textAlign";
import layersIcon from "@/ui/icons/layers";
import frontHeadIcons from "@/ui/icons/arrowHead/frontHead";
import backHeadIcons from "@/ui/icons/arrowHead/backHead";
import { useThemeStore } from "@/utils/canvasStore";
import { motion, AnimatePresence } from "motion/react";

export default function CanvasOpt() {
	const theme = useThemeStore((state) => state.theme);
	const [activeSubOption, setActiveSubOption] = useState<string | null>(null);
	const [activeSuperOptions, setActiveSuperOptions] = useState<string>("");
	const [customStrokeColor, setCustomStrokeColor] = useState<string>("");
	const [customBgColor, setCustomBgColor] = useState<string>("");

	const props = useToolStore((state) => state.props);

	const { stroke, setStroke } = useStrokeStore(
		useShallow((state) => ({
			stroke: state.currentColor,
			setStroke: state.setCurrentColor,
		}))
	);

	const { bg, setBg } = useBgStore(
		useShallow((state) => ({
			bg: state.currentColor,
			setBg: state.setCurrentColor,
		}))
	);
	const setCurrentStroke = useActiveStroke((state) => state.setCurrent);
	const currentStroke = useActiveStroke((state) => state.current);
	const setCurrentBg = useActiveBg((state) => state.setCurrent);
	const currentBg = useActiveBg((state) => state.current);

	const strokeShades = useStrokeShades((state) => state.shades);
	const setStrokeShades = useStrokeShades((state) => state.setShades);
	const [activeStrokeShade, setActiveStrokeShade] = useState<number>(4);

	const bgShades = useBgShades((state) => state.shades);
	const setBgShades = useBgShades((state) => state.setShades);
	const [activeBgShade, setActiveBgShade] = useState<number>(1);

	const fill = useFillStore((state) => state.fill);
	const setFill = useFillStore((state) => state.setFill);

	const strokeWidth = useStrokeWidthStore((state) => state.width);
	const setStrokeWidth = useStrokeWidthStore((state) => state.setWidth);

	const strokeStyle = useStrokeStyleStore((state) => state.style);
	const setStrokeStyle = useStrokeStyleStore((state) => state.setStyle);

	const slopiness = useSlopinessStore((state) => state.slopiness);
	const setSlopiness = useSlopinessStore((state) => state.setSlopiness);

	const edges = useEdgesStore((state) => state.edges);
	const setEdges = useEdgesStore((state) => state.setEdges);

	const arrowType = useArrowTypeStore((state) => state.arrowType);
	const setArrowType = useArrowTypeStore((state) => state.setArrowType);

	const fontFamily = useFontFamilyStore((state) => state.fontFamily);
	const setFontFamily = useFontFamilyStore((state) => state.setFontFamily);

	const fontSize = useFontSizeStore((state) => state.fontSize);
	const setFontSize = useFontSizeStore((state) => state.setFontSize);

	const textAlign = useTextAlignStore((state) => state.textAlign);
	const setTextAlign = useTextAlignStore((state) => state.setTextAlign);

	const layers = useLayersStore((state) => state.layers);
	const setLayers = useLayersStore((state) => state.setLayers);

	const opacity = useOpacityStore((state) => state.opacity);
	const setOpacity = useOpacityStore((state) => state.setOpacity);

	const percent = (opacity / 100) * 100;

	const arrowHead = useArrowHeadStore();

	const frontArrow = useFrontArrowStore((state) => state.frontArrow);
	const setFrontArrow = useFrontArrowStore(
		(state) => state.setFrontArrowType
	);

	const backArrow = useBackArrowStore((state) => state.backArrow);
	const setBackArrow = useBackArrowStore((state) => state.setBackArrowType);

	useEffect(() => {
		if (currentStroke === 0) {
			setStroke(theme === "light" ? "1e1e1e" : "ffffff");
		}
	}, [theme]);

	return (
		<AnimatePresence>
			{props.length > 0 && (
				<motion.div
					className="w-full h-fit px-2 py-4 flex flex-col gap-4 justify-center rounded-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-canvora-200/50 dark:border-canvora-600/30 shadow-lg"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 10 }}
					transition={{ duration: 0.2 }}
				>
					{props.length > 0 &&
						props.map((prop, index) => (
							<motion.div
								key={`${prop}-${index}`}
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									delay: index * 0.05,
									duration: 0.15,
								}}
							>
								{prop === "stroke" && (
									<div className="flex flex-col gap-3 justify-center relative">
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											Stroke
										</p>
										<div className="flex gap-1 items-center ">
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<ButtonProps
													children={""}
													className={`${theme === "light" ? "bg-[#1e1e1e]" : "bg-white"} ${currentStroke == 0 ? "!outline-canvora-500 dark:outline-canvora-400 !outline-1" : ""} transition-all duration-300 flex-shrink-0`}
													onClick={() => {
														setStroke(
															theme === "light"
																? "1e1e1e"
																: "ffffff"
														);
														setCurrentStroke(0);
													}}
												/>
											</motion.div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<ButtonProps
													children={""}
													className={`bg-red-500 ${currentStroke == 1 ? "!outline-canvora-500 dark:outline-canvora-400 !outline-1" : ""} transition-all duration-300 flex-shrink-0`}
													onClick={() => {
														setStroke("e03131");
														setCurrentStroke(1);
													}}
												/>
											</motion.div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<ButtonProps
													children={""}
													className={`bg-green-500 ${currentStroke == 2 ? "!outline-canvora-500 dark:outline-canvora-400 !outline-1" : ""} transition-all duration-300 flex-shrink-0`}
													onClick={() => {
														setStroke("2f9e44");
														setCurrentStroke(2);
													}}
												/>
											</motion.div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<ButtonProps
													children={""}
													className={`bg-blue-500 ${currentStroke == 3 ? "!outline-canvora-500 dark:outline-canvora-400 !outline-1" : ""} transition-all duration-300 flex-shrink-0`}
													onClick={() => {
														setStroke("1971c2");
														setCurrentStroke(3);
													}}
												/>
											</motion.div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<ButtonProps
													children={""}
													className={`bg-yellow-500 ${currentStroke == 4 ? "!outline-canvora-500 dark:outline-canvora-400 !outline-1" : ""} transition-all duration-300 flex-shrink-0`}
													onClick={() => {
														setStroke("f08c00");
														setCurrentStroke(4);
													}}
												/>
											</motion.div>
											<div className="h-6 mx-1 flex items-center justify-center flex-shrink-0">
												<div className="h-4 w-px bg-gradient-to-b from-transparent via-canvora-300/50 to-transparent dark:via-canvora-600/50"></div>
											</div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<ButtonProps
													children={""}
													className={`w-6 h-6 !outline-gray-300 dark:outline-gray-500 hover:outline-canvora-400 dark:hover:outline-canvora-500 transition-all duration-300 flex-shrink-0`}
													color={`${stroke}`}
													onClick={() => {
														if (
															!activeSubOption ||
															activeSubOption !==
																"stroke"
														)
															setActiveSubOption(
																"stroke"
															);
														else
															setActiveSubOption(
																null
															);
														console.log("clicked");
													}}
												/>
											</motion.div>
										</div>
										<AnimatePresence>
											{activeSubOption === "stroke" && (
												<motion.div
													className="w-full max-h-auto border border-canvora-200/50 dark:border-canvora-600/30 rounded-xl z-10 overflow-hidden"
													initial={{
														opacity: 0,
														height: 0,
													}}
													animate={{
														opacity: 1,
														height: "auto",
													}}
													exit={{
														opacity: 0,
														height: 0,
													}}
													transition={{
														duration: 0.2,
													}}
												>
													<div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
														<div className="mb-3">
															<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
																Custom Stroke
																Colors
															</p>
															<p className="text-xs text-gray-400 dark:text-gray-500">
																Choose from
																extended color
																palette with
																shades
															</p>
														</div>

														<div className="space-y-3">
															<div>
																<p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
																	All Colors
																</p>
																<div className="grid grid-cols-5 gap-1.5">
																	{[
																		{
																			color: "transparent",
																			bg: "bg-transparent",
																			className:
																				"border-2 border-dashed border-gray-300 dark:border-gray-600",
																			strokeId: 5,
																			shades: [],
																		},
																		{
																			color: "ffffff",
																			bg: "bg-white",
																			className:
																				"",
																			strokeId:
																				theme ===
																				"light"
																					? 6
																					: 0,
																			shades: [],
																		},
																		{
																			color: "343a40",
																			bg: "bg-[#343a40]",
																			className:
																				"",
																			strokeId: 7,
																			shades: [
																				"f8f9fa",
																				"e9ecef",
																				"ced4da",
																				"868e96",
																				"343a40",
																			],
																		},
																		{
																			color: "1e1e1e",
																			bg: "bg-[#1e1e1e]",
																			className:
																				"",
																			strokeId:
																				theme ===
																				"light"
																					? 0
																					: 6,
																			shades: [],
																		},
																		{
																			color: "846358",
																			bg: "bg-[#846358]",
																			className:
																				"",
																			strokeId: 8,
																			shades: [
																				"f8f1ee",
																				"eaddd7",
																				"d2bab0",
																				"a18072",
																				"846358",
																			],
																		},
																		{
																			color: "0c8599",
																			bg: "bg-[#0c8599]",
																			className:
																				"",
																			strokeId: 9,
																			shades: [
																				"e3fafc",
																				"99e9f2",
																				"3bc9db",
																				"15aabf",
																				"0c8599",
																			],
																		},
																		{
																			color: "1971c2",
																			bg: "bg-[#1971c2]",
																			className:
																				"",
																			strokeId: 3,
																			shades: [
																				"e7f5ff",
																				"a5d8ff",
																				"4dabf7",
																				"228be6",
																				"1971c2",
																			],
																		},
																		{
																			color: "6741d9",
																			bg: "bg-[#6741d9]",
																			className:
																				"",
																			strokeId: 10,
																			shades: [
																				"f3f0ff",
																				"d0bfff",
																				"9775fa",
																				"7950f2",
																				"6741d9",
																			],
																		},
																		{
																			color: "9c36b5",
																			bg: "bg-[#9c36b5]",
																			className:
																				"",
																			strokeId: 11,
																			shades: [
																				"f8f0fc",
																				"eebefa",
																				"da77f2",
																				"be4bdb",
																				"9c36b5",
																			],
																		},
																		{
																			color: "c2255c",
																			bg: "bg-[#c2255c]",
																			className:
																				"",
																			strokeId: 12,
																			shades: [
																				"fff0f6",
																				"fcc2d7",
																				"f783ac",
																				"e64980",
																				"c2255c",
																			],
																		},
																		{
																			color: "2f9e44",
																			bg: "bg-[#2f9e44]",
																			className:
																				"",
																			strokeId: 2,
																			shades: [
																				"ebfbee",
																				"b2f2bb",
																				"69db7c",
																				"40c057",
																				"2f9e44",
																			],
																		},
																		{
																			color: "099268",
																			bg: "bg-[#099268]",
																			className:
																				"",
																			strokeId: 13,
																			shades: [
																				"e6fcf5",
																				"96f2d7",
																				"38d9a9",
																				"12b886",
																				"099268",
																			],
																		},
																		{
																			color: "f08c00",
																			bg: "bg-[#f08c00]",
																			className:
																				"",
																			strokeId: 4,
																			shades: [
																				"fff9db",
																				"ffec99",
																				"ffd43b",
																				"fab005",
																				"f08c00",
																			],
																		},
																		{
																			color: "e8590c",
																			bg: "bg-[#e8590c]",
																			className:
																				"",
																			strokeId: 14,
																			shades: [
																				"fff4e6",
																				"ffd8a8",
																				"ffa94d",
																				"fd7e14",
																				"e8590c",
																			],
																		},
																		{
																			color: "e03131",
																			bg: "bg-[#e03131]",
																			className:
																				"",
																			strokeId: 1,
																			shades: [
																				"fff5f5",
																				"ffc9c9",
																				"ff8787",
																				"fa5252",
																				"e03131",
																			],
																		},
																	].map(
																		(
																			item,
																			i
																		) => (
																			<motion.button
																				key={
																					i
																				}
																				whileHover={{
																					scale: 1.1,
																					y: -2,
																				}}
																				whileTap={{
																					scale: 0.95,
																				}}
																				className={`relative w-7 h-7 rounded-lg cursor-pointer border-2 transition-all duration-300 shadow-sm hover:shadow-md ${item.bg} ${item.className} ${
																					currentStroke ===
																					item.strokeId
																						? "border-canvora-400 dark:border-canvora-500 ring-2 ring-canvora-200 dark:ring-canvora-600"
																						: "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
																				}`}
																				onClick={() => {
																					setStroke(
																						item.color
																					);
																					setCurrentStroke(
																						item.strokeId
																					);
																					// Set shades if available
																					if (
																						item
																							.shades
																							.length >
																						0
																					) {
																						setStrokeShades(
																							item.shades
																						);
																						setActiveStrokeShade(
																							4
																						);
																					} else {
																						setStrokeShades(
																							[]
																						);
																					}
																				}}
																				title={`Stroke color ${item.color === "transparent" ? "transparent" : `#${item.color}`}`}
																			>
																				{item.color ===
																					"transparent" && (
																					<span className="text-xs text-gray-500">
																						-
																					</span>
																				)}
																				{currentStroke ===
																					item.strokeId && (
																					<motion.div
																						className="absolute inset-0 rounded-md flex items-center justify-center"
																						initial={{
																							scale: 0,
																							rotate: -90,
																						}}
																						animate={{
																							scale: 1,
																							rotate: 0,
																						}}
																						transition={{
																							duration: 0.2,
																						}}
																					>
																						<svg
																							className={`w-4 h-4 drop-shadow-sm ${item.color === "transparent" || item.color === "ffffff" ? "text-gray-600 dark:text-gray-400" : "text-white"}`}
																							fill="currentColor"
																							viewBox="0 0 20 20"
																						>
																							<path
																								fillRule="evenodd"
																								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																								clipRule="evenodd"
																							/>
																						</svg>
																					</motion.div>
																				)}
																			</motion.button>
																		)
																	)}
																</div>
															</div>

															{/* Shades Section */}
															<div>
																<p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
																	Shades
																</p>
																{strokeShades.length >
																0 ? (
																	<div className="flex gap-1.5">
																		{strokeShades.map(
																			(
																				shade,
																				i
																			) => (
																				<motion.button
																					key={
																						i
																					}
																					whileHover={{
																						scale: 1.1,
																						y: -2,
																					}}
																					whileTap={{
																						scale: 0.95,
																					}}
																					className={`relative w-7 h-7 rounded-lg cursor-pointer border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
																						activeStrokeShade ===
																						i
																							? "border-canvora-400 dark:border-canvora-500 ring-2 ring-canvora-200 dark:ring-canvora-600"
																							: "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
																					}`}
																					style={{
																						backgroundColor: `#${shade}`,
																					}}
																					onClick={() => {
																						setActiveStrokeShade(
																							i
																						);
																						setStroke(
																							shade
																						);
																					}}
																					title={`Shade #${shade}`}
																				>
																					{activeStrokeShade ===
																						i && (
																						<motion.div
																							className="absolute inset-0 rounded-md flex items-center justify-center"
																							initial={{
																								scale: 0,
																								rotate: -90,
																							}}
																							animate={{
																								scale: 1,
																								rotate: 0,
																							}}
																							transition={{
																								duration: 0.2,
																							}}
																						>
																							<svg
																								className={`w-4 h-4 drop-shadow-sm ${shade === "ffffff" || shade === "f8f9fa" || shade === "e9ecef" ? "text-gray-600" : "text-white"}`}
																								fill="currentColor"
																								viewBox="0 0 20 20"
																							>
																								<path
																									fillRule="evenodd"
																									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																									clipRule="evenodd"
																								/>
																							</svg>
																						</motion.div>
																					)}
																				</motion.button>
																			)
																		)}
																	</div>
																) : (
																	<div className="text-xs text-gray-400 dark:text-gray-500 py-2">
																		No
																		shades
																		available
																		for this
																		color.
																	</div>
																)}
															</div>

															<div className="flex items-center gap-3">
																<div className="h-px bg-gray-200 dark:bg-gray-600 flex-1"></div>
																<span className="text-xs text-gray-400">
																	or
																</span>
																<div className="h-px bg-gray-200 dark:bg-gray-600 flex-1"></div>
															</div>

															<div>
																<p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
																	Custom Color
																</p>
																<div className="flex items-center gap-2">
																	<div
																		className="w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-inner relative overflow-hidden flex-shrink-0"
																		style={{
																			backgroundColor:
																				stroke ===
																				"transparent"
																					? "transparent"
																					: `#${stroke}`,
																		}}
																	>
																		{stroke ===
																		"transparent" ? (
																			<div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"></div>
																		) : (
																			<div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10"></div>
																		)}
																	</div>
																	<div className="flex-1 min-w-0">
																		<div className="relative">
																			<div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-mono text-xs">
																				#
																			</div>
																			<input
																				className="w-full h-8 pl-6 pr-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono transition-all duration-300 focus:ring-1 focus:ring-canvora-200 dark:focus:ring-canvora-600 focus:border-canvora-400 dark:focus:border-canvora-500 outline-none text-gray-900 dark:text-gray-100"
																				type="text"
																				value={
																					stroke ===
																					"transparent"
																						? ""
																						: stroke
																				}
																				onChange={(
																					e
																				) => {
																					const val =
																						e.target.value
																							.replace(
																								/[^0-9a-fA-F]/g,
																								""
																							)
																							.slice(
																								0,
																								6
																							);
																					setStroke(
																						val ||
																							"transparent"
																					);
																				}}
																				placeholder="1e1e1e"
																				maxLength={
																					6
																				}
																			/>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								)}
								{prop === "background" && (
									<div className="flex flex-col gap-3 justify-center relative">
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											Background
										</p>
										<div className="flex gap-1 items-center">
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<ButtonProps
													children={""}
													className={`bg-transparent border-2 border-dashed border-gray-300 dark:border-gray-600 ${currentBg === 0 ? "!outline-canvora-500 dark:outline-canvora-400 !outline-1" : ""} transition-all duration-300 flex-shrink-0`}
													onClick={() => {
														setBg("transparent"); // transparent
														setCurrentBg(0);
													}}
												/>
											</motion.div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<ButtonProps
													children={""}
													className={`bg-red-200 ${currentBg === 1 ? "!outline-canvora-500 dark:outline-canvora-400 !outline-1" : ""} transition-all duration-300 flex-shrink-0`}
													onClick={() => {
														setBg("ffc9c9");
														setCurrentBg(1);
													}}
												/>
											</motion.div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<ButtonProps
													children={""}
													className={`bg-green-200 ${currentBg === 2 ? "!outline-canvora-500 dark:outline-canvora-400 !outline-1" : ""} transition-all duration-300 flex-shrink-0`}
													onClick={() => {
														setBg("b2f2bb");
														setCurrentBg(2);
													}}
												/>
											</motion.div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<ButtonProps
													children={""}
													className={`bg-blue-200 ${currentBg === 3 ? "!outline-canvora-500 dark:outline-canvora-400 !outline-1" : ""} transition-all duration-300 flex-shrink-0`}
													onClick={() => {
														setBg("a5d8ff");
														setCurrentBg(3);
													}}
												/>
											</motion.div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<ButtonProps
													children={""}
													className={`bg-yellow-200 ${currentBg === 4 ? "!outline-canvora-500 dark:outline-canvora-400 !outline-1" : ""} transition-all duration-300 flex-shrink-0`}
													onClick={() => {
														setBg("ffec99");
														setCurrentBg(4);
													}}
												/>
											</motion.div>
											<div className="h-6 mx-1 flex items-center justify-center flex-shrink-0">
												<div className="h-4 w-px bg-gradient-to-b from-transparent via-canvora-300/50 to-transparent dark:via-canvora-600/50"></div>
											</div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<ButtonProps
													children={""}
													className={`w-6 h-6 !outline-gray-300 dark:outline-gray-500 hover:outline-canvora-400 dark:hover:outline-canvora-500 transition-all duration-300 flex-shrink-0`}
													color={bg}
													onClick={() => {
														if (
															!activeSubOption ||
															activeSubOption !==
																"bg"
														)
															setActiveSubOption(
																"bg"
															);
														else
															setActiveSubOption(
																null
															);
														console.log("clicked");
													}}
												/>
											</motion.div>
										</div>
										<AnimatePresence>
											{activeSubOption === "bg" && (
												<motion.div
													className="w-full max-h-auto border border-canvora-200/50 dark:border-canvora-600/30 rounded-xl z-20 overflow-hidden"
													initial={{
														opacity: 0,
														height: 0,
													}}
													animate={{
														opacity: 1,
														height: "auto",
													}}
													exit={{
														opacity: 0,
														height: 0,
													}}
													transition={{
														duration: 0.2,
													}}
												>
													<div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
														<div className="mb-3">
															<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
																Canvas
																Background
															</p>
															<p className="text-xs text-gray-400 dark:text-gray-500">
																Choose from
																color palette
																and shades
															</p>
														</div>

														<div className="space-y-3">
															<div>
																<p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
																	Background
																	Colors
																</p>
																<div className="grid grid-cols-5 gap-1.5">
																	{[
																		{
																			color: "transparent",
																			currentBg: 0,
																			shades: [],
																		},
																		{
																			color: "ffc9c9",
																			currentBg: 1,
																			shades: [
																				"ffeeee",
																				"ffc9c9",
																				"ff9999",
																				"ff6b6b",
																				"ee5a52",
																			],
																		},
																		{
																			color: "b2f2bb",
																			currentBg: 2,
																			shades: [
																				"f3fff3",
																				"b2f2bb",
																				"8ce99a",
																				"69db7c",
																				"51cf66",
																			],
																		},
																		{
																			color: "a5d8ff",
																			currentBg: 3,
																			shades: [
																				"e7f5ff",
																				"a5d8ff",
																				"74c0fc",
																				"339af0",
																				"1c7ed6",
																			],
																		},
																		{
																			color: "ffec99",
																			currentBg: 4,
																			shades: [
																				"fff9db",
																				"ffec99",
																				"ffd43b",
																				"fab005",
																				"f59f00",
																			],
																		},
																		{
																			color: "e5dbff",
																			currentBg: 5,
																			shades: [
																				"f3f0ff",
																				"e5dbff",
																				"d0bfff",
																				"b197fc",
																				"9775fa",
																			],
																		},
																		{
																			color: "ffffff",
																			currentBg: 6,
																			shades: [
																				"ffffff",
																				"f8f9fa",
																				"e9ecef",
																				"dee2e6",
																				"ced4da",
																			],
																		},
																		{
																			color: "ffd8a8",
																			currentBg: 7,
																			shades: [
																				"fff0e6",
																				"ffd8a8",
																				"ffb366",
																				"ff8c42",
																				"fd7e14",
																			],
																		},
																		{
																			color: "fff3bf",
																			currentBg: 8,
																			shades: [
																				"fffbf0",
																				"fff3bf",
																				"ffe066",
																				"ffc947",
																				"ffb300",
																			],
																		},
																		{
																			color: "c0eb75",
																			currentBg: 9,
																			shades: [
																				"f4fce3",
																				"c0eb75",
																				"8bc34a",
																				"689f38",
																				"558b2f",
																			],
																		},
																		{
																			color: "74c0fc",
																			currentBg: 10,
																			shades: [
																				"e3f2fd",
																				"74c0fc",
																				"42a5f5",
																				"1e88e5",
																				"1565c0",
																			],
																		},
																		{
																			color: "91a7ff",
																			currentBg: 11,
																			shades: [
																				"ede7f6",
																				"91a7ff",
																				"7986cb",
																				"5c6bc0",
																				"3f51b5",
																			],
																		},
																		{
																			color: "faa2c1",
																			currentBg: 12,
																			shades: [
																				"fce4ec",
																				"faa2c1",
																				"f48fb1",
																				"ec407a",
																				"e91e63",
																			],
																		},
																		{
																			color: "ffb3ba",
																			currentBg: 13,
																			shades: [
																				"ffebee",
																				"ffb3ba",
																				"f8bbd9",
																				"f06292",
																				"e91e63",
																			],
																		},
																		{
																			color: "77dd77",
																			currentBg: 14,
																			shades: [
																				"e8f5e8",
																				"77dd77",
																				"4caf50",
																				"388e3c",
																				"2e7d32",
																			],
																		},
																	].map(
																		(
																			colorData,
																			i
																		) => (
																			<motion.button
																				key={
																					i
																				}
																				whileHover={{
																					scale: 1.1,
																					y: -2,
																				}}
																				whileTap={{
																					scale: 0.95,
																				}}
																				className={`relative w-7 h-7 rounded-lg cursor-pointer border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
																					colorData.color ===
																					"transparent"
																						? "border-dashed border-gray-300 dark:border-gray-600 bg-transparent"
																						: ""
																				} ${
																					currentBg ===
																					colorData.currentBg
																						? "border-canvora-400 dark:border-canvora-500 ring-2 ring-canvora-200 dark:ring-canvora-600"
																						: "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
																				}`}
																				style={{
																					backgroundColor:
																						colorData.color ===
																						"transparent"
																							? "transparent"
																							: `#${colorData.color}`,
																				}}
																				onClick={() => {
																					setBg(
																						colorData.color
																					);
																					setCurrentBg(
																						colorData.currentBg
																					);
																					if (
																						colorData
																							.shades
																							.length >
																						0
																					) {
																						setBgShades(
																							colorData.shades
																						);
																						setActiveBgShade(
																							1
																						);
																					}
																				}}
																				title={`Background color ${colorData.color === "transparent" ? "transparent" : `#${colorData.color}`}`}
																			>
																				{currentBg ===
																					colorData.currentBg && (
																					<motion.div
																						className="absolute inset-0 rounded-md flex items-center justify-center"
																						initial={{
																							scale: 0,
																							rotate: -90,
																						}}
																						animate={{
																							scale: 1,
																							rotate: 0,
																						}}
																						transition={{
																							duration: 0.2,
																						}}
																					>
																						<svg
																							className={`w-4 h-4 drop-shadow-sm ${colorData.color === "transparent" ? "text-gray-600 dark:text-gray-400" : "text-white"}`}
																							fill="currentColor"
																							viewBox="0 0 20 20"
																						>
																							<path
																								fillRule="evenodd"
																								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																								clipRule="evenodd"
																							/>
																						</svg>
																					</motion.div>
																				)}
																			</motion.button>
																		)
																	)}
																</div>
															</div>

															{bgShades.length >
																0 && (
																<div>
																	<p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
																		Shades
																	</p>
																	<div className="grid grid-cols-5 gap-1.5">
																		{bgShades.map(
																			(
																				shade,
																				index
																			) => (
																				<motion.button
																					key={
																						index
																					}
																					whileHover={{
																						scale: 1.1,
																						y: -2,
																					}}
																					whileTap={{
																						scale: 0.95,
																					}}
																					className={`relative w-7 h-7 rounded-lg cursor-pointer border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
																						activeBgShade ===
																						index
																							? "border-canvora-400 dark:border-canvora-500 ring-2 ring-canvora-200 dark:ring-canvora-600"
																							: "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
																					}`}
																					style={{
																						backgroundColor: `#${shade}`,
																					}}
																					onClick={() => {
																						setBg(
																							shade
																						);
																						setActiveBgShade(
																							index
																						);
																					}}
																					title={`Background shade #${shade}`}
																				>
																					{activeBgShade ===
																						index && (
																						<motion.div
																							className="absolute inset-0 rounded-md flex items-center justify-center"
																							initial={{
																								scale: 0,
																								rotate: -90,
																							}}
																							animate={{
																								scale: 1,
																								rotate: 0,
																							}}
																							transition={{
																								duration: 0.2,
																							}}
																						>
																							<svg
																								className="w-4 h-4 text-white drop-shadow-sm"
																								fill="currentColor"
																								viewBox="0 0 20 20"
																							>
																								<path
																									fillRule="evenodd"
																									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																									clipRule="evenodd"
																								/>
																							</svg>
																						</motion.div>
																					)}
																				</motion.button>
																			)
																		)}
																	</div>
																</div>
															)}

															<div className="flex items-center gap-3">
																<div className="h-px bg-gray-200 dark:bg-gray-600 flex-1"></div>
																<span className="text-xs text-gray-400">
																	or
																</span>
																<div className="h-px bg-gray-200 dark:bg-gray-600 flex-1"></div>
															</div>

															<div>
																<p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
																	Custom Color
																</p>
																<div className="flex items-center gap-2">
																	<div
																		className="w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-inner relative overflow-hidden flex-shrink-0"
																		style={{
																			backgroundColor:
																				bg ===
																				"transparent"
																					? "transparent"
																					: `#${bg}`,
																		}}
																	>
																		{bg ===
																		"transparent" ? (
																			<div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"></div>
																		) : (
																			<div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10"></div>
																		)}
																	</div>
																	<div className="flex-1 min-w-0">
																		<div className="relative">
																			<div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-mono text-xs">
																				#
																			</div>
																			<input
																				className="w-full h-8 pl-6 pr-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono transition-all duration-300 focus:ring-1 focus:ring-canvora-200 dark:focus:ring-canvora-600 focus:border-canvora-400 dark:focus:border-canvora-500 outline-none text-gray-900 dark:text-gray-100"
																				type="text"
																				value={
																					customBgColor ||
																					(bg ===
																					"transparent"
																						? ""
																						: bg)
																				}
																				onChange={(
																					e
																				) => {
																					const val =
																						e.target.value
																							.replace(
																								/[^0-9a-fA-F]/g,
																								""
																							)
																							.slice(
																								0,
																								6
																							);
																					setCustomBgColor(
																						val
																					);
																					if (
																						val.length ===
																						6
																					) {
																						setBg(
																							val
																						);
																					} else if (
																						val.length ===
																						0
																					) {
																						setBg(
																							"transparent"
																						);
																					}
																				}}
																				placeholder="ffffff"
																				maxLength={
																					6
																				}
																			/>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								)}
								{prop === "fill" && bg !== "transparent" && (
									<div className="flex flex-col gap-1 justify-center">
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											fill
										</p>
										<div className="flex gap-2">
											{["hachure", "cross", "solid"].map(
												(val, i) => (
													<ButtonProps
														key={i}
														children={
															fillIcons[val]
														}
														color={`${val === fill ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
														className={`bg-oc-gray-1 dark:bg-[#2e2d29] ${val === fill ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
														onClick={() => {
															setFill(
																val as fill
															);
														}}
													/>
												)
											)}
										</div>
									</div>
								)}
								{prop === "strokeWidth" && (
									<div className="flex flex-col gap-1 justify-center">
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											stroke width
										</p>
										<div className="flex gap-2">
											{["thin", "normal", "thick"].map(
												(val, i) => (
													<ButtonProps
														key={i}
														children={
															strokeWidthIcon[val]
														}
														color={`${val === strokeWidth ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
														className={`bg-oc-gray-1 dark:bg-[#2e2d29] ${val === strokeWidth ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
														onClick={() => {
															setStrokeWidth(
																val as strokeWidth
															);
														}}
													/>
												)
											)}
										</div>
									</div>
								)}
								{prop === "strokeStyle" && (
									<div className="flex flex-col gap-2 justify-center">
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											stroke style
										</p>
										<div className="flex gap-1">
											{["solid", "dashed", "dotted"].map(
												(val, i) => (
													<ButtonProps
														key={i}
														children={
															strokeStyleIcon[val]
														}
														color={`${val === strokeStyle ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
														className={`bg-oc-gray-1 dark:bg-[#2e2d29] ${val === strokeStyle ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
														onClick={() => {
															setStrokeStyle(
																val as strokeStyle
															);
														}}
													/>
												)
											)}
										</div>
									</div>
								)}
								{prop === "slopiness" && (
									<div className="flex flex-col gap-1 justify-center">
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											slopiness
										</p>
										<div className="flex gap-2">
											{[
												"architect",
												"artist",
												"cartoonist",
											].map((val, i) => (
												<ButtonProps
													key={i}
													children={
														slopinessIcon[val]
													}
													color={`${val === slopiness ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
													className={`bg-oc-gray-1 dark:bg-[#2e2d29] ${val === slopiness ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
													onClick={() => {
														setSlopiness(
															val as slopiness
														);
													}}
												/>
											))}
										</div>
									</div>
								)}
								{prop === "edge" && (
									<div className="flex flex-col gap-1 justify-center">
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											edges
										</p>
										<div className="flex gap-2">
											{["sharp", "round"].map(
												(val, i) => (
													<ButtonProps
														key={i}
														children={
															edgesIcon[val]
														}
														color={`${val === edges ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
														className={`bg-oc-gray-1 dark:bg-[#2e2d29] ${val === edges ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
														onClick={() => {
															setEdges(
																val as edges
															);
														}}
													/>
												)
											)}
										</div>
									</div>
								)}
								{prop === "arrowType" && (
									<div className="flex flex-col gap-1 justify-center">
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											arrow type
										</p>
										<div className="flex gap-2">
											{["sharp", "curved", "elbow"].map(
												(val, i) => (
													<ButtonProps
														key={i}
														children={
															arrowTypeIcon[val]
														}
														color={`${val === arrowType ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
														className={`bg-oc-gray-1 dark:bg-[#2e2d29] ${val === arrowType ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
														onClick={() => {
															setArrowType(
																val as arrowType
															);
														}}
													/>
												)
											)}
										</div>
									</div>
								)}
								{prop === "fontFamily" && (
									<div className="flex flex-col gap-1 justify-center">
										<p className="text-sm">font family</p>
										<div className="flex flex-wrap gap-2">
											{[
												"caveat",
												"draw",
												"code",
												"normal",
												"little",
												"nunito",
												"mono",
											].map((val, i) => (
												<ButtonProps
													key={i}
													children={
														fontFamilyIcon[val]
													}
													color={`${val === fontFamily ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
													className={`bg-oc-gray-1 dark:bg-[#2e2d29] ${val === fontFamily ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
													onClick={() => {
														setFontFamily(
															val as fontFamily
														);
													}}
												/>
											))}
										</div>
									</div>
								)}
								{prop === "fontSize" && (
									<div className="flex flex-col gap-1 justify-center">
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											font size
										</p>
										<div className="flex gap-2">
											{[
												"small",
												"medium",
												"large",
												"xlarge",
											].map((val, i) => (
												<ButtonProps
													key={i}
													children={fontSizeIcon[val]}
													color={`${val === fontSize ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
													className={`bg-oc-gray-1 dark:bg-[#2e2d29] ${val === fontSize ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
													onClick={() => {
														setFontSize(
															val as fontSize
														);
													}}
												/>
											))}
										</div>
									</div>
								)}
								{prop === "textAlign" && (
									<div className="flex flex-col gap-1 justify-center">
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											text align
										</p>
										<div className="flex gap-2">
											{["left", "center", "right"].map(
												(val, i) => (
													<ButtonProps
														key={i}
														children={
															textAlignIcon[val]
														}
														color={`${val === textAlign ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
														className={`bg-oc-gray-1 dark:bg-[#2e2d29] ${val === textAlign ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
														onClick={() => {
															setTextAlign(
																val as textAlign
															);
														}}
													/>
												)
											)}
										</div>
									</div>
								)}
								{prop === "arrowHead" && (
									<div className="flex flex-col gap-1 justify-center relative">
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											arrow heads
										</p>
										<div className="flex gap-2">
											<ButtonProps
												children={
													backHeadIcons[
														arrowHead.back
													]
												}
												className={`bg-oc-gray-1 dark:bg-[#2e2d29] ${backArrow !== "none" ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
												color={`${activeSubOption === "right-arrow" ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
												onClick={() => {
													if (
														!activeSubOption ||
														activeSubOption !==
															"right-arrow"
													)
														setActiveSubOption(
															"right-arrow"
														);
													else
														setActiveSubOption(
															null
														);
												}}
											/>
											<ButtonProps
												children={
													frontHeadIcons[
														arrowHead.front
													]
												}
												className={`bg-oc-gray-1 dark:bg-[#2e2d29] ${frontArrow !== "none" ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
												color={`${activeSubOption === "left-arrow" ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
												onClick={() => {
													if (
														!activeSubOption ||
														activeSubOption !==
															"left-arrow"
													)
														setActiveSubOption(
															"left-arrow"
														);
													else
														setActiveSubOption(
															null
														);
												}}
											/>
										</div>
										{activeSubOption === "left-arrow" && (
											<div className=" max-h-[70] py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg  z-20 absolute top-[108%] bg-white dark:bg-[#2e2d29]">
												<div className="flex gap-1 px-1 ">
													{[
														"none",
														"arrow",
														"triangle",
														"triangleOutline",
													].map((val, i) => (
														<ButtonProps
															key={i}
															children={
																frontHeadIcons[
																	val
																]
															}
															className={`bg-oc-gray-1 dark:bg-[#2e2d29] ${frontArrow === val ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
															color={`${val === frontArrow ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
															onClick={() =>
																setFrontArrow(
																	val as frontArrow
																)
															}
														/>
													))}
												</div>
											</div>
										)}
										{activeSubOption === "right-arrow" && (
											<div className=" max-h-[70] py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg z-20 bg-white dark:bg-[#2e2d29] absolute top-[108%]">
												<div className="flex gap-1 px-1 ">
													{[
														"none",
														"arrow",
														"triangle",
														"triangleOutline",
													].map((val, i) => (
														<ButtonProps
															key={i}
															children={
																backHeadIcons[
																	val
																]
															}
															className={`bg-oc-gray-1 dark:bg-[#2e2d29] ${backArrow === val ? "!outline-oc-violet-9 dark:outline-oc-violet-6" : ""}`}
															color={`${val === backArrow ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
															onClick={() =>
																setBackArrow(
																	val as backArrow
																)
															}
														/>
													))}
												</div>
											</div>
										)}
									</div>
								)}
								{prop === "opacity" && (
									<div className="flex flex-col gap-1 justify-center">
										<p className="text-sm">opacity</p>
										<div>
											<div className="w-full rounded-lg flex items-center justify-center">
												<input
													type="range"
													min="0"
													max="100"
													step="10"
													list="opacity-values"
													className="custom-slider rounded-full"
													value={opacity}
													onChange={(e) => {
														const value = Number(
															e.target.value
														);
														const roundedValue =
															Math.round(
																value / 10
															) * 10;
														setOpacity(
															roundedValue
														);
													}}
												/>
												<datalist id="opacity-values">
													<option value="0" />
													<option value="10" />
													<option value="20" />
													<option value="30" />
													<option value="40" />
													<option value="50" />
													<option value="60" />
													<option value="70" />
													<option value="80" />
													<option value="90" />
													<option value="100" />
												</datalist>
											</div>
											<div
												className="w-full flex items-center justify-between pt-1.5"
												style={{
													width: `calc(${percent}%)`,
												}}
											>
												{opacity > 0 && (
													<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
														{0}
													</p>
												)}
												<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
													{opacity}
												</p>
											</div>
										</div>
									</div>
								)}
								{prop === "layers" && (
									<div className="flex flex-col gap-1 justify-center">
										<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											layers
										</p>
										<div className="flex gap-2">
											{[
												"back",
												"backward",
												"forward",
												"front",
											].map((val, i) => (
												<ButtonProps
													key={i}
													children={layersIcon[val]}
													// color={`${val === layers ? (theme === "light" ? "e0dfff" : "403e6a") : ""}`}
													className={`bg-oc-gray-1 dark:bg-[#2e2d29] `}
													onClick={() => {
														setLayers(
															val as layers
														);
													}}
												/>
											))}
										</div>
									</div>
								)}
							</motion.div>
						))}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
