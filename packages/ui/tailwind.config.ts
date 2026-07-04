import type { Config } from "tailwindcss";
import "tailwindcss";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Auction 11 — Exact Figma Design System
//  Source: Design System → Color Palette
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRIMARY:   #012972  #0d44b5  #e2efff
// SECONDARY: #ffba00  #ffffff
// TERTIARY:  #fe7c0a
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{ts,tsx}",
        "../../apps/web/app/**/*.{ts,tsx}",
        "../../apps/web/components/**/*.{ts,tsx}",
        "../../apps/dashboard/app/**/*.{ts,tsx}",
        "../../apps/dashboard/components/**/*.{ts,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
            screens: { "2xl": "1280px" },
        },
        extend: {
            colors: {
                // ── Figma PRIMARY (from `Home page` frame node 676:19812) ─────────
                "brand-primary-dark": "#012972", // deepest navy — hero bg, footer
                "brand-primary": "#0d44b5",      // royal blue — cards, feature section
                "brand-primary-light": "#e2efff", // soft blue — light tints, borders

                // ++ NEW from Figma MCP session (node 676:19812 “Home page”) ++++++
                "brand-page-bg": "#072460",   // actual landing page bg (Home page frame)
                "brand-hero-diag": "#0A307F", // Rectangle 1346/1347 diagonal bg shapes
                // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                // ── Figma Secondary ─────────────────────────────────────────
                "brand-secondary": "#ffba00",      // amber/gold — ALL primary CTAs & accents
                "brand-secondary-deep": "#e6a800", // hover state for amber buttons
                "brand-white": "#ffffff",           // white text / cards

                // ── Figma Tertiary ──────────────────────────────────────────
                "brand-tertiary": "#fe7c0a", // orange — LIVE badges, alerts

                // ── Supporting neutrals ───────────────────────────────────────
                "brand-text-muted": "#8ea8d8", // muted text on dark bg
                "brand-card-dark": "#0a2060",  // card surface on dark sections
                "brand-divider": "#e2efff",    // dividers on light sections

                // ── Shadcn/UI semantic tokens (unchanged) ─────────────────────
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
                secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
                muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
                accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
                card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
            },

            fontFamily: {
                sans: ["var(--font-poppins)", "Poppins", "var(--font-geist-sans)", "Inter", "ui-sans-serif", "system-ui"],
                mono: ["var(--font-geist-mono)", "ui-monospace"],
                epilogue: ["var(--font-epilogue)", "Epilogue", "sans-serif"],
            },

            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },

            backgroundImage: {
                // Hero: dark navy to royal blue
                "brand-hero": "linear-gradient(135deg, #012972 0%, #0d44b5 100%)",
                // Features dark section
                "brand-features": "linear-gradient(180deg, #012972 0%, #0a1e5e 100%)",
                // Amber CTA gradient
                "brand-amber": "linear-gradient(135deg, #ffba00 0%, #e6a800 100%)",
                // Card surface
                "brand-card": "linear-gradient(145deg, #0a2060 0%, #0d44b5 100%)",
            },

            boxShadow: {
                "card-dark": "0 4px 24px rgba(1,41,114,0.40)",
                "card-light": "0 2px 16px rgba(13,68,181,0.12)",
                "card-hover": "0 8px 30px rgba(13,68,181,0.20)",
                "btn-amber": "0 4px 14px rgba(255,186,0,0.40)",
                "btn-amber-lg": "0 6px 24px rgba(255,186,0,0.50)",
                "pricing-card": "0 4px 20px rgba(1,41,114,0.12)",
            },

            keyframes: {
                "fade-in-up": {
                    from: { opacity: "0", transform: "translateY(24px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                "live-ping": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.3" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                "count-up": {
                    from: { opacity: "0", transform: "translateY(8px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
            },

            animation: {
                "fade-in-up": "fade-in-up 0.65s ease-out forwards",
                "fade-in": "fade-in 0.4s ease-out forwards",
                "live-ping": "live-ping 1.2s ease-in-out infinite",
                "shimmer": "shimmer 2s linear infinite",
                "count-up": "count-up 0.5s ease-out forwards",
            },
        },
    },
    plugins: [

    ],
};

export default config;
