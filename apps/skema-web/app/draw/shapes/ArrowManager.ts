import { RoughGenerator } from "roughjs/bin/generator";
import { RoughCanvas } from "roughjs/bin/canvas";
import { Message } from "../draw";
import { CommonPropsGame } from "@/utils/propsStore";
import { normalizeStroke, roughOptions, normalizeCoords } from "../render";
import { createArrowPath } from "../render/arrow";
import { Drawable } from "roughjs/bin/core";
import { frontArrow, backArrow, arrowType } from "../types";
import { Handle } from "../assist";

// Type definitions
type Point = { x: number; y: number };

// Performance optimization constants
const THROTTLE_MS = 33; // Match main render throttle (~60fps)

/**
 * Helper class for arrow-specific utility functions
 * Separates core logic from management concerns
 */
export class ArrowHelper {
	/**
	 * Generates rough.js shape data for an arrow (line + arrowheads)
	 */
	static generateShapeData(
		generator: RoughGenerator,
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		options: any,
		front: frontArrow,
		back: backArrow,
		arrowType: arrowType,
		seed?: number
	): Drawable[] {
		const { linePath, frontHeadPath, backHeadPath } = createArrowPath(
			x1,
			y1,
			x2,
			y2,
			front,
			back,
			arrowType
		);

		const shapeData: Drawable[] = [];

		if (linePath) {
			const lineDrawable = generator.path(linePath, {
				...options,
				seed: seed ?? Math.floor(Math.random() * 1000000),
			});
			shapeData.push(lineDrawable);
		}

		if (frontHeadPath) {
			const frontHeadDrawable = generator.path(frontHeadPath, {
				...options,
				fill: front === "triangle" ? options.stroke : undefined,
				fillStyle: front === "triangle" ? "solid" : undefined,
				seed: seed ?? Math.floor(Math.random() * 1000000),
			});
			shapeData.push(frontHeadDrawable);
		}

		if (backHeadPath) {
			const backHeadDrawable = generator.path(backHeadPath, {
				...options,
				fill: back === "triangle" ? options.stroke : undefined,
				fillStyle: back === "triangle" ? "solid" : undefined,
				seed: seed ?? Math.floor(Math.random() * 1000000),
			});
			shapeData.push(backHeadDrawable);
		}

		return shapeData;
	}

	/**
	 * Calculates normalized bounding box for an arrow
	 */
	static getBoundingBox(x1: number, y1: number, x2: number, y2: number) {
		return normalizeCoords(x1, y1, x2 - x1, y2 - y1);
	}

	/**
	 * Determines resize handle position for arrow endpoints
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
 * ArrowManager class - Manages all arrow operations with performance optimizations
 * Follows the exact same pattern as RectangleManager, RhombusManager, EllipseManager
 */
export class ArrowManager {
	// Performance optimization properties
	private lastPreviewArrowData: {
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
		private socket: WebSocket,
		private theme: "light" | "dark",
		private roomId: string,
		private clientId: string
	) {}

	/**
	 * Creates an arrow message object for final shape creation
	 * Replaces messageArrow function with enhanced error handling
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
			const rect = normalizeCoords(startX, startY, w, h);

			const front = props.arrowHead!.front!;
			const back = props.arrowHead!.back!;
			const arrowType = props.arrowType!;

			const shapeData = ArrowHelper.generateShapeData(
				this.generator,
				startX,
				startY,
				x2,
				y2,
				options,
				front,
				back,
				arrowType,
				seed
			);

			const lineData = {
				x1: startX,
				y1: startY,
				x2: x2,
				y2: y2,
			};

			return {
				id: crypto.randomUUID(),
				shape: "arrow",
				shapeData,
				opacity: props.opacity,
				arrowHead: props.arrowHead,
				arrowType: props.arrowType,
				boundingBox: rect,
				lineData,
			};
		} catch (error) {
			console.error("Error creating arrow message:", error);
			throw error;
		}
	}

	/**
	 * Renders an arrow message to the canvas
	 * Replaces drawArrow function with enhanced error handling
	 */
	render(message: Message): void {
		if (!this.rc || !Array.isArray(message.shapeData)) return;

		try {
			this.ctx.save();
			this.ctx.globalAlpha = message.opacity ?? 1;
			this.ctx.lineJoin = "round";
			this.ctx.lineCap = "round";

			// Render each part of the arrow (line + arrowheads)
			for (const drawable of message.shapeData) {
				// Clone to avoid mutating original
				const shapeData = { ...drawable };
				shapeData.options = { ...shapeData.options };
				shapeData.options.stroke = normalizeStroke(
					this.theme,
					shapeData.options.stroke
				);

				this.rc.draw(shapeData);
			}

			this.ctx.restore();
		} catch (error) {
			console.error("Error rendering arrow:", error);
			this.ctx.restore();
		}
	}

	/**
	 * Renders a preview arrow during drawing
	 * Replaces drawMovingArrow function with throttling and performance optimizations
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
			const currentArrowData = { x1: startX, y1: startY, x2, y2 };

			this.lastPreviewSend = now;
			this.lastPreviewArrowData = currentArrowData;

			// Render locally first
			this.ctx.save();
			this.ctx.globalAlpha = props.opacity ?? 1;

			const options = roughOptions(props);
			const front = props.arrowHead!.front!;
			const back = props.arrowHead!.back!;
			const arrowType = props.arrowType!;

			const shapeData = ArrowHelper.generateShapeData(
				this.generator,
				startX,
				startY,
				x2,
				y2,
				options,
				front,
				back,
				arrowType,
				seed
			);

			// Render each part locally
			for (const drawable of shapeData) {
				this.rc.draw(drawable);
			}

			this.ctx.restore();

			if (
				this.lastPreviewArrowData &&
				this.lastPreviewArrowData.x1 === currentArrowData.x1 &&
				this.lastPreviewArrowData.y1 === currentArrowData.y1 &&
				this.lastPreviewArrowData.x2 === currentArrowData.x2 &&
				this.lastPreviewArrowData.y2 === currentArrowData.y2 &&
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

			this.socket.send(
				JSON.stringify({
					type: "preview",
					roomId: this.roomId,
					clientId: this.clientId,
					message: previewMessage,
				})
			);
		} catch (error) {
			console.error("Error rendering arrow preview:", error);
			this.ctx.restore();
		}
	}

	/**
	 * Handles dragging of an entire arrow
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

			// Update line data and bounding box
			const updatedLineData = {
				x1: newX1,
				y1: newY1,
				x2: newX2,
				y2: newY2,
			};

			const newBoundingBox = ArrowHelper.getBoundingBox(
				newX1,
				newY1,
				newX2,
				newY2
			);

			this.socket.send(
				JSON.stringify({
					type: "update",
					roomId: this.roomId,
					clientId: this.clientId,
					messageId: message.id,
					updateData: {
						lineData: updatedLineData,
						boundingBox: newBoundingBox,
					},
				})
			);
		} catch (error) {
			console.error("Error handling arrow drag:", error);
		}
	}

	/**
	 * Handles resizing of arrow endpoints
	 */
	handleResize(
		message: Message,
		newX: number,
		newY: number,
		handle: string
	): void {
		try {
			if (!message.lineData || !Array.isArray(message.shapeData)) return;

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
			const existingOptions = message.shapeData[0]?.options || {};

			const front = message.arrowHead?.front || "none";
			const back = message.arrowHead?.back || "none";
			const arrowType = message.arrowType || "sharp";

			const newShapeData = ArrowHelper.generateShapeData(
				this.generator,
				updatedLineData.x1,
				updatedLineData.y1,
				updatedLineData.x2,
				updatedLineData.y2,
				existingOptions,
				front,
				back,
				arrowType
			);

			updateData.shapeData = newShapeData;
			updateData.boundingBox = ArrowHelper.getBoundingBox(
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
			console.error("Error handling arrow resize:", error);
		}
	}

	/**
	 * Updates arrow properties (stroke, opacity, arrowheads, etc.)
	 */
	updateProperties(
		message: Message,
		newProps: Partial<CommonPropsGame>
	): void {
		try {
			if (!message.lineData) return;

			const options = roughOptions(newProps);
			const front =
				newProps.arrowHead?.front || message.arrowHead?.front || "none";
			const back =
				newProps.arrowHead?.back || message.arrowHead?.back || "none";
			const arrowType =
				newProps.arrowType || message.arrowType || "sharp";

			const newShapeData = ArrowHelper.generateShapeData(
				this.generator,
				message.lineData.x1,
				message.lineData.y1,
				message.lineData.x2,
				message.lineData.y2,
				options,
				front,
				back,
				arrowType
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
			console.error("Error updating arrow properties:", error);
		}
	}

	/**
	 * Standardized drag method matching RectangleManager and PencilManager pattern
	 * Replaces handleArrowDrag function with optimizations
	 */
	handleDragStandardized(
		message: Message,
		currentPos: Point,
		previousPos: Point,
		currentProps: CommonPropsGame,
		setSelectedMessage: (msg: Message) => void
	): void {
		if (!message.lineData || !Array.isArray(message.shapeData)) return;

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
			const front =
				message.arrowHead?.front ||
				currentProps.arrowHead?.front ||
				"none";
			const back =
				message.arrowHead?.back ||
				currentProps.arrowHead?.back ||
				"none";
			const arrowType =
				message.arrowType || currentProps.arrowType || "sharp";

			const shapeData = ArrowHelper.generateShapeData(
				this.generator,
				newLineData.x1,
				newLineData.y1,
				newLineData.x2,
				newLineData.y2,
				options,
				front,
				back,
				arrowType,
				message.shapeData[0]?.options.seed
			);

			const boundingBox = ArrowHelper.getBoundingBox(
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
			console.error("Error during arrow drag:", error);
		}
	}

	/**
	 * Standardized resize method matching RectangleManager and PencilManager pattern
	 * Replaces handleArrowResize function with enhanced logic
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
			!Array.isArray(message.shapeData)
		) {
			return { newHandler: resizeHandler };
		}

		try {
			const { x1, y1, x2, y2 } = message.lineData;
			let newLineData = { x1, y1, x2, y2 };

			// Handle arrow resize based on which endpoint is being dragged
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
			const front =
				message.arrowHead?.front ||
				currentProps.arrowHead?.front ||
				"none";
			const back =
				message.arrowHead?.back ||
				currentProps.arrowHead?.back ||
				"none";
			const arrowType =
				message.arrowType || currentProps.arrowType || "sharp";

			const shapeData = ArrowHelper.generateShapeData(
				this.generator,
				newLineData.x1,
				newLineData.y1,
				newLineData.x2,
				newLineData.y2,
				options,
				front,
				back,
				arrowType,
				message.shapeData[0]?.options.seed
			);

			const boundingBox = ArrowHelper.getBoundingBox(
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
			console.error("Error during arrow resize:", error);
			return { newHandler: resizeHandler };
		}
	}

	/**
	 * Standardized properties update method matching RectangleManager and PencilManager pattern
	 * Replaces handleArrowPropsChange function with optimizations
	 */
	updatePropertiesStandardized(
		message: Message,
		currentProps: CommonPropsGame,
		setSelectedMessage: (msg: Message) => void
	): void {
		if (!message.lineData || !Array.isArray(message.shapeData)) return;

		try {
			const options = roughOptions(currentProps);
			const front =
				currentProps.arrowHead?.front ||
				message.arrowHead?.front ||
				"none";
			const back =
				currentProps.arrowHead?.back ||
				message.arrowHead?.back ||
				"none";
			const arrowType =
				currentProps.arrowType || message.arrowType || "sharp";

			const shapeData = ArrowHelper.generateShapeData(
				this.generator,
				message.lineData.x1,
				message.lineData.y1,
				message.lineData.x2,
				message.lineData.y2,
				options,
				front,
				back,
				arrowType,
				message.shapeData[0]?.options.seed
			);

			const boundingBox = ArrowHelper.getBoundingBox(
				message.lineData.x1,
				message.lineData.y1,
				message.lineData.x2,
				message.lineData.y2
			);

			const newMessage: Message = {
				...message,
				shapeData,
				opacity: currentProps.opacity,
				arrowType,
				arrowHead: {
					front,
					back,
				},
				boundingBox,
			};

			setSelectedMessage(newMessage);
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
			console.error("Error during arrow properties update:", error);
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
