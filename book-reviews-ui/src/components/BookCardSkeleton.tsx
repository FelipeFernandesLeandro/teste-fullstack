export default function BookCardSkeleton() {
	return (
		<div className="flex flex-col gap-4 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<div className="relative aspect-[2/3] w-full bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
			<div className="flex flex-col px-2 pb-2">
				<div className="space-y-2 min-h-20">
					<div className="h-5 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
					<div className="h-5 bg-gray-300 dark:bg-gray-700 rounded-md w-1/2 animate-pulse"></div>
					<div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-1/2 animate-pulse mt-2"></div>
				</div>
			</div>
		</div>
	  );
}
