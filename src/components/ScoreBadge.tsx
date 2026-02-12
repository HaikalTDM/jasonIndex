import { getScoreColor } from "@/lib/utils"

interface ScoreBadgeProps {
    score: number
    size?: "sm" | "lg" | "xl"
}

export function ScoreBadge({ score, size = "sm" }: ScoreBadgeProps) {
    const textColor = getScoreColor(score)

    // Dynamic class mapping based on size
    const sizeClasses = {
        sm: "text-sm px-2.5 py-0.5 rounded-full font-bold",
        lg: "text-lg px-4 py-1 rounded-full font-bold shadow-sm",
        xl: "text-4xl px-6 py-2 rounded-2xl font-black tracking-tight"
    }

    // Determine bg color with opacity based on score range
    let bgClass = "bg-stone-100" // default
    if (score >= 9) bgClass = "bg-green-100" // Solid bg
    if (score >= 7 && score < 9) bgClass = "bg-lime-100"
    if (score >= 5 && score < 7) bgClass = "bg-amber-100"
    if (score < 5) bgClass = "bg-red-100"

    return (
        <div className={`inline-flex items-center justify-center tabular-nums ${textColor} ${bgClass} ${sizeClasses[size]} ring-1 ring-inset ring-black/10 shadow-sm backdrop-blur-sm`}>
            {score.toFixed(1)}
        </div>
    )
}
