const DASHBOARD_URL = process.env["NEXT_PUBLIC_DASHBOARD_URL"] ?? "http://localhost:3002";

export function CTASection() {
    return (
        <section className="py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-arena px-8 py-16 sm:px-16 sm:py-20 text-center">
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-arena/30 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                            backgroundSize: "32px 32px",
                        }}
                    />

                    <div className="relative">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold mb-8">
                            🚀 Start in under 5 minutes · No credit card required
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                            Ready to run your
                            <br />
                            first live auction?
                        </h2>

                        <p className="text-white/80 text-lg max-w-xl mx-auto mb-10">
                            Join 1,200+ auction houses already using Auction 11. Set up your first auction in minutes, not days.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={`${DASHBOARD_URL}/register`}
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-bold text-base shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                Create Free Account
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </a>
                            <a
                                href="mailto:sales@bidarena.io"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 border border-white/30 text-white font-semibold text-base hover:bg-white/20 transition-all duration-200"
                            >
                                Talk to Sales
                            </a>
                        </div>

                        {/* Trust micro-copy */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/70 text-xs">
                            <span>✓ Free plan forever</span>
                            <span>✓ 99.9% uptime SLA</span>
                            <span>✓ SOC 2 compliant</span>
                            <span>✓ GDPR ready</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
