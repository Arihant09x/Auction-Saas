const ABOUT_POINTS = [
    "Purpose-built for cricket tournaments of all sizes — from 4 teams to 20+",
    "Real-time bidding with zero lag, zero complexity",
    "Bank-grade security — every bid secured and logged",
    "Works on any device — mobile, tablet, desktop",
    "Zero technical knowledge needed to set up and run",
    "Transparent pricing — no hidden fees or commissions",
];

const DASHBOARD_URL = process.env["NEXT_PUBLIC_DASHBOARD_URL"] ?? "http://localhost:3002";

export function AboutSection() {
    return (
        <section
            id="about"
            className="section-white py-16 lg:py-24"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* LEFT — photo placeholder */}
                    {/*
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            PASTE ABOUT US CRICKET GROUND PHOTO / IMAGE HERE
            Expected: Real cricket ground / aerial stadium photograph
            Approx size: 520 × 400 px  |  aspect-ratio: 4/3
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          */}
                    <div className="relative">
                        <div
                            className="svg-placeholder-light rounded-2xl w-full"
                            style={{ aspectRatio: "4/3" }}
                        >
                            {/* PASTE ABOUT US CRICKET GROUND PHOTO / IMAGE HERE */}
                            <span>PASTE ABOUT US CRICKET GROUND PHOTO / IMAGE HERE</span>
                        </div>

                        {/* Floating stats card — keeps design intent */}
                        <div
                            className="absolute -bottom-5 -right-4 rounded-2xl px-5 py-3 hidden md:block"
                            style={{
                                background: "linear-gradient(145deg, #012972, #0d44b5)",
                                border: "1px solid rgba(255,255,255,0.10)",
                                boxShadow: "0 4px 24px rgba(1,41,114,0.40)",
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-2xl font-black" style={{ color: "#ffba00" }}>100+</p>
                                    <p className="text-xs" style={{ color: "#8ea8d8" }}>Auctions Completed</p>
                                </div>
                                <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.10)" }} />
                                <div>
                                    <p className="text-2xl font-black text-white">50K+</p>
                                    <p className="text-xs" style={{ color: "#8ea8d8" }}>Players Auctioned</p>
                                </div>
                            </div>
                        </div>

                        {/* Accent border frame (Figma shows an orange accent border around the image) */}
                        <div
                            className="absolute -bottom-2 -right-2 w-full h-full rounded-2xl -z-10"
                            style={{ border: "3px solid #fe7c0a", opacity: 0.25 }}
                        />
                    </div>

                    {/* RIGHT — copy */}
                    <div className="pt-4 lg:pt-0">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="divider-brand" />
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ffba00" }}>
                                About Us
                            </span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black mb-3" style={{ color: "#012972" }}>
                            Why Choose{" "}
                            <span style={{ color: "#ffba00" }}>Cricket Arena?</span>
                        </h2>
                        <p className="leading-relaxed mb-8 text-sm" style={{ color: "#4a6090" }}>
                            We built Auction 11 because we experienced firsthand how chaotic manual cricket auctions
                            can be — spreadsheets, WhatsApp groups, confusion over bids. Our platform eliminates
                            all of that with clean, real-time technology designed specifically for cricket organizers.
                        </p>

                        <ul className="space-y-3 mb-8">
                            {ABOUT_POINTS.map((point) => (
                                <li key={point} className="flex items-start gap-3 text-sm" style={{ color: "#012972" }}>
                                    {/* Checkmark in brand primary */}
                                    <span
                                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                                        style={{ background: "#0d44b5" }}
                                    >
                                        <svg className="w-3 h-3" fill="white" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>

                        <a href={`${DASHBOARD_URL}/register`} className="btn-brand inline-block">
                            Get Started Free →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
