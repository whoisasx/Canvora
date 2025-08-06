import { ReactNode } from "react";

function Thin() {
	return <p>tn</p>;
}

function Normal() {
	return <p>n</p>;
}

function Thick() {
	return <p>th</p>;
}

const strokeWidthIcon: Record<string, ReactNode> = {
	thin: <Thin />,
	normal: <Normal />,
	thick: <Thick />,
};
export default strokeWidthIcon;
