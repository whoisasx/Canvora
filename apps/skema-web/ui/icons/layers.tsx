import { ReactNode } from "react";

function Back() {
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
				style={{
					transform: "rotate(180deg)",
				}}
			>
				<g strokeWidth="1.5">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M12 10l0 10"></path>
					<path d="M12 10l4 4"></path>
					<path d="M12 10l-4 4"></path>
					<path d="M4 4l16 0"></path>
				</g>
			</svg>
		</div>
	);
}

function Backward() {
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
				style={{
					transform: "rotate(180deg)",
				}}
			>
				<g strokeWidth="1.5">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M12 5l0 14"></path>
					<path d="M16 9l-4 -4"></path>
					<path d="M8 9l4 -4"></path>
				</g>
			</svg>
		</div>
	);
}

function ForWard() {
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
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M12 5l0 14"></path>
					<path d="M16 9l-4 -4"></path>
					<path d="M8 9l4 -4"></path>
				</g>
			</svg>
		</div>
	);
}

function Front() {
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
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M12 10l0 10"></path>
					<path d="M12 10l4 4"></path>
					<path d="M12 10l-4 4"></path>
					<path d="M4 4l16 0"></path>
				</g>
			</svg>
		</div>
	);
}

const layersIcon: Record<string, ReactNode> = {
	back: <Back />,
	backward: <Backward />,
	forward: <ForWard />,
	front: <Front />,
};
export default layersIcon;
