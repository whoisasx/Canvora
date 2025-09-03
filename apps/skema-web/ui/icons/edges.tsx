import { ReactNode } from "react";

function Sharp() {
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
				<svg strokeWidth="1.5">
					<path d="M3.33334 9.99998V6.66665C3.33334 6.04326 3.33403 4.9332 3.33539 3.33646C4.95233 3.33436 6.06276 3.33331 6.66668 3.33331H10"></path>
					<path d="M13.3333 3.33331V3.34331"></path>
					<path d="M16.6667 3.33331V3.34331"></path>
					<path d="M16.6667 6.66669V6.67669"></path>
					<path d="M16.6667 10V10.01"></path>
					<path d="M3.33334 13.3333V13.3433"></path>
					<path d="M16.6667 13.3333V13.3433"></path>
					<path d="M3.33334 16.6667V16.6767"></path>
					<path d="M6.66666 16.6667V16.6767"></path>
					<path d="M10 16.6667V16.6767"></path>
					<path d="M13.3333 16.6667V16.6767"></path>
					<path d="M16.6667 16.6667V16.6767"></path>
				</svg>
			</svg>
		</div>
	);
}

function Round() {
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
					strokeWidth="1.5"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M4 12v-4a4 4 0 0 1 4 -4h4"></path>
					<line x1="16" y1="4" x2="16" y2="4.01"></line>
					<line x1="20" y1="4" x2="20" y2="4.01"></line>
					<line x1="20" y1="8" x2="20" y2="8.01"></line>
					<line x1="20" y1="12" x2="20" y2="12.01"></line>
					<line x1="4" y1="16" x2="4" y2="16.01"></line>
					<line x1="20" y1="16" x2="20" y2="16.01"></line>
					<line x1="4" y1="20" x2="4" y2="20.01"></line>
					<line x1="8" y1="20" x2="8" y2="20.01"></line>
					<line x1="12" y1="20" x2="12" y2="20.01"></line>
					<line x1="16" y1="20" x2="16" y2="20.01"></line>
					<line x1="20" y1="20" x2="20" y2="20.01"></line>
				</g>
			</svg>
		</div>
	);
}

const edgesIcon: Record<string, ReactNode> = {
	sharp: <Sharp />,
	round: <Round />,
};
export default edgesIcon;
