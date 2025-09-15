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
import {
	normalizeCoords,
	roughOptions,
	normalizeStroke,
	normalizeWheelDelta,
	getResizeHandleAndCursor,
} from "./render";
import { createEllipsePath } from "./render/ellipse";
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
import { LayerManager } from "./render/layerManager";
import { getExistingMessages } from "./server";
import {
	SocketHelper,
	CoordinateHelper,
	HitTestHelper,
	ShapeCreator,
	ResizeHelper,
	PropertyConverter,
	ThrottleHelper,
	BoundingBoxHelper,
	FontHelper,
	Handle,
	FONT_FAMILY_MAP,
	FONT_WEIGHT_MAP,
} from "./assist";
import {
	RectangleManager,
	RectangleHelper,
	RhombusManager,
	RhombusHelper,
	EllipseManager,
	EllipseHelper,
	LineManager,
	LineHelper,
	ArrowManager,
	ArrowHelper,
	PencilManager,
} from "./shapes";

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
export interface User {
	id: string;
	username: string;
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
	private user: User | null = null;
	private clicked: boolean = false;
	private startX: number = 0;
	private startY: number = 0;
	private scale: number = 1;
	private offsetX: number = 0;
	private offsetY: number = 0;
	private authenticated: boolean;
	private isActive: boolean | undefined;

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

	// Shape managers
	private rectangleManager: RectangleManager | null = null;
	private rhombusManager: RhombusManager | null = null;
	private ellipseManager: EllipseManager | null = null;
	private lineManager: LineManager | null = null;
	private arrowManager: ArrowManager | null = null;
	private pencilManager: PencilManager | null = null;

	// add small fields for throttling preview sends
	private previewMessage: Message[];
	private previewId: string = "";
	private lastPreviewSend: number = 0;
	private lastPreviewRect: {
		x: number;
		y: number;
		w: number;
		h: number;
	} | null = null;

	// Performance optimization fields
	private lastRenderTime: number = 0;
	private renderThrottleMs: number = 16; // ~60fps max
	private pendingRender: boolean = false;
	private lastPreviewSendTime: number = 0;
	private previewThrottleMs: number = 16; // ~60fps max for preview messages
	private socketSendThrottleMs: number = 33; // ~30fps for socket messages

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

	// Callback for when messages change (for intro overlay)
	public onMessageChange?: () => void;

	private setStroke: (val: string) => void;
	private setBg: (val: string) => void;
	private setOpacity: (val: number) => void;
	private setFill: (val: fill) => void;
	private setStrokeWidth: (val: strokeWidth) => void;
	private setStrokeStyle: (val: strokeStyle) => void;
	private setSlopiness: (val: slopiness) => void;
	private setEdges: (val: edges) => void;
	private setFontFamily: (val: fontFamily) => void;
	private setFontSize: (val: fontSize) => void;
	private setTextAlign: (val: textAlign) => void;
	private setArrowType: (val: arrowType) => void;
	private setFrontArrowHead: (val: frontArrow) => void;
	private setBackArrowHead: (val: backArrow) => void;

	private pencilPoints: { x: number; y: number }[] = [];
	private laserPoints: Laser[] = [];

	private cursorInterval: NodeJS.Timeout | null = null;
	private currentPos: { x: number; y: number } | null = null;
	private lastCursorPos: { x: number; y: number } | null = null;
	private lastMoveTs: number = 0;
	private otherUsers = new Map<
		string,
		{ pos: { x: number; y: number }; lastSeen: Number }
	>();

	socket: WebSocket;
	//-----------------------
	private unsubscribeLayer: () => void;
	private setLayers: (val: layers) => void;
	private layerManager: LayerManager;

	// Helper instances
	private socketHelper: SocketHelper;
	private coordinateHelper: CoordinateHelper;
	private shapeCreator: ShapeCreator;

	// Throttled socket message sending for preview updates
	private lastSocketSendTime: number = 0;
	private sendDrawMessage = (message: Message) => {
		const now = Date.now();
		if (now - this.lastSocketSendTime < this.socketSendThrottleMs) {
			return; // Skip this message
		}

		this.lastSocketSendTime = now;
		this.socket.send(
			JSON.stringify({
				type: "draw-message",
				message,
				roomId: this.roomId,
				clientId: this.user!.id,
			})
		);
	};

	// Debounced update for drag operations
	private updateTimeout: NodeJS.Timeout | null = null;
	private debouncedUpdateMessage = (message: Message) => {
		if (this.updateTimeout) {
			clearTimeout(this.updateTimeout);
		}

		this.updateTimeout = setTimeout(() => {
			this.socket.send(
				JSON.stringify({
					type: "update-message",
					id: message.id,
					newMessage: message,
					roomId: this.roomId,
					clientId: this.user!.id,
				})
			);
		}, 100);
	};

	constructor(
		socket: WebSocket,
		canvas: HTMLCanvasElement,
		roomId: string,
		authenticated: boolean,
		isActive: boolean | undefined
	) {
		this.socket = socket;
		this.canvas = canvas;
		this.roomId = roomId;
		this.ctx = canvas.getContext("2d")!;
		this.roomId = roomId;
		this.authenticated = authenticated;
		this.isActive = isActive;

		this.messages = [];
		this.previewMessage = [];
		this.layerManager = new LayerManager(this.messages);
		this.rc = rough.canvas(this.canvas);
		this.generator = rough.generator();

		// Initialize helper classes
		this.socketHelper = new SocketHelper(this.socket, this.roomId, "");
		this.coordinateHelper = new CoordinateHelper(
			this.canvas,
			this.scale,
			this.offsetX,
			this.offsetY
		);
		this.shapeCreator = new ShapeCreator(this.generator);

		// Initialize shape managers
		this.rectangleManager = new RectangleManager(
			this.ctx,
			this.rc,
			this.generator,
			this.socket,
			this.theme,
			this.roomId,
			this.user?.id || ""
		);

		this.rhombusManager = new RhombusManager(
			this.ctx,
			this.rc,
			this.generator,
			this.socket,
			this.theme,
			this.roomId,
			this.user?.id || ""
		);

		this.ellipseManager = new EllipseManager(
			this.ctx,
			this.rc,
			this.generator,
			this.socket,
			this.theme,
			this.roomId,
			this.user?.id || ""
		);

		this.lineManager = new LineManager(
			this.ctx,
			this.rc,
			this.generator,
			this.socket,
			this.theme,
			this.roomId,
			this.user?.id || ""
		);

		this.arrowManager = new ArrowManager(
			this.ctx,
			this.rc,
			this.generator,
			this.socket,
			this.theme,
			this.roomId,
			this.user?.id || ""
		);

		this.pencilManager = new PencilManager(
			this.ctx,
			this.rc,
			this.generator,
			this.socket,
			this.theme,
			this.roomId,
			this.user?.id || ""
		);

		this.initHandler();
		this.initSocketHandler();
		this.initMouseEventHandler();

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
				// Re-render after programmatic zoom change for viewport culling
				this.throttledRender();
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
		this.setLayers = useLayersStore.getState().setLayers;
		this.unsubscribeLayer = useLayersStore.subscribe(
			(state) => state.layers,
			(newVal, prevVal) => {
				if (newVal !== "none") {
					if (this.selectedMessage) {
						if (newVal === "back")
							this.layerManager.bringtoBack(this.selectedMessage);
						else if (newVal === "front")
							this.layerManager.bringtoFront(
								this.selectedMessage
							);
						else if (newVal === "backward")
							this.layerManager.sendBackward(
								this.selectedMessage
							);
						else if (newVal === "forward")
							this.layerManager.bringForward(
								this.selectedMessage
							);

						this.socketHelper.sendSyncAll(
							this.layerManager.getMessages()
						);
					}
					this.setLayers("none");
				}
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
		this.setFontFamily = useFontFamilyStore.getState().setFontFamily;
		this.setFontSize = useFontSizeStore.getState().setFontSize;
		this.setTextAlign = useTextAlignStore.getState().setTextAlign;
		this.setArrowType = useArrowTypeStore.getState().setArrowType;
		this.setFrontArrowHead =
			useFrontArrowStore.getState().setFrontArrowType;
		this.setBackArrowHead = useBackArrowStore.getState().setBackArrowType;

		const CURSOR_SEND_MS = 500; // send interval (tune as needed)
		const IDLE_TIMEOUT_MS = 5000;

		this.cursorInterval = setInterval(() => {
			if (!this.user) return;

			const now = Date.now();
			if (
				this.lastCursorPos &&
				now - this.lastMoveTs <= IDLE_TIMEOUT_MS
			) {
				this.socketHelper.sendCursor(
					this.user.username,
					this.lastCursorPos
				);
				return;
			}
		}, CURSOR_SEND_MS);
	}

	undo() {
		this.socketHelper.sendUndo();
	}
	redo() {
		this.socketHelper.sendRedo();
	}

	/**
	 * Sets the cursor style for the canvas
	 */
	setCursor(cursor: string): void {
		this.canvas.style.cursor = cursor;
	}

	/** ------------------------------------------------------------------- */
	async initHandler() {
		this.messages = await getExistingMessages(
			this.roomId,
			this.authenticated,
			this.isActive
		);
		if (this.onMessageChange) {
			this.onMessageChange();
		}
		this.renderCanvas();
		window.addEventListener("keydown", (e) => {
			//delete
			if (e.key === "Backspace") {
				e.preventDefault();

				if (this.selectedMessage) {
					this.socketHelper.sendDeleteMessage(
						this.selectedMessage.id
					);
				}
				this.selectedMessage = null;
				this.preSelectedMessage = null;
				this.canvas.style.cursor = "default";
			}
			// undo
			if (
				(e.ctrlKey || e.metaKey) &&
				e.key.toLowerCase() === "z" &&
				!e.shiftKey
			) {
				e.preventDefault();
				this.undo();
			}
			// redo
			if (
				(e.ctrlKey || e.metaKey) &&
				(e.key.toLowerCase() === "y" ||
					(e.shiftKey && e.key.toLowerCase() === "z"))
			) {
				e.preventDefault();
				this.redo();
			}
			if (
				this.tool !== "text" &&
				!(
					document.activeElement instanceof HTMLTextAreaElement ||
					document.activeElement instanceof HTMLInputElement ||
					(document.activeElement instanceof HTMLElement &&
						document.activeElement.isContentEditable)
				)
			) {
				if (e.key === "1") {
					this.setTool("mouse" as Tool);
					this.setProps("mouse" as Tool);
				}
				if (e.key === "2") {
					this.setTool("rectangle" as Tool);
					this.setProps("rectangle" as Tool);
				}
				//3.rhombus
				if (e.key === "3") {
					this.setTool("rhombus" as Tool);
					this.setProps("rhombus" as Tool);
				}
				//4.arc
				if (e.key === "4") {
					this.setTool("arc" as Tool);
					this.setProps("arc" as Tool);
				}
				//5.arrow
				if (e.key === "5") {
					this.setTool("arrow" as Tool);
					this.setProps("arrow" as Tool);
				}
				//6.line
				if (e.key === "6") {
					this.setTool("line" as Tool);
					this.setProps("line" as Tool);
				}
				//7.pencil
				if (e.key === "7") {
					this.setTool("pencil" as Tool);
					this.setProps("pencil" as Tool);
				}
				//8.text
				if (e.key === "8") {
					this.setTool("text" as Tool);
					this.setProps("text" as Tool);
				}
				//9.image
				if (e.key === "9") {
					this.setTool("image" as Tool);
					this.setProps("image" as Tool);
				}
				//0.eraser
				if (e.key === "0") {
					this.setTool("eraser" as Tool);
					this.setProps("eraser" as Tool);
				}
				//W.web (map to hand/pan)
				if (e.key.toLowerCase() === "w") {
					this.setTool("web" as Tool);
					this.setProps("web" as Tool);
				}
				//L.laser
				if (e.key.toLowerCase() === "l") {
					this.setTool("laser" as Tool);
					this.setProps("laser" as Tool);
				}
			}
		});
	}
	initSocketHandler() {
		// on every message received, validate and safely apply updates to local state
		this.socket.onmessage = (e: MessageEvent) => {
			let parsedData: any;
			try {
				parsedData = JSON.parse(e.data);
			} catch (err) {
				console.warn("socket: received invalid JSON", err);
				return;
			}
			if (!parsedData) {
				return;
			}

			switch (parsedData.type) {
				case "draw": {
					const message = parsedData.message as Message;
					const senderId = parsedData.clientId as string | undefined;

					if (this.user && senderId && this.user.id === senderId) {
						return;
					}

					let updated = false;
					this.previewMessage = this.previewMessage.map((msg) => {
						if (msg.id === message.id) {
							updated = true;
							return { ...message };
						}
						return msg;
					});
					if (!updated) {
						this.previewMessage.push(message);
					}

					this.previewMessage = this.previewMessage.filter(
						(m, i, arr) => arr.findIndex((x) => x.id === m.id) === i
					);

					this.renderCanvas();
					break;
				}

				case "create": {
					const msg = parsedData.message as Message;
					const previewId = parsedData.previewId as
						| string
						| undefined;

					if (
						!msg ||
						typeof msg.id !== "string" ||
						typeof msg.shape !== "string"
					) {
						console.warn(
							"socket: invalid shape payload",
							parsedData
						);
						return;
					}

					if (msg.boundingBox) {
						const bb = msg.boundingBox;
						if (
							typeof bb.x !== "number" ||
							typeof bb.y !== "number" ||
							typeof bb.w !== "number" ||
							typeof bb.h !== "number"
						) {
							console.warn(
								"socket: invalid boundingBox",
								parsedData
							);
							return;
						}
					}

					// avoid duplicates
					if (!this.messages.find((m) => m.id === msg.id)) {
						this.messages.push(msg as Message);
						this.layerManager.setMessages(this.messages);
					}

					// 1) preferred: clear preview by previewId (if server forwarded it)
					if (previewId && typeof previewId === "string") {
						this.previewMessage = this.previewMessage.filter(
							(pm) => pm.id !== previewId
						);
					}

					// 2) defensive: always remove any preview with the same final id (edge cases)
					this.previewMessage = this.previewMessage.filter(
						(pm) => pm.id !== msg.id
					);

					// 3) fallback: for text shapes, remove previews that match by text content + approx position
					if (msg.shape === "text" && msg.textData) {
						this.previewMessage = this.previewMessage.filter(
							(pm) => {
								if (pm.shape !== "text" || !pm.textData)
									return true;
								const sameText =
									pm.textData.text === msg.textData!.text;
								const sameX =
									Math.abs(
										pm.textData.pos.x - msg.textData!.pos.x
									) < 0.0001;
								const sameY =
									Math.abs(
										pm.textData.pos.y - msg.textData!.pos.y
									) < 0.0001;
								return !(sameText && sameX && sameY);
							}
						);
					}

					// keep selection in sync
					if (
						this.selectedMessage &&
						this.selectedMessage.id === msg.id
					) {
						this.selectedMessage = msg as Message;
						this.setSelectedMessage(this.selectedMessage);
					}
					this.renderCanvas();
					// Notify about message changes
					if (this.onMessageChange) {
						this.onMessageChange();
					}
					break;
				}

				case "delete": {
					const id = parsedData.id;
					if (typeof id !== "string") {
						console.warn(
							"socket: invalid delete payload",
							parsedData
						);
						return;
					}
					this.messages = this.messages.filter(
						(message) => id !== message.id
					);
					if (
						this.selectedMessage &&
						this.selectedMessage.id === id
					) {
						this.selectedMessage = null;
					}
					this.layerManager.setMessages(this.messages);
					this.renderCanvas();
					// Notify about message changes
					if (this.onMessageChange) {
						this.onMessageChange();
					}
					break;
				}
				case "update": {
					const id = parsedData.id;
					const newMessage = parsedData.newMessage;
					if (
						typeof id !== "string" ||
						!newMessage ||
						typeof newMessage.id !== "string"
					) {
						console.warn(
							"socket: invalid update payload",
							parsedData
						);
						return;
					}
					this.messages = this.messages.map((message) => {
						if (message.id === id) {
							return { ...newMessage } as Message;
						}
						return message;
					});
					if (
						this.selectedMessage &&
						this.selectedMessage.id === id
					) {
						this.selectedMessage = { ...newMessage } as Message;
						this.setSelectedMessage(this.selectedMessage);
					}
					this.layerManager.setMessages(this.messages);
					this.renderCanvas();
					// Notify about message changes
					if (this.onMessageChange) {
						this.onMessageChange();
					}
					break;
				}
				case "cursor": {
					const username = parsedData.username;
					const pos = parsedData.pos;
					if (!username || !pos) return;

					this.otherUsers.set(username, {
						pos: pos,
						lastSeen: Date.now(),
					});
					this.renderCanvas();
					break;
				}
				case "sync": {
					this.messages = parsedData.messages;
					this.layerManager.setMessages(this.messages);
					// keep selectedMessage in sync with server state (or clear if removed)
					if (this.selectedMessage) {
						const found = this.messages.find(
							(m: Message) => m.id === this.selectedMessage!.id
						);
						if (found) {
							this.selectedMessage = found;
							+this.setSelectedMessage(found);
						} else {
							this.selectedMessage = null;
							this.setSelectedMessage(null);
						}
					}
					this.renderCanvas();
					// Notify about message changes
					if (this.onMessageChange) {
						this.onMessageChange();
					}
					break;
				}
				case "reload": {
					console.log("reload");
					this.renderCanvas();
					// Notify about message changes (canvas was reset)
					if (this.onMessageChange) {
						this.onMessageChange();
					}
					break;
				}
				default: {
					// console.warn(
					// 	"socket: unknown message type",
					// 	parsedData.type
					// );
					return;
				}
			}
		};
	}

	applyTransform() {
		this.coordinateHelper.updateTransform(
			this.scale,
			this.offsetX,
			this.offsetY
		);
		this.ctx.setTransform(
			this.scale,
			0,
			0,
			this.scale,
			this.offsetX,
			this.offsetY
		);
		// Note: Rendering is now handled by throttledRender() calls in viewport change handlers
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
	setUser(user: User) {
		this.user = user;
		// Update socket helper with user ID
		this.socketHelper = new SocketHelper(this.socket, this.roomId, user.id);

		// Update shape managers with user ID
		if (this.rc && this.generator) {
			this.rectangleManager = new RectangleManager(
				this.ctx,
				this.rc,
				this.generator,
				this.socket,
				this.theme,
				this.roomId,
				user.id
			);

			this.rhombusManager = new RhombusManager(
				this.ctx,
				this.rc,
				this.generator,
				this.socket,
				this.theme,
				this.roomId,
				user.id
			);

			this.ellipseManager = new EllipseManager(
				this.ctx,
				this.rc,
				this.generator,
				this.socket,
				this.theme,
				this.roomId,
				user.id
			);

			this.lineManager = new LineManager(
				this.ctx,
				this.rc,
				this.generator,
				this.socket,
				this.theme,
				this.roomId,
				user.id
			);

			this.arrowManager = new ArrowManager(
				this.ctx,
				this.rc,
				this.generator,
				this.socket,
				this.theme,
				this.roomId,
				user.id
			);

			this.pencilManager = new PencilManager(
				this.ctx,
				this.rc,
				this.generator,
				this.socket,
				this.theme,
				this.roomId,
				user.id
			);
		}
	}

	getMessages(): Message[] {
		return this.messages;
	}

	getMousePos = (e: MouseEvent) => {
		return this.coordinateHelper.getMousePos(e);
	};

	// Viewport culling methods
	private getViewportBounds() {
		const padding = 100; // Extra padding for smooth scrolling
		return {
			left: (-this.offsetX - padding) / this.scale,
			top: (-this.offsetY - padding) / this.scale,
			right: (-this.offsetX + this.canvas.width + padding) / this.scale,
			bottom: (-this.offsetY + this.canvas.height + padding) / this.scale,
		};
	}

	private isMessageInViewport(message: Message): boolean {
		const viewport = this.getViewportBounds();
		const bb = message.boundingBox;

		// AABB (Axis-Aligned Bounding Box) intersection test
		return !(
			bb.x + bb.w < viewport.left || // Shape is completely to the left
			bb.x > viewport.right || // Shape is completely to the right
			bb.y + bb.h < viewport.top || // Shape is completely above
			bb.y > viewport.bottom
		); // Shape is completely below
	}

	private getVisibleMessages(): Message[] {
		return this.messages.filter((message) =>
			this.isMessageInViewport(message)
		);
	}

	// Throttled render method to prevent excessive rendering
	private throttledRender = () => {
		if (this.pendingRender) return;

		const now = Date.now();
		if (now - this.lastRenderTime < this.renderThrottleMs) {
			this.pendingRender = true;
			setTimeout(
				() => {
					this.pendingRender = false;
					this.performRender();
					this.lastRenderTime = Date.now();
				},
				this.renderThrottleMs - (now - this.lastRenderTime)
			);
			return;
		}

		this.performRender();
		this.lastRenderTime = now;
	};

	// Optimized render method using requestAnimationFrame
	private performRender = () => {
		if (this.pendingRender) return;

		requestAnimationFrame(() => {
			this.renderCanvas();
		});
	};

	// Smart render method that throttles mouse operations but allows immediate rendering for other events
	private smartRender = (immediate: boolean = false) => {
		if (immediate) {
			this.renderCanvas();
		} else {
			this.throttledRender();
		}
	};
	renderCanvas() {
		// Clear with proper bounds and transform
		this.ctx.save();
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.restore();

		// Apply transform once
		this.ctx.setTransform(
			this.scale,
			0,
			0,
			this.scale,
			this.offsetX,
			this.offsetY
		);

		// Batch render operations
		this.ctx.save();

		// 🎯 VIEWPORT CULLING: Only render visible messages
		const visibleMessages = this.getVisibleMessages();

		// Group visible messages by type for batched rendering
		const messagesByType = this.groupMessagesByType(visibleMessages);

		// Render each type together to reduce context switches
		for (const [type, messages] of messagesByType) {
			this.renderMessageBatch(type, messages);
		}

		// Render preview messages (always render during drawing)
		if (this.previewMessage.length > 0) this.renderCanvasPreview();

		// Render UI elements
		if (this.selectedMessage) {
			// Only render selection UI if the selected message is visible
			if (this.isMessageInViewport(this.selectedMessage)) {
				this.setProps(this.selectedMessage.shape as Tool);
				this.setSelectedProps(this.selectedMessage);
				this.handleSelectedMessage(this.selectedMessage);
				this.preSelectedMessage = null;
			}
		}

		if (this.tool == "laser") this.drawMovingLaser();
		this.usersCursor();

		this.ctx.restore();
	}

	// Group messages by type for batched rendering
	private groupMessagesByType(messages: Message[]): Map<string, Message[]> {
		const grouped = new Map<string, Message[]>();

		for (const message of messages) {
			if (!message) continue;

			const type = message.shape;
			if (!grouped.has(type)) {
				grouped.set(type, []);
			}
			grouped.get(type)!.push(message);
		}

		return grouped;
	}

	// Render a batch of messages of the same type
	private renderMessageBatch(type: string, messages: Message[]) {
		// Set common properties for the batch
		this.ctx.save();

		for (const message of messages) {
			switch (type) {
				case "rectangle":
					this.drawRect(message);
					break;
				case "rhombus":
					this.drawRhombus(message);
					break;
				case "arc":
					this.drawEllipse(message);
					break;
				case "line":
					if (this.lineManager) {
						this.lineManager.render(message);
					}
					break;
				case "arrow":
					if (this.arrowManager) {
						this.arrowManager.render(message);
					}
					break;
				case "pencil":
					this.drawPencil(message);
					break;
				case "text":
					this.drawText(message);
					break;
				case "image":
					this.drawImage(message);
					break;
			}
		}

		this.ctx.restore();
	}
	renderCanvasPreview() {
		for (const message of this.previewMessage) {
			if (!message) return;

			if (message.shape === "rectangle") this.drawRect(message);
			else if (message.shape === "rhombus") this.drawRhombus(message);
			else if (message.shape === "arc") this.drawEllipse(message);
			else if (message.shape === "line") {
				if (this.lineManager) {
					this.lineManager.render(message);
				}
			} else if (message.shape === "arrow") {
				if (this.arrowManager) {
					this.arrowManager.render(message);
				}
			} else if (message.shape === "pencil") this.drawPencil(message);
			else if (message.shape === "text") this.drawText(message);
			else if (message.shape === "image") this.drawImage(message);
		}
	}

	// --------------------------------------------------------- Events

	usersCursor() {
		const theme = this.theme;
		const colorFromString = (str: string) => {
			let hash = 0;
			for (let i = 0; i < str.length; i++)
				hash = str.charCodeAt(i) + ((hash << 5) - hash);
			const hue = Math.abs(hash % 360);
			return `hsl(${hue}, 70%, 50%)`;
		};

		const drawPointer = (
			ctx: CanvasRenderingContext2D,
			cx: number,
			cy: number,
			size: number,
			color: string
		) => {
			const tip = { x: cx, y: cy };
			const p1 = { x: cx - size, y: cy + size * 0.35 };
			const p2 = { x: cx - size * 0.35, y: cy + size };

			ctx.save();
			ctx.beginPath();
			ctx.moveTo(tip.x, tip.y);
			ctx.lineTo(p1.x, p1.y);
			const ctrl = { x: cx - size * 0.4, y: cy + size * 0.4 };
			ctx.quadraticCurveTo(ctrl.x, ctrl.y, p2.x, p2.y);
			ctx.closePath();
			ctx.fillStyle = color;
			ctx.fill();
			ctx.restore();
		};

		for (const [username, { pos, lastSeen }] of this.otherUsers) {
			if (!pos) continue;

			const idleMs = Date.now() - Number(lastSeen);
			let alpha = 1;
			// start fading after 5s idle; full fade over next 2s, clamp minimum alpha
			const START_FADE_MS = 5000;
			const FADE_DURATION_MS = 2000;
			if (idleMs > START_FADE_MS) {
				const fadeMs = Math.min(
					(idleMs - START_FADE_MS) / FADE_DURATION_MS,
					1
				);
				alpha = 1 - fadeMs;
				if (alpha <= 0.2) alpha = 0.2; // keep a small visible hint if desired
			}

			const screenX = pos.x * this.scale + this.offsetX;
			const screenY = pos.y * this.scale + this.offsetY;

			const userColor = colorFromString(username);
			const textColor = theme === "dark" ? "#fff" : "#1e1e1e";

			this.ctx.save();
			this.ctx.globalAlpha = alpha;
			this.ctx.font = `14px ${excali.style.fontFamily}`;

			const padX = 8;
			const textW = this.ctx.measureText(username).width;
			const boxW = Math.max(32, textW + padX * 2);
			const boxH = 24;

			const boxX = screenX;
			const boxY = screenY;

			this.ctx.beginPath();
			this.ctx.fillStyle = userColor;
			this.ctx.roundRect(boxX, boxY, boxW, boxH, 8);
			this.ctx.fill();

			this.ctx.fillStyle = textColor;
			this.ctx.textBaseline = "middle";
			this.ctx.fillText(username, boxX + padX, boxY + boxH / 2);

			// ✅ pointer tip aligned with box's top-right corner
			const pointerTipX = boxX + boxW + 8;
			const pointerTipY = boxY - 10;

			drawPointer(this.ctx, pointerTipX, pointerTipY, 16, userColor);

			this.ctx.restore();
		}
	}

	handleMouseDown = (e: PointerEvent) => {
		const pos = this.getMousePos(e);
		this.startX = pos.x;
		this.startY = pos.y;

		this.previewId = uuidv4();
		this.lastPreviewSend = 0;
		this.lastPreviewRect = null;

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
		if (this.tool === "pencil") {
			this.pencilPoints.push(pos);
		}
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
			if (this.selectedMessage) {
				this.debouncedUpdateMessage(this.selectedMessage);
			}
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
		this.socketHelper.sendCreateMessage(message, this.previewId);

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
		this.currentPos = pos;
		const w = pos.x - this.startX;
		const h = pos.y - this.startY;

		this.lastCursorPos = pos;
		this.lastMoveTs = Date.now();

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

			// Re-render after hand tool pan for viewport culling
			this.throttledRender();
			return;
		}

		if (this.tool === "mouse") {
			if (this.isResizing)
				this.canvas.style.cursor = this.resizeHandler + "-resize";
			else if (this.isDragging) this.canvas.style.cursor = "move";
			this.handleMouseDrag(pos);
			return;
		}
		this.throttledRender();
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

			// Re-render after zoom change for viewport culling
			this.throttledRender();
		} else {
			this.offsetX -= e.deltaX;
			this.offsetY -= e.deltaY;

			// Re-render after pan change for viewport culling
			this.throttledRender();
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
		this.unsubscribeLayer();

		if (this.cursorInterval !== null) {
			clearInterval(this.cursorInterval);
		}

		// Clean up timeout to prevent memory leaks
		if (this.updateTimeout) {
			clearTimeout(this.updateTimeout);
		}
	}

	// !rectangle
	messageRect(w: number, h: number): Message {
		if (!this.rectangleManager) {
			throw new Error("RectangleManager not initialized");
		}
		return this.rectangleManager.createMessage(
			this.startX,
			this.startY,
			w,
			h,
			this.props,
			this.previewSeed ?? Math.floor(Math.random() * 1000000)
		);
	}
	drawRect(message: Message) {
		if (!this.rectangleManager) {
			console.error("RectangleManager not initialized");
			return;
		}
		this.rectangleManager.render(message);
	}
	drawMovingRect(w: number, h: number, options: Options) {
		if (!this.rectangleManager) {
			console.error("RectangleManager not initialized");
			return;
		}
		this.rectangleManager.renderPreview(
			this.startX,
			this.startY,
			w,
			h,
			this.props,
			this.previewId,
			this.previewSeed ?? Math.floor(Math.random() * 1000000)
		);
	}
	// !rhombus
	messageRhombus(w: number, h: number): Message {
		if (!this.rhombusManager) {
			throw new Error("RhombusManager not initialized");
		}
		return this.rhombusManager.createMessage(
			this.startX,
			this.startY,
			w,
			h,
			this.props,
			this.previewSeed ?? Math.floor(Math.random() * 1000000)
		);
	}
	drawRhombus(message: Message) {
		if (!this.rhombusManager) {
			console.error("RhombusManager not initialized");
			return;
		}
		this.rhombusManager.render(message);
	}
	drawMovingRhombus(w: number, h: number, options: Options) {
		if (!this.rhombusManager) {
			console.error("RhombusManager not initialized");
			return;
		}
		this.rhombusManager.renderPreview(
			this.startX,
			this.startY,
			w,
			h,
			this.props,
			this.previewId,
			this.previewSeed ?? Math.floor(Math.random() * 1000000)
		);
	}
	// !ellipse
	messageEllipse(w: number, h: number): Message {
		if (!this.ellipseManager) {
			throw new Error("EllipseManager not initialized");
		}
		return this.ellipseManager.createMessage(
			this.startX,
			this.startY,
			w,
			h,
			this.props,
			this.previewSeed ?? Math.floor(Math.random() * 1000000)
		);
	}
	drawEllipse(message: Message) {
		if (!this.ellipseManager) {
			console.error("EllipseManager not initialized");
			return;
		}

		this.ellipseManager.render(message);
	}
	drawMovingEllipse(w: number, h: number, options: Options) {
		if (!this.ellipseManager) {
			console.error("EllipseManager not initialized");
			return;
		}

		this.ellipseManager.renderPreview(
			this.startX,
			this.startY,
			w,
			h,
			this.props,
			this.previewId,
			this.previewSeed ?? Math.floor(Math.random() * 1000000)
		);
	}
	// !line
	messageLine(w: number, h: number): Message {
		if (!this.lineManager) {
			throw new Error("LineManager not initialized");
		}
		return this.lineManager.createMessage(
			this.startX,
			this.startY,
			w,
			h,
			this.props,
			this.previewSeed ?? Math.floor(Math.random() * 1000000)
		);
	}
	drawLine(message: Message) {
		if (!this.lineManager) {
			console.error("LineManager not initialized");
			return;
		}
		this.lineManager.render(message);
	}
	drawMovingLine(w: number, h: number, options: Options) {
		if (!this.lineManager) {
			console.error("LineManager not initialized");
			return;
		}
		this.lineManager.renderPreview(
			this.startX,
			this.startY,
			w,
			h,
			this.props,
			this.previewId,
			this.previewSeed ?? Math.floor(Math.random() * 1000000)
		);
	}
	// !arrow
	messageArrow(w: number, h: number): Message {
		if (!this.arrowManager) {
			throw new Error("ArrowManager not initialized");
		}
		return this.arrowManager.createMessage(
			this.startX,
			this.startY,
			w,
			h,
			this.props,
			this.previewSeed ?? Math.floor(Math.random() * 1000000)
		);
	}
	drawArrow(message: Message) {
		if (!this.arrowManager) {
			console.error("ArrowManager not initialized");
			return;
		}
		this.arrowManager.render(message);
	}
	drawMovingArrow(w: number, h: number, options: Options) {
		if (!this.arrowManager) {
			console.error("ArrowManager not initialized");
			return;
		}
		this.arrowManager.renderPreview(
			this.startX,
			this.startY,
			w,
			h,
			this.props,
			this.previewId,
			this.previewSeed ?? Math.floor(Math.random() * 1000000)
		);
	}
	// !pencil
	messagePencil(): Message {
		if (!this.pencilManager) {
			throw new Error("PencilManager not initialized");
		}
		return this.pencilManager.createMessage(
			this.pencilPoints,
			this.props,
			this.previewSeed ?? Math.floor(Math.random() * 1000000)
		);
	}

	drawPencil(message: Message) {
		if (!this.pencilManager) {
			console.error("PencilManager not initialized");
			return;
		}
		this.pencilManager.render(message);
	}

	drawMovingPencil(options: Options) {
		if (!this.pencilManager) {
			console.error("PencilManager not initialized");
			return;
		}
		this.pencilManager.renderPreview(
			this.pencilPoints,
			this.props,
			this.previewId,
			this.previewSeed ?? Math.floor(Math.random() * 1000000)
		);
	}
	// !text
	handleTextInput(e: PointerEvent) {
		e.preventDefault();
		const pos = this.getMousePos(e);

		const textarea = document.createElement("textarea");

		textarea.style.fontFamily = excali.style.fontFamily;
		if (this.props.fontFamily === "mononoki")
			textarea.style.fontFamily = chilanka.style.fontFamily;
		if (this.props.fontFamily === "excali")
			textarea.style.fontFamily = excali.style.fontFamily;
		if (this.props.fontFamily === "firaCode")
			textarea.style.fontFamily = firaCode.style.fontFamily;
		if (this.props.fontFamily === "ibm")
			textarea.style.fontFamily = ibm.style.fontFamily;
		if (this.props.fontFamily === "comic")
			textarea.style.fontFamily = comic.style.fontFamily;
		if (this.props.fontFamily === "monospace")
			textarea.style.fontFamily = monospace.style.fontFamily;
		if (this.props.fontFamily === "nunito")
			textarea.style.fontFamily = nunito.style.fontFamily;
		textarea.style.fontSize = `${this.props.fontSize! * this.scale}px`;
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
		const THROTTLE_MS = 100;

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
				(height || totalLines * this.props.fontSize! * this.scale) /
					this.scale,
				this.props.fontSize!
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
				opacity: this.props.opacity,
				textData: {
					text: textarea.value,
					fontFamily: this.props.fontFamily!,
					fontSize: `${this.props.fontSize}px`,
					textColor: this.props.stroke!,
					textAlign: this.props.textAlign!,
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
					clientId: this.user!.id,
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
				(height || totalLines * this.props.fontSize! * this.scale) /
					this.scale,
				this.props.fontSize!
			);

			const dummyShapeData = { options: {} } as unknown as Drawable;

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
					clientId: this.user!.id,
				})
			);

			// local preview wasn't added, so just clean up UI
			if (textarea.parentNode) textarea.remove();
			this.setTool("mouse" as Tool);
			this.setProps("mouse" as Tool);
			this.clicked = false;
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

	// Font family cache for better performance
	private fontFamilyCache = new Map<string, string>([
		["mononoki", mononoki.style.fontFamily],
		["excali", excali.style.fontFamily],
		["firaCode", firaCode.style.fontFamily],
		["ibm", ibm.style.fontFamily],
		["comic", comic.style.fontFamily],
		["monospace", monospace.style.fontFamily],
		["nunito", nunito.style.fontFamily],
	]);

	private getFontFamily(fontFamily: string): string {
		return this.fontFamilyCache.get(fontFamily) || excali.style.fontFamily;
	}

	private calculateTextX(
		x: number,
		bboxW: number,
		leftPaddingWorld: number,
		textAlign: string
	): number {
		switch (textAlign) {
			case "center":
				return x + bboxW / 2;
			case "right":
				return x + bboxW;
			default:
				return x + leftPaddingWorld;
		}
	}

	drawText(message: Message) {
		if (!message.textData) return;

		// Cache font setup to avoid repeated context changes
		this.ctx.save();

		// Set all properties at once
		const fontFamily = this.getFontFamily(message.textData.fontFamily);
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
		const topPaddingWorld = 8 / this.scale;
		const leftPaddingWorld = 8 / this.scale;
		const fontSizeNum = parseInt(message.textData.fontSize);
		const lineHeight = fontSizeNum * 1.5;
		const bboxW = message.boundingBox.w;

		// Draw all lines in one pass
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i] || "";
			let drawX = this.calculateTextX(
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
					type: "create-message",
					message,
					roomId,
					clientId: this.user!.id,
					previewId: this.previewId,
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
				if (
					HitTestHelper.pointNearLine(pos.x, pos.y, x1, y1, x2, y2, 8)
				) {
					foundMessage = true;
					this.socketHelper.sendDeleteMessage(message.id);
				}
			} else if (message.shape === "pencil" && message.pencilPoints) {
				if (
					HitTestHelper.testPencilPoints(
						pos.x,
						pos.y,
						message.pencilPoints,
						8
					)
				) {
					foundMessage = true;
					this.socketHelper.sendDeleteMessage(message.id);
				}
			} else if (message.shape === "image" || message.shape === "text") {
				const { x, y, w, h } = this.getBoundindBox(message);
				if (HitTestHelper.pointInBounds(pos.x, pos.y, x, y, w, h)) {
					this.socketHelper.sendDeleteMessage(message.id);
					foundMessage = true;
				}
			} else if (message.shape === "rectangle") {
				if (
					HitTestHelper.testRectangleEdges(
						pos.x,
						pos.y,
						message.boundingBox,
						10
					)
				) {
					this.socketHelper.sendDeleteMessage(message.id);
					foundMessage = true;
				}
			} else if (message.shape === "rhombus") {
				if (
					HitTestHelper.testRhombusEdges(
						pos.x,
						pos.y,
						message.boundingBox,
						10
					)
				) {
					this.socketHelper.sendDeleteMessage(message.id);
					foundMessage = true;
				}
			} else if (message.shape === "arc") {
				const rect = message.boundingBox;
				if (HitTestHelper.testEllipseEdges(pos.x, pos.y, rect, 10)) {
					this.socketHelper.sendDeleteMessage(message.id);
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
	// Remove the old pointNearLine method as it's now in HitTestHelper
	// Remove the old pointNearEllipse method as it's now in HitTestHelper
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
				if (
					HitTestHelper.pointNearLine(pos.x, pos.y, x1, y1, x2, y2, 8)
				) {
					foundMessage = true;
				}
			} else if (message.shape === "pencil" && message.pencilPoints) {
				if (
					HitTestHelper.testPencilPoints(
						pos.x,
						pos.y,
						message.pencilPoints,
						8
					)
				) {
					foundMessage = true;
				}
			} else if (message.shape === "image" || message.shape === "text") {
				const { x, y, w, h } = this.getBoundindBox(message);
				if (HitTestHelper.pointInBounds(pos.x, pos.y, x, y, w, h)) {
					foundMessage = true;
				}
			} else if (message.shape === "rectangle") {
				if (
					HitTestHelper.testRectangleEdges(
						pos.x,
						pos.y,
						message.boundingBox,
						10
					)
				) {
					foundMessage = true;
				}
			} else if (message.shape === "rhombus") {
				if (
					HitTestHelper.testRhombusEdges(
						pos.x,
						pos.y,
						message.boundingBox,
						10
					)
				) {
					foundMessage = true;
				}
			} else if (message.shape === "arc") {
				const rect = message.boundingBox;
				if (HitTestHelper.testEllipseEdges(pos.x, pos.y, rect, 10)) {
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
				this.setStroke(
					stroke === "transparent"
						? "transparent"
						: stroke.split("#")[1]!
				);
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
		if (!this.rectangleManager) {
			console.error("RectangleManager not initialized");
			return;
		}

		const previousPos = { x: this.prevX, y: this.prevY };
		this.rectangleManager.handleDrag(
			message,
			pos,
			previousPos,
			this.props,
			this.setSelectedMessage.bind(this)
		);

		this.prevX = pos.x;
		this.prevY = pos.y;
	}
	handleRectangleResize(message: Message, pos: { x: number; y: number }) {
		if (!this.rectangleManager) {
			console.error("RectangleManager not initialized");
			return;
		}

		const previousPos = { x: this.prevX, y: this.prevY };
		const result = this.rectangleManager.handleResize(
			message,
			pos,
			previousPos,
			this.resizeHandler,
			this.props,
			this.setSelectedMessage.bind(this),
			(cursor: string) => {
				this.canvas.style.cursor = cursor;
			}
		);

		this.resizeHandler = result.newHandler;
		this.prevX = pos.x;
		this.prevY = pos.y;
	}
	handleRectanglePropsChange(message: Message) {
		if (!this.rectangleManager) {
			console.error("RectangleManager not initialized");
			return;
		}

		this.rectangleManager.updateProperties(
			message,
			this.props,
			this.setSelectedMessage.bind(this)
		);
	}
	//* 2.rhombus
	handleRhombusDrag(message: Message, pos: { x: number; y: number }) {
		if (!this.rhombusManager) {
			console.error("RhombusManager not initialized");
			return;
		}

		const previousPos = { x: this.prevX, y: this.prevY };
		this.rhombusManager.handleDrag(
			message,
			pos,
			previousPos,
			this.props,
			this.setSelectedMessage.bind(this)
		);

		this.prevX = pos.x;
		this.prevY = pos.y;
	}
	handleRhombusResize(message: Message, pos: { x: number; y: number }) {
		if (!this.rhombusManager) {
			console.error("RhombusManager not initialized");
			return;
		}

		const previousPos = { x: this.prevX, y: this.prevY };
		const result = this.rhombusManager.handleResize(
			message,
			pos,
			previousPos,
			this.resizeHandler,
			this.props,
			this.setSelectedMessage.bind(this),
			(cursor: string) => {
				this.canvas.style.cursor = cursor;
			}
		);

		this.resizeHandler = result.newHandler;
		this.prevX = pos.x;
		this.prevY = pos.y;
	}
	handleRhombusPropsChange(message: Message) {
		if (!this.rhombusManager) {
			console.error("RhombusManager not initialized");
			return;
		}

		this.rhombusManager.updateProperties(
			message,
			this.props,
			this.setSelectedMessage.bind(this)
		);
	}
	//* 3.ellipse
	handleEllipseDrag(message: Message, pos: { x: number; y: number }) {
		if (!this.ellipseManager) {
			console.error("EllipseManager not initialized");
			return;
		}

		const previousPos = { x: this.prevX, y: this.prevY };
		this.ellipseManager.handleDrag(
			message,
			pos,
			previousPos,
			this.props,
			this.setSelectedMessage.bind(this)
		);

		this.prevX = pos.x;
		this.prevY = pos.y;
	}
	handleEllipseResize(message: Message, pos: { x: number; y: number }) {
		if (!this.ellipseManager) return;
		const result = this.ellipseManager.handleResize(
			message,
			pos,
			{ x: this.prevX, y: this.prevY },
			this.resizeHandler,
			this.props,
			(msg) => this.setSelectedMessage(msg),
			(cursor) => {
				this.canvas.style.cursor = cursor;
			}
		);
		this.resizeHandler = result.newHandler;
		this.prevX = pos.x;
		this.prevY = pos.y;
	}
	handleEllipsePropsChange(message: Message) {
		if (!this.ellipseManager) return;
		this.ellipseManager.updateProperties(message, this.props, (msg) =>
			this.setSelectedMessage(msg)
		);
	}
	//* 4.arrow
	handleArrowDrag(message: Message, pos: { x: number; y: number }) {
		if (!this.arrowManager) {
			console.error("ArrowManager not initialized");
			return;
		}

		const currentPos = { x: pos.x, y: pos.y };
		const previousPos = { x: this.prevX, y: this.prevY };

		this.arrowManager.handleDragStandardized(
			message,
			currentPos,
			previousPos,
			this.props,
			this.setSelectedMessage.bind(this)
		);

		this.prevX = pos.x;
		this.prevY = pos.y;
	}
	handleArrowResize(message: Message, pos: { x: number; y: number }) {
		if (!this.arrowManager) {
			console.error("ArrowManager not initialized");
			return;
		}

		const currentPos = { x: pos.x, y: pos.y };
		const previousPos = { x: this.prevX, y: this.prevY };

		const result = this.arrowManager.handleResizeStandardized(
			message,
			currentPos,
			previousPos,
			this.resizeHandler,
			this.props,
			this.setSelectedMessage.bind(this),
			this.setCursor.bind(this)
		);

		// Update resize handler if changed
		this.resizeHandler = result.newHandler;

		this.prevX = pos.x;
		this.prevY = pos.y;
	}
	handleArrowPropsChange(message: Message) {
		if (!this.arrowManager) {
			console.error("ArrowManager not initialized");
			return;
		}

		this.arrowManager.updatePropertiesStandardized(
			message,
			this.props,
			this.setSelectedMessage.bind(this)
		);
	}
	//* 5.line
	handleLineDrag(message: Message, pos: { x: number; y: number }) {
		if (!this.lineManager) {
			console.error("LineManager not initialized");
			return;
		}

		const previousPos = { x: this.prevX, y: this.prevY };
		this.lineManager.handleDragStandardized(
			message,
			pos,
			previousPos,
			this.props,
			this.setSelectedMessage.bind(this)
		);

		this.prevX = pos.x;
		this.prevY = pos.y;
	}
	handleLineResize(message: Message, pos: { x: number; y: number }) {
		if (!this.lineManager) {
			console.error("LineManager not initialized");
			return;
		}

		const previousPos = { x: this.prevX, y: this.prevY };
		const result = this.lineManager.handleResizeStandardized(
			message,
			pos,
			previousPos,
			this.resizeHandler,
			this.props,
			this.setSelectedMessage.bind(this),
			(cursor: string) => {
				this.canvas.style.cursor = cursor;
			}
		);

		this.resizeHandler = result.newHandler;
		this.prevX = pos.x;
		this.prevY = pos.y;
	}
	handleLinePropsChange(message: Message) {
		if (!this.lineManager) {
			console.error("LineManager not initialized");
			return;
		}

		this.lineManager.updatePropertiesStandardized(
			message,
			this.props,
			this.setSelectedMessage.bind(this)
		);
	}
	//* 6.pencil
	handlePencilDrag(message: Message, pos: { x: number; y: number }) {
		if (!this.pencilManager) {
			console.error("PencilManager not initialized");
			return;
		}

		const previousPos = { x: this.prevX, y: this.prevY };
		this.pencilManager.handleDrag(
			message,
			pos,
			previousPos,
			this.props,
			this.setSelectedMessage.bind(this)
		);

		this.prevX = pos.x;
		this.prevY = pos.y;
	}
	handlePencilResize(message: Message, pos: { x: number; y: number }) {
		if (!this.pencilManager) {
			console.error("PencilManager not initialized");
			return;
		}

		const previousPos = { x: this.prevX, y: this.prevY };
		const result = this.pencilManager.handleResize(
			message,
			pos,
			previousPos,
			this.resizeHandler,
			this.props,
			this.setSelectedMessage.bind(this),
			(cursor: string) => {
				this.canvas.style.cursor = cursor;
			}
		);

		this.resizeHandler = result.newHandler;
		this.prevX = pos.x;
		this.prevY = pos.y;
	}
	handlePencilPropsChange(message: Message) {
		if (!this.pencilManager) {
			console.error("PencilManager not initialized");
			return;
		}

		this.pencilManager.updateProperties(
			message,
			this.props,
			this.setSelectedMessage.bind(this)
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
		// this.messages = this.messages.map((msg) =>
		// 	msg.id === message.id ? newMessage : msg
		// );
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				flag: "update-preview",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
				clientId: this.user!.id,
			})
		);
		// this.renderCanvas();
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

		// this.messages = this.messages.map((msg) =>
		// 	msg.id === message.id ? newMessage : msg
		// );
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				flag: "update-preview",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
				clientId: this.user!.id,
			})
		);
		// this.renderCanvas();
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
		if (this.props.fontFamily === "mononoki")
			fontFamily = mononoki.style.fontFamily;
		if (this.props.fontFamily === "excali")
			fontFamily = excali.style.fontFamily;
		if (this.props.fontFamily === "firaCode")
			fontFamily = firaCode.style.fontFamily;
		if (this.props.fontFamily === "ibm") fontFamily = ibm.style.fontFamily;
		if (this.props.fontFamily === "comic")
			fontFamily = comic.style.fontFamily;
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
		// this.messages = this.messages.map((msg) =>
		// 	msg.id === message.id ? { ...newMessage } : msg
		// );

		this.setSelectedMessage(newMessage);
		// this.renderCanvas();

		this.socket.send(
			JSON.stringify({
				type: "update-message",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
				clientId: this.user!.id,
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

		// this.messages = this.messages.map((msg) =>
		// 	msg.id === message.id ? newMessage : msg
		// );
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				flag: "update-preview",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
				clientId: this.user!.id,
			})
		);
		// this.renderCanvas();
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

		// this.messages = this.messages.map((msg) =>
		// 	msg.id === message.id ? newMessage : msg
		// );
		this.setSelectedMessage(newMessage);
		this.socket.send(
			JSON.stringify({
				type: "update-message",
				flag: "update-preview",
				id: newMessage.id,
				newMessage,
				roomId: this.roomId,
				clientId: this.user!.id,
			})
		);
		// this.renderCanvas();
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
				clientId: this.user!.id,
			})
		);
	}
}
