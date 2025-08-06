import { Tool } from "@/app/draw/types";
import { create } from "zustand";

interface ToolStore {
	tool: Tool;
	props: string[];
	setTool: (tool: Tool) => void;
	setProps: (tool: Tool) => void;
}

const useToolStore = create<ToolStore>()((set, get) => ({
	tool: "mouse",
	props: [],
	setTool: (tool: Tool) => {
		set((state) => ({
			tool: tool,
		}));
	},
	setProps: (tool: Tool) => {
		set((state) => {
			if (tool === "rectangle" || tool === "rhombus" || tool === "web") {
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
						"background",
						"strokeWidth",
						"strokeStyle",
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
					props: [
						"stroke",
						"background",
						"strokeWidth",
						"opacity",
						"layers",
					],
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
}));

export default useToolStore;
