export default function FeatureCard({
	heading,
	para,
}: {
	heading: string;
	para: string;
}) {
	return (
		<li className="flex flex-1">
			<div className="flex-1 rounded-2xl border border-canvora-200 bg-canvora-50/80 p-6">
				<div className="flex flex-col gap-3 max-w-none text-sm">
					<h5>{heading}</h5>
					<p>{para}</p>
				</div>
			</div>
		</li>
	);
}
