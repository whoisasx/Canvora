import { ReactNode } from "react";

function Lock() {
	return <>lc</>;
}
function Hand() {
	return <>h</>;
}
function Mouse() {
	return <>m</>;
}
function Rectangle() {
	return <>re</>;
}
function Rhombus() {
	return <>rh</>;
}
function Arc() {
	return <>ac</>;
}
function Arrow() {
	return <>ar</>;
}
function Line() {
	return <>ln</>;
}
function Pencil() {
	return <>p</>;
}
function Text() {
	return <>t</>;
}
function Image() {
	return <>i</>;
}
function Eraser() {
	return <>e</>;
}
function Options() {
	return <>ops</>;
}
function Web() {
	return <>w</>;
}
function Laser() {
	return <>ls</>;
}

const toolsIcon: Record<string, ReactNode> = {
	lock: <Lock />,
	hand: <Hand />,
	mouse: <Mouse />,
	rectangle: <Rectangle />,
	rhombus: <Rhombus />,
	arc: <Arc />,
	arrow: <Arrow />,
	line: <Line />,
	pencil: <Pencil />,
	text: <Text />,
	image: <Image />,
	eraser: <Eraser />,
	web: <Web />,
	laser: <Laser />,
	options: <Options />,
};

export default toolsIcon;
