import { ReactNode } from "react";

function Left() {
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
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<line x1="4" y1="8" x2="20" y2="8"></line>
					<line x1="4" y1="12" x2="12" y2="12"></line>
					<line x1="4" y1="16" x2="16" y2="16"></line>
				</g>
			</svg>
		</div>
	);
}

function Center() {
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
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<line x1="4" y1="8" x2="20" y2="8"></line>
					<line x1="8" y1="12" x2="16" y2="12"></line>
					<line x1="6" y1="16" x2="18" y2="16"></line>
				</g>
			</svg>
		</div>
	);
}

function Right() {
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
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<line x1="4" y1="8" x2="20" y2="8"></line>
					<line x1="10" y1="12" x2="20" y2="12"></line>
					<line x1="8" y1="16" x2="20" y2="16"></line>
				</g>
			</svg>
		</div>
	);
}

const textAlignIcon: Record<string, ReactNode> = {
	left: <Left />,
	center: <Center />,
	right: <Right />,
};
export default textAlignIcon;
