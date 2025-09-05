import Image from "next/image";
import FeatureCard from "./FeatureCard";
import { excali } from "@/app/font";

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
		<li className="relative px-6 md:px-8 pb-10 md:pb-30">
			{/* Vertical line on the left */}
			<div className="absolute top-15 bottom-0 -left-8 w-0.5 bg-canvora-200 bg-no-repeat bg-cover"></div>

			{/* Bulb Icon */}
			<img
				src={iconUrl}
				alt={iconAlt}
				className="py-2 absolute top-0 -left-15 h-15 w-15 px-1.5"
				width={50}
				height={49}
			/>

			{/* Tags */}
			<ul className="flex flex-row flex-wrap gap-3 pt-5 pb-2 text-xs mb-4">
				<li
					className={`px-2 py-1 bg-[url(/bg-green-strong.svg)] font-excali ${excali.variable}`}
				>
					{tagName}
				</li>
			</ul>

			{/* Headings & Description */}
			<div className="max-w-none text-canvora-900 flex flex-col gap-4">
				<h2 className="text-4xl font-bold">{heading}</h2>
				<h4 className="md:text-xl sm:text-lg text-base">
					{description}
				</h4>
			</div>

			{/* Video Section (Browser-like frame) */}
			<div className="relative">
				<div className="bg-canvora-50/50 my-16 overflow-hidden rounded-xl">
					{/* Browser bar */}
					<div className="h-6 border-b-[0.5] border-canvora-600 relative rounded-t-xl">
						{/* Left dots */}
						<div className="absolute top-0 left-5 flex h-full items-center gap-1">
							<div className="bg-canvora-600 h-1.5 w-1.5 rounded-full"></div>
							<div className="bg-canvora-600 h-1.5 w-1.5 rounded-full"></div>
							<div className="bg-canvora-600 h-1.5 w-1.5 rounded-full"></div>
						</div>
						{/* Center bar */}
						<div className="bg-canvora-50 absolute top-1.5 left-1/2 flex h-3 w-1/2 -translate-x-1/2 items-center justify-center rounded-sm">
							<Image
								src="/canvora-url.svg"
								alt="browser bar"
								width={50}
								height={8}
								className="text-transparent"
							/>
						</div>
					</div>

					{/* Video */}
					<video
						autoPlay
						muted
						playsInline
						loop
						src={videoSrc}
						className="w-full shadow-2xl shadow-canvora-600"
					></video>
				</div>

				{/* Radial background */}
				<div className=" absolute top-0 left-0 -z-10 aspect-square w-full h-full shadow-2xl shadow-canvora-50"></div>
			</div>

			{/* Feature cards */}
			<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{featureList &&
					featureList.map((feature, i) => (
						<FeatureCard
							key={i}
							heading={feature.heading}
							para={feature.para}
						/>
					))}
			</ul>
		</li>
	);
}
