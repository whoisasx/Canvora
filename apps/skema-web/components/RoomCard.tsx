import { IRoom } from "@/app/temp-dashboard/page";
import { useRoomStore } from "@/utils/dashBoardStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function RoomCard({ room }: { room: IRoom }) {
	const [isSession, setIsSession] = useState(false);
	const router = useRouter();

	const rooms = useRoomStore((state) => state.rooms);
	const setRooms = useRoomStore((state) => state.setRooms);

	const handleDeleteRoom = async () => {
		const newRooms = rooms.filter((r) => r !== room);
		setRooms(newRooms);

		try {
			await toast.promise(
				axios.delete("/api/delete-room", {
					data: { id: room.id },
				}),
				{
					loading: "Deleting room...",
					success: "Room deleted successfully 🗑️",
					error: "Failed to delete room 😢",
				}
			);
		} catch (error) {
			toast.error("Failed to delete room");
		}
	};

	const toggleCreateSession = async function (roomId: string) {
		const updatedRooms = rooms.map((room) => {
			if (room.id === roomId) {
				return { ...room, isActive: !room.isActive };
			}
			return room;
		});
		setRooms(updatedRooms);

		try {
			await toast.promise(
				axios.post("/api/toggle-roomstate", { roomId }),
				{
					loading: "Updating session...",
					success: (res) => {
						const toggledRoom = updatedRooms.find(
							(r) => r.id === roomId
						);
						return toggledRoom?.isActive
							? "Session started 🎉"
							: "Session stopped 🛑";
					},
					error: "Failed to update session 😢",
				}
			);
		} catch (error) {
			toast.error("Failed to toggle session");
		}
	};

	const handleShareSession = async function () {
		try {
			const url = `${window.location.origin}/canvas/${room.slug}`; // 👈 shareable link

			await navigator.clipboard.writeText(url); // 👈 copy to clipboard

			toast.success("Session link copied to clipboard 📋");
		} catch (error) {
			console.error(error);
			toast.error("Failed to copy link 😢");
		}
	};
	const handleShareCanvas = async function () {
		try {
			const url = `${window.location.origin}/canvas/${room.slug}`; // 👈 shareable link

			await navigator.clipboard.writeText(url); // 👈 copy to clipboard

			toast.success("Canvas link copied to clipboard 📋");
		} catch (error) {
			console.error(error);
			toast.error("Failed to copy link 😢");
		}
	};

	const handleJoinRoom = () => {
		router.push(`/canvas/${room.slug}`);
	};

	useEffect(() => {
		if (room.isActive) setIsSession(true);
	}, []);

	return (
		<div className="md:w-full lg:w-75 h-75 rounded-2xl border border-canvora-100 shadow-lg shadow-canvora-100">
			<button
				className="group w-full h-[60%] bg-gradient-card rounded-t-2xl relative cursor-pointer"
				onClick={() => handleJoinRoom()}
			>
				<div className="w-full h-full absolute top-0 left-0 bg-[url(/bg-oss-alt.svg)] rounded-t-2xl bg-center bg-no-repeat -z-10"></div>
				<p className="absolute bottom-2 left-5 group-hover:scale-110 group-hover:text-canvora-900 transition-all duration-300 ease-in-out">
					{room.name}
				</p>
			</button>
			<div className="px-2 w-full flex flex-col items-center justify-center gap-2 py-3">
				<div className="flex items-center justify-between w-full px-2">
					{!isSession && (
						<>
							<button
								className="w-30 h-10 rounded-xl border-t-[0.5px] border-x-[1px] border-b-[1.5px] cursor-pointer border-canvora-100 bg-canvora-600 text-white hover:bg-canvora-50 hover:border-canvora-600 hover:scale-105 hover:text-canvora-600 text-sm transition-all duration-300 ease-in-out "
								onClick={() => {
									setIsSession(true);
									toggleCreateSession(room.id);
								}}
							>
								Create session
							</button>
							<button
								className="w-30 h-10 rounded-xl bg-oc-red-8 text-white cursor-pointer border-t-[0.5px] border-x-[1px] border-b-[1.5px] px-1 border-oc-red-1 hover:bg-oc-red-1 hover:border-oc-red-8 hover:scale-105 hover:text-oc-red-8 text-sm transition-all duration-300 ease-in-out"
								onClick={handleDeleteRoom}
							>
								Delete Canvas
							</button>
						</>
					)}
					{isSession && (
						<>
							<button
								className="w-30 h-10 rounded-xl border-t-[0.5px] border-x-[1px] border-b-[1.5px] cursor-pointer border-canvora-100 bg-canvora-600 text-white hover:bg-canvora-50 hover:border-canvora-600 hover:scale-105 hover:text-canvora-600 text-sm transition-all duration-300 ease-in-out "
								onClick={handleShareSession}
							>
								Share session
							</button>
							<button
								className="w-30 h-10 rounded-xl bg-oc-red-8 text-white cursor-pointer border-t-[0.5px] border-x-[1px] border-b-[1.5px] px-1 border-oc-red-1 hover:bg-oc-red-1 hover:border-oc-red-8 hover:scale-105 hover:text-oc-red-8 text-sm transition-all duration-300 ease-in-out"
								onClick={() => {
									setIsSession(false);
									toggleCreateSession(room.id);
								}}
							>
								Close Session
							</button>
						</>
					)}
				</div>
				<div className="w-full h-10 rounded-2xl border border-canvora-100 flex items-center justify-between">
					<input
						type="text"
						className="appearence-none outline-none px-2 text-canvora-600 bg-oc-gray-2 h-full rounded-l-2xl pointer-events-none"
						disabled
						value={`${window.location.origin}/canvas/${room.slug}`}
					/>
					<button
						className="h-10 w-25 flex items-center justify-center gap-1 cursor-pointer bg-canvora-100 rounded-r-2xl hover:bg-canvora-600 hover:text-canvora-50 transition-all duration-300 ease-in-out"
						onClick={handleShareCanvas}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
							/>
						</svg>
						<span className="text-xs">Share only</span>
					</button>
				</div>
			</div>
		</div>
	);
}
