import { motion } from "motion/react";

export default function FeatureCard({
	heading,
	para,
}: {
	heading: string;
	para: string;
}) {
	return (
		<motion.li
			className="flex flex-1"
			whileHover={{ scale: 1.02, y: -2 }}
			transition={{ duration: 0.3 }}
		>
			<motion.div
				className="flex-1 rounded-2xl border border-canvora-200 dark:border-gray-600 bg-canvora-50/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300"
				initial={{ opacity: 0, scale: 0.95 }}
				whileInView={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				viewport={{ once: true }}
			>
				<div className="flex flex-col gap-3 max-w-none text-sm">
					<motion.h5
						className="text-canvora-900 dark:text-canvora-100 font-semibold transition-colors duration-500"
						initial={{ opacity: 0, y: -10 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.1 }}
						viewport={{ once: true }}
					>
						{heading}
					</motion.h5>
					<motion.p
						className="text-canvora-700 dark:text-canvora-300 transition-colors duration-500"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.4, delay: 0.2 }}
						viewport={{ once: true }}
					>
						{para}
					</motion.p>
				</div>
			</motion.div>
		</motion.li>
	);
}
