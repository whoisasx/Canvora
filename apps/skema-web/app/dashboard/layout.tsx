import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Canvora | Dashboard",
	description:
		"Canvora is a collaborative online whiteboard for sketching, brainstorming, and diagramming ideas in real time with a clean, minimal UI.",
	icons: {
		icon: "/canvora.svg",
	},
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<ThemeWrapper>{children}</ThemeWrapper>
		</SessionProvider>
	);
}
