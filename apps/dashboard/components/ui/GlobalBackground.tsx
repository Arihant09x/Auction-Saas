export function GlobalBackground({
    variants = 'hero',
    className = ""
}: {
    variants?: 'hero' | 'upcoming' | 'features' | 'footer';
    className?: string;
}) {
    if (variants === 'hero') {
        return (
            <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
                {/* ── FIGMA EXACT DIAGONAL LAYER 1 (140x1016px slanted) ── */}
                <div
                    className="absolute hidden lg:block"
                    style={{
                        width: "140px", height: "1316px",
                        left: "9%", top: "-5%",
                        transform: "rotate(-24deg)",
                        background: "#0A307F",
                        filter: "drop-shadow(0 4px 40px #000)"
                    }}
                />
                {/* ── FIGMA EXACT SVG MASSIVE BAND ── */}
                <div className="absolute hidden lg:block" style={{ left: "106px", top: "-150px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="585" height="1320" viewBox="0 0 585 801" fill="none">
                        <g filter="url(#filter0_d_676_20020)">
                            <path d="M405.14 746.342L544.519 756.596L106.66 -149.796L-32.7134 -160.051L405.14 746.342Z" fill="#0A307F" />
                        </g>
                        <defs>
                            <filter id="filter0_d_676_20020" x="-72.7134" y="-196.051" width="657.232" height="996.647" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="20" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_676_20020" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_676_20020" result="shape" />
                            </filter>
                        </defs>
                    </svg>
                </div>
            </div>
        );
    }
    if (variants === 'upcoming') {
        return (
            // Sticky height-0 container: stays at top of the section group,
            // the two diagonal bands use position:fixed so they never scroll.
            // The parent overflow must NOT be hidden for this to work.
            <div className={`pointer-events-none z-0 hidden lg:block overflow-visible ${className}`}
                style={{ position: 'sticky', top: 0, height: 0, width: '100%' }}
            >
                {/* Band 1 */}
                <div className="absolute hidden lg:block" style={{ position: 'absolute', width: '140px', height: '5316px', background: 'linear-gradient(80deg, #08245E, #0A307F  )', transform: 'rotate(18deg)', left: "22%", top: "-150px" }} />
                <div className="absolute hidden lg:block" style={{ position: 'absolute', width: "140px", height: "5391px", background: '#0A307F', transform: 'rotate(18deg)', left: '15%', top: '-155px', filter: "drop-shadow(0 4px 20px #000)" }} />
            </div>
        );
    }
    if (variants === 'features') {
        return (
            <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
                <div className="absolute hidden lg:block" style={{ position: 'absolute', width: '140px', height: '1316px', background: '#0A307F', transform: 'rotate(-24deg)', left: "11%", top: "-5%", filter: "drop-shadow(0 4px 20px #000)" }} />
                <div className="absolute hidden lg:block" style={{ position: 'absolute', width: "140px", height: "1391px", background: '#0A307F', transform: 'rotate(-24deg)', left: '15%', top: '-25%', filter: "drop-shadow(0 4px 20px #000)" }} />
            </div>
        );
    }
    if (variants === 'footer') {
        return (
            <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
                <div className="absolute hidden lg:block" style={{ position: 'absolute', width: '110px', height: '936px', background: '#0A307F', transform: 'rotate(-34deg)', left: "17%", top: "-30%", filter: "drop-shadow(0 4px 20px #000)" }} />
                <div className="absolute hidden lg:block" style={{ position: 'absolute', width: "110px", height: "936px", background: '#0A307F', transform: 'rotate(-34deg)', left: '22%', top: '-30%', filter: "drop-shadow(0 4px 20px #000)" }} />
            </div>
        );
    }
    return null;
}
