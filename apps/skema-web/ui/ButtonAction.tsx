import { ReactNode } from "react";

interface IButtonAction {
	children: ReactNode;
	onClick?: () => void;
	color?: string;
}

export default function ButtonAction({
	children,
	onClick,
	color,
}: IButtonAction) {
	return (
		<button
			className="w-full h-8 rounded-lg hover:bg-canvora-100/50 dark:hover:bg-canvora-800/50 cursor-pointer transition-all duration-200"
			onClick={onClick}
			style={{
				backgroundColor: color
					? color === "transparent"
						? "transparent"
						: `#${color}`
					: "",
			}}
		>
			{children}
		</button>
	);
}
