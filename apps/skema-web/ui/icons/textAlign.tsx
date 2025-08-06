import { ReactNode } from "react";

function Left() {
	return <p>l</p>;
}

function Center() {
	return <p>c</p>;
}

function Right() {
	return <p>r</p>;
}

const textAlignIcon: Record<string, ReactNode> = {
	left: <Left />,
	center: <Center />,
	right: <Right />,
};
export default textAlignIcon;
