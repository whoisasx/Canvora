import rough from "roughjs";
import { RoughGenerator } from "roughjs/bin/generator";
import { Drawable, Options } from "roughjs/bin/core";
import { Tool, CommonProps, edges } from "../types";
import { CommonPropsGame } from "@/utils/propsStore";
import { Message } from "../draw";
import { roughOptions } from "../render";

// Type definitions
type BoundingBox = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };
type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "none";
type ImageData = {
	src: string;
	pos: { x: number; y: number };
	w: number;
	h: number;
};

// Constants
const MIN_SIZE = 10;
const MAX_DIMENSION = 5000;
const DEFAULT_IMAGE_SIZE = 150;
// Performance optimization constants
const THROTTLE_MS = 33; // Render throttle (~30fps)

export class ImageHelper {
	/**
	 * Validates image dimensions and data
	 */
	static validateImage(
		boundingBox: BoundingBox,
		imageData?: ImageData
	): boolean {
		if (!imageData || !imageData.src) {
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
	 * Constrains image to valid dimensions
	 */
	static constrainImage(boundingBox: BoundingBox): BoundingBox {
		return {
			x: boundingBox.x,
			y: boundingBox.y,
			w: Math.max(MIN_SIZE, Math.min(boundingBox.w, MAX_DIMENSION)),
			h: Math.max(MIN_SIZE, Math.min(boundingBox.h, MAX_DIMENSION)),
		};
	}

	/**
	 * Creates rounded rectangle clipping path for image
	 */
	static createRoundedClipPath(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		w: number,
		h: number,
		radius = 50
	): void {
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + w - radius, y);
		ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
		ctx.lineTo(x + w, y + h - radius);
		ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
		ctx.lineTo(x + radius, y + h);
		ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
	}

	/**
	 * Calculates aspect ratio and adjusted dimensions
	 */
	static calculateAspectRatio(
		naturalWidth: number,
		naturalHeight: number,
		targetSize = DEFAULT_IMAGE_SIZE
	): { w: number; h: number } {
		const aspectRatio = naturalWidth / naturalHeight;

		if (aspectRatio > 1) {
			// Landscape
			return { w: targetSize, h: targetSize / aspectRatio };
		} else {
			// Portrait or square
			return { w: targetSize * aspectRatio, h: targetSize };
		}
	}
}

export class ImageManager {
	private imageCache = new Map<string, HTMLImageElement>();
	private lastPreviewSend: number = 0;

	// Throttling for drag/resize operations
	private lastDragUpdate: number = 0;
	private lastResizeUpdate: number = 0;

	constructor(
		private ctx: CanvasRenderingContext2D,
		private generator: RoughGenerator,
		private socket: WebSocket,
		private theme: "light" | "dark",
		private roomId: string,
		private userId: string,
		private onRenderNeeded?: () => void
	) {}

	/**
	 * Creates an image message object for final shape creation
	 */
	createMessage(
		pos: Point,
		imageSrc: string,
		naturalWidth: number,
		naturalHeight: number,
		props: CommonPropsGame
	): Message {
		// Calculate appropriate dimensions maintaining aspect ratio
		const dimensions = ImageHelper.calculateAspectRatio(
			naturalWidth,
			naturalHeight
		);

		const boundingBox: BoundingBox = {
			x: pos.x,
			y: pos.y,
			w: dimensions.w,
			h: dimensions.h,
		};

		const imageData: ImageData = {
			src: imageSrc,
			pos,
			w: naturalWidth,
			h: naturalHeight,
		};

		if (!ImageHelper.validateImage(boundingBox, imageData)) {
			throw new Error("Invalid image data or dimensions");
		}

		// Create a dummy shape data for compatibility with the Message interface
		const dummyPath = `M${pos.x},${pos.y} L${pos.x + 1},${pos.y}`;
		const options = roughOptions(props);
		const dummyShapeData = this.generator.path(dummyPath, options);

		return {
			id: crypto.randomUUID(),
			shape: "image" as Tool,
			opacity: props.opacity,
			edges: props.edges,
			shapeData: dummyShapeData,
			imageData,
			boundingBox,
		};
	}

	/**
	 * Renders a finalized image on the canvas
	 */
	render(message: Message): void {
		const { boundingBox, imageData, opacity, edges } = message;
		if (!boundingBox || !imageData) return;

		let img = this.imageCache.get(message.id);
		if (!img) {
			img = new Image();
			img.src = imageData.src;
			img.onload = () => {
				this.imageCache.set(message.id, img!);
				// Trigger re-render when image loads
				if (this.onRenderNeeded) {
					this.onRenderNeeded();
				}
			};
			return;
		}

		try {
			this.ctx.save();

			// Apply opacity
			this.ctx.globalAlpha = opacity ?? 1;

			// Apply clipping for rounded edges
			if (edges === "round") {
				ImageHelper.createRoundedClipPath(
					this.ctx,
					boundingBox.x,
					boundingBox.y,
					boundingBox.w,
					boundingBox.h
				);
				this.ctx.clip();
			}

			// Draw the image
			this.ctx.drawImage(
				img,
				boundingBox.x,
				boundingBox.y,
				boundingBox.w,
				boundingBox.h
			);

			this.ctx.restore();
		} catch (error) {
			console.error("Error rendering image:", error);
			this.ctx.restore();
		}
	}

	/**
	 * Renders live preview image while user is positioning
	 */
	renderPreview(pos: Point, imageSrc: string, props: CommonPropsGame): void {
		if (!imageSrc) return;

		try {
			const img = new Image();
			img.src = imageSrc;

			img.onload = () => {
				this.ctx.save();
				this.ctx.globalAlpha = props.opacity ?? 1;

				// Apply clipping for rounded edges
				if (props.edges === "round") {
					ImageHelper.createRoundedClipPath(
						this.ctx,
						pos.x,
						pos.y,
						DEFAULT_IMAGE_SIZE,
						DEFAULT_IMAGE_SIZE
					);
					this.ctx.clip();
				}

				this.ctx.drawImage(
					img,
					pos.x,
					pos.y,
					DEFAULT_IMAGE_SIZE,
					DEFAULT_IMAGE_SIZE
				);
				this.ctx.restore();
			};
		} catch (error) {
			console.error("Error rendering image preview:", error);
			this.ctx.restore();
		}
	}

	/**
	 * Handles dragging/moving an existing image
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

			const newBoundingBox = {
				...message.boundingBox,
				x: message.boundingBox.x + dx,
				y: message.boundingBox.y + dy,
			};

			if (!ImageHelper.validateImage(newBoundingBox, message.imageData)) {
				console.warn("Invalid image during drag, skipping update");
				return;
			}

			const newMessage: Message = {
				...message,
				boundingBox: newBoundingBox,
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
			console.error("Error during image drag:", error);
		}
	}

	/**
	 * Handles resizing image from 8 resize handles
	 */
	handleResize(
		message: Message,
		currentPos: Point,
		resizeHandler: Handle,
		setSelectedMessage: (msg: Message) => void,
		updateCursor: (cursor: string) => void,
		maintainAspectRatio = false
	): { newHandler: Handle } {
		if (!message.boundingBox || resizeHandler === "none") {
			return { newHandler: resizeHandler };
		}

		try {
			const { x, y, w, h } = message.boundingBox;
			let newRect = { x, y, w, h };

			// Calculate original aspect ratio
			const aspectRatio = w / h;

			// Apply resize transformation based on handle
			this.applyResizeTransformation(newRect, currentPos, resizeHandler);

			// Maintain aspect ratio if requested
			if (maintainAspectRatio) {
				this.maintainAspectRatio(newRect, aspectRatio, resizeHandler);
			}

			// Handle negative dimensions with smart handle flipping
			const flipResult = this.handleDimensionFlips(
				newRect,
				resizeHandler
			);
			const constrainedRect = ImageHelper.constrainImage(newRect);

			if (flipResult.flipped) {
				updateCursor(`${flipResult.newHandler}-resize`);
			}

			const newMessage: Message = {
				...message,
				boundingBox: constrainedRect,
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

			return { newHandler: flipResult.newHandler };
		} catch (error) {
			console.error("Error during image resize:", error);
			return { newHandler: resizeHandler };
		}
	}

	/**
	 * Updates image appearance when properties change
	 */
	updateProperties(
		message: Message,
		newProps: CommonPropsGame,
		setSelectedMessage: (msg: Message) => void
	): void {
		if (!message.boundingBox) return;

		try {
			const newMessage: Message = {
				...message,
				opacity: newProps.opacity,
				edges: newProps.edges,
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
			console.error("Error updating image properties:", error);
		}
	}

	/**
	 * Handles image upload process
	 */
	handleImageUpload(): Promise<string | null> {
		return new Promise((resolve) => {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = "image/*";

			input.onchange = (e: Event) => {
				const target = e.target as HTMLInputElement;
				const file = target.files?.[0];

				if (!file) {
					if (input.parentNode) input.remove();
					resolve(null);
					return;
				}

				const reader = new FileReader();
				reader.onload = () => {
					resolve(reader.result as string);
				};
				reader.onerror = () => {
					resolve(null);
				};
				reader.readAsDataURL(file);

				if (input.parentNode) input.remove();
			};

			input.click();
		});
	}

	/**
	 * Clears cache and resets state
	 */
	cleanup(): void {
		this.imageCache.clear();
		this.lastPreviewSend = 0;
		this.lastDragUpdate = 0;
		this.lastResizeUpdate = 0;
	}

	// Private helper methods

	private applyResizeTransformation(
		rect: BoundingBox,
		currentPos: Point,
		handle: Handle
	): void {
		const { x, y, w, h } = rect;

		switch (handle) {
			case "e": // right edge
				rect.w = currentPos.x - x;
				break;
			case "w": // left edge
				rect.x = currentPos.x;
				rect.w = w + (x - currentPos.x);
				break;
			case "s": // bottom edge
				rect.h = currentPos.y - y;
				break;
			case "n": // top edge
				rect.y = currentPos.y;
				rect.h = h + (y - currentPos.y);
				break;
			case "se": // bottom-right
				rect.w = currentPos.x - x;
				rect.h = currentPos.y - y;
				break;
			case "sw": // bottom-left
				rect.x = currentPos.x;
				rect.w = w + (x - currentPos.x);
				rect.h = currentPos.y - y;
				break;
			case "ne": // top-right
				rect.w = currentPos.x - x;
				rect.y = currentPos.y;
				rect.h = h + (y - currentPos.y);
				break;
			case "nw": // top-left
				rect.x = currentPos.x;
				rect.y = currentPos.y;
				rect.w = w + (x - currentPos.x);
				rect.h = h + (y - currentPos.y);
				break;
		}
	}

	private maintainAspectRatio(
		rect: BoundingBox,
		aspectRatio: number,
		handle: Handle
	): void {
		// Maintain aspect ratio based on which dimension changed more significantly
		if (handle.includes("e") || handle.includes("w")) {
			// Width changed, adjust height
			rect.h = rect.w / aspectRatio;
		} else if (handle.includes("n") || handle.includes("s")) {
			// Height changed, adjust width
			rect.w = rect.h * aspectRatio;
		} else {
			// Corner handles - use the dimension that changed more
			const widthChange = Math.abs(rect.w);
			const heightChange = Math.abs(rect.h);

			if (widthChange > heightChange) {
				rect.h = rect.w / aspectRatio;
			} else {
				rect.w = rect.h * aspectRatio;
			}
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
