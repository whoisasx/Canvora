import { v4 as uuidv4 } from "uuid";
import {
	useCanvasBgStore,
	useSelectedMessageStore,
	useThemeStore,
	useZoomStore,
} from "@/utils/canvasStore";
import {
	arrowHead,
	arrowType,
	backArrow,
	CommonProps,
	edges,
	fill,
	fontFamily,
	fontSize,
	frontArrow,
	layers,
	Props,
	slopiness,
	strokeStyle,
	strokeWidth,
	textAlign,
	Tool,
} from "./types";
import rough from "roughjs";
import { RoughCanvas } from "roughjs/bin/canvas";
import { RoughGenerator } from "roughjs/bin/generator";
import { Drawable, Options } from "roughjs/bin/core";
import { createRoundedRectPath } from "./render/rectangle";
import { createRhombusPath } from "./render/rhombus";
import {
	normalizeCoords,
	roughOptions,
	normalizeStroke,
	normalizeWheelDelta,
	getResizeHandleAndCursor,
	Handle,
} from "./render";
import { createEllipsePath } from "./render/ellipse";
import { createLinePath } from "./render/line";
import { createArrowPath } from "./render/arrow";
import { createPencilPath } from "./render/pencil";
import {
	caveat,
	excali,
	firaCode,
	jakarta,
	monospace,
	nunito,
	sourceCode,
} from "../font";
import useToolStore, { useLockStore } from "@/utils/toolStore";
import {
	CommonPropsGame,
	useArrowTypeStore,
	useBackArrowStore,
	useBgStore,
	useEdgesStore,
	useFillStore,
	useFontFamilyStore,
	useFontSizeStore,
	useFrontArrowStore,
	useLayersStore,
	useOpacityStore,
	usePropsStore,
	useSlopinessStore,
	useStrokeStore,
	useStrokeStyleStore,
	useStrokeWidthStore,
	useTextAlignStore,
} from "@/utils/propsStore";
import { makeCircleCursor } from "./render/eraser";

type Laser = {
	x: number;
	y: number;
	alpha: number;
	width?: number;
};
export interface ITextData {
	text: string;
	fontSize: string;
	fontFamily: string;
	textColor: string;
	textAlign: string;
	pos: {
		x: number;
		y: number;
	};
}
export interface IIMageData {
	src: string;
	pos: {
		x: number;
		y: number;
	};
	w: number;
	h: number;
}

type BoundingBox = { x: number; y: number; w: number; h: number };

export type Message = {
	id: string;
	shape: Tool;
	shapeData: Drawable | Drawable[];
	opacity?: number;
	edges?: edges;
	arrowType?: arrowType;
	arrowHead?: arrowHead;
	textData?: ITextData;
	imageData?: IIMageData;
	boundingBox: BoundingBox;
	pencilPoints?: { x: number; y: number }[];
	lineData?: { x1: number; y1: number; x2: number; y2: number };
};

export class Game {
	private canvas: HTMLCanvasElement;
	private roomId: string;
	private ctx: CanvasRenderingContext2D;
	private clicked: boolean = false;
	private startX: number = 0;
	private startY: number = 0;
	private scale: number = 1;
	private offsetX: number = 0;
	private offsetY: number = 0;

	private prevX: number = 0;
	private prevY: number = 0;
	private isDragging: boolean = false;
	private isResizing: boolean = false;
	private resizeHandler: Handle = "none";

	private tool: Tool = "mouse";
	private theme: "light" | "dark" = useThemeStore.getState().theme;
	private lockClicked: boolean = false;
	private canvasbg: string = useCanvasBgStore.getState().background;
	private props: CommonPropsGame = usePropsStore.getState();

	private messages: Message[];
	private rc: RoughCanvas | null = null;
	private generator: RoughGenerator | null = null;
	private previewSeed: number | null = null;
	private imageSrc: string | null = null;
	private imageCache = new Map<string, HTMLImageElement>();

	private preSelectedMessage: Message | null = null;
	private selectedMessage =
		useSelectedMessageStore.getState().selectedMessage;

	private unsubscribeTheme: () => void;
	private unsubscribeZoom: () => void;
	private setZoom: (val: number) => void;
	private setTool: (val: Tool) => void;
	private setProps: (val: Tool) => void;
	private unsubscribeLock: () => void;
	private unsubscribeBg: () => void;
	private unsubscribeSelectedMessage: () => void;
	private setSelectedMessage: (val: Message | null) => void;

	private setStroke: (val: string) => void;
	private setBg: (val: string) => void;
	private setOpacity: (val: number) => void;
	private setFill: (val: fill) => void;
	private setStrokeWidth: (val: strokeWidth) => void;
	private setStrokeStyle: (val: strokeStyle) => void;
	private setSlopiness: (val: slopiness) => void;
	private setEdges: (val: edges) => void;
	private setLayers: (val: layers) => void;
	private setFontFamily: (val: fontFamily) => void;
	private setFontSize: (val: fontSize) => void;
	private setTextAlign: (val: textAlign) => void;
	private setArrowType: (val: arrowType) => void;
	private setFrontArrowHead: (val: frontArrow) => void;
	private setBackArrowHead: (val: backArrow) => void;

	private pencilPoints: { x: number; y: number }[] = [];
	private laserPoints: Laser[] = [];

	socket: WebSocket;

	constructor(socket: WebSocket, canvas: HTMLCanvasElement, roomId: string) {
		this.socket = socket;
		this.canvas = canvas;
		this.roomId = roomId;
		this.ctx = canvas.getContext("2d")!;

		this.messages = [];
		this.rc = rough.canvas(this.canvas);
		this.generator = rough.generator();

		this.initMouseEventHandler();
		this.initSocketHandler();
		this.initHandler();

		this.unsubscribeZoom = useZoomStore.subscribe(
			(state) => state.zoom,
			(newVal, prevVal) => {
				const centerX = this.canvas.width / 2;
				const centerY = this.canvas.height / 2;

				const worldX = (centerX - this.offsetX) / this.scale;
				const worldY = (centerY - this.offsetY) / this.scale;
				this.scale = newVal / 100;

				this.offsetX = centerX - worldX * this.scale;
				this.offsetY = centerY - worldY * this.scale;

				this.applyTransform();
			}
		);
		this.setZoom = useZoomStore.getState().setZoom;
		this.unsubscribeTheme = useThemeStore.subscribe(
			(state) => state.theme,
			(newVal, prevVal) => {
				this.theme = newVal;
				this.renderCanvas();
			}
		);
		this.setTool = useToolStore.getState().setTool;
		this.setProps = useToolStore.getState().setProps;
		this.unsubscribeLock = useLockStore.subscribe(
			(state) => state.lockClicked,
			(newVal, prevVal) => {
				this.lockClicked = newVal;
			}
		);
		this.unsubscribeBg = useCanvasBgStore.subscribe(
			(state) => state.background,
			(newVal, prevVal) => {
				this.canvasbg = newVal;
			}
		);
		this.unsubscribeSelectedMessage = useSelectedMessageStore.subscribe(
			(state) => state.selectedMessage,
			(newVal, prevVal) => {
				this.selectedMessage = newVal;
				this.renderCanvas();
			}
		);
		this.setSelectedMessage =
			useSelectedMessageStore.getState().setSelectedMessage;

		this.setStroke = useStrokeStore.getState().setCurrentColor;
		this.setBg = useBgStore.getState().setCurrentColor;
		this.setOpacity = useOpacityStore.getState().setOpacity;
		this.setFill = useFillStore.getState().setFill;
		this.setStrokeWidth = useStrokeWidthStore.getState().setWidth;
		this.setStrokeStyle = useStrokeStyleStore.getState().setStyle;
		this.setSlopiness = useSlopinessStore.getState().setSlopiness;
		this.setEdges = useEdgesStore.getState().setEdges;
		this.setLayers = useLayersStore.getState().setLayers;
		this.setFontFamily = useFontFamilyStore.getState().setFontFamily;
		this.setFontSize = useFontSizeStore.getState().setFontSize;
		this.setTextAlign = useTextAlignStore.getState().setTextAlign;
		this.setArrowType = useArrowTypeStore.getState().setArrowType;
		this.setFrontArrowHead =
			useFrontArrowStore.getState().setFrontArrowType;
		this.setBackArrowHead = useBackArrowStore.getState().setBackArrowType;
	}

	/** ------------------------------------------------------------------- */
	initHandler() {
		//TODO: fetch the messages from the database, push it to the existing shapes and render the canvas.
	}
	initSocketHandler() {
		//TODO: on every message recieved, push it to the existing shapes and render the canvas.
		this.socket.onmessage = (e: MessageEvent) => {
			const parsedData = JSON.parse(e.data);
			if (parsedData.type === "shape") {
				const message: Message = parsedData.message;
				this.messages.push(message);
				this.renderCanvas();
			}
			if (parsedData.type === "delete") {
				const id = parsedData.id;
				this.messages = this.messages.filter(
					(message) => id !== message.id
				);

				this.renderCanvas();
			}
			if (parsedData.type === "update") {
				const id = parsedData.id;
				this.messages = this.messages.map((message) => {
					if (message.id === id) {
						return { ...parsedData.newMessage };
					}
					return message;
				});
				this.renderCanvas();
			}
		};
	}

	applyTransform() {
		this.ctx.setTransform(
			this.scale,
			0,
			0,
			this.scale,
			this.offsetX,
			this.offsetY
		);
		this.renderCanvas();
	}

	selectTool(tool: Tool, props: CommonPropsGame) {
		this.tool = tool;
		this.props = props;
		if (this.selectedMessage) this.handlePropsChange();

		switch (tool) {
			case "pencil":
				this.canvas.style.cursor = "crosshair";
				break;
			case "rectangle":
			case "rhombus":
			case "arc":
			case "line":
			case "arrow":
			case "text":
			case "laser":
				this.canvas.style.cursor = "crosshair";
				break;
			case "hand":
				this.canvas.style.cursor = "grab";
				break;
			case "eraser":
				const cursor = makeCircleCursor(16);
				this.canvas.style.cursor = cursor;
				break;
			case "mouse":
			default:
				this.canvas.style.cursor = "default";
				break;
		}

		if (tool === "image") {
			this.handleImageUpload();
		}
	}

	getMousePos = (e: MouseEvent) => {
		const rect = this.canvas.getBoundingClientRect();

		const screenX = e.clientX - rect.x;
		const screenY = e.clientY - rect.y;

		const worldX = (screenX - this.offsetX) / this.scale;
		const worldY = (screenY - this.offsetY) / this.scale;
		return {
			x: worldX,
			y: worldY,
		};
	};

	renderCanvas() {
		this.ctx.clearRect(
			-this.offsetX / this.scale,
			-this.offsetY / this.scale,
			this.canvas.width / this.scale,
			this.canvas.height / this.scale
		);

		for (const message of this.messages) {
			if (!message) return;

			if (message.shape === "rectangle") this.drawRect(message);
			else if (message.shape === "rhombus") this.drawRhombus(message);
			else if (message.shape === "arc") this.drawEllipse(message);
			else if (message.shape === "line") this.drawLine(message);
			else if (message.shape === "arrow") this.drawArrow(message);
			else if (message.shape === "pencil") this.drawPencil(message);
			else if (message.shape === "text") this.drawText(message);
			else if (message.shape === "image") this.drawImage(message);
		}
		if (this.selectedMessage) {
			this.setProps(this.selectedMessage.shape as Tool);
			this.setSelectedProps(this.selectedMessage);
			this.handleSelectedMessage(this.selectedMessage);
			this.preSelectedMessage = null;
		}
		if (this.tool == "laser") this.drawMovingLaser();
	}

	// --------------------------------------------------------- Events

	handleMouseDown = (e: PointerEvent) => {
		const pos = this.getMousePos(e);
		this.startX = pos.x;
		this.startY = pos.y;

		if (this.tool === "mouse") {
			if (this.selectedMessage) {
				if (this.preSelectedMessage) {
					if (this.selectedMessage === this.preSelectedMessage) {
						this.isDragging = true;
						this.prevX = pos.x;
						this.prevY = pos.y;
						this.preSelectedMessage = null;
					} else {
						this.selectedMessage = this.preSelectedMessage;
						this.setSelectedMessage(this.preSelectedMessage);
						this.preSelectedMessage = null;
						this.setProps(this.selectedMessage.shape as Tool);
						this.setSelectedProps(this.selectedMessage);
						this.renderCanvas();
						this.handleSelectedMessage(this.selectedMessage);
						return;
					}
				} else {
					if (this.canvas.style.cursor.includes("resize")) {
						this.isResizing = true;
						this.prevX = pos.x;
						this.prevY = pos.y;
					} else if (this.canvas.style.cursor === "move") {
						this.isDragging = true;
						this.prevX = pos.x;
						this.prevY = pos.y;
					} else {
						this.selectedMessage = null;
						this.setSelectedMessage(null);
						this.setTool("mouse" as Tool);
						this.setProps("mouse" as Tool);
						this.renderCanvas();
						return;
					}
				}
			} else {
				if (this.preSelectedMessage) {
					this.selectedMessage = this.preSelectedMessage;
					this.setSelectedMessage(this.preSelectedMessage);
					this.preSelectedMessage = null;
					this.setProps(this.selectedMessage.shape as Tool);
					this.setSelectedProps(this.selectedMessage);
					this.renderCanvas();
					this.handleSelectedMessage(this.selectedMessage);
					return;
				} else return;
			}
		}
		if (this.tool === "text" && document.querySelector("textarea")) {
			this.clicked = false;
			return;
		}

		this.clicked = true;
		this.previewSeed = Math.floor(Math.random() * 1000000);
		if (this.tool === "pencil") this.pencilPoints.push(pos);
		if (this.tool === "text") {
			this.handleTextInput(e);
		}
		if (this.tool === "image") {
			this.messageImage(pos);
			this.clicked = false;
			this.setTool("mouse" as Tool);
			this.setProps("mouse" as Tool);
		}
		if (this.tool === "eraser") {
			this.eraseDrawing(pos);
		}
	};

	handleMouseUp = (e: PointerEvent) => {
		if (this.tool === "mouse" && !this.clicked) return;
		this.clicked = false;

		if (this.tool === "laser") {
			this.laserPoints = [];
			return;
		}
		if (this.tool === "mouse") {
			this.socket.send(
				JSON.stringify({
					type: "update-message",
					id: this.selectedMessage!.id,
					newMessage: this.selectedMessage,
					roomId: this.roomId,
				})
			);
			this.isDragging = false;
			this.isResizing = false;
			this.resizeHandler = "none";
			this.prevX = 0;
			this.prevY = 0;
		}
		const pos = this.getMousePos(e);
		const w = pos.x - this.startX;
		const h = pos.y - this.startY;

		if (!this.generator || !this.props) return;
		let message: Message | null = null;

		if (this.tool === "rectangle") message = this.messageRect(w, h);
		else if (this.tool === "rhombus") message = this.messageRhombus(w, h);
		else if (this.tool === "arc") message = this.messageEllipse(w, h);
		else if (this.tool === "line") message = this.messageLine(w, h);
		else if (this.tool === "arrow") message = this.messageArrow(w, h);
		else if (this.tool === "pencil") {
			message = this.messagePencil();
			this.pencilPoints = [];
		}

		this.previewSeed = null;
		if (!message) return;
		this.socket.send(
			JSON.stringify({
				type: "shape",
				message,
				roomId: this.roomId,
			})
		);

		if (this.lockClicked) return;

		if (
			this.tool === "rectangle" ||
			this.tool === "rhombus" ||
			this.tool === "arc" ||
			this.tool === "line" ||
			this.tool === "arrow" ||
			this.tool === "pencil" ||
			this.tool === "text"
		) {
			this.setTool("mouse" as Tool);
			this.setProps("mouse" as Tool);
		}
	};
	handleMouseMove = (e: PointerEvent) => {
		const pos = this.getMousePos(e);
		const w = pos.x - this.startX;
		const h = pos.y - this.startY;

		if (this.tool === "mouse" && !this.clicked) {
			this.selectShapeHover(pos);
			return;
		}

		if (!this.clicked) {
			return;
		}
		if (this.tool === "hand") {
			const rect = this.canvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			const dx = (mouseX - this.startX) / this.scale;
			const dy = (mouseY - this.startY) / this.scale;

			this.offsetX += dx;
			this.offsetY += dy;

			this.startX = mouseX;
			this.startY = mouseY;

			this.applyTransform();
			return;
		}

		if (this.tool === "mouse") {
			if (this.isResizing)
				this.canvas.style.cursor = this.resizeHandler + "-resize";
			else if (this.isDragging) this.canvas.style.cursor = "move";
			this.handleMouseDrag(pos);
			return;
		}
		this.renderCanvas();
		if (this.tool === "eraser") {
			this.eraseDrawing(pos);
			return;
		}
		if (this.tool === "laser") {
			this.laserPoints.push({ x: pos.x, y: pos.y, alpha: 1, width: 5 });
			return;
		}

		if (!this.rc || !this.generator) return;
		const options: Options = roughOptions(this.props);
		if (this.tool === "rectangle") {
			this.drawMovingRect(w, h, options);
		} else if (this.tool === "rhombus") {
			this.drawMovingRhombus(w, h, options);
		} else if (this.tool === "arc") {
			this.drawMovingEllipse(w, h, options);
		} else if (this.tool === "line") {
			this.drawMovingLine(w, h, options);
		} else if (this.tool === "arrow") {
			this.drawMovingArrow(w, h, options);
		} else if (this.tool === "pencil") {
			this.pencilPoints.push(pos);
			this.drawMovingPencil(options);
		} else if (this.tool === "image") {
			this.drawMovingImage(pos);
		}
	};

	handleWheel = (e: WheelEvent) => {
		e.preventDefault();
		if (e.ctrlKey) {
			const delta = normalizeWheelDelta(e);
			const zoomIntesity = 0.001;
			const zoomFactor = 1 - delta * zoomIntesity;

			const mouseX = e.offsetX;
			const mouseY = e.offsetY;

			const worldX = (mouseX - this.offsetX) / this.scale;
			const worldY = (mouseY - this.offsetY) / this.scale;

			const tempScale = this.scale * zoomFactor;
			if (tempScale < 0.1 || tempScale > 30) return;

			this.scale = tempScale;
			this.scale = Math.max(0.1, Math.min(30, this.scale));

			this.offsetX = mouseX - worldX * this.scale;
			this.offsetY = mouseY - worldY * this.scale;

			this.setZoom(Math.round(this.scale * 100));
		} else {
			this.offsetX -= e.deltaX;
			this.offsetY -= e.deltaY;
		}
		this.applyTransform();
	};

	//---------------------------------------------------------------

	private boundMouseDown = this.handleMouseDown.bind(this);
	private boundMouseUp = this.handleMouseUp.bind(this);
	private boundMouseMove = this.handleMouseMove.bind(this);
	private boundWheel = this.handleWheel.bind(this);

	initMouseEventHandler() {
		this.canvas.addEventListener("pointerdown", this.boundMouseDown);
		this.canvas.addEventListener("pointermove", this.boundMouseMove);
		this.canvas.addEventListener("pointerup", this.boundMouseUp);

		this.canvas.addEventListener("wheel", this.boundWheel, {
			passive: false,
		});
	}

	destructor() {
		this.canvas.removeEventListener("pointerdown", this.boundMouseDown);
		this.canvas.removeEventListener("pointermove", this.boundMouseMove);
		this.canvas.removeEventListener("pointerup", this.boundMouseUp);
		this.canvas.removeEventListener("wheel", this.boundWheel);

		this.unsubscribeZoom();
		this.unsubscribeTheme();
		this.unsubscribeLock();
		this.unsubscribeBg();
		this.unsubscribeSelectedMessage();
	}

	// !rectangle
	messageRect(w: number, h: number): Message {
		const options = roughOptions(this.props);
		let shapeData: Drawable | null = null;

		const rect = normalizeCoords(this.startX, this.startY, w, h);
		if (this.props.edges === "round") {
			const path = createRoundedRectPath(rect.x, rect.y, rect.w, rect.h);

			shapeData = this.generator!.path(path, {
				...options,
				seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
			});
		} else {
			shapeData = this.generator!.rectangle(
				this.startX,
				this.startY,
				w,
				h,
				{
					...options,
					seed:
						this.previewSeed ?? Math.floor(Math.random() * 1000000),
				}
			);
		}
		return {
			id: uuidv4(),
			shape: "rectangle" as Tool,
			opacity: this.props.opacity,
			edges: this.props.edges,
			shapeData,
			boundingBox: rect,
		};
	}
	drawRect(message: Message) {
		if (!this.rc) return;
		this.ctx.save();

		if (Array.isArray(message.shapeData)) return;
		this.ctx.globalAlpha = message.opacity ?? 1;
		this.ctx.lineJoin = "round";
		this.ctx.lineCap = "round";

		message.shapeData.options.stroke = normalizeStroke(
			this.theme,
			message.shapeData.options.stroke
		);
		this.rc.draw(message.shapeData);

		this.ctx.restore();
	}
	drawMovingRect(w: number, h: number, options: Options) {
		this.ctx.save();

		this.ctx.globalAlpha = this.props.opacity ?? 1;
		this.ctx.lineJoin = "round";
		this.ctx.lineCap = "round";
		if (this.props.edges === "round") {
			const rect = normalizeCoords(this.startX, this.startY, w, h);
			const path = createRoundedRectPath(rect.x, rect.y, rect.w, rect.h);
			const drawable = this.generator!.path(path, {
				...options,
				seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
			});
			this.rc!.draw(drawable);
		} else {
			this.rc!.rectangle(this.startX, this.startY, w, h, {
				...options,
				seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
			});
		}

		this.ctx.restore();
	}
	// !rhombus
	messageRhombus(w: number, h: number): Message {
		const options = roughOptions(this.props);
		let shapeData: Drawable | null = null;

		const rect = normalizeCoords(this.startX, this.startY, w, h);
		const path = createRhombusPath(
			rect.x,
			rect.y,
			rect.w,
			rect.h,
			this.props.edges === "round" ? true : false
		);
		shapeData = this.generator!.path(path, {
			...options,
			seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
		});

		return {
			id: uuidv4(),
			shape: "rhombus" as Tool,
			opacity: this.props.opacity,
			edges: this.props.edges,
			shapeData,
			boundingBox: rect,
		};
	}
	drawRhombus(message: Message) {
		if (!this.rc) return;
		this.ctx.save();

		if (Array.isArray(message.shapeData)) return;
		this.ctx.globalAlpha = message.opacity ?? 1;
		this.ctx.lineJoin = "round";
		this.ctx.lineCap = "round";

		message.shapeData.options.stroke = normalizeStroke(
			this.theme,
			message.shapeData.options.stroke
		);

		this.rc.draw(message.shapeData);

		this.ctx.restore();
	}
	drawMovingRhombus(w: number, h: number, options: Options) {
		this.ctx.save();

		this.ctx.globalAlpha = this.props.opacity ?? 1;
		this.ctx.lineJoin = "round";
		this.ctx.lineCap = "round";

		const rect = normalizeCoords(this.startX, this.startY, w, h);
		const path = createRhombusPath(
			rect.x,
			rect.y,
			rect.w,
			rect.h,
			this.props.edges === "round" ? true : false
		);

		const drawable = this.generator!.path(path, {
			...options,
			seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
		});
		this.rc!.draw(drawable);

		this.ctx.restore();
	}
	// !ellipse
	messageEllipse(w: number, h: number): Message {
		const options = roughOptions(this.props);
		const rect = normalizeCoords(this.startX, this.startY, w, h);

		const path = createEllipsePath(rect.x, rect.y, rect.w, rect.h);
		const shapeData = this.generator!.path(path, {
			...options,
			seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
		});

		return {
			id: uuidv4(),
			shape: "arc" as Tool,
			opacity: this.props.opacity,
			shapeData,
			boundingBox: rect,
		};
	}
	drawEllipse(message: Message) {
		this.ctx.save();
		if (!this.rc) return;

		if (Array.isArray(message.shapeData)) return;
		this.ctx.globalAlpha = message.opacity ?? 1;
		message.shapeData.options.stroke = normalizeStroke(
			this.theme,
			message.shapeData.options.stroke
		);

		this.rc.draw(message.shapeData);
		this.ctx.restore();
	}
	drawMovingEllipse(w: number, h: number, options: Options) {
		this.ctx.save();

		this.ctx.globalAlpha = this.props.opacity ?? 1;

		const rect = normalizeCoords(this.startX, this.startY, w, h);
		const path = createEllipsePath(rect.x, rect.y, rect.w, rect.h);

		const drawable = this.generator!.path(path, {
			...options,
			seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
		});
		this.rc!.draw(drawable);

		this.ctx.restore();
	}
	// !line
	messageLine(w: number, h: number): Message {
		const options = roughOptions(this.props);
		const x2 = this.startX + w;
		const y2 = this.startY + h;

		const rect = normalizeCoords(this.startX, this.startY, w, h);
		const path = createLinePath(this.startX, this.startY, x2, y2);
		const shapeData = this.generator!.path(path, {
			...options,
			seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
		});

		return {
			id: uuidv4(),
			shape: "line" as Tool,
			opacity: this.props.opacity,
			edges: this.props.edges,
			shapeData,
			boundingBox: {
				x: rect.x,
				y: rect.y,
				w: rect.w,
				h: rect.h,
			},
			lineData: { x1: this.startX, y1: this.startY, x2, y2 },
		};
	}
	drawLine(message: Message) {
		if (!this.rc) return;
		this.ctx.save();

		if (Array.isArray(message.shapeData)) return;
		this.ctx.globalAlpha = message.opacity ?? 1;

		message.shapeData.options.stroke = normalizeStroke(
			this.theme,
			message.shapeData.options.stroke
		);
		this.rc.draw(message.shapeData);

		this.ctx.restore();
	}
	drawMovingLine(w: number, h: number, options: Options) {
		this.ctx.save();

		this.ctx.globalAlpha = this.props.opacity ?? 1;
		// const rect = normalizeCoords(this.startX, this.startY, w, h);
		const x2 = this.startX + w;
		const y2 = this.startY + h;
		const path = createLinePath(this.startX, this.startY, x2, y2);
		const drawable = this.generator!.path(path, {
			...options,
			seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
		});
		this.rc!.draw(drawable);

		this.ctx.restore();
	}
	// !arrow
	messageArrow(w: number, h: number): Message {
		const options = roughOptions(this.props);
		const x2 = this.startX + w;
		const y2 = this.startY + h;

		const rect = normalizeCoords(this.startX, this.startY, w, h);
		const front = this.props.arrowHead!.front!;
		const back = this.props.arrowHead!.back!;
		const arrow_type = this.props.arrowType;

		const { linePath, frontHeadPath, backHeadPath } = createArrowPath(
			this.startX,
			this.startY,
			x2,
			y2,
			front,
			back,
			arrow_type!
		);

		let shapeData: Drawable[] = [];

		if (linePath) {
			const lineDrawable = this.generator!.path(linePath, {
				...options,
				seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
			});
			shapeData.push(lineDrawable);
		}
		if (frontHeadPath) {
			const frontHeadDrawable = this.generator!.path(frontHeadPath, {
				...options,
				fill: front === "triangle" ? this.props.stroke : undefined,
				fillStyle: front === "triangle" ? "solid" : undefined,
				seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
			});
			shapeData.push(frontHeadDrawable);
		}
		if (backHeadPath) {
			const backHeadDrawable = this.generator!.path(backHeadPath, {
				...options,
				fill: back === "triangle" ? this.props.stroke : undefined,
				fillStyle: back === "triangle" ? "solid" : undefined,
				seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
			});
			shapeData.push(backHeadDrawable);
		}

		return {
			id: uuidv4(),
			shape: "arrow" as Tool,
			opacity: this.props.opacity,
			arrowHead: this.props.arrowHead,
			arrowType: this.props.arrowType,
			shapeData,
			boundingBox: {
				x: rect.x,
				y: rect.y,
				w: rect.w,
				h: rect.h,
			},
			lineData: { x1: this.startX, y1: this.startY, x2, y2 },
		};
	}
	drawArrow(message: Message) {
		if (!this.ctx) return;
		this.ctx.save();

		if (!Array.isArray(message.shapeData)) return;
		this.ctx.globalAlpha = message.opacity ?? 1;

		for (let shape of message.shapeData) {
			shape.options.stroke = normalizeStroke(
				this.theme,
				shape.options.stroke
			);
			this.rc!.draw(shape);
		}

		this.ctx.restore();
	}
	drawMovingArrow(w: number, h: number, options: Options) {
		this.ctx.save();

		this.ctx.globalAlpha = this.props.opacity!;
		const x2 = this.startX + w;
		const y2 = this.startY + h;

		const front = this.props.arrowHead!.front!;
		const back = this.props.arrowHead!.back!;
		const arrow_type = this.props.arrowType;

		const { linePath, frontHeadPath, backHeadPath } = createArrowPath(
			this.startX,
			this.startY,
			x2,
			y2,
			front,
			back,
			arrow_type!
		);

		if (linePath) {
			const lineDrawable = this.generator!.path(linePath, {
				...options,
				seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
			});
			this.rc!.draw(lineDrawable);
		}
		if (frontHeadPath) {
			const headDrawable = this.generator!.path(frontHeadPath, {
				...options,
				fill: front === "triangle" ? this.props.stroke : undefined,
				fillStyle: front === "triangle" ? "solid" : undefined,
				seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
			});
			this.rc!.draw(headDrawable);
		}
		if (backHeadPath) {
			const headDrawable = this.generator!.path(backHeadPath, {
				...options,
				fill: back === "triangle" ? this.props.stroke : undefined,
				fillStyle: back === "triangle" ? "solid" : undefined,
				seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
			});
			this.rc!.draw(headDrawable);
		}

		this.ctx.restore();
	}
	// !pencil
	messagePencil(): Message {
		const options = roughOptions(this.props);

		const path = createPencilPath(this.pencilPoints);
		const shapeData = this.generator!.path(path, {
			...options,
			strokeWidth: options.strokeWidth! * 2,
			roughness: 0,
			bowing: 0,
			seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
		});

		let minx = Number.MAX_VALUE,
			miny = Number.MAX_VALUE;
		let maxx = Number.MIN_VALUE, // ✅ fix
			maxy = Number.MIN_VALUE; // ✅ fix

		for (let point of this.pencilPoints) {
			let x = point.x,
				y = point.y;
			minx = Math.min(minx, x);
			maxx = Math.max(maxx, x);
			miny = Math.min(miny, y);
			maxy = Math.max(maxy, y);
		}

		return {
			id: uuidv4(),
			shape: "pencil" as Tool,
			opacity: this.props.opacity,
			shapeData,
			boundingBox: {
				x: minx,
				y: miny,
				w: maxx - minx,
				h: maxy - miny,
			},
			pencilPoints: this.pencilPoints,
		};
	}
	drawPencil(message: Message) {
		if (!this.rc) return;
		this.ctx.save();

		if (Array.isArray(message.shapeData)) return;
		this.ctx.globalAlpha = message.opacity ?? 1;

		message.shapeData.options.stroke = normalizeStroke(
			this.theme,
			message.shapeData.options.stroke
		);
		this.rc.draw(message.shapeData);

		this.ctx.restore();
	}
	drawMovingPencil(options: Options) {
		this.ctx.save();

		if (this.pencilPoints.length < 1) return;
		const path = createPencilPath(this.pencilPoints);
		const drawable = this.generator!.path(path, {
			...options,
			strokeWidth: options.strokeWidth! * 2,
			roughness: 0,
			bowing: 0,
			seed: this.previewSeed ?? Math.floor(Math.random() * 1000000),
		});
		this.rc!.draw(drawable);

		this.ctx.restore();
	}
	// !text
	handleTextInput(e: PointerEvent) {
		e.preventDefault();
		const pos = this.getMousePos(e);

		const textarea = document.createElement("textarea");

		textarea.style.fontFamily = excali.style.fontFamily;
		if (this.props.fontFamily === "caveat")
			textarea.style.fontFamily = caveat.style.fontFamily;
		if (this.props.fontFamily === "excali")
			textarea.style.fontFamily = excali.style.fontFamily;
		if (this.props.fontFamily === "firaCode")
			textarea.style.fontFamily = firaCode.style.fontFamily;
		if (this.props.fontFamily === "jakarta")
			textarea.style.fontFamily = jakarta.style.fontFamily;
		if (this.props.fontFamily === "sourceCode")
			textarea.style.fontFamily = sourceCode.style.fontFamily;
		if (this.props.fontFamily === "monospace")
			textarea.style.fontFamily = monospace.style.fontFamily;
		if (this.props.fontFamily === "nunito")
			textarea.style.fontFamily = nunito.style.fontFamily;
		textarea.style.fontSize = `${this.props.fontSize! * this.scale}px`; //16,24,32,48
		textarea.style.color = this.props.stroke!;
		const fontWeightMap: Record<number, string> = {
			16: "400",
			24: "500",
			32: "600",
			48: "700",
		};
		textarea.style.fontWeight =
			fontWeightMap[this.props.fontSize!] || "400";
		textarea.style.opacity = `${this.props.opacity}`;
		textarea.style.textAlign = this.props.textAlign!;

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
			minHeight: `${this.props.fontSize! * 1.2}px`,
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
			const lineHeight = Math.round(this.props.fontSize! * 1.2);

			if (span && document.body.contains(span)) {
				document.body.removeChild(span);
			}
			span = document.createElement("span");

			span.style.fontFamily = textarea.style.fontFamily;
			span.style.fontSize = `${this.props.fontSize! * this.scale}px`;
			span.style.lineHeight = `${lineHeight}px`;
			span.style.opacity = textarea.style.opacity;

			Object.assign(span.style, {
				visibility: "hidden",
				position: "absolute",
				whiteSpace: "pre",
				padding: textarea.style.padding,
				fontWeight: textarea.style.fontWeight,
			});
			span.textContent = textarea.value || " "; // avoid zero width
			document.body.appendChild(span);

			// width adjust
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

			const dummyPath = `M${pos.x},${pos.y} L${pos.x + 1},${pos.y}`;
			const dummyShapeData = this.generator!.path(dummyPath, {});

			const tempValue = textarea.value.trim();
			const totalLines = tempValue.split("\n").length;
			// Convert measurements taken in screen pixels back to world coordinates
			// width and height were measured from a hidden span at scaled font size
			// convert measured dimensions (screen pixels) back to world coordinates
			const bboxWidthWorld = width / this.scale;
			const bboxHeightWorld = Math.max(
				(height || totalLines * this.props.fontSize! * this.scale) /
					this.scale,
				this.props.fontSize!
			);

			const message: Message = {
				id: uuidv4(),
				shape: "text" as Tool,
				shapeData: dummyShapeData,
				opacity: this.props.opacity,
				textData: {
					text,
					fontFamily: this.props.fontFamily!,
					fontSize: `${this.props.fontSize}px`,
					textColor: this.props.stroke!,
					textAlign: this.props.textAlign!,
					pos,
				},
				// store bounding box in world coordinates so hit testing and rendering align
				boundingBox: {
					x: pos.x,
					y: pos.y,
					w: bboxWidthWorld,
					h: bboxHeightWorld,
				},
			};

			this.socket.send(
				JSON.stringify({
					type: "shape",
					message,
					roomId: this.roomId,
				})
			);

			if (textarea.parentNode) textarea.remove();
			this.setTool("mouse" as Tool);
			this.setProps("mouse" as Tool);
			this.clicked = false;
			return;
		};

		textarea.addEventListener("blur", () => {
			if (textarea.value.trim() !== "") messageText();
			else {
				if (textarea.parentNode) textarea.remove();
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
			resize();
		});
		textarea.addEventListener("input", resize);

		textarea.focus();
	}
	drawText(message: Message) {
		if (!message.textData) return;

		let lines: string[] = [];
		if (message.textData.text.includes("\n")) {
			lines = message.textData.text.split("\n");
		} else {
			lines.push(message.textData.text);
		}

		let fontFamily: string = "";
		if (message.textData.fontFamily === "caveat")
			fontFamily = caveat.style.fontFamily;
		if (message.textData.fontFamily === "excali")
			fontFamily = excali.style.fontFamily;
		if (message.textData.fontFamily === "firaCode")
			fontFamily = firaCode.style.fontFamily;
		if (message.textData.fontFamily === "jakarta")
			fontFamily = jakarta.style.fontFamily;
		if (message.textData.fontFamily === "sourceCode")
			fontFamily = sourceCode.style.fontFamily;
		if (message.textData.fontFamily === "monospace")
			fontFamily = monospace.style.fontFamily;
		if (message.textData.fontFamily === "nunito")
			fontFamily = nunito.style.fontFamily;

		this.ctx.save();
		this.ctx.globalAlpha = message.opacity ?? 1;
		this.ctx.font = `${message.textData.fontSize} ${fontFamily}`;
		// use top baseline so y corresponds to top of text box
		this.ctx.textBaseline = "top";
		this.ctx.textAlign = (message.textData.textAlign ||
			"left") as CanvasTextAlign;
		this.ctx.fillStyle = normalizeStroke(
			this.theme,
			message.textData.textColor
		);

		const x = message.textData.pos.x;
		const y = message.textData.pos.y;
		// textarea used `padding: "4px 8px"` in screen pixels.
		// Convert that to world units so canvas rendering lines up with the textarea.
		const topPaddingWorld = 8 / this.scale; // 8px top padding (increased per requirement)
		const leftPaddingWorld = 8 / this.scale; // 8px horizontal padding
		const fontSizeNum = parseInt(message.textData.fontSize);
		const lineHeight = fontSizeNum * 1.5;

		// bounding box width is stored in world units
		const bboxW = message.boundingBox.w;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i] || "";
			let drawX = x;

			if (message.textData.textAlign === "center") {
				// center within the bounding box
				const textW = this.ctx.measureText(line).width;
				drawX = x + bboxW / 2;
				this.ctx.textAlign = "center";
			} else if (message.textData.textAlign === "right") {
				// right align to bounding box right edge
				drawX = x + bboxW;
				this.ctx.textAlign = "right";
			} else {
				// left align -> use same left padding as the textarea
				drawX = x + leftPaddingWorld;
				this.ctx.textAlign = "left";
			}

			this.ctx.fillText(
				line,
				drawX,
				y + topPaddingWorld + i * lineHeight
			);
		}

		this.ctx.restore();
	}
	// !image
	handleImageUpload() {
		this.clicked = true;
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = (e: Event) => {
			const target = e.target as HTMLInputElement;
			const file = target.files?.[0];
			if (!file) {
				if (input.parentNode) input.remove();
				this.setTool("mouse" as Tool);
				this.setProps("mouse" as Tool);
				return;
			}

			const reader = new FileReader();
			reader.onload = () => {
				this.imageSrc = reader.result as string;
			};
			reader.readAsDataURL(file);

			if (input.parentNode) input.remove();
			return;
		};
		input.click();
	}
	drawMovingImage(pos: { x: number; y: number }) {
		if (!this.imageSrc) return;
		const img = new Image();
		img.src = this.imageSrc;

		img.onload = () => {
			this.ctx.save();
			this.ctx.globalAlpha = this.props.opacity!;

			this.ctx.drawImage(img, pos.x, pos.y, 150, 150);

			this.ctx.restore();
		};
	}
	messageImage(pos: { x: number; y: number }) {
		if (!this.imageSrc) return;

		const dummyPath = `M${pos.x},${pos.y} L${pos.x + 1},${pos.y}`;
		const dummyShapeData = this.generator!.path(dummyPath, {});

		const img = new Image();
		img.src = this.imageSrc;

		const { opacity, edges } = this.props;
		const { roomId } = this;

		img.onload = () => {
			const message: Message = {
				id: uuidv4(),
				shape: "image",
				shapeData: dummyShapeData,
				opacity,
				edges,
				imageData: {
					src: this.imageSrc!,
					pos,
					w: img.naturalWidth,
					h: img.naturalHeight,
				},
				boundingBox: {
					x: pos.x,
					y: pos.y,
					w: img.naturalWidth,
					h: img.naturalHeight,
				},
			};

			this.socket.send(
				JSON.stringify({
					type: "shape",
					message,
					roomId,
				})
			);

			this.imageSrc = null;
		};
	}
	drawImage(message: Message) {
		const { boundingBox, imageData, opacity, edges } = message;
		if (!boundingBox || !imageData) return;
		let img = this.imageCache.get(message.id);
		if (!img) {
			img = new Image();
			img.src = imageData.src;
			img.onload = () => {
				this.imageCache.set(message.id, img!);
				this.renderCanvas();
			};
			return;
		}

		const { x, y, w, h } = boundingBox;

		this.ctx.save();

		// 1. Apply opacity
		this.ctx.globalAlpha = opacity ?? 1;

		// 2. Clip for rounded edges
		if (edges === "round") {
			const r = 50;

			this.ctx.beginPath();
			this.ctx.moveTo(x + r, y);
			this.ctx.lineTo(x + w - r, y);
			this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
			this.ctx.lineTo(x + w, y + h - r);
			this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
			this.ctx.lineTo(x + r, y + h);
			this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
			this.ctx.lineTo(x, y + r);
			this.ctx.quadraticCurveTo(x, y, x + r, y);
			this.ctx.closePath();

			this.ctx.clip(); // 👈 clip inside rounded rect
		}

		// 3. Draw image inside clip
		this.ctx.drawImage(img, x, y, w, h);

		this.ctx.restore();
	}

	// !eraser
	eraseDrawing(pos: { x: number; y: number }) {
		for (let i = this.messages.length - 1; i >= 0; i--) {
			const message = this.messages[i]!;
			let foundMessage: boolean = false;

			if (message.shape === "line" || message.shape === "arrow") {
				const { x1, y1, x2, y2 } = message.lineData!;
				if (this.pointNearLine(pos.x, pos.y, x1, y1, x2, y2, 8)) {
					foundMessage = true;
					this.socket.send(
						JSON.stringify({
							type: "delete-message",
							id: message.id,
							roomId: this.roomId,
						})
					);
				}
			} else if (message.shape === "pencil" && message.pencilPoints) {
				for (let i = 0; i < message.pencilPoints.length - 1; i++) {
					const p1 = message.pencilPoints[i];
					const p2 = message.pencilPoints[i + 1];
					if (
						this.pointNearLine(
							pos.x,
							pos.y,
							p1!.x,
							p1!.y,
							p2!.x,
							p2!.y,
							8
						)
					) {
						foundMessage = true;
						this.socket.send(
							JSON.stringify({
								type: "delete-message",
								id: message.id,
								roomId: this.roomId,
							})
						);
					}
				}
			} else if (message.shape === "image" || message.shape === "text") {
				const { x, y, w, h } = this.getBoundindBox(message);
				const bounded =
					pos.x >= x &&
					pos.x <= x + w &&
					pos.y >= y &&
					pos.y <= y + h;

				if (bounded) {
					this.socket.send(
						JSON.stringify({
							type: "delete-message",
							id: message.id,
							roomId: this.roomId,
						})
					);
					foundMessage = true;
				}
			} else if (message.shape === "rectangle") {
				const rect = message.boundingBox;
				const top = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x,
					rect.y,
					rect.x + rect.w,
					rect.y,
					10
				);
				const right = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x + rect.w,
					rect.y,
					rect.x + rect.w,
					rect.y + rect.h,
					10
				);
				const bottom = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x,
					rect.y + rect.h,
					rect.x + rect.w,
					rect.y + rect.h,
					10
				);
				const left = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x,
					rect.y,
					rect.x,
					rect.y + rect.h,
					10
				);
				if (top || right || bottom || left) {
					this.socket.send(
						JSON.stringify({
							type: "delete-message",
							id: message.id,
							roomId: this.roomId,
						})
					);
					foundMessage = true;
				}
			} else if (message.shape === "rhombus") {
				const rect = message.boundingBox;
				const top = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x + rect.w / 2,
					rect.y,
					rect.x + rect.w,
					rect.y + rect.h / 2,
					10
				);
				const right = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x + rect.w,
					rect.y + rect.h / 2,
					rect.x + rect.w / 2,
					rect.y + rect.h,
					10
				);
				const bottom = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x,
					rect.y + rect.h / 2,
					rect.x + rect.w / 2,
					rect.y + rect.h,
					10
				);
				const left = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x + rect.w / 2,
					rect.y,
					rect.x,
					rect.y + rect.h / 2,
					10
				);
				if (top || right || bottom || left) {
					this.socket.send(
						JSON.stringify({
							type: "delete-message",
							id: message.id,
							roomId: this.roomId,
						})
					);
					foundMessage = true;
				}
			} else if (message.shape === "arc") {
				const rect = message.boundingBox;
				if (
					this.pointNearEllipse(
						pos.x,
						pos.y,
						rect.x,
						rect.y,
						rect.w,
						rect.h,
						10
					)
				) {
					this.socket.send(
						JSON.stringify({
							type: "delete-message",
							id: message.id,
							roomId: this.roomId,
						})
					);
					foundMessage = true;
				}
			}

			if (foundMessage) {
				return;
			}
		}
	}
	getBoundindBox(message: Message): {
		x: number;
		y: number;
		w: number;
		h: number;
	} {
		let nullBox: {
			x: number;
			y: number;
			w: number;
			h: number;
		} = { x: 0, y: 0, w: 0, h: 0 };
		let boundingBox = nullBox;
		if (
			message.shape === "rectangle" ||
			message.shape === "rhombus" ||
			message.shape === "arc" ||
			message.shape === "image" ||
			message.shape === "text"
		) {
			if (Array.isArray(message.shapeData)) return nullBox;
			const rect = message.boundingBox;

			boundingBox = {
				x: rect.x,
				y: rect.y,
				w: rect.w,
				h: rect.h,
			};
		}
		return boundingBox;
	}
	pointNearLine(
		px: number,
		py: number,
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		tolerance: number = 5
	) {
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
	pointNearEllipse(
		px: number,
		py: number,
		x: number,
		y: number,
		w: number,
		h: number,
		tolerance: number = 2 // pixels
	): boolean {
		const rx = w / 2;
		const ry = h / 2;
		const cx = x + rx;
		const cy = y + ry;

		if (rx === 0 || ry === 0) return false;

		// Normalized ellipse equation value
		const value =
			((px - cx) * (px - cx)) / (rx * rx) +
			((py - cy) * (py - cy)) / (ry * ry);

		// Approximate "distance" from ellipse boundary
		// sqrt(value) - 1 ~ relative offset from ellipse
		const distance = Math.abs(Math.sqrt(value) - 1);

		// Scale distance into pixel space
		// use rx or ry avg as scaling factor
		const scaled = distance * Math.min(rx, ry);

		return scaled <= tolerance;
	}
	// !laser
	drawMovingLaser() {
		if (this.laserPoints.length < 2) return;

		this.ctx.save();
		this.ctx.lineCap = "round";
		this.ctx.lineJoin = "round";

		// Smooth bezier path instead of lineTo
		this.ctx.beginPath();
		this.ctx.moveTo(this.laserPoints[0]!.x, this.laserPoints[0]!.y);

		for (let i = 1; i < this.laserPoints.length - 1; i++) {
			const p1 = this.laserPoints[i];
			const p2 = this.laserPoints[i + 1];

			const xc = (p1!.x + p2!.x) / 2;
			const yc = (p1!.y + p2!.y) / 2;

			this.ctx.strokeStyle = `rgba(255,0,0,${p1!.alpha})`;
			this.ctx.lineWidth = (p1!.width ?? 3) * p1!.alpha;

			this.ctx.shadowColor = "red";
			this.ctx.shadowBlur = 15 * p1!.alpha;

			this.ctx.quadraticCurveTo(p1!.x, p1!.y, xc, yc);
		}

		this.ctx.stroke();
		this.ctx.restore();

		// Fade out alpha + cleanup
		for (let i = this.laserPoints.length - 1; i >= 0; i--) {
			const p = this.laserPoints[i];
			p!.alpha -= 0.0003; // adjust fade speed
			if (p!.alpha <= 0) this.laserPoints.splice(i, 1);
		}

		if (this.laserPoints.length > 0) {
			requestAnimationFrame(() => this.renderCanvas());
		}
	}
	// !mouse
	selectShapeHover(pos: { x: number; y: number }) {
		if (this.selectedMessage) {
			const bb = this.selectedMessage.boundingBox;
			const padding = 12;
			const rect = {
				x: bb.x - padding,
				y: bb.y - padding,
				w: bb.w + padding * 2,
				h: bb.h + padding * 2,
			};

			const { handle, cursor } = getResizeHandleAndCursor(
				pos.x,
				pos.y,
				rect,
				6
			);
			if (handle !== "none") {
				this.canvas.style.cursor = cursor;
				this.resizeHandler = handle;
				return;
			}

			if (
				bb.x - 10 <= pos.x &&
				bb.y - 10 <= pos.y &&
				bb.x + bb.w + 10 >= pos.x &&
				bb.y + bb.h + 10 >= pos.y
			) {
				this.canvas.style.cursor = "move";
				return;
			}
		}
		for (const message of this.messages) {
			let foundMessage: boolean = false;
			if (message.shape === "line" || message.shape === "arrow") {
				const { x1, y1, x2, y2 } = message.lineData!;
				if (this.pointNearLine(pos.x, pos.y, x1, y1, x2, y2, 8)) {
					foundMessage = true;
				}
			} else if (message.shape === "pencil" && message.pencilPoints) {
				for (let i = 0; i < message.pencilPoints.length - 1; i++) {
					const p1 = message.pencilPoints[i];
					const p2 = message.pencilPoints[i + 1];
					if (
						this.pointNearLine(
							pos.x,
							pos.y,
							p1!.x,
							p1!.y,
							p2!.x,
							p2!.y,
							8
						)
					) {
						foundMessage = true;
					}
				}
			} else if (message.shape === "image" || message.shape === "text") {
				const { x, y, w, h } = this.getBoundindBox(message);
				const bounded =
					pos.x >= x &&
					pos.x <= x + w &&
					pos.y >= y &&
					pos.y <= y + h;

				if (bounded) {
					foundMessage = true;
				}
			} else if (message.shape === "rectangle") {
				const rect = message.boundingBox;
				const top = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x,
					rect.y,
					rect.x + rect.w,
					rect.y,
					10
				);
				const right = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x + rect.w,
					rect.y,
					rect.x + rect.w,
					rect.y + rect.h,
					10
				);
				const bottom = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x,
					rect.y + rect.h,
					rect.x + rect.w,
					rect.y + rect.h,
					10
				);
				const left = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x,
					rect.y,
					rect.x,
					rect.y + rect.h,
					10
				);
				if (top || right || bottom || left) {
					foundMessage = true;
				}
			} else if (message.shape === "rhombus") {
				const rect = message.boundingBox;
				const top = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x + rect.w / 2,
					rect.y,
					rect.x + rect.w,
					rect.y + rect.h / 2,
					10
				);
				const right = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x + rect.w,
					rect.y + rect.h / 2,
					rect.x + rect.w / 2,
					rect.y + rect.h,
					10
				);
				const bottom = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x,
					rect.y + rect.h / 2,
					rect.x + rect.w / 2,
					rect.y + rect.h,
					10
				);
				const left = this.pointNearLine(
					pos.x,
					pos.y,
					rect.x + rect.w / 2,
					rect.y,
					rect.x,
					rect.y + rect.h / 2,
					10
				);
				if (top || right || bottom || left) {
					foundMessage = true;
				}
			} else if (message.shape === "arc") {
				const rect = message.boundingBox;
				if (
					this.pointNearEllipse(
						pos.x,
						pos.y,
						rect.x,
						rect.y,
						rect.w,
						rect.h,
						10
					)
				) {
					foundMessage = true;
				}
			}

			if (foundMessage) {
				this.canvas.style.cursor = "move";
				this.preSelectedMessage = message;
				return;
			} else {
				this.canvas.style.cursor = "default";
				this.preSelectedMessage = null;
			}
			this.resizeHandler = "none";
		}
	}
	handleMouseDrag(pos: { x: number; y: number }) {
		if (!this.selectedMessage) return;
		if (this.selectedMessage.shape === "rectangle") {
			if (this.isDragging)
				this.handleRectangleDrag(this.selectedMessage, pos);
			else if (this.isResizing)
				this.handleRectangleResize(this.selectedMessage, pos);
			return;
		} else if (this.selectedMessage.shape === "rhombus") {
			if (this.isDragging)
				this.handleRhombusDrag(this.selectedMessage, pos);
			else if (this.isResizing)
				this.handleRhombusResize(this.selectedMessage, pos);
		} else if (this.selectedMessage.shape === "arc") {
			if (this.isDragging)
				this.handleEllipseDrag(this.selectedMessage, pos);
			else if (this.isResizing)
				this.handleEllipseResize(this.selectedMessage, pos);
		} else if (this.selectedMessage.shape === "arrow") {
			if (this.isDragging)
				this.handleArrowDrag(this.selectedMessage, pos);
			else if (this.isResizing)
				this.handleArrowResize(this.selectedMessage, pos);
		} else if (this.selectedMessage.shape === "line") {
			if (this.isDragging) this.handleLineDrag(this.selectedMessage, pos);
			else if (this.isResizing)
				this.handleLineResize(this.selectedMessage, pos);
		} else if (this.selectedMessage.shape === "pencil") {
			if (this.isDragging)
				this.handlePencilDrag(this.selectedMessage, pos);
			else if (this.isResizing)
				this.handlePencilResize(this.selectedMessage, pos);
		} else if (this.selectedMessage.shape === "text") {
			if (this.isDragging) this.handleTextDrag(this.selectedMessage, pos);
			else if (this.isResizing)
				this.handleTextResize(this.selectedMessage, pos);
		} else if (this.selectedMessage.shape === "image") {
			if (this.isDragging)
				this.handleImageDrag(this.selectedMessage, pos);
			else if (this.isResizing)
				this.handleImageResize(this.selectedMessage, pos);
		}
	}

	// !selected message
	handleSelectedMessage(message: Message) {
		const bb = message.boundingBox;

		const padding = 10;
		const x = bb.x - padding;
		const y = bb.y - padding;
		const w = bb.w + padding * 2;
		const h = bb.h + padding * 2;

		this.ctx.save();
		this.ctx.strokeStyle = `${this.theme === "light" ? "rgba(103,65,217, 1)" : "rgba(208,191,255,1)"}`;
		this.ctx.lineWidth = 1;
		this.ctx.strokeRect(x, y, w, h);

		const handleSize = 10;
		const handleRadius = 2;
		const handles = [
			{ x, y },
			{ x: x + w, y },
			{ x, y: y + h },
			{ x: x + w, y: y + h },
		];

		this.ctx.fillStyle = `#${this.canvasbg}`;
		this.ctx.strokeStyle = `${this.theme === "light" ? "rgba(103,65,217, 1)" : "rgba(208,191,255,1)"}`;
		for (const hPos of handles) {
			this.ctx.beginPath();
			this.ctx.roundRect(
				hPos.x - handleSize / 2,
				hPos.y - handleSize / 2,
				handleSize,
				handleSize,
				handleRadius
			);
			this.ctx.fill();
			this.ctx.stroke();
		}

		this.ctx.restore();
	}
	setSelectedProps(message: Message) {
		if (Array.isArray(message.shapeData)) {
			const stroke = message.shapeData[0]!.options.stroke;
			const strokeWidth = message.shapeData[0]!.options.strokeWidth;
			const strokeLineDash = message.shapeData[0]!.options.strokeLineDash;
			const roughness = message.shapeData[0]!.options.roughness;
			const opacity = message.opacity;
			const arrowType = message.arrowType;
			const arrowHead = message.arrowHead;

			if (message.shape === "arrow") {
				this.setStroke(stroke.split("#")[1]!);
				this.setStrokeWidth(
					strokeWidth === 1
						? "thin"
						: strokeWidth === 2
							? "normal"
							: "thick"
				);
				this.setStrokeStyle(
					!strokeLineDash || strokeLineDash.length === 0
						? "solid"
						: Array.isArray(strokeLineDash) &&
							  strokeLineDash.length === 2 &&
							  strokeLineDash[0] === 10 &&
							  strokeLineDash[1] === 10
							? "dashed"
							: "dotted"
				);
				this.setSlopiness(
					roughness === 0
						? "architect"
						: roughness === 1
							? "artist"
							: "cartoonist"
				);
				this.setArrowType(arrowType!);
				this.setFrontArrowHead(arrowHead!.front);
				this.setBackArrowHead(arrowHead!.back);
				this.setOpacity(opacity ? opacity * 100 : 100);
			}
		} else {
			const stroke = message.shapeData.options.stroke;
			const fill = message.shapeData.options.fill;
			const fillStyle = message.shapeData.options.fillStyle;
			const strokeWidth = message.shapeData.options.strokeWidth;
			const strokeLineDash = message.shapeData.options.strokeLineDash;
			const roughness = message.shapeData.options.roughness;
			const opacity = message.opacity;
			const edges = message.edges;
			const fontSize = message.textData?.fontSize;
			const fontFamily = message.textData?.fontFamily;
			const textAlign = message.textData?.textAlign;
			const textColor = message.textData?.textColor;

			if (message.shape === "rectangle" || message.shape === "rhombus") {
				this.setStroke(stroke.split("#")[1]!);
				this.setBg(!fill ? "transparent" : fill.split("#")[1]!);
				this.setFill(
					fillStyle === "cross-hatch"
						? ("cross" as fill)
						: (fillStyle as fill)
				);
				this.setStrokeWidth(
					strokeWidth === 1
						? "thin"
						: strokeWidth === 2
							? "normal"
							: "thick"
				);
				this.setStrokeStyle(
					!strokeLineDash || strokeLineDash.length === 0
						? "solid"
						: Array.isArray(strokeLineDash) &&
							  strokeLineDash.length === 2 &&
							  strokeLineDash[0] === 10 &&
							  strokeLineDash[1] === 10
							? "dashed"
							: "dotted"
				);
				this.setSlopiness(
					roughness === 0
						? "architect"
						: roughness === 1
							? "artist"
							: "cartoonist"
				);
				this.setEdges(edges === "round" ? "round" : "sharp");
				this.setOpacity(opacity ? opacity * 100 : 100);
			} else if (message.shape === "arc") {
				this.setStroke(stroke.split("#")[1]!);
				this.setBg(!fill ? "transparent" : fill.split("#")[1]!);
				this.setFill(
					fillStyle === "cross-hatch"
						? ("cross" as fill)
						: (fillStyle as fill)
				);
				this.setStrokeWidth(
					strokeWidth === 1
						? "thin"
						: strokeWidth === 2
							? "normal"
							: "thick"
				);
				this.setStrokeStyle(
					!strokeLineDash || strokeLineDash.length === 0
						? "solid"
						: Array.isArray(strokeLineDash) &&
							  strokeLineDash.length === 2 &&
							  strokeLineDash[0] === 10 &&
							  strokeLineDash[1] === 10
							? "dashed"
							: "dotted"
				);
				this.setSlopiness(
					roughness === 0
						? "architect"
						: roughness === 1
							? "artist"
							: "cartoonist"
				);
				this.setOpacity(opacity ? opacity * 100 : 100);
			} else if (message.shape === "line") {
				this.setStroke(stroke.split("#")[1]!);
				this.setStrokeWidth(
					strokeWidth === 1
						? "thin"
						: strokeWidth === 2
							? "normal"
							: "thick"
				);
				this.setStrokeStyle(
					!strokeLineDash || strokeLineDash.length === 0
						? "solid"
						: Array.isArray(strokeLineDash) &&
							  strokeLineDash.length === 2 &&
							  strokeLineDash[0] === 10 &&
							  strokeLineDash[1] === 10
							? "dashed"
							: "dotted"
				);
				this.setSlopiness(
					roughness === 0
						? "architect"
						: roughness === 1
							? "artist"
							: "cartoonist"
				);
				this.setEdges(edges === "round" ? "round" : "sharp");
				this.setOpacity(opacity ? opacity * 100 : 100);
			} else if (message.shape === "pencil") {
				this.setStroke(stroke.split("#")[1]!);
				this.setStrokeWidth(
					strokeWidth / 2 === 1
						? "thin"
						: strokeWidth / 2 === 2
							? "normal"
							: "thick"
				);
				this.setOpacity(opacity ? opacity * 100 : 100);
			} else if (message.shape === "text") {
				this.setStroke(textColor!.split("#")[1]!);
				if (fontFamily === "caveat")
					this.setFontFamily("caveat" as fontFamily);
				else if (fontFamily === "excali")
					this.setFontFamily("draw" as fontFamily);
				else if (fontFamily === "firaCode")
					this.setFontFamily("code" as fontFamily);
				else if (fontFamily === "jakarta")
					this.setFontFamily("normal" as fontFamily);
				else if (fontFamily === "sourceCode")
					this.setFontFamily("little" as fontFamily);
				else if (fontFamily === "monospace")
					this.setFontFamily("mono" as fontFamily);
				else if (fontFamily === "nunito")
					this.setFontFamily("nunito" as fontFamily);
				this.setFontSize(
					fontSize === "16px"
						? "small"
						: fontSize === "24px"
							? "medium"
							: fontSize === "32px"
								? "large"
								: "xlarge"
				);
				this.setTextAlign(textAlign as textAlign);
				this.setOpacity(opacity ? opacity * 100 : 100);
			} else if (message.shape === "image") {
				this.setEdges(edges === "round" ? "round" : "sharp");
				this.setOpacity(opacity ? opacity * 100 : 100);
			}
		}
	}
	handlePropsChange() {
		if (!this.selectedMessage) return;
		if (Array.isArray(this.selectedMessage.shapeData)) {
			if (this.selectedMessage.shape === "arrow")
				this.handleArrowPropsChange(this.selectedMessage);
			return;
		}
		if (this.selectedMessage.shape === "rectangle")
			this.handleRectanglePropsChange(this.selectedMessage);
		else if (this.selectedMessage.shape === "rhombus")
			this.handleRhombusPropsChange(this.selectedMessage);
		else if (this.selectedMessage.shape === "arc")
			this.handleEllipsePropsChange(this.selectedMessage);
		else if (this.selectedMessage.shape === "arrow")
			this.handleArrowPropsChange(this.selectedMessage);
		else if (this.selectedMessage.shape === "line")
			this.handleLinePropsChange(this.selectedMessage);
		else if (this.selectedMessage.shape === "pencil")
			this.handlePencilPropsChange(this.selectedMessage);
		else if (this.selectedMessage.shape === "text")
			this.handleTextPropsChange(this.selectedMessage);
		else if (this.selectedMessage.shape === "image")
			this.handleImagePropsChange(this.selectedMessage);
	}

	// !dragging shapes
	//* 1.rectangle
	handleRectangleDrag(message: Message, pos: { x: number; y: number }) {
		const dx = pos.x - this.prevX;
		const dy = pos.y - this.prevY;
		const rect = message.boundingBox;
		if (Array.isArray(message.shapeData)) return;

		const x = rect.x + dx;
		const y = rect.y + dy;

		let shapeData: Drawable | null = null;
		const options = roughOptions(this.props);
		if (message.edges === "round") {
			const path = createRoundedRectPath(x, y, rect.w, rect.h);
			shapeData = this.generator!.path(path, {
				...options,
				seed: message.shapeData.options.seed,
			});
		} else {
			shapeData = this.generator!.rectangle(x, y, rect.w, rect.h, {
				...options,
				seed: message.shapeData.options.seed,
			});
		}

		this.prevX = pos.x;
		this.prevY = pos.y;

		const newBB = {
			x: rect.x + dx,
			y: rect.y + dy,
			w: rect.w,
			h: rect.h,
		};
		const newMessage: Message = {
			id: message.id,
			shape: "rectangle" as Tool,
			opacity: message.opacity,
			edges: message.edges,
			shapeData,
			boundingBox: newBB,
		};

		this.messages = this.messages.map((msg) => {
			if (msg.id === message.id) {
				return {
					...newMessage,
				};
			}
			return msg;
		});
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
		// this.renderCanvas();
	}
	handleRectangleResize(message: Message, pos: { x: number; y: number }) {
		if (Array.isArray(message.shapeData)) return;
		if (this.resizeHandler === "none") return;

		const rect = message.boundingBox;
		const dx = pos.x - this.prevX;
		const dy = pos.y - this.prevY;
		switch (this.resizeHandler) {
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

		// If user dragged past the opposite side, flip rect and swap the handle
		let hFlip = false;
		let vFlip = false;

		if (rect.w < 0) {
			rect.x += rect.w; // move x to the new left
			rect.w = -rect.w; // keep width positive
			hFlip = true;
		}
		if (rect.h < 0) {
			rect.y += rect.h; // move y to the new top
			rect.h = -rect.h; // keep height positive
			vFlip = true;
		}

		// Optionally clamp to avoid degenerate sizes
		const MIN_SIZE = 1;
		rect.w = Math.max(rect.w, MIN_SIZE);
		rect.h = Math.max(rect.h, MIN_SIZE);

		// Swap the active handle so dragging keeps feeling natural
		if (hFlip || vFlip) {
			let h = this.resizeHandler.includes("e")
				? "e"
				: this.resizeHandler.includes("w")
					? "w"
					: "";
			let v = this.resizeHandler.includes("n")
				? "n"
				: this.resizeHandler.includes("s")
					? "s"
					: "";

			if (hFlip) h = h === "e" ? "w" : h === "w" ? "e" : "";
			if (vFlip) v = v === "n" ? "s" : v === "s" ? "n" : "";

			const newHandle = (v + h) as Handle; // order like "ne", "sw", "n", "e", etc.
			this.resizeHandler = newHandle;
			this.canvas.style.cursor = `${newHandle}-resize`;
		}

		this.prevX = pos.x;
		this.prevY = pos.y;

		const normalRect = normalizeCoords(rect.x, rect.y, rect.w, rect.h);
		const newBB = {
			x: normalRect.x,
			y: normalRect.y,
			w: normalRect.w,
			h: normalRect.h,
		};
		let shapeData: Drawable | null = null;
		const options = roughOptions(this.props);
		if (message.edges === "round") {
			const path = createRoundedRectPath(
				normalRect.x,
				normalRect.y,
				normalRect.w,
				normalRect.h
			);
			shapeData = this.generator!.path(path, {
				...options,
				seed: message.shapeData.options.seed,
			});
		} else {
			shapeData = this.generator!.rectangle(
				normalRect.x,
				normalRect.y,
				normalRect.w,
				normalRect.h,
				{ ...options, seed: message.shapeData.options.seed }
			);
		}

		const newMessage: Message = {
			id: message.id,
			shape: "rectangle" as Tool,
			opacity: message.opacity,
			edges: message.edges,
			shapeData,
			boundingBox: newBB,
		};

		this.messages = this.messages.map((msg) => {
			if (msg.id === message.id) {
				return {
					...newMessage,
				};
			}
			return msg;
		});
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
		// this.renderCanvas();
	}
	handleRectanglePropsChange(message: Message) {
		const rect = message.boundingBox;
		if (Array.isArray(message.shapeData)) return;

		let shapeData: Drawable | null = null;
		const options = roughOptions(this.props);
		if (this.props.edges === "round") {
			const path = createRoundedRectPath(rect.x, rect.y, rect.w, rect.h);
			shapeData = this.generator!.path(path, {
				...options,
				seed: message.shapeData.options.seed,
			});
		} else {
			shapeData = this.generator!.rectangle(
				rect.x,
				rect.y,
				rect.w,
				rect.h,
				{
					...options,
					seed: message.shapeData.options.seed,
				}
			);
		}
		const newMessage: Message = {
			id: message.id,
			shape: "rectangle" as Tool,
			opacity: this.props.opacity,
			edges: this.props.edges,
			shapeData,
			boundingBox: rect,
		};

		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	//* 2.rhombus
	handleRhombusDrag(message: Message, pos: { x: number; y: number }) {
		const dx = pos.x - this.prevX;
		const dy = pos.y - this.prevY;
		const rect = message.boundingBox;

		// update bounding box
		const newRect = {
			x: rect.x + dx,
			y: rect.y + dy,
			w: rect.w,
			h: rect.h,
		};

		// rebuild shapeData
		const options = roughOptions(this.props);
		const path = createRhombusPath(
			newRect.x,
			newRect.y,
			newRect.w,
			newRect.h,
			message.edges === "round" ? true : false
		);
		const shapeData = this.generator!.path(path, {
			...options,
			seed: !Array.isArray(message.shapeData)
				? message.shapeData.options.seed
				: Math.floor(Math.random() * 1000000),
		});

		this.prevX = pos.x;
		this.prevY = pos.y;

		const newMessage: Message = {
			id: message.id,
			shape: "rhombus" as Tool,
			opacity: message.opacity,
			edges: message.edges,
			shapeData,
			boundingBox: newRect,
		};

		// replace in messages
		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? { ...newMessage } : msg
		);

		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	handleRhombusResize(message: Message, pos: { x: number; y: number }) {
		if (Array.isArray(message.shapeData)) return;
		if (this.resizeHandler === "none") return;

		const rect = message.boundingBox;
		const dx = pos.x - this.prevX;
		const dy = pos.y - this.prevY;

		switch (this.resizeHandler) {
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

		// Flip check to keep w,h positive
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
		const MIN_SIZE = 1;
		rect.w = Math.max(rect.w, MIN_SIZE);
		rect.h = Math.max(rect.h, MIN_SIZE);

		// Swap handle if flipped
		if (hFlip || vFlip) {
			let h = this.resizeHandler.includes("e")
				? "e"
				: this.resizeHandler.includes("w")
					? "w"
					: "";
			let v = this.resizeHandler.includes("n")
				? "n"
				: this.resizeHandler.includes("s")
					? "s"
					: "";

			if (hFlip) h = h === "e" ? "w" : h === "w" ? "e" : "";
			if (vFlip) v = v === "n" ? "s" : v === "s" ? "n" : "";

			const newHandle = (v + h) as Handle;
			this.resizeHandler = newHandle;
			this.canvas.style.cursor = `${newHandle}-resize`;
		}

		this.prevX = pos.x;
		this.prevY = pos.y;

		const normalRect = normalizeCoords(rect.x, rect.y, rect.w, rect.h);
		const newBB = {
			x: normalRect.x,
			y: normalRect.y,
			w: normalRect.w,
			h: normalRect.h,
		};

		// regenerate rhombus path
		const options = roughOptions(this.props);
		const path = createRhombusPath(
			newBB.x,
			newBB.y,
			newBB.w,
			newBB.h,
			message.edges === "round" ? true : false
		);
		const shapeData = this.generator!.path(path, {
			...options,
			seed: message.shapeData.options.seed,
		});

		const newMessage: Message = {
			id: message.id,
			shape: "rhombus" as Tool,
			opacity: message.opacity,
			edges: message.edges,
			shapeData,
			boundingBox: newBB,
		};

		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? { ...newMessage } : msg
		);
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	handleRhombusPropsChange(message: Message) {
		if (Array.isArray(message.shapeData)) return;

		const rect = message.boundingBox;
		const options = roughOptions(this.props);

		// rebuild path for rhombus with current props
		const path = createRhombusPath(
			rect.x,
			rect.y,
			rect.w,
			rect.h,
			this.props.edges === "round" ? true : false
		);

		const shapeData = this.generator!.path(path, {
			...options,
			seed: message.shapeData.options.seed, // keep consistent shape
		});

		const newMessage: Message = {
			id: message.id,
			shape: "rhombus" as Tool,
			opacity: this.props.opacity,
			edges: this.props.edges,
			shapeData,
			boundingBox: rect,
		};

		// update in messages list
		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? { ...newMessage } : msg
		);

		this.setSelectedMessage(newMessage);
		this.renderCanvas();

		// optionally send to server if you want live prop updates
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	//* 3.ellipse
	handleEllipseDrag(message: Message, pos: { x: number; y: number }) {
		const dx = pos.x - this.prevX;
		const dy = pos.y - this.prevY;
		const rect = message.boundingBox;
		if (Array.isArray(message.shapeData)) return;

		const newRect = {
			x: rect.x + dx,
			y: rect.y + dy,
			w: rect.w,
			h: rect.h,
		};

		const options = roughOptions(this.props);

		// build path just like drawMovingEllipse
		const path = createEllipsePath(
			newRect.x,
			newRect.y,
			newRect.w,
			newRect.h
		);

		const shapeData = this.generator!.path(path, {
			...options,
			seed: message.shapeData.options.seed,
		});

		this.prevX = pos.x;
		this.prevY = pos.y;

		const newMessage: Message = {
			id: message.id,
			shape: "arc" as Tool,
			opacity: message.opacity,
			shapeData,
			boundingBox: newRect,
		};

		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? { ...newMessage } : msg
		);
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	handleEllipseResize(message: Message, pos: { x: number; y: number }) {
		if (Array.isArray(message.shapeData)) return;
		if (this.resizeHandler === "none") return;

		const rect = message.boundingBox;
		const dx = pos.x - this.prevX;
		const dy = pos.y - this.prevY;

		switch (this.resizeHandler) {
			case "e":
				rect.w += dx;
				break;
			case "w":
				rect.x += dx;
				rect.w -= dx;
				break;
			case "s":
				rect.h += dy;
				break;
			case "n":
				rect.y += dy;
				rect.h -= dy;
				break;
			case "se":
				rect.w += dx;
				rect.h += dy;
				break;
			case "sw":
				rect.x += dx;
				rect.w -= dx;
				rect.h += dy;
				break;
			case "ne":
				rect.w += dx;
				rect.y += dy;
				rect.h -= dy;
				break;
			case "nw":
				rect.x += dx;
				rect.w -= dx;
				rect.y += dy;
				rect.h -= dy;
				break;
		}

		// normalize (no negative w/h)
		let hFlip = false,
			vFlip = false;
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
		const MIN_SIZE = 1;
		rect.w = Math.max(rect.w, MIN_SIZE);
		rect.h = Math.max(rect.h, MIN_SIZE);

		// swap handle if flipped
		if (hFlip || vFlip) {
			let h = this.resizeHandler.includes("e")
				? "e"
				: this.resizeHandler.includes("w")
					? "w"
					: "";
			let v = this.resizeHandler.includes("n")
				? "n"
				: this.resizeHandler.includes("s")
					? "s"
					: "";
			if (hFlip) h = h === "e" ? "w" : h === "w" ? "e" : "";
			if (vFlip) v = v === "n" ? "s" : v === "s" ? "n" : "";
			const newHandle = (v + h) as Handle;
			this.resizeHandler = newHandle;
			this.canvas.style.cursor = `${newHandle}-resize`;
		}

		this.prevX = pos.x;
		this.prevY = pos.y;

		const normalRect = normalizeCoords(rect.x, rect.y, rect.w, rect.h);

		const options = roughOptions(this.props);
		const path = createEllipsePath(
			normalRect.x,
			normalRect.y,
			normalRect.w,
			normalRect.h
		);

		const shapeData = this.generator!.path(path, {
			...options,
			seed: message.shapeData.options.seed,
		});

		const newMessage: Message = {
			id: message.id,
			shape: "arc" as Tool,
			opacity: message.opacity,
			shapeData,
			boundingBox: normalRect,
		};

		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? { ...newMessage } : msg
		);
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	handleEllipsePropsChange(message: Message) {
		if (Array.isArray(message.shapeData)) return;

		const rect = message.boundingBox;
		const options = roughOptions(this.props);

		const path = createEllipsePath(rect.x, rect.y, rect.w, rect.h);
		const shapeData = this.generator!.path(path, {
			...options,
			seed: message.shapeData.options.seed, // only carry forward the seed
		});

		const newMessage: Message = {
			id: message.id,
			shape: "arc" as Tool,
			opacity: this.props.opacity,
			shapeData,
			boundingBox: rect,
		};

		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? { ...newMessage } : msg
		);
		this.setSelectedMessage(newMessage);
		this.renderCanvas();

		// send to server if you want real-time sync
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	//* 4.arrow
	handleArrowDrag(message: Message, pos: { x: number; y: number }) {
		if (!Array.isArray(message.shapeData)) return;
		const dx = pos.x - this.prevX;
		const dy = pos.y - this.prevY;

		if (!message.lineData) return;

		const { x1, y1, x2, y2 } = message.lineData;
		const newLineData = {
			x1: x1 + dx,
			y1: y1 + dy,
			x2: x2 + dx,
			y2: y2 + dy,
		};

		// rebuild paths
		const { linePath, frontHeadPath, backHeadPath } = createArrowPath(
			newLineData.x1,
			newLineData.y1,
			newLineData.x2,
			newLineData.y2,
			message.arrowHead?.front!,
			message.arrowHead?.back!,
			message.arrowType!
		);

		const options = roughOptions(this.props);
		const shapeData: Drawable[] = [];
		if (linePath)
			shapeData.push(
				this.generator!.path(linePath, {
					...options,
					seed: message.shapeData[0]!.options.seed,
				})
			);
		if (frontHeadPath)
			shapeData.push(
				this.generator!.path(frontHeadPath, {
					...options,
					seed: message.shapeData[1]!.options.seed,
				})
			);
		if (backHeadPath)
			shapeData.push(
				this.generator!.path(backHeadPath, {
					...options,
					seed: message.shapeData[2]!.options.seed,
				})
			);

		const rect = normalizeCoords(
			newLineData.x1,
			newLineData.y1,
			newLineData.x2 - newLineData.x1,
			newLineData.y2 - newLineData.y1
		);

		const newMessage: Message = {
			...message,
			shapeData,
			boundingBox: rect,
			lineData: newLineData,
		};

		this.prevX = pos.x;
		this.prevY = pos.y;

		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? newMessage : msg
		);
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	handleArrowResize(message: Message, pos: { x: number; y: number }) {
		if (!message.lineData) return;
		if (this.resizeHandler === "none") return;
		if (!Array.isArray(message.shapeData)) return;

		const { x1, y1, x2, y2 } = message.lineData;
		let newLineData = { x1, y1, x2, y2 };

		// For arrow resizing, use "nw" (start) and "se" (end) handles as an example
		if (this.resizeHandler === "nw") {
			newLineData = { x1: pos.x, y1: pos.y, x2, y2 };
		} else if (this.resizeHandler === "se") {
			newLineData = { x1, y1, x2: pos.x, y2: pos.y };
		}

		// rebuild arrow
		const { linePath, frontHeadPath, backHeadPath } = createArrowPath(
			newLineData.x1,
			newLineData.y1,
			newLineData.x2,
			newLineData.y2,
			message.arrowHead?.front!,
			message.arrowHead?.back!,
			message.arrowType!
		);

		const options = roughOptions(this.props);
		const shapeData: Drawable[] = [];
		if (linePath)
			shapeData.push(
				this.generator!.path(linePath, {
					...options,
					seed: message.shapeData[0]!.options.seed,
				})
			);
		if (frontHeadPath)
			shapeData.push(
				this.generator!.path(frontHeadPath, {
					...options,
					seed: message.shapeData[1]!.options.seed,
				})
			);
		if (backHeadPath)
			shapeData.push(
				this.generator!.path(backHeadPath, {
					...options,
					seed: message.shapeData[2]!.options.seed,
				})
			);

		const rect = normalizeCoords(
			newLineData.x1,
			newLineData.y1,
			newLineData.x2 - newLineData.x1,
			newLineData.y2 - newLineData.y1
		);

		const newMessage: Message = {
			...message,
			shapeData,
			boundingBox: rect,
			lineData: newLineData,
		};

		this.prevX = pos.x;
		this.prevY = pos.y;

		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? newMessage : msg
		);
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	handleArrowPropsChange(message: Message) {
		if (!message.lineData) return;
		if (!Array.isArray(message.shapeData)) return;

		const { x1, y1, x2, y2 } = message.lineData;

		const { linePath, frontHeadPath, backHeadPath } = createArrowPath(
			x1,
			y1,
			x2,
			y2,
			this.props.arrowHead!.front!,
			this.props.arrowHead!.back!,
			this.props.arrowType!
		);

		const options = roughOptions(this.props);
		const shapeData: Drawable[] = [];
		if (linePath)
			shapeData.push(
				this.generator!.path(linePath, {
					...options,
					seed: message.shapeData[0]!.options.seed,
				})
			);
		if (frontHeadPath)
			shapeData.push(
				this.generator!.path(frontHeadPath, {
					...options,
					fill:
						this.props.arrowHead!.front === "triangle"
							? this.props.stroke
							: undefined,
					fillStyle:
						this.props.arrowHead!.front === "triangle"
							? "solid"
							: undefined,
					seed: message.shapeData[0]!.options.seed,
				})
			);
		if (backHeadPath)
			shapeData.push(
				this.generator!.path(backHeadPath, {
					...options,
					fill:
						this.props.arrowHead!.back === "triangle"
							? this.props.stroke
							: undefined,
					fillStyle:
						this.props.arrowHead!.back === "triangle"
							? "solid"
							: undefined,
					seed: message.shapeData[0]!.options.seed,
				})
			);

		const rect = normalizeCoords(x1, y1, x2 - x1, y2 - y1);

		const newMessage: Message = {
			...message,
			shapeData,
			arrowHead: this.props.arrowHead,
			arrowType: this.props.arrowType,
			opacity: this.props.opacity,
			boundingBox: rect,
		};

		this.setSelectedMessage(newMessage);

		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	//* 5.line
	handleLineDrag(message: Message, pos: { x: number; y: number }) {
		if (!message.lineData) return;
		if (Array.isArray(message.shapeData)) return;

		const dx = pos.x - this.prevX;
		const dy = pos.y - this.prevY;

		const { x1, y1, x2, y2 } = message.lineData;
		const newLineData = {
			x1: x1 + dx,
			y1: y1 + dy,
			x2: x2 + dx,
			y2: y2 + dy,
		};

		const path = createLinePath(
			newLineData.x1,
			newLineData.y1,
			newLineData.x2,
			newLineData.y2
		);
		const options = roughOptions(this.props);

		const shapeData = this.generator!.path(path, {
			...options,
			seed: message.shapeData.options.seed,
		});

		const rect = normalizeCoords(
			newLineData.x1,
			newLineData.y1,
			newLineData.x2 - newLineData.x1,
			newLineData.y2 - newLineData.y1
		);

		const newMessage: Message = {
			...message,
			shapeData,
			boundingBox: rect,
			lineData: newLineData,
		};

		this.prevX = pos.x;
		this.prevY = pos.y;

		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? newMessage : msg
		);
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	handleLineResize(message: Message, pos: { x: number; y: number }) {
		if (!message.lineData) return;
		if (this.resizeHandler === "none") return;
		if (Array.isArray(message.shapeData)) return;

		const { x1, y1, x2, y2 } = message.lineData;
		let newLineData = { x1, y1, x2, y2 };

		if (this.resizeHandler === "nw") {
			newLineData = { x1: pos.x, y1: pos.y, x2, y2 };
		} else if (this.resizeHandler === "se") {
			newLineData = { x1, y1, x2: pos.x, y2: pos.y };
		}

		const path = createLinePath(
			newLineData.x1,
			newLineData.y1,
			newLineData.x2,
			newLineData.y2
		);
		const options = roughOptions(this.props);

		const shapeData = this.generator!.path(path, {
			...options,
			seed: message.shapeData.options.seed,
		});

		const rect = normalizeCoords(
			newLineData.x1,
			newLineData.y1,
			newLineData.x2 - newLineData.x1,
			newLineData.y2 - newLineData.y1
		);

		const newMessage: Message = {
			...message,
			shapeData,
			boundingBox: rect,
			lineData: newLineData,
		};

		this.prevX = pos.x;
		this.prevY = pos.y;

		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? newMessage : msg
		);
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	handleLinePropsChange(message: Message) {
		if (!message.lineData) return;
		if (Array.isArray(message.shapeData)) return;

		const { x1, y1, x2, y2 } = message.lineData;
		const path = createLinePath(x1, y1, x2, y2);
		const options = roughOptions(this.props);

		const shapeData = this.generator!.path(path, {
			...options,
			seed: message.shapeData.options.seed,
		});

		const rect = normalizeCoords(x1, y1, x2 - x1, y2 - y1);

		const newMessage: Message = {
			...message,
			shapeData,
			opacity: this.props.opacity,
			edges: this.props.edges,
			boundingBox: rect,
		};

		this.setSelectedMessage(newMessage);

		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	//* 6.pencil
	handlePencilDrag(message: Message, pos: { x: number; y: number }) {
		if (!message.pencilPoints) return;
		if (Array.isArray(message.shapeData)) return;

		const dx = pos.x - this.prevX;
		const dy = pos.y - this.prevY;

		const newPoints = message.pencilPoints.map((p) => ({
			x: p.x + dx,
			y: p.y + dy,
		}));

		const path = createPencilPath(newPoints); // you likely already have this
		const options = roughOptions(this.props);

		const shapeData = this.generator!.path(path, {
			...options,
			strokeWidth: options.strokeWidth! * 2,
			roughness: 0,
			bowing: 0,
			seed: message.shapeData.options.seed,
		});

		let minx = Number.MAX_VALUE,
			miny = Number.MAX_VALUE;
		let maxx = Number.MIN_VALUE, // ✅ fix
			maxy = Number.MIN_VALUE; // ✅ fix

		for (let point of newPoints) {
			let x = point.x,
				y = point.y;
			minx = Math.min(minx, x);
			maxx = Math.max(maxx, x);
			miny = Math.min(miny, y);
			maxy = Math.max(maxy, y);
		}

		const newMessage: Message = {
			...message,
			pencilPoints: newPoints,
			shapeData,
			boundingBox: {
				x: minx,
				y: miny,
				w: maxx - minx,
				h: maxy - miny,
			},
		};

		this.prevX = pos.x;
		this.prevY = pos.y;

		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? newMessage : msg
		);
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	handlePencilResize(message: Message, pos: { x: number; y: number }) {
		if (!message.pencilPoints) return;
		if (this.resizeHandler === "none") return;
		if (Array.isArray(message.shapeData)) return;

		const rect = message.boundingBox!;
		const { x, y, w, h } = rect;

		// scale factors
		let scaleX = 1,
			scaleY = 1;

		if (this.resizeHandler === "se") {
			scaleX = (pos.x - x) / w;
			scaleY = (pos.y - y) / h;
		} else if (this.resizeHandler === "nw") {
			scaleX = (rect.x + rect.w - pos.x) / w;
			scaleY = (rect.y + rect.h - pos.y) / h;
		}

		// scale points relative to top-left
		const newPoints = message.pencilPoints.map((p) => ({
			x: x + (p.x - x) * scaleX,
			y: y + (p.y - y) * scaleY,
		}));

		const path = createPencilPath(newPoints);
		const options = roughOptions(this.props);

		const shapeData = this.generator!.path(path, {
			...options,
			strokeWidth: options.strokeWidth! * 2,
			roughness: 0,
			bowing: 0,
			seed: message.shapeData.options.seed,
		});

		let minx = Number.MAX_VALUE,
			miny = Number.MAX_VALUE;
		let maxx = Number.MIN_VALUE, // ✅ fix
			maxy = Number.MIN_VALUE; // ✅ fix

		for (let point of newPoints) {
			let x = point.x,
				y = point.y;
			minx = Math.min(minx, x);
			maxx = Math.max(maxx, x);
			miny = Math.min(miny, y);
			maxy = Math.max(maxy, y);
		}

		const newMessage: Message = {
			...message,
			pencilPoints: newPoints,
			shapeData,
			boundingBox: {
				x: minx,
				y: miny,
				w: maxx - minx,
				h: maxy - miny,
			},
		};

		this.prevX = pos.x;
		this.prevY = pos.y;

		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? newMessage : msg
		);
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	handlePencilPropsChange(message: Message) {
		if (!message.pencilPoints) return;
		if (Array.isArray(message.shapeData)) return;

		const path = createPencilPath(message.pencilPoints);
		const options = roughOptions(this.props);

		const shapeData = this.generator!.path(path, {
			...options,
			strokeWidth: options.strokeWidth! * 2,
			roughness: 0,
			bowing: 0,
			seed: message.shapeData.options.seed,
		});

		let minx = Number.MAX_VALUE,
			miny = Number.MAX_VALUE;
		let maxx = Number.MIN_VALUE, // ✅ fix
			maxy = Number.MIN_VALUE; // ✅ fix

		for (let point of message.pencilPoints) {
			let x = point.x,
				y = point.y;
			minx = Math.min(minx, x);
			maxx = Math.max(maxx, x);
			miny = Math.min(miny, y);
			maxy = Math.max(maxy, y);
		}

		const newMessage: Message = {
			...message,
			shapeData,
			opacity: this.props.opacity,
			boundingBox: {
				x: minx,
				y: miny,
				w: maxx - minx,
				h: maxy - miny,
			},
		};

		this.setSelectedMessage(newMessage);

		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	//* 7.text
	handleTextDrag(message: Message, pos: { x: number; y: number }) {
		if (!message.boundingBox) return;
		const dx = pos.x - this.prevX;
		const dy = pos.y - this.prevY;
		const rect = {
			...message.boundingBox,
			x: message.boundingBox.x + dx,
			y: message.boundingBox.y + dy,
		};
		// also translate any text position inside the message so the visible text moves with the box
		const newTextData = message.textData
			? {
					...message.textData,
					pos: {
						x: message.textData.pos.x + dx,
						y: message.textData.pos.y + dy,
					},
				}
			: undefined;
		const newMessage: Message = {
			...message,
			boundingBox: rect,
			textData: newTextData,
		};
		this.prevX = pos.x;
		this.prevY = pos.y;
		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? newMessage : msg
		);
		this.setSelectedMessage(newMessage);
		this.renderCanvas();
		// send update to server so other clients receive the changed position
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	handleTextResize(message: Message, pos: { x: number; y: number }) {
		if (!message.boundingBox || !message.textData) return;
		if (this.resizeHandler === "none") return;

		const { x, y, w, h } = message.boundingBox;
		let newRect = { x, y, w, h };

		// --- resize logic (only corners) ---
		switch (this.resizeHandler) {
			case "se": // bottom-right
				newRect = { x, y, w: pos.x - x, h: pos.y - y };
				break;
			case "sw": // bottom-left
				newRect = { x: pos.x, y, w: w + (x - pos.x), h: pos.y - y };
				break;
			case "ne": // top-right
				newRect = { x, y: pos.y, w: pos.x - x, h: h + (y - pos.y) };
				break;
			case "nw": // top-left
				newRect = {
					x: pos.x,
					y: pos.y,
					w: w + (x - pos.x),
					h: h + (y - pos.y),
				};
				break;
			default:
				return; // ❌ ignore side handles
		}

		// --- ❌ prevent flip ---
		if (newRect.w <= 0 || newRect.h <= 0) {
			return; // freeze
		}

		// --- uniform scaling (based on width + height) ---
		const scaleX = w === 0 ? 1 : newRect.w / w;
		const scaleY = h === 0 ? 1 : newRect.h / h;
		const scale = Math.min(scaleX, scaleY); // uniform scale

		const oldFont = message.textData?.fontSize ?? "16px";
		const oldFontNum = parseFloat(oldFont);
		const newFontSizeNum = Math.max(16, oldFontNum * scale); // clamp >= 16px
		const newFontSize = `${newFontSizeNum}px`;

		// --- adjust pos if origin moved ---
		const deltaX = newRect.x - x;
		const deltaY = newRect.y - y;
		const newTextPos = {
			...message.textData.pos,
			x: message.textData.pos.x + deltaX,
			y: message.textData.pos.y + deltaY,
		};

		// --- new message ---
		const newMessage: Message = {
			...message,
			boundingBox: newRect,
			textData: {
				...message.textData,
				fontSize: newFontSize,
				pos: newTextPos,
			},
		};

		this.prevX = pos.x;
		this.prevY = pos.y;

		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? newMessage : msg
		);
		this.setSelectedMessage(newMessage);
		this.renderCanvas();

		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	handleTextPropsChange(message: Message) {
		if (!message.boundingBox || !message.textData) return;

		// ensure fontSize uses px like drawText/handleTextInput
		const fontSizePx = `${this.props.fontSize}px`;

		// compute lines and height (use similar lineHeight as drawText)
		const lines = message.textData.text
			? message.textData.text.split("\n")
			: [""];
		const fontSizeNum = this.props.fontSize!;
		const lineHeight = fontSizeNum * 1.5; // same multiplier as drawText
		const estimatedHeight = Math.max(
			lines.length * lineHeight,
			fontSizeNum
		);

		// compute width using canvas measureText so we can update bbox.w
		let fontFamily = "";
		if (this.props.fontFamily === "caveat")
			fontFamily = caveat.style.fontFamily;
		if (this.props.fontFamily === "excali")
			fontFamily = excali.style.fontFamily;
		if (this.props.fontFamily === "firaCode")
			fontFamily = firaCode.style.fontFamily;
		if (this.props.fontFamily === "jakarta")
			fontFamily = jakarta.style.fontFamily;
		if (this.props.fontFamily === "sourceCode")
			fontFamily = sourceCode.style.fontFamily;
		if (this.props.fontFamily === "monospace")
			fontFamily = monospace.style.fontFamily;
		if (this.props.fontFamily === "nunito")
			fontFamily = nunito.style.fontFamily;

		this.ctx.save();
		this.ctx.font = `${fontSizePx} ${fontFamily}`;
		let maxLineWidth = 0;
		for (let l of lines) {
			const w = this.ctx.measureText(l || " ").width;
			if (w > maxLineWidth) maxLineWidth = w;
		}
		this.ctx.restore();

		// textarea horizontal padding was 8px each side -> convert to world units
		const horizontalPaddingWorld = (8 + 8) / this.scale; // 16px total / scale

		// convert measured pixel width to world units (match handleTextInput flow)
		const textWidthWorld = maxLineWidth / this.scale;
		const estimatedWidth = Math.max(
			textWidthWorld + horizontalPaddingWorld,
			fontSizeNum
		);

		// assign estimated width/height directly so bbox shrinks when font size reduces
		const newBoundingBox = {
			...message.boundingBox,
			w: estimatedWidth,
			h: estimatedHeight,
		};

		const newMessage: Message = {
			...message,
			opacity: this.props.opacity,
			textData: {
				...message.textData,
				fontSize: fontSizePx,
				fontFamily: this.props.fontFamily!,
				textColor: this.props.stroke!,
				textAlign: this.props.textAlign!,
			},
			boundingBox: newBoundingBox,
		};

		// update in messages list so render/diffs use the new value
		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? { ...newMessage } : msg
		);

		this.setSelectedMessage(newMessage);
		this.renderCanvas();

		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	//* 8.image
	handleImageDrag(message: Message, pos: { x: number; y: number }) {
		if (!message.boundingBox) return;

		const dx = pos.x - this.prevX;
		const dy = pos.y - this.prevY;

		const rect = {
			...message.boundingBox,
			x: message.boundingBox.x + dx,
			y: message.boundingBox.y + dy,
		};

		const newMessage: Message = {
			...message,
			boundingBox: rect,
		};

		this.prevX = pos.x;
		this.prevY = pos.y;

		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? newMessage : msg
		);
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
	handleImageResize(message: Message, pos: { x: number; y: number }) {
		if (!message.boundingBox) return;
		if (this.resizeHandler === "none") return;

		const { x, y, w, h } = message.boundingBox;
		let newRect = { x, y, w, h };

		switch (this.resizeHandler) {
			case "n": // top edge
				newRect = {
					x,
					y: pos.y,
					w,
					h: h + (y - pos.y),
				};
				break;

			case "s": // bottom edge
				newRect = {
					x,
					y,
					w,
					h: pos.y - y,
				};
				break;

			case "w": // left edge
				newRect = {
					x: pos.x,
					y,
					w: w + (x - pos.x),
					h,
				};
				break;

			case "e": // right edge
				newRect = {
					x,
					y,
					w: pos.x - x,
					h,
				};
				break;

			case "nw": // top-left corner
				newRect = {
					x: pos.x,
					y: pos.y,
					w: w + (x - pos.x),
					h: h + (y - pos.y),
				};
				break;

			case "ne": // top-right corner
				newRect = {
					x,
					y: pos.y,
					w: pos.x - x,
					h: h + (y - pos.y),
				};
				break;

			case "sw": // bottom-left corner
				newRect = {
					x: pos.x,
					y,
					w: w + (x - pos.x),
					h: pos.y - y,
				};
				break;

			case "se": // bottom-right corner
				newRect = {
					x,
					y,
					w: pos.x - x,
					h: pos.y - y,
				};
				break;
		}

		// Optional: lock aspect ratio
		// const aspect = w / h;
		// newRect.h = newRect.w / aspect;

		const newMessage: Message = {
			...message,
			boundingBox: newRect,
		};

		this.prevX = pos.x;
		this.prevY = pos.y;

		this.messages = this.messages.map((msg) =>
			msg.id === message.id ? newMessage : msg
		);
		this.setSelectedMessage(newMessage);
		this.renderCanvas();
	}
	handleImagePropsChange(message: Message) {
		if (!message.boundingBox) return;

		const newMessage: Message = {
			...message,
			opacity: this.props.opacity,
			edges: this.props.edges,
		};

		this.setSelectedMessage(newMessage);

		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
			})
		);
	}
}
