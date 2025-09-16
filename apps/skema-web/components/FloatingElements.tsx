import { motion } from "motion/react";
import { useMemo } from "react";

interface FloatingElementsProps {
	count?: number;
	className?: string;
}

export default function FloatingElements({
	count = 8,
	className = "",
}: FloatingElementsProps) {
	const elements = useMemo(() => {
		// Use a seeded random function to ensure consistent values
		const seededRandom = (seed: number) => {
			const x = Math.sin(seed) * 10000;
			return x - Math.floor(x);
		};

		return Array.from({ length: count }, (_, i) => ({
			id: i,
			size: seededRandom(i * 1.1) * 6 + 2, // 2-8px
			x: seededRandom(i * 2.3) * 100,
			y: seededRandom(i * 3.7) * 100,
			delay: seededRandom(i * 4.1) * 2,
			duration: 3 + seededRandom(i * 5.3) * 4, // 3-7 seconds
			opacity: 0.1 + seededRandom(i * 6.7) * 0.3, // 0.1-0.4
		}));
	}, [count]);

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
