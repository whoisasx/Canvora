"use client";
import { Game } from "@/app/draw/draw";
import ButtonAction from "@/ui/ButtonAction";
import ButtonTool from "@/ui/ButtonTool";
import actionIcon from "@/ui/icons/actions";
import { useCanvasBgStore, useThemeStore } from "@/utils/canvasStore";
import axios from "axios";

import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { ChangeEvent } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";

export default function ActionCard({
	roomId,
	game,
}: {
	roomId: string;
	game: Game | undefined;
}) {
	const { data: session } = useSession();

	const backgrounds = useCanvasBgStore((state) => state.backgrounds);
	const setBackgrounds = useCanvasBgStore((state) => state.setBackgrounds);
	const background = useCanvasBgStore((state) => state.background);
	const setBackground = useCanvasBgStore((state) => state.setBackground);

	const { theme, setTheme, resolvedTheme } = useTheme();

	const themeTool = useThemeStore((state) => state.theme);
	const setThemeTool = useThemeStore((state) => state.setTheme);

	const [clicked, setClicked] = useState<boolean>(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const actContainerRef = useRef<HTMLDivElement>(null);

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
		<div ref={actContainerRef} className="h-9 w-9 rounded-lg z-50 relative">
			<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
				<ButtonTool
					children={
						<motion.svg
							aria-hidden="true"
							focusable="false"
							role="img"
							viewBox="0 0 24 24"
							className="w-4 h-4"
							fill="none"
							strokeWidth="2"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							animate={clicked ? { rotate: 90 } : { rotate: 0 }}
							transition={{ duration: 0.3 }}
						>
							<g strokeWidth="1.5">
								<path
									stroke="none"
									d="M0 0h24v24H0z"
									fill="none"
								></path>
								<line x1="4" y1="6" x2="20" y2="6"></line>
								<line x1="4" y1="12" x2="20" y2="12"></line>
								<line x1="4" y1="18" x2="20" y2="18"></line>
							</g>
						</motion.svg>
					}
					onClick={() => setClicked((prev) => !prev)}
					className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300"
				/>
			</motion.div>
			<AnimatePresence>
				{clicked && (
					<motion.div
						ref={containerRef}
						initial={{ opacity: 0, y: -10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -10, scale: 0.95 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="w-60 py-2 border border-gray-200 dark:bg-gray-800 dark:border-gray-600 bg-white shadow-xl absolute top-[110%] flex flex-col gap-2 rounded-lg z-20 max-h-[80vh] overflow-auto custom-scrollbar dark:custom-scrollbar backdrop-blur-sm"
					>
						<motion.div
							className="px-2 flex flex-col gap-1"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.1 }}
						>
							<ButtonAction
								children={actionIcon.cp}
								onClick={() => console.log("hi")}
							/>
							<ButtonAction
								children={actionIcon.st}
								onClick={() => console.log("hi")}
							/>
							<ButtonAction
								children={actionIcon.xi}
								onClick={() => console.log("hi")}
							/>
							<ButtonAction
								children={actionIcon.lc}
								onClick={() => console.log("hi")}
							/>
							<ButtonAction
								children={actionIcon.rc}
								onClick={() => {
									setShowConfirm(true);
								}}
							/>
							<div className="w-full border-t-[0.5px] border-t-gray-300 dark:border-t-gray-600 mx-auto"></div>
							<Link
								href="https://www.github.com/whoisasx/Canvora"
								target="_blank"
							>
								<ButtonAction children={actionIcon.gb} />
							</Link>
							<Link
								href={"https://x.com/whoisasx"}
								target="_blank"
							>
								<ButtonAction children={actionIcon.tx} />
							</Link>
							<Link
								href={""} //TODO;add the link to your portfolio
								target="_blank"
							>
								<ButtonAction children={actionIcon.am} />
							</Link>
							{session && session.user ? (
								<ButtonAction
									children={actionIcon.lo}
									onClick={() => signOut(redirect("/"))}
								/>
							) : (
								<ButtonAction
									children={actionIcon.su}
									onClick={() => redirect("/signup")}
								/>
							)}
						</motion.div>
						<div className="w-full border-t-[0.5px] border-t-gray-300 dark:border-t-gray-600 mx-auto mt-15"></div>
						<motion.div
							className="px-2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							<div className="w-full h-10 flex justify-between items-center border rounded-lg border-gray-200 dark:border-gray-600 px-1 py-1.5 bg-gray-50 dark:bg-gray-700">
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Theme
								</p>
								<div className="w-auto px-1 flex gap-1.5 py-1 rounded-xl">
									{["light", "dark", "system"].map(
										(val, i) => (
											<motion.button
												key={i}
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.95 }}
												className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border border-gray-200 dark:border-gray-600 transition-all duration-200 ${
													theme === val
														? "bg-canvora-500 dark:bg-canvora-600 text-white shadow-lg"
														: "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
												}`}
												onClick={() => {
													setTheme(val);
												}}
											>
												{val === "light" && (
													<svg
														aria-hidden="true"
														focusable="false"
														role="img"
														viewBox="0 0 20 20"
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="1.5"
													>
														<g
															stroke="currentColor"
															strokeLinejoin="round"
														>
															<path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM10 4.167V2.5M14.167 5.833l1.166-1.166M15.833 10H17.5M14.167 14.167l1.166 1.166M10 15.833V17.5M5.833 14.167l-1.166 1.166M5 10H3.333M5.833 5.833 4.667 4.667"></path>
														</g>
													</svg>
												)}
												{val === "dark" && (
													<svg
														aria-hidden="true"
														focusable="false"
														role="img"
														viewBox="0 0 20 20"
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path
															clipRule="evenodd"
															d="M10 2.5h.328a6.25 6.25 0 0 0 6.6 10.372A7.5 7.5 0 1 1 10 2.493V2.5Z"
															stroke="currentColor"
														></path>
													</svg>
												)}
												{val === "system" && (
													<svg
														aria-hidden="true"
														focusable="false"
														role="img"
														viewBox="0 0 24 24"
														className="w-4 h-4"
														fill="none"
														strokeWidth="1.5"
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<g stroke="currentColor">
															<path
																stroke="none"
																d="M0 0h24v24H0z"
																fill="none"
															></path>
															<path d="M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-16a1 1 0 0 1-1-1v-10zM7 20h10M9 16v4M15 16v4"></path>
														</g>
													</svg>
												)}
											</motion.button>
										)
									)}
								</div>
							</div>
						</motion.div>
						<motion.div
							className="w-full flex flex-col gap-1 px-2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							<p className="text-xs font-medium text-gray-600 dark:text-gray-400">
								Canvas Background
							</p>
							<div className="w-full h-10 flex gap-1 items-center">
								{backgrounds.map((val, i) => (
									<motion.button
										key={i}
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.95 }}
										className={`w-8 h-8 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-600 transition-all duration-200 ${
											background === val
												? "ring-2 ring-canvora-500 shadow-lg"
												: "hover:shadow-md"
										}`}
										style={{
											backgroundColor: `#${val}`,
										}}
										onClick={() => setBackground(val)}
									>
										<span className="sr-only">
											Background color {val}
										</span>
									</motion.button>
								))}
								<div className="h-[60%] border-r-1 border-r-gray-300 dark:border-r-gray-600 mx-0.5"></div>
								<div
									className="w-8 h-8 ring-2 ring-canvora-500 rounded-lg shadow-md"
									style={{
										backgroundColor: `#${background}`,
									}}
								></div>
							</div>
							<div className="flex flex-col gap-1">
								<p className="text-xs font-medium text-gray-600 dark:text-gray-400">
									Hex Code
								</p>
								<div className="group focus-within:border-canvora-500 dark:focus-within:border-canvora-400 w-full h-full border border-gray-200 dark:border-gray-600 rounded-lg flex py-1 bg-white dark:bg-gray-700 transition-all duration-200">
									<div className="px-2 font-semibold text-gray-600 dark:text-gray-400">
										{"#"}
									</div>
									<input
										className="appearance-none outline-none border-none px-1 w-full flex items-center text-sm bg-transparent text-gray-900 dark:text-gray-100"
										type="text"
										value={background}
										onChange={handleOnChange}
										placeholder="ffffff"
									/>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{showConfirm && (
					<motion.div
						className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl text-center border border-gray-200 dark:border-gray-600 max-w-md mx-4"
							initial={{ scale: 0.9, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.9, opacity: 0, y: 20 }}
							transition={{ duration: 0.2 }}
						>
							<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
								Reset Canvas
							</h3>
							<p className="mb-6 text-gray-600 dark:text-gray-400">
								Are you sure you want to reset the canvas? This
								will delete all messages in this room.
							</p>
							<div className="flex gap-3 justify-center">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg"
									onClick={async () => {
										try {
											const res = await axios.delete(
												"/api/reset-room",
												{ data: { roomId } }
											);
											if (res.status !== 200) {
												if (res.status === 404) {
													toast.error(
														"Only admin is permitted."
													);
													return;
												}
												toast.error(
													"Failed to reset canvas"
												);
											} else {
												toast.success(
													"Canvas reset successful!"
												);
												console.log("command");
												console.log(game?.socket);
												game?.socket.send(
													JSON.stringify({
														type: "reset-canvas",
														roomId: roomId,
													})
												);
												window.location.reload();
											}
										} catch (err) {
											toast.error(
												"Failed to reset canvas."
											);
										} finally {
											setShowConfirm(false);
										}
									}}
								>
									Confirm
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="px-6 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200"
									onClick={() => setShowConfirm(false)}
								>
									Cancel
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
