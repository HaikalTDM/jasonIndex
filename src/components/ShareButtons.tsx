import { Share2, Facebook, Twitter, MessageCircle, Link as LinkIcon, Check, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface ShareButtonsProps {
    vendorName: string
    vendorScore: number
    tiktokUrl?: string
}

export function ShareButtons({ vendorName, vendorScore, tiktokUrl }: ShareButtonsProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const currentUrl = window.location.href
    const shareText = `Check out ${vendorName} - Jason rated it ${vendorScore}/10! 🍽️`

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl)
            setCopied(true)
            toast.success('Link copied to clipboard!')
            setTimeout(() => {
                setCopied(false)
                setIsOpen(false)
            }, 1500)
        } catch (err) {
            toast.error('Failed to copy link')
        }
    }

    const shareToFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
        window.open(url, '_blank', 'width=600,height=400')
        setIsOpen(false)
    }

    const shareToTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`
        window.open(url, '_blank', 'width=600,height=400')
        setIsOpen(false)
    }

    const shareToWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`
        window.open(url, '_blank')
        setIsOpen(false)
    }

    const openTikTok = () => {
        if (tiktokUrl) {
            window.open(tiktokUrl, '_blank')
            setIsOpen(false)
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Share Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
            >
                <Share2 size={18} />
                Share This Spot
                <ChevronDown
                    size={16}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full mt-2 left-0 w-64 bg-white rounded-2xl shadow-2xl border-2 border-stone-200 overflow-hidden z-50"
                    >
                        <motion.div
                            className="p-2 space-y-1"
                            initial="closed"
                            animate="open"
                            variants={{
                                open: {
                                    transition: {
                                        staggerChildren: 0.05
                                    }
                                }
                            }}
                        >
                            {/* Facebook */}
                            <motion.button
                                variants={{
                                    closed: { opacity: 0, x: -20 },
                                    open: { opacity: 1, x: 0 }
                                }}
                                onClick={shareToFacebook}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-xl transition-colors text-left group"
                            >
                                <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center flex-shrink-0">
                                    <Facebook size={18} fill="white" className="text-white" />
                                </div>
                                <span className="font-medium text-stone-700 group-hover:text-stone-900">Facebook</span>
                            </motion.button>

                            {/* Twitter/X */}
                            <motion.button
                                variants={{
                                    closed: { opacity: 0, x: -20 },
                                    open: { opacity: 1, x: 0 }
                                }}
                                onClick={shareToTwitter}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 rounded-xl transition-colors text-left group"
                            >
                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                    <Twitter size={18} fill="white" className="text-white" />
                                </div>
                                <span className="font-medium text-stone-700 group-hover:text-stone-900">Twitter</span>
                            </motion.button>

                            {/* WhatsApp */}
                            <motion.button
                                variants={{
                                    closed: { opacity: 0, x: -20 },
                                    open: { opacity: 1, x: 0 }
                                }}
                                onClick={shareToWhatsApp}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 rounded-xl transition-colors text-left group"
                            >
                                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                                    <MessageCircle size={18} fill="white" className="text-white" />
                                </div>
                                <span className="font-medium text-stone-700 group-hover:text-stone-900">WhatsApp</span>
                            </motion.button>

                            {/* Copy Link */}
                            <motion.button
                                variants={{
                                    closed: { opacity: 0, x: -20 },
                                    open: { opacity: 1, x: 0 }
                                }}
                                onClick={handleCopyLink}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-50 rounded-xl transition-colors text-left group"
                            >
                                <div className="w-10 h-10 bg-stone-700 rounded-full flex items-center justify-center flex-shrink-0">
                                    {copied ? (
                                        <Check size={18} className="text-white" />
                                    ) : (
                                        <LinkIcon size={18} className="text-white" />
                                    )}
                                </div>
                                <span className="font-medium text-stone-700 group-hover:text-stone-900">
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </span>
                            </motion.button>

                            {/* TikTok (if available) */}
                            {tiktokUrl && (
                                <>
                                    <div className="h-px bg-stone-200 my-2"></div>
                                    <motion.button
                                        variants={{
                                            closed: { opacity: 0, x: -20 },
                                            open: { opacity: 1, x: 0 }
                                        }}
                                        onClick={openTikTok}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 rounded-xl transition-colors text-left group"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#ff0050] to-[#00f2ea] rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-stone-700 group-hover:text-stone-900">Watch Original</span>
                                    </motion.button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
