import { Search, X } from "lucide-react"
import { CustomSelect } from "@/components/CustomSelect"

interface FilterBarProps {
    searchQuery: string
    onSearchChange: (value: string) => void
    stateFilter: string
    onStateChange: (value: string) => void
    minScore: string
    onMinScoreChange: (value: string) => void
    sortOrder: string
    onSortChange: (value: string) => void
    states: string[]
}

export function FilterBar({
    searchQuery,
    onSearchChange,
    stateFilter,
    onStateChange,
    minScore,
    onMinScoreChange,
    sortOrder,
    onSortChange,
    states,
}: FilterBarProps) {

    // Transform states for CustomSelect
    const stateOptions = [
        { value: "all", label: "All States" },
        ...states.map(state => ({ value: state, label: state }))
    ]

    const scoreOptions = [
        { value: "0", label: "Any Score" },
        { value: "5", label: "5+ (Okay)" },
        { value: "7", label: "7+ (Good)" },
        { value: "8", label: "8+ (Great)" },
        { value: "9", label: "9+ (Amazing)" },
    ]

    const sortOptions = [
        { value: "high", label: "Score: High to Low" },
        { value: "low", label: "Score: Low to High" },
    ]

    return (
        <div className="sticky top-0 md:top-4 z-40 mb-6 md:mb-10 w-full max-w-4xl mx-auto -mx-4 md:mx-auto md:px-0">
            <div className="bg-white/95 md:bg-white/90 backdrop-blur-xl border-b md:border border-stone-200 md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:rounded-full p-3 md:p-1.5 flex flex-col gap-2 md:gap-1 md:flex-row md:items-center">

                {/* Search - Takes available space */}
                <div className="relative flex-1 w-full md:w-auto group md:px-2">
                    <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search restaurants..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-stone-50 md:bg-transparent border md:border-none rounded-xl md:rounded-none h-11 pl-10 pr-10 text-sm outline-none focus:ring-0 placeholder:text-stone-400 font-medium"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-1"
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Vertical Divider (Hidden on mobile) */}
                <div className="hidden md:block w-px h-8 bg-stone-200 mx-1"></div>

                {/* Filters Container */}
                <div className="flex w-full md:w-auto overflow-x-auto no-scrollbar gap-2 md:gap-1 items-center md:pr-1 pb-1 md:pb-0">

                    {/* State Select */}
                    <div className="min-w-[130px] flex-shrink-0">
                        <CustomSelect
                            value={stateFilter}
                            onChange={onStateChange}
                            options={stateOptions}
                            placeholder="State"
                            className="bg-stone-50 md:bg-transparent border md:border-none shadow-none hover:bg-stone-100 md:hover:bg-stone-50 focus:ring-0 h-10 rounded-xl md:rounded-full"
                        />
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden md:block w-px h-6 bg-stone-200 mx-1"></div>

                    {/* Min Score Select */}
                    <div className="min-w-[120px] flex-shrink-0">
                        <CustomSelect
                            value={minScore}
                            onChange={onMinScoreChange}
                            options={scoreOptions}
                            placeholder="Score"
                            className="bg-stone-50 md:bg-transparent border md:border-none shadow-none hover:bg-stone-100 md:hover:bg-stone-50 focus:ring-0 h-10 rounded-xl md:rounded-full px-2"
                        />
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden md:block w-px h-6 bg-stone-200 mx-1"></div>

                    {/* Sort Select */}
                    <div className="min-w-[160px] flex-shrink-0">
                        <CustomSelect
                            value={sortOrder}
                            onChange={onSortChange}
                            options={sortOptions}
                            placeholder="Sort"
                            className="bg-stone-50 md:bg-transparent border md:border-none shadow-none hover:bg-stone-100 md:hover:bg-stone-50 focus:ring-0 h-10 rounded-xl md:rounded-full px-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
