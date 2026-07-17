import { useEffect, useState } from "react";
import Link from "next/link";

const DASHBOARD_URL = process.env["NEXT_PUBLIC_DASHBOARD_URL"] ?? "http://localhost:3002";

// Pricing tiers — exact from Figma design (₹ INR amounts)
const PLANS = [
  { id: "free", label: "Free", price: "Free", originalPrice: "Free", period: "per Auction", teams: "02", popular: false, features: ["Up to 2 Teams", "Unlimited Players", "Real-time Bidding", "Automatic Bid Logs", "Email Support"] },
  { id: "p1", label: "Basic", price: "₹1,049/-", originalPrice: "₹1,500/-", period: "per Auction", teams: "04", popular: false, features: ["Up to 4 Teams", "Unlimited Players", "Real-time Bidding", "Automatic Bid Logs", "Email Support"] },
  { id: "p2", label: "Standard", price: "₹1,749/-", originalPrice: "₹2,500/-", period: "per Auction", teams: "08", popular: false, features: ["Up to 8 Teams", "Unlimited Players", "Real-time Bidding", "Automatic Bid Logs", "Priority Support"] },
  { id: "p3", label: "Premium", price: "₹2,449/-", originalPrice: "₹3,500/-", period: "per Auction", teams: "12", popular: true, features: ["Up to 12 Teams", "Unlimited Players", "Real-time Bidding", "Automatic Bid Logs", "WhatsApp Support"] },
  { id: "p4", label: "Elite", price: "₹2,799/-", originalPrice: "₹4,000/-", period: "per Auction", teams: "16", popular: false, features: ["Up to 16 Teams", "Unlimited Players", "Real-time Bidding", "Automatic Bid Logs", "WhatsApp Support"] },
  { id: "p5", label: "Ultimate", price: "₹3,849/-", originalPrice: "₹5,500/-", period: "per Auction", teams: "20", popular: false, features: ["Up to 20 Teams", "Unlimited Players", "Real-time Bidding", "Automatic Bid Logs", "Dedicated Support"] },
  { id: "p6", label: "Mega", price: "₹4,899/-", originalPrice: "₹6,999/-", period: "per Auction", teams: "30", popular: false, features: ["Up to 30 Teams", "Unlimited Players", "Real-time Bidding", "Automatic Bid Logs", "Dedicated Support"] },
];

export function PricingSection() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getSharedCookie = (name: string): string | null => {
            if (typeof document === "undefined") return null;
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                if (!c) continue;
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
            return null;
        };

        const cookieVal = getSharedCookie("auction11_auth");
        if (cookieVal) {
            try {
                const { user: userData } = JSON.parse(cookieVal);
                setUser(userData);
            } catch {}
        }
    }, []);

    return (
        <section
            id="pricing"
            className="section-white py-16 lg:py-24"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="divider-brand" />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ffba00" }}>
                            Simple Pricing
                        </span>
                        <span className="divider-brand" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black" style={{ color: "#012972" }}>
                        Our <span style={{ color: "#ffba00" }}>Pricing</span>
                    </h2>
                    <p className="mt-3 max-w-lg mx-auto text-sm" style={{ color: "#4a6090" }}>
                        Pay per auction. No subscriptions, no hidden fees.
                    </p>
                </div>

                {/* Plans grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {PLANS.map((plan) => {
                        const planKey = plan.label.toUpperCase();
                        const targetUrl = user 
                            ? `${DASHBOARD_URL}/dashboard/select-auction-payment?plan=${planKey}`
                            : `/login?redirect=${DASHBOARD_URL}/dashboard/select-auction-payment?plan=${planKey}`;

                        return (
                            <div
                                key={plan.id}
                                className="relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
                                style={{
                                    background: plan.popular ? "linear-gradient(145deg, #012972, #0d44b5)" : "#ffffff",
                                    border: plan.popular
                                        ? "2px solid rgba(255,186,0,0.60)"
                                        : "1px solid #e2efff",
                                    boxShadow: plan.popular
                                        ? "0 8px 32px rgba(1,41,114,0.40)"
                                        : "0 4px 20px rgba(1,41,114,0.10)",
                                    borderRadius: "12px",
                                }}
                            >
                                {/* Popular banner */}
                                {plan.popular && (
                                    <div
                                        className="text-center py-1.5 text-[11px] font-black uppercase tracking-widest"
                                        style={{ background: "#ffba00", color: "#012972" }}
                                    >
                                        Most Popular
                                    </div>
                                )}

                                <div className="p-5 flex flex-col flex-1">
                                    {/* Plan label */}
                                    <p
                                        className="text-xs font-semibold mb-3"
                                        style={{ color: plan.popular ? "rgba(255,255,255,0.65)" : "#8ea8d8" }}
                                    >
                                        {plan.label}
                                    </p>

                                    {/* Price + teams — exact Figma layout: price left, teams right */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div
                                                className="text-2xl font-black leading-tight"
                                                style={{ color: plan.popular ? "#ffffff" : "#012972" }}
                                            >
                                                {plan.price}
                                            </div>
                                            <div
                                                className="text-xs"
                                                style={{ color: plan.popular ? "rgba(255,255,255,0.55)" : "#8ea8d8" }}
                                            >
                                                {plan.period}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className="text-3xl font-black leading-tight"
                                                style={{ color: plan.popular ? "#ffba00" : "#0d44b5" }}
                                            >
                                                {plan.teams}
                                            </div>
                                            <div
                                                className="text-xs"
                                                style={{ color: plan.popular ? "rgba(255,255,255,0.55)" : "#8ea8d8" }}
                                            >
                                                Teams
                                            </div>
                                        </div>
                                    </div>

                                    {plan.originalPrice && plan.price !== "Free" && (
                                        <span className={`text-xs font-bold line-through block mb-2 ${plan.popular ? "text-white/60" : "text-gray-400"}`}>
                                            {plan.originalPrice}
                                        </span>
                                    )}

                                    {plan.price !== "Free" && plan.originalPrice && plan.price && (
                                        <div className={`text-[11px] font-bold px-2 py-0.5 rounded w-fit mb-3 ${plan.popular ? "bg-[#ffba00] text-[#012972]" : "bg-[#012972] text-white"}`}>
                                            You Save ₹{(parseInt(plan.originalPrice.replace(/\D/g, "")) - parseInt(plan.price.replace(/\D/g, ""))).toLocaleString()} (30% off)
                                        </div>
                                    )}

                                    {/* Divider */}
                                    <div
                                        className="h-px mb-4"
                                        style={{ background: plan.popular ? "rgba(255,255,255,0.12)" : "#e2efff" }}
                                    />

                                    {/* Features list */}
                                    <ul className="space-y-2 mb-5 flex-1">
                                        {plan.features.map((f) => (
                                            <li key={f} className="flex items-center gap-2 text-xs">
                                                <svg
                                                    className="w-3.5 h-3.5 shrink-0"
                                                    style={{ color: "#ffba00" }}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span style={{ color: plan.popular ? "rgba(255,255,255,0.80)" : "#4a6090" }}>
                                                    {f}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <Link
                                        href={targetUrl}
                                        className="block text-center py-3 rounded-xl font-bold text-sm transition-all duration-200"
                                        style={
                                            plan.popular
                                                ? { background: "#ffba00", color: "#012972" }
                                                : {
                                                    background: "transparent",
                                                    color: "#0d44b5",
                                                    border: "2px solid #0d44b5",
                                                }
                                        }
                                    >
                                        Select →
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p className="text-center text-sm mt-8" style={{ color: "#8ea8d8" }}>
                    Need a custom plan?{" "}
                    <a href="mailto:hello@bidarena.com" className="font-semibold hover:underline" style={{ color: "#ffba00" }}>
                        Contact us
                    </a>
                </p>
            </div>
        </section>
    );
}
