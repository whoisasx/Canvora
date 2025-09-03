import { ReactNode } from "react";

function None() {
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
				<g stroke="currentColor" opacity="0.3" strokeWidth="2">
					<path d="M12 12l9 0"></path>
					<path d="M3 9l6 6"></path>
					<path d="M3 15l6 -6"></path>
				</g>
			</svg>
		</div>
	);
}

function Arrow() {
	return (
		<div>
			<svg
				aria-hidden="true"
				focusable="false"
				role="img"
				viewBox="0 0 40 20"
				className="w-4 h-4"
			>
				<g
					transform=""
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
				>
					<path d="M34 10H6M34 10L27 5M34 10L27 15"></path>
					<path d="M27.5 5L34.5 10L27.5 15"></path>
				</g>
			</svg>
		</div>
	);
}

function Triangle() {
	return (
		<div>
			<svg
				aria-hidden="true"
				focusable="false"
				role="img"
				viewBox="0 0 40 20"
				className="w-4 h-4"
			>
				<g stroke="currentColor" fill="currentColor" transform="">
					<path d="M32 10L6 10" strokeWidth="2"></path>
					<path d="M27.5 5.5L34.5 10L27.5 14.5L27.5 5.5"></path>
				</g>
			</svg>
		</div>
	);
}
function TriangleOutline() {
	return (
		<div>
			<svg
				aria-hidden="true"
				focusable="false"
				role="img"
				viewBox="0 0 40 20"
				className="w-4 h-4"
			>
				<g
					stroke="currentColor"
					fill="none"
					transform=""
					strokeWidth="2"
					strokeLinejoin="round"
				>
					<path d="M6,9.5H27"></path>
					<path d="M27,5L34,10L27,14Z" fill="none"></path>
				</g>
			</svg>
		</div>
	);
}

const frontHeadIcons: Record<string, ReactNode> = {
	none: <None />,
	arrow: <Arrow />,
	triangle: <Triangle />,
	triangleOutline: <TriangleOutline />,
};
export default frontHeadIcons;
