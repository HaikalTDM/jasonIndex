import { useState, useMemo } from "react"
import vendors from "@/data/vendors.json"
import { VendorCard } from "@/components/VendorCard"
import { FilterBar } from "@/components/FilterBar"
import { MapView } from "@/components/MapView"
import { motion, AnimatePresence } from "framer-motion"
import type { Vendor } from "@/types"
import Fuse from 'fuse.js'
import { Map, List, ChevronLeft, ChevronRight } from 'lucide-react'

const vendorData: Vendor[] = vendors as Vendor[]
const ITEMS_PER_PAGE = 9

export function Home() {
    const [searchQuery, setSearchQuery] = useState("")
    const [stateFilter, setStateFilter] = useState("all")
    const [minScore, setMinScore] = useState("0")
    const [sortOrder, setSortOrder] = useState("high")
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
    const [currentPage, setCurrentPage] = useState(1)

    // Extract unique states
    const states = useMemo(() => {
        const uniqueStates = [...new Set(vendorData.map((v) => v.state))]
        return uniqueStates.sort()
    }, [])

    // Configure Fuse.js for fuzzy search
    const fuse = useMemo(() => {
        return new Fuse(vendorData, {
            keys: ['name', 'address', 'keypoints'],
            threshold: 0.4, // 0 = exact match, 1 = match anything
            includeScore: true,
            minMatchCharLength: 2,
        })
    }, [])

    // Filter logic with fuzzy search
    const filteredVendors = useMemo(() => {
        let result = [...vendorData]

        // Fuzzy search across name, address, and keypoints
        if (searchQuery.trim()) {
            const searchResults = fuse.search(searchQuery)
            result = searchResults.map(r => r.item)
        }

        if (stateFilter !== "all") {
            result = result.filter((v) => v.state === stateFilter)
        }

        const minScoreNum = parseFloat(minScore)
        if (minScoreNum > 0) {
            result = result.filter((v) => v.jason_score >= minScoreNum)
        }

        result.sort((a, b) =>
            sortOrder === "high"
                ? b.jason_score - a.jason_score
                : a.jason_score - b.jason_score
        )

        return result
    }, [searchQuery, stateFilter, minScore, sortOrder, fuse])

    // Pagination logic
    const totalPages = Math.ceil(filteredVendors.length / ITEMS_PER_PAGE)
    const paginatedVendors = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredVendors.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredVendors, currentPage])

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1)
    }, [searchQuery, stateFilter, minScore, sortOrder])

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Hero Section */}
            <div className="relative">
                {/* Decorative Warm Glow */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[200px] md:h-[400px] bg-amber-200/20 blur-[80px] md:blur-[120px] rounded-full pointer-events-none -z-10"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1] // Custom easing
                    }}
                    className="text-center pt-6 md:pt-12 pb-4 md:pb-8 space-y-3 md:space-y-4 relative z-10"
                >
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tight leading-tight px-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        Jason's <motion.span
                            className="text-amber-700 decoration-2 md:decoration-4 underline-offset-4 decoration-amber-200/50"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.4,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                        >
                            Food Index
                        </motion.span>
                    </motion.h1>
                    <motion.p
                        className="text-base md:text-xl text-stone-600 font-medium max-w-2xl mx-auto leading-relaxed px-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.5,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        A curated collection of honest Malaysian food reviews.
                        <br className="hidden sm:block" />
                        <span className="text-xs md:text-sm font-normal opacity-50 mt-2 block">Not affiliated with Jason. Just a fan project.</span>
                    </motion.p>
                </motion.div>
            </div>

            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                stateFilter={stateFilter}
                onStateChange={setStateFilter}
                minScore={minScore}
                onMinScoreChange={setMinScore}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                states={states}
            />

            {/* View Toggle */}
            <div className="flex justify-center gap-2 mb-6">
                <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${viewMode === 'list'
                        ? 'bg-stone-900 text-white shadow-lg'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                        }`}
                >
                    <List size={18} />
                    List View
                </button>
                <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${viewMode === 'map'
                        ? 'bg-stone-900 text-white shadow-lg'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                        }`}
                >
                    <Map size={18} />
                    Map View
                </button>
            </div>

            {viewMode === 'map' ? (
                <MapView vendors={filteredVendors} />
            ) : (
                <>
                    <AnimatePresence mode="wait">
                        {filteredVendors.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-20 bg-stone-100/50 rounded-3xl border border-dashed border-stone-200"
                            >
                                <p className="text-stone-400 text-lg font-medium">No vendors found matching your cravings.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setStateFilter('all'); setMinScore('0') }}
                                    className="mt-4 text-amber-700 font-semibold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </motion.div>
                        ) : (
                            <div className="space-y-6 md:space-y-8">
                                {/* Results count */}
                                <div className="text-center text-sm text-stone-500">
                                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredVendors.length)} of {filteredVendors.length} vendors
                                </div>

                                {/* Mobile - Horizontal Scroll */}
                                <motion.div
                                    className="md:hidden"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.7,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                >
                                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                                        <AnimatePresence>
                                            {paginatedVendors.map((vendor, index) => (
                                                <motion.div
                                                    key={vendor.id}
                                                    className="flex-shrink-0 w-[85vw] snap-center"
                                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: index * 0.1,
                                                        ease: [0.16, 1, 0.3, 1]
                                                    }}
                                                >
                                                    <VendorCard
                                                        vendor={vendor}
                                                        index={index}
                                                    />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>

                                {/* Desktop - Grid */}
                                <motion.div
                                    className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.7,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                >
                                    <AnimatePresence>
                                        {paginatedVendors.map((vendor, index) => (
                                            <motion.div
                                                key={vendor.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: index * 0.05,
                                                    ease: [0.16, 1, 0.3, 1]
                                                }}
                                            >
                                                <VendorCard
                                                    vendor={vendor}
                                                    index={index}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 px-4">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 md:p-2 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <div className="flex gap-1 md:gap-1 overflow-x-auto no-scrollbar max-w-[200px] md:max-w-none">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`min-w-[36px] md:min-w-[40px] h-9 md:h-10 px-2 md:px-3 rounded-lg font-medium transition-all touch-manipulation ${currentPage === page
                                                        ? 'bg-amber-600 text-white shadow-md'
                                                        : 'border border-stone-200 hover:bg-stone-50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 md:p-2 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
                                            aria-label="Next page"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    )
}
