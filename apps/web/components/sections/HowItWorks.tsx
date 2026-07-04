import { Button } from "@repo/ui/button";

const DASHBOARD_URL = process.env["NEXT_PUBLIC_DASHBOARD_URL"] ?? "http://localhost:3002";

const STEPS = [
    {
        step: "01",
        title: "Sign Up & Verify",
        description: "Create your organizer account in under 2 minutes. No credit card required to get started.",
        icon: "✅",
    },
    {
        step: "02",
        title: "Create Your Auction",
        description: "Set up your league — add teams, assign budgets, import player list and configure rules.",
        icon: "🏗️",
    },
    {
        step: "03",
        title: "Add Players & Teams",
        description: "Add players with base prices and categories. Invite team managers via a secure invite link.",
        icon: "👥",
    },
    {
        step: "04",
        title: "Start Bidding!",
        description: "Hit 'Start' and the live auction begins. Teams bid in real-time, bids logged automatically.",
        icon: "⚡",
    },
];

export function HowItWorksSection() {
    return (
        <section
            id="how-it-works"
            className="section-white py-16 lg:py-24"
            style={{ marginTop: "-40px", position: "relative", zIndex: 20 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="divider-brand" />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ffba00" }}>
                            Simple Process
                        </span>
                        <span className="divider-brand" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black heading-light">
                        How to Get Started in{" "}
                        <span style={{ color: "#ffba00" }}>3 Steps</span>
                    </h2>
                    <p className="subtext-light mt-3 max-w-xl mx-auto text-sm">
                        From zero to live auction in minutes. No technical knowledge required.
                    </p>
                </div>

                {/* Steps grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {STEPS.map((step, i) => (
                        <div key={step.step} className="relative group">
                            {/* Connector line between steps */}
                            {i < STEPS.length - 1 && (
                                <div
                                    className="hidden lg:block absolute top-8 left-[calc(100%+8px)] w-[calc(100%-50px)] h-px z-10"
                                    style={{ background: "#e2efff" }}
                                />
                            )}

                            {/* Step card */}
                            <div
                                className="text-center p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                                style={{
                                    background: "#ffffff",
                                    border: "1px solid #e2efff",
                                    boxShadow: "0 2px 12px rgba(1,41,114,0.10)",
                                }}
                            >
                                {/* Circular number badge — exact Figma style: #0d44b5 bg, white number */}
                                <div
                                    className="inline-flex items-center justify-center w-14 h-14 rounded-full font-black text-xl text-white mb-4 relative"
                                    style={{ background: "#0d44b5" }}
                                >
                                    {step.step}
                                    {/* Icon floated top-right */}
                                    <span className="absolute -top-1.5 -right-1.5 text-base">{step.icon}</span>
                                </div>

                                <h3 className="font-bold text-sm mb-2" style={{ color: "#012972" }}>{step.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: "#4a6090" }}>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12 flex flex-col items-center">
                    <Button 
                        href={`${DASHBOARD_URL}/register`} 
                        className="inline-flex items-center justify-center font-bold text-[15px] px-8 py-3 bg-[#00379d] text-white border border-[#ffaf2e] rounded-[99px] shadow-[0_4px_16px_rgba(0,55,157,0.35)] hover:opacity-90 transition font-epilogue"
                    >
                        Create Your First Auction →
                    </Button>
                    <p className="text-sm mt-3" style={{ color: "#8ea8d8" }}>
                        Free to start · No credit card needed
                    </p>
                </div>
            </div>
        </section>
    );
}
