import { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	color?: string;
	onClick: (e: React.PointerEvent<HTMLButtonElement>) => void;
}
const ButtonTool = ({ children, onClick, color }: ButtonProps) => {
	return (
		<button
			style={{
				backgroundColor: color
					? color === "transparent"
						? "transparent"
						: `#${color}`
					: "",
			}}
			className="max-w-auto w-10 h-full rounded-lg bg-oc-gray-2 hover:scale-105 hover:bg-oc-violet-1 transition-all delay-100 ease-in-out cursor-pointer"
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default ButtonTool;
