export type Tool =
	| "hand"
	| "mouse"
	| "rhombus"
	| "rectangle"
	| "arc"
	| "arrow"
	| "line"
	| "pencil"
	| "text"
	| "image"
	| "eraser"
	| "web"
	| "laser";

export type fill = "hachure" | "cross" | "solid";
export type strokeWidth = "thin" | "normal" | "thick";
export type strokeStyle = "solid" | "dashed" | "dotted";
export type slopiness = "architect" | "artist" | "cartoonist";
export type edges = "sharp" | "round";
export type layers = "back" | "backward" | "forward" | "front";
export type actions = "duplicate" | "delete" | "link" | "none";
export type fontFamily =
	| "tldraw"
	| "draw"
	| "code"
	| "normal"
	| "little"
	| "nunito"
	| "mono";

export type fontSize = "small" | "medium" | "large" | "xlarge";
export type textAlign = "left" | "center" | "right";
export type arrowType = "sharp" | "curved" | "elbow";

export type frontArrow = "none" | "arrow" | "triangle" | "triangleOutline";
export type backArrow = "none" | "arrow" | "triangle" | "triangleOutline";
export interface arrowHead {
	front: frontArrow;
	back: backArrow;
}

export interface BaseProps {
	stroke: string;
	opacity: number;
	layers: layers;
	actions: actions;
}

export interface ShapeProps extends BaseProps {
	background: string;
	strokeWidth: strokeWidth;
	strokeStyle: strokeStyle;
	slopiness: slopiness;
	edges: edges;
}
export const defaultShape: ShapeProps = {
	stroke: "#000000",
	opacity: 100,
	layers: "front",
	actions: "none",
	background: "transparent",
	strokeWidth: "normal",
	strokeStyle: "solid",
	slopiness: "artist",
	edges: "round",
};

export interface ArrowProps extends BaseProps {
	strokeWidth: strokeWidth;
	strokeStyle: strokeStyle;
	slopiness: slopiness;
	arrowType: arrowType;
	arrowHead: arrowHead;
}
export const defaultArrow: ArrowProps = {
	stroke: "#000000",
	opacity: 100,
	layers: "front",
	actions: "none",
	strokeWidth: "normal",
	strokeStyle: "solid",
	slopiness: "artist",
	arrowHead: {
		front: "arrow",
		back: "none",
	},
	arrowType: "curved",
};

export interface LineProps extends BaseProps {
	strokeWidth: strokeWidth;
	strokeStyle: strokeStyle;
	slopiness: slopiness;
	edges: edges;
}
export const defaultLine: LineProps = {
	stroke: "#000000",
	opacity: 100,
	layers: "front",
	actions: "none",
	strokeWidth: "normal",
	strokeStyle: "solid",
	slopiness: "artist",
	edges: "round",
};

export interface TextProps extends BaseProps {
	fontFamily: fontFamily;
	fontSize: fontSize;
	textAlign: textAlign;
}
export const defaultText: TextProps = {
	stroke: "#000000",
	opacity: 100,
	layers: "front",
	actions: "none",
	fontFamily: "draw",
	fontSize: "medium",
	textAlign: "center",
};

export interface PencilProps extends BaseProps {
	background: string;
	strokeWidth: strokeWidth;
}
export const defaultPencil: PencilProps = {
	stroke: "#000000",
	opacity: 100,
	layers: "front",
	actions: "none",
	background: "#000000",
	strokeWidth: "normal",
};
