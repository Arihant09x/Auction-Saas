"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

const FAQS = [
    {
        question: "What is a live cricket auction software and how does it work?",
        answer: "It’s a platform to run real-time player auctions with live bidding, automatic budget tracking, and instant team updates."
    },
    {
        question: "Can I use this for sports other than cricket?",
        answer: "Absolutely. The platform fully supports Football, Volleyball, Kabaddi, Hockey, Badminton, and more. Any sport that uses a player auction format will work seamlessly with our system."
    },
    {
        question: "Can I put players in different categories with different base prices?",
        answer: "A: Yes. You can create as many player categories as you need (e.g., Elite, All-Rounder, Youngster) and set individual base prices, bid increment rules, and min/max squad limits per category."
    },
    {
        question: "Does Auction11 support online UPI payments?",
        answer: "Yes, Organizers can directly make payments through UPI."
    },
    {
        question: "Does the platform support live streaming integration?",
        answer: "Yes. We provide real-time overlays designed for YouTube Live. your streaming audience sees live bid amounts, player profiles, and team updates as the auction unfolds."
    },
    {
        question: "Is technical experience required to run an auction?",
        answer: "None at all. Our step-by-step setup guides you through everything - from creating your tournament to going live. Most organizers run their first auction within 15 minutes of signing up."
    },

];

export function FAQSection() {
    const [open, setOpen] = useState<number | null>(1); // Default open second item matching mockup

    return (
        <section
            id="faq"
            className="py-16 lg:py-24 relative z-10 w-[100%] flex justify-center bg-transparent mt-[-10px]"
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="max-w-[1324px] w-full mx-4 bg-white rounded-[24px] shadow-2xl p-8 md:p-12 lg:p-16 relative"
            >
                {/* Header */}
                <div className="text-center mb-10 font-[Poppins]">
                    <h2 className="text-[28px] font-bold text-[#012972] inline-block relative border-b-[3px] border-[#012972] pb-1">
                        FAQs
                    </h2>
                </div>

                {/* Accordion List */}
                <div className="space-y-4">
                    {FAQS.map((faq, i) => {
                        const isOpen = open === i;
                        return (
                            <div
                                key={i}
                                className={`transition-all duration-300 rounded-[12px] overflow-hidden flex flex-col`}
                                style={{
                                    background: isOpen ? "#f4f7fe" : "#ffffff",
                                    boxShadow: isOpen ? "none" : "0px 4px 15px rgba(0,0,0,0.06)",
                                }}
                            >
                                <button
                                    className="w-full flex items-start gap-4 px-6 py-5 text-left"
                                    onClick={() => setOpen(isOpen ? null : i)}
                                >
                                    <div className="mt-0.5 shrink-0 flex items-center justify-center">
                                        {isOpen ? (
                                            <Minus size={18} strokeWidth={2.5} color="#00379d" />
                                        ) : (
                                            <Plus size={18} strokeWidth={2.5} color="#00379d" />
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className={`font-semibold text-[15px] leading-tight ${isOpen ? 'text-[#012972]' : 'text-[#2a303c]'}`}>
                                            <h3 className="text-[16px]  text-[#012972]">{faq.question}</h3>
                                        </span>
                                        {isOpen && (
                                            <p className="mt-2 text-[14px] text-[#4a6090] leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}

