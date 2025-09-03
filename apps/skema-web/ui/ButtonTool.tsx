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
			className={` w-9 h-9 rounded-lg hover:scale-105 hover:bg-oc-gray-3 dark:hover:bg-oc-gray-8 transition-all delay-100 ease-in-out cursor-pointer flex items-center justify-center ${className}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default ButtonTool;
