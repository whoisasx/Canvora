"use client";

// import { ReactNode } from "react";

// interface ButtonProps {
// 	children: ReactNode;
// 	className?: string;
// 	appName: string;
// }

// export const Button = ({ children, className, appName }: ButtonProps) => {
// 	return (
// 		<button
// 			className={className}
// 			onClick={() => alert(`Hello from your ${appName} app!`)}
// 		>
// 			{children}
// 		</button>
// 	);
// };

interface ButtonProps {
	name: string;
}
export const Button = ({ name }: ButtonProps) => {
	return <button className="w-20 h-full rounded-2xl border-1">{name}</button>;
};
