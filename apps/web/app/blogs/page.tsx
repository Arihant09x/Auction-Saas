"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { blogsApi, InternalBlogArticle } from "@/lib/api-client";
import { Navbar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Flame,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Tag,
  Layers,
} from "lucide-react";

export default function BlogListingPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);

  // Accordion state for sidebar filter tables
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isTagOpen, setIsTagOpen] = useState(true);

  const limit = 9;

  // Fetch blogs list
  const { data: blogsData, isLoading: isLoadingBlogs } = useQuery({
    queryKey: ["public-blogs", page, limit, search, selectedCategory, selectedTag, isFeaturedOnly],
    queryFn: () =>
      blogsApi.getBlogs({
        page,
        limit,
        search: search.trim() || undefined,
        category: selectedCategory || undefined,
        tag: selectedTag || undefined,
        featuredOnly: isFeaturedOnly ? true : undefined,
      }),
  });

  // Fetch featured article
  const { data: featuredData } = useQuery({
    queryKey: ["public-featured-blogs"],
    queryFn: () => blogsApi.getBlogs({ limit: 1, featuredOnly: true }),
  });

  // Fetch categories & tags
  const { data: categoriesResponse } = useQuery({
    queryKey: ["public-categories"],
    queryFn: () => blogsApi.getCategories(),
  });

  const { data: tagsResponse } = useQuery({
    queryKey: ["public-tags"],
    queryFn: () => blogsApi.getTags(),
  });

  const blogs = blogsData?.data?.items || [];
  const totalBlogs = blogsData?.data?.total || 0;
  const totalPages = blogsData?.data?.totalPages || 1;
  const featuredArticle = featuredData?.data?.items?.[0] || blogs[0];

  // Extract arrays from backend response safely to avoid TS errors
  const categoriesList = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : (categoriesResponse as any)?.data ?? [];

  const tagsList = Array.isArray(tagsResponse)
    ? tagsResponse
    : (tagsResponse as any)?.data ?? [];

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedTag(null);
    setIsFeaturedOnly(false);
    setPage(1);
  };

  return (
    <main className="relative bg-slate-50 min-h-screen font-sans overflow-clip">
      <Navbar />

      {/* Hero Accent Banner */}
      <div className="relative pt-28 pb-14 bg-gradient-to-b from-[#072460] to-[#0a307f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 font-['Poppins']">
              Articles & Insights
            </h1>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-2xl">
              Explore expertly curated articles on live sports auction tactics, real-time technology, tournament organization, and high-performance squad management.
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Featured Article Hero Banner */}
        {featuredArticle && page === 1 && !search && !selectedCategory && !selectedTag && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Link href={`/blogs/${featuredArticle.slug}`}>
              <div className="group relative rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 hover:shadow-xl transition-all duration-300">
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full overflow-hidden bg-slate-900">
                  <img
                    src={
                      featuredArticle.coverImage ||
                      featuredArticle.heroImage ||
                      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#ffba00] text-[#072460] font-black text-xs uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" /> Featured Story
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mb-3">
                      {featuredArticle.categories?.[0] && (
                        <span className="text-[#072460] font-bold uppercase tracking-wider">
                          {featuredArticle.categories[0].name}
                        </span>
                      )}
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {featuredArticle.readingTime} min read
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-[#072460] transition-colors mb-3 leading-snug font-['Poppins']">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                      {featuredArticle.excerpt || featuredArticle.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-900">By Auction11</p>
                      <p className="text-[11px] text-slate-400">
                        {featuredArticle.publishedAt
                          ? new Date(featuredArticle.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          : "Recently Published"}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#072460] group-hover:translate-x-1 transition-transform">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* 2-Column Sidebar + Blogs Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT SIDEBAR: Search & Filters (STICKY FIX APPLIED HERE) */}
          <aside className="lg:col-span-3 space-y-4 sticky top-24 self-start z-10">
            {/* 1. Search Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-sm">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-3.5 pr-9 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#072460] font-medium text-xs placeholder-slate-400"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* 2. Categories Filter Box */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#072460]" />
                  Topics
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${isCategoryOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isCategoryOpen && (
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="px-4 pb-3 space-y-1.5 max-h-56 overflow-y-auto overscroll-contain touch-pan-y border-t border-slate-100 pt-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400"
                >
                  {categoriesList.map((cat: any) => {
                    const isSelected = selectedCategory === cat.slug;
                    const count = cat.blogsCount ?? cat._count?.blogs ?? 0;
                    return (
                      <label
                        key={cat.id}
                        className="flex items-center justify-between text-xs text-slate-700 cursor-pointer py-1 px-1 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedCategory(isSelected ? null : cat.slug);
                              setSelectedTag(null);
                              setPage(1);
                            }}
                            className="w-3.5 h-3.5 rounded border-slate-300 text-[#072460] focus:ring-[#072460] cursor-pointer"
                          />
                          <span className={isSelected ? "font-bold text-[#072460]" : "font-medium"}>
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-semibold">{count}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Tags Filter Box */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setIsTagOpen(!isTagOpen)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#072460]" />
                  Tags
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${isTagOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isTagOpen && (
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="px-4 pb-3 space-y-1.5 max-h-56 overflow-y-auto overscroll-contain touch-pan-y border-t border-slate-100 pt-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400"
                >
                  {tagsList.map((t: any) => {
                    const isSelected = selectedTag === t.slug;
                    const count = t.blogsCount ?? t._count?.blogs ?? 0;
                    return (
                      <label
                        key={t.id}
                        className="flex items-center justify-between text-xs text-slate-700 cursor-pointer py-1 px-1 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedTag(isSelected ? null : t.slug);
                              setSelectedCategory(null);
                              setPage(1);
                            }}
                            className="w-3.5 h-3.5 rounded border-slate-300 text-[#072460] focus:ring-[#072460] cursor-pointer"
                          />
                          <span className={isSelected ? "font-bold text-[#072460]" : "font-medium"}>
                            {t.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-semibold">{count}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Featured Stories Toggle Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#ffba00]/20 rounded-lg text-[#072460]">
                  <Flame className="w-4 h-4 fill-[#ffba00] text-[#072460]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Featured Only</p>
                  <p className="text-[10px] text-slate-400">Show highlighted blogs</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isFeaturedOnly}
                onClick={() => {
                  setIsFeaturedOnly(!isFeaturedOnly);
                  setPage(1);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isFeaturedOnly ? "bg-[#072460]" : "bg-slate-200"
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isFeaturedOnly ? "translate-x-5" : "translate-x-0"
                    }`}
                />
              </button>
            </div>

            {/* 4. Results Counter & Reset Button Footer */}
            <div className="flex items-center justify-between pt-2 px-1">
              <span className="text-xs text-slate-500 font-medium">
                {blogs.length} out of {totalBlogs} results
              </span>
              {(search || selectedCategory || selectedTag || isFeaturedOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset filters
                </button>
              )}
            </div>
          </aside>

          {/* RIGHT SIDE CONTENT: 3-Column Blog Grid */}
          <div className="lg:col-span-9">
            {isLoadingBlogs ? (
              /* Skeleton Loader with 3 items per row */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse shadow-sm"
                  >
                    <div className="h-40 bg-slate-200 rounded-xl mb-4" />
                    <div className="h-3 w-1/3 bg-slate-200 rounded mb-3" />
                    <div className="h-5 w-5/6 bg-slate-200 rounded mb-2" />
                    <div className="h-3 w-full bg-slate-200 rounded mb-1" />
                    <div className="h-3 w-4/5 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              /* No Results Empty State */
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center flex flex-col items-center shadow-sm">
                <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="text-lg font-bold text-slate-800 mb-1 font-[#Poppins]">
                  No articles found
                </h4>
                <p className="text-xs text-slate-500 max-w-md mb-4">
                  We couldn't find any articles matching your search query or selected filter options.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#072460] text-white text-xs font-bold uppercase rounded-xl hover:bg-[#0a307f] transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Blog Grid - 3 items in each row */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

// Article Card Component
function ArticleCard({ article }: { article: InternalBlogArticle }) {
  const category = article.categories?.[0];
  const dateStr = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "Recently Published";

  return (
    <Link href={`/blogs/${article.slug}`}>
      <div className="group h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="relative h-44 w-full overflow-hidden bg-slate-900">
            <img
              src={
                article.coverImage ||
                article.thumbnailImage ||
                "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80"
              }
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {category && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#072460]/90 text-white font-bold text-[10px] uppercase rounded-md backdrop-blur-xs">
                {category.name}
              </span>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-2 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {article.readingTime} min read
              </span>
              <span>•</span>
              <span>{dateStr}</span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#072460] transition-colors mb-2 line-clamp-2 leading-snug font-['Poppins']">
              {article.title}
            </h3>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {article.excerpt || article.subtitle || article.content.replace(/#|\*|`/g, "").slice(0, 100)}
            </p>
          </div>
        </div>

        <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
          <span className="text-[11px] font-bold text-slate-400">By Auction11</span>
          <span className="text-xs font-bold text-[#072460] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Read <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}