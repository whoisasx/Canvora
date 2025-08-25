import { Message } from "@/app/draw/draw";
import { create, createStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface themeStore {
	theme: "light" | "dark";
	setTheme: (val: "light" | "dark") => void;
}

interface canvasBgStore {
	backgrounds: string[];
	setBackgrounds: () => string[];
	background: string;
	setBackground: (val: string) => void;
}

interface zoomStore {
	zoom: number;
	setZoom: (val: number) => void;
}

// ------------------------------------------------

export const useThemeStore = create<themeStore>()(
	subscribeWithSelector((set, get) => ({
		theme: "light",
		setTheme: (val: "light" | "dark") => {
			set((state) => ({
				theme: val,
			}));
		},
	}))
);

function getBackgroundsForTheme(theme: "light" | "dark") {
	return theme === "light"
		? ["ffffff", "f8f9fa", "f5faff", "fffce8", "fdf8f6"]
		: ["121212", "181716", "1a1612", "121426", "14181a"];
}

export const useCanvasBgStore = create<canvasBgStore>()(
	subscribeWithSelector((set, get) => {
		const theme = useThemeStore.getState().theme;
		const initialBackgrounds = getBackgroundsForTheme(theme);
		const initialBackground = initialBackgrounds[0]!;

		// Subscribe to theme changes
		useThemeStore.subscribe(
			(state) => state.theme,
			(newTheme, prevTheme) => {
				const updatedBackgrounds = getBackgroundsForTheme(newTheme);
				set((state) => ({
					backgrounds: updatedBackgrounds,
					background: updatedBackgrounds[0]!,
				}));
			}
		);

		return {
			backgrounds: initialBackgrounds,
			setBackgrounds: () => {
				const theme = useThemeStore.getState().theme;
				const updatedBackgrounds = getBackgroundsForTheme(theme);
				set((state) => ({
					backgrounds: updatedBackgrounds,
				}));
				return updatedBackgrounds;
			},
			background: initialBackground,
			setBackground: (val: string) => {
				set((state) => ({
					background: val,
				}));
			},
		};
	})
);

export const useZoomStore = create<zoomStore>()(
	subscribeWithSelector((set, get) => ({
		zoom: 100,
		setZoom: (val) => {
			set((state) => ({
				zoom: val,
			}));
		},
	}))
);

interface SelectedMessageStore {
	selectedMessage: Message | null;
	setSelectedMessage: (msg: Message | null) => void;
}

export const useSelectedMessageStore = create<SelectedMessageStore>()(
	subscribeWithSelector((set, get) => ({
		selectedMessage: null,
		setSelectedMessage: (msg) => set({ selectedMessage: msg }),
	}))
);
