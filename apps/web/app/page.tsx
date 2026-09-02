// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Auction 11 — Landing Page
// All sections in one file per STEP 2 requirement.
// Only <Navbar>, <Footer> and <FAQSection> (accordion client component) are
// separate files. FAQSection is kept as a client component with "use client".
//
// EXACT FIGMA TOKENS (extracted via Figma MCP, node 676:19812 "Home page"):
//   Page bg:     #072460
//   Navbar bg:   #012972  shadow: 0px 4px 18px rgba(0,0,0,0.25)
//   Hero diag:   #0A307F  (Rectangle 1346/1347 backdrop shapes)
//   CTA pill:    #FFBA00  border-radius: 99px
//   Feature card border: gradient D3E2FF→052D76→91B5FD
//   Feature card shadow: 0px 3.0625px 12.25px rgba(211,226,255,0.6)
//   Footer bg:   #012972  shadow: 4px 0px 24px rgba(0,0,0,0.25)
//   Font:        Inter
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { AuctionCardSkeleton } from "@/components/ui/AuctionCardSkeleton";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Navbar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FeaturesSectionClient } from "@/components/sections/FeaturesSectionClient";
import { GlobalBackground } from "@/components/ui/GlobalBackground";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css"
import { ChevronLeft, ChevronRight, Calendar, MapPinned, Users, Star, LogIn, Gavel, Banknote, CreditCard, Hourglass, Check, ArrowRight, MoveRight, Trophy, Zap, Shield, Play, Clock, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { BlogList } from "@/components/ui/BlogList";


const DASHBOARD_URL = process.env["NEXT_PUBLIC_DASHBOARD_URL"] ?? "http://localhost:3002";


// =============================================================================
// HERO SECTION
// =============================================================================
// =============================================================================
// HERO SECTION - FULLY RESPONSIVE (Updated)
// =============================================================================
function HeroSection() {
  const container = useRef(null);

  const [stars, setStars] = useState(0);
  const [auctions, setAuctions] = useState(0);
  const [speed, setSpeed] = useState(0);


  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = progress * (2 - progress);

      setStars(parseFloat((ease * 4.7).toFixed(1)));
      setAuctions(Math.floor(ease * 50));
      setSpeed(Math.floor(ease * 100));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);


  const stats = [
    {
      icon: Star,
      value: 4.7,
      label: "Rated by Customers",
      suffix: "",
      decimals: 1,
    },
    {
      icon: Trophy,
      value: 50,
      label: "Completed Auctions",
      suffix: "+",
      decimals: 0,
    },
    {
      icon: Zap,
      value: 100,
      label: "Fast Execution",
      suffix: "%",
      decimals: 0,
    },

  ];

  return (
    <section ref={container} className="relative z-10 pt-[50px] pb-12 lg:pb-20 xl:pb-28">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 xl:py-28">
        {/* Diagonal strap - HIDDEN on mobile, VISIBLE on laptop+ */}

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 text-center lg:text-left "
          >
            <div className="inline-flex items-center rounded-full px-4 lg:px-6 py-1.5 mb-1 mx-auto gap-2 lg:mx-0 max-w-max bg-white/5">
              <span className="self-stretch h-5 lg:h-6 justify-start text-indigo-100 text-sm lg:text-base font-bold font-['Poppins'] uppercase leading-6 tracking-wider">
                CRICKET. AUCTION. SIMPLIFIED.
              </span>
            </div>

            <h1
              className="text-white leading-[1.06] tracking-tight font-bold mb-6 px-4 lg:px-0"
              style={{ fontSize: "clamp(32px, 8vw, 56px)" }}
            >
              The Ultimate{" "}
              <span style={{ color: "#FFBA00" }}>Cricket </span>
              <br className="hidden sm:block" />
              Auction Software
            </h1>

            <p className="text-sm sm:text-base lg:text-[17px] leading-relaxed mb-8 lg:mb-9 max-w-[500px] mx-auto lg:mx-0 px-4 lg:px-0" style={{ color: "#8AABDF" }}>
              Run transparent, real-time cricket player auctions from any device.
              Manage teams, track budgets, and bid live — all in one platform built for organizers.
            </p>

            {/* Buttons - SIDE BY SIDE on all screens */}
            <div className="flex flex-row items-center justify-center lg:justify-start gap-3 lg:gap-4 mb-8 lg:mb-12 px-4 lg:px-0">
              <Button
                href="/login"
                className="inline-flex items-center gap-2 font-bold text-[14px] lg:text-[15px] border border-[#0C3278] px-6 lg:px-8 py-3 font-epilogue transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-[#FFBA00] focus:outline-none sm:w-auto min-w-[140px] lg:min-w-[160px]"
                style={{
                  background: "#FFBA00",
                  color: "#012972",
                  borderRadius: "99px",
                }}
              >
                Start Now
                <MoveRight size={15} strokeWidth={3} />
              </Button>

              <Button
                className="inline-flex items-center gap-2 font-bold text-[14px] lg:text-[15px] border border-white/50 text-white hover:bg-white/10 hover:border-white bg-transparent backdrop-blur-sm px-6 lg:px-8 py-3 font-epilogue transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-[#FFBA00]/50 focus:outline-none sm:w-auto min-w-[140px] lg:min-w-[160px]"
                style={{ borderRadius: "99px" }}
              >
                <Play size={18} strokeWidth={2.5} className="shrink-0" />
                <span className="whitespace-nowrap">Watch Demo</span>
              </Button>
            </div>

            {/* Stats - Stacks vertically in a single line on mobile, horizontal on desktop */}
            <div className="bg-[#072460]/70 border border-[#0A307F] p-5 lg:p-6 rounded-[12px] shadow-[0px_4px_60px_rgba(0,0,0,0.5)] w-full max-w-[1500px] mx-auto lg:mx-0">
              <div className="flex flex-row items-center justify-center lg:flex-row lg:items-center lg:justify-between lg:gap-2.5">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;

                  return (
                    <React.Fragment key={index}>
                      <div
                        className="flex flex-col items-center justify-center text-center gap-2 lg:flex-1 lg:min-w-0"
                      >
                        <div className="flex items-center justify-center shrink-0">
                          <Icon className="w-8 h-8 text-[#FFBA00]" />
                        </div>

                        <div className="flex flex-col items-center justify-center min-w-0">
                          {/* Number and suffix side by side */}
                          <div className="flex items-center justify-center text-white text-xl lg:text-[22px] font-bold leading-none gap">
                            <span>
                              {index === 0 ? stars.toFixed(1) : index === 1 ? auctions : speed}
                            </span>
                            {stat.suffix && (
                              <span className="inline-flex items-center">
                                {stat.suffix}
                              </span>
                            )}
                          </div>

                          <span className="text-[#8AABDF] text-xs lg:text-[13px] mt-1 leading-tight font-medium text-center">
                            {stat.label}
                          </span>
                        </div>
                      </div>

                      {index !== stats.length - 1 && (
                        <>
                          <div className="hidden lg:block w-px h-10 bg-white/10 shrink-0" />
                          <div className="block lg:hidden w-16 h-px bg-white/10 shrink-0 mr-2" />
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Image - MOBILE: Border + Shadow, LAPTOP: Clean */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 flex flex-col items-center lg:items-end justify-center lg:justify-end "
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-[500px] lg:max-w-[632px] mx-auto lg:mx-0"
            >
              <Image
                src="/figma/hero-illustration.png"
                alt="Auction 11 platform dashboard preview"
                width={632}
                height={557}
                style={{ width: '100%', height: 'auto' }}
                priority
                className="rounded-[24px] lg:rounded-none shadow-2xl lg:shadow-none border-4 lg:border-0 border-white/10 lg:border-transparent"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// TODAY'S AUCTION SECTION - Real auction data
// =============================================================================
function TodaySection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["landing-today-auctions"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auction/today?page=1&limit=4`);
      if (!res.ok) throw new Error("Failed to fetch today's auctions");
      const json = await res.json();
      return json.data;
    },
    staleTime: Infinity,
  });
  const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002";
  const fallbackImage = "/icon1.png";

  if (error) {
    console.error("Error loading today's auctions:", error);
  }

  return (
    <section id="todays-auction" className="relative z-20 w-full flex justify-center px-4 sm:px-6 lg:px-8 mt-[-40px]">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-7xl pt-10 pb-8 px-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="w-full relative flex flex-col items-center gap-3 text-[32px] text-black font-['Poppins'] mb-8"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="tracking-[0.04em] font-semibold flex items-center">
              <span>
                <span style={{ color: '#012972' }}>{`Today’s `}</span>
                <span className="text-[#00379d]">{`Auction `}</span>
              </span>
            </div>
            <div className="w-[134px] h-[4px] rounded-[12px] bg-[#00379d]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full flex flex-col items-center"
        >
          <div className="w-full flex items-center justify-start md:justify-center px-2 sm:px-4 gap-[12px] lg:gap-[23px] overflow-x-auto md:overflow-visible py-4 -my-4 md:flex-nowrap" style={{ scrollbarWidth: 'none' }}>
            <ChevronLeft className="hidden md:block cursor-pointer shrink-0 hover:text-[#FFBA00] transition-colors" color="#000" size={30} />

            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <AuctionCardSkeleton key={i} layout="horizontal" />
              ))
            ) : data?.data && data.data.length > 0 ? (
              data.data.slice(0, 4).map((auction: any) => {
                // Format time per auction
                const displayTime = auction.auctionStartTime
                  ? auction.auctionStartTime.slice(0, 5)
                  : "TBD";
                return (
                  <Link
                    key={auction.id}
                    href={`${DASHBOARD_URL}/viewer/${auction.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-[200px] sm:w-[240px] lg:w-[271px] shrink-0"
                  >
                    <div key={auction.id} className="w-[200px] sm:w-[240px] lg:w-[271px] rounded-[12px] bg-white border-2 border-[#ff7900] shadow-[0px_4px_24px_rgba(0,0,0,0.25)] p-3 flex items-center gap-3 shrink-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer group">
                      <Image
                        className="w-[68px] h-[68px] rounded-full object-cover shrink-0"
                        src={auction.logo || fallbackImage}
                        width={68}
                        height={68}
                        alt={`${auction.name} logo`}
                      />
                      <div className="flex flex-col gap-2 justify-center">
                        <div className="text-[14px] sm:text-[14.62px] leading-[20px] font-semibold text-black group-hover:text-[#ff7900] transition-colors">{auction.name}</div>
                        <div className="flex flex-col gap-1 text-[12px] sm:text-[13px]">
                          <div className="flex items-center gap-1">
                            <MapPinned size="15px" color="#000" />
                            <div className="leading-[18px] font-medium text-black">{auction.location || "Location TBD"}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size="15px" color="#000" />
                            <div className="leading-[18px] font-medium text-black">
                              {displayTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-8 w-full">No auctions scheduled for today.</div>
            )}

            <ChevronRight className="hidden md:block cursor-pointer shrink-0 hover:text-[#FFBA00] transition-colors" color="#000" size={30} />
          </div>

          <div className="mt-8">
            <Button href="/today-auction" className="w-[150px] h-[42px] rounded-[99px] bg-[#00379d] border border-[#ffaf2e] flex items-center justify-center px-6 py-3 text-center text-[16px] text-white font-semibold hover:bg-[#002a6e] hover:scale-105 transition-all duration-200 font-epilogue focus:ring-2 focus:ring-[#ffaf2e] focus:outline-none">
              View All
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// UPCOMING AUCTION SECTION - Real data from API (limit 4)
// =============================================================================
function UpcomingSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["landing-upcoming-auctions"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auction/upcoming?page=1&limit=4`);
      if (!res.ok) throw new Error("Failed to fetch upcoming auctions");
      const json = await res.json();
      return json.data;
    },
    staleTime: Infinity,
  });
  const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002";
  const fallbackImage = "/final-1.png";
  const hasLogo = data?.auction?.logo && data?.auction?.logo.trim() !== "";
  const imageContainerBg = hasLogo ? "bg-gray-100" : "bg-black";

  if (error) {
    console.error("Error loading upcoming auctions:", error);
  }

  return (
    <section id="upcoming" className="relative z-10 w-full flex justify-center px-4 sm:px-6 lg:px-8 py-16" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl pt-10 pb-8 px-4 flex flex-col items-center relative z-10"
      >
        <div className="flex flex-col items-center gap-2 mb-12">
          <h2 className="text-[32px] font-semibold leading-tight flex items-center gap-2 font-['Poppins']">
            <span className="text-white font-bold">Upcoming</span>
            <span className="text-[#FFBA00] font-bold tracking-wider">Auction</span>
          </h2>
          <div className="w-[134px] h-[4px] bg-[#FFBA00] rounded-[12px]" />
        </div>

        <div className="flex items-start gap-16 lg:gap-12 w-full overflow-x-auto xl:overflow-visible pb-4 xl:justify-center flex-nowrap xl:flex-wrap" style={{ scrollbarWidth: 'none' }}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <AuctionCardSkeleton key={i} layout="vertical" />
            ))
          ) : data?.data && data.data.length > 0 ? (
            data.data.slice(0, 4).map((auction: any, idx: number) => {
              // Format date per auction
              const auctionDateObj = new Date(auction.auctionDate);
              const formattedDate = auctionDateObj.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              return (
                <Link
                  key={auction.id}
                  href={`${DASHBOARD_URL}/viewer/${auction.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-[200px] sm:w-[240px] lg:w-[271px] shrink-0 gap-x-8"
                >
                  <div key={auction.id} className="bg-white rounded-[16px] w-[250px] sm:w-[290px] flex flex-col overflow-hidden relative shadow-[0_4px_24px_rgba(0,0,0,0.25)] shrink-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group">
                    <div className={`w-full h-[145px] relative rounded-t-[16px] overflow-hidden p-[2px]${imageContainerBg} flex justify-center items-center`} style={{ padding: '5px' }}>
                      <Image
                        src={auction.logo || fallbackImage}
                        fill
                        objectFit="contain"
                        alt={`${auction.name} preview`}
                        className="w-full h-full opacity-90 rounded-t-[12px] group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col gap-2 pt-5">
                      <div className="flex items-center gap-2">
                        <Users size={18} color="#000" />
                        <span className="text-[14px] font-semibold text-black group-hover:text-[#00379d] transition-colors" style={{ fontFamily: 'Poppins' }}>{auction.name}</span>
                      </div>
                      <div className="flex flex-row gap-2 justify-between items-center">
                        <div className="flex items-center gap-2 w-[130px] h-[38px]">
                          <Calendar size={18} color="#000" />
                          <span className="text-[14px] font-medium text-gray-600" style={{ fontFamily: 'Poppins' }}>
                            {formattedDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPinned size="15px" color="#000" />
                          <div className="leading-[18px] font-medium text-gray-600">{auction.location || "TBD"}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-100">
                        <span className="text-xs font-medium text-gray-500">
                          Purse: ₹{Number(auction.budgetPerTeam).toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-medium text-black ">{auction._count?.teams || 0} Teams</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center text-white/70 py-8 w-full">No upcoming auctions at the moment.</div>
          )}
        </div>

        <div className="text-center mt-8 flex flex-col items-center">
          <Button
            href="/upcoming-auction"
            className="font-epilogue w-[150px] border border-[#0C3278] inline-flex items-center gap-2 font-bold justify-center text-[15px] px-8 py-3 rounded-[99px] hover:bg-[#e6a800] hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-[#FFBA00] focus:outline-none"
            style={{
              background: "#FFBA00",
              color: "#012972",
              borderRadius: "99px",
            }}
          >
            View All
          </Button>
        </div>
      </motion.div>
    </section>
  )
}


// =============================================================================
// HOW IT WORKS SECTION - steps with real auction flow
// =============================================================================
const STEPS = [
  { n: "01", icon: <LogIn size={18} color="#dfe2e8ff" />, title: "Create Your Free Account", desc: "Sign up with your email or mobile number and access your auction dashboard instantly." },
  { n: "02", icon: <Gavel size={18} color="#dfe2e8ff" />, title: "Set Up Your Tournament", desc: "Add tournament details, team budgets, and bidding rules in a few simple steps." },
  { n: "03", icon: <Banknote size={18} color="#dfe2e8ff" />, title: "Add Teams & Invite Owners", desc: "Add teams and send invite links so team owners can join and bid live." },
  { n: "04", icon: <CreditCard size={18} color="#dfe2e8ff" />, title: "Register & Categorize Players", desc: "Add players manually or share the registration link. Set categories and base prices easily." },
  { n: "05", icon: <Hourglass size={18} color="#dfe2e8ff" />, title: "Go Live & Start the Auction", desc: "Launch your live auction and manage bids, budgets, and team updates automatically." },
];


function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 relative z-10 w-full flex justify-center bg-transparent mt-[80px]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 flex flex-col items-center w-full"
      >
        <div className="flex flex-col items-center gap-1 mb-16 text-[32px] text-white font-['Poppins']">
          <h2 className="font-semibold text-center flex flex-wrap justify-center gap-x-2">
            How to <span className="font-bold text-[#FFBA00] relative">
              Get Started
              <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#FFBA00]" />
            </span> in 5 Steps
          </h2>
        </div>

        <div className="w-full max-w-[1000px] flex flex-col gap-6 items-center">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full">
            {STEPS.slice(0, 3).map(s => (
              <div key={s.n} className="bg-white rounded-[12px] p-5 flex flex-col gap-2 w-full sm:w-[280px] lg:w-[310px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative group">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 p-1 bg-gradient-to-br from-sky-900 to-indigo-700 rounded-lg inline-flex justify-center items-center gap-2.5 group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <span className="text-[#00379d] font-bold text-[12px] uppercase tracking-wider">STEP {s.n.replace('0', '')}</span>
                </div>
                <h3 className="font-bold text-[16px] sm:text-[18px] text-[#012972] mt-2 leading-tight">{s.title}</h3>
                <p className="text-[13px] text-[#4a6090] leading-snug tracking-tight">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full">
            {STEPS.slice(3, 5).map(s => (
              <div key={s.n} className="bg-white rounded-[12px] p-5 flex flex-col gap-2 w-full sm:w-[280px] lg:w-[310px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative group">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 p-1 bg-gradient-to-br from-sky-900 to-indigo-700 rounded-lg inline-flex justify-center items-center gap-2.5 group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <span className="text-[#00379d] font-bold text-[12px] uppercase tracking-wider">STEP {s.n.replace('0', '')}</span>
                </div>
                <h3 className="font-bold text-[16px] sm:text-[18px] text-[#012972] mt-2 leading-tight">{s.title}</h3>
                <p className="text-[13px] text-[#4a6090] leading-snug tracking-tight">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 flex flex-col items-center">
          <Button
            href="/login"
            className="font-epilogue inline-flex items-center gap-2 font-bold justify-center text-[15px] px-8 py-3 border border-[#0C3278] rounded-[99px] hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-[#FFBA00] focus:outline-none"
            style={{
              background: "#FFBA00",
              color: "#012972",
              borderRadius: "99px",
            }}
          >
            Create Your First Auction
            <MoveRight size={15} />
          </Button>
          <p className="text-[13px] mt-3 font-medium text-[#8AABDF] tracking-wide">Free to start · No credit card needed</p>
        </div>
      </motion.div>
    </section>
  );
}

// =============================================================================
// ABOUT SECTION - cricket auction specific benefits
// =============================================================================
const ABOUT_POINTS = [
  { title: "Real-time Bidding Engine", desc: "Low-latency bid updates with live leaderboard and automatic budget tracking for all teams." },
  { title: "Transparent Auction Process", desc: "Complete audit trail of every bid, public/private auction modes, and fair play guarantees." },
  { title: "Advanced Squad Management", desc: "Manage player pools, base prices, role filters, and generate squad sheets post-auction." },
];

function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-24 relative z-10 w-full flex justify-center px-4 bg-transparent mt-[-40px] sm:mt-[-100px]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto w-full bg-white rounded-[24px] shadow-2xl p-8 lg:p-12 relative overflow-hidden"
      >
        <div className="flex flex-col items-center gap-1 mb-12 text-[32px] text-black font-['Poppins']">
          <h2 className="font-semibold text-center flex flex-wrap justify-center gap-x-2">
            <span className="font-bold text-black relative">
              About
              <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#00379d]" />
            </span> <span className="text-[#00379d] font-bold">Us</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative w-full aspect-square max-w-[500px] mx-auto rounded-[24px] overflow-hidden bg-gray-100 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#0A307F] opacity-10" />
            <Image src="/images/image 618.png" layout="fill" objectFit="cover" alt="Cricket auction platform dashboard preview" priority={false} />
          </div>

          <div className="flex flex-col">
            <h3 className="text-[28px] lg:text-[32px] font-bold mb-6 text-[#00379d] leading-tight">
              Why Choose Auction 11?
            </h3>
            <p className="text-[15px] text-[#4a6090] mb-8 leading-relaxed">
              Built for cricket enthusiasts & professional leagues — manage auctions with enterprise-grade reliability.
            </p>

            <div className="flex flex-col gap-6 mb-10">
              {ABOUT_POINTS.map((point, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="mt-1 bg-[#00379d] rounded-full p-[2px] shrink-0 flex items-center justify-center group-hover:bg-[#FFBA00] transition-colors">
                    <Check color="white" size={14} strokeWidth={4} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-[#072460] text-[16px] group-hover:text-[#00379d] transition-colors">{point.title}</h4>
                    <p className="text-[13px] text-[#4a6090] leading-snug tracking-tight pr-4">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button href="/login" className="font-epilogue bg-[#00379d] border border-[#ffaf2e] text-white font-semibold px-8 py-3 rounded-[99px] hover:bg-[#002a6e] hover:scale-105 transition-all duration-200 w-[180px] text-[15px] focus:ring-2 focus:ring-[#ffaf2e] focus:outline-none">
              Register Now
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// =============================================================================
// PRICING SECTION - realistic auction platform pricing
// =============================================================================
const PLANS = [
  { id: "p1", label: "Basic", teams: "04", price: "₹1,049/-", originalPrice: "₹1,500/-", period: "per Auction", highlight: false },
  { id: "p2", label: "Standard", teams: "08", price: "₹1,749/-", originalPrice: "₹2,500/-", period: "per Auction", highlight: false },
  { id: "p3", label: "Premium", teams: "12", price: "₹2,449/-", originalPrice: "₹3,500/-", period: "per Auction", highlight: true },
  { id: "p4", label: "Elite", teams: "16", price: "₹2,799/-", originalPrice: "₹4,000/-", period: "per Auction", highlight: false },
  { id: "p5", label: "Ultimate", teams: "20", price: "₹3,849/-", originalPrice: "₹5,500/-", period: "per Auction", highlight: false },
  { id: "p6", label: "Mega", teams: "30", price: "₹4,899/-", originalPrice: "₹6,999/-", period: "per Auction", highlight: false },
];


function PricingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002";

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
      } catch { }
    }
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-16 lg:py-24 relative z-10 w-full flex justify-center bg-transparent mt-[-40px] sm:mt-[-100px]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 flex flex-col items-center w-full relative"
      >
        <div className="flex flex-col items-center gap-1 mb-12 sm:mb-16 text-[32px] text-white font-['Poppins']">
          <h2 className="font-semibold text-center flex flex-wrap justify-center gap-x-2 text-white">
            <span className="font-bold relative text-white">
              Our
              <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#FFBA00]" />
            </span> <span className="text-[#FFBA00] font-bold">Pricing</span>
          </h2>
        </div>

        {/* Scroll Buttons */}
        <button onClick={scrollLeft} className="absolute left-0 lg:-left-8 top-[55%] -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-[#012972] hover:bg-[#FFBA00] hover:text-white transition-colors z-20 focus:outline-none">
          <ChevronLeft size={24} />
        </button>
        <button onClick={scrollRight} className="absolute right-0 lg:-right-10 top-[55%] -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-[#012972] hover:bg-[#FFBA00] hover:text-white transition-colors z-20 focus:outline-none">
          <ChevronRight size={24} />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 w-full lg:max-w-none pb-8 scroll-smooth px-4 lg:px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          data-lenis-prevent
        >
          {PLANS.map((plan) => {
            const planKey = plan.label.toUpperCase();
            const targetUrl = user
              ? `${DASHBOARD_URL}/dashboard/select-auction-payment?plan=${planKey}`
              : `/login?redirect=${DASHBOARD_URL}/dashboard/select-auction-payment?plan=${planKey}`;

            return (
              <div key={plan.id} className="shrink-0 w-[280px] lg:w-[280px] bg-white rounded-[16px] p-5 flex flex-col items-center justify-between min-h-[285px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] relative border border-[#eef3ff] group">
                <div className="flex flex-col items-center w-full">
                  <span className="text-[#000] font-bold text-[16px] mb-1 font-['Poppins']">{plan.label}</span>
                  <div className="text-[#000] font-black text-[28px] tracking-tight whitespace-nowrap">{plan.price}</div>
                  <span className="text-gray-400 font-bold text-sm tracking-tight whitespace-nowrap line-through">{plan.originalPrice}</span>
                  {plan.price !== "Free" && (
                    <div className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[#00379d] text-white w-fit shadow-sm mt-1 mb-2">
                      You Save ₹{(parseInt(plan.originalPrice.replace(/\D/g, "")) - parseInt(plan.price.replace(/\D/g, ""))).toLocaleString()} (30% off)
                    </div>
                  )}
                  <div className="text-[#4a6090] text-[12px] font-medium mb-4">{plan.period}</div>

                  <div className="w-full h-px border-t-2 border-dashed border-[#d1d5db] mb-4" />

                  {/* ✅ Fixed: "up to" row centered */}
                  <div className="flex items-baseline justify-center gap-1.5 font-['Poppins'] w-full">
                    <span className="text-[#4a6090] text-[14px] font-medium">upto</span>
                    <span className="text-[#000] font-black text-[32px] leading-none">{plan.teams}</span>
                    <span className="text-[#000] text-[14px] font-semibold">Teams</span>
                  </div>
                </div>


                <Link href={targetUrl} className="w-full flex justify-center">
                  <Button className="font-epilogue bg-[#00379d] border border-[#ffaf2e] mb-5 mt-2 text-white font-bold px-8 py-2 rounded-[99px] hover:bg-[#002a6e] hover:scale-105 transition-all duration-200 w-full max-w-[150px] text-[13px] shadow-[0_4px_16px_rgba(0,55,157,0.2)] focus:ring-2 focus:ring-[#ffaf2e] focus:outline-none cursor-pointer">
                    Select Plan
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm mt-8 text-[#8AABDF]">
          Need a custom plan for your league?{" "}
          <a href="mailto:auction11.live@gmail.com" target="_blank" className="font-semibold hover:underline text-[#FFBA00] transition-colors">
            Contact us
          </a>
        </p>
      </motion.div>
    </section>
  );
}

// =============================================================================
// LATEST NEWS SECTION
// =============================================================================
function LatestNewsSection() {
  return (
    <section id="news" className="py-16 lg:py-24 relative z-10 w-full flex justify-center bg-transparent mt-[-40px] sm:mt-[-80px]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center w-full"
      >
        <div className="flex flex-col items-center gap-1 mb-12 text-[32px] text-white font-['Poppins']">
          <h2 className="font-semibold text-center flex flex-wrap justify-center gap-x-2 text-white">
            <span className="font-bold relative text-white">
              Latest
              <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#FFBA00]" />
            </span> <span className="text-[#FFBA00] font-bold">Sports News</span>
          </h2>
          <p className="text-sm text-center max-w-[500px] mt-3" style={{ color: "#8AABDF" }}>
            Stay updated with real-time tournament details, IPL highlights, player stats, and league rumors.
          </p>
        </div>

        <div className="w-full">
          <BlogList limit={3} />
        </div>
      </motion.div>
    </section>
  );
}

// =============================================================================
// PAGE ASSEMBLY
// =============================================================================
export default function HomePage() {
  return (
    <main className="relative bg-[#072460] min-h-screen text-white overflow-hidden font-sans">
      <GlobalBackground variants="hero" />
      <Navbar />
      <div className="relative z-10 flex flex-col gap-0 w-full">
        <HeroSection />
        <TodaySection />

        <div className="relative top-0 w-full z-10">
          <GlobalBackground variants="upcoming" />
          <UpcomingSection />
          <FeaturesSectionClient />
          <HowItWorksSection />
          <AboutSection />
          <PricingSection />
          <LatestNewsSection />
          <FAQSection />
        </div>

        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}