"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { GlobalBackground } from "../ui/GlobalBackground";
import { motion } from "framer-motion";
import { 
    LayoutDashboard, 
    Palette, 
    Gamepad2, 
    Tv2, 
    Gavel, 
    Calculator, 
    RotateCw 
} from "lucide-react";

const FEATURES_LIST = [
    { id: 1, title: "Live Auction Dashboard", text: "Manage your entire cricket auction live with real-time bids, instant updates, and zero lag.", icon: LayoutDashboard },
    { id: 2, title: "Customizable Themes", text: "Choose from multiple screen layout options or tailor backgrounds, colors, and branding to match your tournament&#39;s visual identity.", icon: Palette },
    { id: 3, title: "Multi-Sport Support", text: "Whether you&#39;re organizing Cricket, Football, Volleyball, Kabaddi, Hockey, or Badminton one platform handles every sport with equal ease.", icon: Gamepad2 },
    { id: 4, title: "Live Streaming Overlays", text: "Stream smarter with live auction overlays built for YouTube and real-time cricket auction engagement.", icon: Tv2 },
    { id: 5, title: "Flexible Bidding", text: "Customize player prices, bid increments, and squad limits without relying on spreadsheets.", icon: Gavel },
    { id: 6, title: "Automatic Points & Budget Calculation", text: "Track budgets, points, and player allocations in real time with fully automated auction calculations.", icon: Calculator },
    { id: 7, title: "Fortune Wheel", text: "Bring more fun to your cricket auction live experience with an interactive Fortune Wheel feature.", icon: RotateCw }
];

export function FeaturesSectionClient() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const maxScroll = scrollHeight - clientHeight;
            const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
            setScrollProgress(progress);
        }
    };



    useEffect(() => {
        // Initial calculation
        handleScroll();
    }, []);

    // Calculate thumb position: constrained between 0% and 100% minus the thumb pixel height (40px)
    // For a container of height H, the thumb max top is H - thumbHeight.
    // Instead of pixel math, we can use percentage and calc() in style.
    const thumbStyle = {
        top: `calc(${scrollProgress}% - ${scrollProgress * 0.4}px)` // smooth interpolation 
    };

    return (
        <section id="features" className="relative z-10 w-full flex justify-center bg-white overflow-hidden py-16 sm:py-24" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", marginTop: "-32px" }}>
            <GlobalBackground variants="features" />
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-7xl mx-auto w-full px-4 flex flex-col items-center"
            >

                {/* Title */}
                <div className="flex flex-col items-center mb-12 sm:mb-20 text-[24px] sm:text-[32px] text-black font-['Poppins']">
                    <div className="tracking-[0.04em] flex items-center gap-2">
                        <span className="font-semibold text-black">Our</span>
                        <span className="font-extrabold text-[#00379d]">Features</span>
                    </div>
                    <div className="w-[63px] h-[4px] rounded-[12px] bg-[#00379d] self-start ml-2" />
                </div>

                <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-20">
                    {/* Left Laptop Image — desktop only */}
                    <motion.div 
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-full max-w-[640px] aspect-[1180/869] hidden lg:block"
                    >
                        <Image src="/images/0011/Graphite.png" width={1180} height={869} alt="Features Laptop" priority />
                    </motion.div>

                    {/* Right Features List with custom scrollbar */}
                    <div className="relative w-full max-w-full lg:max-w-[568px] h-auto lg:h-[432px] flex items-start gap-4">

                        {/* Top Blur Overlay — desktop only */}
                        <div
                            className="absolute top-0 left-0 w-[calc(100%-24px)] h-12 bg-gradient-to-b from-white to-transparent pointer-events-none z-10 transition-opacity duration-300 hidden lg:block"
                            style={{ opacity: scrollProgress > 5 ? 1 : 0 }}
                        />

                        {/* Bottom Blur Overlay — desktop only */}
                        <div
                            className="absolute bottom-0 left-0 w-[calc(100%-24px)] h-12 bg-gradient-to-t from-white to-transparent pointer-events-none z-10 transition-opacity duration-300 hidden lg:block"
                            style={{ opacity: scrollProgress < 95 ? 1 : 0 }}
                        />

                        <div
                            ref={containerRef}
                            onScroll={handleScroll}
                            className="w-full h-full lg:overflow-y-auto pr-2 flex flex-col gap-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            data-lenis-prevent
                        >
                            {FEATURES_LIST.map((f) => {
                                const IconComponent = f.icon;
                                return (
                                    <div key={f.id} className="w-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[12px] bg-[#eef3ff] flex items-center p-4 gap-4 shrink-0 hover:-translate-y-1 transition-transform">
                                        <div className="w-[42px] h-[42px] shrink-0 flex items-center justify-center bg-[#FE7C0A] rounded-[12px]">
                                            <IconComponent className="text-white w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="text-[#072460] font-semibold leading-[20px] tracking-[-0.05px]">{f.title}</div>
                                            <div className="text-[#072460] text-[12px] leading-[16px] tracking-[-0.05px]">{f.text}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Custom static scrollbar indicator — desktop only */}
                        <div className="w-[8px] h-[432px] bg-[#eef3ff] rounded-[2px] relative shrink-0 hidden lg:block overflow-hidden">
                            <div
                                className="absolute w-full h-[40px] bg-[#072460] rounded-[100px] transition-all duration-75 ease-out"
                                style={thumbStyle}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
