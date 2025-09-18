"use client";
import { motion, AnimatePresence } from "motion/react";
import { CanvoraIcon } from "@/ui/Canvora";
import { excali } from "@/app/font";

interface CanvasIntroOverlayProps {
	showIntro: boolean;
	hideInstantly: boolean;
}

// Static drawing doodles component
const DrawingDoodles = () => (
	<>
		{/* Row 1 - Top edge */}
		{/* Pencil doodle - top left */}
		<div className="absolute top-12 left-8 opacity-35 dark:opacity-25 rotate-12">
			<svg
				width="32"
				height="32"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="text-gray-600"
			>
				<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
			</svg>
		</div>

		{/* Curved line doodle - top left-center */}
		<div className="absolute top-8 left-1/4 opacity-25 dark:opacity-20">
			<svg
				width="32"
				height="16"
				viewBox="0 0 32 16"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-gray-500"
			>
				<path d="M2 14 Q16 2 30 14" />
			</svg>
		</div>

		{/* Circle doodle - top center */}
		<div className="absolute top-16 left-1/2 opacity-30 dark:opacity-20 -rotate-15">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-gray-500"
			>
				<circle cx="12" cy="12" r="10" />
			</svg>
		</div>

		{/* Brush doodle - top right-center */}
		<div className="absolute top-10 right-1/4 opacity-35 dark:opacity-25 -rotate-45">
			<svg
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="text-gray-600"
			>
				<path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z" />
			</svg>
		</div>

		{/* Palette doodle - top right */}
		<div className="absolute top-20 right-12 opacity-30 dark:opacity-20 rotate-30">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="text-gray-600"
			>
				<path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L19 8V7C19 5.9 18.1 5 17 5S15 5.9 15 7V8L13 7V9C13 10.1 13.9 11 15 11S17 10.1 17 11V12L19 11V12C19 13.1 19.9 14 21 14V9Z" />
			</svg>
		</div>

		{/* Row 2 - Upper middle */}
		{/* Eraser doodle - left upper */}
		<div className="absolute top-32 left-4 opacity-25 dark:opacity-20 rotate-45">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="text-gray-500"
			>
				<path d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0M4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53-6.36-6.36-3.54 3.54c-.78.78-.78 2.05 0 2.82z" />
			</svg>
		</div>

		{/* Shape doodle - left center */}
		<div className="absolute left-16 top-40 opacity-25 dark:opacity-20 rotate-12">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-gray-500"
			>
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
			</svg>
		</div>

		{/* Squiggle line - upper center */}
		<div className="absolute top-28 left-2/5 opacity-30 dark:opacity-20 rotate-6">
			<svg
				width="40"
				height="16"
				viewBox="0 0 40 16"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-gray-500"
			>
				<path d="M2 8 Q10 2 18 8 T34 8" />
			</svg>
		</div>

		{/* Hexagon - upper right center */}
		<div className="absolute top-36 right-1/3 opacity-25 dark:opacity-20 -rotate-30">
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-gray-500"
			>
				<polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
			</svg>
		</div>

		{/* Ruler doodle - right upper */}
		<div className="absolute top-24 right-8 opacity-30 dark:opacity-20 rotate-75">
			<svg
				width="6"
				height="40"
				viewBox="0 0 6 40"
				fill="currentColor"
				className="text-gray-500"
			>
				<rect x="0" y="0" width="6" height="40" />
				<rect x="1" y="5" width="4" height="1" fill="white" />
				<rect x="1" y="15" width="4" height="1" fill="white" />
				<rect x="1" y="25" width="4" height="1" fill="white" />
				<rect x="1" y="35" width="4" height="1" fill="white" />
			</svg>
		</div>

		{/* Row 3 - Middle */}
		{/* Triangle doodle - left middle */}
		<div className="absolute left-6 top-1/2 opacity-25 dark:opacity-20 rotate-30">
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-gray-500"
			>
				<path d="M12 2 L22 20 L2 20 Z" />
			</svg>
		</div>

		{/* Spiral doodle - left-center middle */}
		<div className="absolute left-1/4 top-1/2 opacity-30 dark:opacity-20 -rotate-12">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-gray-500"
			>
				<path d="M12 2 Q20 10 12 12 Q4 14 12 16 Q20 18 12 22" />
			</svg>
		</div>

		{/* Dashed line - center */}
		<div className="absolute left-1/2 top-1/2 opacity-25 dark:opacity-20 rotate-45">
			<svg
				width="32"
				height="4"
				viewBox="0 0 32 4"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeDasharray="4 2"
				className="text-gray-500"
			>
				<line x1="0" y1="2" x2="32" y2="2" />
			</svg>
		</div>

		{/* Compass doodle - right-center middle */}
		<div className="absolute right-1/4 top-1/2 opacity-30 dark:opacity-20 rotate-60">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-gray-500"
			>
				<circle cx="12" cy="12" r="10" />
				<polygon
					points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"
					fill="currentColor"
				/>
			</svg>
		</div>

		{/* Cross doodle - right middle */}
		<div className="absolute right-12 top-1/2 opacity-25 dark:opacity-20 rotate-45">
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="3"
				className="text-gray-500"
			>
				<line x1="12" y1="2" x2="12" y2="22"></line>
				<line x1="2" y1="12" x2="22" y2="12"></line>
			</svg>
		</div>

		{/* Row 4 - Lower middle */}
		{/* Arrow doodle - bottom left */}
		<div className="absolute bottom-40 left-16 opacity-35 dark:opacity-25 rotate-12">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-gray-600"
			>
				<line x1="7" y1="17" x2="17" y2="7"></line>
				<polyline points="7,7 17,7 17,17"></polyline>
			</svg>
		</div>

		{/* Zigzag doodle - bottom left-center */}
		<div className="absolute bottom-32 left-1/3 opacity-25 dark:opacity-20">
			<svg
				width="28"
				height="12"
				viewBox="0 0 28 12"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-gray-500"
			>
				<path d="M2 10 L8 2 L14 10 L20 2 L26 10" />
			</svg>
		</div>

		{/* Diamond doodle - bottom center */}
		<div className="absolute bottom-36 left-1/2 opacity-30 dark:opacity-20 rotate-45">
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-gray-500"
			>
				<polygon points="12,2 22,12 12,22 2,12" />
			</svg>
		</div>

		{/* Star doodle - bottom right-center */}
		<div className="absolute bottom-28 right-1/3 opacity-25 dark:opacity-20 -rotate-12">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="text-gray-500"
			>
				<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
			</svg>
		</div>

		{/* Row 5 - Bottom edge */}
		{/* Curved arrow - bottom left corner */}
		<div className="absolute bottom-16 left-8 opacity-30 dark:opacity-20 rotate-30">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-gray-600"
			>
				<path d="M3 12 Q12 3 21 12" />
				<polyline points="18,9 21,12 18,15" />
			</svg>
		</div>

		{/* Wavy line - bottom center */}
		<div className="absolute bottom-12 left-2/5 opacity-25 dark:opacity-20">
			<svg
				width="36"
				height="12"
				viewBox="0 0 36 12"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-gray-500"
			>
				<path d="M2 6 Q9 2 16 6 T30 6" />
			</svg>
		</div>

		{/* Pencil tip - bottom right center */}
		<div className="absolute bottom-20 right-1/4 opacity-35 dark:opacity-25 -rotate-45">
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="text-gray-600"
			>
				<path d="M12 2 L22 12 L12 14 L10 12 Z" />
			</svg>
		</div>

		{/* Paint drop - bottom right */}
		<div className="absolute bottom-8 right-16 opacity-30 dark:opacity-20 rotate-15">
			<svg
				width="18"
				height="24"
				viewBox="0 0 18 24"
				fill="currentColor"
				className="text-gray-600"
			>
				<path d="M9 2 Q15 8 15 14 Q15 20 9 20 Q3 20 3 14 Q3 8 9 2 Z" />
			</svg>
		</div>

		{/* Corner elements */}
		{/* Dots pattern - far left */}
		<div className="absolute left-2 top-1/4 opacity-20 dark:opacity-15">
			<svg
				width="8"
				height="32"
				viewBox="0 0 8 32"
				fill="currentColor"
				className="text-gray-500"
			>
				<circle cx="4" cy="4" r="2" />
				<circle cx="4" cy="12" r="2" />
				<circle cx="4" cy="20" r="2" />
				<circle cx="4" cy="28" r="2" />
			</svg>
		</div>

		{/* Grid pattern - far right */}
		<div className="absolute right-4 top-1/3 opacity-20 dark:opacity-15">
			<svg
				width="12"
				height="12"
				viewBox="0 0 12 12"
				fill="none"
				stroke="currentColor"
				strokeWidth="1"
				className="text-gray-500"
			>
				<line x1="0" y1="4" x2="12" y2="4" />
				<line x1="0" y1="8" x2="12" y2="8" />
				<line x1="4" y1="0" x2="4" y2="12" />
				<line x1="8" y1="0" x2="8" y2="12" />
			</svg>
		</div>

		{/* Small circles - scattered */}
		<div className="absolute top-1/4 right-20 opacity-20 dark:opacity-15">
			<svg
				width="6"
				height="6"
				viewBox="0 0 6 6"
				fill="currentColor"
				className="text-gray-400"
			>
				<circle cx="3" cy="3" r="3" />
			</svg>
		</div>

		<div className="absolute bottom-1/4 left-32 opacity-20 dark:opacity-15">
			<svg
				width="4"
				height="4"
				viewBox="0 0 4 4"
				fill="currentColor"
				className="text-gray-400"
			>
				<circle cx="2" cy="2" r="2" />
			</svg>
		</div>
	</>
);

export default function CanvasIntroOverlay({
	showIntro,
	hideInstantly,
}: CanvasIntroOverlayProps) {
	return (
		<AnimatePresence initial={false}>
			{showIntro && (
				<motion.div
					className="h-screen w-screen fixed inset-0 flex flex-col gap-6 items-center justify-center pointer-events-none backdrop-blur-[1px] bg-black/5 dark:bg-black/20"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{
						duration: hideInstantly ? 0 : 0.2,
						ease: "easeOut",
					}}
				>
					{/* Static drawing doodles */}
					<DrawingDoodles />
					{/* Brand section - prominent */}
					<motion.div
						className="text-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.1 }}
					>
						<div className="flex items-center justify-center gap-3 mb-2">
							<motion.div
								initial={{ rotate: -5, scale: 0.9 }}
								animate={{ rotate: 0, scale: 1 }}
								transition={{ duration: 0.3, delay: 0.15 }}
							>
								<CanvoraIcon className="w-16 h-16" />
							</motion.div>
							<motion.h1
								className={`text-7xl font-extrabold font-excali ${excali.variable} dark:text-canvora-300 text-canvora-600`}
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: 0.2 }}
							>
								Canvora
							</motion.h1>
						</div>
						<motion.div
							className={`font-excali ${excali.variable} text-lg text-gray-600 dark:text-gray-400`}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.2, delay: 0.3 }}
						>
							All your data is saved automatically.
						</motion.div>
					</motion.div>

					{/* Menu section - faded */}
					<motion.div
						className="flex flex-col gap-3 w-80 text-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-xl p-4 border border-canvora-200/30 dark:border-canvora-600/30 opacity-80"
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 0.8, y: 0 }}
						transition={{ duration: 0.2, delay: 0.35 }}
					>
						<button
							type="button"
							className="flex justify-between items-center p-2 rounded-lg opacity-40 cursor-not-allowed transition-all duration-200"
							disabled
						>
							<div className="size-8">
								<svg
									className="size-8"
									viewBox="0 0 20 20"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.25"
								>
									<path d="m9.257 6.351.183.183H15.819c.34 0 .727.182 1.051.506.323.323.505.708.505 1.05v5.819c0 .316-.183.7-.52 1.035-.337.338-.723.522-1.037.522H4.182c-.352 0-.74-.181-1.058-.5-.318-.318-.499-.705-.499-1.057V5.182c0-.351.181-.736.5-1.054.32-.321.71-.503 1.057-.503H6.53l2.726 2.726Z" />
								</svg>
							</div>
							<div className="text-gray-400 dark:text-gray-500">
								Cmd+O
							</div>
						</button>

						<button
							type="button"
							className="flex justify-between items-center p-2 rounded-lg opacity-40 cursor-not-allowed transition-all duration-200"
							disabled
						>
							<div className="size-8">
								<svg
									className="size-8"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.25"
								>
									<g>
										<path
											stroke="none"
											d="M0 0h24v24H0z"
											fill="none"
										/>
										<circle cx="9" cy="7" r="4" />
										<path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
										<path d="M16 3.13a4 4 0 0 1 0 7.75" />
										<path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
									</g>
								</svg>
							</div>
							<div className="text-gray-400 dark:text-gray-500">
								Live collaboration...
							</div>
						</button>

						<button
							type="button"
							className="flex items-center justify-between p-2 rounded-lg opacity-40 cursor-not-allowed transition-all duration-200"
							disabled
						>
							<div className="size-8">
								<svg
									className="size-8"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.25"
								>
									<g>
										<path
											stroke="none"
											d="M0 0h24v24H0z"
											fill="none"
										/>
										<path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
										<path d="M21 12h-13l3 -3" />
										<path d="M11 15l-3 -3" />
									</g>
								</svg>
							</div>
							<div className="text-gray-400 dark:text-gray-500">
								Sign up
							</div>
						</button>

						<button
							type="button"
							className="flex justify-between items-center p-2 rounded-lg opacity-40 cursor-not-allowed transition-all duration-200"
							disabled
						>
							<div className="size-8">
								<svg
									className="size-8"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.25"
								>
									<g>
										<path
											stroke="none"
											d="M0 0h24v24H0z"
											fill="none"
										/>
										<path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
										<path d="M12 12l8 -4.5" />
										<path d="M12 12l0 9" />
										<path d="M12 12l-8 -4.5" />
									</g>
								</svg>
							</div>
							<div className="text-gray-400 dark:text-gray-500">
								Library...
							</div>
						</button>

						<button
							type="button"
							className="flex justify-between items-center p-2 rounded-lg opacity-40 cursor-not-allowed transition-all duration-200"
							disabled
						>
							<div className="size-8">
								<svg
									className="size-8"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.25"
								>
									<g>
										<path
											stroke="none"
											d="M0 0h24v24H0z"
											fill="none"
										/>
										<circle cx="12" cy="12" r="4" />
										<path d="M12 1v6m0 6v6" />
										<path d="M21 12h-6m-6 0h-6" />
									</g>
								</svg>
							</div>
							<div className="text-gray-400 dark:text-gray-500">
								Help...
							</div>
						</button>
					</motion.div>

					{/* Hint arrows - faded */}
					<motion.div
						className={`absolute top-16 left-10 text-xl text-gray-500/60 dark:text-gray-400/60 flex items-center gap-3 font-excali ${excali.variable} flex items-baseline-last`}
						initial={{ opacity: 0, x: -15 }}
						animate={{ opacity: 0.6, x: 0 }}
						transition={{ duration: 0.2, delay: 0.4 }}
					>
						<svg
							className="w-20 h-20 text-gray-400/50"
							viewBox="0 0 100 100"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
						>
							<path d="M90 90 Q40 70 20 20" />
							<polygon
								points="10,28 20,18 30,28"
								fill="currentColor"
							/>
						</svg>
						<span className="mt-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md px-3 py-1 rounded-lg opacity-70">
							Export, preferences, languages…
						</span>
					</motion.div>
					<motion.div
						className={`absolute top-16 left-1/2 text-xl text-gray-500/60 dark:text-gray-400/60 flex flex-col items-start font-excali ${excali.variable} flex items-baseline-last w-auto`}
						initial={{ opacity: 0, x: 15 }}
						animate={{ opacity: 0.6, x: 0 }}
						transition={{ duration: 0.2, delay: 0.45 }}
					>
						<svg
							className="w-20 h-20 text-gray-400/50"
							viewBox="0 0 100 100"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
						>
							<path d="M90 90 Q40 70 20 20" />
							<polygon
								points="10,28 20,18 30,28"
								fill="currentColor"
							/>
						</svg>
						<div className="ml-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md px-3 py-2 rounded-lg opacity-70">
							<p>Pick a tool &</p>
							<p> start drawing!</p>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
