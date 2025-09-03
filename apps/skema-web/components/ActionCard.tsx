"use client";
import ButtonAction from "@/ui/ButtonAction";
import ButtonTool from "@/ui/ButtonTool";
import actionIcon from "@/ui/icons/actions";
import { useCanvasBgStore, useThemeStore } from "@/utils/canvasStore";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";
import { ChangeEvent } from "react";

export default function ActionCard() {
	const { data: session } = useSession();

	const backgrounds = useCanvasBgStore((state) => state.backgrounds);
	const setBackgrounds = useCanvasBgStore((state) => state.setBackgrounds);
	const background = useCanvasBgStore((state) => state.background);
	const setBackground = useCanvasBgStore((state) => state.setBackground);

	const { theme, setTheme, resolvedTheme } = useTheme();

	const themeTool = useThemeStore((state) => state.theme);
	const setThemeTool = useThemeStore((state) => state.setTheme);

	const [clicked, setClicked] = useState<boolean>(false);

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
		<div className="h-9 w-9 rounded-lg z-50 relative">
			<ButtonTool
				children={
					<svg
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
					</svg>
				}
				onClick={() => setClicked((prev) => !prev)}
				className="bg-oc-gray-2 dark:bg-[#232329] hover:bg-oc-gray-1 dark:hover:bg-oc-gray-8"
				// color={`${clicked ? (theme === "light" ? "d0bfff" : "495057") : ""}`}
			/>
			{clicked && (
				<div className="w-60 py-2 border border-gray-200 dark:bg-[#232329] dark:border-0 bg-white shadow-xl absolute top-[110%] flex flex-col gap-2 rounded-lg z-20 max-h-[80vh] overflow-auto custom-scrollbar dark:custom-scrollbar">
					<div className="px-2 flex flex-col gap-1">
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
							onClick={() => console.log("hi")}
						/>
						<div className="w-full border-t-[0.5px] border-t-gray-300 dark:border-t-gray-600 mx-auto"></div>
						<Link
							href="https://www.github.com/whoisasx/Canvora"
							target="_blank"
						>
							<ButtonAction children={actionIcon.gb} />
						</Link>
						<Link href={"https://x.com/whoisasx"} target="_blank">
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
								onClick={() => console.log("hi")}
							/>
						) : (
							<ButtonAction
								children={actionIcon.su}
								onClick={() => console.log("hi")}
							/>
						)}
					</div>
					<div className="w-full border-t-[0.5px] border-t-gray-300 dark:border-t-gray-600 mx-auto mt-15"></div>
					<div className="px-2">
						<div className="w-full h-10 flex justify-between items-center border rounded-lg border-gray-200 dark:border-gray-700 px-1 py-1.5">
							<p className="text-sm">Theme</p>
							<div className="w-auto px-1 flex gap-1.5 py-1 rounded-xl">
								{["light", "dark", "system"].map((val, i) => (
									<button
										key={i}
										className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border border-gray-200 dark:border-gray-700 ${theme === val ? "bg-oc-violet-7 dark:bg-oc-violet-5" : ""}`}
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
									</button>
								))}
							</div>
						</div>
					</div>
					<div className="w-full flex flex-col gap-1 px-2">
						<p className="text-xs">canvas background</p>
						<div className=" w-full h-10 flex gap-1 items-center">
							{backgrounds.map((val, i) => (
								<button
									key={i}
									className={` w-8 h-8 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700 ${background === val ? "outline outline-offset-1 outline-oc-violet-8" : ""}`}
									style={{
										backgroundColor: `#${val}`,
									}}
									onClick={() => setBackground(val)}
								>
									{"b"}
								</button>
							))}
							<div className="h-[60%] border-r-1 border-r-gray-300 mx-0.5"></div>
							<div
								className={`w-8 h-8 outline outline-offset-1 outline-gray-700 rounded-lg`}
								style={{
									backgroundColor: `#${background}`,
								}}
							></div>
						</div>
						<div className="flex flex-col gap-1">
							<p className="text-xs">Hexcode</p>
							<div className="group focus-within:border-0.5 focus-within:border-gray-600 dark:focus-within:border-gray-400 w-full h-full border-[0.5] border-gray-200 dark:border-gray-700 rounded-lg flex py-1">
								<div className="px-2 font-semibold">{"#"}</div>
								<input
									className="appearance-none outline-none border-none px-1 w-full flex items-center text-sm"
									type="text"
									value={background}
									onChange={handleOnChange}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
