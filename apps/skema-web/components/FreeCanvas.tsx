"use client";
import { useEffect, useRef, useState } from "react";
import FreeGame from "@/app/free-canvas/draw";
import LocalDriver from "@/utils/localPersistence";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function FreeCanvas({ initialId }: { initialId?: string }) {
	const [boardId] = useState<string>(() => initialId ?? `local:${uuidv4()}`);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const gameRef = useRef<FreeGame | null>(null);
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (!canvasRef.current) return;
		const g = new FreeGame(canvasRef.current, boardId);
		gameRef.current = g;
		return () => g.destructor();
	}, [canvasRef.current]);

	const handleExport = async () => {
		const snap = await LocalDriver.load(boardId);
		if (snap) LocalDriver.exportSnapshot(snap);
	};

	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

	const handleFilePicked = async (file?: File) => {
		if (!file) return;
		const imported = await LocalDriver.importFile(file);
		// reload by creating a new game instance
		gameRef.current?.destructor();
		if (canvasRef.current) {
			gameRef.current = new FreeGame(canvasRef.current, imported.id);
		}
	};

	const handleDelete = async () => {
		await LocalDriver.remove(boardId);
		router.push("/dashboard");
	};

	return (
		<div className="min-h-screen min-w-screen relative">
			<input
				type="file"
				accept="application/json"
				ref={fileInputRef}
				style={{ display: "none" }}
				onChange={(e) => {
					const f = e.target.files?.[0];
					handleFilePicked(f);
					e.currentTarget.value = "";
				}}
			/>
			<canvas ref={canvasRef} className="min-h-screen min-w-screen" />
		</div>
	);
}
