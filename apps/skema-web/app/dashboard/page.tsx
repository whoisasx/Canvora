"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IRoom {
	id: string;
	slug: string;
	name: string;
	isActive: boolean;
	createdAt: Date;
}

export default function () {
	const [userdata, setUserdata] = useState({});
	const [roomName, setRoomName] = useState("");
	const [rooms, setRooms] = useState<IRoom[]>([]);
	const [roomlink, setRoomlink] = useState("");
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session) {
			setUserdata(session.user);
		}
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
			const response = await axios.post("/api/create-room", {
				name: room_name,
			});
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
			} else {
			}
		} catch {
		} finally {
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
			await axios.post("/api/toggle-roomstate", {
				roomId,
			});
		} catch (error) {
		} finally {
		}
	};
	const handleEnterSession = async function (slug: string) {
		router.push(`/canvas/${slug}`);
	};
	const handleEnterRoom = async function (slug: string) {
		router.push(`/canvas/${slug}`);
	};
	const handleJoinRoom = async function () {
		router.push(roomlink);
	};

	return (
		<div className="min-h-screen min-w-screen bg-red-50 py-10">
			<div className="h-20 border-b-1 rounded-b-2xl border-red-600 w-full flex justify-center items-center font-bold  mb-10">
				<p>{JSON.stringify(userdata)}</p>
			</div>
			<div>
				<div className="px-10">
					<div className="my-2 h-10 w-100 border-1 border-purple-700 rounded-xl">
						<input
							className="outline-none h-full rounded-l-xl px-3 w-[75%]"
							type="text"
							placeholder="enter the room link"
							value={roomlink}
							onChange={(e) => setRoomlink(e.target.value)}
						/>
						<button
							className="h-full text-center bg-blue-500 w-[25%] rounded-r-xl"
							onClick={handleJoinRoom}
						>
							join room
						</button>
					</div>
					<div className="my-2 h-10 w-100 border-1 border-purple-700 rounded-xl">
						<input
							className="outline-none h-full rounded-l-xl px-3 w-[75%]"
							type="text"
							placeholder="create a new room"
							value={roomName}
							onChange={(e) => setRoomName(e.target.value)}
						/>
						<button
							className="h-full text-center bg-blue-500 w-[25%] rounded-r-xl"
							onClick={handleCreateRoom}
						>
							create room
						</button>
					</div>
				</div>
			</div>
			<div className="min-w-screen border-t-1 border-t-blue-800 mt-10 py-5 px-10 flex flex-col gap-4">
				{rooms.length > 0 &&
					rooms.map((room, index) => (
						<div className="bg-red-100 p-5 rounded-xl" key={index}>
							<p className="my-5">
								<button
									className="h-10 w-32 rounded-2xl border-1 border-red-600 mx-3 "
									onClick={() => handleEnterRoom(room.slug)}
								>
									{room.name}
								</button>
							</p>
							<div className="mb-3">
								<button
									className="h-10 w-32 rounded-2xl border-1 border-purple-600 mx-3"
									onClick={() => toggleCreateSession(room.id)}
								>
									{room.isActive
										? "delete sesssion"
										: "start session"}
								</button>
								<button
									className="h-10 w-32 rounded-2xl border-1 border-purple-600 mx-3"
									onClick={() =>
										handleEnterSession(room.slug)
									}
								>
									enter session
								</button>
							</div>
							<p>{room.id}</p>
							<div className="w-120 h-10 border-1 border-blue-600 rounded-2xl">
								<input
									className="h-full w-[75%] outline-none px-3"
									type="text"
									value={`http://localhost:3000/canvas/${room.slug}`}
									readOnly
								/>
								<button className="h-full w-[25%] rounded-r-2xl bg-purple-500">
									copy link
								</button>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
