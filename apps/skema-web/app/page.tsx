"use client";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	return (
		<div className="bg-gray-300 min-h-screen min-w-screen p-10">
			<div className="h-20 p-5 border-1 border-red-500 rounded-2xl">
				navbar
			</div>
			<div className="h-100 p-5 border-1 border-red-500 rounded-2xl my-5">
				<button
					className="h-8 w-30 text-center rounded-2xl border-purple-700 border-1"
					onClick={() => {
						router.push("signup");
					}}
				>
					get started
				</button>
			</div>
			<div className="h-30 p-5 border-1 border-red-500 rounded-2xl mt-10">
				footer
			</div>
		</div>
	);
}
