import { CanvoraIcon, CanvoraTitle } from "@/ui/Canvora";

export default function Footer() {
	return (
		<div className="h-80 relative bg-oc-gray-9/95 border-t-1 border-canvora-600 py-20">
			<div className="absolute left-0 top-0 bg-[url(/bg-footer.svg)] h-full w-full -z-10"></div>
			<div className="flex items-center justify-center">
				<CanvoraIcon className="w-10 h-10" />
				<CanvoraTitle className="w-50 h-10" />
			</div>
		</div>
	);
}
