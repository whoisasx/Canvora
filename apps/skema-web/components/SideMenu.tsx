import { NavList } from "@/ui/landingpage/NavList";
import { useSideBarStore } from "@/utils/landingPageStore";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/ui/Button";
import { useRouter } from "next/navigation";

export default function SideMenu() {
	const [isResourcesHovered, setIsResourcesHovered] = useState(false);
	const setIsSideBarOpen = useSideBarStore((state) => state.setIsOpen);
	const divRef = useRef<HTMLDivElement | null>(null);
	const isOpen = useSideBarStore((s) => s.isOpen);

	const router = useRouter();

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="h-screen w-screen z-50 fixed top-0 left-0 lg:hidden backdrop-blur-xs"
					onMouseDown={() => setIsSideBarOpen()}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.25 }}
				>
					<motion.div
						initial={{ opacity: 0, x: "-100%" }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: "-100%" }}
						transition={{ duration: 0.35, ease: "easeOut" }}
						className="w-[50%] h-full bg-teal-50 border-r-[0.5px] border-oc-gray-6"
						ref={divRef}
						onMouseDown={(e) => e.stopPropagation()}
					>
						<div className="h-[70%] flex flex-col">
							<div className="w-full h-15 border-b-1 border-canvora-200 rounded-b-2xl flex px-5 justify-between items-center bg-canvora-50 backdrop:blur-3xl">
								<p className="text-xl font-semibold">Menu</p>
								<button
									className="p-2 rounded-2xl hover:bg-canvora-500 hover:border-oc-gray-6 border-[0.5px] border-transparent transition-all duration-300 ease-in-out hover:text-white cursor-pointer"
									aria-label="Close"
									onClick={setIsSideBarOpen}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-5 h-5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<path d="M18 6L6 18M6 6l12 12" />
									</svg>
								</button>
							</div>
							<div className="w-full h-[92%] px-3 py-1">
								<ul className="list-none p-0 m-0 flex flex-col items-center justify-center gap-2">
									<NavList
										className="w-full hover:scale-105"
										href={"/"}
										children={"Pricing"}
									/>
									<NavList
										className="w-full hover:scale-105"
										href={"/"}
										children={"Teams"}
									/>
									<NavList
										className="w-full hover:scale-105"
										href={"/"}
										children={"Roadmap"}
									/>
									<div
										className="relative flex flex-col items-center w-full"
										onMouseEnter={() =>
											setIsResourcesHovered(true)
										}
										onMouseLeave={() =>
											setIsResourcesHovered(false)
										}
									>
										<NavList
											className="w-full hover:scale-105"
											href={"/"}
										>
											<span>Resources</span>
											<span>
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
													{!isResourcesHovered && (
														<path
															fill="currentColor"
															d="M4.22 8.47a.75.75 0 0 1 1.06 0L12 15.19l6.72-6.72a.75.75 0 1 1 1.06 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L4.22 9.53a.75.75 0 0 1 0-1.06Z"
														></path>
													)}
													{isResourcesHovered && (
														<path
															fill="currentColor"
															d="M19.78 15.53a.75.75 0 0 1-1.06 0L12 8.81l-6.72 6.72a.75.75 0 1 1-1.06-1.06l7.25-7.25a.75.75 0 0 1 1.06 0l7.25 7.25a.75.75 0 0 1 0 1.06Z"
														></path>
													)}
												</svg>
											</span>
										</NavList>
										<AnimatePresence>
											{isResourcesHovered && (
												<motion.div
													initial={{
														opacity: 0,
														y: -6,
														scale: 0.95,
													}}
													animate={{
														opacity: 1,
														y: 0,
														scale: 1,
													}}
													exit={{
														opacity: 0,
														scale: 0.95,
													}}
													transition={{
														duration: 0.4,
														ease: "easeOut",
													}}
													style={{
														transformOrigin:
															"top center",
													}}
													className="mt-1 px-2 py-1.5 absolute top-full bg-canvora-50/50 rounded-3xl border-[0.5px] border-canvora-200 w-full"
												>
													<ul className="list-none p-0 m-0 flex flex-col items-center gap-1.5">
														<NavList
															className="w-full"
															href={"/"}
															children={
																"How to start"
															}
														/>
														<NavList
															className="w-full"
															href={"/"}
															children={
																"Community"
															}
														/>
														<NavList
															className="w-full"
															href={"/"}
															children={
																"Use Cases"
															}
														/>
														<NavList
															className="w-full"
															href={"/"}
															children={
																"Security"
															}
														/>
														<NavList
															className="w-full"
															href={"/"}
															children={"Blog"}
														/>
													</ul>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</ul>
							</div>
						</div>
						<div className="h-[30%] py-5 px-3 flex flex-col gap-3 items-center justify-end">
							<Button
								className="w-full"
								children={"Sign in"}
								size="large"
								level="tertiary"
								onClick={() => router.push("/signin")}
							/>
							<Button
								className="w-full"
								children={"Free whiteboard"}
								size="large"
								level="primary"
								onClick={() =>
									window.open("/free-board", "_blank")
								}
							/>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
