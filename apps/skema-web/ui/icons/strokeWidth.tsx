import { ReactNode } from "react";

function Thin() {
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
					d="M4.167 10h11.666"
					stroke="currentColor"
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				></path>
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
				<path
					d="M5 10h10"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				></path>
			</svg>
		</div>
	);
}

function Thick() {
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
					d="M5 10h10"
					stroke="currentColor"
					strokeWidth="3.75"
					strokeLinecap="round"
					strokeLinejoin="round"
				></path>
			</svg>
		</div>
	);
}

const strokeWidthIcon: Record<string, ReactNode> = {
	thin: <Thin />,
	normal: <Normal />,
	thick: <Thick />,
};
export default strokeWidthIcon;
