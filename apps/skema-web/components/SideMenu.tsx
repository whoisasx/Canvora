import { NavList } from "@/ui/landingpage/NavList";
import { useSideBarStore } from "@/utils/landingPageStore";
import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/ui/Button";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function SideMenu() {
	const [isResourcesHovered, setIsResourcesHovered] = useState(false);
	const [mounted, setMounted] = useState(false);
	const setIsSideBarOpen = useSideBarStore((state) => state.setIsOpen);
	const divRef = useRef<HTMLDivElement | null>(null);
	const isOpen = useSideBarStore((s) => s.isOpen);
	const { theme, setTheme } = useTheme();

	const router = useRouter();

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="h-screen w-screen z-50 fixed top-0 left-0 lg:hidden backdrop-blur-md bg-black/30"
					onMouseDown={() => setIsSideBarOpen()}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
				>
					{/* Floating particles background */}
					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						{[...Array(12)].map((_, i) => (
							<motion.div
								key={i}
								className="absolute w-2 h-2 bg-canvora-400/30 dark:bg-canvora-500/20 rounded-full"
								animate={{
									y: [0, -30, 0],
									x: [0, 15, -15, 0],
									opacity: [0.3, 0.8, 0.3],
									scale: [1, 1.2, 1],
								}}
								transition={{
									duration: 4 + i * 0.5,
									repeat: Infinity,
									ease: "easeInOut",
									delay: i * 0.3,
								}}
								style={{
									left: `${10 + i * 8}%`,
									top: `${10 + (i % 4) * 20}%`,
								}}
							/>
						))}
					</div>

					<motion.div
						initial={{
							opacity: 0,
							x: "-100%",
							scale: 0.95,
							rotateY: -15,
						}}
						animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
						exit={{
							opacity: 0,
							x: "-100%",
							scale: 0.95,
							rotateY: -15,
						}}
						transition={{
							duration: 0.5,
							ease: [0.25, 0.46, 0.45, 0.94],
							type: "spring",
							stiffness: 280,
							damping: 25,
						}}
						className="w-[78%] h-full relative bg-gradient-to-br from-canvora-50/95 via-white/90 to-canvora-100/95 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95 border-r border-canvora-200/50 dark:border-gray-700/50 backdrop-blur-xl shadow-2xl"
						ref={divRef}
						onMouseDown={(e) => e.stopPropagation()}
						style={{ perspective: "1000px" }}
					>
						{/* Glowing edge effect */}
						<div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-canvora-400/50 via-canvora-500/70 to-canvora-400/50 dark:from-canvora-600/40 dark:via-canvora-500/60 dark:to-canvora-600/40 blur-sm"></div>
						<div className="h-[70%] flex flex-col relative">
							{/* Decorative corner elements */}
							<div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-canvora-300/40 dark:border-canvora-600/40 rounded-tl-xl"></div>
							<div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-canvora-300/40 dark:border-canvora-600/40 rounded-tr-xl"></div>

							<motion.div
								className="w-full h-15 border-b border-canvora-200/50 dark:border-gray-700/50 rounded-b-2xl flex px-5 justify-between items-center bg-gradient-to-r from-canvora-100/80 to-canvora-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl shadow-lg relative overflow-hidden"
								initial={{ y: -20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.2 }}
							>
								{/* Animated background shimmer */}
								<motion.div
									className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
									animate={{ x: ["-100%", "100%"] }}
									transition={{
										duration: 3,
										repeat: Infinity,
										ease: "easeInOut",
									}}
								/>

								<motion.div className="flex items-center gap-3 relative z-10">
									<motion.div
										className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full"
										animate={{
											scale: [1, 1.3, 1],
											opacity: [0.7, 1, 0.7],
										}}
										transition={{
											duration: 2,
											repeat: Infinity,
										}}
									/>
									<motion.p
										className="text-xl font-bold text-canvora-900 dark:text-canvora-100"
										initial={{ x: -20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{
											duration: 0.4,
											delay: 0.3,
										}}
									>
										Menu
									</motion.p>
								</motion.div>

								{/* Theme Toggle Button */}
								<div className="flex items-center gap-2 relative z-10">
									{mounted && (
										<motion.button
											initial={{ scale: 0.8, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{
												duration: 0.4,
												delay: 0.35,
											}}
											onClick={() =>
												setTheme(
													theme === "dark"
														? "light"
														: "dark"
												)
											}
											className="w-10 h-10 rounded-xl bg-gradient-to-br from-canvora-100 to-canvora-200 dark:from-canvora-700 dark:to-canvora-800 hover:from-canvora-200 hover:to-canvora-300 dark:hover:from-canvora-600 dark:hover:to-canvora-700 flex items-center justify-center transition-all duration-300 ease-in-out border border-canvora-300 dark:border-canvora-600 hover:border-canvora-400 dark:hover:border-canvora-500 shadow-sm hover:shadow-md group relative overflow-hidden"
											aria-label="Toggle theme"
											whileHover={{
												scale: 1.1,
												rotate: 180,
											}}
											whileTap={{ scale: 0.9 }}
										>
											{/* Shimmer effect */}
											<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>

											<motion.div
												key={theme}
												initial={{
													rotate: -180,
													opacity: 0,
												}}
												animate={{
													rotate: 0,
													opacity: 1,
												}}
												exit={{
													rotate: 180,
													opacity: 0,
												}}
												transition={{ duration: 0.3 }}
												className="relative z-10"
											>
												{theme === "dark" ? (
													<svg
														className="w-5 h-5 text-yellow-400"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fillRule="evenodd"
															d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
															clipRule="evenodd"
														/>
													</svg>
												) : (
													<svg
														className="w-5 h-5 text-canvora-600"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
													</svg>
												)}
											</motion.div>
										</motion.button>
									)}
								</div>
								<motion.button
									className="p-2.5 rounded-xl hover:bg-canvora-500 dark:hover:bg-canvora-600 hover:border-canvora-600 dark:hover:border-canvora-500 border border-transparent transition-all duration-300 ease-in-out hover:text-white cursor-pointer group relative overflow-hidden hover:shadow-lg"
									aria-label="Close"
									onClick={setIsSideBarOpen}
									whileHover={{
										scale: 1.15,
										rotate: 90,
										boxShadow:
											"0 8px 25px rgba(0,0,0,0.15)",
									}}
									whileTap={{ scale: 0.9, rotate: 45 }}
									initial={{ x: 20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ duration: 0.4, delay: 0.4 }}
								>
									{/* Pulsing background */}
									<motion.div
										className="absolute inset-0 bg-red-500/20 rounded-xl"
										animate={{
											scale: [1, 1.1, 1],
											opacity: [0, 0.3, 0],
										}}
										transition={{
											duration: 2,
											repeat: Infinity,
										}}
									/>
									{/* Ripple effect */}
									<motion.div
										className="absolute inset-0 bg-white/30 rounded-xl scale-0"
										whileTap={{
											scale: [0, 1.8],
											opacity: [0.4, 0],
											transition: { duration: 0.5 },
										}}
									/>
									<motion.svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-5 h-5 relative z-10"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
										whileHover={{ scale: 1.1 }}
									>
										<motion.path
											d="M18 6L6 18M6 6l12 12"
											initial={{ pathLength: 0 }}
											animate={{ pathLength: 1 }}
											transition={{
												duration: 0.5,
												delay: 0.5,
											}}
										/>
									</motion.svg>
								</motion.button>
							</motion.div>
							<motion.div
								className="w-full h-[92%] px-3 py-1 relative"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.3 }}
							>
								{/* Floating accent elements */}
								<div className="absolute top-4 right-4 w-1 h-1 bg-canvora-400 dark:bg-canvora-500 rounded-full opacity-60"></div>
								<div className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-canvora-300 dark:bg-canvora-600 rounded-full opacity-40"></div>

								<ul className="list-none p-0 m-0 flex flex-col items-center justify-center gap-3 relative z-10">
									<motion.div
										initial={{
											opacity: 0,
											x: -40,
											rotateY: -15,
										}}
										animate={{
											opacity: 1,
											x: 0,
											rotateY: 0,
										}}
										transition={{
											duration: 0.5,
											delay: 0.4,
											type: "spring",
											stiffness: 300,
										}}
										whileHover={{
											scale: 1.05,
											x: 5,
											boxShadow:
												"0 4px 20px rgba(0,0,0,0.1)",
										}}
									>
										<NavList
											className="w-full transition-all duration-200 hover:bg-canvora-50/50 dark:hover:bg-gray-700/50 rounded-lg"
											href={"/"}
											children={"Pricing"}
										/>
									</motion.div>
									<motion.div
										initial={{
											opacity: 0,
											x: -40,
											rotateY: -15,
										}}
										animate={{
											opacity: 1,
											x: 0,
											rotateY: 0,
										}}
										transition={{
											duration: 0.5,
											delay: 0.5,
											type: "spring",
											stiffness: 300,
										}}
										whileHover={{
											scale: 1.05,
											x: 5,
											boxShadow:
												"0 4px 20px rgba(0,0,0,0.1)",
										}}
									>
										<NavList
											className="w-full transition-all duration-200 hover:bg-canvora-50/50 dark:hover:bg-gray-700/50 rounded-lg"
											href={"/"}
											children={"Teams"}
										/>
									</motion.div>
									<motion.div
										initial={{
											opacity: 0,
											x: -40,
											rotateY: -15,
										}}
										animate={{
											opacity: 1,
											x: 0,
											rotateY: 0,
										}}
										transition={{
											duration: 0.5,
											delay: 0.6,
											type: "spring",
											stiffness: 300,
										}}
										whileHover={{
											scale: 1.05,
											x: 5,
											boxShadow:
												"0 4px 20px rgba(0,0,0,0.1)",
										}}
									>
										<NavList
											className="w-full transition-all duration-200 hover:bg-canvora-50/50 dark:hover:bg-gray-700/50 rounded-lg"
											href={"/"}
											children={"Roadmap"}
										/>
									</motion.div>
									<motion.div
										className="relative flex flex-col items-center w-full"
										onMouseEnter={() =>
											setIsResourcesHovered(true)
										}
										onMouseLeave={() =>
											setIsResourcesHovered(false)
										}
										initial={{
											opacity: 0,
											x: -40,
											rotateY: -15,
										}}
										animate={{
											opacity: 1,
											x: 0,
											rotateY: 0,
										}}
										transition={{
											duration: 0.5,
											delay: 0.7,
											type: "spring",
											stiffness: 300,
										}}
										whileHover={{
											scale: 1.05,
											x: 5,
											boxShadow:
												"0 4px 20px rgba(0,0,0,0.1)",
										}}
									>
										<NavList
											className="w-full hover:scale-105 transition-all duration-200 hover:bg-canvora-50/50 dark:hover:bg-gray-700/50 rounded-lg"
											href={"/"}
										>
											<span>Resources</span>
											<motion.span
												animate={{
													rotate: isResourcesHovered
														? 180
														: 0,
													scale: isResourcesHovered
														? 1.1
														: 1,
												}}
												transition={{ duration: 0.3 }}
											>
												<svg
													aria-hidden={
														!isResourcesHovered
													}
													focusable={
														isResourcesHovered
													}
													role="img"
													className="ml-1 w-4 h-4"
													viewBox="0 0 24 24"
													fill="none"
												>
													<motion.path
														fill="currentColor"
														d="M4.22 8.47a.75.75 0 0 1 1.06 0L12 15.19l6.72-6.72a.75.75 0 1 1 1.06 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L4.22 9.53a.75.75 0 0 1 0-1.06Z"
														initial={{
															pathLength: 0,
														}}
														animate={{
															pathLength: 1,
														}}
														transition={{
															duration: 0.5,
														}}
													/>
												</svg>
											</motion.span>
										</NavList>
										<AnimatePresence>
											{isResourcesHovered && (
												<motion.div
													initial={{
														opacity: 0,
														y: -10,
														scale: 0.95,
														rotateX: -15,
													}}
													animate={{
														opacity: 1,
														y: 0,
														scale: 1,
														rotateX: 0,
													}}
													exit={{
														opacity: 0,
														y: -10,
														scale: 0.95,
														rotateX: -15,
													}}
													transition={{
														duration: 0.4,
														ease: "easeOut",
														type: "spring",
														stiffness: 300,
													}}
													style={{
														transformOrigin:
															"top center",
													}}
													className="mt-2 px-3 py-2 absolute top-full bg-gradient-to-br from-canvora-50/90 to-white/90 dark:from-gray-800/90 dark:to-gray-700/90 rounded-2xl border border-canvora-200/60 dark:border-gray-600/60 w-full backdrop-blur-lg shadow-xl"
												>
													{/* Glowing border effect */}
													<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-canvora-400/20 via-canvora-500/30 to-canvora-400/20 dark:from-canvora-600/20 dark:via-canvora-500/30 dark:to-canvora-600/20 blur-sm"></div>

													<ul className="list-none p-0 m-0 flex flex-col items-center gap-2 relative z-10">
														{[
															"How to start",
															"Community",
															"Use Cases",
															"Security",
															"Blog",
														].map((item, index) => (
															<motion.div
																key={item}
																initial={{
																	opacity: 0,
																	x: -20,
																	scale: 0.9,
																}}
																animate={{
																	opacity: 1,
																	x: 0,
																	scale: 1,
																}}
																transition={{
																	duration: 0.3,
																	delay:
																		index *
																		0.1,
																	type: "spring",
																	stiffness: 400,
																}}
																whileHover={{
																	scale: 1.05,
																	x: 3,
																	backgroundColor:
																		"rgba(255,255,255,0.1)",
																}}
																className="w-full rounded-lg"
															>
																<NavList
																	className="w-full rounded-lg hover:bg-white/20 dark:hover:bg-gray-600/20 transition-colors duration-200"
																	href={"/"}
																	children={
																		item
																	}
																/>
															</motion.div>
														))}
													</ul>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								</ul>
							</motion.div>
						</div>
						<motion.div
							className="h-[30%] py-5 px-3 flex flex-col gap-3 items-center justify-end relative"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.8 }}
						>
							{/* Decorative elements */}
							<div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-canvora-300 dark:via-canvora-600 to-transparent rounded-full"></div>

							{/* Floating accent dots */}
							<motion.div
								className="absolute top-6 left-4 w-1 h-1 bg-canvora-400 dark:bg-canvora-500 rounded-full"
								animate={{
									scale: [1, 1.2, 1],
									opacity: [0.5, 1, 0.5],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									delay: 1,
								}}
							/>
							<motion.div
								className="absolute top-8 right-6 w-1.5 h-1.5 bg-canvora-300 dark:bg-canvora-600 rounded-full"
								animate={{
									scale: [1, 1.3, 1],
									opacity: [0.4, 0.8, 0.4],
								}}
								transition={{
									duration: 2.5,
									repeat: Infinity,
									delay: 0.5,
								}}
							/>

							<motion.div
								initial={{ opacity: 0, scale: 0.8, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								transition={{
									duration: 0.5,
									delay: 0.9,
									type: "spring",
									stiffness: 300,
								}}
								className="w-full"
								whileHover={{ scale: 1.02 }}
							>
								<Button
									className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300"
									children={"Sign in"}
									size="large"
									level="tertiary"
									onClick={() => router.push("/signin")}
								/>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, scale: 0.8, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								transition={{
									duration: 0.5,
									delay: 1.0,
									type: "spring",
									stiffness: 300,
								}}
								className="w-full"
								whileHover={{ scale: 1.02, y: -2 }}
							>
								<Button
									className="w-full shadow-lg hover:shadow-2xl transition-all duration-300"
									children={"Free whiteboard"}
									size="large"
									level="primary"
									onClick={() =>
										window.open("/free-board", "_blank")
									}
								/>
							</motion.div>
						</motion.div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
