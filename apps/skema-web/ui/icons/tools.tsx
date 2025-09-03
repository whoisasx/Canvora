import { ReactNode } from "react";

function Lock() {
	return (
		<div className="w-full h-full flex justify-center items-center">
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
				<g strokeWidth="1.25">
					<path d="M13.542 8.542H6.458a2.5 2.5 0 0 0-2.5 2.5v3.75a2.5 2.5 0 0 0 2.5 2.5h7.084a2.5 2.5 0 0 0 2.5-2.5v-3.75a2.5 2.5 0 0 0-2.5-2.5Z"></path>
					<path d="M10 13.958a1.042 1.042 0 1 0 0-2.083 1.042 1.042 0 0 0 0 2.083Z"></path>
					<path d="M6.667 8.333V5.417C6.667 3.806 8.159 2.5 10 2.5c1.841 0 3.333 1.306 3.333 2.917v2.916"></path>
				</g>
			</svg>
		</div>
	);
}
function Hand() {
	return (
		<div className="w-full h-full flex items-center justify-center">
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
				<g
					strokeWidth="1.25"
					className="flex items-center justify-center"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5"></path>
					<path d="M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5"></path>
					<path d="M14 5.5a1.5 1.5 0 0 1 3 0v6.5"></path>
					<path d="M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47"></path>
				</g>
			</svg>
		</div>
	);
}
function Mouse() {
	return (
		<div className="w-full h-full flex items-center justify-center">
			<svg
				aria-hidden="true"
				focusable="false"
				role="img"
				viewBox="0 0 22 22"
				className="w-4 h-4"
				fill="none"
				strokeWidth="1.25"
			>
				<g
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M6 6l4.153 11.793a0.365 .365 0 0 0 .331 .207a0.366 .366 0 0 0 .332 -.207l2.184 -4.793l4.787 -1.994a0.355 .355 0 0 0 .213 -.323a0.355 .355 0 0 0 -.213 -.323l-11.787 -4.36z"></path>
					<path d="M13.5 13.5l4.5 4.5"></path>
				</g>
			</svg>
			<span className="w-2 h-2 mt-3.5 text-[10px] text-gray-400 ">1</span>
		</div>
	);
}
function Rectangle() {
	return (
		<div className="w-full h-full flex items-center justify-center">
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
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<rect x="4" y="4" width="16" height="16" rx="2"></rect>
				</g>
			</svg>
			<span className="w-2 h-2 mt-3.5 text-[10px] text-gray-400 ">2</span>
		</div>
	);
}
function Rhombus() {
	return (
		<div className="w-full h-full flex items-center justify-center">
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
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M10.5 20.4l-6.9 -6.9c-.781 -.781 -.781 -2.219 0 -3l6.9 -6.9c.781 -.781 2.219 -.781 3 0l6.9 6.9c.781 .781 .781 2.219 0 3l-6.9 6.9c-.781 .781 -2.219 .781 -3 0z"></path>
				</g>
			</svg>
			<span className="w-2 h-2 mt-3.5 text-[10px] text-gray-400 ">3</span>
		</div>
	);
}
function Arc() {
	return (
		<div className="w-full h-full flex items-center justify-center">
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
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<circle cx="12" cy="12" r="9"></circle>
				</g>
			</svg>
			<span className="w-2 h-2 mt-3.5 text-[10px] text-gray-400 ">4</span>
		</div>
	);
}
function Arrow() {
	return (
		<div className="w-full h-full flex items-center justify-center">
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
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<line x1="5" y1="12" x2="19" y2="12"></line>
					<line x1="15" y1="16" x2="19" y2="12"></line>
					<line x1="15" y1="8" x2="19" y2="12"></line>
				</g>
			</svg>
			<span className="w-2 h-2 mt-3.5 text-[10px] text-gray-400 ">5</span>
		</div>
	);
}
function Line() {
	return (
		<div className="w-full h-full flex items-center justify-center">
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
				<path d="M4.167 10h11.666" strokeWidth="1.5"></path>
			</svg>
			<span className="w-2 h-2 mt-3.5 text-[10px] text-gray-400 ">6</span>
		</div>
	);
}
function Pencil() {
	return (
		<div className="w-full h-full flex items-center justify-center">
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
				<g strokeWidth="1.25">
					<path
						clipRule="evenodd"
						d="m7.643 15.69 7.774-7.773a2.357 2.357 0 1 0-3.334-3.334L4.31 12.357a3.333 3.333 0 0 0-.977 2.357v1.953h1.953c.884 0 1.732-.352 2.357-.977Z"
					></path>
					<path d="m11.25 5.417 3.333 3.333"></path>
				</g>
			</svg>
			<span className="w-2 h-2 mt-3.5 text-[10px] text-gray-400 ">7</span>
		</div>
	);
}
function Text() {
	return (
		<div className="w-full h-full flex items-center justify-center">
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
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<line x1="4" y1="20" x2="7" y2="20"></line>
					<line x1="14" y1="20" x2="21" y2="20"></line>
					<line x1="6.9" y1="15" x2="13.8" y2="15"></line>
					<line x1="10.2" y1="6.3" x2="16" y2="20"></line>
					<polyline points="5 20 11 4 13 4 20 20"></polyline>
				</g>
			</svg>
			<span className="w-2 h-2 mt-3.5 text-[10px] text-gray-400 ">8</span>
		</div>
	);
}
function Image() {
	return (
		<div className="w-full h-full flex items-center justify-center">
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
				<g strokeWidth="1.25">
					<path d="M12.5 6.667h.01"></path>
					<path d="M4.91 2.625h10.18a2.284 2.284 0 0 1 2.285 2.284v10.182a2.284 2.284 0 0 1-2.284 2.284H4.909a2.284 2.284 0 0 1-2.284-2.284V4.909a2.284 2.284 0 0 1 2.284-2.284Z"></path>
					<path d="m3.333 12.5 3.334-3.333c.773-.745 1.726-.745 2.5 0l4.166 4.166"></path>
					<path d="m11.667 11.667.833-.834c.774-.744 1.726-.744 2.5 0l1.667 1.667"></path>
				</g>
			</svg>
			<span className="w-2 h-2 mt-3.5 text-[10px] text-gray-400 ">9</span>
		</div>
	);
}
function Eraser() {
	return (
		<div className="w-full h-full flex items-center justify-center">
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
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3"></path>
					<path d="M18 13.3l-6.3 -6.3"></path>
				</g>
			</svg>
			<span className="w-2 h-2 mt-3.5 text-[10px] text-gray-400 ">0</span>
		</div>
	);
}
function Options() {
	return (
		<div>
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
					<path d="M0 0h24v24H0z" stroke="none" fill="none"></path>
					<path d="M12 3l-4 7h8z"></path>
					<path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
					<path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
				</g>
			</svg>
		</div>
	);
}
function Web() {
	return (
		<div className="w-full h-full flex justify-between items-center px-2">
			<div className="flex gap-2 items-center justify-center">
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
						<g strokeWidth="1.5">
							<polyline points="12 16 18 10 12 4"></polyline>
							<polyline points="8 4 2 10 8 16"></polyline>
						</g>
					</svg>
				</div>
				<div className="">
					<span className="text-sm">Web</span>
				</div>
			</div>
			<div className="text-sm text-gray-400">W</div>
		</div>
	);
}
function Laser() {
	return (
		<div className="w-full h-full flex items-center justify-between px-2">
			<div className="h-full flex gap-2 items-center justify-center">
				<div className="h-full flex items-center justify-center">
					<svg
						aria-hidden="true"
						focusable="false"
						role="img"
						viewBox="0 0 20 20"
						className="w-4 h-4"
					>
						<g
							fill="none"
							stroke="currentColor"
							strokeWidth="1.25"
							strokeLinecap="round"
							strokeLinejoin="round"
							transform="rotate(90 10 10)"
						>
							<path
								clipRule="evenodd"
								d="m9.644 13.69 7.774-7.773a2.357 2.357 0 0 0-3.334-3.334l-7.773 7.774L8 12l1.643 1.69Z"
							></path>
							<path d="m13.25 3.417 3.333 3.333M10 10l2-2M5 15l3-3M2.156 17.894l1-1M5.453 19.029l-.144-1.407M2.377 11.887l.866 1.118M8.354 17.273l-1.194-.758M.953 14.652l1.408.13"></path>
						</g>
					</svg>
				</div>
				<div className="">
					<span className="text-sm">Laser pointer</span>
				</div>
			</div>
			<div className="text-sm text-gray-400">K</div>
		</div>
	);
}

const toolsIcon: Record<string, ReactNode> = {
	lock: <Lock />,
	hand: <Hand />,
	mouse: <Mouse />,
	rectangle: <Rectangle />,
	rhombus: <Rhombus />,
	arc: <Arc />,
	arrow: <Arrow />,
	line: <Line />,
	pencil: <Pencil />,
	text: <Text />,
	image: <Image />,
	eraser: <Eraser />,
	web: <Web />,
	laser: <Laser />,
	options: <Options />,
};

export default toolsIcon;
