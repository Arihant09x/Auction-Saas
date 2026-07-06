"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Calendar, ChevronLeft, ChevronRight, ServerCrash, Inbox, Users, IndianRupee, Trophy, MapPin, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";

gsap.registerPlugin(ScrollTrigger);

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
            "linear-gradient(90deg, transparent 0%, #012972 50%, #4266a9 50%, #88a9e5 75%, transparent 100%)",
        }}
      />
    </div>
  );
}

function AuctionCard({ auction }: { auction: any }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002";
  const statusColors: Record<string, string> = {
    DRAFT: "bg-yellow-300 text-black",
    LIVE: "bg-green-100 text-green-700",
    COMPLETED: "bg-blue-100 text-blue-700",
  };
  const statusColor = statusColors[auction.status] || "bg-gray-100 text-gray-700";
  const auctionDateObj = new Date(auction.auctionDate);
  const formattedDate = auctionDateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const displayTime = auction.auctionStartTime ? auction.auctionStartTime.slice(0, 5) : "TBD";
  const budget = Number(auction.budgetPerTeam);
  const formattedBudget = budget.toLocaleString("en-IN");

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const enter = () => gsap.to(card, { y: -8, scale: 1.02, boxShadow: "0 16px 40px rgba(1,41,114,0.22)", duration: 0.25, ease: "power2.out" });
    const leave = () => gsap.to(card, { y: 0, scale: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", duration: 0.25, ease: "power2.inOut" });
    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
    return () => { card.removeEventListener("mouseenter", enter); card.removeEventListener("mouseleave", leave); };
  }, []);

  const fallbackImage = "/final-1.png";

  return (
    <a
      href={`${DASHBOARD_URL}/viewer/${auction.id}`}
      ref={cardRef}
      className="auction-card group block bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 relative cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFBA00] focus:ring-offset-2"
      style={{ opacity: 0, transform: "translateY(40px)" }}
    >


      {/* Rest of the card unchanged */}
      <div className="relative w-full aspect-[16/9] bg-white overflow-hidden">
        <img
          src={auction.logo || fallbackImage}
          alt={auction.name}
          className="object-contain w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-[1deg] group-hover:duration-1000"
        />
        <div className="absolute top-3 right-3 z-20">
          <span className={`${statusColor} text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm`}>
            {auction.status}
          </span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between bg-[#fbf9f5]">
        <div className="mb-2">
          <h3 className="text-[#012972] font-bold text-base line-clamp-1">{auction.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">by {auction.organizer?.name || "Organizer"}</p>
        </div>

        <div className="grid grid-cols-2 gap-y- gap-x-3 mt-1">
          <div className="flex items-center gap-1 text-[12px] font-semibold text-[#b38200] rounded-lg py-1.5 ">
            <MapPin size={12} />
            <span className="truncate inline-block transition-transform duration-200 hover:translate-x-[6px]">{auction.location || "Not mentioned"}</span>
          </div>
          <div className="flex flex-row items-center justify-end gap-1 text-[14px] text-gray-400">
            <span className="text-[11px] font-semibold text-[#b38200]">Points</span>
            <span className="text-xs font-semibold text-[#b38200] inline-block transition-transform duration-200 hover:translate-x-[6px]">₹{formattedBudget}</span>
          </div>
          <div className="flex flex-row items-center justify-start gap-1 rounded-lg py-1.5 ">
            <Users size={14} className="text-[#00379d] mb-0.5" />
            <span className="inline-block transition-transform duration-200 hover:translate-x-[6px]">
              <span className="text-xs font-semibold text-[#00379d]">{auction.minPlayersPerTeam || 0} Players</span>
              <span className="text-[11px] font-semibold text-gray-400 " >/Team</span>
            </span>
          </div>
          <div className="flex flex-row items-center text-center justify-end gap-1 rounded-lg py-1.5 ">
            <Calendar size={14} className="text-[#00379d] mb-0.5 transition-transform duration-200 hover:translate-x-[-6px]" />
            <span className="inline-block transition-transform duration-200 hover:translate-x-[6px] flex flex-row items-center gap-0.5">
              <span className="text-xs font-semibold text-gray-700">{formattedDate}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-[10px] font-semibold text-gray-400">{displayTime || "TBD"}</span>
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

function AuctionCardSkeletonMatch() {
  return (
    <div className="bg-white rounded-[14px] overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.15)] border border-[#e8eef8] animate-pulse">
      <div className="relative w-full aspect-[16/9] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="h-4 bg-gray-200 rounded col-span-1" />
          <div className="h-4 bg-gray-200 rounded col-span-1" />
          <div className="h-4 bg-gray-200 rounded col-span-2 mt-2" />
        </div>
      </div>
    </div>
  );
}

function CardsGrid({ data, isLoading, error }: { data: any, isLoading: boolean, error: any }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || !data?.data?.length) return;
    const ctx = gsap.context(() => {
      gsap.to(".auction-card", {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, gridRef);
    return () => ctx.revert();
  }, [isLoading, data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, idx) => (
          <AuctionCardSkeletonMatch key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <ServerCrash size={40} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-[#012972] mb-2">Oops! Server is currently unreachable.</h3>
        <p className="text-gray-500 max-w-md">We are having trouble connecting to our systems. Please try again later.</p>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
          <Inbox size={40} className="text-[#012972]" />
        </div>
        <h3 className="text-xl font-bold text-[#012972] mb-2">No Upcoming Auctions</h3>
        <p className="text-gray-500 max-w-md">There are no upcoming auctions scheduled at the moment. Please check back later!</p>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.data.map((auction: any) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
}

export default function UpcomingAuctionPage() {
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading, error } = useQuery({
    queryKey: ["upcoming-auctions", page],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auction/upcoming?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data;
    },
    staleTime: Infinity, // only fetch new data on refresh
  });

  return (
    <main className="relative bg-white min-h-screen font-sans overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 hidden lg:block">
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <div className="absolute" style={{ width: "140px", height: "200vh", background: "linear-gradient(80deg, #08245E, #0A307F)", transform: "rotate(18deg)", left: "70%", top: "-20%" }} />
          <div className="absolute" style={{ width: "140px", height: "200vh", background: "#0A307F", transform: "rotate(18deg)", left: "63%", top: "-20%", filter: "drop-shadow(0 4px 20px #000)" }} />
        </div>
      </div>

      <Navbar />

      <div className="relative z-10 pt-[79px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto min-h-[70vh] flex flex-col">
          <PageTitle title="Upcoming" highlight="Auction" />

          <section className="flex-1 pb-10">
            <CardsGrid data={data} isLoading={isLoading} error={error} />
          </section>

          {/* Pagination Controls */}
          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pb-20">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={20} className="text-[#012972]" />
              </button>
              <span className="text-sm font-semibold text-gray-600">
                Page {page} of {data.meta.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(data.meta.totalPages, p + 1))}
                disabled={page === data.meta.totalPages}
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={20} className="text-[#012972]" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
