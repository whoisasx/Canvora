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
			className={`w-7 h-7 rounded-md border-[0.5px] border-gray-300 dark:border-gray-600 flex items-center justify-center hover:scale-110 transition-all delay-100 ease-in-out cursor-pointer ${className}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
