import { create } from "zustand";

interface SideBarStore {
	isOpen: boolean;
	setIsOpen: () => void;
}

export const useSideBarStore = create<SideBarStore>((set, get) => ({
	isOpen: false,
	setIsOpen: () => {
		set((state) => ({
			isOpen: !state.isOpen,
		}));
	},
}));
