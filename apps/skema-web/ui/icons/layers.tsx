import { ReactNode } from "react";

function Back() {
	return <p>b</p>;
}

function Backward() {
	return <p>bw</p>;
}

function ForWard() {
	return <p>fw</p>;
}

function Front() {
	return <p>f</p>;
}

const layersIcon: Record<string, ReactNode> = {
	back: <Back />,
	backward: <Backward />,
	forward: <ForWard />,
	front: <Front />,
};
export default layersIcon;
