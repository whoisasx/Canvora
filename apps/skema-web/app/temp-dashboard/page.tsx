"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { redirect, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { CanvoraIcon, CanvoraTitle } from "@/ui/Canvora";
import { DashboardMenu, DashboardMenuMd } from "@/components/DashboardMenu";
import {
	useCreateClickedStore,
	useRoomStore,
	useSideMenuStore,
} from "@/utils/dashBoardStore";
import { Button } from "@/ui/Button";
import RoomCard from "@/components/RoomCard";
import { User } from "next-auth";
import toast from "react-hot-toast";

export interface IRoom {
	id: string;
	slug: string;
	name: string;
	isActive: boolean;
	createdAt: Date;
}

export default function () {
	const [userdata, setUserdata] = useState<User | null>(null);
	const [roomName, setRoomName] = useState("");

	const rooms = useRoomStore((state) => state.rooms);
	const setRooms = useRoomStore((state) => state.setRooms);

	const [roomlink, setRoomlink] = useState("");
	const { data: session, status } = useSession();
	const router = useRouter();

	const sideMenu = useSideMenuStore((state) => state.sideMenu);
	const setSideMenu = useSideMenuStore((state) => state.setSideMenu);
	const { setTheme, resolvedTheme } = useTheme();

	const createClicked = useCreateClickedStore((state) => state.clicked);
	const setCreateClicked = useCreateClickedStore((state) => state.setClicked);

	useEffect(() => {
		if (!session) {
			return;
		}
		setUserdata(session.user ?? null);
	}, [session]);

	useEffect(() => {
		if (!session) {
			return;
		}
		const fetchRooms = async () => {
			try {
				const response = await axios.get(
					`api/get-rooms/${session.user.id}`
				);
				if (!response.data.success) return;
				const allRooms = response.data.data;
				const pulledRooms: IRoom[] = allRooms.map((room: IRoom) => ({
					id: room.id,
					name: room.name,
					slug: room.slug,
					createdAt: room.createdAt,
					isActive: room.isActive,
				}));
				setRooms(pulledRooms);
			} catch (error) {}
		};
		fetchRooms();
	}, [session]);

	const handleCreateRoom = async function () {
		const room_name = roomName;
		setRoomName("");

		try {
			await toast.promise(
				axios.post("/api/create-room", { name: room_name }),
				{
					loading: "Creating room...",
					success: (response) => {
						if (response.status === 201) {
							const roomData = response.data.data;
							const newRoom: IRoom = {
								id: roomData.id,
								name: roomData.name,
								slug: roomData.slug,
								createdAt: roomData.createdAt,
								isActive: roomData.isActive,
							};
							setRooms([...(rooms || []), newRoom]);
							return "Room created successfully 🎉";
						}
						return "Something went wrong";
					},
					error: "Failed to create room 😢",
				}
			);
		} catch (error) {
			toast.error("Something went wrong");
		}
	};

	const handleEnterSession = async function () {
		router.push(roomlink);
	};

	useEffect(() => {
		setTheme("light"); // 👈 always force light when dashboard page mounts
	}, [setTheme]);

	const contentRef = useRef<HTMLDivElement | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (!contentRef.current || !scrollRef.current) return;

		const content = contentRef.current;
		const thumb = scrollRef.current;
		const THUMB_HEIGHT = 65; // fixed height px

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = content;

			// Fixed thumb height
			const thumbHeight = THUMB_HEIGHT;
			const maxThumbOffset = clientHeight - thumbHeight;

			// Proportional offset
			const thumbOffset =
				(scrollTop / (scrollHeight - clientHeight)) * maxThumbOffset;

			thumb.style.height = `${thumbHeight}px`;
			thumb.style.top = `${thumbOffset}px`;
		};

		content.addEventListener("scroll", handleScroll);
		handleScroll();

		return () => content.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="h-screen w-screen bg-page-gradient-purple flex relative">
			{createClicked && (
				<div
					className="w-screen h-screen absolute top-0 left-0 backdrop-blur-md z-50 flex items-center justify-center"
					onClick={() => setCreateClicked(false)}
				>
					<div
						className="w-80 h-80 border border-canvora-200 shadow-xl bg-canvora-50/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-5"
						onClick={(e) => e.stopPropagation()}
					>
						<input
							type="text"
							value={roomName}
							onChange={(e) => {
								setRoomName(e.target.value);
							}}
							placeholder="Enter name"
							className="appearenc-none w-full h-10 border rounded-2xl px-3 border-canvora-600 outline-none"
						/>
						<Button
							size="large"
							level="primary"
							onClick={() => {
								setCreateClicked(false);
								handleCreateRoom();
							}}
						>
							Create canvas
						</Button>
					</div>
				</div>
			)}
			<DashboardMenuMd />
			{sideMenu && <DashboardMenu />}
			<div className="flex-1 h-screen relative">
				<div className="absolute top-0 left-0 h-full rounded-full">
					{/* thumb */}
					<div
						ref={scrollRef}
						id="fake-thumb"
						className="absolute top-0 w-1 bg-canvora-300 rounded-full"
						style={{ height: "65px" }}
					></div>
				</div>
				<div
					ref={contentRef}
					className="h-full overflow-y-auto cus-scrollbar"
				>
					<div className="flex items-center justify-between py-3 px-3 md:px-5 sticky top-0  border-b-[0.5px] border-canvora-100">
						<div className="flex items-center justify-center gap-2 md:gap-3 px-2 md:px-5">
							<button
								className="w-fit h-fit cursor-pointer md:hidden"
								onClick={setSideMenu}
							>
								<div className="w-8 h-8 rounded-xl bg-canvora-200 flex items-center justify-center hover:scale-95 transition-all duration-300 ease-in-out border-[0.5px] border-transparent hover:border-canvora-500">
									<div className="flex h-4 w-4 cursor-pointer flex-col justify-around">
										<div className="bg-canvora-500 h-0.5 rounded-md transition duration-500 ease-in-out"></div>
										<div className="bg-canvora-500 h-0.5 rounded-md transition duration-500 ease-in-out opacity-100"></div>
										<div className="bg-canvora-500 h-0.5 rounded-md transition duration-500 ease-in-out"></div>
									</div>
								</div>
							</button>
							<div className="group h-10 lg:w-96 md:w-60 w-auto flex gap-2 items-center rounded-xl border border-canvora-300 hover:scale-105 group-focus-within:scale-105 hover:border-canvora-500 group-focus-within:border-canvora-500 transition-all duration-300 ease-in-out">
								<input
									type="text"
									value={roomlink}
									onChange={(e) =>
										setRoomlink(e.target.value)
									}
									placeholder={"Enter session link..."}
									className="h-full w-full px-2 appearance-none outline-0 placeholder:text-sm text-canvora-600 placeholder:text-oc-gray-6/60"
								></input>
								<button
									className="h-full w-15 px-1 text-sm rounded-r-xl bg-canvora-50 hover:bg-canvora-600 hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
									onClick={handleEnterSession}
								>
									Join
								</button>
							</div>
						</div>

						<div className="flex justify-center px-2 md:px-5">
							<div className="w-8 h-8 sm:w-10 sm:h-10 hidden  md:flex items-center justify-center ">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
									/>
								</svg>
							</div>
							<div className="h-8 sm:h-10 hidden min-[480]:flex items-center px-2 border-[0.5px] rounded-xl border-canvora-50">
								<div className="h-6 w-6 sm:h-8 sm:w-8">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="sm:size-8 size-6 stroke-canvora-900"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg>
								</div>
								<div className="flex flex-col items-baseline sm:text-sm text-xs min-w-fit text-canvora-900">
									<p className="leading-none">
										{userdata?.username}
									</p>
									<p className="leading-none line-clamp-1 text-sm">
										User role
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="p-5 min-h-screen flex flex-col gap-10">
						<div className="w-full flex items-center justify-between px-2 md:px-5 gap-2">
							<p className="text-2xl md:text-4xl sm:text-3xl font-semibold text-canvora-900">
								Drawings
							</p>
							<button
								className="w-30 min-[480]:w-40 h-10 flex items-center justify-center gap-2 rounded-xl bg-canvora-600 text-white cursor-pointer hover:text-black hover:scale-105 hover:border hover:border-canvora-600 transition-all duration-300 ease-in-out"
								onClick={() => setCreateClicked(true)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-4"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 4.5v15m7.5-7.5h-15"
									/>
								</svg>
								<p className="text-sm">New Canvas</p>
							</button>
						</div>
						<Suspense
							fallback={
								<div className="@container w-full px-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-5">
									{Array.from({ length: 6 }).map((_, i) => (
										<div
											key={i}
											className="h-40 w-full rounded-xl bg-canvora-200 animate-pulse"
										></div>
									))}
								</div>
							}
						>
							<div className="@container w-full px-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-5">
								{rooms.map((room, i) => (
									<RoomCard key={i} room={room} />
								))}
								<button
									className="w-75 h-75 rounded-2xl border border-canvora-200 shadow-lg shadow-canvora-100 cursor-pointer bg-canvora-100 flex flex-col items-center justify-center gap-2 border-dashed hover:scale-105 transition-all duration-300 ease-in-out"
									onClick={() => setCreateClicked(true)}
								>
									<div className="w-10 h-10 bg-canvora-600 rounded-full text-3xl flex items-center justify-center text-canvora-50">
										+
									</div>
									<p className="text-canvora-900 font-semibold">
										Create new canvas
									</p>
								</button>
							</div>
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	);
}
