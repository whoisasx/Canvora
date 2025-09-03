// export function createRoundedRectPath(
// 	x: number,
// 	y: number,
// 	w: number,
// 	h: number,
// 	r: number
// ) {
// 	// Random helpers
// 	const jitterEdge = () => (Math.random() - 0.5) * 1.5; // edges: ±0.75px
// 	const jitterCorner = () => (Math.random() - 0.5) * 0.5; // corners: ±0.25px

// 	// Base points with edge jitter
// 	const x1 = x + jitterEdge();
// 	const y1 = y + jitterEdge();
// 	const w1 = w + jitterEdge();
// 	const h1 = h + jitterEdge();
// 	const r1 = r; // radius stays same for join alignment

// 	// Corner start/end alignment values
// 	const topRightX = x1 + w1 - r1;
// 	const bottomRightY = y1 + h1 - r1;
// 	const bottomLeftX = x1 + r1;
// 	const topLeftY = y1 + r1;

// 	// SVG Path with shared join points
// 	return `
//     M ${x1 + r1} ${y1}
//     H ${topRightX}
//     Q ${x1 + w1 + jitterCorner()} ${y1 + jitterCorner()} ${x1 + w1} ${y1 + r1}
//     V ${bottomRightY}
//     Q ${x1 + w1 + jitterCorner()} ${y1 + h1 + jitterCorner()} ${x1 + w1 - r1} ${y1 + h1}
//     H ${bottomLeftX}
//     Q ${x1 + jitterCorner()} ${y1 + h1 + jitterCorner()} ${x1} ${y1 + h1 - r1}
//     V ${topLeftY}
//     Q ${x1 + jitterCorner()} ${y1 + jitterCorner()} ${x1 + r1} ${y1}
//     `;
// }

export function createRoundedRectPath(
	x: number,
	y: number,
	w: number,
	h: number
) {
	const r = Math.min(
		Math.abs(Math.min(w, h) / 5),
		Math.abs(w) / 2,
		Math.abs(h) / 2
	);

	return `
    M ${x + r} ${y}
    H ${x + w - r}
    Q ${x + w} ${y} ${x + w} ${y + r}
    V ${y + h - r}
    Q ${x + w} ${y + h} ${x + w - r} ${y + h}
    H ${x + r}
    Q ${x} ${y + h} ${x} ${y + h - r}
    V ${y + r}
    Q ${x} ${y} ${x + r} ${y}
    Z
    `;
}

// export function roundedRectPoints(
// 	x: number,
// 	y: number,
// 	w: number,
// 	h: number,
// 	r: number
// ): [number, number][] {
// 	const points: [number, number][] = [];
// 	r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);

// 	const totalSegmentsPerSide = 12; // includes corner + edge
// 	const stepEdge = (w - 2 * r) / totalSegmentsPerSide;
// 	const stepEdgeV = (h - 2 * r) / totalSegmentsPerSide;
// 	const stepCorner = Math.PI / 2 / totalSegmentsPerSide;

// 	const right = x + w;
// 	const bottom = y + h;

// 	// top-left corner
// 	for (let i = 0; i <= totalSegmentsPerSide; i++) {
// 		const angle = Math.PI + stepCorner * i;
// 		points.push([x + r + Math.cos(angle) * r, y + r + Math.sin(angle) * r]);
// 	}
// 	// top edge
// 	for (let i = 1; i <= totalSegmentsPerSide; i++) {
// 		points.push([x + r + stepEdge * i, y]);
// 	}
// 	// top-right corner
// 	for (let i = 0; i <= totalSegmentsPerSide; i++) {
// 		const angle = 1.5 * Math.PI + stepCorner * i;
// 		points.push([
// 			right - r + Math.cos(angle) * r,
// 			y + r + Math.sin(angle) * r,
// 		]);
// 	}
// 	// right edge
// 	for (let i = 1; i <= totalSegmentsPerSide; i++) {
// 		points.push([right, y + r + stepEdgeV * i]);
// 	}
// 	// bottom-right corner
// 	for (let i = 0; i <= totalSegmentsPerSide; i++) {
// 		const angle = 0 + stepCorner * i;
// 		points.push([
// 			right - r + Math.cos(angle) * r,
// 			bottom - r + Math.sin(angle) * r,
// 		]);
// 	}
// 	// bottom edge
// 	for (let i = 1; i <= totalSegmentsPerSide; i++) {
// 		points.push([right - r - stepEdge * i, bottom]);
// 	}
// 	// bottom-left corner
// 	for (let i = 0; i <= totalSegmentsPerSide; i++) {
// 		const angle = 0.5 * Math.PI + stepCorner * i;
// 		points.push([
// 			x + r + Math.cos(angle) * r,
// 			bottom - r + Math.sin(angle) * r,
// 		]);
// 	}
// 	// left edge
// 	for (let i = 1; i <= totalSegmentsPerSide; i++) {
// 		points.push([x, bottom - r - stepEdgeV * i]);
// 	}

// 	if (points[0] !== undefined) {
// 		points.push(points[0]); // close loop
// 	}
// 	return points;
// }
