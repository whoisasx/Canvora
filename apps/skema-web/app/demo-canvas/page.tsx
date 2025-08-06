"use client";
import { useEffect } from "react";
import { useRef } from "react";

export default function () {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef?.current) return;

		const ctx = canvasRef.current.getContext("2d");
		if (!ctx) return;

		//rectangle
		ctx.strokeStyle = "red"; // stroke controller.
		ctx.beginPath();
		ctx.fillStyle = "blue";
		ctx.roundRect(50, 50, 500, 300, 30); //edge controller
		ctx.stroke();
		ctx.closePath();
		ctx.strokeRect(500, 500, 500, 300); //edge controller

		return () => {};
	}, [canvasRef]);

	return (
		<canvas
			height={900}
			width={1600}
			className="border-1 rounded-lg shadow-2xl mx-auto mt-5"
			ref={canvasRef}
		></canvas>
	);
}
