import {
	actions,
	arrowHead,
	arrowType,
	backArrow,
	CommonProps,
	edges,
	fill,
	fontFamily,
	fontSize,
	frontArrow,
	layers,
	Props,
	slopiness,
	strokeStyle,
	strokeWidth,
	textAlign,
} from "@/app/draw/types";
import { create } from "zustand";
import { useSelectedMessageStore, useThemeStore } from "./canvasStore";
import useToolStore from "./toolStore";
import { subscribeWithSelector } from "zustand/middleware";

const shallowEqual = (a: any, b: any) => {
	if (a === b) return true;
	if (!a || !b) return false;
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	if (aKeys.length !== bKeys.length) return false;
	for (const k of aKeys) {
		if (a[k] !== b[k]) return false; // shallow compare only
	}
	return true;
};

interface strokeStore {
	currentColor: string;
	setCurrentColor: (color: string) => void;
}
interface bgStore {
	currentColor: string;
	setCurrentColor: (color: string) => void;
}

interface activeStroke {
	current: number;
	setCurrent: (i: number) => void;
}

interface strokeShades {
	shades: string[];
	setShades: (shades: string[]) => void;
}

interface activeBg {
	current: number;
	setCurrent: (i: number) => void;
}

interface bgShades {
	shades: string[];
	setShades: (shades: string[]) => void;
}

export const useStrokeStore = create<strokeStore>()(
	subscribeWithSelector((set, get) => ({
		currentColor:
			useThemeStore.getState().theme === "light" ? "1e1e1e" : "ffffff",
		setCurrentColor: (color) => {
			set((state) => ({
				currentColor: color,
			}));
		},
	}))
);
export const useBgStore = create<bgStore>()(
	subscribeWithSelector((set, get) => ({
		currentColor: "transparent",
		setCurrentColor: (color) => {
			set((state) => ({
				currentColor: color,
			}));
		},
	}))
);

export const useActiveStroke = create<activeStroke>()((set, get) => ({
	current: 0,
	setCurrent: (i) => {
		set((state) => ({
			current: i,
		}));
	},
}));

export const useStrokeShades = create<strokeShades>()((set, get) => ({
	shades: [],
	setShades: (shades) => {
		set((state) => ({
			shades: [...shades],
		}));
	},
}));

export const useActiveBg = create<activeBg>()((set, get) => ({
	current: 0,
	setCurrent: (i) => {
		set((state) => ({
			current: i,
		}));
	},
}));

export const useBgShades = create<bgShades>()((set, get) => ({
	shades: [],
	setShades: (shades) => {
		set((state) => ({
			shades: [...shades],
		}));
	},
}));

const findActiveStroke = () => {
	const stroke = useStrokeStore.getState().currentColor;
	const currentStroke = new Map<string, number>([
		["1e1e1e", 0],
		["ffffff", 0],
		["e03131", 1],
		["2f994e", 2],
		["1971c2", 3],
		["f08c00", 4],
		["transparent", 5],
		["343a40", 7],
		["846358", 8],
		["0c8599", 9],
		["6741d9", 10],
		["9c36b5", 11],
		["c2255c", 12],
		["099268", 13],
		["e8590c", 14],
	]);
	useActiveStroke.setState({
		current: currentStroke.get(stroke),
	});
};
const findActiveBg = () => {
	const bg = useBgStore.getState().currentColor;
	const currentBg = new Map<string, number>([
		["transparent", 0],
		["ffc9c9", 1],
		["b2f2bb", 2],
		["a5d8ff", 3],
		["ffec99", 4],
		["1e1e1e", 5],
		["ffffff", 6],
		["e9ecef", 7],
		["eaddd7", 8],
		["99e9f2", 9],
		["d0bfff", 10],
		["eebefa", 11],
		["fcc2d7", 12],
		["96f2d7", 13],
		["ffd8a8", 14],
	]);
	useActiveBg.setState({
		current: currentBg.get(bg),
	});
};

useStrokeStore.subscribe(findActiveStroke);
useBgStore.subscribe(findActiveBg);

//-------------------------------

interface fillStore {
	fill: fill;
	setFill: (val: fill) => void;
}
interface strokeWidthStore {
	width: strokeWidth;
	setWidth: (val: strokeWidth) => void;
}
interface strokeStyleStore {
	style: strokeStyle;
	setStyle: (val: strokeStyle) => void;
}
interface slopinessStore {
	slopiness: slopiness;
	setSlopiness: (val: slopiness) => void;
}
interface edgesStore {
	edges: edges;
	setEdges: (val: edges) => void;
}
interface layersStore {
	layers: layers;
	setLayers: (val: layers) => void;
}
interface fontFamilyStore {
	fontFamily: fontFamily;
	setFontFamily: (val: fontFamily) => void;
}
interface fontSizeStore {
	fontSize: fontSize;
	setFontSize: (val: fontSize) => void;
}
interface textAlignStore {
	textAlign: textAlign;
	setTextAlign: (val: textAlign) => void;
}
interface arrowTypeStore {
	arrowType: arrowType;
	setArrowType: (val: arrowType) => void;
}
interface frontArrowStore {
	frontArrow: frontArrow;
	setFrontArrowType: (val: frontArrow) => void;
}
interface backArrowStore {
	backArrow: backArrow;
	setBackArrowType: (val: backArrow) => void;
}
interface arrowHeadStore {
	arrowHead: arrowHead;
	setArrowHead: (val: arrowHead) => void;
}
interface opacityStore {
	opacity: number;
	setOpacity: (val: number) => void;
}

export const useOpacityStore = create<opacityStore>()(
	subscribeWithSelector((set, get) => ({
		opacity: 100,
		setOpacity: (val: number) => set({ opacity: val }),
	}))
);

export const useFillStore = create<fillStore>()(
	subscribeWithSelector((set, get) => ({
		fill: "solid" as fill,
		setFill: (val: fill) => {
			set((state) => ({
				fill: val,
			}));
		},
	}))
);

export const useStrokeWidthStore = create<strokeWidthStore>()(
	subscribeWithSelector((set) => ({
		width: "normal",
		setWidth: (val: strokeWidth) => set({ width: val }),
	}))
);

export const useStrokeStyleStore = create<strokeStyleStore>()(
	subscribeWithSelector((set) => ({
		style: "solid",
		setStyle: (val: strokeStyle) => set({ style: val }),
	}))
);

export const useSlopinessStore = create<slopinessStore>()(
	subscribeWithSelector((set) => ({
		slopiness: "artist",
		setSlopiness: (val: slopiness) => set({ slopiness: val }),
	}))
);

export const useEdgesStore = create<edgesStore>()(
	subscribeWithSelector((set) => ({
		edges: "round",
		setEdges: (val: edges) => set({ edges: val }),
	}))
);

export const useLayersStore = create<layersStore>()(
	subscribeWithSelector((set) => ({
		layers: "none",
		setLayers: (val: layers) => set({ layers: val }),
	}))
);

export const useFontFamilyStore = create<fontFamilyStore>()(
	subscribeWithSelector((set) => ({
		fontFamily: "draw",
		setFontFamily: (val: fontFamily) => set({ fontFamily: val }),
	}))
);

export const useFontSizeStore = create<fontSizeStore>()(
	subscribeWithSelector((set) => ({
		fontSize: "medium",
		setFontSize: (val: fontSize) => set({ fontSize: val }),
	}))
);

export const useTextAlignStore = create<textAlignStore>()(
	subscribeWithSelector((set) => ({
		textAlign: "left",
		setTextAlign: (val: textAlign) => set({ textAlign: val }),
	}))
);

export const useArrowTypeStore = create<arrowTypeStore>()(
	subscribeWithSelector((set) => ({
		arrowType: "curved",
		setArrowType: (val: arrowType) => set({ arrowType: val }),
	}))
);

export const useFrontArrowStore = create<frontArrowStore>()(
	subscribeWithSelector((set) => ({
		frontArrow: "arrow",
		setFrontArrowType: (val: frontArrow) => set({ frontArrow: val }),
	}))
);

export const useBackArrowStore = create<backArrowStore>()(
	subscribeWithSelector((set) => ({
		backArrow: "none",
		setBackArrowType: (val: backArrow) => set({ backArrow: val }),
	}))
);

export const useArrowHeadStore = () => {
	const front = useFrontArrowStore((s) => s.frontArrow);
	const back = useBackArrowStore((s) => s.backArrow);

	return {
		front,
		back,
	};
};

export interface CommonPropsGame {
	stroke?: string;
	opacity?: number;
	actions?: actions;
	background?: string;
	fillStyle?: "none" | "solid" | "hachure" | "cross-hatch";
	strokeWidth?: number;
	lineDash?: number[];
	roughness?: 0 | 1 | 2;
	edges?: edges;
	arrowType?: arrowType;
	arrowHead?: arrowHead;
	fontSize?: 16 | 24 | 32 | 48;
	textAlign?: textAlign;
	fontFamily?:
		| "mononoki" //1
		| "excali"
		| "firaCode"
		| "ibm" //2
		| "comic" //3
		| "monospace"
		| "nunito";
}

const computeProps = (): any => {
	let tool = useToolStore.getState().tool;
	const selectedMessage = useSelectedMessageStore.getState().selectedMessage;
	if (tool === "mouse" && selectedMessage) {
		tool = selectedMessage.shape;
	}

	let stroke = `${useStrokeStore.getState().currentColor === "transparent" ? "transparent" : `#${useStrokeStore.getState().currentColor}`}`;
	let opacity = useOpacityStore.getState().opacity / 100;
	const actions: actions = "none";

	let background = useBgStore.getState().currentColor;
	background =
		background === "transparent" ? "transparent" : `#${background}`;

	// stroke width
	const stroke_width = useStrokeWidthStore.getState().width;
	let strokeWidth =
		stroke_width === "thin" ? 1 : stroke_width === "normal" ? 2 : 3;

	// fill
	const fillValue = useFillStore.getState().fill;
	const fillStyle = fillValue === "cross" ? "cross-hatch" : fillValue;

	// stroke style
	const strokeStyle = useStrokeStyleStore.getState().style;
	let lineDash: number[] = [];
	if (strokeStyle === "dashed") lineDash = [10, 10];
	else if (strokeStyle === "dotted") lineDash = [2, 8];

	// slopiness → roughness
	const slopiness = useSlopinessStore.getState().slopiness;
	const roughness =
		slopiness === "architect" ? 0 : slopiness === "artist" ? 1 : 2;

	const edges = useEdgesStore.getState().edges;
	const arrowType = useArrowTypeStore.getState().arrowType;
	const arrowHead = {
		front: useFrontArrowStore.getState().frontArrow,
		back: useBackArrowStore.getState().backArrow,
	};

	// text
	const font_famliy = useFontFamilyStore.getState().fontFamily;
	let fontFamily = "excali";
	if (font_famliy === "caveat") fontFamily = "mononoki";
	else if (font_famliy === "draw") fontFamily = "excali";
	else if (font_famliy === "code") fontFamily = "firaCode";
	else if (font_famliy === "normal") fontFamily = "ibm";
	else if (font_famliy === "little") fontFamily = "comic";
	else if (font_famliy === "mono") fontFamily = "monospace";
	else if (font_famliy === "nunito") fontFamily = "nunito";

	const font_size = useFontSizeStore.getState().fontSize;
	const fontSize =
		font_size === "small"
			? 16
			: font_size === "large"
				? 32
				: font_size === "xlarge"
					? 48
					: 24;
	const textAlign = useTextAlignStore.getState().textAlign;

	// switch by tool
	switch (tool) {
		case "rectangle":
		case "rhombus":
		case "web":
			return {
				stroke,
				opacity,
				actions,
				background,
				fillStyle,
				strokeWidth,
				lineDash,
				roughness,
				edges,
			};

		case "arc":
			return {
				stroke,
				opacity,
				actions,
				background,
				fillStyle,
				strokeWidth,
				lineDash,
				roughness,
			};

		case "arrow":
			return {
				stroke,
				opacity,
				actions,
				strokeWidth,
				lineDash,
				roughness,
				arrowType,
				arrowHead,
			};

		case "line":
			return {
				stroke,
				opacity,
				actions,
				strokeWidth,
				lineDash,
				roughness,
				edges,
			};

		case "text":
			return {
				stroke,
				opacity,
				actions,
				fontFamily,
				fontSize,
				textAlign,
			};

		case "pencil":
			return { stroke, opacity, actions, strokeWidth };

		case "image":
			return { opacity, edges };

		default:
			return {};
	}
};

// memoize computeProps to keep stable object identity when inputs unchanged
let _cachedProps: any = null;
let _cachedInputsHash = "";
const getComputedProps = () => {
	const p = computeProps();
	// simple hash based on key values (stringify of primitive fields) — lightweight
	const hash = Object.keys(p)
		.sort()
		.map((k) => {
			const v = p[k];
			if (Array.isArray(v)) return k + ":" + v.join(",");
			if (typeof v === "object" && v !== null)
				return k + ":" + JSON.stringify(v);
			return k + ":" + String(v);
		})
		.join("|");

	if (hash === _cachedInputsHash) {
		return _cachedProps;
	}
	_cachedInputsHash = hash;
	_cachedProps = p;
	return _cachedProps;
};

export const usePropsStore = create<CommonPropsGame>()(
	subscribeWithSelector((set, get) => ({
		...getComputedProps(),
	}))
);

let recomputing = false;
const recompute = () => {
	if (recomputing) return;
	recomputing = true;
	try {
		const newProps = getComputedProps();
		const prevProps = usePropsStore.getState();

		// use shallow equality instead of JSON.stringify
		if (!shallowEqual(newProps, prevProps)) {
			usePropsStore.setState(newProps);
		}
	} finally {
		recomputing = false;
	}
};

// at the bottom: subscribe only to the slices that affect computeProps
useStrokeStore.subscribe((s) => s.currentColor, recompute);
useOpacityStore.subscribe((s) => s.opacity, recompute);
useBgStore.subscribe((s) => s.currentColor, recompute);
useStrokeWidthStore.subscribe((s) => s.width, recompute);
useFillStore.subscribe((s) => s.fill, recompute);
useStrokeStyleStore.subscribe((s) => s.style, recompute);
useSlopinessStore.subscribe((s) => s.slopiness, recompute);
useEdgesStore.subscribe((s) => s.edges, recompute);
useFontFamilyStore.subscribe((s) => s.fontFamily, recompute);
useFontSizeStore.subscribe((s) => s.fontSize, recompute);
useTextAlignStore.subscribe((s) => s.textAlign, recompute);
useArrowTypeStore.subscribe((s) => s.arrowType, recompute);
useFrontArrowStore.subscribe((s) => s.frontArrow, recompute);
useBackArrowStore.subscribe((s) => s.backArrow, recompute);

// important: subscribe to the tool and selectedMessage slices explicitly
useToolStore.subscribe((s) => s.tool, recompute);
useSelectedMessageStore.subscribe((s) => s.selectedMessage, recompute);
