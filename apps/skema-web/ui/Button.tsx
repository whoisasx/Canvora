import { ReactNode } from "react";
import { motion } from "motion/react";

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
	small: "h-12 w-24 border-t-[0.5px] border-x-[1px] border-b-[2px] rounded-full text-sm",
	medium: "h-12 w-36 rounded-full text-sm outline-1 outline-offset-1",
	large: "h-12 w-72 rounded-full text-base border-t-[0.5px] border-x-[1px] border-b-[2px]",
};

const levelProps: Record<Level, string> = {
	primary:
		"bg-gradient-to-r from-canvora-500 to-canvora-600 hover:from-canvora-600 hover:to-canvora-700 text-white shadow-lg hover:shadow-xl dark:from-canvora-600 dark:to-canvora-700 dark:hover:from-canvora-700 dark:hover:to-canvora-800 border-canvora-600 dark:border-canvora-700 relative overflow-hidden",
	secondary:
		"bg-canvora-100 dark:bg-gray-700 text-canvora-900 dark:text-canvora-100 border-canvora-300 dark:border-gray-600 hover:bg-canvora-200 dark:hover:bg-gray-600 relative overflow-hidden",
	tertiary:
		"bg-white dark:bg-gray-800 border-canvora-300 dark:border-gray-600 hover:border-canvora-600 dark:hover:border-gray-500 hover:bg-canvora-50 dark:hover:bg-gray-700 text-canvora-900 dark:text-canvora-100 shadow-md hover:shadow-lg relative overflow-hidden",
};

export const Button = ({
	children,
	className = "",
	size,
	level,
	onClick,
}: IButton) => {
	return (
		<motion.button
			className={`${sizeProps[size]} ${levelProps[level]} ${className} flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out font-medium group`}
			onClick={onClick}
			whileHover={{
				scale: 1.05,
				y: -2,
			}}
			whileTap={{
				scale: 0.95,
				y: 0,
			}}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.3,
				type: "spring",
				stiffness: 400,
				damping: 10,
			}}
		>
			{/* Animated background overlay */}
			<motion.div
				className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 opacity-0 group-hover:opacity-100"
				initial={{ x: "-100%" }}
				whileHover={{
					x: "100%",
					transition: {
						duration: 0.6,
						ease: "easeInOut",
					},
				}}
			/>

			{/* Sparkle effects for primary buttons */}
			{level === "primary" && (
				<>
					<motion.div
						className="absolute top-1 right-2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
						animate={{
							scale: [0, 1, 0],
							opacity: [0, 1, 0],
						}}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							delay: 0.2,
						}}
					/>
					<motion.div
						className="absolute bottom-2 left-3 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
						animate={{
							scale: [0, 1, 0],
							opacity: [0, 1, 0],
						}}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							delay: 0.8,
						}}
					/>
					<motion.div
						className="absolute top-3 left-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-0 group-hover:opacity-100"
						animate={{
							scale: [0, 1, 0],
							opacity: [0, 1, 0],
						}}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							delay: 1.2,
						}}
					/>
				</>
			)}

			{/* Content with subtle animation */}
			<motion.span
				className="relative z-10"
				whileHover={{
					scale: 1.02,
				}}
				transition={{ duration: 0.2 }}
			>
				{children}
			</motion.span>

			{/* Ripple effect */}
			<motion.div
				className="absolute inset-0 rounded-full bg-white/30 scale-0 opacity-0"
				whileTap={{
					scale: [0, 1.2],
					opacity: [0.3, 0],
					transition: { duration: 0.4 },
				}}
			/>
		</motion.button>
	);
};
