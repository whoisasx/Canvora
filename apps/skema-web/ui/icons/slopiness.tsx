import { ReactNode } from "react";

function Architect() {
	return <p>ac</p>;
}

function Artist() {
	return <p>at</p>;
}

function Cartoonist() {
	return <p>c</p>;
}

const slopinessIcon: Record<string, ReactNode> = {
	architect: <Architect />,
	artist: <Artist />,
	cartoonist: <Cartoonist />,
};
export default slopinessIcon;
