import { fontFamily, textAlign, Tool } from "../types";
import { CommonPropsGame } from "@/utils/propsStore";
import { Message, ITextData } from "../draw";
import { FontHelper } from "../assist";
import { normalizeStroke } from "../render";
import { Drawable } from "roughjs/bin/core";
import { v4 as uuidv4 } from "uuid";
import {
	chilanka,
	excali,
	firaCode,
	ibm,
	monospace,
	nunito,
	comic,
} from "../../font";

// Type definitions
type BoundingBox = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };

// Constants
const THROTTLE_MS = 100;
const LINE_HEIGHT_MULTIPLIER = 1.2;

export class TextHelper {
	/**
	 * Validates text data structure
	 */
	static validateTextData(textData: ITextData): boolean {
		return (
			textData &&
			typeof textData.text === "string" &&
			typeof textData.fontSize === "string" &&
			typeof textData.fontFamily === "string" &&
			typeof textData.textColor === "string" &&
			typeof textData.textAlign === "string" &&
			textData.pos &&
			typeof textData.pos.x === "number" &&
			typeof textData.pos.y === "number" &&
			!isNaN(textData.pos.x) &&
			!isNaN(textData.pos.y)
		);
	}
}

export class TextManager {
	private lastPreviewSend: number = 0;
	private lastPreviewRect: BoundingBox | null = null;

	constructor(
		private ctx: CanvasRenderingContext2D,
		private canvas: HTMLCanvasElement,
		private socket: WebSocket,
		private theme: "light" | "dark",
		private roomId: string,
		private userId: string,
		private scale: number,
		private offsetX: number,
		private offsetY: number,
		private setTool: (tool: Tool) => void,
		private setProps: (tool: Tool) => void,
		private getMousePos: (e: MouseEvent) => Point,
		private getProps: () => CommonPropsGame,
		private previewId: string,
		private clicked: boolean,
		private tool: Tool
	) {}

	/**
	 * Original text input handling implementation
	 */
	handleTextInput(e: PointerEvent): void {
		e.preventDefault();
		const pos = this.getMousePos(e);
		const props = this.getProps();

		const textarea = document.createElement("textarea");

		textarea.style.fontFamily = excali.style.fontFamily;
		if (props.fontFamily === "mononoki")
			textarea.style.fontFamily = chilanka.style.fontFamily;
		if (props.fontFamily === "excali")
			textarea.style.fontFamily = excali.style.fontFamily;
		if (props.fontFamily === "firaCode")
			textarea.style.fontFamily = firaCode.style.fontFamily;
		if (props.fontFamily === "ibm")
			textarea.style.fontFamily = ibm.style.fontFamily;
		if (props.fontFamily === "comic")
			textarea.style.fontFamily = comic.style.fontFamily;
		if (props.fontFamily === "monospace")
			textarea.style.fontFamily = monospace.style.fontFamily;
		if (props.fontFamily === "nunito")
			textarea.style.fontFamily = nunito.style.fontFamily;
		textarea.style.fontSize = `${props.fontSize! * this.scale}px`;
		textarea.style.color = props.stroke!;
		const fontWeightMap: Record<number, string> = {
			16: "400",
			24: "500",
			32: "600",
			48: "700",
		};
		textarea.style.fontWeight = fontWeightMap[props.fontSize!] || "400";
		textarea.style.opacity = `${props.opacity}`;
		textarea.style.textAlign = props.textAlign!;

		const canvasRect = this.canvas.getBoundingClientRect();
		const maxWidth = canvasRect.right - e.clientX - 30;
		const maxHeight = canvasRect.bottom - e.clientY - 30;

		Object.assign(textarea.style, {
			position: "absolute",
			left: `${canvasRect.left + (pos.x * this.scale + this.offsetX)}px`,
			top: `${canvasRect.top + (pos.y * this.scale + this.offsetY)}px`,
			background: "transparent",
			border: "none",
			padding: "4px 8px",
			outline: "none",
			resize: "none",
			overflow: "hidden",
			width: "0px",
			minHeight: `${props.fontSize! * LINE_HEIGHT_MULTIPLIER}px`,
			maxWidth: `${maxWidth}px`,
			maxHeight: `${maxHeight}px`,
			whiteSpace: "pre",
			boxSizing: "content-box",
			zIndex: "10",
		});

		document.body.appendChild(textarea);

		// Hidden span for measuring text size
		let span: HTMLSpanElement | null = null;
		let width = 0;
		let height = 0;

		const resize = () => {
			if (this.tool === "mouse") return;
			const lineHeight = Math.round(
				props.fontSize! * LINE_HEIGHT_MULTIPLIER
			);

			if (span && document.body.contains(span)) {
				document.body.removeChild(span);
			}
			span = document.createElement("span");

			span.style.fontFamily = textarea.style.fontFamily;
			span.style.fontSize = `${props.fontSize! * this.scale}px`;
			span.style.lineHeight = `${lineHeight}px`;
			span.style.opacity = textarea.style.opacity;

			Object.assign(span.style, {
				visibility: "hidden",
				position: "absolute",
				whiteSpace: "pre",
				padding: textarea.style.padding,
				fontWeight: textarea.style.fontWeight,
			});
			span.textContent = textarea.value || " ";
			document.body.appendChild(span);

			textarea.style.width = "auto";
			const newWidth = Math.max(span.offsetWidth + 2, 20);
			width = newWidth;
			textarea.style.width = `${newWidth}px`;

			textarea.style.height = "auto";
			const newHeight = textarea.scrollHeight;
			textarea.style.height = `${newHeight}px`;
			height = newHeight;

			document.body.removeChild(span);
		};

		const sendPreview = () => {
			// do not render this client's preview locally; only send to server so other clients see it
			const tempValue = textarea.value;
			const totalLines = (tempValue || "").split("\n").length;

			// convert measured dimensions back to world coords
			const bboxWidthWorld = width / this.scale;
			const bboxHeightWorld = Math.max(
				(height || totalLines * props.fontSize! * this.scale) /
					this.scale,
				props.fontSize!
			);

			const rect = {
				x: pos.x,
				y: pos.y,
				w: bboxWidthWorld,
				h: bboxHeightWorld,
			};

			// throttle & skip identical rects
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

			// lightweight dummy for shapeData
			const dummyShapeData = { options: {} } as unknown as Drawable;

			const message: Message = {
				id: this.previewId,
				shape: "text" as Tool,
				shapeData: dummyShapeData,
				opacity: props.opacity,
				textData: {
					text: textarea.value,
					fontFamily: props.fontFamily!,
					fontSize: `${props.fontSize}px`,
					textColor: props.stroke!,
					textAlign: props.textAlign!,
					pos,
				},
				boundingBox: rect,
			};

			// NOTE: do NOT push this preview into this.previewMessage for the local user.
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
		};

		let messageSend: boolean = false;
		const messageText = () => {
			if (messageSend) return;
			messageSend = true;
			const text = textarea.value.trim();
			if (!text) {
				if (textarea.parentNode) textarea.remove();
				this.setTool("mouse" as Tool);
				this.setProps("mouse" as Tool);
				return;
			}

			const tempValue = textarea.value.trim();
			const totalLines = tempValue.split("\n").length;
			// Convert measurements taken in screen pixels back to world coordinates
			const bboxWidthWorld = width / this.scale;
			const bboxHeightWorld = Math.max(
				(height || totalLines * props.fontSize! * this.scale) /
					this.scale,
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

			// include previewId so server can clear previews for other clients
			this.socket.send(
				JSON.stringify({
					type: "create-message",
					message,
					previewId: this.previewId,
					roomId: this.roomId,
					clientId: this.userId,
				})
			);

			// local preview wasn't added, so just clean up UI
			if (textarea.parentNode) textarea.remove();
			this.setTool("mouse" as Tool);
			this.setProps("mouse" as Tool);
			return;
		};

		// initial sizing + initial preview
		resize();
		sendPreview();

		textarea.addEventListener("blur", () => {
			if (textarea.value.trim() !== "") messageText();
			else {
				if (textarea.parentNode) textarea.remove();
				// no local preview to clear; server/other clients will handle any remote preview cleanup when a create arrives
				this.setTool("mouse" as Tool);
				this.setProps("mouse" as Tool);
			}
		});
		textarea.addEventListener("keydown", (event: KeyboardEvent) => {
			if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
				event.preventDefault();
				messageText();
				return;
			}
			// on other keys, update size and send preview
			resize();
			sendPreview();
		});
		textarea.addEventListener("input", () => {
			resize();
			sendPreview();
		});

		textarea.focus();
	}

	/**
	 * Render text on canvas
	 */
	render(message: Message): void {
		if (
			!message.textData ||
			!TextHelper.validateTextData(message.textData)
		) {
			console.error("Invalid text data for rendering");
			return;
		}

		try {
			this.ctx.save();

			const fontSizeNum = parseInt(message.textData.fontSize);
			this.ctx.font = `${FontHelper.getFontWeight(fontSizeNum)} ${message.textData.fontSize} ${FontHelper.getFontFamily(message.textData.fontFamily as fontFamily)}`;
			this.ctx.textBaseline = "top";
			this.ctx.fillStyle = normalizeStroke(
				this.theme,
				message.textData.textColor
			);
			this.ctx.globalAlpha = message.opacity ?? 1;

			const lines = message.textData.text.includes("\n")
				? message.textData.text.split("\n")
				: [message.textData.text];

			const lineHeight = fontSizeNum * 1.5;
			const topPaddingWorld = 8 / this.scale;
			const leftPaddingWorld = 8 / this.scale;

			for (let i = 0; i < lines.length; i++) {
				const line = lines[i] || "";
				let drawX = message.textData.pos.x;

				if (message.textData.textAlign === "center") {
					drawX = message.textData.pos.x + message.boundingBox.w / 2;
					this.ctx.textAlign = "center";
				} else if (message.textData.textAlign === "right") {
					drawX = message.textData.pos.x + message.boundingBox.w;
					this.ctx.textAlign = "right";
				} else {
					drawX = message.textData.pos.x + leftPaddingWorld;
					this.ctx.textAlign = "left";
				}

				const drawY =
					message.textData.pos.y + topPaddingWorld + i * lineHeight;
				this.ctx.fillText(line, drawX, drawY);
			}

			this.ctx.restore();
		} catch (error) {
			console.error("Error rendering text:", error);
			this.ctx.restore();
		}
	}

	/**
	 * Update manager properties
	 */
	updateScale(scale: number): void {
		this.scale = scale;
	}

	updateOffset(offsetX: number, offsetY: number): void {
		this.offsetX = offsetX;
		this.offsetY = offsetY;
	}

	updateTheme(theme: "light" | "dark"): void {
		this.theme = theme;
	}
}
