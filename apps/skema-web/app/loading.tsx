export default function Loading() {
	return (
		<div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			{/* Animated Logo */}
			<div className="relative mb-8">
				<div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse shadow-2xl"></div>
				<div className="absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 animate-ping opacity-20"></div>
			</div>

			{/* Loading Text */}
			<div className="text-center space-y-2">
				<h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 animate-pulse">
					Loading...
				</h2>
				<p className="text-slate-600 dark:text-slate-400">
					Please wait
				</p>
			</div>

			{/* Loading Dots */}
			<div className="flex space-x-2 mt-6">
				<div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
				<div
					className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
					style={{ animationDelay: "0.1s" }}
				></div>
				<div
					className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
					style={{ animationDelay: "0.2s" }}
				></div>
			</div>
		</div>
	);
}
