import Image from "next/image";
import FeatureCard from "./FeatureCard";
import { excali } from "@/app/font";
import { motion } from "motion/react";

export default function SectionList({
	iconUrl,
	iconAlt,
	tagName,
	heading,
	description,
	videoSrc,
	featureList,
}: {
	iconUrl?: string;
	iconAlt?: string;
	tagName?: string;
	heading?: string;
	description?: string;
	videoSrc?: string;
	featureList?: { heading: string; para: string }[];
}) {
	return (
		<motion.li
			className="relative px-6 md:px-8 pb-10 md:pb-30"
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			viewport={{ once: true }}
		>
			{/* Vertical line on the left */}
			<div className="absolute top-15 bottom-0 -left-8 w-0.5 bg-gradient-to-b from-canvora-300 to-transparent dark:from-canvora-600 dark:to-transparent bg-no-repeat bg-cover"></div>

			{/* Icon */}
			<motion.img
				src={iconUrl}
				alt={iconAlt}
				className="py-2 absolute top-0 -left-15 h-15 w-15 px-1.5 filter dark:invert transition-all duration-500"
				width={50}
				height={49}
				initial={{ scale: 0, rotate: -180 }}
				whileInView={{ scale: 1, rotate: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				viewport={{ once: true }}
			/>

			{/* Tags */}
			<motion.ul
				className="flex flex-row flex-wrap gap-3 pt-5 pb-2 text-xs mb-4"
				initial={{ opacity: 0, x: -20 }}
				whileInView={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				viewport={{ once: true }}
			>
				<motion.li
					className={`px-2 py-1 bg-[url(/bg-green-strong.svg)] font-excali ${excali.variable} hover:scale-105 transition-transform duration-300 cursor-default text-canvora-900`}
					whileHover={{ rotate: [0, -2, 2, 0] }}
					transition={{ duration: 0.5 }}
				>
					{tagName}
				</motion.li>
			</motion.ul>

			{/* Headings & Description */}
			<motion.div
				className="max-w-none text-canvora-900 dark:text-canvora-100 flex flex-col gap-4 transition-colors duration-500"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
				viewport={{ once: true }}
			>
				<motion.h2
					className="text-4xl font-bold"
					initial={{ opacity: 0, x: -30 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.5 }}
					viewport={{ once: true }}
				>
					{heading}
				</motion.h2>
				<motion.h4
					className="md:text-xl sm:text-lg text-base text-canvora-700 dark:text-canvora-300 transition-colors duration-500"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.6 }}
					viewport={{ once: true }}
				>
					{description}
				</motion.h4>
			</motion.div>

			{/* Video Section (Browser-like frame) */}
			<motion.div
				className="relative"
				initial={{ opacity: 0, scale: 0.95 }}
				whileInView={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.8, delay: 0.3 }}
				viewport={{ once: true }}
			>
				<motion.div
					className="bg-canvora-50/50 dark:bg-gray-800/50 my-16 overflow-hidden rounded-xl border border-canvora-200/50 dark:border-gray-700/50 shadow-2xl transition-all duration-500"
					whileHover={{ scale: 1.02, y: -5 }}
					transition={{ duration: 0.3 }}
				>
					{/* Browser bar */}
					<div className="h-6 border-b-[0.5px] border-canvora-600 dark:border-gray-600 relative rounded-t-xl bg-canvora-100 dark:bg-gray-700 transition-colors duration-500">
						{/* Left dots */}
						<div className="absolute top-0 left-5 flex h-full items-center gap-1">
							<motion.div
								className="bg-red-500 h-1.5 w-1.5 rounded-full"
								whileHover={{ scale: 1.2 }}
								transition={{ duration: 0.2 }}
							></motion.div>
							<motion.div
								className="bg-yellow-500 h-1.5 w-1.5 rounded-full"
								whileHover={{ scale: 1.2 }}
								transition={{ duration: 0.2 }}
							></motion.div>
							<motion.div
								className="bg-green-500 h-1.5 w-1.5 rounded-full"
								whileHover={{ scale: 1.2 }}
								transition={{ duration: 0.2 }}
							></motion.div>
						</div>
						{/* Center bar */}
						<div className="bg-white dark:bg-gray-600 absolute top-1.5 left-1/2 flex h-3 w-1/2 -translate-x-1/2 items-center justify-center rounded-sm transition-colors duration-500">
							<Image
								src="/canvora-url.svg"
								alt="browser bar"
								width={50}
								height={8}
								className="text-transparent filter dark:brightness-0 dark:invert"
							/>
						</div>
					</div>

					{/* Video */}
					<motion.video
						autoPlay
						muted
						playsInline
						loop
						src={videoSrc}
						className="w-full shadow-2xl shadow-canvora-600 dark:shadow-gray-900 transition-all duration-500"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 1, delay: 0.5 }}
						viewport={{ once: true }}
					></motion.video>
				</motion.div>

				{/* Radial background */}
				<div className="absolute top-0 left-0 -z-10 aspect-square w-full h-full shadow-2xl shadow-canvora-50 dark:shadow-gray-900/50 transition-all duration-500"></div>
			</motion.div>

			{/* Feature cards */}
			<motion.ul
				className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.4 }}
				viewport={{ once: true }}
			>
				{featureList &&
					featureList.map((feature, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
							viewport={{ once: true }}
						>
							<FeatureCard
								heading={feature.heading}
								para={feature.para}
							/>
						</motion.div>
					))}
			</motion.ul>
		</motion.li>
	);
}
