export default function Loading() {
	return (
		<div className="h-screen w-screen flex flex-col items-center justify-center bg-page-gradient-purple">
			{/* Brand Icon */}
			<div className="animate-bounce mb-6">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-16 h-16 text-canvora-600"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>
			</div>

			{/* Brand Title */}
			<p className="text-canvora-700 text-xl font-semibold animate-pulse">
				Loading your dashboard...
			</p>
		</div>
	);
}
