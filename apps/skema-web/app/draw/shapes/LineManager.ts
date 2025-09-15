import { RoughGenerator } from "roughjs/bin/generator";
import { RoughCanvas } from "roughjs/bin/canvas";
import { Message } from "../draw";
import { CommonPropsGame } from "@/utils/propsStore";
import { normalizeStroke, roughOptions } from "../render";
import { createLinePath } from "../render/line";

// Performance optimization constants
const THROTTLE_MS = 100;

/**
 * Helper class for line-specific utility functions
 * Separates core logic from management concerns
 */
export class LineHelper {
	/**
	 * Generates rough.js shape data for a line
	 */
	static generateShapeData(
		generator: RoughGenerator,
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		options: any,
		seed?: number
	) {
		const path = createLinePath(x1, y1, x2, y2);
		return generator.path(path, {
			...options,
			...(seed !== undefined && { seed }),
		});
	}

	/**
	 * Calculates normalized bounding box for a line
	 */
	static getBoundingBox(x1: number, y1: number, x2: number, y2: number) {
		return {
			x: Math.min(x1, x2),
			y: Math.min(y1, y2),
			w: Math.abs(x2 - x1),
			h: Math.abs(y2 - y1),
		};
	}

	/**
	 * Determines resize handle position for line endpoints
	 */
	static getResizeHandle(
		x: number,
		y: number,
		lineData: { x1: number; y1: number; x2: number; y2: number }
	): "start" | "end" | "none" {
		const threshold = 10; // Hit detection threshold

		const distToStart = Math.sqrt(
			Math.pow(x - lineData.x1, 2) + Math.pow(y - lineData.y1, 2)
		);
		const distToEnd = Math.sqrt(
			Math.pow(x - lineData.x2, 2) + Math.pow(y - lineData.y2, 2)
		);

		if (distToStart <= threshold) return "start";
		if (distToEnd <= threshold) return "end";
		return "none";
	}
}

/**
 * LineManager class - Manages all line operations with performance optimizations
 * Follows the exact same pattern as RectangleManager, RhombusManager, EllipseManager
 */
export class LineManager {
	// Performance optimization properties
	private lastPreviewLineData: {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	} | null = null;
	private lastPreviewSend: number = 0;

	constructor(
		private ctx: CanvasRenderingContext2D,
		private rc: RoughCanvas,
		private generator: RoughGenerator,
		private socket: WebSocket,
		private theme: "light" | "dark",
		private roomId: string,
		private clientId: string
	) {}

	/**
	 * Creates a line message object for final shape creation
	 * Replaces messageLine function with enhanced error handling
	 */
	createMessage(
		startX: number,
		startY: number,
		w: number,
		h: number,
		props: CommonPropsGame,
		seed?: number
	): Message {
		try {
			const x2 = startX + w;
			const y2 = startY + h;

			const options = roughOptions(props);

			const shapeData = LineHelper.generateShapeData(
				this.generator,
				startX,
				startY,
				x2,
				y2,
				options,
				seed
			);

			const lineData = {
				x1: startX,
				y1: startY,
				x2: x2,
				y2: y2,
			};

			const boundingBox = LineHelper.getBoundingBox(
				startX,
				startY,
				x2,
				y2
			);

			return {
				id: crypto.randomUUID(),
				shape: "line",
				shapeData,
				opacity: props.opacity,
				edges: props.edges,
				lineData,
				boundingBox,
			};
		} catch (error) {
			console.error("Error creating line message:", error);
			throw error;
		}
	}

	/**
	 * Renders a line message to the canvas
	 * Replaces drawLine function with enhanced error handling
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
			console.error("Error rendering line:", error);
			this.ctx.restore();
		}
	}

	/**
	 * Renders a preview line during drawing
	 * Replaces drawMovingLine function with throttling and performance optimizations
	 */
	renderPreview(
		startX: number,
		startY: number,
		w: number,
		h: number,
		props: CommonPropsGame,
		previewId: string,
		seed: number
	): void {
		try {
			const x2 = startX + w;
			const y2 = startY + h;

			// Performance optimization: throttle preview updates
			const now = Date.now();
			const currentLineData = { x1: startX, y1: startY, x2, y2 };

			if (
				this.lastPreviewLineData &&
				this.lastPreviewLineData.x1 === currentLineData.x1 &&
				this.lastPreviewLineData.y1 === currentLineData.y1 &&
				this.lastPreviewLineData.x2 === currentLineData.x2 &&
				this.lastPreviewLineData.y2 === currentLineData.y2 &&
				now - this.lastPreviewSend < THROTTLE_MS
			) {
				return;
			}

			this.lastPreviewSend = now;
			this.lastPreviewLineData = currentLineData;

			// Render locally first
			this.ctx.save();
			this.ctx.globalAlpha = props.opacity ?? 1;

			const options = roughOptions(props);

			const shapeData = LineHelper.generateShapeData(
				this.generator,
				startX,
				startY,
				x2,
				y2,
				options,
				seed
			);

			this.rc.draw(shapeData);
			this.ctx.restore();

			// Send preview to other clients
			const previewMessage = this.createMessage(
				startX,
				startY,
				w,
				h,
				props,
				seed
			);
			previewMessage.id = previewId;

			this.socket.send(
				JSON.stringify({
					type: "preview",
					roomId: this.roomId,
					clientId: this.clientId,
					message: previewMessage,
				})
			);
		} catch (error) {
			console.error("Error rendering line preview:", error);
			this.ctx.restore();
		}
	}

	/**
	 * Handles dragging of an entire line
	 * Performance optimized with throttling
	 */
	handleDrag(
		message: Message,
		deltaX: number,
		deltaY: number,
		clientX: number,
		clientY: number
	): void {
		try {
			if (!message.lineData) return;

			const newX1 = message.lineData.x1 + deltaX;
			const newY1 = message.lineData.y1 + deltaY;
			const newX2 = message.lineData.x2 + deltaX;
			const newY2 = message.lineData.y2 + deltaY;

			// Update line data
			const updatedLineData = {
				x1: newX1,
				y1: newY1,
				x2: newX2,
				y2: newY2,
			};

			this.socket.send(
				JSON.stringify({
					type: "update",
					roomId: this.roomId,
					clientId: this.clientId,
					messageId: message.id,
					updateData: { lineData: updatedLineData },
				})
			);
		} catch (error) {
			console.error("Error handling line drag:", error);
		}
	}

	/**
	 * Handles resizing of line endpoints
	 */
	handleResize(
		message: Message,
		newX: number,
		newY: number,
		handle: string
	): void {
		try {
			if (!message.lineData) return;

			let updateData: any = {};

			if (handle === "start") {
				updateData = {
					lineData: {
						...message.lineData,
						x1: newX,
						y1: newY,
					},
				};
			} else if (handle === "end") {
				updateData = {
					lineData: {
						...message.lineData,
						x2: newX,
						y2: newY,
					},
				};
			}

			// Regenerate shapeData with new coordinates using existing options
			const updatedLineData = updateData.lineData;
			const existingOptions = Array.isArray(message.shapeData)
				? {}
				: message.shapeData.options;

			const newShapeData = LineHelper.generateShapeData(
				this.generator,
				updatedLineData.x1,
				updatedLineData.y1,
				updatedLineData.x2,
				updatedLineData.y2,
				existingOptions
			);

			updateData.shapeData = newShapeData;
			updateData.boundingBox = LineHelper.getBoundingBox(
				updatedLineData.x1,
				updatedLineData.y1,
				updatedLineData.x2,
				updatedLineData.y2
			);

			this.socket.send(
				JSON.stringify({
					type: "update",
					roomId: this.roomId,
					clientId: this.clientId,
					messageId: message.id,
					updateData,
				})
			);
		} catch (error) {
			console.error("Error handling line resize:", error);
		}
	}

	/**
	 * Updates line properties (stroke, opacity, etc.)
	 */
	updateProperties(
		message: Message,
		newProps: Partial<CommonPropsGame>
	): void {
		try {
			if (!message.lineData) return;

			const options = roughOptions(newProps);

			const newShapeData = LineHelper.generateShapeData(
				this.generator,
				message.lineData.x1,
				message.lineData.y1,
				message.lineData.x2,
				message.lineData.y2,
				options
			);

			this.socket.send(
				JSON.stringify({
					type: "update",
					roomId: this.roomId,
					clientId: this.clientId,
					messageId: message.id,
					updateData: {
						...newProps,
						shapeData: newShapeData,
					},
				})
			);
		} catch (error) {
			console.error("Error updating line properties:", error);
		}
	}
}
