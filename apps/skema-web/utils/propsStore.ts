import {
	arrowHead,
	arrowType,
	backArrow,
	edges,
	fill,
	fontFamily,
	fontSize,
	frontArrow,
	layers,
	slopiness,
	strokeStyle,
	strokeWidth,
	textAlign,
} from "@/app/draw/types";
import { create } from "zustand";

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

export const useStrokeStore = create<strokeStore>()((set, get) => ({
	currentColor: "212529",
	setCurrentColor: (color) => {
		set((state) => ({
			currentColor: color,
		}));
	},
}));
export const useBgStore = create<bgStore>()((set, get) => ({
	currentColor: "transparent",
	setCurrentColor: (color) => {
		set((state) => ({
			currentColor: color,
		}));
	},
}));

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

export const useOpacityStore = create<opacityStore>()((set, get) => ({
	opacity: 100,
	setOpacity: (val: number) => set({ opacity: val }),
}));

export const useFillStore = create<fillStore>()((set, get) => ({
	fill: "solid" as fill,
	setFill: (val: fill) => {
		set((state) => ({
			fill: val,
		}));
	},
}));

export const useStrokeWidthStore = create<strokeWidthStore>()((set) => ({
	width: "normal",
	setWidth: (val: strokeWidth) => set({ width: val }),
}));

export const useStrokeStyleStore = create<strokeStyleStore>()((set) => ({
	style: "solid",
	setStyle: (val: strokeStyle) => set({ style: val }),
}));

export const useSlopinessStore = create<slopinessStore>()((set) => ({
	slopiness: "artist",
	setSlopiness: (val: slopiness) => set({ slopiness: val }),
}));

export const useEdgesStore = create<edgesStore>()((set) => ({
	edges: "round",
	setEdges: (val: edges) => set({ edges: val }),
}));

export const useLayersStore = create<layersStore>()((set) => ({
	layers: "front",
	setLayers: (val: layers) => set({ layers: val }),
}));

export const useFontFamilyStore = create<fontFamilyStore>()((set) => ({
	fontFamily: "draw",
	setFontFamily: (val: fontFamily) => set({ fontFamily: val }),
}));

export const useFontSizeStore = create<fontSizeStore>()((set) => ({
	fontSize: "medium",
	setFontSize: (val: fontSize) => set({ fontSize: val }),
}));

export const useTextAlignStore = create<textAlignStore>()((set) => ({
	textAlign: "center",
	setTextAlign: (val: textAlign) => set({ textAlign: val }),
}));

export const useArrowTypeStore = create<arrowTypeStore>()((set) => ({
	arrowType: "curved",
	setArrowType: (val: arrowType) => set({ arrowType: val }),
}));

export const useFrontArrowStore = create<frontArrowStore>()((set) => ({
	frontArrow: "arrow",
	setFrontArrowType: (val: frontArrow) => set({ frontArrow: val }),
}));

export const useBackArrowStore = create<backArrowStore>()((set) => ({
	backArrow: "none",
	setBackArrowType: (val: backArrow) => set({ backArrow: val }),
}));

export const useArrowHeadStore = create<arrowHeadStore>()((set) => ({
	arrowHead: {
		front: useFrontArrowStore.getState().frontArrow,
		back: useBackArrowStore.getState().backArrow,
	},
	setArrowHead: (val: arrowHead) => set({ arrowHead: val }),
}));
