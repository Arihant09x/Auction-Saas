"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Users, Youtube, RotateCw, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@repo/ui/button";

gsap.registerPlugin(ScrollTrigger);

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3001";

// ─── Gradient underline ──────────────────────────────────────────────────────
function PageTitle({ title, highlight }: { title: string; highlight: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
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

// ─── Plans data ──────────────────────────────────────────────────────────────
const PLANS = [
  { id: "p1", label: "Basic", teams: "04", price: "₹1,049/-", originalPrice: "₹1,500/-", period: "per Auction", highlight: false },
  { id: "p2", label: "Standard", teams: "08", price: "₹1,749/-", originalPrice: "₹2,500/-", period: "per Auction", highlight: false },
  { id: "p3", label: "Premium", teams: "12", price: "₹2,449/-", originalPrice: "₹3,500/-", period: "per Auction", highlight: true },
  { id: "p4", label: "Elite", teams: "16", price: "₹2,799/-", originalPrice: "₹4,000/-", period: "per Auction", highlight: false },
  { id: "p5", label: "Ultimate", teams: "20", price: "₹3,849/-", originalPrice: "₹5,500/-", period: "per Auction", highlight: false },
  { id: "p6", label: "Mega", teams: "30", price: "₹4,899/-", originalPrice: "₹6,999/-", period: "per Auction", highlight: false },
];

const EXTRA_FEATURES = [
  { id: "f1", label: "Bulk Player Import", description: "Instantly upload hundreds of players via CSV or Excel sheets.", price: "0/-", icon: <Users size={20} className="text-[#00379d]" /> },
  { id: "f2", label: "Youtube Live Overlay", description: "Broadcast your auction with professional, real-time custom graphics.", price: "0/-", icon: <Youtube size={20} className="text-[#00379d]" /> },
  { id: "f3", label: "Fortune Wheel", description: "Randomize player selections to add suspense and fairness to the bidding.", price: "0/-", icon: <RotateCw size={20} className="text-[#00379d]" /> },
  { id: "f4", label: "Dedicated Support", description: "Get real-time assistance via WhatsApp and email during your live auctions.", price: "0/-", icon: <MessageSquare size={20} className="text-[#00379d]" /> },
];

// ─── Plan card with GSAP hover ───────────────────────────────────────────────
function PlanCard({ plan }: { plan: typeof PLANS[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const enter = () => gsap.to(card, { y: -8, scale: 1.03, boxShadow: "0 20px 40px rgba(1,41,114,0.25)", duration: 0.25, ease: "power2.out" });
    const leave = () => gsap.to(card, { y: 0, scale: 1, boxShadow: plan.highlight ? "0 8px 24px rgba(255,186,0,0.2)" : "0 4px 24px rgba(0,0,0,0.12)", duration: 0.25, ease: "power2.inOut" });
    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
    return () => { card.removeEventListener("mouseenter", enter); card.removeEventListener("mouseleave", leave); };
  }, [plan.highlight]);

  return (
    <div
      ref={cardRef}
      className={`plan-card rounded-[16px] p-6 flex flex-col gap-3 border-2 cursor-pointer ${plan.highlight
        ? "bg-[#012972] border-[#FFBA00] text-white shadow-[0_8px_24px_rgba(255,186,0,0.2)]"
        : "bg-white border-[#e0e7f5] text-[#012972] shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
        }`}
      style={{ opacity: 0, transform: "translateY(40px)" }}
    >
      <div className={`text-[14px] font-bold uppercase tracking-wider ${plan.highlight ? "text-[#FFBA00]" : "text-[#00379d]"}`}>
        {plan.label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-[42px] font-black leading-none ${plan.highlight ? "text-white" : "text-[#012972]"}`}>
          {plan.teams}
        </span>
        <div className="flex flex-col leading-tight">
          <span className={`text-[12px] font-bold ${plan.highlight ? "text-white/80" : "text-[#4a6090]"}`}>Teams</span>
          <span className={`text-[11px] ${plan.highlight ? "text-white/60" : "text-[#4a6090]"}`}>{plan.period}</span>
        </div>
      </div>
      <div className={`text-[28px] font-black border-t pt-3 ${plan.highlight ? "border-white/20 text-[#FFBA00]" : "border-[#e0e7f5] text-[#012972]"}`}>
        {plan.price}
      </div>
      <span className="text-gray-400 font-bold text-md -mt-4 mb-1 tracking-tight whitespace-nowrap line-through">{plan.originalPrice}</span>
      {plan.price !== "Free" && (
        <div className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded w-fit shadow-sm mb-3 ${plan.highlight ? "bg-[#FFBA00] text-[#012972]" : "bg-[#00379d] text-white"}`}>
          You Save ₹{(parseInt(plan.originalPrice.replace(/\D/g, "")) - parseInt(plan.price.replace(/\D/g, ""))).toLocaleString()} (30% off)
        </div>
      )}
      <Button
        href={`/login`}
        className={`mt-auto w-full py-2.5 rounded-[99px] font-bold text-[14px] border border-[#ffaf2e] hover:opacity-90 transition text-center font-epilogue ${plan.highlight ? "bg-[#FFBA00] text-[#012972]" : "bg-[#00379d] text-white"
          }`}
      >
        Select
      </Button>
    </div>
  );
}

function FeatureCard({ f }: { f: typeof EXTRA_FEATURES[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const enter = () => gsap.to(card, { y: -6, scale: 1.03, boxShadow: "0 12px 32px rgba(1,41,114,0.18)", duration: 0.25, ease: "power2.out" });
    const leave = () => gsap.to(card, { y: 0, scale: 1, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", duration: 0.25, ease: "power2.inOut" });
    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
    return () => { card.removeEventListener("mouseenter", enter); card.removeEventListener("mouseleave", leave); };
  }, []);

  return (
    <div
      ref={cardRef}
      className="feature-card bg-white rounded-[14px] p-5 flex flex-col gap-2 border border-[#e0e7f5] shadow-sm cursor-pointer min-h-[160px]"
      style={{ opacity: 0, transform: "translateY(30px)" }}
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-[#eef3ff] rounded-[10px] flex items-center justify-center shrink-0">
          {f.icon}
        </div>
        <span className="text-[#012972] font-bold text-[15px]">{f.label}</span>
      </div>
      <p className="text-[#4a6090] text-[13px] font-medium leading-snug">
        {f.description}
      </p>
      <div className="flex items-baseline gap-1 pl-1 mt-auto pt-2">
        <span className="text-[28px] font-black text-[#012972]">{f.price}</span>
        <span className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider ml-1">Included</span>
      </div>
    </div>
  );
}

// ─── Plans grid with GSAP stagger ────────────────────────────────────────────
function PlansGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".plan-card", {
        opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {PLANS.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
    </div>
  );
}

// ─── Features grid with GSAP stagger ─────────────────────────────────────────
function FeaturesGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".feature-card", {
        opacity: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: gridRef.current, start: "top 90%", once: true },
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
      {EXTRA_FEATURES.map((f) => <FeatureCard key={f.id} f={f} />)}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  return (
    <main className="relative bg-white min-h-screen font-sans overflow-x-hidden">
      {/* Fixed diagonal bands */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden lg:block">
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <div className="absolute" style={{ width: "140px", height: "200vh", background: "linear-gradient(80deg, #08245E, #0A307F)", transform: "rotate(18deg)", left: "70%", top: "-20%" }} />
          <div className="absolute" style={{ width: "140px", height: "200vh", background: "#0A307F", transform: "rotate(18deg)", left: "63%", top: "-20%", filter: "drop-shadow(0 4px 20px #000)" }} />
        </div>
      </div>

      <Navbar />

      <div className="relative z-10 pt-[79px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <PageTitle title="Pricing" highlight="& Plans" />

          {/* Plans */}
          <section className="pb-14">
            <PlansGrid />
          </section>

          {/* Extra Features */}
          <section className="pb-20">
            <div className="flex flex-col items-center gap-3 mb-10">
              <h2 className="text-[26px] sm:text-[30px] font-bold font-['Poppins'] text-[#012972] text-center">
                Our Extra <span className="text-[#00379d]">Features</span>
              </h2>
              <div
                className="w-full max-w-[400px] h-[3px] rounded-full"
                style={{ background: "linear-gradient(90deg, transparent 0%, #012972 30%, #4266a9 60%, transparent 100%)" }}
              />
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-10">
              <FeaturesGrid />
              {/* Illustration placeholder */}
              <div className="hidden lg:flex flex-col items-center justify-center w-[260px] shrink-0 self-center">
                <div className="w-[220px] h-[220px] bg-[#eef3ff] rounded-[24px] flex flex-col items-center justify-center gap-4 p-6 text-center shadow-md">
                  <div className="w-14 h-14 bg-[#FFBA00] rounded-2xl flex items-center justify-center shadow">
                    <Users size={28} className="text-[#012972]" />
                  </div>
                  <p className="text-[#012972] text-[13px] font-semibold leading-snug">
                    Premium tools for smarter auctions
                  </p>
                </div>
              </div>
            </div>

            <p className="text-start text-[13px] text-black mt-10 italic">
              *Above pricing is according to maximum 20 players per team
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
