// export function createPencilPath(points: { x: number; y: number }[]) {
// 	if (points.length < 2) return "";

// 	let d = `M ${points[0]!.x} ${points[0]!.y}`;
// 	for (let i = 1; i < points.length; i++) {
// 		d += ` L ${points[i]!.x} ${points[i]!.y}`;
// 	}

// 	return d;
// }

export function createPencilPath(points: { x: number; y: number }[]) {
	if (points.length < 2) return "";

	let d = `M ${points[0]!.x} ${points[0]!.y}`;

	for (let i = 1; i < points.length - 1; i++) {
		const midX = (points[i]!.x + points[i + 1]!.x) / 2;
		const midY = (points[i]!.y + points[i + 1]!.y) / 2;
		d += ` Q ${points[i]!.x} ${points[i]!.y}, ${midX} ${midY}`;
	}

	// last point
	const last = points[points.length - 1];
	d += ` L ${last!.x} ${last!.y}`;

	return d;
}
