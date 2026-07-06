"use client";

import { usePathname } from "next/navigation";

export function CanonicalHeader() {
    const pathname = usePathname() || "";
    // Clean up trailing slash to keep canonical URLs consistent
    const cleanPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
    const canonicalUrl = `https://auction11.live${cleanPath}`;

    return (
        <link rel="canonical" href={canonicalUrl} />
    );
}
