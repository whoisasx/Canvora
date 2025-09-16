import { Tool, CommonProps, edges } from "../types";
import { CommonPropsGame } from "@/utils/propsStore";
import { Message, ITextData } from "../draw";
import { normalizeStroke } from "../render";
import { Drawable } from "roughjs/bin/core";
import { v4 as uuidv4 } from "uuid";
import {
	mononoki,
	excali,
	firaCode,
	ibm,
	comic,
	monospace,
	nunito,
} from "@/app/font";

// Type definitions
type BoundingBox = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };
type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "none";

// Constants
const MIN_SIZE = 16;
const MAX_DIMENSION = 5000;
const DEFAULT_FONT_SIZE = 16;
const LINE_HEIGHT_MULTIPLIER = 1.5;
const HORIZONTAL_PADDING = 16; // 8px each side
const VERTICAL_PADDING = 8;
// Performance optimization constants
const THROTTLE_MS = 50; // Render throttle (~30fps)

export class TextHelper {
	/**
	 * Font family cache for better performance
	 */
	private static fontFamilyCache = new Map<string, string>([
		["mononoki", mononoki.style.fontFamily],
		["excali", excali.style.fontFamily],
		["firaCode", firaCode.style.fontFamily],
		["ibm", ibm.style.fontFamily],
		["comic", comic.style.fontFamily],
		["monospace", monospace.style.fontFamily],
		["nunito", nunito.style.fontFamily],
	]);

	/**
	 * Gets the font family string for the given font name
	 */
	static getFontFamily(fontFamily: string): string {
		return this.fontFamilyCache.get(fontFamily) || "Arial, sans-serif";
	}

	/**
	 * Validates text dimensions and data
	 */
	static validateText(
		boundingBox: BoundingBox,
		textData?: ITextData
	): boolean {
		if (!textData || !textData.text) {
			return false;
		}

		return (
			boundingBox.w > 0 &&
			boundingBox.h > 0 &&
			boundingBox.w < MAX_DIMENSION &&
			boundingBox.h < MAX_DIMENSION &&
			!isNaN(boundingBox.x) &&
			!isNaN(boundingBox.y) &&
			!isNaN(boundingBox.w) &&
			!isNaN(boundingBox.h)
		);
	}

	/**
	 * Constrains text to valid dimensions
	 */
	static constrainText(boundingBox: BoundingBox): BoundingBox {
		return {
			x: boundingBox.x,
			y: boundingBox.y,
			w: Math.max(MIN_SIZE, Math.min(boundingBox.w, MAX_DIMENSION)),
			h: Math.max(MIN_SIZE, Math.min(boundingBox.h, MAX_DIMENSION)),
		};
	}

	/**
	 * Calculates text X position based on alignment
	 */
	static calculateTextX(
		x: number,
		bboxW: number,
		leftPaddingWorld: number,
		textAlign: string
	): number {
		switch (textAlign) {
			case "center":
				return x + bboxW / 2;
			case "right":
				return x + bboxW - leftPaddingWorld;
			default:
				return x + leftPaddingWorld;
		}
	}

	/**
	 * Measures text dimensions
	 */
	static measureTextDimensions(
		ctx: CanvasRenderingContext2D,
		text: string,
		fontSize: number,
		fontFamily: string,
		scale: number
	): { width: number; height: number } {
		const lines = text ? text.split("\n") : [""];
		const lineHeight = fontSize * LINE_HEIGHT_MULTIPLIER;
		const estimatedHeight = Math.max(lines.length * lineHeight, fontSize);

		ctx.save();
		ctx.font = `${fontSize}px ${this.getFontFamily(fontFamily)}`;

		let maxLineWidth = 0;
		for (const line of lines) {
			const w = ctx.measureText(line || " ").width;
			if (w > maxLineWidth) maxLineWidth = w;
		}
		ctx.restore();

		// Convert to world units
		const horizontalPaddingWorld = HORIZONTAL_PADDING / scale;
		const textWidthWorld = maxLineWidth / scale;
		const estimatedWidth = Math.max(
			textWidthWorld + horizontalPaddingWorld,
			fontSize
		);

		return {
			width: estimatedWidth,
			height: estimatedHeight,
		};
	}
}

export class TextManager {
	// Throttling for drag/resize operations
	private lastDragUpdate: number = 0;
	private lastResizeUpdate: number = 0;

	// Preview state management
	private lastPreviewSend: number = 0;
	private lastPreviewRect: {
		x: number;
		y: number;
		w: number;
		h: number;
	} | null = null;

	constructor(
		private ctx: CanvasRenderingContext2D,
		private socket: WebSocket,
		private theme: "light" | "dark",
		private roomId: string,
		private userId: string,
		private scale: number = 1
	) {}

	/**
	 * Renders text on the canvas
	 */
	render(message: Message): void {
		if (!message.textData) return;

		try {
			// Cache font setup to avoid repeated context changes
			this.ctx.save();

			// Set all properties at once
			const fontFamily = TextHelper.getFontFamily(
				message.textData.fontFamily
			);
			this.ctx.font = `${message.textData.fontSize} ${fontFamily}`;
			this.ctx.textBaseline = "top";
			this.ctx.textAlign = (message.textData.textAlign ||
				"left") as CanvasTextAlign;
			this.ctx.fillStyle = normalizeStroke(
				this.theme,
				message.textData.textColor
			);
			this.ctx.globalAlpha = message.opacity ?? 1;

			// Calculate all positions before drawing
			const lines = message.textData.text.includes("\n")
				? message.textData.text.split("\n")
				: [message.textData.text];

			const x = message.textData.pos.x;
			const y = message.textData.pos.y;
			const topPaddingWorld = VERTICAL_PADDING / this.scale;
			const leftPaddingWorld = VERTICAL_PADDING / this.scale;
			const fontSizeNum = parseInt(message.textData.fontSize);
			const lineHeight = fontSizeNum * LINE_HEIGHT_MULTIPLIER;
			const bboxW = message.boundingBox.w;

			// Draw all lines in one pass
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i] || "";
				const drawX = TextHelper.calculateTextX(
					x,
					bboxW,
					leftPaddingWorld,
					message.textData.textAlign
				);
				this.ctx.fillText(
					line,
					drawX,
					y + topPaddingWorld + i * lineHeight
				);
			}

			this.ctx.restore();
		} catch (error) {
			console.error("Error rendering text:", error);
			this.ctx.restore();
		}
	}

	/**
	 * Handles dragging/moving an existing text
	 */
	handleDrag(
		message: Message,
		currentPos: Point,
		previousPos: Point,
		setSelectedMessage: (msg: Message) => void
	): void {
		if (!message.boundingBox) return;

		try {
			const dx = currentPos.x - previousPos.x;
			const dy = currentPos.y - previousPos.y;

			const rect = {
				...message.boundingBox,
				x: message.boundingBox.x + dx,
				y: message.boundingBox.y + dy,
			};

			// Also translate text position so the visible text moves with the box
			const newTextData = message.textData
				? {
						...message.textData,
						pos: {
							x: message.textData.pos.x + dx,
							y: message.textData.pos.y + dy,
						},
					}
				: undefined;

			if (!TextHelper.validateText(rect, newTextData)) {
				console.warn("Invalid text during drag, skipping update");
				return;
			}

			const newMessage: Message = {
				...message,
				boundingBox: rect,
				textData: newTextData,
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
						clientId: this.userId,
					})
				);
			}
		} catch (error) {
			console.error("Error during text drag:", error);
		}
	}

	/**
	 * Handles resizing text from corner handles only
	 */
	handleResize(
		message: Message,
		currentPos: Point,
		resizeHandler: Handle,
		setSelectedMessage: (msg: Message) => void,
		updateCursor: (cursor: string) => void
	): { newHandler: Handle } {
		if (
			!message.boundingBox ||
			!message.textData ||
			resizeHandler === "none"
		) {
			return { newHandler: resizeHandler };
		}

		try {
			const { x, y, w, h } = message.boundingBox;
			let newRect = { x, y, w, h };

			// Only support corner resize for text (not side handles)
			switch (resizeHandler) {
				case "se": // bottom-right
					newRect = {
						x,
						y,
						w: currentPos.x - x,
						h: currentPos.y - y,
					};
					break;
				case "sw": // bottom-left
					newRect = {
						x: currentPos.x,
						y,
						w: w + (x - currentPos.x),
						h: currentPos.y - y,
					};
					break;
				case "ne": // top-right
					newRect = {
						x,
						y: currentPos.y,
						w: currentPos.x - x,
						h: h + (y - currentPos.y),
					};
					break;
				case "nw": // top-left
					newRect = {
						x: currentPos.x,
						y: currentPos.y,
						w: w + (x - currentPos.x),
						h: h + (y - currentPos.y),
					};
					break;
				default:
					// Ignore side handles for text
					return { newHandler: resizeHandler };
			}

			// Prevent flip (negative dimensions)
			if (newRect.w <= 0 || newRect.h <= 0) {
				return { newHandler: resizeHandler };
			}

			// Uniform scaling based on width and height
			const scaleX = w === 0 ? 1 : newRect.w / w;
			const scaleY = h === 0 ? 1 : newRect.h / h;
			const scale = Math.min(scaleX, scaleY); // uniform scale

			// Scale font size
			const oldFont = message.textData?.fontSize ?? "16px";
			const oldFontNum = parseFloat(oldFont);
			const newFontSizeNum = Math.max(16, oldFontNum * scale); // clamp >= 16px
			const newFontSize = `${newFontSizeNum}px`;

			// Adjust position if origin moved
			const deltaX = newRect.x - x;
			const deltaY = newRect.y - y;
			const newTextPos = {
				...message.textData.pos,
				x: message.textData.pos.x + deltaX,
				y: message.textData.pos.y + deltaY,
			};

			const constrainedRect = TextHelper.constrainText(newRect);

			const newMessage: Message = {
				...message,
				boundingBox: constrainedRect,
				textData: {
					...message.textData,
					fontSize: newFontSize,
					pos: newTextPos,
				},
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
						clientId: this.userId,
					})
				);
			}

			return { newHandler: resizeHandler };
		} catch (error) {
			console.error("Error during text resize:", error);
			return { newHandler: resizeHandler };
		}
	}

	/**
	 * Updates text appearance when properties change
	 */
	updateProperties(
		message: Message,
		newProps: CommonPropsGame,
		setSelectedMessage: (msg: Message) => void
	): void {
		if (!message.boundingBox || !message.textData) return;

		try {
			// Ensure fontSize uses px like drawText/handleTextInput
			const fontSizePx = `${newProps.fontSize}px`;

			// Measure new text dimensions
			const dimensions = TextHelper.measureTextDimensions(
				this.ctx,
				message.textData.text,
				newProps.fontSize!,
				newProps.fontFamily!,
				this.scale
			);

			// Update bounding box to fit new text dimensions
			const newBoundingBox = {
				...message.boundingBox,
				w: dimensions.width,
				h: dimensions.height,
			};

			const newMessage: Message = {
				...message,
				opacity: newProps.opacity,
				textData: {
					...message.textData,
					fontSize: fontSizePx,
					fontFamily: newProps.fontFamily!,
					textColor: newProps.stroke!,
					textAlign: newProps.textAlign!,
				},
				boundingBox: newBoundingBox,
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
			console.error("Error updating text properties:", error);
		}
	}

	/**
	 * Updates the scale for proper dimension calculations
	 */
	updateScale(scale: number): void {
		this.scale = scale;
	}

	/**
	 * Creates and sends final text message when user finishes typing
	 */
	createTextMessage(
		textValue: string,
		pos: Point,
		width: number,
		height: number,
		props: CommonPropsGame,
		previewId: string,
		onCleanup: () => void
	): boolean {
		const text = textValue.trim();

		// If no text, just cleanup and return false
		if (!text) {
			onCleanup();
			return false;
		}

		const tempValue = textValue.trim();
		const totalLines = tempValue.split("\n").length;

		// Convert measurements taken in screen pixels back to world coordinates
		const bboxWidthWorld = width / this.scale;
		const bboxHeightWorld = Math.max(
			(height || totalLines * props.fontSize! * this.scale) / this.scale,
			props.fontSize!
		);

		const dummyShapeData = { options: {} } as unknown as Drawable;

		const message: Message = {
			id: uuidv4(),
			shape: "text" as Tool,
			shapeData: dummyShapeData,
			opacity: props.opacity,
			textData: {
				text,
				fontFamily: props.fontFamily!,
				fontSize: `${props.fontSize}px`,
				textColor: props.stroke!,
				textAlign: props.textAlign!,
				pos,
			},
			boundingBox: {
				x: pos.x,
				y: pos.y,
				w: bboxWidthWorld,
				h: bboxHeightWorld,
			},
		};

		// Include previewId so server can clear previews for other clients
		this.socket.send(
			JSON.stringify({
				type: "create-message",
				message,
				previewId: previewId,
				roomId: this.roomId,
				clientId: this.userId,
			})
		);

		// Call cleanup callback
		onCleanup();
		return true;
	}

	/**
	 * Sends text preview to other clients during typing
	 */
	sendTextPreview(
		textValue: string,
		pos: Point,
		width: number,
		height: number,
		props: CommonPropsGame,
		previewId: string
	): void {
		// Convert measured dimensions back to world coords
		const tempValue = textValue;
		const totalLines = (tempValue || "").split("\n").length;

		const bboxWidthWorld = width / this.scale;
		const bboxHeightWorld = Math.max(
			(height || totalLines * props.fontSize! * this.scale) / this.scale,
			props.fontSize!
		);

		const rect = {
			x: pos.x,
			y: pos.y,
			w: bboxWidthWorld,
			h: bboxHeightWorld,
		};

		// Throttle & skip identical rects
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
		this.lastPreviewSend = now;
		this.lastPreviewRect = {
			x: rect.x,
			y: rect.y,
			w: rect.w,
			h: rect.h,
		};

		// Lightweight dummy for shapeData
		const dummyShapeData = { options: {} } as unknown as Drawable;

		const message: Message = {
			id: previewId,
			shape: "text" as Tool,
			shapeData: dummyShapeData,
			opacity: props.opacity,
			textData: {
				text: textValue,
				fontFamily: props.fontFamily!,
				fontSize: `${props.fontSize}px`,
				textColor: props.stroke!,
				textAlign: props.textAlign!,
				pos,
			},
			boundingBox: rect,
		};

		// NOTE: do NOT push this preview into local messages for the local user.
		// Other clients will receive the preview via the socket and render it.
		this.socket.send(
			JSON.stringify({
				type: "draw-message",
				flag: "text-preview",
				message,
				roomId: this.roomId,
				clientId: this.userId,
			})
		);
	}

	/**
	 * Clears cache and resets state
	 */
	cleanup(): void {
		this.lastDragUpdate = 0;
		this.lastResizeUpdate = 0;
		this.lastPreviewSend = 0;
		this.lastPreviewRect = null;
	}
}
