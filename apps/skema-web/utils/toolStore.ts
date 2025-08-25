import { Tool } from "@/app/draw/types";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ToolStore {
	tool: Tool;
	props: string[];
	setTool: (tool: Tool) => void;
	setProps: (tool: Tool) => void;
}
interface LockStore {
	lockClicked: boolean;
	setLockClicked: (val: boolean) => void;
}

const useToolStore = create<ToolStore>()(
	subscribeWithSelector((set, get) => ({
		tool: "mouse" as Tool,
		props: [],
		propsVal: {},
		setTool: (tool: Tool) => {
			set((state) => ({
				tool: tool,
			}));
		},
		setProps: (tool: Tool) => {
			set((state) => {
				if (
					tool === "rectangle" ||
					tool === "rhombus" ||
					tool === "web"
				) {
					return {
						props: [
							"stroke",
							"background",
							"fill",
							"strokeWidth",
							"strokeStyle",
							"slopiness",
							"edge",
							"opacity",
							"layers",
						],
					};
				}
				if (tool === "arc") {
					return {
						props: [
							"stroke",
							"background",
							"fill",
							"strokeWidth",
							"strokeStyle",
							"slopiness",
							"opacity",
							"layers",
						],
					};
				}
				if (tool === "arrow") {
					return {
						props: [
							"stroke",
							"strokeWidth",
							"strokeStyle",
							"slopiness",
							"arrowType",
							"arrowHead",
							"opacity",
							"layers",
						],
					};
				}
				if (tool === "line") {
					return {
						props: [
							"stroke",
							"strokeWidth",
							"strokeStyle",
							"slopiness",
							"edge",
							"opacity",
							"layers",
						],
					};
				}
				if (tool === "pencil") {
					return {
						props: ["stroke", "strokeWidth", "opacity", "layers"],
					};
				}
				if (tool === "text") {
					return {
						props: [
							"stroke",
							"fontFamily",
							"fontSize",
							"textAlign",
							"opacity",
							"layers",
						],
					};
				}
				if (tool === "image") {
					return {
						props: ["edge", "opacity", "layers"],
					};
				}
				return {
					props: [],
				};
			});
		},
	}))
);

export const useLockStore = create<LockStore>()(
	subscribeWithSelector<LockStore>((set, get) => ({
		lockClicked: false,
		setLockClicked: (val: boolean) => {
			set((state) => ({
				lockClicked: val,
			}));
		},
	}))
);

export default useToolStore;
