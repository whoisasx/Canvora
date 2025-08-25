import { ReactNode } from "react";

function Caveat() {
	return <p>cv</p>;
}

function Draw() {
	return <p>d</p>;
}

function Code() {
	return <p>c</p>;
}
function Normal() {
	return <p>n</p>;
}
function Little() {
	return <p>l</p>;
}
function Nunito() {
	return <p>nu</p>;
}
function Mono() {
	return <p>m</p>;
}

const fontFamilyIcon: Record<string, ReactNode> = {
	caveat: <Caveat />,
	draw: <Draw />,
	code: <Code />,
	normal: <Normal />,
	little: <Little />,
	nunito: <Nunito />,
	mono: <Mono />,
};
export default fontFamilyIcon;
