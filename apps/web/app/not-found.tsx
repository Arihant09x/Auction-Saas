"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { ParticlesBackground } from "@/components/ui/ParticlesBackground";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-[#072460] overflow-hidden flex items-center justify-center p-4 font-['Poppins']">
      <ParticlesBackground />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0d44b5]/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >


          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-4">Lost in Space?</h2>
            <p className="text-blue-200/60 text-lg mb-10">
              The page you are looking for has been moved or doesn't exist in our Auction 11.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#ffba00] text-[#012972] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_10px_40px_rgba(255,186,0,0.3)] active:scale-95"
              >
                <Home size={20} />
                Go Home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md"
              >
                <ArrowLeft size={20} />
                Go Back
              </button>
            </div>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>
    </main>
  );
}
