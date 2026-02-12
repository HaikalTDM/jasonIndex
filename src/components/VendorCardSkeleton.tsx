export function VendorCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
            {/* Image Skeleton */}
            <div className="relative w-full aspect-video bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-pulse">
                <div className="absolute top-3 right-3 w-12 h-12 bg-stone-300 rounded-full"></div>
            </div>

            {/* Content Skeleton */}
            <div className="p-5 space-y-4">
                {/* Title */}
                <div className="h-6 bg-stone-200 rounded-lg w-3/4 animate-pulse"></div>

                {/* Location */}
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-stone-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-stone-200 rounded w-1/2 animate-pulse"></div>
                </div>

                {/* Keypoints */}
                <div className="space-y-2">
                    <div className="h-3 bg-stone-200 rounded w-full animate-pulse"></div>
                    <div className="h-3 bg-stone-200 rounded w-5/6 animate-pulse"></div>
                    <div className="h-3 bg-stone-200 rounded w-4/6 animate-pulse"></div>
                </div>

                {/* Button */}
                <div className="h-10 bg-stone-200 rounded-full w-full animate-pulse"></div>
            </div>
        </div>
    )
}

// Multiple skeleton cards
export function VendorCardSkeletons({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <VendorCardSkeleton key={i} />
            ))}
        </div>
    )
}
