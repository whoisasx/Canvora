"use client";
import Footer from "@/components/Footer";
import MainSection from "@/components/MainSection";
import NavBar from "@/components/NavBar";
import SideMenu from "@/components/SideMenu";
import { useSideBarStore } from "@/utils/landingPageStore";
import { useRouter } from "next/navigation";

export default function Home() {
	const isSideBarOpen = useSideBarStore((state) => state.isOpen);
	const router = useRouter();

	return (
		<div className="min-h-screen min-w-screen">
			<div className="min-h-screen min-w-screen p-5 relative bg-page-gradient-green">
				<NavBar />
				<MainSection />
				{isSideBarOpen && <SideMenu key="side-menu" />}
			</div>
			<Footer />
		</div>
	);
}
