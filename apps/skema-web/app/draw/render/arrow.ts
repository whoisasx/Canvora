import { arrowType, backArrow, frontArrow } from "../types";

export function createArrowPath(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	front: frontArrow, //"none" | "arrow" | "triangle" | "triangleOutline"
	back: backArrow, //"none" | "arrow" | "triangle" | "triangleOutline"
	arrow_type: arrowType, // that i will handle later... for now give me the just straight arrow
	headLength = 16, // arrowhead ki lambai
	headAngle = Math.PI / 6 // arrowhead ka angle
) {
	const dx = x2 - x1;
	const dy = y2 - y1;
	const angle = Math.atan2(dy, dx);

	function getHeadPoints(tipX: number, tipY: number, dirAngle: number) {
		const p1x = tipX - headLength * Math.cos(dirAngle - headAngle);
		const p1y = tipY - headLength * Math.sin(dirAngle - headAngle);
		const p2x = tipX - headLength * Math.cos(dirAngle + headAngle);
		const p2y = tipY - headLength * Math.sin(dirAngle + headAngle);
		return { p1x, p1y, p2x, p2y };
	}

	const linePath = `M ${x1} ${y1} L ${x2} ${y2}`;

	function addHead(
		tipX: number,
		tipY: number,
		dirAngle: number,
		type: frontArrow | backArrow
	) {
		if (type === "none") return "";
		const { p1x, p1y, p2x, p2y } = getHeadPoints(tipX, tipY, dirAngle);
		if (type === "arrow") {
			return `M ${p1x} ${p1y} L ${tipX} ${tipY} L ${p2x} ${p2y}`;
		} else if (type === "triangle" || type === "triangleOutline") {
			return `M ${p1x} ${p1y} L ${tipX} ${tipY} L ${p2x} ${p2y} Z`;
		}
		return "";
	}

	let frontHeadPath = "";
	let backHeadPath = "";

	if (
		front === "arrow" ||
		front === "triangle" ||
		front === "triangleOutline"
	) {
		frontHeadPath = addHead(x2, y2, angle, front);
	}

	if (back === "arrow" || back === "triangle" || back === "triangleOutline") {
		backHeadPath = addHead(x1, y1, angle + Math.PI, back);
	}

	return { linePath, frontHeadPath, backHeadPath };
}
