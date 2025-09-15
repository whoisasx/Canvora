import rough from "roughjs";
import { RoughGenerator } from "roughjs/bin/generator";
import { Drawable, Options } from "roughjs/bin/core";
import { Tool } from "../types";
import { CommonPropsGame } from "@/utils/propsStore";
import { Message } from "../draw";
import { roughOptions, normalizeStroke } from "../render";
import { createPencilPath } from "../render/pencil";
import { Handle } from "../assist";

// Type definitions
type BoundingBox = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };

// Constants
const MIN_POINTS = 1;
const MAX_POINTS = 10000;
// Performance optimization constants
const THROTTLE_MS = 16; // Match main render throttle (~60fps)

export class PencilHelper {
	/**
	 * Validates pencil points array
	 */
	static validatePencilPoints(points: Point[]): boolean {
		return (
			points.length >= MIN_POINTS &&
			points.length <= MAX_POINTS &&
			points.every(
				(p) =>
					!isNaN(p.x) && !isNaN(p.y) && isFinite(p.x) && isFinite(p.y)
			)
		);
	}

	/**
	 * Calculates bounding box for pencil points
	 */
	static calculateBoundingBox(points: Point[]): BoundingBox {
		if (points.length === 0) {
			return { x: 0, y: 0, w: 0, h: 0 };
		}

		let minx = Number.MAX_VALUE;
		let miny = Number.MAX_VALUE;
		let maxx = Number.MIN_VALUE;
		let maxy = Number.MIN_VALUE;

		for (const point of points) {
			if (point.x < minx) minx = point.x;
			if (point.y < miny) miny = point.y;
			if (point.x > maxx) maxx = point.x;
			if (point.y > maxy) maxy = point.y;
		}

		return {
			x: minx,
			y: miny,
			w: Math.max(0, maxx - minx),
			h: Math.max(0, maxy - miny),
		};
	}

	/**
	 * Unified pencil shape data generator
	 */
	static generateShapeData(
		generator: RoughGenerator,
		points: Point[],
		options: Options,
		seed: number
	): Drawable {
		const path = createPencilPath(points);
		return generator.path(path, {
			...options,
			strokeWidth: options.strokeWidth! * 2,
			roughness: 0,
			bowing: 0,
			seed: seed,
		});
	}

	/**
	 * Checks if two bounding boxes are equal (for throttling)
	 */
	static boundingBoxesEqual(
		a: BoundingBox | null,
		b: BoundingBox | null
	): boolean {
		if (!a || !b) return false;
		return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
	}
}

export class PencilManager {
	private shapeDataCache = new Map<string, Drawable>();
	private lastPreviewBoundingBox: BoundingBox | null = null;
	private lastPreviewSend: number = 0;

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
	 * Creates a pencil message object for final shape creation
	 * Replaces messagePencil function
	 */
	createMessage(
		points: Point[],
		props: CommonPropsGame,
		seed?: number
	): Message {
		if (!PencilHelper.validatePencilPoints(points)) {
			throw new Error("Invalid pencil points");
		}

		const options = roughOptions(props);
		const finalSeed = seed ?? Math.floor(Math.random() * 1000000);
		const shapeData = PencilHelper.generateShapeData(
			this.generator,
			points,
			options,
			finalSeed
		);

		const boundingBox = PencilHelper.calculateBoundingBox(points);

		return {
			id: crypto.randomUUID(),
			shape: "pencil" as Tool,
			opacity: props.opacity,
			shapeData,
			boundingBox,
			pencilPoints: points.slice(), // Create a copy
		};
	}

	/**
	 * Renders a finalized pencil stroke on the canvas
	 * Replaces drawPencil function
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
		} catch (error) {
			console.error("Error rendering pencil:", error);
		} finally {
			this.ctx.restore();
		}
	}

	/**
	 * Renders a preview pencil stroke during drawing
	 * Replaces drawMovingPencil function with optimizations
	 */
	renderPreview(
		points: Point[],
		props: CommonPropsGame,
		previewId: string,
		seed: number
	): void {
		if (!this.rc || points.length < 1) return;

		try {
			this.ctx.save();
			this.ctx.globalAlpha = props.opacity ?? 1;
			this.ctx.lineJoin = "round";
			this.ctx.lineCap = "round";

			const options = roughOptions(props);
			const drawable = PencilHelper.generateShapeData(
				this.generator,
				points,
				options,
				seed
			);

			this.rc.draw(drawable);

			// Calculate bounding box for throttling
			const rect = PencilHelper.calculateBoundingBox(points);

			// Throttle and skip identical pencil previews to avoid flooding
			const now = Date.now();
			if (
				PencilHelper.boundingBoxesEqual(
					this.lastPreviewBoundingBox,
					rect
				) &&
				now - this.lastPreviewSend < THROTTLE_MS
			) {
				return;
			}

			this.lastPreviewSend = now;
			this.lastPreviewBoundingBox = {
				x: rect.x,
				y: rect.y,
				w: rect.w,
				h: rect.h,
			};

			// Send preview message to other clients
			const message: Message = {
				id: previewId,
				shape: "pencil" as Tool,
				opacity: props.opacity,
				shapeData: drawable,
				boundingBox: rect,
				pencilPoints: points.slice(),
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
			console.error("Error rendering pencil preview:", error);
		} finally {
			this.ctx.restore();
		}
	}

	/**
	 * Updates the manager when theme changes
	 */
	updateTheme(theme: "light" | "dark"): void {
		this.theme = theme;
		// Clear cache when theme changes as colors may be different
		this.shapeDataCache.clear();
	}

	/**
	 * Updates the manager when user changes
	 */
	updateUser(userId: string): void {
		this.userId = userId;
	}

	/**
	 * Handles dragging pencil strokes
	 * Replaces handlePencilDrag function with optimizations
	 */
	handleDrag(
		message: Message,
		currentPos: Point,
		previousPos: Point,
		currentProps: CommonPropsGame,
		setSelectedMessage: (msg: Message) => void
	): void {
		if (!message.pencilPoints || Array.isArray(message.shapeData)) return;

		try {
			const dx = currentPos.x - previousPos.x;
			const dy = currentPos.y - previousPos.y;

			const newPoints = message.pencilPoints.map((p) => ({
				x: p.x + dx,
				y: p.y + dy,
			}));

			if (!PencilHelper.validatePencilPoints(newPoints)) {
				console.warn(
					"Invalid pencil points during drag, skipping update"
				);
				return;
			}

			const options = roughOptions(currentProps);
			const shapeData = PencilHelper.generateShapeData(
				this.generator,
				newPoints,
				options,
				message.shapeData.options.seed
			);

			const boundingBox = PencilHelper.calculateBoundingBox(newPoints);

			const newMessage: Message = {
				...message,
				pencilPoints: newPoints,
				shapeData,
				boundingBox,
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
			console.error("Error during pencil drag:", error);
		}
	}

	/**
	 * Handles resizing pencil strokes from 8 resize handles
	 * Replaces handlePencilResize function with enhanced logic
	 */
	handleResize(
		message: Message,
		currentPos: Point,
		previousPos: Point,
		resizeHandler: Handle,
		currentProps: CommonPropsGame,
		setSelectedMessage: (msg: Message) => void,
		setCursor: (cursor: string) => void
	): { newHandler: Handle } {
		if (
			!message.pencilPoints ||
			resizeHandler === "none" ||
			Array.isArray(message.shapeData)
		) {
			return { newHandler: resizeHandler };
		}

		try {
			const rect = message.boundingBox;
			const { x, y, w, h } = rect;

			let anchorX = x;
			let anchorY = y;
			let newWidth = w;
			let newHeight = h;

			// Calculate new dimensions based on resize handle
			switch (resizeHandler) {
				case "se": // dragging bottom-right
					anchorX = x;
					anchorY = y;
					newWidth = Math.max(1, currentPos.x - x);
					newHeight = Math.max(1, currentPos.y - y);
					setCursor("se-resize");
					break;

				case "nw": // dragging top-left
					anchorX = x + w;
					anchorY = y + h;
					newWidth = Math.max(1, anchorX - currentPos.x);
					newHeight = Math.max(1, anchorY - currentPos.y);
					setCursor("nw-resize");
					break;

				case "ne": // dragging top-right
					anchorX = x;
					anchorY = y + h;
					newWidth = Math.max(1, currentPos.x - x);
					newHeight = Math.max(1, anchorY - currentPos.y);
					setCursor("ne-resize");
					break;

				case "sw": // dragging bottom-left
					anchorX = x + w;
					anchorY = y;
					newWidth = Math.max(1, anchorX - currentPos.x);
					newHeight = Math.max(1, currentPos.y - y);
					setCursor("sw-resize");
					break;

				case "n": // dragging top edge
					anchorX = x;
					anchorY = y + h;
					newWidth = w;
					newHeight = Math.max(1, anchorY - currentPos.y);
					setCursor("n-resize");
					break;

				case "s": // dragging bottom edge
					anchorX = x;
					anchorY = y;
					newWidth = w;
					newHeight = Math.max(1, currentPos.y - y);
					setCursor("s-resize");
					break;

				case "e": // dragging right edge
					anchorX = x;
					anchorY = y;
					newWidth = Math.max(1, currentPos.x - x);
					newHeight = h;
					setCursor("e-resize");
					break;

				case "w": // dragging left edge
					anchorX = x + w;
					anchorY = y;
					newWidth = Math.max(1, anchorX - currentPos.x);
					newHeight = h;
					setCursor("w-resize");
					break;

				default:
					return { newHandler: resizeHandler };
			}

			// Avoid divide-by-zero
			if (w === 0 || h === 0) return { newHandler: resizeHandler };

			const scaleX = newWidth / w;
			const scaleY = newHeight / h;

			// Scale all pencil points relative to anchor
			const newPoints = message.pencilPoints.map((p) => ({
				x: anchorX + (p.x - anchorX) * scaleX,
				y: anchorY + (p.y - anchorY) * scaleY,
			}));

			if (!PencilHelper.validatePencilPoints(newPoints)) {
				console.warn(
					"Invalid pencil points during resize, skipping update"
				);
				return { newHandler: resizeHandler };
			}

			const options = roughOptions(currentProps);
			const shapeData = PencilHelper.generateShapeData(
				this.generator,
				newPoints,
				options,
				message.shapeData.options.seed
			);

			const boundingBox = PencilHelper.calculateBoundingBox(newPoints);

			const newMessage: Message = {
				...message,
				pencilPoints: newPoints,
				shapeData,
				boundingBox,
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

			return { newHandler: resizeHandler };
		} catch (error) {
			console.error("Error during pencil resize:", error);
			return { newHandler: resizeHandler };
		}
	}

	/**
	 * Updates pencil properties when props change
	 * Replaces handlePencilPropsChange function with optimizations
	 */
	updateProperties(
		message: Message,
		currentProps: CommonPropsGame,
		setSelectedMessage: (msg: Message) => void
	): void {
		if (!message.pencilPoints || Array.isArray(message.shapeData)) return;

		try {
			const options = roughOptions(currentProps);
			const shapeData = PencilHelper.generateShapeData(
				this.generator,
				message.pencilPoints,
				options,
				message.shapeData.options.seed
			);

			const boundingBox = PencilHelper.calculateBoundingBox(
				message.pencilPoints
			);

			const newMessage: Message = {
				...message,
				shapeData,
				opacity: currentProps.opacity,
				boundingBox,
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
			console.error("Error during pencil properties update:", error);
		}
	}

	/**
	 * Clears internal caches (useful for memory management)
	 */
	clearCache(): void {
		this.shapeDataCache.clear();
		this.lastPreviewBoundingBox = null;
		this.lastPreviewSend = 0;
	}
}
