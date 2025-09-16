import { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	color?: string;
	className?: string;
	onClick: (e: React.PointerEvent<HTMLButtonElement>) => void;
}
const ButtonTool = ({ children, onClick, color, className }: ButtonProps) => {
	return (
		<button
			style={{
				backgroundColor: color
					? color === "transparent"
						? "transparent"
						: `#${color}`
					: "",
			}}
			className={`w-9 h-9 rounded-xl hover:scale-105 hover:bg-canvora-100/50 dark:hover:bg-canvora-800/50 transition-all duration-200 ease-in-out cursor-pointer flex items-center justify-center ${className}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default ButtonTool;
