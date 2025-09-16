import { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	className: string;
	color?: string;
	onClick: (e: React.PointerEvent<HTMLButtonElement>) => void;
}

export default function ButtonProps({
	children,
	onClick,
	className,
	color,
}: ButtonProps) {
	return (
		<button
			style={{
				backgroundColor: color
					? color === "transparent"
						? "transparent"
						: `#${color}`
					: "",
			}}
			className={`w-7 h-7 rounded-lg border-[0.5px] border-canvora-200/50 dark:border-canvora-600/30 flex items-center justify-center hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer outline-1 outline-offset-1 ${className} outline-transparent`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
