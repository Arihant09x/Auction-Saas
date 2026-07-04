"use client";

import { useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogList } from "@/components/ui/BlogList";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function PageTitle({ title, highlight }: { title: string; highlight: string }) {
    return (
        <div className="flex flex-col items-center gap-3 py-">
            <h1 className="text-[32px] sm:text-[40px] font-extrabold font-['Poppins'] text-[#00379d]">
                {title}{" "}
                <span className="text-[#00379d]">{highlight}</span>
            </h1>
            <div
                className="w-full max-w-[600px] h-[3px] rounded-full"
                style={{
                    background:
                        "linear-gradient(90deg, transparent 0%, #012972 55%, #4266a9 50%, #88a9e5 75%, transparent 100%)",
                }}
            />
        </div>
    );
}

export default function BlogPage() {
    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Optional: fade in the whole container with GSAP
        if (mainRef.current) {
            gsap.fromTo(mainRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" });
        }
        ScrollTrigger.refresh();
    }, []);

    return (
        <main
            ref={mainRef}
            className="relative bg-white min-h-screen font-sans overflow-x-hidden"
        >
            {/* Fixed diagonal bands (same as pricing page) */}
            <div className="fixed inset-0 pointer-events-none z-0 hidden lg:block">
                <div className="sticky top-0 w-full h-screen overflow-hidden">
                    <div
                        className="absolute"
                        style={{
                            width: "140px",
                            height: "200vh",
                            background: "linear-gradient(80deg, #08245E, #0A307F)",
                            transform: "rotate(18deg)",
                            left: "70%",
                            top: "-20%",
                        }}
                    />
                    <div
                        className="absolute"
                        style={{
                            width: "140px",
                            height: "200vh",
                            background: "#0A307F",
                            transform: "rotate(18deg)",
                            left: "63%",
                            top: "-20%",
                            filter: "drop-shadow(0 4px 20px #000)",
                        }}
                    />
                </div>
            </div>

            <Navbar />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
                {/* Header with Framer Motion */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >

                    <PageTitle title="Latest" highlight="Blogs & News" />
                    <p className="text-sm sm:text-base mt-4 mb-6 lg:text-lg max-w-[600px] mx-auto text-[#4a6090] leading-relaxed text-center">
                        Stay informed with the freshest reports, exclusive cricket features,
                        player auction breakdowns, and real-time tournament details.
                    </p>
                </motion.div>

                {/* News & Blogs Container */}
                <BlogList limit={6} />
            </div>

            <Footer />
        </main>
    );
}