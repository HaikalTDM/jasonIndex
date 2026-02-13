import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
// import vendors from "@/data/vendors.json" // REMOVED
import { ScoreBadge } from "@/components/ScoreBadge"
import { ShareButtons } from "@/components/ShareButtons"
import { ArrowLeft, MapPin, Calendar, ExternalLink, Loader2 } from "lucide-react"
import type { Vendor } from "@/types"
import { motion } from "framer-motion"

// const vendorData: Vendor[] = vendors as Vendor[] // REMOVED

export function VendorDetail() {
    const { id } = useParams<{ id: string }>()
    const [vendor, setVendor] = useState<Vendor | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return;

        // Try getting from API
        fetch(`/api/vendors/${id}`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) return null;
                    throw new Error("Failed to load vendor");
                }
                return res.json();
            })
            .then(data => {
                setVendor(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="animate-spin text-amber-600" size={40} />
            </div>
        )
    }

    if (!vendor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <p className="text-muted-foreground text-lg">Vendor not found.</p>
                <Link to="/" className="text-amber-700 hover:underline font-medium">Back to Home</Link>
            </div>
        )
    }

    // Extract TikTok Video ID
    const tiktokIdMatch = vendor.tiktok_url.match(/\/video\/(\d+)/)
    const tiktokId = tiktokIdMatch ? tiktokIdMatch[1] : null
    const tiktokEmbedUrl = tiktokId
        ? `https://www.tiktok.com/embed/v2/${tiktokId}`
        : undefined

    const mapEmbedUrl = `https://www.google.com/maps?q=${vendor.latitude},${vendor.longitude}&z=15&output=embed`

    const reviewDate = new Date(vendor.review_date).toLocaleDateString("en-MY", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            // Use negative margin to break out of the max-w container slightly at top if needed, 
            // but simpler to just put it inside. To make it full width hero, Layout needs adjustment.
            // For now, I'll make a nice rounded banner.
            className="space-y-8"
        >
            <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors group mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Index
            </Link>

            {/* Hero Banner */}
            <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                    src={vendor.image_url}
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-stone-300 font-medium mb-2">
                                <MapPin size={18} />
                                <span className="text-lg">{vendor.state}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight leading-tight mb-2">
                                {vendor.name}
                            </h1>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                            <span className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">Jason's Score</span>
                            <ScoreBadge score={vendor.jason_score} size="xl" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 pt-8">

                {/* Left Column: Info */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-heading font-bold flex items-center gap-2">
                            <span className="w-1 h-6 bg-amber-500 rounded-full inline-block"></span>
                            Key Highlights
                        </h3>
                        <ul className="space-y-4">
                            {vendor.keypoints.map((point, i) => (
                                <li key={i} className="flex gap-4 items-start p-3 hover:bg-stone-50 rounded-xl transition-colors">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                        {i + 1}
                                    </span>
                                    <span className="text-stone-700 leading-relaxed font-medium">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Share Buttons */}
                    <ShareButtons
                        vendorName={vendor.name}
                        vendorScore={vendor.jason_score}
                        tiktokUrl={vendor.tiktok_url}
                    />

                    <div className="space-y-2 pt-4">
                        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Location</h3>
                        <p className="text-stone-600 leading-relaxed max-w-sm">{vendor.address}</p>
                    </div>

                    <div className="flex items-center gap-6 pt-6 border-t border-stone-100">
                        <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
                            <Calendar size={14} />
                            <span>Reviewed on {reviewDate}</span>
                        </div>
                        <a
                            href={vendor.tiktok_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:underline"
                        >
                            View on TikTok <ExternalLink size={12} />
                        </a>
                    </div>
                </div>

                {/* Right Column: Visuals */}
                <div className="space-y-6">
                    <div className="bg-white p-2 rounded-3xl shadow-lg shadow-stone-200/50 border border-stone-100 ring-1 ring-stone-900/5">
                        <div className="relative w-full rounded-2xl overflow-hidden bg-stone-100 aspect-video">
                            <iframe
                                src={mapEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`Map showing ${vendor.name}`}
                            />
                        </div>
                    </div>

                    <div className="relative mx-auto border-stone-900 bg-stone-900 border-[8px] rounded-[2.5rem] h-[600px] w-[340px] shadow-2xl flex items-center justify-center">
                        <div className="rounded-[2rem] overflow-hidden w-full h-full bg-black relative">
                            {tiktokEmbedUrl ? (
                                <iframe
                                    src={tiktokEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, overflow: "hidden" }}
                                    scrolling="no"
                                    allowFullScreen
                                    title={`TikTok review of ${vendor.name}`}
                                />
                            ) : (
                                <div className="text-center p-6 space-y-4 h-full flex flex-col items-center justify-center">
                                    <p className="text-stone-500 text-sm font-medium">Preview unavailable</p>
                                    <a
                                        href={vendor.tiktok_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-3 px-6 rounded-full transition-colors"
                                    >
                                        Watch on TikTok
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
