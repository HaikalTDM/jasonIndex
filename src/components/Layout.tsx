import { Outlet, Link } from "react-router-dom"
import { InteractiveBackground } from "@/components/InteractiveBackground"

export function Layout() {
    return (
        <div className="min-h-screen font-sans text-foreground selection:bg-stone-200 relative overflow-hidden">
            <InteractiveBackground />

            <main className="mx-auto max-w-5xl px-4 md:px-6 pt-4 md:pt-12 pb-16 min-h-screen relative z-10">
                <Outlet />
            </main>

            <footer className="border-t border-border bg-stone-100/50 relative z-10">
                <div className="mx-auto max-w-5xl px-4 md:px-6 py-8 md:py-12 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
                    <div className="text-center md:text-left">
                        <p className="font-heading font-semibold text-foreground mb-1">Jason Food Review Index</p>
                        <p className="text-xs md:text-sm text-muted-foreground max-w-md">
                            A fan-made archive of Malaysia's honest food reviews.
                            Scores and opinions belong to Jason.
                        </p>
                    </div>
                    <div className="flex gap-4 text-xs md:text-sm text-muted-foreground">
                        <span>Data from TikTok</span>
                        <span>•</span>
                        <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
