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
			className={`w-6 h-6 rounded-md border-[0.5px] border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition-all delay-100 ease-in-out cursor-pointer ${className}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
