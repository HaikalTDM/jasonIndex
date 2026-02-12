import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getScoreColor(score: number): string {
    if (score >= 9) return "text-score-green"
    if (score >= 7) return "text-score-lime"
    if (score >= 5) return "text-score-amber"
    return "text-score-red"
}

export function getScoreBgColor(score: number): string {
    if (score >= 9) return "bg-score-green"
    if (score >= 7) return "bg-score-lime"
    if (score >= 5) return "bg-score-amber"
    return "bg-score-red"
}
