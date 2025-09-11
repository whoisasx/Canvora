import { v4 as uuidv4 } from "uuid";
import LocalDriver from "@/utils/localPersistence";

export type FreePoint = { x: number; y: number };
export type FreeMessage = {
	id: string;
	shape: "pencil";
	pencilPoints: FreePoint[];
	stroke?: { color: string; width: number };
	boundingBox: { x: number; y: number; w: number; h: number };
	createdAt: string;
};

export class FreeGame {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private boardId: string;
	private drawing = false;
	private pencilPoints: FreePoint[] = [];
	private messages: FreeMessage[] = [];
	private pointerMoveHandler: (e: PointerEvent) => void;
	private pointerDownHandler: (e: PointerEvent) => void;
	private pointerUpHandler: (e: PointerEvent) => void;

	constructor(canvas: HTMLCanvasElement, boardId: string) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;
		this.boardId = boardId;

		// bind handlers
		this.pointerMoveHandler = this.onPointerMove.bind(this);
		this.pointerDownHandler = this.onPointerDown.bind(this);
		this.pointerUpHandler = this.onPointerUp.bind(this);

		this.init();
	}

	private async init() {
		// load existing messages
		try {
			const snap = await LocalDriver.load(this.boardId);
			this.messages = snap?.messages ?? [];
		} catch (err) {
			this.messages = [];
		}
		this.resizeCanvas();
		this.renderCanvas();
		this.attachEvents();
		window.addEventListener("resize", this.resizeCanvas.bind(this));
	}

	private resizeCanvas() {
		const dpr = window.devicePixelRatio || 1;
		const w = window.innerWidth;
		const h = window.innerHeight;
		this.canvas.width = Math.floor(w * dpr);
		this.canvas.height = Math.floor(h * dpr);
		this.canvas.style.width = `${w}px`;
		this.canvas.style.height = `${h}px`;
		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	private attachEvents() {
		this.canvas.addEventListener("pointerdown", this.pointerDownHandler);
		window.addEventListener("pointermove", this.pointerMoveHandler);
		window.addEventListener("pointerup", this.pointerUpHandler);
	}

	private detachEvents() {
		this.canvas.removeEventListener("pointerdown", this.pointerDownHandler);
		window.removeEventListener("pointermove", this.pointerMoveHandler);
		window.removeEventListener("pointerup", this.pointerUpHandler);
		window.removeEventListener("resize", this.resizeCanvas.bind(this));
	}

	private onPointerDown(e: PointerEvent) {
		const rect = this.canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		this.drawing = true;
		this.pencilPoints = [{ x, y }];
	}

	private onPointerMove(e: PointerEvent) {
		if (!this.drawing) return;
		const rect = this.canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		this.pencilPoints.push({ x, y });
		this.redrawLastStroke();
	}

	private onPointerUp(_e: PointerEvent) {
		if (!this.drawing) return;
		this.drawing = false;
		if (this.pencilPoints.length > 1) {
			const bb = this.computeBBox(this.pencilPoints);
			const msg: FreeMessage = {
				id: uuidv4(),
				shape: "pencil",
				pencilPoints: this.pencilPoints.slice(),
				stroke: { color: "000000", width: 2 },
				boundingBox: bb,
				createdAt: new Date().toISOString(),
			};
			this.messages.push(msg);
			this.pencilPoints = [];
			this.save();
			this.renderCanvas();
		}
	}

	private redrawLastStroke() {
		// draw current messages then preview
		this.renderCanvas();
		if (this.pencilPoints.length === 0) return;
		this.ctx.strokeStyle = `#000`;
		this.ctx.lineWidth = 2;
		this.ctx.lineJoin = "round";
		this.ctx.lineCap = "round";
		this.ctx.beginPath();
		const pts = this.pencilPoints;
		if (!pts || pts.length === 0) return;
		this.ctx.moveTo(pts[0].x, pts[0].y);
		for (let i = 1; i < pts.length; i++)
			this.ctx.lineTo(pts[i].x, pts[i].y);
		this.ctx.stroke();
	}

	private computeBBox(points: FreePoint[]) {
		let minX = Infinity,
			minY = Infinity,
			maxX = -Infinity,
			maxY = -Infinity;
		for (const p of points) {
			if (p.x < minX) minX = p.x;
			if (p.y < minY) minY = p.y;
			if (p.x > maxX) maxX = p.x;
			if (p.y > maxY) maxY = p.y;
		}
		return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
	}

	private renderCanvas() {
		// clear
		const w = this.canvas.width;
		const h = this.canvas.height;
		this.ctx.clearRect(0, 0, w, h);
		// draw messages
		for (const m of this.messages) {
			if (m.shape === "pencil") {
				this.ctx.strokeStyle = `#${m.stroke?.color ?? "000"}`;
				this.ctx.lineWidth = m.stroke?.width ?? 2;
				this.ctx.lineJoin = "round";
				this.ctx.lineCap = "round";
				this.ctx.beginPath();
				const pts = m.pencilPoints;
				if (!pts || pts.length === 0) continue;
				this.ctx.moveTo(pts[0].x, pts[0].y);
				for (let i = 1; i < pts.length; i++)
					this.ctx.lineTo(pts[i].x, pts[i].y);
				this.ctx.stroke();
			}
		}
	}

	private async save() {
		const snap = {
			id: this.boardId,
			version: 1,
			messages: this.messages,
			meta: {
				modifiedAt: new Date().toISOString(),
				createdAt: new Date().toISOString(),
			},
		} as any;
		await LocalDriver.save(this.boardId, snap);
	}

	destructor() {
		this.detachEvents();
	}
}

export default FreeGame;
