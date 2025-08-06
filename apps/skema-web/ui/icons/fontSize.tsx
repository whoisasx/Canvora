import { ReactNode } from "react";

function Small() {
	return <p>s</p>;
}

function Medium() {
	return <p>m</p>;
}

function Large() {
	return <p>l</p>;
}
function Xlarge() {
	return <p>x</p>;
}

const fontSizeIcon: Record<string, ReactNode> = {
	small: <Small />,
	medium: <Medium />,
	large: <Large />,
	xlarge: <Xlarge />,
};
export default fontSizeIcon;
