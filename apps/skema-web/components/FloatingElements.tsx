import { motion } from "motion/react";

interface FloatingElementsProps {
	count?: number;
	className?: string;
}

export default function FloatingElements({
	count = 8,
	className = "",
}: FloatingElementsProps) {
	const elements = Array.from({ length: count }, (_, i) => ({
		id: i,
		size: Math.random() * 6 + 2, // 2-8px
		x: Math.random() * 100,
		y: Math.random() * 100,
		delay: Math.random() * 2,
		duration: 3 + Math.random() * 4, // 3-7 seconds
		opacity: 0.1 + Math.random() * 0.3, // 0.1-0.4
	}));

	return (
		<div
			className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
		>
			{elements.map((element) => (
				<motion.div
					key={element.id}
					className="absolute rounded-full bg-gradient-to-r from-canvora-400 via-purple-400 to-pink-400"
					style={{
						width: element.size,
						height: element.size,
						left: `${element.x}%`,
						top: `${element.y}%`,
						opacity: element.opacity,
					}}
					animate={{
						y: [0, -30, 0],
						x: [0, Math.random() * 20 - 10, 0],
						scale: [1, 1.2, 1],
						opacity: [
							element.opacity,
							element.opacity * 2,
							element.opacity,
						],
					}}
					transition={{
						duration: element.duration,
						repeat: Infinity,
						delay: element.delay,
						ease: "easeInOut",
					}}
				/>
			))}
		</div>
	);
}
