import { ReactNode } from "react";

function Caveat() {
	return (
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				className="w-4 h-4"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M4 12c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0" />
			</svg>
		</div>
	);
}

function Draw() {
	return (
		<div>
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
		</div>
	);
}

function Code() {
	return (
		<div>
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
				<g
					clip-path="url(#a)"
					stroke="currentColor"
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M5.833 6.667 2.5 10l3.333 3.333M14.167 6.667 17.5 10l-3.333 3.333M11.667 3.333 8.333 16.667"></path>
				</g>
				<defs>
					<clipPath id="a">
						<path fill="#fff" d="M0 0h20v20H0z"></path>
					</clipPath>
				</defs>
			</svg>
		</div>
	);
}
function Normal() {
	return (
		<div>
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
				<g
					stroke="currentColor"
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M5.833 16.667v-10a3.333 3.333 0 0 1 3.334-3.334h1.666a3.333 3.333 0 0 1 3.334 3.334v10M5.833 10.833h8.334"></path>
				</g>
			</svg>
		</div>
	);
}
function Little() {
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
				<g
					stroke="currentColor"
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M7 12h10"></path>
					<path d="M7 5v14"></path>
					<path d="M17 5v14"></path>
					<path d="M15 19h4"></path>
					<path d="M15 5h4"></path>
					<path d="M5 19h4"></path>
					<path d="M5 5h4"></path>
				</g>
			</svg>
		</div>
	);
}
function Nunito() {
	return (
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				className="w-4 h-4"
				fill="none"
				stroke="currentColor"
				strokeWidth="1"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<polyline points="9 6 4 12 9 18" />
				<polyline points="15 6 20 12 15 18" />
			</svg>
		</div>
	);
}
function Mono() {
	return (
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				className="w-4 h-4"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			>
				<line x1="6" y1="12" x2="18" y2="12" />
			</svg>
		</div>
	);
}

const fontFamilyIcon: Record<string, ReactNode> = {
	caveat: <Caveat />,
	draw: <Draw />,
	code: <Code />,
	normal: <Normal />,
	little: <Little />,
	nunito: <Nunito />,
	mono: <Mono />,
};
export default fontFamilyIcon;
