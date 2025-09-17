import Image from "next/image";
import HeroSection from "./HeroSection";
import Link from "next/link";
import { Button } from "@/ui/Button";
import { comic, excali } from "@/app/font";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import SectionList from "./SectionList";

export default function MainSection() {
	const router = useRouter();

	return (
		<div className="w-full mx-auto h-full px-10 pt-10 md:pt-20">
			<HeroSection />

			<motion.section
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
			>
				<div className="w-full flex flex-col gap-15 md:gap-40 p-10">
					<motion.div
						className="w-full h-fit mx-auto flex items-center justify-center p-5"
						initial={{ scale: 0.9, opacity: 0 }}
						whileInView={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
					>
						<div className="w-full max-w-4xl mx-auto">
							<motion.div
								className="flex items-center justify-center mb-8"
								initial={{ y: -20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.3 }}
								viewport={{ once: true }}
							>
								<div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-canvora-400 to-canvora-600 dark:from-canvora-600 dark:to-canvora-800 flex items-center justify-center shadow-lg">
									<svg
										className="w-6 h-6 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								</div>
							</motion.div>
							<motion.h2
								className={`${comic.variable} font-comic text-3xl md:text-5xl font-bold text-center mb-6 text-canvora-900 dark:text-canvora-100 transition-colors duration-500`}
								initial={{ y: 20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.4 }}
								viewport={{ once: true }}
							>
								Seamless Collaboration
							</motion.h2>
							<motion.p
								className="text-lg md:text-xl text-center text-canvora-700 dark:text-canvora-300 leading-relaxed transition-colors duration-500"
								initial={{ y: 20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.5 }}
								viewport={{ once: true }}
							>
								Experience the power of real-time collaborative
								whiteboarding. Draw, create, and innovate
								together with your team in a beautiful,
								intuitive interface that feels natural and
								responsive.
							</motion.p>
						</div>
					</motion.div>
					{/* Animated marquee section */}
					<motion.div
						className="w-full overflow-hidden py-8 relative"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						{/* Faded background */}
						<div className="absolute inset-0 bg-gradient-to-r from-canvora-50/30 via-canvora-100/50 to-canvora-50/30 dark:from-gray-800/30 dark:via-gray-700/50 dark:to-gray-800/30 rounded-xl"></div>

						<motion.div
							className="flex items-center whitespace-nowrap relative z-10"
							animate={{ x: ["0%", "-100%"] }}
							transition={{
								x: {
									repeat: Infinity,
									repeatType: "loop",
									duration: 25,
									ease: "linear",
								},
							}}
						>
							{/* First set of items */}
							{[
								"Real-time Collaboration",
								"Infinite Canvas",
								"Beautiful UI",
								"Fast & Responsive",
								"Cross-platform",
								"Open Source",
							].map((text, index) => (
								<span
									key={`first-${index}`}
									className={`${excali.variable} font-excali text-2xl md:text-4xl font-bold text-canvora-600 dark:text-canvora-400 mx-8 transition-colors duration-500`}
								>
									{text}
								</span>
							))}

							{/* Duplicate set for seamless loop */}
							{[
								"Real-time Collaboration",
								"Infinite Canvas",
								"Beautiful UI",
								"Fast & Responsive",
								"Cross-platform",
								"Open Source",
							].map((text, index) => (
								<span
									key={`second-${index}`}
									className={`${excali.variable} font-excali text-2xl md:text-4xl font-bold text-canvora-600 dark:text-canvora-400 mx-8 transition-colors duration-500`}
								>
									{text}
								</span>
							))}
						</motion.div>
					</motion.div>{" "}
					{/* CTA Section */}
					<motion.div
						className="w-full max-w-2xl mx-auto text-center py-12"
						initial={{ scale: 0.95, opacity: 0 }}
						whileInView={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<motion.h3
							className={`${comic.variable} font-comic text-2xl md:text-3xl font-bold mb-6 text-canvora-900 dark:text-canvora-100 transition-colors duration-500`}
							initial={{ y: 20, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
						>
							Ready to get started?
						</motion.h3>
						<motion.p
							className="text-lg text-canvora-700 dark:text-canvora-300 mb-8 transition-colors duration-500"
							initial={{ y: 20, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							viewport={{ once: true }}
						>
							Join thousands of teams already collaborating with
							Canvora
						</motion.p>
						<motion.div
							className="flex flex-col sm:flex-row gap-4 items-center justify-center"
							initial={{ y: 20, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							viewport={{ once: true }}
						>
							<Button
								size="large"
								level="primary"
								onClick={() =>
									window.open("/freehand", "_blank")
								}
								className="group"
							>
								<span className="flex items-center gap-2">
									Start Drawing
									<motion.svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										whileHover={{ x: 2 }}
										transition={{ duration: 0.2 }}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</motion.svg>
								</span>
							</Button>
							<Link
								href="https://github.com/whoisasx/Canvora"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button
									size="large"
									level="secondary"
									onClick={() => {}}
									className="group"
								>
									<span className="flex items-center gap-2">
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
										</svg>
										View on GitHub
									</span>
								</Button>
							</Link>
						</motion.div>
					</motion.div>
				</div>
			</motion.section>

			{/* Hero Playground Image Section */}
			<motion.section
				className="w-full max-w-7xl mx-auto py-20"
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
			>
				<motion.div
					className="text-center mb-12"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<motion.h2
						className={`${comic.variable} font-comic text-3xl md:text-5xl font-bold mb-6 text-canvora-900 dark:text-canvora-100 transition-colors duration-500`}
						initial={{ scale: 0.9, opacity: 0 }}
						whileInView={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
					>
						See Canvora in Action
					</motion.h2>
					<motion.p
						className="text-lg md:text-xl text-canvora-700 dark:text-canvora-300 max-w-3xl mx-auto transition-colors duration-500"
						initial={{ y: 20, opacity: 0 }}
						whileInView={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						viewport={{ once: true }}
					>
						Experience the intuitive interface and powerful features
						that make collaboration seamless
					</motion.p>
				</motion.div>

				<motion.div
					className="relative group"
					initial={{ scale: 0.95, opacity: 0 }}
					whileInView={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					whileHover={{ scale: 1.02 }}
				>
					<div className="absolute -inset-4 bg-gradient-to-r from-canvora-400/20 via-canvora-500/20 to-canvora-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
					<div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-canvora-200 dark:border-canvora-700 transition-all duration-500">
						<Image
							src="/hero-playground.png"
							alt="Canvora Interface Preview"
							width={1200}
							height={800}
							className="w-full h-auto rounded-lg shadow-lg"
							priority
						/>

						{/* Floating interactive dots */}
						<motion.div
							className="absolute top-8 left-8 w-3 h-3 bg-green-400 rounded-full shadow-lg"
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.7, 1, 0.7],
							}}
							transition={{ duration: 2, repeat: Infinity }}
						/>
						<motion.div
							className="absolute top-12 right-12 w-3 h-3 bg-blue-400 rounded-full shadow-lg"
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.7, 1, 0.7],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								delay: 0.5,
							}}
						/>
						<motion.div
							className="absolute bottom-8 left-16 w-3 h-3 bg-purple-400 rounded-full shadow-lg"
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.7, 1, 0.7],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								delay: 1,
							}}
						/>
					</div>
				</motion.div>
			</motion.section>

			{/* Features Section */}
			<motion.section
				className="w-full max-w-7xl mx-auto py-20"
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
			>
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<motion.h2
						className={`${comic.variable} font-comic text-3xl md:text-5xl font-bold mb-6 text-canvora-900 dark:text-canvora-100 transition-colors duration-500`}
						initial={{ scale: 0.9, opacity: 0 }}
						whileInView={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
					>
						Powerful Features
					</motion.h2>
					<motion.p
						className="text-lg md:text-xl text-canvora-700 dark:text-canvora-300 max-w-3xl mx-auto transition-colors duration-500"
						initial={{ y: 20, opacity: 0 }}
						whileInView={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						viewport={{ once: true }}
					>
						Discover what makes Canvora the perfect choice for your
						collaborative whiteboarding needs
					</motion.p>
				</motion.div>

				<motion.ul
					className="space-y-20"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
				>
					<SectionList
						iconUrl="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/collaborate_arrows_icon.svg"
						iconAlt="Real-time Collaboration"
						tagName="Collaboration"
						heading="Draw Together in Real-Time"
						description="Experience seamless collaboration with instant synchronization. See your teammates' cursors, drawings, and changes as they happen in real-time."
						videoSrc="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/Usecases_edit_video-1.mp4"
						featureList={[
							{
								heading: "Live Cursors",
								para: "See exactly where your teammates are working with real-time cursor tracking and user presence indicators.",
							},
							{
								heading: "Instant Sync",
								para: "Every stroke, shape, and text change is synchronized instantly across all connected devices.",
							},
							{
								heading: "Team Awareness",
								para: "Know who's online, what they're working on, and collaborate without stepping on each other's toes.",
							},
						]}
					/>

					<SectionList
						iconUrl="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/bulb_icon.svg"
						iconAlt="Infinite Canvas"
						tagName="Canvas"
						heading="Infinite Creative Space"
						description="Break free from boundaries with our infinite canvas. Zoom, pan, and create without limits on a space that grows with your ideas."
						videoSrc="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/Collaborate_video.mp4"
						featureList={[
							{
								heading: "Unlimited Space",
								para: "Your canvas expands infinitely in all directions. Never run out of room for your creative ideas.",
							},
							{
								heading: "Smooth Navigation",
								para: "Intuitive zoom and pan controls make navigating large canvases effortless and responsive.",
							},
							{
								heading: "Smart Performance",
								para: "Optimized rendering ensures smooth performance even with thousands of elements on your canvas.",
							},
						]}
					/>

					<SectionList
						iconUrl="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/collaborate_arrows_icon.svg"
						iconAlt="Rich Drawing Tools"
						tagName="Tools"
						heading="Professional Drawing Tools"
						description="Access a comprehensive set of drawing tools designed for both quick sketches and detailed diagrams. From freehand drawing to precise shapes."
						videoSrc="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/The_best_UI_video.mp4"
						featureList={[
							{
								heading: "Vector Drawing",
								para: "Create crisp, scalable drawings with our advanced vector-based drawing engine.",
							},
							{
								heading: "Shape Library",
								para: "Quick access to rectangles, circles, arrows, and more with smart snapping and alignment.",
							},
							{
								heading: "Text & Annotations",
								para: "Add rich text, sticky notes, and annotations with full formatting options.",
							},
						]}
					/>
				</motion.ul>
			</motion.section>

			{/* Trusted by Companies Section */}
			<motion.section
				className="w-full max-w-7xl mx-auto py-20"
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
			>
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<motion.h2
						className={`${comic.variable} font-comic text-2xl md:text-4xl font-bold mb-4 text-canvora-900 dark:text-canvora-100 transition-colors duration-500`}
						initial={{ scale: 0.9, opacity: 0 }}
						whileInView={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
					>
						Trusted by Teams Worldwide
					</motion.h2>
					<motion.p
						className="text-lg text-canvora-600 dark:text-canvora-400 transition-colors duration-500"
						initial={{ y: 20, opacity: 0 }}
						whileInView={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						viewport={{ once: true }}
					>
						Join thousands of teams who choose Canvora for their
						creative collaboration
					</motion.p>
				</motion.div>

				{/* Company logos grid */}
				<motion.div
					className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center"
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
				>
					{[
						{
							src: "/Netflix-logo.svg",
							alt: "Netflix",
							name: "Netflix",
						},
						{
							src: "/Microsoft_logo.svg",
							alt: "Microsoft",
							name: "Microsoft",
						},
						{ src: "/Intel_logo.svg", alt: "Intel", name: "Intel" },
						{ src: "/Meta-logo.svg", alt: "Meta", name: "Meta" },
						{
							src: "/Netlify_logo.svg",
							alt: "Netlify",
							name: "Netlify",
						},
						{
							src: "/Stripe_logo.svg",
							alt: "Stripe",
							name: "Stripe",
						},
						{
							src: "/Memfault_logo.svg",
							alt: "Memfault",
							name: "Memfault",
						},
						{
							src: "/Supabase_logo.svg",
							alt: "Supabase",
							name: "Supabase",
						},
						{
							src: "/Bluebeam_logo.svg",
							alt: "Bluebeam",
							name: "Bluebeam",
						},
						{ src: "/Wix_logo.svg", alt: "Wix", name: "Wix" },
						{ src: "/Odoo_logo.svg", alt: "Odoo", name: "Odoo" },
						{
							src: "/campings.com_logo.svg",
							alt: "Campings.com",
							name: "Campings",
						},
					].map((company, index) => (
						<motion.div
							key={company.name}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{
								duration: 0.5,
								delay: index * 0.1,
								ease: "easeOut",
							}}
							viewport={{ once: true }}
							whileHover={{ scale: 1.1, y: -5 }}
							className="group"
						>
							<div className="relative p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-canvora-200/50 dark:border-canvora-700/50 hover:border-canvora-400 dark:hover:border-canvora-500 transition-all duration-300 shadow-lg hover:shadow-xl">
								<Image
									src={company.src}
									alt={company.alt}
									width={120}
									height={60}
									className="w-24 h-12 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 dark:brightness-0 dark:invert dark:group-hover:brightness-100 dark:group-hover:invert-0"
								/>

								{/* Subtle hover effect */}
								<div className="absolute inset-0 bg-gradient-to-r from-canvora-400/0 via-canvora-500/0 to-canvora-600/0 group-hover:from-canvora-400/10 group-hover:via-canvora-500/10 group-hover:to-canvora-600/10 rounded-xl transition-all duration-300" />
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Trust indicators */}
				<motion.div
					className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					viewport={{ once: true }}
				>
					{[
						{
							icon: "👥",
							title: "50K+ Active Users",
							description: "Teams worldwide trust Canvora",
						},
						{
							icon: "🚀",
							title: "99.9% Uptime",
							description:
								"Reliable performance you can count on",
						},
						{
							icon: "⭐",
							title: "4.9/5 Rating",
							description: "Loved by users and teams",
						},
					].map((stat, index) => (
						<motion.div
							key={stat.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								delay: 0.7 + index * 0.1,
							}}
							viewport={{ once: true }}
							className="text-center group"
						>
							<motion.div
								className="text-4xl mb-4"
								whileHover={{ scale: 1.2, rotate: 10 }}
								transition={{ duration: 0.3 }}
							>
								{stat.icon}
							</motion.div>
							<h3 className="text-xl font-bold text-canvora-900 dark:text-canvora-100 mb-2 transition-colors duration-500">
								{stat.title}
							</h3>
							<p className="text-canvora-600 dark:text-canvora-400 transition-colors duration-500">
								{stat.description}
							</p>
						</motion.div>
					))}
				</motion.div>
			</motion.section>

			{/* Additional animated section with floating elements */}
			<motion.section
				className="relative py-20 overflow-hidden"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 1 }}
				viewport={{ once: true }}
			>
				{/* Floating background elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{[...Array(8)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-canvora-200/30 to-canvora-400/30 dark:from-canvora-600/20 dark:to-canvora-800/20"
							animate={{
								y: [0, -30, 0],
								x: [0, 15, -15, 0],
								rotate: [0, 180, 360],
								scale: [1, 1.1, 1],
							}}
							transition={{
								duration: 8 + i * 2,
								repeat: Infinity,
								ease: "easeInOut",
								delay: i * 1.5,
							}}
							style={{
								left: `${10 + i * 12}%`,
								top: `${10 + (i % 4) * 20}%`,
							}}
						/>
					))}
				</div>

				<div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
					<motion.div
						initial={{ y: 50, opacity: 0 }}
						whileInView={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<h2
							className={`${comic.variable} font-comic text-4xl md:text-6xl font-bold mb-8 text-canvora-900 dark:text-canvora-100 transition-colors duration-500`}
						>
							The Future of
							<span className="block bg-gradient-to-r from-canvora-500 via-canvora-600 to-canvora-700 dark:from-canvora-400 dark:via-canvora-500 dark:to-canvora-600 bg-clip-text text-transparent">
								Visual Collaboration
							</span>
						</h2>
						<p className="text-xl md:text-2xl text-canvora-700 dark:text-canvora-300 leading-relaxed max-w-4xl mx-auto transition-colors duration-500">
							Built for creators, designers, and teams who believe
							that the best ideas come from working together.
							Experience the next generation of digital
							whiteboarding.
						</p>
					</motion.div>
				</div>
			</motion.section>
		</div>
	);
}
