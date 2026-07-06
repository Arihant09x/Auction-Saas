"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogsApi, BlogArticle } from "@/lib/api-client";
import { Calendar, ExternalLink, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

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

  if (isLoading) {
    return (
      <div 
        className="flex overflow-x-auto gap-4 sm:gap-6 w-full pb-8 scroll-smooth px-4 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        data-lenis-prevent
      >
        {Array.from({ length: limit }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl overflow-hidden border border-[#e0e7f5] flex flex-col h-full bg-white shadow-sm shrink-0 w-[290px] md:w-auto md:shrink"
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
    <div className="space-y-8 w-full">
      {/* Grid Layout with horizontal flex scroll on mobile */}
      <div 
        ref={gridRef} 
        className="flex overflow-x-auto gap-4 sm:gap-6 w-full pb-8 scroll-smooth px-4 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        data-lenis-prevent
      >
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
  return (
    <article
      className="blog-card rounded-2xl overflow-hidden border border-[#e0e7f5] flex flex-col h-full bg-white shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(1,41,114,0.15)] shrink-0 w-[290px] md:w-auto md:shrink group"
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