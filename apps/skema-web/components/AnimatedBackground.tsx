import { motion } from "motion/react";

interface AnimatedBackgroundProps {
	variant?: "signin" | "signup" | "default";
}

export default function AnimatedBackground({
	variant = "default",
}: AnimatedBackgroundProps) {
	const getGradientConfig = () => {
		switch (variant) {
			case "signin":
				return {
					primaryGradient: "from-canvora-400/20 to-purple-400/20",
					secondaryGradient: "from-blue-400/20 to-canvora-400/20",
					tertiaryGradient: "from-pink-400/10 to-yellow-400/10",
					baseColor:
						"from-canvora-50 via-white to-canvora-100 dark:from-gray-900 dark:via-gray-800 dark:to-canvora-900",
				};
			case "signup":
				return {
					primaryGradient: "from-purple-400/20 to-pink-400/20",
					secondaryGradient: "from-blue-400/20 to-purple-400/20",
					tertiaryGradient: "from-green-400/10 to-blue-400/10",
					baseColor:
						"from-purple-50 via-white to-pink-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800",
				};
			default:
				return {
					primaryGradient: "from-canvora-400/20 to-blue-400/20",
					secondaryGradient: "from-purple-400/20 to-pink-400/20",
					tertiaryGradient: "from-green-400/10 to-yellow-400/10",
					baseColor:
						"from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
				};
		}
	};

	const { primaryGradient, secondaryGradient, tertiaryGradient } =
		getGradientConfig();

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{/* Large floating orb 1 */}
			<motion.div
				className={`absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r ${primaryGradient} rounded-full blur-3xl`}
				animate={{
					scale: [1, 1.2, 1],
					rotate: [0, 180, 360],
					x: [0, 50, 0],
					y: [0, -30, 0],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: "linear",
				}}
			/>

			{/* Large floating orb 2 */}
			<motion.div
				className={`absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r ${secondaryGradient} rounded-full blur-3xl`}
				animate={{
					scale: [1.2, 1, 1.2],
					rotate: [360, 180, 0],
					x: [0, -50, 0],
					y: [0, 30, 0],
				}}
				transition={{
					duration: 25,
					repeat: Infinity,
					ease: "linear",
				}}
			/>

			{/* Medium floating orb */}
			<motion.div
				className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r ${tertiaryGradient} rounded-full blur-3xl`}
				animate={{
					scale: [1, 1.3, 1],
					opacity: [0.3, 0.6, 0.3],
					rotate: [0, -180, -360],
				}}
				transition={{
					duration: 15,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Additional smaller orbs for more visual interest */}
			<motion.div
				className={`absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r ${primaryGradient} rounded-full blur-2xl`}
				animate={{
					scale: [1, 1.4, 1],
					x: [0, 40, 0],
					y: [0, -20, 0],
				}}
				transition={{
					duration: 12,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			<motion.div
				className={`absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-r ${secondaryGradient} rounded-full blur-xl`}
				animate={{
					scale: [1.2, 1, 1.2],
					x: [0, -30, 0],
					y: [0, 15, 0],
				}}
				transition={{
					duration: 14,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
		</div>
	);
}
