export function makeCircleCursor(size = 16) {
	const canvas = document.createElement("canvas");
	canvas.width = size * 2;
	canvas.height = size * 2;

	const ctx = canvas.getContext("2d")!;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw a simple red ring (outline) with glowing effect
	const outlineRadius = size / 2;
	ctx.beginPath();
	ctx.arc(size, size, outlineRadius, 0, Math.PI * 2);
	ctx.strokeStyle = "red";
	ctx.lineWidth = 2;
	ctx.shadowColor = "red";
	ctx.shadowBlur = 10;
	ctx.stroke();

	// return as data URL
	return `url(${canvas.toDataURL("image/png")}) ${size} ${size}, auto`;
}
