const FEATURES = [
    { icon: "⚡", title: "Real-time Cricket Bidding", description: "Live bid updates with zero lag. Every bid placed by any team manager is instantly reflected across all connected devices." },
    { icon: "🤖", title: "Automatic Bid Logs", description: "Every bid, every player, every transaction is automatically recorded and timestamped for complete transparency." },
    { icon: "👥", title: "Team Management", description: "Organize unlimited teams, assign budgets, manage rosters, and let team managers bid independently from any device." },
    { icon: "💳", title: "Secure Wallet Integration", description: "Built-in team wallet system tracks budgets in real-time. No manual calculations — handles all financial logic instantly." },
    { icon: "📊", title: "Instant Analytics", description: "Live dashboards showing auction progress, team standings, budget utilization, and player distribution at a glance." },
    { icon: "📱", title: "Works on All Devices", description: "Organizers and bidders can join from mobile, tablet, or desktop. No app download required — runs in any browser." },
];

export function FeaturesSection() {
    return (
        <section
            className="relative overflow-hidden clip-diagonal-both clip-pad-both"
            style={{
                background: "linear-gradient(180deg, #012972 0%, #0a1e5e 100%)",
                color: "#ffffff",
                marginTop: "-60px", /* overlap with previous section diagonal */
                zIndex: 10,
            }}
        >
            {/* Background texture */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
                <div
                    className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #0d44b5, transparent 70%)" }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* LEFT — feature list */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="divider-brand" />
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ffba00" }}>
                                Why Choose Us
                            </span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">
                            Our <span style={{ color: "#ffba00" }}>Features</span>
                        </h2>
                        <p className="mb-10 leading-relaxed max-w-lg subtext-dark">
                            Everything you need to run a professional cricket player auction — from setup to the final sold declaration.
                        </p>

                        <div className="space-y-6">
                            {FEATURES.map((f) => (
                                <div key={f.title} className="flex items-start gap-4 group">
                                    <div
                                        className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-colors"
                                        style={{
                                            background: "rgba(255,186,0,0.10)",
                                            border: "1px solid rgba(255,186,0,0.20)",
                                        }}
                                    >
                                        {f.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm mb-1">{f.title}</h3>
                                        <p className="text-sm leading-relaxed subtext-dark">{f.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT — illustration placeholder */}
                    {/*
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            PASTE FEATURES LAPTOP / DASHBOARD ILLUSTRATION SVG HERE
            Expected: Isometric laptop showing auction dashboard UI
            Approx size: 480 × 400 px  |  aspect-ratio: 6/5
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          */}

                </div>
            </div>
        </section>
    );
}
