import { ReactNode } from "react";

type Size = "small" | "medium" | "large";
type Level = "primary" | "secondary" | "tertiary";

interface IButton {
	children: ReactNode;
	className?: string;
	size: Size;
	level: Level;
	onClick: () => void;
}

const sizeProps: Record<Size, string> = {
	small: "h-12 w-24 border-t-[0.5px] border-x-[1px] border-b-[2px] hover:scale-105 rounded-full text-sm",
	medium: "h-12 w-36 rounded-full text-sm hover:text-base hover:scale-105 outline-1 outline-offset-1 outline-oc-gray-4 dark:outline-oc-gray-1",
	large: "h-12 w-72 rounded-full text-base hover:scale-95 border-t-[0.5px] border-x-[1px] border-b-[2px] border-oc-gray-4 dark:border-oc-gray-7",
};
const levelProps: Record<Level, string> = {
	primary:
		"bg-canvora-500 text-white outline-oc-gray-4 dark:outline-oc-gray-1 hover:text-black dark:hover:bg-canvora-900 hover:bg-canvora-50 hover:text-canvora-600 dark:bg-canvora-800",
	secondary: "",
	tertiary:
		"bg-white border-oc-gray-3 hover:border-oc-gray-6 hover:bg-oc-gray-1 hover:text-canvora-300",
};

export const Button = ({
	children,
	className = "",
	size,
	level,
	onClick,
}: IButton) => {
	return (
		<button
			className={`${sizeProps[size]} ${levelProps[level]} ${className} flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};
