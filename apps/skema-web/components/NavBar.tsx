import { Button } from "@/ui/Button";
import { CanvoraIcon, CanvoraTitle } from "@/ui/Canvora";
import { NavList } from "@/ui/landingpage/NavList";
import { useSideBarStore } from "@/utils/landingPageStore";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NavBar() {
	const [isResourcesHovered, setIsResourcesHovered] = useState(false);
	const setIsSideBarOpen = useSideBarStore((state) => state.setIsOpen);

	const [githubStar, setGithubStar] = useState<string>("");
	const router = useRouter();

	useEffect(() => {
		async function getStarCount() {
			try {
				const { data } = await axios.get<{ stargazers_count: number }>(
					"https://api.github.com/repos/whoisasx/Canvora",
					{ headers: { Accept: "application/vnd.github.v3+json" } }
				);

				let starCount =
					typeof data?.stargazers_count === "number"
						? data.stargazers_count
						: 1;
				if (starCount >= 1000) {
					const main = Math.floor(starCount / 1000); // 1 in 1200
					const decimal = Math.floor((starCount % 1000) / 100); // 2 in 1200 -> 200 / 100
					setGithubStar(`${main}.${decimal}k`);
				} else {
					setGithubStar(String(starCount));
				}
			} catch (error) {
				setGithubStar("10");
			}
		}
		getStarCount();
	}, []);

	const handleFreeBoard = async () => {
		window.open("/free-board", "_blank");
	};

	return (
		<div className="w-[80vw] xl:h-20 h-18 sticky top-10 border-t-[1px] border-x-[2px] border-canvora-100 rounded-3xl mx-auto flex items-center justify-between px-5 shadow-md shadow-canvora-100 bg-canvora-50/50 z-20">
			<div className="flex items-center justify-between gap-2">
				<button
					className="w-fit h-fit lg:hidden cursor-pointer"
					onClick={setIsSideBarOpen}
				>
					<div className="w-10 h-10 rounded-2xl bg-canvora-200 flex items-center justify-center hover:scale-95 transition-all duration-300 ease-in-out border-[0.5px] border-transparent hover:border-canvora-500">
						<div className="flex h-4 w-4 cursor-pointer flex-col justify-around">
							<div className="bg-canvora-500 h-0.5 rounded-md transition duration-500 ease-in-out"></div>
							<div className="bg-canvora-500 h-0.5 rounded-md transition duration-500 ease-in-out opacity-100"></div>
							<div className="bg-canvora-500 h-0.5 rounded-md transition duration-500 ease-in-out"></div>
						</div>
					</div>
				</button>

				<motion.div
					initial={{ x: -15, opacity: 0, scale: "0.95" }}
					animate={{ x: 0, opacity: 1, scale: "1" }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					className="flex items-center justify-center cursor-pointer"
					onMouseDown={(e) => {
						e.preventDefault();
						// If already on home, reload; otherwise navigate to home (full load)
						if (typeof window !== "undefined") {
							if (window.location.pathname === "/") {
								window.location.reload();
							} else {
								window.location.href = "/";
							}
						}
					}}
				>
					<CanvoraIcon className="lg:w-10 lg:h-10 md:w-8 md:h-8 w-6 h-6" />
					<CanvoraTitle className="lg:w-45 lg:h-10 md:w-36 md:h-8 w-27 h-6" />
				</motion.div>
				<div className="lg:block hidden xl:ml-8">
					<ul className="list-none p-0 mx-0 flex items-center justify-center xl:gap-4 lg:gap-2">
						<NavList href={"/"} children={"Pricing"} />
						<NavList href={"/"} children={"Teams"} />
						<NavList
							href={"/"}
							children={"Roadmap"}
							className="hidden xl:block"
						/>
						<div
							className="relative flex flex-col items-center"
							onMouseEnter={() => setIsResourcesHovered(true)}
							onMouseLeave={() => setIsResourcesHovered(false)}
						>
							<NavList href={"/"}>
								<span>Resources</span>
								<span>
									<svg
										aria-hidden={!isResourcesHovered}
										focusable={isResourcesHovered}
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
											transformOrigin: "top center",
										}}
										className="px-5 py-2 absolute top-full bg-oc-gray-0 rounded-xl shadow-sm"
									>
										<ul className="list-none p-0 m-0 flex flex-col items-center gap-1.5">
											<NavList
												href={"/"}
												children={"How to start"}
												className="hover:scale-105"
											/>
											<NavList
												href={"/"}
												children={"Community"}
												className="hover:scale-105"
											/>
											<NavList
												href={"/"}
												children={"Use Cases"}
												className="hover:scale-105"
											/>
											<NavList
												href={"/"}
												children={"Security"}
												className="hover:scale-105"
											/>
											<NavList
												href={"/"}
												children={"Blog"}
												className="hover:scale-105"
											/>
										</ul>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</ul>
				</div>
			</div>
			<div className="flex items-center justify-center xl:gap-5 lg:gap-2">
				<div className="">
					<Link
						className="lg:w-15 w-12 h-8 lg:h-10 rounded-2xl flex items-center gap-1 justify-center hover:bg-canvora-100 transition-all duration-300 ease-in-out"
						href={"https://www.github.com/whoisasx/Canvora"}
						target="_blank"
						rel="noopener noreferrer"
					>
						<svg
							aria-hidden="true"
							focusable="false"
							role="img"
							className="w-4 h-4"
							viewBox="0 0 24 24"
							fill="currentColor"
							strokeWidth="2"
							stroke="currentColor"
							strokeLinecap="round"
						>
							<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
						</svg>
						<p className="text-sm">{githubStar}</p>
					</Link>
				</div>
				<div className="flex items-center justify-center gap-3">
					<Button
						className="hidden lg:block"
						children={"Sign in"}
						size="small"
						level="tertiary"
						onClick={() => router.push("/signin")}
					/>
					<Button
						className="min-[580px]:block hidden"
						children={"Free whiteboard"}
						size="medium"
						level="primary"
						onClick={handleFreeBoard}
					/>
				</div>
			</div>
		</div>
	);
}
