import { comic, excali } from "@/app/font";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function HeroSection() {
	const [githubStar, setGithubStar] = useState<string>("");

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

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, ease: "easeOut" }}
		>
			<div className="w-full mx-auto h-full bg-[url('/home-hero.svg')] dark:bg-[url('/home-hero.svg')] bg-center bg-no-repeat flex flex-col justify-center items-center px-10 py-10 relative">
				{/* Enhanced background for dark mode */}
				<div className="absolute inset-0 pointer-events-none" />

				{/* Floating particles animation */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{[...Array(6)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-3 h-3 bg-gradient-to-br from-canvora-400 to-canvora-600 dark:from-canvora-300 dark:to-canvora-500 rounded-full shadow-lg dark:shadow-canvora-500/50"
							animate={{
								y: [-20, -40, -20],
								x: [-10, 10, -10],
								opacity: [0.4, 0.8, 0.4],
								scale: [1, 1.2, 1],
							}}
							transition={{
								duration: 4 + i * 0.5,
								repeat: Infinity,
								ease: "easeInOut",
								delay: i * 0.8,
							}}
							style={{
								left: `${15 + i * 15}%`,
								top: `${20 + (i % 3) * 20}%`,
							}}
						/>
					))}
				</div>

				<div className="w-full flex flex-col items-center justify-center gap-2 relative z-10">
					<motion.div
						className="mt-25"
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<motion.h1
							className={`font-comic ${comic.variable} text-3xl min-[480]:text-5xl md:text-7xl sm:text-6xl font-extrabold p-5 flex items-center justify-center h-auto text-center flex-wrap gap-2 relative drop-shadow-2xl text-canvora-900 dark:text-white border-t-[0.5px] border-x-[1px] border-b-[1.5px] border-canvora-100 dark:border-canvora-500/70 dark:bg-canvora-800/80 backdrop-blur-sm rounded-2xl shadow-2xl dark:shadow-canvora-900/50 transition-all duration-500`}
							whileHover={{ scale: 1.02 }}
							transition={{ duration: 0.3 }}
						>
							<motion.span
								className="sm:py-2"
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.4 }}
							>
								{"Think"}
								<span className="bg-[url('/bg-green-strong.svg')] -skew-y-5 inline-block text-canvora-700 ml-2 px-2 py-1 rounded-lg shadow-lg">
									{"Visually."}
								</span>
							</motion.span>
							<motion.span
								className="sm:py-2"
								initial={{ x: 20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.6 }}
							>
								{"Build"}
								<span className="bg-[url('/bg-green-strong.svg')] ml-3 px-2 py-1 inline-block -skew-y-3 rounded-lg shadow-lg">
									<span className="bg-gradient-to-r from-[#6965db] via-[#3b1c6e] to-[#1a0033] dark:from-[#8b7cf6] dark:via-[#7c3aed] dark:to-[#6d28d9] bg-clip-text text-transparent">
										{"Together."}
									</span>
								</span>
							</motion.span>
							<motion.span
								className="absolute top-0 left-0 w-4 h-4 bg-gradient-to-br from-canvora-400 to-canvora-600 dark:from-canvora-300 dark:to-canvora-500 border-2 border-white dark:border-canvora-800 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg dark:shadow-canvora-500/50"
								animate={{
									scale: [1, 1.3, 1],
									rotate: [0, 180, 360],
								}}
								transition={{ duration: 3, repeat: Infinity }}
							/>
							<motion.span
								className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-300 dark:to-purple-500 border-2 border-white dark:border-canvora-800 rounded-full translate-x-1/2 -translate-y-1/2 shadow-lg dark:shadow-purple-500/50"
								animate={{
									scale: [1, 1.3, 1],
									rotate: [360, 180, 0],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									delay: 0.5,
								}}
							/>
							<motion.span
								className="absolute bottom-0 left-0 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-300 dark:to-blue-500 border-2 border-white dark:border-canvora-800 rounded-full -translate-x-1/2 translate-y-1/2 shadow-lg dark:shadow-blue-500/50"
								animate={{
									scale: [1, 1.3, 1],
									rotate: [0, -180, -360],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									delay: 1,
								}}
							/>
							<motion.span
								className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-br from-pink-400 to-pink-600 dark:from-pink-300 dark:to-pink-500 border-2 border-white dark:border-canvora-800 rounded-full translate-x-1/2 translate-y-1/2 shadow-lg dark:shadow-pink-500/50"
								animate={{
									scale: [1, 1.3, 1],
									rotate: [-360, -180, 0],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									delay: 1.5,
								}}
							/>
						</motion.h1>
					</motion.div>
					<motion.div
						className="w-full"
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.8 }}
					>
						<h3
							className={`text-lg sm:text-xl md:text-2xl text-center p-1 font-semibold text-canvora-900 dark:text-white transition-colors duration-500`}
						>
							<span>Ideate, Collaborate, Share. Simply with</span>
							<Link
								href={"/"}
								className="group rounded-2xl hover:bg-canvora-50/60 dark:hover:bg-canvora-700/60 transition-all duration-200 ease-in-out p-1 mt-1"
								onMouseDown={(e) => {
									e.preventDefault();
									if (typeof window !== "undefined") {
										if (window.location.pathname === "/") {
											window.location.reload();
										} else {
											window.location.href = "/";
										}
									}
								}}
							>
								<span
									className={`font-excali ${excali.variable} text-shadow-2xl text-xl sm:text-2xl md:text-3xl font-bold group-hover:opacity-70 p-1.5 bg-gradient-to-r from-canvora-600 to-canvora-800 dark:from-canvora-300 dark:to-canvora-500 bg-clip-text text-transparent`}
								>
									Canvora.
								</span>
							</Link>
						</h3>
					</motion.div>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.5, delay: 1 }}
						whileHover={{ scale: 1.05 }}
					>
						<Link
							href={"https://www.github.com/whoisasx/Canvora"}
							rel="noopener noreferer"
							target="_blank"
						>
							<div className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-300 dark:to-orange-400 rounded-lg px-3 py-1 mt-2 text-sm font-semibold border border-yellow-500 dark:border-yellow-400 hover:shadow-lg dark:hover:shadow-yellow-400/25 transition-all duration-300 text-gray-900 dark:text-gray-900">
								<div className="flex items-center justify-center gap-1">
									<motion.svg
										aria-hidden="true"
										focusable="false"
										role="img"
										className="w-3.5 h-3.5 flex items-center justify-center"
										viewBox="0 0 24 24"
										fill="none"
										strokeWidth="2"
										stroke="currentColor"
										strokeLinecap="round"
										animate={{ rotate: [0, 10, -10, 0] }}
										transition={{
											duration: 2,
											repeat: Infinity,
											ease: "easeInOut",
										}}
									>
										<path
											d="M0 0h24v24H0z"
											stroke="none"
										></path>
										<path d="m12 17.75-6.172 3.245 1.179-6.873-5-4.867 6.9-1 3.086-6.253 3.086 6.253 6.9 1-5 4.867 1.179 6.873z"></path>
									</motion.svg>
									<span>{githubStar}</span>
								</div>
								<span>{"on Github"}</span>
							</div>
						</Link>
					</motion.div>
				</div>
			</div>
			<div className="w-full mx-auto">
				<motion.div
					className="w-full py-5 flex items-center justify-center"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.6, delay: 1.2 }}
				>
					<motion.div
						animate={{ y: [0, -10, 0] }}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						<Image
							src={"/pen-tip.svg"}
							alt="pen-tip"
							width={50}
							height={50}
							className="w-auto h-auto dark:invert dark:brightness-125 transition-all duration-500 filter drop-shadow-lg dark:drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
						/>
					</motion.div>
				</motion.div>
			</div>
		</motion.div>
	);
}
