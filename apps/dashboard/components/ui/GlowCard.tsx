export function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative overflow-hidden rounded-xl p-[2px] group ${className}`}>
            {/* The rotating gradient border element */}
            <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#FFBA00_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* The actual inner card background that covers the middle of the gradient */}
            <div className="relative h-full w-full rounded-[10px] bg-white z-10 p-4 flex flex-col items-center text-center">
                {children}
            </div>

            {/* A subtle static border when not hovering */}
            <div className="absolute inset-0 rounded-xl border border-[#EBEBEB] group-hover:border-transparent transition-colors duration-300 z-20 pointer-events-none" />
        </div>
    );
}
