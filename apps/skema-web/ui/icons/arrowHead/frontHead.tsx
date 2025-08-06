import { ReactNode } from "react";

function None() {
	return <p>n</p>;
}

function Arrow() {
	return <p>a</p>;
}

function Triangle() {
	return <p>t</p>;
}
function TriangleOutline() {
	return <p>tl</p>;
}

const frontHeadIcons: Record<string, ReactNode> = {
	none: <None />,
	arrow: <Arrow />,
	triangle: <Triangle />,
	triangleOutline: <TriangleOutline />,
};
export default frontHeadIcons;
