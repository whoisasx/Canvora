type Pt = { x: number; y: number };

/**
 * Rounded polygon path (fillet) using quadratic beziers.
 * `ratio` = fraction of each adjacent edge length used BEFORE the corner (0..0.49)
 * Larger ratio = larger rounding. Keep ~0.18–0.28 for good results.
 */
function roundedPolygonPath(points: Pt[], ratio = 0.22): string {
	const n = points.length;
	const p1: Pt[] = new Array(n); // tangent point on incoming edge
	const p2: Pt[] = new Array(n); // tangent point on outgoing edge

	for (let i = 0; i < n; i++) {
		const prev = points[(i - 1 + n) % n];
		const curr = points[i];
		const next = points[(i + 1) % n];

		const v1x = curr!.x - prev!.x,
			v1y = curr!.y - prev!.y; // prev -> curr
		const v2x = next!.x - curr!.x,
			v2y = next!.y - curr!.y; // curr -> next

		const l1 = Math.hypot(v1x, v1y);
		const l2 = Math.hypot(v2x, v2y);
		if (l1 === 0 || l2 === 0) continue;

		const u1x = v1x / l1,
			u1y = v1y / l1; // incoming dir
		const u2x = v2x / l2,
			u2y = v2y / l2; // outgoing dir

		// Interior angle at curr between (-u1) and (u2)
		const dot = Math.max(-1, Math.min(1, -(u1x * u2x + u1y * u2y)));
		const alpha = Math.acos(dot); // interior angle

		// Desired distance along each edge before the corner (as fraction of edge)
		const tDesired = Math.min(l1, l2) * ratio;
		// Safety: don't eat the whole edge
		const tMax = Math.min(l1, l2) * 0.49;
		const t = Math.min(tDesired, tMax); // edge offset

		// (FYI: the corresponding circular radius would be r = t * tan(alpha/2))
		const a1x = -u1x,
			a1y = -u1y; // from curr toward prev
		const a2x = u2x,
			a2y = u2y; // from curr toward next

		p1[i] = { x: curr!.x + a1x * t, y: curr!.y + a1y * t };
		p2[i] = { x: curr!.x + a2x * t, y: curr!.y + a2y * t };
	}

	const steepness = 0.15; // 0 = normal, higher = steeper curve

	// Build path: …L p1 -> Q curr -> p2… around the loop
	let d = `M ${p2[n - 1]!.x} ${p2[n - 1]!.y}\n`;
	for (let i = 0; i < n; i++) {
		const curr = points[i];
		d += `L ${p1[i]!.x} ${p1[i]!.y}\n`;
		const ctrlX =
			curr!.x + ((p1[i]!.x + p2[i]!.x) / 2 - curr!.x) * steepness;
		const ctrlY =
			curr!.y + ((p1[i]!.y + p2[i]!.y) / 2 - curr!.y) * steepness;
		d += `Q ${ctrlX} ${ctrlY} ${p2[i]!.x} ${p2[i]!.y}\n`;
	}
	d += "Z";
	return d;
}

/**
 * Rhombus (diamond) path. When `round=true`, corners are filleted
 * based on edge geometry so it scales nicely for any w/h.
 * `ratio` controls how round the corners are (0..0.49).
 */
export function createRhombusPath(
	x: number,
	y: number,
	w: number,
	h: number,
	round: boolean,
	ratio = 0.18
) {
	if (!round) {
		return `
        M ${x + w / 2} ${y}
        L ${x + w} ${y + h / 2}
        L ${x + w / 2} ${y + h}
        L ${x} ${y + h / 2}
        Z
    `;
	}

	// Diamond vertices (clockwise): top, right, bottom, left
	const pts: Pt[] = [
		{ x: x + w / 2, y: y },
		{ x: x + w, y: y + h / 2 },
		{ x: x + w / 2, y: y + h },
		{ x: x, y: y + h / 2 },
	];

	return roundedPolygonPath(pts, ratio);
}
