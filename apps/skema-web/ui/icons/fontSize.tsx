import { ReactNode } from "react";

function Small() {
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
				<g clipPath="url(#a)">
					<path
						d="M14.167 6.667a3.333 3.333 0 0 0-3.334-3.334H9.167a3.333 3.333 0 0 0 0 6.667h1.666a3.333 3.333 0 0 1 0 6.667H9.167a3.333 3.333 0 0 1-3.334-3.334"
						stroke="currentColor"
						strokeWidth="1.25"
						strokeLinecap="round"
						strokeLinejoin="round"
					></path>
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

function Medium() {
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
				<g clipPath="url(#a)">
					<path
						d="M5 16.667V3.333L10 15l5-11.667v13.334"
						stroke="currentColor"
						strokeWidth="1.25"
						strokeLinecap="round"
						strokeLinejoin="round"
					></path>
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

function Large() {
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
				<g clipPath="url(#a)">
					<path
						d="M5.833 3.333v13.334h8.334"
						stroke="currentColor"
						strokeWidth="1.25"
						strokeLinecap="round"
						strokeLinejoin="round"
					></path>
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
function Xlarge() {
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
				<path
					d="m1.667 3.333 6.666 13.334M8.333 3.333 1.667 16.667M11.667 3.333v13.334h6.666"
					stroke="currentColor"
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				></path>
			</svg>
		</div>
	);
}

const fontSizeIcon: Record<string, ReactNode> = {
	small: <Small />,
	medium: <Medium />,
	large: <Large />,
	xlarge: <Xlarge />,
};
export default fontSizeIcon;
