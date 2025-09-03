import { useZoomStore } from "@/utils/canvasStore";

export default function ZoomBar() {
	const zoom = useZoomStore((state) => state.zoom);
	const setZoom = useZoomStore((state) => state.setZoom);
	return (
		<div className="h-10 w-35 border rounded-lg bg-oc-gray-2 dark:bg-[#232329] border-gray-200 dark:border-0 flex">
			<button
				className="h-full hover:bg-oc-gray-1 flex-1 flex items-center justify-center rounded-l-lg dark:hover:bg-oc-gray-8"
				onClick={() => {
					if (zoom - 5 >= 10) {
						setZoom(zoom - 5);
					}
				}}
			>
				<div
					className="w-full h-full flex items-center justify-center"
					aria-hidden="true"
					aria-disabled="false"
				>
					<svg
						aria-hidden="true"
						focusable="false"
						role="img"
						viewBox="0 0 20 20"
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M5 10h10" strokeWidth="1.25"></path>
					</svg>
				</div>
			</button>
			<button
				className="h-full hover:bg-oc-gray-1 flex-2 text-xs dark:hover:bg-oc-gray-8"
				onClick={() => setZoom(100)}
			>
				{zoom}
				{"%"}
			</button>
			<button
				className="h-full hover:bg-oc-gray-1 flex-1 flex items-center justify-center rounded-r-lg dark:hover:bg-oc-gray-8"
				onClick={() => {
					if (zoom + 5 <= 3000) {
						setZoom(zoom + 5);
					}
				}}
			>
				<div
					className="w-full h-full flex items-center justify-center"
					aria-hidden="true"
					aria-disabled="false"
				>
					<svg
						aria-hidden="true"
						focusable="false"
						role="img"
						viewBox="0 0 20 20"
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path
							strokeWidth="1.25"
							d="M10 4.167v11.666M4.167 10h11.666"
						></path>
					</svg>
				</div>
			</button>
		</div>
	);
}
