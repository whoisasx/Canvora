import { v4 as uuidv4 } from "uuid";
import rough from "roughjs";
import { RoughGenerator } from "roughjs/bin/generator";
import { Drawable, Options } from "roughjs/bin/core";
import {
	Tool,
	CommonProps,
	arrowHead,
	arrowType,
	edges,
	fill,
	fontFamily,
	fontSize,
	strokeStyle,
	strokeWidth,
	slopiness,
	textAlign,
} from "./types";
import { CommonPropsGame } from "@/utils/propsStore";
import { ITextData, IIMageData, Message } from "./draw";

// Type alias for Handle type
export type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "none";
import {
	normalizeCoords,
	roughOptions,
	normalizeStroke,
	getResizeHandleAndCursor,
} from "./render";
import { createRoundedRectPath } from "./render/rectangle";
import { createRhombusPath } from "./render/rhombus";
import { createEllipsePath } from "./render/ellipse";
import { createLinePath } from "./render/line";
import { createArrowPath } from "./render/arrow";
import { createPencilPath } from "./render/pencil";
import {
	chilanka,
	excali,
	firaCode,
	ibm,
	monospace,
	nunito,
	comic,
	mononoki,
} from "../font";

// Socket message types
export type SocketMessageType =
	| "draw-message"
	| "create-message"
	| "update-message"
	| "delete-message"
	| "sync-all"
	| "cursor"
	| "undo"
	| "redo";

export interface SocketMessagePayload {
	type: SocketMessageType;
	message?: Message;
	newMessage?: Message;
	id?: string;
	messages?: Message[];
	previewId?: string;
	roomId: string;
	clientId: string;
	flag?: string;
	username?: string;
	pos?: { x: number; y: number };
	ts?: number;
}

// Font family mapping
export const FONT_FAMILY_MAP = {
	normal: "", // Default empty string
	mononoki: chilanka.style.fontFamily,
	excali: excali.style.fontFamily,
	firaCode: firaCode.style.fontFamily,
	ibm: ibm.style.fontFamily,
	comic: comic.style.fontFamily,
	monospace: monospace.style.fontFamily,
	nunito: nunito.style.fontFamily,
} as const;

// Property conversion utilities
export const STROKE_WIDTH_MAP = {
	1: "thin" as strokeWidth,
	2: "normal" as strokeWidth,
	3: "thick" as strokeWidth,
} as const;

export const ROUGHNESS_MAP = {
	0: "architect" as slopiness,
	1: "artist" as slopiness,
	2: "cartoonist" as slopiness,
} as const;

export const FONT_SIZE_MAP = {
	16: "small" as fontSize,
	24: "medium" as fontSize,
	32: "large" as fontSize,
	48: "xlarge" as fontSize,
} as const;

export const FONT_WEIGHT_MAP = {
	16: "400",
	24: "500",
	32: "600",
	48: "700",
} as const;

// Socket utilities
export class SocketHelper {
	constructor(
		private socket: WebSocket | undefined,
		private roomId: string | undefined,
		private userId: string
	) {}

	sendMessage(payload: Omit<SocketMessagePayload, "roomId" | "clientId">) {
		this.socket &&
			this.socket.send(
				JSON.stringify({
					...payload,
					roomId: this.roomId,
					clientId: this.userId,
				})
			);
	}

	sendDrawMessage(message: Message) {
		this.sendMessage({
			type: "draw-message",
			message,
		});
	}

	sendCreateMessage(message: Message, previewId?: string) {
		this.sendMessage({
			type: "create-message",
			message,
			previewId,
		});
	}

	sendUpdateMessage(id: string, newMessage: Message, flag?: string) {
		this.sendMessage({
			type: "update-message",
			id,
			newMessage,
			flag,
		});
	}

	sendDeleteMessage(id: string) {
		this.sendMessage({
			type: "delete-message",
			id,
		});
	}

	sendCursor(username: string, pos: { x: number; y: number }) {
		this.sendMessage({
			type: "cursor",
			username,
			pos,
			ts: Date.now(),
		});
	}

	sendUndo() {
		this.sendMessage({ type: "undo" });
	}

	sendRedo() {
		this.sendMessage({ type: "redo" });
	}

	sendSyncAll(messages: Message[]) {
		this.sendMessage({
			type: "sync-all",
			messages,
		});
	}
}

// Coordinate utilities
export class CoordinateHelper {
	constructor(
		private canvas: HTMLCanvasElement,
		private scale: number,
		private offsetX: number,
		private offsetY: number
	) {}

	updateTransform(scale: number, offsetX: number, offsetY: number) {
		this.scale = scale;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
	}

	getMousePos(e: MouseEvent): { x: number; y: number } {
		const rect = this.canvas.getBoundingClientRect();
		const screenX = e.clientX - rect.x;
		const screenY = e.clientY - rect.y;
		const worldX = (screenX - this.offsetX) / this.scale;
		const worldY = (screenY - this.offsetY) / this.scale;
		return { x: worldX, y: worldY };
	}

	worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
		return {
			x: worldX * this.scale + this.offsetX,
			y: worldY * this.scale + this.offsetY,
		};
	}

	screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
		return {
			x: (screenX - this.offsetX) / this.scale,
			y: (screenY - this.offsetY) / this.scale,
		};
	}
}

// Hit testing utilities
export class HitTestHelper {
	static pointNearLine(
		px: number,
		py: number,
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		tolerance: number = 5
	): boolean {
		const A = px - x1;
		const B = py - y1;
		const C = x2 - x1;
		const D = y2 - y1;

		const dot = A * C + B * D;
		const len_sq = C * C + D * D;
		let param = -1;
		if (len_sq !== 0) param = dot / len_sq;

		let xx, yy;
		if (param < 0) {
			xx = x1;
			yy = y1;
		} else if (param > 1) {
			xx = x2;
			yy = y2;
		} else {
			xx = x1 + param * C;
			yy = y1 + param * D;
		}

		const dx = px - xx;
		const dy = py - yy;
		return dx * dx + dy * dy <= tolerance * tolerance;
	}

	static pointNearEllipse(
		px: number,
		py: number,
		x: number,
		y: number,
		w: number,
		h: number,
		tolerance: number = 2
	): boolean {
		const rx = w / 2;
		const ry = h / 2;
		const cx = x + rx;
		const cy = y + ry;

		if (rx === 0 || ry === 0) return false;

		const value =
			((px - cx) * (px - cx)) / (rx * rx) +
			((py - cy) * (py - cy)) / (ry * ry);

		const distance = Math.abs(Math.sqrt(value) - 1);
		const scaled = distance * Math.min(rx, ry);

		return scaled <= tolerance;
	}

	static testEllipseEdges(
		px: number,
		py: number,
		rect: { x: number; y: number; w: number; h: number },
		tolerance: number = 10
	): boolean {
		const { x, y, w, h } = rect;
		const rx = w / 2;
		const ry = h / 2;
		const cx = x + rx;
		const cy = y + ry;

		if (rx === 0 || ry === 0) return false;

		// Calculate the ellipse equation value for the point
		const value =
			((px - cx) * (px - cx)) / (rx * rx) +
			((py - cy) * (py - cy)) / (ry * ry);

		// Check if point is near the ellipse edge (value should be close to 1)
		const distance = Math.abs(Math.sqrt(value) - 1);
		const scaled = distance * Math.min(rx, ry);

		return scaled <= tolerance;
	}

	static pointInBounds(
		px: number,
		py: number,
		x: number,
		y: number,
		w: number,
		h: number
	): boolean {
		return px >= x && px <= x + w && py >= y && py <= y + h;
	}

	static testRectangleEdges(
		px: number,
		py: number,
		rect: { x: number; y: number; w: number; h: number },
		tolerance: number = 10
	): boolean {
		const { x, y, w, h } = rect;
		return (
			this.pointNearLine(px, py, x, y, x + w, y, tolerance) ||
			this.pointNearLine(px, py, x + w, y, x + w, y + h, tolerance) ||
			this.pointNearLine(px, py, x, y + h, x + w, y + h, tolerance) ||
			this.pointNearLine(px, py, x, y, x, y + h, tolerance)
		);
	}

	static testRhombusEdges(
		px: number,
		py: number,
		rect: { x: number; y: number; w: number; h: number },
		tolerance: number = 10
	): boolean {
		const { x, y, w, h } = rect;
		return (
			this.pointNearLine(
				px,
				py,
				x + w / 2,
				y,
				x + w,
				y + h / 2,
				tolerance
			) ||
			this.pointNearLine(
				px,
				py,
				x + w,
				y + h / 2,
				x + w / 2,
				y + h,
				tolerance
			) ||
			this.pointNearLine(
				px,
				py,
				x,
				y + h / 2,
				x + w / 2,
				y + h,
				tolerance
			) ||
			this.pointNearLine(px, py, x + w / 2, y, x, y + h / 2, tolerance)
		);
	}

	static testPencilPoints(
		px: number,
		py: number,
		pencilPoints: { x: number; y: number }[],
		tolerance: number = 8
	): boolean {
		for (let i = 0; i < pencilPoints.length - 1; i++) {
			const p1 = pencilPoints[i];
			const p2 = pencilPoints[i + 1];
			if (
				this.pointNearLine(
					px,
					py,
					p1!.x,
					p1!.y,
					p2!.x,
					p2!.y,
					tolerance
				)
			) {
				return true;
			}
		}
		return false;
	}
}

// Shape creation utilities
export class ShapeCreator {
	constructor(private generator: RoughGenerator) {}

	createRectangle(
		startX: number,
		startY: number,
		w: number,
		h: number,
		props: CommonPropsGame,
		seed?: number
	): Message {
		const options = roughOptions(props);
		const rect = normalizeCoords(startX, startY, w, h);
		let shapeData: Drawable;

		if (props.edges === "round") {
			const path = createRoundedRectPath(rect.x, rect.y, rect.w, rect.h);
			shapeData = this.generator.path(path, {
				...options,
				seed: seed ?? Math.floor(Math.random() * 1000000),
			});
		} else {
			shapeData = this.generator.rectangle(startX, startY, w, h, {
				...options,
				seed: seed ?? Math.floor(Math.random() * 1000000),
			});
		}

		return {
			id: uuidv4(),
			shape: "rectangle" as Tool,
			opacity: props.opacity,
			edges: props.edges,
			shapeData,
			boundingBox: rect,
		};
	}

	createRhombus(
		startX: number,
		startY: number,
		w: number,
		h: number,
		props: CommonPropsGame,
		seed?: number
	): Message {
		const options = roughOptions(props);
		const rect = normalizeCoords(startX, startY, w, h);
		const path = createRhombusPath(
			rect.x,
			rect.y,
			rect.w,
			rect.h,
			props.edges === "round"
		);

		const shapeData = this.generator.path(path, {
			...options,
			seed: seed ?? Math.floor(Math.random() * 1000000),
		});

		return {
			id: uuidv4(),
			shape: "rhombus" as Tool,
			opacity: props.opacity,
			edges: props.edges,
			shapeData,
			boundingBox: rect,
		};
	}

	createEllipse(
		startX: number,
		startY: number,
		w: number,
		h: number,
		props: CommonPropsGame,
		seed?: number
	): Message {
		const options = roughOptions(props);
		const rect = normalizeCoords(startX, startY, w, h);
		const path = createEllipsePath(rect.x, rect.y, rect.w, rect.h);

		const shapeData = this.generator.path(path, {
			...options,
			seed: seed ?? Math.floor(Math.random() * 1000000),
		});

		return {
			id: uuidv4(),
			shape: "arc" as Tool,
			opacity: props.opacity,
			shapeData,
			boundingBox: rect,
		};
	}

	createLine(
		startX: number,
		startY: number,
		w: number,
		h: number,
		props: CommonPropsGame,
		seed?: number
	): Message {
		const options = roughOptions(props);
		const x2 = startX + w;
		const y2 = startY + h;
		const rect = normalizeCoords(startX, startY, w, h);

		const path = createLinePath(startX, startY, x2, y2);
		const shapeData = this.generator.path(path, {
			...options,
			seed: seed ?? Math.floor(Math.random() * 1000000),
		});

		return {
			id: uuidv4(),
			shape: "line" as Tool,
			opacity: props.opacity,
			edges: props.edges,
			shapeData,
			boundingBox: rect,
			lineData: { x1: startX, y1: startY, x2, y2 },
		};
	}

	createArrow(
		startX: number,
		startY: number,
		w: number,
		h: number,
		props: CommonPropsGame,
		seed?: number
	): Message {
		const options = roughOptions(props);
		const x2 = startX + w;
		const y2 = startY + h;
		const rect = normalizeCoords(startX, startY, w, h);

		const front = props.arrowHead!.front!;
		const back = props.arrowHead!.back!;
		const arrow_type = props.arrowType;

		const { linePath, frontHeadPath, backHeadPath } = createArrowPath(
			startX,
			startY,
			x2,
			y2,
			front,
			back,
			arrow_type!
		);

		const shapeData: Drawable[] = [];

		if (linePath) {
			const lineDrawable = this.generator.path(linePath, {
				...options,
				seed: seed ?? Math.floor(Math.random() * 1000000),
			});
			shapeData.push(lineDrawable);
		}

		if (frontHeadPath) {
			const frontHeadDrawable = this.generator.path(frontHeadPath, {
				...options,
				fill: front === "triangle" ? props.stroke : undefined,
				fillStyle: front === "triangle" ? "solid" : undefined,
				seed: seed ?? Math.floor(Math.random() * 1000000),
			});
			shapeData.push(frontHeadDrawable);
		}

		if (backHeadPath) {
			const backHeadDrawable = this.generator.path(backHeadPath, {
				...options,
				fill: back === "triangle" ? props.stroke : undefined,
				fillStyle: back === "triangle" ? "solid" : undefined,
				seed: seed ?? Math.floor(Math.random() * 1000000),
			});
			shapeData.push(backHeadDrawable);
		}

		return {
			id: uuidv4(),
			shape: "arrow" as Tool,
			opacity: props.opacity,
			arrowHead: props.arrowHead,
			arrowType: props.arrowType,
			shapeData,
			boundingBox: rect,
			lineData: { x1: startX, y1: startY, x2, y2 },
		};
	}

	createPencil(
		pencilPoints: { x: number; y: number }[],
		props: CommonPropsGame,
		seed?: number
	): Message {
		const options = roughOptions(props);
		const path = createPencilPath(pencilPoints);

		const shapeData = this.generator.path(path, {
			...options,
			strokeWidth: options.strokeWidth! * 2,
			roughness: 0,
			bowing: 0,
			seed: seed ?? Math.floor(Math.random() * 1000000),
		});

		let minx = Number.MAX_VALUE,
			miny = Number.MAX_VALUE;
		let maxx = Number.MIN_VALUE,
			maxy = Number.MIN_VALUE;

		for (const point of pencilPoints) {
			minx = Math.min(minx, point.x);
			maxx = Math.max(maxx, point.x);
			miny = Math.min(miny, point.y);
			maxy = Math.max(maxy, point.y);
		}

		return {
			id: uuidv4(),
			shape: "pencil" as Tool,
			opacity: props.opacity,
			shapeData,
			boundingBox: {
				x: minx,
				y: miny,
				w: maxx - minx,
				h: maxy - miny,
			},
			pencilPoints,
		};
	}

	createText(
		text: string,
		pos: { x: number; y: number },
		props: CommonPropsGame,
		bboxWidth: number,
		bboxHeight: number
	): Message {
		const dummyShapeData = { options: {} } as unknown as Drawable;

		return {
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
				w: bboxWidth,
				h: bboxHeight,
			},
		};
	}

	createImage(
		src: string,
		pos: { x: number; y: number },
		w: number,
		h: number,
		props: CommonPropsGame
	): Message {
		const dummyPath = `M${pos.x},${pos.y} L${pos.x + 1},${pos.y}`;
		const dummyShapeData = this.generator.path(dummyPath, {});

		return {
			id: uuidv4(),
			shape: "image",
			shapeData: dummyShapeData,
			opacity: props.opacity,
			edges: props.edges,
			imageData: {
				src,
				pos,
				w,
				h,
			},
			boundingBox: {
				x: pos.x,
				y: pos.y,
				w,
				h,
			},
		};
	}
}

// Resize utilities
export class ResizeHelper {
	static handleResize(
		rect: { x: number; y: number; w: number; h: number },
		pos: { x: number; y: number },
		prevPos: { x: number; y: number },
		resizeHandler: Handle
	): {
		newRect: { x: number; y: number; w: number; h: number };
		flipped: { h: boolean; v: boolean };
		newHandle: Handle;
	} {
		const dx = pos.x - prevPos.x;
		const dy = pos.y - prevPos.y;
		const newRect = { ...rect };

		switch (resizeHandler) {
			case "e":
				newRect.w += dx;
				break;
			case "w":
				newRect.x += dx;
				newRect.w -= dx;
				break;
			case "s":
				newRect.h += dy;
				break;
			case "n":
				newRect.y += dy;
				newRect.h -= dy;
				break;
			case "se":
				newRect.w += dx;
				newRect.h += dy;
				break;
			case "sw":
				newRect.x += dx;
				newRect.w -= dx;
				newRect.h += dy;
				break;
			case "ne":
				newRect.w += dx;
				newRect.y += dy;
				newRect.h -= dy;
				break;
			case "nw":
				newRect.x += dx;
				newRect.w -= dx;
				newRect.y += dy;
				newRect.h -= dy;
				break;
		}

		// Handle flipping
		let hFlip = false,
			vFlip = false;

		if (newRect.w < 0) {
			newRect.x += newRect.w;
			newRect.w = -newRect.w;
			hFlip = true;
		}

		if (newRect.h < 0) {
			newRect.y += newRect.h;
			newRect.h = -newRect.h;
			vFlip = true;
		}

		// Ensure minimum size
		const MIN_SIZE = 1;
		newRect.w = Math.max(newRect.w, MIN_SIZE);
		newRect.h = Math.max(newRect.h, MIN_SIZE);

		// Calculate new handle
		let newHandle = resizeHandler;
		if (hFlip || vFlip) {
			let h = resizeHandler.includes("e")
				? "e"
				: resizeHandler.includes("w")
					? "w"
					: "";
			let v = resizeHandler.includes("n")
				? "n"
				: resizeHandler.includes("s")
					? "s"
					: "";

			if (hFlip) h = h === "e" ? "w" : h === "w" ? "e" : "";
			if (vFlip) v = v === "n" ? "s" : v === "s" ? "n" : "";

			newHandle = (v + h) as Handle;
		}

		return {
			newRect,
			flipped: { h: hFlip, v: vFlip },
			newHandle,
		};
	}
}

// Property conversion utilities
export class PropertyConverter {
	static getStrokeWidth(width: number): strokeWidth {
		return (
			STROKE_WIDTH_MAP[width as keyof typeof STROKE_WIDTH_MAP] || "normal"
		);
	}

	static getStrokeStyle(strokeLineDash?: number[]): strokeStyle {
		if (!strokeLineDash || strokeLineDash.length === 0) return "solid";
		if (
			Array.isArray(strokeLineDash) &&
			strokeLineDash.length === 2 &&
			strokeLineDash[0] === 10 &&
			strokeLineDash[1] === 10
		) {
			return "dashed";
		}
		return "dotted";
	}

	static getRoughness(roughness: number): slopiness {
		return (
			ROUGHNESS_MAP[roughness as keyof typeof ROUGHNESS_MAP] || "artist"
		);
	}

	static getFill(fillStyle: string): fill {
		return fillStyle === "cross-hatch" ? "cross" : (fillStyle as fill);
	}

	static getFontSize(fontSize: string): fontSize {
		const size = parseInt(fontSize);
		return FONT_SIZE_MAP[size as keyof typeof FONT_SIZE_MAP] || "medium";
	}

	static getFontFamily(fontFamily: string): fontFamily {
		// Map from internal font names to UI names
		const mapping: Record<string, fontFamily> = {
			caveat: "caveat",
			excali: "draw",
			firaCode: "code",
			jakarta: "normal",
			sourceCode: "little",
			monospace: "mono",
			nunito: "nunito",
		};
		return mapping[fontFamily] || "normal";
	}

	static getOpacity(opacity?: number): number {
		return opacity ? opacity * 100 : 100;
	}
}

// Throttling utility
export class ThrottleHelper {
	static shouldThrottle(
		lastRect: { x: number; y: number; w: number; h: number } | null,
		currentRect: { x: number; y: number; w: number; h: number },
		lastSend: number,
		throttleMs: number = 100
	): boolean {
		const now = Date.now();
		return !!(
			lastRect &&
			lastRect.x === currentRect.x &&
			lastRect.y === currentRect.y &&
			lastRect.w === currentRect.w &&
			lastRect.h === currentRect.h &&
			now - lastSend < throttleMs
		);
	}
}

// Bounding box utilities
export class BoundingBoxHelper {
	static fromPencilPoints(points: { x: number; y: number }[]): {
		x: number;
		y: number;
		w: number;
		h: number;
	} {
		let minx = Number.MAX_VALUE,
			miny = Number.MAX_VALUE;
		let maxx = Number.MIN_VALUE,
			maxy = Number.MIN_VALUE;

		for (const point of points) {
			minx = Math.min(minx, point.x);
			maxx = Math.max(maxx, point.x);
			miny = Math.min(miny, point.y);
			maxy = Math.max(maxy, point.y);
		}

		return {
			x: minx,
			y: miny,
			w: Math.max(0, maxx - minx),
			h: Math.max(0, maxy - miny),
		};
	}

	static fromLineData(lineData: {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	}): { x: number; y: number; w: number; h: number } {
		return normalizeCoords(
			lineData.x1,
			lineData.y1,
			lineData.x2 - lineData.x1,
			lineData.y2 - lineData.y1
		);
	}
}

// Font utilities
export class FontHelper {
	static getFontFamily(fontFamily: fontFamily): string {
		return (
			FONT_FAMILY_MAP[fontFamily as keyof typeof FONT_FAMILY_MAP] ||
			FONT_FAMILY_MAP.excali
		);
	}

	static getFontWeight(fontSize: number): string {
		return (
			FONT_WEIGHT_MAP[fontSize as keyof typeof FONT_WEIGHT_MAP] || "400"
		);
	}

	static setupTextareaFont(
		textarea: HTMLTextAreaElement,
		fontFamily: fontFamily | string,
		fontSize: number,
		scale: number,
		color: string,
		opacity: number,
		textAlign: textAlign | string
	): void {
		textarea.style.fontFamily = this.getFontFamily(
			fontFamily as fontFamily
		);
		textarea.style.fontSize = `${fontSize * scale}px`;
		textarea.style.color = color;
		textarea.style.fontWeight = this.getFontWeight(fontSize);
		textarea.style.opacity = `${opacity}`;
		textarea.style.textAlign = textAlign as string;
	}

	static setupCanvasFont(
		ctx: CanvasRenderingContext2D,
		fontSize: string,
		fontFamily: fontFamily,
		textAlign: textAlign,
		color: string,
		opacity: number,
		theme: "light" | "dark"
	): void {
		ctx.font = `${fontSize} ${this.getFontFamily(fontFamily)}`;
		ctx.textBaseline = "top";
		ctx.textAlign = textAlign as CanvasTextAlign;
		ctx.fillStyle = normalizeStroke(theme, color);
		ctx.globalAlpha = opacity ?? 1;
	}
}
