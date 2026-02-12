import { Link, useLocation } from "react-router-dom"
import { Home, Map, Settings } from "lucide-react"
import { motion } from "framer-motion"

export function MobileNav() {
    const location = useLocation()

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/?view=map', icon: Map, label: 'Map' },
        { path: '/admin', icon: Settings, label: 'Admin' },
    ]

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50 safe-area-bottom">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.path)

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="relative flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-xl transition-colors"
                        >
                            {active && (
                                <motion.div
                                    layoutId="mobile-nav-indicator"
                                    className="absolute inset-0 bg-amber-100 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon
                                size={22}
                                className={`relative z-10 transition-colors ${active ? 'text-amber-700' : 'text-stone-400'
                                    }`}
                            />
                            <span
                                className={`relative z-10 text-xs mt-1 font-medium transition-colors ${active ? 'text-amber-700' : 'text-stone-500'
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
