import { DEMO_TESTIMONIALS } from "@/lib/demo-data";
import Image from "next/image";

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? "text-arena" : "text-muted"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export function TestimonialsSection() {
    return (
        <section className="py-24 lg:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-arena/10 border border-arena/20 text-arena text-xs font-semibold mb-6">
                        ✦ Customer Stories
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-5">
                        Trusted by the world&apos;s{" "}
                        <span className="gradient-text">leading auctioneers</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        From boutique galleries to global auction houses — they all run on Auction 11.
                    </p>
                </div>

                {/* Testimonial cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {DEMO_TESTIMONIALS.map((t, i) => (
                        <div
                            key={t.id}
                            className={`relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-7 ${i === 1 ? "md:-translate-y-4" : ""
                                }`}
                        >
                            {/* Quote icon */}
                            <div className="text-5xl font-serif text-primary/20 leading-none mb-4">&ldquo;</div>

                            <StarRating rating={t.rating} />

                            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                                {t.quote}
                            </p>

                            <div className="mt-6 pt-5 border-t border-border/40 flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-muted">
                                    <Image
                                        src={t.avatar}
                                        alt={t.name}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                        unoptimized
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{t.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {t.title} · {t.company}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Logo strip */}
                <div className="mt-16 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-6 font-semibold">
                        Powering auction houses worldwide
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
                        {["Christie's", "Sotheby's", "Phillips", "Bonhams", "Heritage"].map((name) => (
                            <span key={name} className="text-sm font-black tracking-tight">
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
