import { ReactNode } from "react";

function Sharp() {
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
				<g>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M6 18l12 -12"></path>
					<path d="M18 10v-4h-4"></path>
				</g>
			</svg>
		</div>
	);
}

function Curved() {
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
				<g>
					<path d="M16,12L20,9L16,6"></path>
					<path d="M6 20c0 -6.075 4.925 -11 11 -11h3"></path>
				</g>
			</svg>
		</div>
	);
}

function Elbow() {
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
				<g>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M4,19L10,19C11.097,19 12,18.097 12,17L12,9C12,7.903 12.903,7 14,7L21,7"></path>
					<path d="M18 4l3 3l-3 3"></path>
				</g>
			</svg>
		</div>
	);
}

const arrowTypeIcon: Record<string, ReactNode> = {
	sharp: <Sharp />,
	curved: <Curved />,
	elbow: <Elbow />,
};
export default arrowTypeIcon;
