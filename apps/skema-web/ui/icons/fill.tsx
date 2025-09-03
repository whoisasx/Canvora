import { ReactNode, ComponentType } from "react";

function Hachure() {
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
				<defs>
					<clipPath id="box-clip">
						<rect
							x="2.625"
							y="2.625"
							width="14.75"
							height="14.75"
							rx="3.25"
							ry="3.25"
						/>
					</clipPath>
				</defs>

				<rect
					x="2.625"
					y="2.625"
					width="14.75"
					height="14.75"
					rx="3.25"
					ry="3.25"
					stroke="currentColor"
					strokeWidth="1.25"
					fill="none"
				/>

				<g clipPath="url(#box-clip)">
					{Array.from({ length: 15 }).map((_, i) => (
						<line
							key={i}
							x1={-5}
							y1={i * 4}
							x2={25}
							y2={i * 4 - 20}
							stroke="currentColor"
							strokeWidth="0.75"
						/>
					))}
				</g>
			</svg>
		</div>
	);
}

function Cross() {
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
				<defs>
					<clipPath id="box-clip">
						<rect
							x="2.625"
							y="2.625"
							width="14.75"
							height="14.75"
							rx="3.25"
							ry="3.25"
						/>
					</clipPath>
				</defs>

				<rect
					x="2.625"
					y="2.625"
					width="14.75"
					height="14.75"
					rx="3.25"
					ry="3.25"
					stroke="currentColor"
					strokeWidth="1.25"
					fill="none"
				/>

				<g clipPath="url(#box-clip)">
					{Array.from({ length: 15 }).map((_, i) => (
						<line
							key={`fwd-${i}`}
							x1={-5}
							y1={i * 4}
							x2={25}
							y2={i * 4 - 20}
							stroke="currentColor"
							strokeWidth="0.75"
						/>
					))}

					{Array.from({ length: 15 }).map((_, i) => (
						<line
							key={`back-${i}`}
							x1={25}
							y1={i * 4}
							x2={-5}
							y2={i * 4 - 20}
							stroke="currentColor"
							strokeWidth="0.75"
						/>
					))}
				</g>
			</svg>
		</div>
	);
}

function Solid() {
	return (
		<div>
			<svg
				aria-hidden="true"
				focusable="false"
				role="img"
				viewBox="0 0 20 20"
				className="w-4 h-4"
				fill="currentColor"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<g clipPath="url(#a)">
					<path
						d="M4.91 2.625h10.18a2.284 2.284 0 0 1 2.285 2.284v10.182a2.284 2.284 0 0 1-2.284 2.284H4.909a2.284 2.284 0 0 1-2.284-2.284V4.909a2.284 2.284 0 0 1 2.284-2.284Z"
						stroke="currentColor"
						strokeWidth="1.25"
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
function Dots() {
	return <p>d</p>;
}

const fillIcons: Record<string, ReactNode> = {
	hachure: <Hachure />,
	cross: <Cross />,
	solid: <Solid />,
	dots: <Dots />,
};
export default fillIcons;
