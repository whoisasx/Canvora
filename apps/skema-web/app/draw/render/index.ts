export function normalizeStroke(theme: string, stroke: string): string {
	const newStroke =
		theme === "light"
			? stroke === "#ffffff"
				? "#1e1e1e"
				: stroke
			: stroke === "#1e1e1e"
				? "#ffffff"
				: stroke;

	return newStroke;
}

export function roughOptions(props: any) {
	const prop = {
		stroke: props.stroke,
		fill:
			!props.background || props.background === "transparent"
				? undefined
				: props.background,
		fillStyle:
			!props.fillStyle || props.fillStyle === "none"
				? undefined
				: props.fillStyle,
		strokeWidth: props.strokeWidth,
		strokeLineDash: props.lineDash,
		roughness: props.roughness,
		curveStepCount: 20,
		curveFitting: 0.95,
		curveTightness: 0,
		strokeLineCap: "round",
	};
	return prop;
}

export function normalizeCoords(x: number, y: number, w: number, h: number) {
	let nx = x;
	let ny = y;
	let nw = w;
	let nh = h;

	if (w < 0) {
		nx = x + w;
		nw = Math.abs(w);
	}
	if (h < 0) {
		ny = y + h;
		nh = Math.abs(h);
	}

	return { x: nx, y: ny, w: nw, h: nh };
}

export function normalizeWheelDelta(e: WheelEvent): number {
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

export type Handle = "none" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

export function getResizeHandleAndCursor(
	px: number,
	py: number,
	rect: Rect,
	offset = 6
): { handle: Handle; cursor: string } {
	const { x, y, w, h } = rect;
	const leftX = x;
	const rightX = x + w;
	const topY = y;
	const bottomY = y + h;

	const nearLeft =
		Math.abs(px - leftX) <= offset &&
		py >= topY - offset &&
		py <= bottomY + offset;
	const nearRight =
		Math.abs(px - rightX) <= offset &&
		py >= topY - offset &&
		py <= bottomY + offset;
	const nearTop =
		Math.abs(py - topY) <= offset &&
		px >= leftX - offset &&
		px <= rightX + offset;
	const nearBottom =
		Math.abs(py - bottomY) <= offset &&
		px >= leftX - offset &&
		px <= rightX + offset;

	// Prioritize corners over edges
	if (nearTop && nearLeft) return { handle: "nw", cursor: "nwse-resize" };
	if (nearTop && nearRight) return { handle: "ne", cursor: "nesw-resize" };
	if (nearBottom && nearLeft) return { handle: "sw", cursor: "nesw-resize" };
	if (nearBottom && nearRight) return { handle: "se", cursor: "nwse-resize" };

	// Edges
	if (nearLeft || nearRight)
		return { handle: nearLeft ? "w" : "e", cursor: "ew-resize" }; // vertical lines → horizontal arrows
	if (nearTop || nearBottom)
		return { handle: nearTop ? "n" : "s", cursor: "ns-resize" }; // horizontal lines → vertical arrows

	return { handle: "none", cursor: "default" };
}
