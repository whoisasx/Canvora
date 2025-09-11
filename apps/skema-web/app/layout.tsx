import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeWrapper } from "../components/ThemeWrapper";
import {
	chilanka,
	comic, // select it for the large and bold
	cutive_mono,
	excali,
	firaCode,
	ibm,
	inter,
	jakarta,
	mononoki,
	monospace,
	nunito, //general font family
	sourceCode,
	virgil,
} from "./font";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
});

export const metadata: Metadata = {
	title: "Canvora | Online whiteboard collaboration made easy",
	description:
		"Skema is a collaborative online whiteboard for sketching, brainstorming, and diagramming ideas in real time with a clean, minimal UI.",
	icons: {
		icon: "/canvora.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`font-nunito ${nunito.variable}`}>
				<ThemeWrapper>
					{children}
					<Toaster position="top-center" reverseOrder={false} />
				</ThemeWrapper>
			</body>
		</html>
	);
}
