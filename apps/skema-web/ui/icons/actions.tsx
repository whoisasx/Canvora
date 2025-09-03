import axios from "axios";
import { ReactNode, useEffect, useState } from "react";

function CommandPallete() {
	return (
		<div className="w-full h-full flex justify-between items-center px-2">
			<div className="flex gap-1">
				<div className="h-full flex items-center justify-center">
					<svg
						aria-hidden="true"
						focusable="false"
						role="img"
						viewBox="0 0 24 24"
						className="w-4 h-4"
						fill="none"
						strokeWidth="2"
						stroke="#5f3dc4"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<g strokeWidth="1.25">
							<path
								stroke="none"
								d="M0 0h24v24H0z"
								fill="none"
							></path>
							<path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"></path>
						</g>
					</svg>
				</div>
				<div className="flex items-center justify-center">
					<span className="text-xs font-semibold text-oc-violet-9 dark:text-oc-violet-4">
						Command palette
					</span>
				</div>
			</div>
			<div className="text-[10px] flex items-center justify-center text-oc-violet-2 dark:text-oc-violet-6 font-semibold">
				Cmd+/
			</div>
		</div>
	);
}

function SaveTo() {
	return (
		<div className="w-full h-full flex justify-between items-center px-2">
			<div className="flex gap-1">
				<div className="h-full flex items-center justify-center">
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
							strokeWidth="1.25"
							d="M3.333 14.167v1.666c0 .92.747 1.667 1.667 1.667h10c.92 0 1.667-.746 1.667-1.667v-1.666M5.833 9.167 10 13.333l4.167-4.166M10 3.333v10"
						></path>
					</svg>
				</div>
				<div className="flex items-center justify-center">
					<span className="text-xs font-semibold">Save to...</span>
				</div>
			</div>
			{/* <div className="text-xs font-semibold flex items-center justify-center">
				Cmd+/
			</div> */}
		</div>
	);
}

function ExportImage() {
	return (
		<div className="w-full h-full flex justify-between items-center px-2">
			<div className="flex gap-1">
				<div className="h-full flex items-center justify-center">
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
						<g strokeWidth="1.25">
							<path
								stroke="none"
								d="M0 0h24v24H0z"
								fill="none"
							></path>
							<path d="M15 8h.01"></path>
							<path d="M12 20h-5a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v5"></path>
							<path d="M4 15l4 -4c.928 -.893 2.072 -.893 3 0l4 4"></path>
							<path d="M14 14l1 -1c.617 -.593 1.328 -.793 2.009 -.598"></path>
							<path d="M19 16v6"></path>
							<path d="M22 19l-3 3l-3 -3"></path>
						</g>
					</svg>
				</div>
				<div className="flex items-center justify-center">
					<span className="text-xs font-semibold">
						Export image...
					</span>
				</div>
			</div>
			<div className="text-[10px] flex items-center justify-center text-oc-gray-5 dark:text-oc-gray-6">
				Cmd+Shift+E
			</div>
		</div>
	);
}
function LiveCollaboration() {
	return (
		<div className="w-full h-full flex justify-between items-center px-2">
			<div className="flex gap-1">
				<div className="h-full flex items-center justify-center">
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
							<circle cx="9" cy="7" r="4"></circle>
							<path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
							<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
							<path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
						</g>
					</svg>
				</div>
				<div className="flex items-center justify-center">
					<span className="text-xs font-semibold">
						Live Collaboration...
					</span>
				</div>
			</div>
			{/* <div className="text-xs font-semibold flex items-center justify-center">
				Cmd+/
			</div> */}
		</div>
	);
}
function ResetCanvas() {
	return (
		<div className="w-full h-full flex justify-between items-center px-2">
			<div className="flex gap-1">
				<div className="h-full flex items-center justify-center">
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
							strokeWidth="1.25"
							d="M3.333 5.833h13.334M8.333 9.167v5M11.667 9.167v5M4.167 5.833l.833 10c0 .92.746 1.667 1.667 1.667h6.666c.92 0 1.667-.746 1.667-1.667l.833-10M7.5 5.833v-2.5c0-.46.373-.833.833-.833h3.334c.46 0 .833.373.833.833v2.5"
						></path>
					</svg>
				</div>
				<div className="flex items-center justify-center">
					<span className="text-xs font-semibold">
						Reset the canvas
					</span>
				</div>
			</div>
			{/* <div className="text-xs font-semibold flex items-center justify-center">
				Cmd+/
			</div> */}
		</div>
	);
}
function Signup() {
	return (
		<div className="w-full h-full flex justify-between items-center px-2">
			<div className="flex gap-1">
				<div className="h-full flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#5f3dc4"
						strokeWidth="1.25"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-4 w-4"
					>
						<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
						<circle cx="9" cy="7" r="4"></circle>
						<line x1="19" x2="19" y1="8" y2="14"></line>
						<line x1="22" x2="16" y1="11" y2="11"></line>
					</svg>
				</div>
				<div className="flex items-center justify-center">
					<span className="text-xs font-semibold text-oc-violet-9 dark:text-oc-violet-4">
						Sign up
					</span>
				</div>
			</div>
			{/* <div className="text-xs font-semibold flex items-center justify-center">
				Cmd+/
			</div> */}
		</div>
	);
}
function Logout() {
	return (
		<div className="w-full h-full flex justify-between items-center px-2">
			<div className="flex gap-1">
				<div className="h-full flex items-center justify-center">
					<svg
						aria-hidden="true"
						focusable="false"
						role="img"
						viewBox="0 0 24 24"
						className="w-4 h-4"
						fill="none"
						strokeWidth="2"
						stroke="#5f3dc4"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<g strokeWidth="1.5">
							<path
								stroke="none"
								d="M0 0h24v24H0z"
								fill="none"
							></path>
							<path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
							<path d="M21 12h-13l3 -3"></path>
							<path d="M11 15l-3 -3"></path>
						</g>
					</svg>
				</div>
				<div className="flex items-center justify-center">
					<span className="text-xs font-semibold text-oc-violet-9 dark:text-oc-violet-4">
						Log out
					</span>
				</div>
			</div>
			{/* <div className="text-xs font-semibold flex items-center justify-center">
				Cmd+/
			</div> */}
		</div>
	);
}
function Github() {
	const [stars, setStars] = useState<number | undefined>(undefined);
	useEffect(() => {
		async function fetchRepo() {
			const response = await axios.get(
				"https://api.github.com/repos/whoisasx/Canvora"
			);
			if (!response.data.stargazers_count) return;
			setStars(response.data.stargazers_count);
		}
		fetchRepo();
	}, []);
	return (
		<div className="w-full h-full flex justify-between items-center px-2 bg-oc-yellow-4 dark:bg-oc-yellow-9 rounded-lg">
			<div className="flex gap-1">
				<div className="h-full flex items-center justify-center">
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
							d="M7.5 15.833c-3.583 1.167-3.583-2.083-5-2.5m10 4.167v-2.917c0-.833.083-1.166-.417-1.666 2.334-.25 4.584-1.167 4.584-5a3.833 3.833 0 0 0-1.084-2.667 3.5 3.5 0 0 0-.083-2.667s-.917-.25-2.917 1.084a10.25 10.25 0 0 0-5.166 0C5.417 2.333 4.5 2.583 4.5 2.583a3.5 3.5 0 0 0-.083 2.667 3.833 3.833 0 0 0-1.084 2.667c0 3.833 2.25 4.75 4.584 5-.5.5-.5 1-.417 1.666V17.5"
							strokeWidth="1.25"
						></path>
					</svg>
				</div>
				<div className="flex items-center justify-center">
					<span className="text-xs font-semibold">Github</span>
					<span className="flex items-center justify-start gap-1 text-xs font-semibold">
						{" - "}
						{stars !== undefined ? (
							<span>{stars}</span>
						) : (
							<svg
								className="w-4 h-4 animate-spin"
								viewBox="0 0 24 24"
								fill="none"
							>
								<circle
									cx="12"
									cy="12"
									r="8"
									stroke="currentColor"
									strokeWidth="3"
									strokeLinecap="round"
									strokeDasharray="56"
									strokeDashoffset="28"
								/>
							</svg>
						)}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4"
						>
							<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
						</svg>
					</span>
				</div>
			</div>
			{/* <div className="text-xs font-semibold flex items-center justify-center">
				Cmd+/
			</div> */}
		</div>
	);
}
function Twitter() {
	return (
		<div className="w-full h-full flex justify-between items-center px-2">
			<div className="flex gap-1">
				<div className="h-full flex items-center justify-center">
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
						<g strokeWidth="1.25">
							<path
								stroke="none"
								d="M0 0h24v24H0z"
								fill="none"
							></path>
							<path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
							<path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
						</g>
					</svg>
				</div>
				<div className="flex items-center justify-center">
					<span className="text-xs font-semibold">Twitter/X</span>
				</div>
			</div>
			{/* <div className="text-xs font-semibold flex items-center justify-center">
				Cmd+/
			</div> */}
		</div>
	);
}
function AboutMe() {
	return (
		<div className="w-full h-full flex justify-between items-center px-2">
			<div className="flex gap-1">
				<div className="h-full flex items-center justify-center">
					<svg
						aria-hidden="true"
						focusable="false"
						role="img"
						viewBox="0 0 24 24"
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.25"
					>
						<path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5z" />
						<path d="M12 14c-4.4 0-8 2.2-8 5v1c0 .6.4 1 1 1h14c.6 0 1-.4 1-1v-1c0-2.8-3.6-5-8-5z" />
					</svg>
				</div>
				<div className="flex items-center justify-center">
					<span className="text-xs font-semibold">About me</span>
				</div>
			</div>
			{/* <div className="text-xs font-semibold flex items-center justify-center">
				Cmd+/
			</div> */}
		</div>
	);
}

const actionIcon: Record<string, ReactNode> = {
	cp: <CommandPallete />,
	st: <SaveTo />,
	xi: <ExportImage />,
	lc: <LiveCollaboration />,
	rc: <ResetCanvas />,
	su: <Signup />,
	lo: <Logout />,
	gb: <Github />,
	tx: <Twitter />,
	am: <AboutMe />,
};
export default actionIcon;
