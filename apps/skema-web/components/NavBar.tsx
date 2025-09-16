import { Button } from "@/ui/Button";
import { CanvoraIcon, CanvoraTitle } from "@/ui/Canvora";
import { NavList } from "@/ui/landingpage/NavList";
import { useSideBarStore } from "@/utils/landingPageStore";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

export default function NavBar() {
	const [isResourcesHovered, setIsResourcesHovered] = useState(false);
	const setIsSideBarOpen = useSideBarStore((state) => state.setIsOpen);
	const [githubStar, setGithubStar] = useState<string>("");
	const [mounted, setMounted] = useState(false);
	const router = useRouter();
	const { theme, setTheme } = useTheme();
	const { data: session, status } = useSession();

	useEffect(() => {
		setMounted(true);
	}, []);

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

	const handleSignIn = () => {
		if (session) {
			// User is already signed in, redirect to dashboard
			router.push("/dashboard");
		} else {
			// User is not signed in, redirect to sign-in page
			router.push("/signin");
		}
	};

	return (
		<div className="w-[80vw] xl:h-20 h-18 sticky top-10 border-t-[1px] border-x-[2px] border-canvora-100 dark:border-canvora-600 rounded-3xl mx-auto flex items-center justify-between px-5 shadow-md shadow-canvora-100 dark:shadow-canvora-800 bg-canvora-50/50 dark:bg-gray-800/50 backdrop-blur-md z-20 transition-all duration-300">
			<div className="flex items-center justify-between gap-2">
				<motion.button
					className="w-fit h-fit lg:hidden cursor-pointer group"
					onClick={setIsSideBarOpen}
					whileHover={{ scale: 1.08 }}
					whileTap={{ scale: 0.92 }}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-canvora-100 to-canvora-200 dark:from-canvora-700 dark:to-canvora-800 flex items-center justify-center transition-all duration-300 ease-in-out border border-canvora-300 dark:border-canvora-600 hover:border-canvora-500 dark:hover:border-canvora-400 shadow-md hover:shadow-lg group-hover:from-canvora-200 group-hover:to-canvora-300 dark:group-hover:from-canvora-600 dark:group-hover:to-canvora-700">
						<div className="relative flex h-4 w-4 cursor-pointer flex-col justify-around z-10">
							<motion.div
								className="bg-canvora-600 dark:bg-canvora-300 h-0.5 rounded-full transition-all duration-300 ease-in-out group-hover:bg-canvora-700 dark:group-hover:bg-canvora-200"
								whileHover={{ scaleX: 1.1 }}
							></motion.div>
							<motion.div
								className="bg-canvora-600 dark:bg-canvora-300 h-0.5 rounded-full transition-all duration-300 ease-in-out opacity-100 group-hover:bg-canvora-700 dark:group-hover:bg-canvora-200"
								whileHover={{ scaleX: 0.9 }}
							></motion.div>
							<motion.div
								className="bg-canvora-600 dark:bg-canvora-300 h-0.5 rounded-full transition-all duration-300 ease-in-out group-hover:bg-canvora-700 dark:group-hover:bg-canvora-200"
								whileHover={{ scaleX: 1.1 }}
							></motion.div>
						</div>
					</div>
				</motion.button>{" "}
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
										className="px-5 py-2 absolute top-full bg-oc-gray-0 dark:bg-gray-800 rounded-xl shadow-sm border dark:border-canvora-600"
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
						className="lg:w-15 w-12 h-8 lg:h-10 rounded-2xl flex items-center gap-1 justify-center hover:bg-canvora-100 dark:hover:bg-canvora-700 transition-all duration-300 ease-in-out"
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
						children={session ? "Dashboard" : "Sign in"}
						size="small"
						level="tertiary"
						onClick={handleSignIn}
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
