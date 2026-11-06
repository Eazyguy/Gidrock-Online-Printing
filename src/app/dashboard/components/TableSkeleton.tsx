function SkeletonRow() {
	return (
		<div className="flex items-center gap-4 px-4 py-3 border-b last:border-0">
			<div className="h-4 w-[110px] bg-gray-100 rounded animate-pulse" />
			<div className="h-4 flex-1 bg-gray-100 rounded animate-pulse" />
			<div className="h-6 W-[90px] bg-gray-100 rounded-full animate-pulse" />
			<div className="h-4 W-[90px] bg-gray-100 rounded animate-pulse" />
		</div>
	);
}

export function TableSkeleton() {
	return (
		<div className="min-w-[600px] w-full">
			<div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b">
				<div className="h-4 W-[110px] bg-gray-200 rounded animate-pulse" />
				<div className="h-4 flex-1 bg-gray-200 rounded animate-pulse" />
				<div className="h-4 W-[90px] bg-gray-200 rounded animate-pulse" />
				<div className="h-4 W-[90px] bg-gray-200 rounded animate-pulse" />
			</div>
			{Array.from({ length: 6 }).map((_, i) => (
				<SkeletonRow key={i} />
			))}
		</div>
	);
}
