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

			<section>
				<div className="w-full flex flex-col gap-15 md:gap-40 p-10">
					<div className="w-full h-fit mx-auto flex items-center justify-center p-5">
						<Image
							src={"/hero-playground.png"}
							alt="hero image"
							width={1000}
							height={1000}
							className="w-full h-auto rounded-2xl"
						/>
					</div>
					<div className="w-full flex flex-col items-center gap-3 justify-center">
						<p className="w-full text-base min-[560]:text-lg sm:text-xl md:text-2xl font-semibold text-center">
							Trusted by the largest companies in the world
						</p>
						<div className="w-[100vw] relative overflow-hidden">
							{(() => {
								const logos = [
									"netflix-logo.svg",
									"Bluebeam_logo.svg",
									"Capco-logo.svg",
									"campings.com_logo.svg",
									"intel_logo.svg",
									"Linde_logo.svg",
									"Memfault_logo.svg",
									"Meta-logo.svg",
									"Microsoft_logo.svg",
									"Rokt_logo.svg",
									"Netlify_logo.svg",
									"Odoo_logo.svg",
									"Stripe_logo.svg",
									"Supabase_logo.svg",
									"Swappie_logo.svg",
									"tecton-logo.svg",
									"Wix_logo.svg",
								];
								return (
									<div
										className="marquee flex items-center gap-8"
										aria-hidden={false}
									>
										{[...logos, ...logos].map((src, i) => (
											<div
												key={i}
												className="flex items-center justify-center w-auto h-10"
											>
												<Image
													src={"/" + src}
													alt={src}
													width={100}
													height={50}
													className="w-auto h-auto"
												/>
											</div>
										))}
										<style jsx>{`
											.marquee {
												width: max-content;
												animation: marquee 20s linear
													infinite;
												will-change: transform;
											}

											@keyframes marquee {
												0% {
													transform: translateX(0);
												}
												100% {
													transform: translateX(-50%);
												}
											}

											/* reduce motion for users who prefer reduced motion */
											@media (prefers-reduced-motion: reduce) {
												.marquee {
													animation: none;
												}
											}
										`}</style>
									</div>
								);
							})()}
						</div>
					</div>

					<div className="w-full relative flex flex-col items-center justify-center gap-5 py-15">
						<div className="w-full h-full bg-[url(/home-hero.svg)] absolute top-0 bg-center left-0 bg-no-repeat flex items-center justify-center -z-10">
							<motion.div
								animate={{ y: [-5, 5, -5] }}
								transition={{
									duration: 6,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							>
								<Image
									src={"/oss-arrows.svg"}
									alt="animation-image"
									width={100}
									height={60}
									className="w-auto h-auto z-10 mb-15 ml-15"
								/>
							</motion.div>
						</div>
						<div className="w-full flex flex-col items-center justify-center gap-2">
							<h1
								className={`font-comic ${comic.variable} text-5xl md:text-6xl text-center text-canvora-900 mb-8`}
							>
								<span
									className=""
									style={{ wordSpacing: "-1rem" }}
								>
									Say hi to
								</span>
								<span
									className={`font-excali ${excali.variable} inline-block ml-2 bg-[url(/bg-green-strong.svg)] px-2 -skew-y-3 drop-shadow-xl`}
								>
									Canvora
								</span>
							</h1>
							<h4 className="text-center text-lg sm:text-xl md:text-2xl text-canvora-700 mb-2">
								<span
									className={`font-excali ${excali.variable} bg-[url(/bg-green-strong.svg)] bg-cover px-3 py-1`}
								>
									Free & open source
								</span>
							</h4>
							<h6 className="text-canvora-900 text-center">
								No account needed. Just start drawing.
							</h6>
						</div>
						<div className="flex flex-col md:flex-row items-center justify-center gap-5 px-5">
							<Link
								href={"/"}
								target="_blank"
								rel="noopener noreferer"
							>
								<Button
									size="large"
									level="primary"
									onClick={() => console.log("hi")}
								>
									Start drawing
								</Button>
							</Link>
							<Button
								size="large"
								level="tertiary"
								onClick={() => router.push("/signin")}
							>
								Sign in
							</Button>
						</div>
					</div>
				</div>
			</section>

			<section>
				<ul className="w-full mx-auto px-10">
					<SectionList
						iconUrl="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/bulb_icon.svg"
						iconAlt="idea-bulb"
						tagName="open source"
						heading="Create"
						description="Simply designed to create perfect results fast.Elementary tools, advanced features and unlimited options with an infinite canvas."
						videoSrc="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/Usecases_edit_video-1.mp4"
						featureList={[
							{
								heading: "✏️ Easy to use",
								para: "Zero learning curve",
							},
							{
								heading: "📖 Libraries",
								para: "Ready-to-use sketches",
							},
							{
								heading: "✨ Generative AI",
								para: "It's dead simple",
							},
						]}
					/>
					<SectionList
						iconUrl="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/collaborate_arrows_icon.svg"
						iconAlt="collaborat-arrow"
						tagName="easy to use"
						heading="Collaborate"
						description="Send link, get feedback and finish the idea together."
						videoSrc="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/Collaborate_video.mp4"
						featureList={[
							{
								heading: "🔗 Shareable link",
								para: "Collaborate in real-time.",
							},
							{
								heading: "🔐 Read-only link",
								para: "Share just content, not the scene access.",
							},
						]}
					/>
					<SectionList
						iconUrl="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/hand_easy_icon.svg"
						iconAlt="hand-easy-icon"
						tagName="no sign up"
						heading="The easiest way to get your thoughts on screen"
						description="Quick drawings and mockups with a unique aesthetic. It's dead simple. We help you with intuitive shortcuts & command palette."
						videoSrc="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/The_best_UI_video.mp4"
						featureList={[
							{
								heading: "Presentation",
								para: "Use frames to create slides and share your ideas with a presentation.",
							},
						]}
					/>
					<li className="relative px-6 md:px-8">
						<div className="absolute top-15 bottom-0 -left-8 w-11 bg-[url(/bg-feature-arrow.svg)] bg-no-repeat bg-cover"></div>
						<Image
							src="/canvora.svg"
							alt="canvora_logo"
							width={50}
							height={49}
							className="py-2 absolute top-0 -left-15 h-15 w-15 px-1.5"
						/>
						<div className="max-w-none text-canvora-900 flex flex-col gap-4">
							<h2 className="text-4xl font-bold text-canvora-900">
								<span>Online</span>
								<span
									className={`bg-[url(/bg-green-strong.svg)] font-excali ${excali.variable} px-2 py-1 ml-2 inline-block -skew-y-3`}
								>
									Whiteboard
								</span>
							</h2>
							<h4 className="md:text-xl sm:text-lg text-base">
								Something on your mind? Simply start drawing!
							</h4>
						</div>

						<div className="flex flex-col gap-4 pt-8 sm:flex-row sm:gap-6">
							<Link
								href={"/"}
								target="_blank"
								rel="noopener noreferer"
							>
								<Button
									size="medium"
									level="primary"
									onClick={() => console.log("hi")}
								>
									Draw now
								</Button>
							</Link>
							<Button
								size="medium"
								level="tertiary"
								onClick={() => router.push("/signin")}
							>
								Sign in
							</Button>
						</div>
					</li>
				</ul>
			</section>

			<section>
				<div className="w-full relative flex flex-col items-center justify-center gap-5 py-15 mt-10 md:mt-20">
					<div className="w-1/2 h-full bg-[url(/bg-oss-alt.svg)] absolute top-0 bg-right left-0 bg-no-repeat flex items-center justify-center -z-10">
						<motion.div
							animate={{ y: [-5, 5, -5] }}
							transition={{
								duration: 6,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							<Image
								src={"/oss-arrows-alt.svg"}
								alt="animation-image"
								width={100}
								height={60}
								className="w-auto h-auto z-10 mb-15 ml-15"
							/>
						</motion.div>
					</div>
					<div className="w-full flex flex-col items-center justify-center gap-2">
						<h1
							className={`font-comic ${comic.variable} text-5xl md:text-6xl text-center text-canvora-900 mb-8`}
						>
							<span
								className={`font-excali ${excali.variable} inline-block ml-2 bg-[url(/bg-green-strong.svg)] px-2 -skew-y-3 drop-shadow-xl`}
							>
								Free
							</span>
						</h1>
						<h4 className="text-center text-lg sm:text-xl md:text-2xl text-canvora-700 mb-2">
							Try the forever free editor for yourself
						</h4>
						<h6 className="text-canvora-900 text-center">
							Don’t take our word for granted. Try the forever
							free Canvora open-sourced editor for yourself and
							get your ideas out there.
						</h6>
					</div>
					<div className="flex flex-col md:flex-row items-center justify-center gap-5 px-5">
						<Link
							href={"/"}
							target="_blank"
							rel="noopener noreferer"
						>
							<Button
								size="large"
								level="primary"
								onClick={() => console.log("hi")}
							>
								Draw now
							</Button>
						</Link>
						<Link
							href={"https://www.github.com/whoisasx/Canvora"}
							target="_blank"
							rel="noopener noreferer"
						>
							<Button
								size="large"
								level="tertiary"
								onClick={() => console.log("hi")}
							>
								Checkout github
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
