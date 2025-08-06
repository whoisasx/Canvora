import { create } from "zustand";

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

export const useThemeStore = create<themeStore>()((set, get) => ({
	theme: "light" as "light",
	setTheme: (val) => {
		set((state) => ({
			theme: val,
		}));
	},
}));

export const useCanvasBgStore = create<canvasBgStore>()((set, get) => ({
	backgrounds:
		useThemeStore.getState().theme === "light"
			? ["ffffff", "e9ecef", "e7f5ff", "fff9db", "f8f0fc"]
			: ["171717", "202124", "182028", "211e00", "27201d"],
	setBackgrounds: () => {
		const theme = useThemeStore.getState().theme;
		const updatedBackgrounds =
			theme === "light"
				? ["ffffff", "e9ecef", "e7f5ff", "fff9db", "f8f0fc"]
				: ["171717", "202124", "182028", "211e00", "27201d"];

		set((state) => ({
			backgrounds: updatedBackgrounds,
		}));

		return updatedBackgrounds;
	},
	background: "ffffff",
	setBackground: (val: string) => {
		set((state) => ({
			background: val,
		}));
	},
}));
