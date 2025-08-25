export function createEllipsePath(x: number, y: number, w: number, h: number) {
	const kappa = 0.5522847498307936; // exact constant
	const rx = w / 2;
	const ry = h / 2;
	const cx = x + rx;
	const cy = y + ry;

	const ox = rx * kappa; // horizontal control point offset
	const oy = ry * kappa; // vertical control point offset

	return `
    M ${cx - rx}, ${cy}
    C ${cx - rx}, ${cy - oy} ${cx - ox}, ${cy - ry} ${cx}, ${cy - ry}
    C ${cx + ox}, ${cy - ry} ${cx + rx}, ${cy - oy} ${cx + rx}, ${cy}
    C ${cx + rx}, ${cy + oy} ${cx + ox}, ${cy + ry} ${cx}, ${cy + ry}
    C ${cx - ox}, ${cy + ry} ${cx - rx}, ${cy + oy} ${cx - rx}, ${cy}
    Z
    `;
}
