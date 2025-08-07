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
			className={`max-w-auto w-10 h-full rounded-lg hover:scale-105 hover:bg-oc-gray-3 dark:hover:bg-oc-gray-8 transition-all delay-100 ease-in-out cursor-pointer ${className}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default ButtonTool;
