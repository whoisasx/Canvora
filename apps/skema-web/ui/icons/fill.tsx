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

const fillIcons: Record<string, ReactNode> = {
	hachure: <Hachure />,
	cross: <Cross />,
	solid: <Solid />,
};
export default fillIcons;
