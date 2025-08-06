import {
	Cutive_Mono,
	Fira_Code,
	IBM_Plex_Sans,
	Inter,
	Nunito,
	Plus_Jakarta_Sans,
	Source_Code_Pro,
} from "next/font/google";
import localFont from "next/font/local";

export const firaCode = Fira_Code({
	weight: "400",
	variable: "--font-firacode",
	style: ["normal"],
});
export const sourceCode = Source_Code_Pro({
	weight: ["400"],
	variable: "--font-sourceCode",
	style: ["normal"],
});
export const nunito = Nunito({
	weight: ["400"],
	variable: "--font-nunito",
	style: ["normal"],
});
export const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});
export const jakarta = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-jakarta",
});
export const ibm = IBM_Plex_Sans({
	subsets: ["latin"],
	variable: "--font-ibm",
});
export const cutive_mono = Cutive_Mono({
	weight: ["400"],
	variable: "--font-cutivemono",
});

export const chilanka = localFont({
	src: "./fonts/chilanka.woff2",
	variable: "--font-chilanka",
	display: "swap",
});

export const comic = localFont({
	src: "./fonts/comic.woff2",
	variable: "--font-comic",
	display: "swap",
});

export const excali = localFont({
	src: "./fonts/excalifont.woff2",
	variable: "--font-excali",
	display: "swap",
});

export const monospace = localFont({
	src: "./fonts/monospace-argon.woff2",
	variable: "--font-monospace",
	display: "swap",
});

export const virgil = localFont({
	src: "./fonts/Virgil.woff2",
	variable: "--font-virgil",
	display: "swap",
});

export const mononoki = localFont({
	src: "./fonts/mononoki.woff",
	variable: "--font-mononoki",
	display: "swap",
});
