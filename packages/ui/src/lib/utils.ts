import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes with conflict resolution.
 * Use this in all component variants.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Formats a currency amount for display in auction bids.
 */
export function formatCurrency(
    amount: number,
    currency: string = "USD",
    locale: string = "en-US",
): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Formats a countdown timer in MM:SS format.
 */
export function formatCountdown(seconds: number): string {
    const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

/**
 * Returns the relative time label (e.g., "2 hours ago", "in 3 days").
 */
export function formatRelativeTime(dateStr: string): string {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const diff = (new Date(dateStr).getTime() - Date.now()) / 1000;
    const abs = Math.abs(diff);

    if (abs < 60) return rtf.format(Math.round(diff), "second");
    if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
    if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
    return rtf.format(Math.round(diff / 86400), "day");
}
