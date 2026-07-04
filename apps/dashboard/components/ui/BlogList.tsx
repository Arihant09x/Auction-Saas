"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogsApi, BlogArticle } from "../../lib/api-client";
import { Calendar, ExternalLink, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

// Premium Safe Image Component with fallback to handle 404/broken links
interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
}

export function SafeImage({ src, alt, className, fill }: SafeImageProps) {
  const fallbackImage = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&auto=format&fit=crop"; // Premium cricket stadium image
  const [imgSrc, setImgSrc] = useState(src || fallbackImage);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        setImgSrc(fallbackImage);
      }}
      style={fill ? { position: "absolute", height: "100%", width: "100%", left: 0, top: 0, objectFit: "cover" } : undefined}
    />
  );
}

interface BlogListProps {
  limit?: number;
}

export function BlogList({ limit = 6 }: BlogListProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cricket-blogs-dashboard", page, limit],
    queryFn: () => blogsApi.getBlogs(page, limit),
    staleTime: 60000, // 1 minute stale time
  });

  const blogs = Array.isArray(data?.data?.data) ? data.data.data : [];
  const meta = data?.data?.meta ?? { total: 0, page: 1, limit };
  const totalPages = Math.ceil(meta.total / limit);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {Array.from({ length: limit }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-full bg-white shadow-sm"
          >
            <div className="h-44 w-full bg-gray-100" />
            <div className="p-5 flex-1 space-y-3">
              <div className="h-4 w-1/3 bg-gray-150 rounded" />
              <div className="h-6 w-5/6 bg-gray-200 rounded" />
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
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-gray-200 bg-gray-50/50">
        <BookOpen className="w-12 h-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-bold text-gray-800 mb-1">No recent news available</h3>
        <p className="text-sm text-gray-500">Check back later for up-to-date cricket news.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((article: BlogArticle) => (
          <article
            key={article.id}
            className="group rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-full bg-white shadow-sm hover:border-[#0C3278]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Image Container */}
            <div className="h-44 w-full relative overflow-hidden bg-gray-100">
              <SafeImage
                src={article.imageUrl}
                alt={article.title}
                fill={true}
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* Category Tag */}
              <div className="absolute top-4 left-4 bg-[#0C3278] text-white text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full">
                Cricket Gazette
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                {/* Date */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <Calendar size={13} />
                  <span>
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                      : "Recently"
                    }
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#0C3278] transition-colors duration-200 line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                  {article.description}
                </p>
              </div>

              {/* Action Button */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0C3278] group-hover:underline w-fit pt-2"
              >
                Read Article
                <ExternalLink size={12} />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-150 pt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={14} />
            Previous
          </button>

          <span className="text-xs font-semibold text-gray-500">
            Page <span className="text-gray-900 font-bold">{page}</span> of <span className="text-gray-900 font-bold">{totalPages}</span>
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full border border-[#0C3278] text-white bg-[#0C3278] hover:bg-[#002a6e] transition-all duration-200 disabled:opacity-40 disabled:hover:bg-[#0C3278] disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            Next
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
