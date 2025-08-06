import { ReactNode } from "react";

function Sharp() {
	return <p>s</p>;
}

function Round() {
	return <p>r</p>;
}

const edgesIcon: Record<string, ReactNode> = {
	sharp: <Sharp />,
	round: <Round />,
};
export default edgesIcon;
