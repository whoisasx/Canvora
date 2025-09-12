"use client";
import Footer from "@/components/Footer";
import MainSection from "@/components/MainSection";
import NavBar from "@/components/NavBar";
import SideMenu from "@/components/SideMenu";
import { useSideBarStore } from "@/utils/landingPageStore";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function Home() {
	const isSideBarOpen = useSideBarStore((state) => state.isOpen);

	// const { setTheme } = useTheme();

	// useEffect(() => {
	// 	setTheme("light"); // 👈 always force light when landing page mounts
	// }, [setTheme]);

	return (
		<div className="min-h-screen min-w-screen scroll-none landing-force-light">
			<div className="min-h-screen min-w-screen p-5 relative bg-page-gradient-green">
				<NavBar />
				<MainSection />
				{isSideBarOpen && <SideMenu key="side-menu" />}
			</div>
			<Footer />
		</div>
	);
}
