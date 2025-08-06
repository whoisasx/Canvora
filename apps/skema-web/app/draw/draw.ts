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
	private messages: Message[];
	private tool: Tool = "rectangle";

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

	selectTool(tool: Tool) {
		this.tool = tool;
	}

	getMousePos = (e: MouseEvent) => {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};
	};

	renderCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

	// ---------------------------------------------------------

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

	//---------------------------------------------------------------

	private boundMouseDown = this.handleMouseDown.bind(this);
	private boundMouseUp = this.handleMouseUp.bind(this);
	private boundMouseMove = this.handleMouseMove.bind(this);

	initMouseEventHandler() {
		this.canvas.addEventListener("pointerdown", this.boundMouseDown);
		this.canvas.addEventListener("pointermove", this.boundMouseMove);
		this.canvas.addEventListener("pointerup", this.boundMouseUp);
	}

	destructor() {
		this.canvas.removeEventListener("pointerdown", this.boundMouseDown);
		this.canvas.removeEventListener("pointermove", this.boundMouseMove);
		this.canvas.removeEventListener("pointerup", this.boundMouseUp);
	}
}
