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
import { IndexDB } from "@/lib/indexdb";
import { SessionData } from "./freehand/FreeRoomCanvas";

export default function ActionCard({
	sessionData,
	indexdb,
	authenticated,
}: {
	sessionData?: SessionData;
	indexdb?: IndexDB;
	authenticated: boolean;
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
		<div ref={actContainerRef} className="h-9 w-9 rounded-xl z-50 relative">
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
					className="bg-white/80 dark:bg-gray-900/80 hover:bg-white/90 dark:hover:bg-gray-800/90 border border-canvora-200/50 dark:border-canvora-600/30 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md"
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
						className="w-60 py-4 border border-canvora-200/50 dark:border-canvora-600/30 bg-white/90 dark:bg-gray-900/90 shadow-xl absolute top-[110%] flex flex-col gap-1 rounded-xl z-20 max-h-[80vh] overflow-auto custom-scrollbar dark:custom-scrollbar backdrop-blur-md"
					>
						<motion.div
							className="px-3 flex flex-col gap-2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.1 }}
						>
							<div className="mb-2">
								<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
									Canvas Actions
								</p>
								<div className="flex flex-col gap-2">
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<ButtonAction
											children={actionIcon.cp}
											onClick={() => console.log("hi")}
										/>
									</motion.div>
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<ButtonAction
											children={actionIcon.st}
											onClick={() => console.log("hi")}
										/>
									</motion.div>
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<ButtonAction
											children={actionIcon.xi}
											onClick={() => console.log("hi")}
										/>
									</motion.div>
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<ButtonAction
											children={actionIcon.lc}
											onClick={() => console.log("hi")}
										/>
									</motion.div>
								</div>
							</div>

							<div className="mb-2">
								<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
									Danger Zone
								</p>
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<ButtonAction
										children={actionIcon.rc}
										onClick={() => {
											setShowConfirm(true);
										}}
									/>
								</motion.div>
							</div>

							<div className="w-full border-t border-canvora-200/50 dark:border-canvora-600/30 my-2"></div>

							<div className="mb-2">
								<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
									Social Links
								</p>
								<div className="flex flex-col gap-2">
									<motion.div
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.95 }}
									>
										<Link
											href="https://www.github.com/whoisasx/Canvora"
											target="_blank"
										>
											<ButtonAction
												children={actionIcon.gb}
											/>
										</Link>
									</motion.div>
									<motion.div
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.95 }}
									>
										<Link
											href={"https://x.com/whoisasx"}
											target="_blank"
										>
											<ButtonAction
												children={actionIcon.tx}
											/>
										</Link>
									</motion.div>
									<motion.div
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.95 }}
									>
										<Link
											href={""} //TODO;add the link to your portfolio
											target="_blank"
										>
											<ButtonAction
												children={actionIcon.am}
											/>
										</Link>
									</motion.div>
								</div>
							</div>

							<div className="w-full border-t border-canvora-200/50 dark:border-canvora-600/30 my-2"></div>

							<div>
								<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
									Account
								</p>
								{session && session.user ? (
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<ButtonAction
											children={actionIcon.lo}
											onClick={() =>
												signOut(redirect("/signin"))
											}
										/>
									</motion.div>
								) : (
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<ButtonAction
											children={actionIcon.su}
											onClick={() => redirect("/signup")}
										/>
									</motion.div>
								)}
							</div>
						</motion.div>
						<div className="w-full border-t border-canvora-200/50 dark:border-canvora-600/30 my-2"></div>
						<motion.div
							className="px-3"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							<div className="mb-4">
								<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
									Appearance
								</p>
								<div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200/50 dark:border-gray-600/30">
									<div className="flex justify-between items-center mb-3">
										<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Theme Mode
										</span>
									</div>
									<div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
										{["light", "dark", "system"].map(
											(val, i) => (
												<motion.button
													key={i}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className={`relative py-2 px-3 rounded-md flex flex-col items-center justify-center gap-1 transition-all duration-200 text-xs font-medium ${
														theme === val
															? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm ring-1 ring-canvora-200 dark:ring-canvora-600"
															: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
													}`}
													onClick={() =>
														setTheme(val)
													}
												>
													<div className="w-4 h-4">
														{val === "light" && (
															<svg
																className="w-full h-full"
																fill="none"
																stroke="currentColor"
																strokeWidth="2"
																viewBox="0 0 20 20"
															>
																<path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM10 4.167V2.5M14.167 5.833l1.166-1.166M15.833 10H17.5M14.167 14.167l1.166 1.166M10 15.833V17.5M5.833 14.167l-1.166 1.166M5 10H3.333M5.833 5.833 4.667 4.667" />
															</svg>
														)}
														{val === "dark" && (
															<svg
																className="w-full h-full"
																fill="none"
																stroke="currentColor"
																strokeWidth="2"
																viewBox="0 0 20 20"
															>
																<path d="M10 2.5h.328a6.25 6.25 0 0 0 6.6 10.372A7.5 7.5 0 1 1 10 2.493V2.5Z" />
															</svg>
														)}
														{val === "system" && (
															<svg
																className="w-full h-full"
																fill="none"
																stroke="currentColor"
																strokeWidth="2"
																viewBox="0 0 24 24"
															>
																<path d="M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-16a1 1 0 0 1-1-1v-10zM7 20h10M9 16v4M15 16v4" />
															</svg>
														)}
													</div>
													<span className="capitalize">
														{val}
													</span>
													{theme === val && (
														<motion.div
															className="absolute inset-0 rounded-md border-2 border-canvora-400 dark:border-canvora-500"
															initial={{
																scale: 0.8,
																opacity: 0,
															}}
															animate={{
																scale: 1,
																opacity: 1,
															}}
															transition={{
																duration: 0.2,
															}}
														/>
													)}
												</motion.button>
											)
										)}
									</div>
								</div>
							</div>
						</motion.div>
						<motion.div
							className="px-3 pb-2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							<div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200/50 dark:border-gray-600/30">
								<div className="mb-3">
									<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
										Canvas Background
									</p>
									<p className="text-xs text-gray-400 dark:text-gray-500">
										Choose a background color for your
										canvas
									</p>
								</div>

								<div className="space-y-3">
									<div>
										<p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
											Quick Colors
										</p>
										<div className="grid grid-cols-5 gap-1.5">
											{backgrounds.map((val, i) => (
												<motion.button
													key={i}
													whileHover={{
														scale: 1.1,
														y: -2,
													}}
													whileTap={{ scale: 0.95 }}
													className={`relative w-7 h-7 rounded-lg cursor-pointer border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
														background === val
															? "border-canvora-400 dark:border-canvora-500 ring-2 ring-canvora-200 dark:ring-canvora-600"
															: "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
													}`}
													style={{
														backgroundColor: `#${val}`,
													}}
													onClick={() =>
														setBackground(val)
													}
													title={`Background color #${val}`}
												>
													{background === val && (
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
											))}
										</div>
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
													backgroundColor: `#${background}`,
												}}
											>
												<div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10"></div>
											</div>
											<div className="flex-1 min-w-0">
												<div className="relative">
													<div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-mono text-xs">
														#
													</div>
													<input
														className="w-full h-8 pl-6 pr-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-mono transition-all duration-200 focus:ring-1 focus:ring-canvora-200 dark:focus:ring-canvora-600 focus:border-canvora-400 dark:focus:border-canvora-500 outline-none text-gray-900 dark:text-gray-100"
														type="text"
														value={background}
														onChange={
															handleOnChange
														}
														placeholder="ffffff"
														maxLength={6}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{showConfirm && (
					<motion.div
						className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm p-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl text-center border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 relative overflow-hidden"
							initial={{ scale: 0.9, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.9, opacity: 0, y: 20 }}
							transition={{ duration: 0.2 }}
						>
							{/* Decorative gradient */}
							<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-600"></div>

							{/* Warning Icon */}
							<motion.div
								className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
								initial={{ scale: 0, rotate: -180 }}
								animate={{ scale: 1, rotate: 0 }}
								transition={{ delay: 0.1, duration: 0.3 }}
							>
								<svg
									className="w-8 h-8 text-red-500 dark:text-red-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z"
									/>
								</svg>
							</motion.div>

							<motion.h3
								className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								Reset Canvas
							</motion.h3>

							<motion.p
								className="mb-6 text-gray-600 dark:text-gray-400 leading-relaxed"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								This action cannot be undone. All drawings,
								messages, and data in this room will be
								permanently deleted.
							</motion.p>

							<motion.div
								className="flex gap-3 justify-center"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
							>
								<motion.button
									whileHover={{
										scale: 1.05,
										boxShadow:
											"0 8px 25px rgba(239, 68, 68, 0.3)",
									}}
									whileTap={{ scale: 0.95 }}
									className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center gap-2"
									onClick={async () => {
										if (sessionData) {
											try {
												if (authenticated) {
													const res =
														await axios.delete(
															"/api/reset-room",
															{
																data: {
																	roomId: sessionData.roomId,
																},
															}
														);
													if (res.status !== 200) {
														if (
															res.status === 404
														) {
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
														sessionData.socket.send(
															JSON.stringify({
																type: "reset-canvas",
																roomId: sessionData.roomId,
															})
														);
														window.location.reload();
														toast.success(
															"Canvas reset successfully. ✅"
														);
													}
												} else {
													//TODO: fix here
												}
											} catch (err) {
												toast.error(
													"Failed to reset canvas. ❌"
												);
											} finally {
												setShowConfirm(false);
											}
											return;
										}
										if (indexdb) {
											try {
												await indexdb.clearCanvas();
												window.location.reload();
												toast.success(
													"Canvas reset successfully. ✅"
												);
											} catch (err) {
												toast.error(
													"Failed to reset canvas. ❌"
												);
											} finally {
												setShowConfirm(false);
											}
											return;
										}
									}}
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/>
									</svg>
									Reset Canvas
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold transition-all duration-200 border border-gray-200 dark:border-gray-600"
									onClick={() => setShowConfirm(false)}
								>
									Cancel
								</motion.button>
							</motion.div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
