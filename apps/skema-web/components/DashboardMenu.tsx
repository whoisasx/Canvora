import { CanvoraIcon } from "@/ui/Canvora";
import {
	SelectedFilter,
	useSeletedFilterStore,
	useSideMenuStore,
} from "@/utils/dashBoardStore";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { motion } from "motion/react";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export const DashboardMenu = () => {
	const setSelectedFilter = useSeletedFilterStore(
		(state) => state.setSelected
	);
	const setSideMenu = useSideMenuStore((state) => state.setSideMenu);
	return (
		<motion.div
			initial={{ opacity: 0, x: "-100%" }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: "-100%" }}
			transition={{ duration: 0.35, ease: "easeOut" }}
			className="min-w-65 min-h-screen gap-4 flex flex-col md:hidden border-r-1 border-canvora-100 bg-canvora-50 shadow-xl shadow-canvora-200 py-5 fixed top-0 left-0 z-10 inset-y-0"
		>
			<div className="w-full h-8 flex items-center justify-between px-3">
				<div className="flex items-center justify-center px-2">
					<Link href={"/"}>
						<CanvoraIcon className="h-6 w-6" />
					</Link>
				</div>
				<button
					className="p-2 rounded-2xl hover:bg-canvora-500 hover:border-oc-gray-6 border-[0.5px] border-transparent transition-all duration-300 ease-in-out hover:text-white cursor-pointer"
					aria-label="Close"
					onClick={setSideMenu}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-5 h-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div>
				<div className="px-3 border-b-1 border-canvora-600 flex flex-col py-3 gap-2">
					<ButtonMenu
						icon={<RecentIcon />}
						text="Recents"
						index="recent"
						onClick={() => setSelectedFilter("recent")}
					/>
					<ButtonMenu
						icon={<StarIcon />}
						text="Favourites"
						index="favourite"
						onClick={() => setSelectedFilter("favourite")}
					/>
					<ButtonMenu
						icon={<DocsIcon />}
						text="All Canvas"
						index="all"
						onClick={() => setSelectedFilter("all")}
					/>
					<ButtonMenu
						icon={<TrashIcon />}
						text="Trash"
						index="trash"
						onClick={() => setSelectedFilter("trash")}
					/>
				</div>
				<div className="px-3 flex flex-col py-3 gap-1">
					<ButtonMenu
						icon={<SettingsIcon />}
						text="Settings"
						index="setting"
						onClick={() => console.log("settings")}
					/>
					<button
						className={`h-10 flex gap-2 items-center hover:bg-canvora-500 hover:scale-105 rounded-xl px-2 text-sm transition-all duration-300 ease-in-out cursor-pointer text-oc-red-8 hover:text-oc-red-6 hover:font-semibold`}
						onClick={() => signOut(redirect("/"))}
					>
						<LogOutIcon />
						<p>Log out</p>
					</button>
				</div>
			</div>
		</motion.div>
	);
};

export const DashboardMenuMd = () => {
	const setSelectedFilter = useSeletedFilterStore(
		(state) => state.setSelected
	);

	return (
		<div className="lg:min-w-70 md:min-w-60 min-h-screen h-fit hidden gap-4 md:flex flex-col border-r-1 border-canvora-100 bg-canvora-50/80 shadow-xl shadow-canvora-200 py-5 inset-y-0 sticky top-0 left-0">
			<div className="w-full h-8 flex items-center px-3">
				<div className="flex items-center justify-center px-2">
					<Link href={"/"}>
						<CanvoraIcon className="h-6 w-6" />
					</Link>
				</div>
			</div>
			<div>
				<div className="px-3 border-b-[0.5] border-canvora-600 flex flex-col gap-2 py-3">
					<ButtonMenu
						icon={<RecentIcon />}
						text="Recents"
						index="recent"
						onClick={() => setSelectedFilter("recent")}
					/>
					<ButtonMenu
						icon={<StarIcon />}
						text="Favourites"
						index="favourite"
						onClick={() => setSelectedFilter("favourite")}
					/>
					<ButtonMenu
						icon={<DocsIcon />}
						text="All Canvas"
						index="all"
						onClick={() => setSelectedFilter("all")}
					/>
					<ButtonMenu
						icon={<TrashIcon />}
						text="Trash"
						index="trash"
						onClick={() => setSelectedFilter("trash")}
					/>
				</div>
				<div className="px-3 flex flex-col py-3 gap-1">
					<ButtonMenu
						icon={<SettingsIcon />}
						text="Settings"
						index="setting"
						onClick={() => console.log("settings")}
					/>
					<button
						className={`h-10 flex gap-2 items-center hover:bg-canvora-500 hover:scale-105 rounded-xl px-2 text-sm transition-all duration-300 ease-in-out cursor-pointer text-oc-red-8 hover:text-oc-red-6 hover:font-semibold`}
						onClick={() => signOut(redirect("/"))}
					>
						<LogOutIcon />
						<p>Log out</p>
					</button>
				</div>
			</div>
		</div>
	);
};

function ButtonMenu({
	icon,
	text,
	index,
	onClick,
}: {
	icon: ReactNode;
	text: string;
	index: string;
	onClick: () => void;
}) {
	const selectedFilter = useSeletedFilterStore((state) => state.selected);
	return (
		<button
			className={`h-10 flex gap-2 items-center hover:bg-canvora-600 hover:scale-105 hover:text-white rounded-xl px-2 text-sm transition-all duration-300 ease-in-out cursor-pointer ${selectedFilter === index ? "bg-canvora-500 text-white" : ""}`}
			onClick={onClick}
		>
			{icon}
			<p>{text}</p>
		</button>
	);
}

function RecentIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.25}
			stroke="currentColor"
			className="size-5"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>
		</svg>
	);
}
function StarIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.25}
			stroke="currentColor"
			className="size-5"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
			/>
		</svg>
	);
}
function DocsIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.25}
			stroke="currentColor"
			className="size-5"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
			/>
		</svg>
	);
}
function TrashIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.25}
			stroke="currentColor"
			className="size-5"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
			/>
		</svg>
	);
}
function SettingsIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.25}
			stroke="currentColor"
			className="size-5"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
			/>
		</svg>
	);
}
function LogOutIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.25}
			stroke="currentColor"
			className="size-5"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
			/>
		</svg>
	);
}
