"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogsApi, BlogArticle } from "@/lib/api-client";
import { Calendar, ExternalLink, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Premium Safe Image Component (unchanged)
interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
}

export function SafeImage({ src, alt, className, fill }: SafeImageProps) {
  const fallbackImage = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&auto=format&fit=crop";
  const [imgSrc, setImgSrc] = useState(src || fallbackImage);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgSrc(fallbackImage)}
      style={fill ? { position: "absolute", height: "100%", width: "100%", left: 0, top: 0, objectFit: "cover" } : undefined}
    />
  );
}

interface BlogListProps {
  limit?: number;
}

export function BlogList({ limit = 6 }: BlogListProps) {
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cricket-blogs", page, limit],
    queryFn: () => blogsApi.getBlogs(page, limit),
    staleTime: 60000,
  });

  const blogs = Array.isArray(data?.data?.data) ? data.data.data : [];
  const meta = data?.data?.meta ?? { total: 0, page: 1, limit };
  const totalPages = Math.ceil(meta.total / limit);

  // GSAP scroll animation for blog cards
  useEffect(() => {
    if (!isLoading && blogs.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".blog-card",
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }, gridRef);
      return () => ctx.revert();
    }
  }, [isLoading, blogs]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: limit }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl overflow-hidden border border-[#e0e7f5] flex flex-col h-full bg-white shadow-sm"
          >
            <div className="h-48 w-full bg-gray-100" />
            <div className="p-5 flex-1 space-y-3">
              <div className="h-4 w-1/3 bg-gray-100 rounded" />
              <div className="h-6 w-5/6 bg-gray-100 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || (!isLoading && blogs.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-[#e0e7f5] bg-white/50">
        <BookOpen className="w-12 h-12 text-[#4a6090] mb-3" />
        <h3 className="text-lg font-bold text-[#012972] mb-1">No recent news available</h3>
        <p className="text-sm text-[#4a6090]">Check back later for up-to-date cricket reports & IPL matches.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid Layout with ref for GSAP */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((article: BlogArticle) => (
          <BlogCard key={article.id} article={article} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#e0e7f5] pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border border-[#012972]/20 text-[#012972] bg-white hover:bg-[#012972] hover:text-white transition-all duration-200 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#012972] disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          <span className="text-sm font-medium text-[#4a6090]">
            Page <span className="text-gray-500 font-bold">{page}</span> of{" "}
            <span className="text-gray-500 font-bold">{totalPages}</span>
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border border-[#FFBA00] bg-[#FFBA00] text-[#012972] hover:bg-[#e5a800] transition-all duration-200 disabled:opacity-40 disabled:hover:bg-[#FFBA00] disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// Individual blog card with GSAP hover effect (similar to plan cards)
function BlogCard({ article }: { article: BlogArticle }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const enter = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(1,41,114,0.15)",
        duration: 0.25,
        ease: "power2.out",
      });
    };
    const leave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        duration: 0.25,
        ease: "power2.inOut",
      });
    };
    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
    return () => {
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className="blog-card rounded-2xl overflow-hidden border border-[#e0e7f5] flex flex-col h-full bg-white shadow-sm cursor-pointer"
      style={{ opacity: 0, transform: "translateY(40px)" }}
    >
      {/* Image Container */}
      <div className="h-48 w-full relative overflow-hidden bg-gray-100">
        <SafeImage
          src={article.imageUrl}
          alt={article.title}
          fill={true}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-4 left-4 bg-[#FFBA00] text-[#012972] text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full">
          Cricket News
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-[#4a6090]">
            <Calendar size={13} />
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
                : "Recently"}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#012972] line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <p className="text-sm text-[#4a6090] line-clamp-3 leading-relaxed">
            {article.description}
          </p>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FFBA00] hover:underline w-fit pt-2"
        >
          Read Article
          <ExternalLink size={14} />
        </a>
      </div>
    </article>
  );
}