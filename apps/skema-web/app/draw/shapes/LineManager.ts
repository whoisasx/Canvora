import { RoughGenerator } from "roughjs/bin/generator";
import { RoughCanvas } from "roughjs/bin/canvas";
import { Message } from "../draw";
import { CommonPropsGame } from "@/utils/propsStore";
import { normalizeStroke, roughOptions } from "../render";
import { createLinePath } from "../render/line";
import { Handle } from "../assist";

// Type definitions
type Point = { x: number; y: number };

// Performance optimization constants
const THROTTLE_MS = 33; // Match main render throttle (~60fps)

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

	// Throttling for drag/resize operations
	private lastDragUpdate: number = 0;
	private lastResizeUpdate: number = 0;

	constructor(
		private ctx: CanvasRenderingContext2D,
		private rc: RoughCanvas,
		private generator: RoughGenerator,
		private socket: WebSocket | undefined,
		private theme: "light" | "dark",
		private roomId: string | undefined,
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

			this.socket &&
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
	 * Standardized drag method matching RectangleManager and PencilManager pattern
	 * Replaces handleLineDrag function with optimizations
	 */
	handleDragStandardized(
		message: Message,
		currentPos: Point,
		previousPos: Point,
		currentProps: CommonPropsGame,
		setSelectedMessage: (msg: Message) => void
	): void {
		if (!message.lineData || Array.isArray(message.shapeData)) return;

		try {
			const dx = currentPos.x - previousPos.x;
			const dy = currentPos.y - previousPos.y;

			const { x1, y1, x2, y2 } = message.lineData;
			const newLineData = {
				x1: x1 + dx,
				y1: y1 + dy,
				x2: x2 + dx,
				y2: y2 + dy,
			};

			const options = roughOptions(currentProps);
			const shapeData = LineHelper.generateShapeData(
				this.generator,
				newLineData.x1,
				newLineData.y1,
				newLineData.x2,
				newLineData.y2,
				options,
				message.shapeData.options.seed
			);

			const boundingBox = LineHelper.getBoundingBox(
				newLineData.x1,
				newLineData.y1,
				newLineData.x2,
				newLineData.y2
			);

			const newMessage: Message = {
				...message,
				shapeData,
				boundingBox,
				lineData: newLineData,
			};

			setSelectedMessage(newMessage);

			// Throttle socket messages during drag operations
			const now = Date.now();
			if (now - this.lastDragUpdate >= THROTTLE_MS) {
				this.lastDragUpdate = now;
				this.socket &&
					this.socket.send(
						JSON.stringify({
							type: "update-message",
							flag: "update-preview",
							id: newMessage.id,
							newMessage,
							roomId: this.roomId,
							clientId: this.clientId,
						})
					);
			}
		} catch (error) {
			console.error("Error during line drag:", error);
		}
	}

	/**
	 * Standardized resize method matching RectangleManager and PencilManager pattern
	 * Replaces handleLineResize function with enhanced logic
	 */
	handleResizeStandardized(
		message: Message,
		currentPos: Point,
		previousPos: Point,
		resizeHandler: Handle,
		currentProps: CommonPropsGame,
		setSelectedMessage: (msg: Message) => void,
		setCursor: (cursor: string) => void
	): { newHandler: Handle } {
		if (
			!message.lineData ||
			resizeHandler === "none" ||
			Array.isArray(message.shapeData)
		) {
			return { newHandler: resizeHandler };
		}

		try {
			const { x1, y1, x2, y2 } = message.lineData;
			let newLineData = { x1, y1, x2, y2 };

			// Handle line resize based on which endpoint is being dragged
			switch (resizeHandler) {
				case "nw": // dragging start point
					newLineData = {
						x1: currentPos.x,
						y1: currentPos.y,
						x2,
						y2,
					};
					setCursor("nw-resize");
					break;
				case "se": // dragging end point
					newLineData = {
						x1,
						y1,
						x2: currentPos.x,
						y2: currentPos.y,
					};
					setCursor("se-resize");
					break;
				default:
					return { newHandler: resizeHandler };
			}

			const options = roughOptions(currentProps);
			const shapeData = LineHelper.generateShapeData(
				this.generator,
				newLineData.x1,
				newLineData.y1,
				newLineData.x2,
				newLineData.y2,
				options,
				message.shapeData.options.seed
			);

			const boundingBox = LineHelper.getBoundingBox(
				newLineData.x1,
				newLineData.y1,
				newLineData.x2,
				newLineData.y2
			);

			const newMessage: Message = {
				...message,
				shapeData,
				boundingBox,
				lineData: newLineData,
			};

			setSelectedMessage(newMessage);

			// Throttle socket messages during resize operations
			const now = Date.now();
			if (now - this.lastResizeUpdate >= THROTTLE_MS) {
				this.lastResizeUpdate = now;
				this.socket &&
					this.socket.send(
						JSON.stringify({
							type: "update-message",
							flag: "update-preview",
							id: newMessage.id,
							newMessage,
							roomId: this.roomId,
							clientId: this.clientId,
						})
					);
			}

			return { newHandler: resizeHandler };
		} catch (error) {
			console.error("Error during line resize:", error);
			return { newHandler: resizeHandler };
		}
	}

	/**
	 * Standardized properties update method matching RectangleManager and PencilManager pattern
	 * Replaces handleLinePropsChange function with optimizations
	 */
	updatePropertiesStandardized(
		message: Message,
		currentProps: CommonPropsGame,
		setSelectedMessage: (msg: Message) => void
	): Message | void {
		if (!message.lineData || Array.isArray(message.shapeData)) return;

		try {
			const options = roughOptions(currentProps);
			const shapeData = LineHelper.generateShapeData(
				this.generator,
				message.lineData.x1,
				message.lineData.y1,
				message.lineData.x2,
				message.lineData.y2,
				options,
				message.shapeData.options.seed
			);

			const boundingBox = LineHelper.getBoundingBox(
				message.lineData.x1,
				message.lineData.y1,
				message.lineData.x2,
				message.lineData.y2
			);

			const newMessage: Message = {
				...message,
				shapeData,
				opacity: currentProps.opacity,
				boundingBox,
			};

			setSelectedMessage(newMessage);
			if (!this.socket && !this.roomId) {
				return newMessage;
			}
			this.socket &&
				this.socket.send(
					JSON.stringify({
						type: "update-message",
						id: newMessage.id,
						newMessage,
						roomId: this.roomId,
						clientId: this.clientId,
					})
				);
		} catch (error) {
			console.error("Error during line properties update:", error);
		}
	}

	/**
	 * Updates the manager when theme changes
	 */
	updateTheme(theme: "light" | "dark"): void {
		this.theme = theme;
	}

	/**
	 * Updates the manager when user changes
	 */
	updateUser(clientId: string): void {
		this.clientId = clientId;
	}
}
