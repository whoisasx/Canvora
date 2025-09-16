import { CanvoraIcon, CanvoraTitle } from "@/ui/Canvora";
import { motion } from "motion/react";
import Link from "next/link";
import { excali } from "@/app/font";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		product: [
			{ name: "Free Board", href: "/free-board" },
			{ name: "Features", href: "/" },
			{ name: "Pricing", href: "/" },
			{ name: "Teams", href: "/" },
		],
		resources: [
			{ name: "Documentation", href: "/" },
			{ name: "Community", href: "/" },
			{ name: "Blog", href: "/" },
			{ name: "Use Cases", href: "/" },
		],
		company: [
			{ name: "About", href: "/" },
			{ name: "Careers", href: "/" },
			{ name: "Contact", href: "/" },
			{ name: "Privacy", href: "/" },
		],
		developers: [
			{ name: "GitHub", href: "https://github.com/whoisasx/Canvora" },
			{ name: "API", href: "/" },
			{ name: "Roadmap", href: "/" },
			{ name: "Security", href: "/" },
		],
	};

	const socialLinks = [
		{
			name: "GitHub",
			href: "https://github.com/whoisasx/Canvora",
			icon: (
				<svg
					className="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
				</svg>
			),
		},
		{
			name: "Twitter",
			href: "#",
			icon: (
				<svg
					className="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
				</svg>
			),
		},
		{
			name: "Discord",
			href: "#",
			icon: (
				<svg
					className="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0188 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
				</svg>
			),
		},
	];

	return (
		<motion.footer
			className="relative bg-gradient-to-b from-canvora-50/50 via-white to-canvora-100/30 dark:bg-gradient-to-b dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95 border-t border-canvora-200 dark:border-gray-600 transition-colors duration-500"
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			viewport={{ once: true }}
		>
			{/* Subtle Background Elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-canvora-200/20 to-canvora-300/20 dark:from-canvora-400/10 dark:to-canvora-500/15 rounded-full blur-xl"></div>
				<div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-canvora-300/15 to-canvora-400/15 dark:from-canvora-500/8 dark:to-canvora-600/12 rounded-full blur-2xl"></div>
				<div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-canvora-400/10 to-canvora-500/10 dark:from-canvora-600/6 dark:to-canvora-700/8 rounded-full blur-lg"></div>

				{/* Additional dark mode accent elements */}
				<div className="hidden dark:block absolute top-1/4 right-1/4 w-28 h-28 bg-gradient-to-br from-canvora-400/8 to-canvora-300/12 rounded-full blur-2xl"></div>
				<div className="hidden dark:block absolute bottom-1/3 left-1/5 w-36 h-36 bg-gradient-to-br from-canvora-500/6 to-canvora-400/10 rounded-full blur-3xl"></div>
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
				{/* Top Section */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
					{/* Brand Section */}
					<motion.div
						className="lg:col-span-2"
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<motion.div
							className="flex items-center mb-4"
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2 }}
						>
							<CanvoraIcon className="w-8 h-8 dark:filter dark:brightness-0 dark:invert" />
							<CanvoraTitle className="w-32 h-8 ml-2 dark:filter dark:brightness-0 dark:invert" />
						</motion.div>
						<p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
							Free & open source whiteboard for visual thinking.
							Create, collaborate, and share your ideas with the
							world.
						</p>
						<motion.div
							className="text-sm"
							whileHover={{ scale: 1.02 }}
						>
							<span
								className={`font-excali ${excali.variable} bg-gradient-to-r from-canvora-500 to-canvora-600 bg-clip-text text-transparent text-lg`}
							>
								Think Visually. Build Together.
							</span>
						</motion.div>
					</motion.div>

					{/* Links Sections */}
					{Object.entries(footerLinks).map(
						([category, links], categoryIndex) => (
							<motion.div
								key={category}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.6,
									delay: categoryIndex * 0.1,
								}}
								viewport={{ once: true }}
							>
								<h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-4 capitalize transition-colors duration-500">
									{category}
								</h3>
								<ul className="space-y-3">
									{links.map((link, linkIndex) => (
										<motion.li
											key={link.name}
											initial={{ opacity: 0, x: -10 }}
											whileInView={{ opacity: 1, x: 0 }}
											transition={{
												duration: 0.4,
												delay:
													categoryIndex * 0.1 +
													linkIndex * 0.05,
											}}
											viewport={{ once: true }}
										>
											<Link
												href={link.href}
												className="text-gray-600 dark:text-gray-300 hover:text-canvora-600 dark:hover:text-canvora-400 transition-all duration-300 hover:translate-x-1 inline-block"
												target={
													link.href.startsWith("http")
														? "_blank"
														: undefined
												}
												rel={
													link.href.startsWith("http")
														? "noopener noreferrer"
														: undefined
												}
											>
												{link.name}
											</Link>
										</motion.li>
									))}
								</ul>
							</motion.div>
						)
					)}
				</div>

				{/* Middle Section - Newsletter */}
				<motion.div
					className="border-t border-canvora-200 dark:border-gray-700 pt-8 mb-8"
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<div className="max-w-lg mx-auto text-center">
						<motion.h3
							className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
							initial={{ opacity: 0, y: -10 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							Stay updated
						</motion.h3>
						<motion.p
							className="text-gray-600 dark:text-gray-300 mb-4"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							Get the latest updates on new features and releases.
						</motion.p>
						<motion.div
							className="flex gap-2 max-w-sm mx-auto"
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-canvora-500 dark:focus:ring-canvora-400 transition-all duration-300"
							/>
							<motion.button
								className="px-6 py-2 bg-canvora-500 hover:bg-canvora-600 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Subscribe
							</motion.button>
						</motion.div>
					</div>
				</motion.div>

				{/* Bottom Section */}
				<motion.div
					className="border-t border-canvora-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					viewport={{ once: true }}
				>
					<div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
						<p className="text-gray-600 dark:text-gray-300 text-sm">
							© {currentYear} Canvora. All rights reserved.
						</p>
						<div className="flex items-center gap-4 text-sm">
							<Link
								href="/"
								className="text-gray-600 dark:text-gray-300 hover:text-canvora-600 dark:hover:text-canvora-400 transition-colors duration-300"
							>
								Terms
							</Link>
							<Link
								href="/"
								className="text-gray-600 dark:text-gray-300 hover:text-canvora-600 dark:hover:text-canvora-400 transition-colors duration-300"
							>
								Privacy
							</Link>
							<Link
								href="/"
								className="text-gray-600 dark:text-gray-300 hover:text-canvora-600 dark:hover:text-canvora-400 transition-colors duration-300"
							>
								Cookies
							</Link>
						</div>
					</div>

					{/* Social Links */}
					<motion.div
						className="flex items-center gap-4"
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						{socialLinks.map((social, index) => (
							<motion.a
								key={social.name}
								href={social.href}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-canvora-600 dark:hover:text-canvora-400 hover:bg-canvora-50 dark:hover:bg-gray-800 transition-all duration-300"
								whileHover={{ scale: 1.1, y: -2 }}
								whileTap={{ scale: 0.95 }}
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.4,
									delay: 0.5 + index * 0.1,
								}}
								viewport={{ once: true }}
								aria-label={social.name}
							>
								{social.icon}
							</motion.a>
						))}
					</motion.div>
				</motion.div>

				{/* Floating CTA */}
				<motion.div
					className="mt-8 text-center"
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8, delay: 0.5 }}
					viewport={{ once: true }}
				>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Link
							href="/free-board"
							target="_blank"
							className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-canvora-500 to-canvora-600 hover:from-canvora-600 hover:to-canvora-700 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
						>
							<span>Start drawing for free</span>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M14 5l7 7m0 0l-7 7m7-7H3"
								/>
							</svg>
						</Link>
					</motion.div>
				</motion.div>
			</div>
		</motion.footer>
	);
}
