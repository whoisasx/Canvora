import { comic, excali } from "@/app/font";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
		<div>
			<div className="w-full mx-auto h-full bg-[url('/home-hero.svg')] bg-center bg-no-repeat flex flex-col justify-center items-center px-10 py-10">
				<div className="w-full flex flex-col items-center justify-center gap-2">
					<div className="mt-25">
						<h1
							className={`font-comic ${comic.variable} text-3xl min-[480]:text-5xl md:text-7xl sm:text-6xl font-extrabold p-5 flex items-center justify-center h-auto text-center flex-wrap gap-2 relative drop-shadow-2xl text-canvora-900 border-t-[0.5px] border-x-[1px] border-b-[1.5px] border-canvora-100`}
						>
							<span className="sm:py-2">
								{"Think"}
								<span className="bg-[url('/bg-green-strong.svg')] -skew-y-5 inline-block text-canvora-700 ml-2">
									{"Visually."}
								</span>
							</span>
							<span className="sm:py-2">
								{"Build"}
								<span className="bg-[url('/bg-green-strong.svg')] ml-3 px-1 inline-block -skew-y-3">
									<span className=" bg-gradient-to-r from-[#6965db] via-[#3b1c6e] to-[#1a0033] bg-clip-text text-transparent">
										{"Together."}
									</span>
								</span>
							</span>
							<span className="absolute top-0 left-0 w-3 h-3 bg-oc-teal-0 border-2 border-oc-gray-4 rounded-full -translate-x-1/2 -translate-y-1/2"></span>
							<span className="absolute top-0 right-0 w-3 h-3 bg-oc-teal-0 border-2 border-oc-gray-4 rounded-full translate-x-1/2 -translate-y-1/2"></span>
							<span className="absolute bottom-0 left-0 w-3 h-3 bg-oc-teal-0 border-2 border-oc-gray-4 rounded-full -translate-x-1/2 translate-y-1/2"></span>
							<span className="absolute bottom-0 right-0 w-3 h-3 bg-oc-teal-0 border-2 border-oc-gray-4 rounded-full translate-x-1/2 translate-y-1/2"></span>
						</h1>
					</div>
					<div className="w-full">
						<h3
							className={`text-lg sm:text-xl md:text-2xl text-center p-1 font-semibold text-canvora-900`}
						>
							<span>Ideate, Collaborate, Share. Simply with</span>
							<Link
								href={"/"}
								className="group rounded-2xl hover:bg-canvora-50/60 transition-all duration-200 ease-in-out p-1 mt-1"
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
									className={`font-excali ${excali.variable} text-shadow-2xl text-xl sm:text-2xl md:text-3xl font-bold group-hover:opacity-70 p-1.5`}
								>
									Canvora.
								</span>
							</Link>
						</h3>
					</div>
					<Link
						href={"https://www.github.com/whoisasx/Canvora"}
						rel="noopener noreferer"
						target="_blank"
					>
						<div className="flex items-center justify-center gap-2 bg-oc-yellow-4 rounded-lg px-3 py-1 mt-2 text-sm font-semibold border border-canvora-600">
							<div className="flex items-center justify-center gap-1">
								<svg
									aria-hidden="true"
									focusable="false"
									role="img"
									className="w-3.5 h-3.5 flex items-center justify-center"
									viewBox="0 0 24 24"
									fill="none"
									strokeWidth="2"
									stroke="currentColor"
									strokeLinecap="round"
								>
									<path
										d="M0 0h24v24H0z"
										stroke="none"
									></path>
									<path d="m12 17.75-6.172 3.245 1.179-6.873-5-4.867 6.9-1 3.086-6.253 3.086 6.253 6.9 1-5 4.867 1.179 6.873z"></path>
								</svg>
								<span>{githubStar}</span>
							</div>
							<span>{"on Github"}</span>
						</div>
					</Link>
				</div>
			</div>
			<div className="w-full mx-auto">
				<div className="w-full py-5 flex items-center justify-center">
					<Image
						src={"/pen-tip.svg"}
						alt="pen-tip"
						width={50}
						height={50}
						className="w-auto h-auto"
					/>
				</div>
			</div>
		</div>
	);
}
