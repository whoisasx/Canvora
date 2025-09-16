import rough from "roughjs";
import { RoughGenerator } from "roughjs/bin/generator";
import { Drawable, Options } from "roughjs/bin/core";
import { Tool, CommonProps, edges } from "../types";
import { CommonPropsGame } from "@/utils/propsStore";
import { Message } from "../draw";
import { normalizeCoords, roughOptions, normalizeStroke } from "../render";
import { createRhombusPath } from "../render/rhombus";

// Type definitions
type BoundingBox = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };
type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "none";

// Constants
const MIN_SIZE = 1;
const MAX_DIMENSION = 10000;
// Performance optimization constants
const THROTTLE_MS = 16; // Match main render throttle (~60fps)

export class RhombusHelper {
	/**
	 * Unified rhombus shape data generator
	 * Consolidates edge handling logic used across multiple functions
	 */
	static generateShapeData(
		generator: RoughGenerator,
		x: number,
		y: number,
		w: number,
		h: number,
		edges: edges,
		options: Options,
		seed: number
	): Drawable {
		const finalOptions = {
			...options,
			seed: seed,
		};

		const path = createRhombusPath(x, y, w, h, edges === "round");
		return generator.path(path, finalOptions);
	}

	/**
	 * Validates rhombus dimensions
	 */
	static validateRhombus(rect: BoundingBox): boolean {
		return (
			rect.w > 0 &&
			rect.h > 0 &&
			rect.w < MAX_DIMENSION &&
			rect.h < MAX_DIMENSION &&
			!isNaN(rect.x) &&
			!isNaN(rect.y) &&
			!isNaN(rect.w) &&
			!isNaN(rect.h)
		);
	}

	/**
	 * Constrains rhombus to valid dimensions
	 */
	static constrainRhombus(rect: BoundingBox): BoundingBox {
		return {
			x: rect.x,
			y: rect.y,
			w: Math.max(MIN_SIZE, Math.min(rect.w, MAX_DIMENSION)),
			h: Math.max(MIN_SIZE, Math.min(rect.h, MAX_DIMENSION)),
		};
	}
}

export class RhombusManager {
	private shapeDataCache = new Map<string, Drawable>();
	private lastPreviewRect: BoundingBox | null = null;
	private lastPreviewSend: number = 0;

	// Throttling for drag/resize operations
	private lastDragUpdate: number = 0;
	private lastResizeUpdate: number = 0;

	constructor(
		private ctx: CanvasRenderingContext2D,
		private rc: any, // RoughCanvas
		private generator: RoughGenerator,
		private socket: WebSocket,
		private theme: "light" | "dark",
		private roomId: string,
		private userId: string
	) {}

	/**
	 * Creates a rhombus message object for final shape creation
	 * Replaces messageRhombus function
	 */
	createMessage(
		startX: number,
		startY: number,
		w: number,
		h: number,
		props: CommonPropsGame,
		seed?: number
	): Message {
		const rect = normalizeCoords(startX, startY, w, h);

		if (!RhombusHelper.validateRhombus(rect)) {
			throw new Error("Invalid rhombus dimensions");
		}

		const options = roughOptions(props);
		const shapeData = RhombusHelper.generateShapeData(
			this.generator,
			rect.x,
			rect.y,
			rect.w,
			rect.h,
			props.edges!,
			options,
			seed ?? Math.floor(Math.random() * 1000000)
		);

		return {
			id: crypto.randomUUID(),
			shape: "rhombus" as Tool,
			opacity: props.opacity,
			edges: props.edges,
			shapeData,
			boundingBox: rect,
		};
	}

	/**
	 * Renders a finalized rhombus on the canvas
	 * Replaces drawRhombus function
	 */
	render(message: Message): void {
		if (!this.rc || Array.isArray(message.shapeData)) return;

		try {
			this.ctx.save();
			this.ctx.globalAlpha = message.opacity ?? 1;
			this.ctx.lineJoin = "round";
			this.ctx.lineCap = "round";

			// Clone to avoid mutating original
			const shapeData = { ...message.shapeData };
			shapeData.options = { ...shapeData.options };
			shapeData.options.stroke = normalizeStroke(
				this.theme,
				shapeData.options.stroke
			);

			this.rc.draw(shapeData);
			this.ctx.restore();
		} catch (error) {
			console.error("Error rendering rhombus:", error);
			this.ctx.restore();
		}
	}

	/**
	 * Renders live preview rhombus while user is dragging
	 * Replaces drawMovingRhombus function with performance optimizations
	 */
	renderPreview(
		startX: number,
		startY: number,
		w: number,
		h: number,
		props: CommonPropsGame,
		previewId: string,
		previewSeed: number
	): void {
		const rect = normalizeCoords(startX, startY, w, h);

		try {
			this.ctx.save();
			this.ctx.globalAlpha = props.opacity ?? 1;
			this.ctx.lineJoin = "round";
			this.ctx.lineCap = "round";

			const options = roughOptions(props);
			const shapeData = RhombusHelper.generateShapeData(
				this.generator,
				rect.x,
				rect.y,
				rect.w,
				rect.h,
				props.edges!,
				options,
				previewSeed
			);

			this.rc.draw(shapeData);
			this.ctx.restore();

			// Performance optimization: throttle and deduplicate
			const now = Date.now();
			if (
				this.lastPreviewRect &&
				this.lastPreviewRect.x === rect.x &&
				this.lastPreviewRect.y === rect.y &&
				this.lastPreviewRect.w === rect.w &&
				this.lastPreviewRect.h === rect.h &&
				now - this.lastPreviewSend < THROTTLE_MS
			) {
				return;
			}

			// Update throttling state
			this.lastPreviewSend = now;
			this.lastPreviewRect = { ...rect };

			// Send preview to collaborators
			const message: Message = {
				id: previewId,
				shape: "rhombus" as Tool,
				opacity: props.opacity,
				edges: props.edges,
				shapeData,
				boundingBox: rect,
			};

			this.socket.send(
				JSON.stringify({
					type: "draw-message",
					message,
					roomId: this.roomId,
					clientId: this.userId,
				})
			);
		} catch (error) {
			console.error("Error rendering rhombus preview:", error);
			this.ctx.restore();
		}
	}

	/**
	 * Handles dragging/moving an existing rhombus
	 * Replaces handleRhombusDrag function with optimizations
	 */
	handleDrag(
		message: Message,
		currentPos: Point,
		previousPos: Point,
		currentProps: CommonPropsGame,
		setSelectedMessage: (msg: Message) => void
	): void {
		if (Array.isArray(message.shapeData)) return;

		try {
			const dx = currentPos.x - previousPos.x;
			const dy = currentPos.y - previousPos.y;
			const rect = message.boundingBox;

			const newRect = {
				x: rect.x + dx,
				y: rect.y + dy,
				w: rect.w,
				h: rect.h,
			};

			if (!RhombusHelper.validateRhombus(newRect)) {
				console.warn("Invalid rhombus during drag, skipping update");
				return;
			}

			const options = roughOptions(currentProps);

			const shapeData = RhombusHelper.generateShapeData(
				this.generator,
				newRect.x,
				newRect.y,
				newRect.w,
				newRect.h,
				message.edges!,
				options,
				message.shapeData.options.seed
			);

			const newMessage: Message = {
				...message,
				shapeData,
				boundingBox: newRect,
			};

			setSelectedMessage(newMessage);
			this.socket.send(
				JSON.stringify({
					type: "update-message",
					flag: "update-preview",
					id: newMessage.id,
					newMessage,
					roomId: this.roomId,
					clientId: this.userId,
				})
			);
		} catch (error) {
			console.error("Error during rhombus drag:", error);
		}
	}

	/**
	 * Handles resizing rhombus from 8 resize handles
	 * Replaces handleRhombusResize function with enhanced logic
	 */
	handleResize(
		message: Message,
		currentPos: Point,
		previousPos: Point,
		resizeHandler: Handle,
		currentProps: CommonPropsGame,
		setSelectedMessage: (msg: Message) => void,
		updateCursor: (cursor: string) => void
	): { newHandler: Handle } {
		if (Array.isArray(message.shapeData) || resizeHandler === "none") {
			return { newHandler: resizeHandler };
		}

		try {
			const dx = currentPos.x - previousPos.x;
			const dy = currentPos.y - previousPos.y;
			const rect = { ...message.boundingBox };

			// Apply resize transformation based on handle
			this.applyResizeTransformation(rect, dx, dy, resizeHandler);

			// Handle negative dimensions with smart handle flipping
			const flipResult = this.handleDimensionFlips(rect, resizeHandler);
			const constrainedRect = RhombusHelper.constrainRhombus(rect);

			if (flipResult.flipped) {
				updateCursor(`${flipResult.newHandler}-resize`);
			}

			const normalRect = normalizeCoords(
				constrainedRect.x,
				constrainedRect.y,
				constrainedRect.w,
				constrainedRect.h
			);

			const options = roughOptions(currentProps);

			const shapeData = RhombusHelper.generateShapeData(
				this.generator,
				normalRect.x,
				normalRect.y,
				normalRect.w,
				normalRect.h,
				message.edges!,
				options,
				message.shapeData.options.seed
			);

			const newMessage: Message = {
				...message,
				shapeData,
				boundingBox: normalRect,
			};

			setSelectedMessage(newMessage);
			this.socket.send(
				JSON.stringify({
					type: "update-message",
					flag: "update-preview",
					id: newMessage.id,
					newMessage,
					roomId: this.roomId,
					clientId: this.userId,
				})
			);

			return { newHandler: flipResult.newHandler };
		} catch (error) {
			console.error("Error during rhombus resize:", error);
			return { newHandler: resizeHandler };
		}
	}

	/**
	 * Updates rhombus appearance when properties change
	 * Replaces handleRhombusPropsChange function
	 */
	updateProperties(
		message: Message,
		newProps: CommonPropsGame,
		setSelectedMessage: (msg: Message) => void
	): void {
		if (Array.isArray(message.shapeData)) return;

		try {
			const rect = message.boundingBox;
			const options = roughOptions(newProps);

			const shapeData = RhombusHelper.generateShapeData(
				this.generator,
				rect.x,
				rect.y,
				rect.w,
				rect.h,
				newProps.edges!,
				options,
				message.shapeData.options.seed
			);

			const newMessage: Message = {
				...message,
				opacity: newProps.opacity,
				edges: newProps.edges,
				shapeData,
			};

			setSelectedMessage(newMessage);
			this.socket.send(
				JSON.stringify({
					type: "update-message",
					id: newMessage.id,
					newMessage,
					roomId: this.roomId,
					clientId: this.userId,
				})
			);
		} catch (error) {
			console.error("Error updating rhombus properties:", error);
		}
	}

	/**
	 * Clears cache and resets state
	 */
	cleanup(): void {
		this.shapeDataCache.clear();
		this.lastPreviewRect = null;
		this.lastPreviewSend = 0;
	}

	// Private helper methods

	private applyResizeTransformation(
		rect: BoundingBox,
		dx: number,
		dy: number,
		handle: Handle
	): void {
		switch (handle) {
			case "e": // right edge
				rect.w += dx;
				break;
			case "w": // left edge
				rect.x += dx;
				rect.w -= dx;
				break;
			case "s": // bottom edge
				rect.h += dy;
				break;
			case "n": // top edge
				rect.y += dy;
				rect.h -= dy;
				break;
			case "se": // bottom-right
				rect.w += dx;
				rect.h += dy;
				break;
			case "sw": // bottom-left
				rect.x += dx;
				rect.w -= dx;
				rect.h += dy;
				break;
			case "ne": // top-right
				rect.w += dx;
				rect.y += dy;
				rect.h -= dy;
				break;
			case "nw": // top-left
				rect.x += dx;
				rect.w -= dx;
				rect.y += dy;
				rect.h -= dy;
				break;
		}
	}

	private handleDimensionFlips(
		rect: BoundingBox,
		currentHandle: Handle
	): { newHandler: Handle; flipped: boolean } {
		let hFlip = false;
		let vFlip = false;

		if (rect.w < 0) {
			rect.x += rect.w;
			rect.w = -rect.w;
			hFlip = true;
		}
		if (rect.h < 0) {
			rect.y += rect.h;
			rect.h = -rect.h;
			vFlip = true;
		}

		if (!hFlip && !vFlip) {
			return { newHandler: currentHandle, flipped: false };
		}

		// Calculate new handle after flipping
		let h = currentHandle.includes("e")
			? "e"
			: currentHandle.includes("w")
				? "w"
				: "";
		let v = currentHandle.includes("n")
			? "n"
			: currentHandle.includes("s")
				? "s"
				: "";

		if (hFlip) h = h === "e" ? "w" : h === "w" ? "e" : "";
		if (vFlip) v = v === "n" ? "s" : v === "s" ? "n" : "";

		const newHandle = (v + h) as Handle;
		return { newHandler: newHandle || "none", flipped: true };
	}
}
