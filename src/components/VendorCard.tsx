import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { ScoreBadge } from "@/components/ScoreBadge"
import type { Vendor } from "@/types"

interface VendorCardProps {
    vendor: Vendor
    index?: number
}

export function VendorCard({ vendor, index = 0 }: VendorCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative bg-white rounded-2xl border border-stone-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.08)] transition-all overflow-hidden flex flex-col h-full"
        >
            <Link to={`/vendor/${vendor.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {vendor.name}</span>
            </Link>

            {/* Image Banner */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                    src={vendor.image_url}
                    alt={vendor.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute top-3 right-3">
                    <ScoreBadge score={vendor.jason_score} />
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="mb-3">
                    <h3 className="font-heading font-bold text-lg text-foreground leading-tight group-hover:text-amber-700 transition-colors">
                        {vendor.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-stone-500">
                        <MapPin size={13} strokeWidth={2} />
                        <span className="text-xs font-medium uppercase tracking-wide">{vendor.state}</span>
                    </div>
                </div>

                <div className="space-y-2 mb-4 flex-1">
                    {vendor.keypoints.slice(0, 3).map((point, i) => (
                        <div key={i} className="flex gap-2.5 items-start">
                            <div className="min-w-[4px] h-[4px] rounded-full bg-stone-300 mt-2" />
                            <p className="text-sm text-stone-600 leading-snug line-clamp-2">{point}</p>
                        </div>
                    ))}
                </div>

                <div className="pt-4 mt-auto border-t border-stone-100 flex justify-between items-center">
                    <span className="text-xs font-medium text-stone-400">View Review</span>
                    <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
