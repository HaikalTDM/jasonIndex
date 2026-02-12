import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export function MobileHeader() {
    return (
        <header className="md:hidden sticky top-0 bg-white/80 backdrop-blur-lg border-b border-stone-200 z-40">
            <div className="px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-sm">J</span>
                        </div>
                        <div>
                            <h1 className="font-heading font-bold text-sm leading-none text-stone-900">
                                Jason's Food
                            </h1>
                            <p className="text-[10px] text-stone-500 leading-none mt-0.5">
                                Review Index
                            </p>
                        </div>
                    </motion.div>
                </Link>

                <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-amber-100 rounded-full">
                        <span className="text-xs font-semibold text-amber-700">
                            {/* Vendor count can go here */}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}
