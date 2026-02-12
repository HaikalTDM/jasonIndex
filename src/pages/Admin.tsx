import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Plus, Edit, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

export function Admin() {
    const navigate = useNavigate()
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Check localStorage on initial load
        return localStorage.getItem("admin_authenticated") === "true"
    })
    const [password, setPassword] = useState("")
    const [vendors, setVendors] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [stateFilter, setStateFilter] = useState("all")

    useEffect(() => {
        if (isAuthenticated) {
            // Fetch vendors
            fetch('/api/vendors')
                .then(res => res.json())
                .then(data => setVendors(data))
                .catch(() => toast.error("Failed to load vendors"))
        }
    }, [isAuthenticated])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === "jasonReview") {
            setIsAuthenticated(true)
            localStorage.setItem("admin_authenticated", "true") // Persist auth
            toast.success("Login successful")
        } else {
            toast.error("Incorrect password")
        }
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem("admin_authenticated") // Clear auth
        toast.info("Logged out")
    }

    const handleAddNewClick = () => {
        navigate('/admin/new')
    }

    const handleVendorCardClick = (vendor: any) => {
        navigate(`/admin/edit/${vendor.id}`)
    }

    // Filter vendors based on search and state
    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = searchQuery === "" ||
            vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.address?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesState = stateFilter === "all" || vendor.state === stateFilter

        return matchesSearch && matchesState
    })

    // Get unique states for filter
    const states = [...new Set(vendors.map(v => v.state))].sort()

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                <div className="flex flex-col items-center space-y-6 bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-stone-100 shadow-sm">
                    <h1 className="text-2xl font-heading font-bold text-stone-900">Admin Access</h1>
                    <form onSubmit={handleLogin} className="flex gap-2">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-64 px-4 py-2 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg translate-y-0 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
                <ArrowLeft size={20} />
                Back to Home
            </Link>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-heading font-bold mb-2">Manage Vendors</h1>
                    <p className="text-stone-600">Click a card to edit or add new vendor</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
                >
                    Logout
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by name or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 pl-10 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </div>

                {/* State Filter */}
                <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white min-w-[200px]"
                >
                    <option value="all">All States ({vendors.length})</option>
                    {states.map(state => (
                        <option key={state} value={state}>
                            {state} ({vendors.filter(v => v.state === state).length})
                        </option>
                    ))}
                </select>
            </div>

            {/* Results count */}
            <div className="text-sm text-stone-600">
                Showing {filteredVendors.length} of {vendors.length} vendors
            </div>

            {/* Mobile View - Grid */}
            <div className="md:hidden grid grid-cols-2 gap-3">
                {/* Add New Card */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddNewClick}
                    className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-amber-500 hover:bg-amber-100/50 transition-all group"
                >
                    <div className="w-10 h-10 bg-amber-200 group-hover:bg-amber-300 rounded-full flex items-center justify-center transition-colors">
                        <Plus size={20} className="text-amber-700" />
                    </div>
                    <span className="text-xs font-semibold text-amber-700 px-2 text-center">Add New</span>
                </motion.button>

                {/* Existing Vendor Cards */}
                {filteredVendors.map((vendor: any) => (
                    <motion.div
                        key={vendor.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        className="aspect-square bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => handleVendorCardClick(vendor)}
                    >
                        <div className="relative h-3/4">
                            {vendor.image_url ? (
                                <img
                                    src={vendor.image_url}
                                    alt={vendor.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                                    <span className="text-xs text-stone-400">No Image</span>
                                </div>
                            )}
                            <div className="absolute top-1.5 right-1.5 bg-amber-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                {vendor.jason_score}
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Edit className="text-white" size={20} />
                            </div>
                        </div>
                        <div className="p-2 h-1/4 flex flex-col justify-center">
                            <h3 className="font-bold text-xs line-clamp-1">{vendor.name}</h3>
                            <p className="text-[10px] text-stone-500 line-clamp-1">{vendor.state}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block">
                {/* Add New Button */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleAddNewClick}
                    className="w-full mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 rounded-xl flex items-center justify-center gap-3 hover:border-amber-500 hover:bg-amber-100/50 transition-all group"
                >
                    <div className="w-10 h-10 bg-amber-200 group-hover:bg-amber-300 rounded-full flex items-center justify-center transition-colors">
                        <Plus size={20} className="text-amber-700" />
                    </div>
                    <span className="text-sm font-semibold text-amber-700">Add New Vendor</span>
                </motion.button>

                {/* Table */}
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wider">Image</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wider">Name</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wider">State</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wider">Address</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wider">Score</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                            {filteredVendors.map((vendor: any) => (
                                <motion.tr
                                    key={vendor.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-stone-50 transition-colors cursor-pointer"
                                    onClick={() => handleVendorCardClick(vendor)}
                                >
                                    <td className="px-4 py-3">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100">
                                            {vendor.image_url ? (
                                                <img
                                                    src={vendor.image_url}
                                                    alt={vendor.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                                                    No img
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-semibold text-stone-900">{vendor.name}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-stone-600">{vendor.state}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-stone-600 line-clamp-1 max-w-xs">{vendor.address || 'N/A'}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                                            <span className="font-bold text-sm">{vendor.jason_score}</span>
                                            <span className="text-xs">/10</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleVendorCardClick(vendor)
                                            }}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
