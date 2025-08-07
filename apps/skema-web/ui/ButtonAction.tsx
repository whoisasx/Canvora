import { ReactNode } from "react";

interface IButtonAction {
	children: ReactNode;
	onClick: () => void;
	color?: string;
}

export default function ButtonAction({
	children,
	onClick,
	color,
}: IButtonAction) {
	return (
		<button
			className="w-full h-10 rounded-lg hover:bg-oc-violet-1 cursor-pointer dark:hover:bg-oc-gray-8"
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
