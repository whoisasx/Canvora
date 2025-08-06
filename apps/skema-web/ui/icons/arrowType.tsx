import { ReactNode } from "react";

function Sharp() {
	return <p>s</p>;
}

function Curved() {
	return <p>c</p>;
}

function Elbow() {
	return <p>e</p>;
}

const arrowTypeIcon: Record<string, ReactNode> = {
	sharp: <Sharp />,
	curved: <Curved />,
	elbow: <Elbow />,
};
export default arrowTypeIcon;
