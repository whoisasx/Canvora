import { ReactNode, ComponentType } from "react";

function Hachure() {
	return <p>h</p>;
}

function Cross() {
	return <p>c</p>;
}

function Solid() {
	return <p>s</p>;
}
function Dots() {
	return <p>d</p>;
}

const fillIcons: Record<string, ReactNode> = {
	hachure: <Hachure />,
	cross: <Cross />,
	solid: <Solid />,
	dots: <Dots />,
};
export default fillIcons;
