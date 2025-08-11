import { useZoomStore } from "@/utils/canvasStore";

export default function ZoomBar() {
	const zoom = useZoomStore((state) => state.zoom);
	const setZoom = useZoomStore((state) => state.setZoom);
	return (
		<div className="h-10 w-40 border rounded-lg bg-oc-gray-3 dark:bg-[#232329] border-gray-300 dark:border-gray-600 flex">
			<button
				className="h-full hover:bg-oc-gray-2 flex-1 flex items-center justify-center rounded-l-lg dark:hover:bg-oc-gray-8"
				onClick={() => {
					if (zoom - 5 >= 10) {
						setZoom(zoom - 5);
					}
				}}
			>
				{"-"}
			</button>
			<button
				className="h-full hover:bg-oc-gray-2 flex-2 text-xs dark:hover:bg-oc-gray-8"
				onClick={() => setZoom(100)}
			>
				{zoom}
				{"%"}
			</button>
			<button
				className="h-full hover:bg-oc-gray-2 flex-1 flex items-center justify-center rounded-r-lg dark:hover:bg-oc-gray-8"
				onClick={() => {
					if (zoom + 5 <= 3000) {
						setZoom(zoom + 5);
					}
				}}
			>
				{"+"}
			</button>
		</div>
	);
}
