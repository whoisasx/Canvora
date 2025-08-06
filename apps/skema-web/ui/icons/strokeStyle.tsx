import { ReactNode } from "react";

function Solid() {
	return <p>s</p>;
}

function Dashed() {
	return <p>ds</p>;
}

function Dotted() {
	return <p>dt</p>;
}

const strokeStyleIcon: Record<string, ReactNode> = {
	solid: <Solid />,
	dashed: <Dashed />,
	dotted: <Dotted />,
};
export default strokeStyleIcon;
