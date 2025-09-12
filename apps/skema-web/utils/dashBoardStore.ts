import { IRoom } from "@/app/temp-dashboard/page";
import { create } from "zustand";

export type SelectedFilter = "all" | "recent" | "favourite" | "trash";

interface selectedFilterStore {
	selected: SelectedFilter;
	setSelected: (val: SelectedFilter) => void;
}
export const useSeletedFilterStore = create<selectedFilterStore>(
	(set, get) => ({
		selected: "all",
		setSelected: (val) => {
			set((state) => ({
				selected: val,
			}));
		},
	})
);

interface sideMenuStore {
	sideMenu: boolean;
	setSideMenu: () => void;
}
export const useSideMenuStore = create<sideMenuStore>((set, get) => ({
	sideMenu: false,
	setSideMenu: () => {
		set((state) => ({
			sideMenu: !state.sideMenu,
		}));
	},
}));

interface createClickedStore {
	clicked: boolean;
	setClicked: (val: boolean) => void;
}
export const useCreateClickedStore = create<createClickedStore>((set, get) => ({
	clicked: false,
	setClicked: (val) => {
		set((state) => ({
			clicked: val,
		}));
	},
}));

interface roomsStore {
	rooms: IRoom[];
	setRooms: (val: IRoom[]) => void;
}
export const useRoomStore = create<roomsStore>((set, get) => ({
	rooms: [],
	setRooms: (val) => {
		set((state) => ({
			rooms: [...val],
		}));
	},
}));
