import React from "react";
import useToolStore from "@/utils/toolStore";
import ButtonProps from "@/ui/ButtonProps";
import {
	useActiveStroke,
	useBgStore,
	useStrokeStore,
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

export default function CanvasOpt() {
	const [activeSubOption, setActiveSubOption] = useState<string | null>(null);

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

	const arrowHead = useArrowHeadStore((state) => state.arrowHead);
	const setArrowHead = useArrowHeadStore((state) => state.setArrowHead);

	const frontArrow = useFrontArrowStore((state) => state.frontArrow);
	const setFrontArrow = useFrontArrowStore(
		(state) => state.setFrontArrowType
	);

	const backArrow = useBackArrowStore((state) => state.backArrow);
	const setBackArrow = useBackArrowStore((state) => state.setBackArrowType);

	return (
		<>
			{props.length > 0 && (
				<div className="w-full h-fit px-3 py-4 flex flex-col gap-4 justify-center rounded-2xl">
					{props.length > 0 &&
						props.map((prop, index) => (
							<div key={`${prop}-${index}`}>
								{prop === "stroke" && (
									<div className="flex flex-col gap-1.5 justify-center relative">
										<p className="text-xs">Stroke</p>
										<div className="flex gap-1.5 items-center">
											<ButtonProps
												children={""}
												className={`bg-oc-gray-9 ${currentStroke == 0 ? "outline-1 outline-offset-1 outline-oc-violet-8" : ""}`}
												onClick={() => {
													setStroke("1e1e1e");
													setCurrentStroke(0);
												}}
											/>
											<ButtonProps
												children={""}
												className={`bg-oc-red-8 ${currentStroke == 1 ? "outline-1 outline-offset-1 outline-oc-violet-8" : ""}`}
												onClick={() => {
													setStroke("e03131");
													setCurrentStroke(1);
												}}
											/>
											<ButtonProps
												children={""}
												className={`bg-oc-green-8 ${currentStroke == 2 ? "outline-1 outline-offset-1 outline-oc-violet-8" : ""}`}
												onClick={() => {
													setStroke("2f9e44");
													setCurrentStroke(2);
												}}
											/>
											<ButtonProps
												children={""}
												className={`bg-oc-blue-8 ${currentStroke == 3 ? "outline-1 outline-offset-1 outline-oc-violet-8" : ""}`}
												onClick={() => {
													setStroke("1971c2");
													setCurrentStroke(3);
												}}
											/>
											<ButtonProps
												children={""}
												className={`bg-oc-yellow-8 ${currentStroke == 4 ? "outline-1 outline-offset-1 outline-oc-violet-8" : ""}`}
												onClick={() => {
													setStroke("f08c00");
													setCurrentStroke(4);
												}}
											/>
											<div className="h-7 mx-0.5">
												<div className="h-4 border-r-1 border-r-gray-300 my-1"></div>
											</div>
											<ButtonProps
												children={""}
												className={`w-7 h-7 outline-1 outline-offset-1 outline-oc-gray-7`}
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
										</div>
										{activeSubOption === "stroke" && (
											<div className="w-full max-h-auto border-[0.5] border-gray-300 rounded-xl z-20">
												<OptionalStroke />
											</div>
										)}
									</div>
								)}
								{prop === "background" && (
									<div className="flex flex-col gap-1.5 justify-center relative">
										<p className="text-xs">background</p>
										<div className="flex gap-1.5 items-center">
											<ButtonProps
												children={"t"}
												className={`bg-transparent ${currentBg === 0 ? "outline-1 outline-offset-1 outline-oc-violet-8" : ""}`}
												onClick={() => {
													setBg("transparent"); // transparent
													setCurrentBg(0);
												}}
											/>
											<ButtonProps
												children={""}
												className={`bg-oc-red-2 ${currentBg === 1 ? "outline-1 outline-offset-1 outline-oc-violet-8" : ""}`}
												onClick={() => {
													setBg("ffc9c9");
													setCurrentBg(1);
												}}
											/>
											<ButtonProps
												children={""}
												className={`bg-oc-green-2 ${currentBg === 2 ? "outline-1 outline-offset-1 outline-oc-violet-8" : ""}`}
												onClick={() => {
													setBg("b2f2bb");
													setCurrentBg(2);
												}}
											/>
											<ButtonProps
												children={""}
												className={`bg-oc-blue-2 ${currentBg === 3 ? "outline-1 outline-offset-1 outline-oc-violet-8" : ""}`}
												onClick={() => {
													setBg("a5d8ff");
													setCurrentBg(3);
												}}
											/>
											<ButtonProps
												children={""}
												className={`bg-oc-yellow-2 ${currentBg === 4 ? "outline-1 outline-offset-1 outline-oc-violet-8" : ""}`}
												onClick={() => {
													setBg("ffec99");
													setCurrentBg(4);
												}}
											/>
											<div className="h-7 mx-0.5">
												<div className="h-4 border-r-1 border-r-gray-300 my-1"></div>
											</div>
											<ButtonProps
												children={""}
												className={`w-7 h-7 outline-1 outline-offset-1 outline-oc-gray-7`}
												color={bg}
												onClick={() => {
													if (
														!activeSubOption ||
														activeSubOption !== "bg"
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
										</div>
										{activeSubOption === "bg" && (
											<div className="w-full max-h-auto border-[0.5] border-gray-300 rounded-xl z-20">
												<OptionalBg />
											</div>
										)}
									</div>
								)}
								{prop === "fill" && (
									<div className="flex flex-col gap-0.5 justify-center">
										<p className="text-xs">fill</p>
										<div className="flex gap-1.5">
											{["hachure", "cross", "solid"].map(
												(val, i) => (
													<ButtonProps
														key={i}
														children={
															fillIcons[val]
														}
														color={`${val === fill ? "d0bfff" : ""}`}
														className={`bg-oc-gray-2`}
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
									<div className="flex flex-col gap-0.5 justify-center">
										<p className="text-xs">stroke width</p>
										<div className="flex gap-1.5">
											{["thin", "normal", "thick"].map(
												(val, i) => (
													<ButtonProps
														key={i}
														children={
															strokeWidthIcon[val]
														}
														color={`${val === strokeWidth ? "d0bfff" : ""}`}
														className={`bg-oc-gray-2`}
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
									<div className="flex flex-col gap-0.5 justify-center">
										<p className="text-xs">stroke style</p>
										<div className="flex gap-1.5">
											{["solid", "dashed", "dotted"].map(
												(val, i) => (
													<ButtonProps
														key={i}
														children={
															strokeStyleIcon[val]
														}
														color={`${val === strokeStyle ? "d0bfff" : ""}`}
														className={`bg-oc-gray-2`}
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
									<div className="flex flex-col gap-0.5 justify-center">
										<p className="text-xs">slopiness</p>
										<div className="flex gap-1.5">
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
													color={`${val === slopiness ? "d0bfff" : ""}`}
													className={`bg-oc-gray-2`}
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
									<div className="flex flex-col gap-0.5 justify-center">
										<p className="text-xs">edges</p>
										<div className="flex gap-1.5">
											{["sharp", "round"].map(
												(val, i) => (
													<ButtonProps
														key={i}
														children={
															edgesIcon[val]
														}
														color={`${val === edges ? "d0bfff" : ""}`}
														className={`bg-oc-gray-2`}
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
									<div className="flex flex-col gap-0.5 justify-center">
										<p className="text-xs">arrow type</p>
										<div className="flex gap-1.5">
											{["sharp", "curved", "elbow"].map(
												(val, i) => (
													<ButtonProps
														key={i}
														children={
															arrowTypeIcon[val]
														}
														color={`${val === arrowType ? "d0bfff" : ""}`}
														className={`bg-oc-gray-2`}
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
									<div className="flex flex-col gap-0.5 justify-center">
										<p className="text-sm">font family</p>
										<div className="flex flex-wrap gap-1.5">
											{[
												"tldraw",
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
													color={`${val === fontFamily ? "d0bfff" : ""}`}
													className={`bg-oc-gray-2`}
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
									<div className="flex flex-col gap-0.5 justify-center">
										<p className="text-xs">font size</p>
										<div className="flex gap-1.5">
											{[
												"small",
												"medium",
												"large",
												"xlarge",
											].map((val, i) => (
												<ButtonProps
													key={i}
													children={fontSizeIcon[val]}
													color={`${val === fontSize ? "d0bfff" : ""}`}
													className={`bg-oc-gray-2`}
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
									<div className="flex flex-col gap-0.5 justify-center">
										<p className="text-xs">text align</p>
										<div className="flex gap-1.5">
											{["left", "center", "right"].map(
												(val, i) => (
													<ButtonProps
														key={i}
														children={
															textAlignIcon[val]
														}
														color={`${val === textAlign ? "d0bfff" : ""}`}
														className={`bg-oc-gray-2`}
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
									<div className="flex flex-col gap-0.5 justify-center relative">
										<p className="text-xs">arrow heads</p>
										<div className="flex gap-1.5">
											<ButtonProps
												children={
													frontHeadIcons[
														arrowHead.front
													]
												}
												className="bg-oc-gray-2"
												color={`${activeSubOption === "left-arrow" ? "d0bfff" : ""}`}
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
											<ButtonProps
												children={
													backHeadIcons[
														arrowHead.back
													]
												}
												className="bg-oc-gray-2"
												color={`${activeSubOption === "right-arrow" ? "d0bfff" : ""}`}
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
										</div>
										{activeSubOption === "left-arrow" && (
											<div className=" max-h-[70] py-1.5 border border-gray-300 rounded-lg  z-20 absolute top-[108%] bg-white">
												<div className="flex gap-1.5 px-1.5 ">
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
															className="bg-oc-gray-2"
															color={`${val === frontArrow ? "d0bfff" : ""}`}
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
											<div className=" max-h-[70] py-1.5 border border-gray-300 rounded-lg z-20 bg-white absolute top-[108%]">
												<div className="flex gap-1.5 px-1.5 ">
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
															className="bg-oc-gray-2"
															color={`${val === backArrow ? "d0bfff" : ""}`}
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
									<div className="flex flex-col gap-0.5 justify-center">
										<p className="text-sm">opacity</p>
										<div>
											<div className="w-full rounded-lg flex items-center justify-center">
												<input
													type="range"
													min="0"
													max="100"
													step="10"
													className="custom-slider rounded-full"
													value={opacity}
													onChange={(e) =>
														setOpacity(
															Number(
																e.target.value
															)
														)
													}
												/>
											</div>
											<div
												className="w-full flex items-center justify-between pt-1.5"
												style={{
													width: `calc(${percent}%)`,
												}}
											>
												{opacity > 0 && (
													<p className="text-xs">
														{0}
													</p>
												)}
												<p className="text-xs">
													{opacity}
												</p>
											</div>
										</div>
									</div>
								)}
								{prop === "layers" && (
									<div className="flex flex-col gap-0.5 justify-center">
										<p className="text-xs">layers</p>
										<div className="flex gap-1.5">
											{[
												"back",
												"backward",
												"forward",
												"front",
											].map((val, i) => (
												<ButtonProps
													key={i}
													children={layersIcon[val]}
													color={`${val === layers ? "d0bfff" : ""}`}
													className={`bg-oc-gray-2`}
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
							</div>
						))}
				</div>
			)}
		</>
	);
}
