"use client";
import FloatingThemeToggle from "@/components/FloatingThemeToggle";
import Footer from "@/components/Footer";
import MainSection from "@/components/MainSection";
import NavBar from "@/components/NavBar";
import SideMenu from "@/components/SideMenu";
import { useSideBarStore } from "@/utils/landingPageStore";
import { SessionProvider } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function Home() {
	const isSideBarOpen = useSideBarStore((state) => state.isOpen);

	return (
		<SessionProvider>
			<div className="min-h-screen min-w-screen scroll-none transition-colors duration-500">
				<FloatingThemeToggle />
				<div className="min-h-screen min-w-screen p-5 relative bg-gradient-to-br from-canvora-50 via-canvora-100 to-canvora-200 dark:from-gray-900 dark:via-gray-800 dark:to-canvora-900">
					<NavBar />
					<MainSection />
					{isSideBarOpen && <SideMenu key="side-menu" />}
				</div>
				<Footer />
			</div>
		</SessionProvider>
	);
}
