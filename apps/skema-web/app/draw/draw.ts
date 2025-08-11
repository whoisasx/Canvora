import { useZoomStore } from "@/utils/canvasStore";
import { defaultShape, ShapeProps, Tool } from "./types";

type Message = {
	shape: "rect";
	x: number;
	y: number;
	width: number;
	height: number;
	props: ShapeProps;
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

	private messages: Message[];
	private tool: Tool = "rectangle";

	private unsubscribeZoom: () => void;
	private setZoom!: (val: number) => void;

	socket: WebSocket;

	constructor(socket: WebSocket, canvas: HTMLCanvasElement, roomId: string) {
		this.socket = socket;
		this.canvas = canvas;
		this.roomId = roomId;
		this.ctx = canvas.getContext("2d")!;

		this.messages = [];

		this.initMouseEventHandler();
		this.initSocketHandler();
		this.initHandler();
		this.unsubscribeZoom = useZoomStore.subscribe(
			(state) => state.zoom,
			(newVal, prevVal) => {
				const zoomFactor = newVal / 100 / this.scale;

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

	selectTool(tool: Tool) {
		this.tool = tool;
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
			if (message.shape === "rect") {
				this.ctx.strokeRect(
					message.x,
					message.y,
					message.width,
					message.height
				);
			}
		}
	}

	// --------------------------------------------------------- Events

	handleMouseDown = (e: PointerEvent) => {
		this.clicked = true;
		const pos = this.getMousePos(e);
		this.startX = pos.x;
		this.startY = pos.y;
	};
	handleMouseUp = (e: PointerEvent) => {
		this.clicked = false;
		const pos = this.getMousePos(e);
		const w = pos.x - this.startX;
		const h = pos.y - this.startY;

		//TODO: send the message to the server and will eventually recieve it through initSocketHandler.
		const message: Message = {
			shape: "rect",
			x: this.startX,
			y: this.startY,
			width: w,
			height: h,
			props: defaultShape,
		};

		this.socket.send(
			JSON.stringify({
				type: "shape",
				message,
				roomId: this.roomId,
			})
		);
	};
	handleMouseMove = (e: PointerEvent) => {
		if (!this.clicked) return;
		const pos = this.getMousePos(e);
		const w = pos.x - this.startX;
		const h = pos.y - this.startY;
		this.renderCanvas();
		this.ctx.strokeRect(this.startX, this.startY, w, h);
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

			this.applyTransform();
		} else {
			this.offsetX -= e.deltaX;
			this.offsetY -= e.deltaY;
			this.applyTransform();
		}
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
	}
}

function normalizeWheelDelta(e: WheelEvent): number {
	let delta = e.deltaY;
	switch (e.deltaMode) {
		case 1:
			delta *= 16;
			break;
		case 2:
			delta *= window.innerHeight;
			break;
	}

	return delta;
}
