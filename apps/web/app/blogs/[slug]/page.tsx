"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogsApi, InternalBlogArticle } from "@/lib/api-client";
import { Navbar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  Tag,
  ThumbsUp,
  ChevronLeft,
  ArrowRight,
  List,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Newspaper,
  Info,
  X,
  CheckCircle,
} from "lucide-react";

// Dynamic import — BlockNote must not run on the server
const BlogRenderer = dynamic(
  () => import("@/components/BlogRenderer").then((m) => m.BlogRenderer),
  { ssr: false }
);

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function SingleBlogPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const slug = params?.slug as string;

  const [readProgress, setReadProgress] = useState(0);
  const [activeTocId, setActiveTocId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const articleRef = useRef<HTMLDivElement | null>(null);
  const mainContentRef = useRef<HTMLDivElement | null>(null);

  // Fetch single blog article
  const { data: blog, isLoading, error } = useQuery({
    queryKey: ["public-blog-article", slug],
    queryFn: () => blogsApi.getBlogBySlug(slug),
    select: (response: any) => (response.data || response) as InternalBlogArticle,
    enabled: !!slug,
  });

  // Record view on mount
  useEffect(() => {
    if (blog?.id) {
      blogsApi.recordView(blog.id).catch(() => null);
    }
  }, [blog?.id]);

  // Initialize like state from blog data
  useEffect(() => {
    if (blog?.id) {
      const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
      setIsLiked(likedBlogs.includes(blog.id));
    }
  }, [blog?.id]);

  // Track Reading Progress Bar & TOC Highlight
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadProgress(progress);
      }

      if (!articleRef.current) return;
      const headingElements = Array.from(
        articleRef.current.querySelectorAll<HTMLElement>("h1[id], h2[id], h3[id]")
      );

      const NAV_OFFSET = 150;
      let current: string | null = null;
      for (const el of headingElements) {
        if (el.getBoundingClientRect().top <= NAV_OFFSET) {
          current = el.id;
        } else {
          break;
        }
      }
      setActiveTocId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    const delayedCheck = window.setTimeout(handleScroll, 800);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(delayedCheck);
    };
  }, []);

  // Smooth-scroll TOC navigation
  const handleTocClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    event.preventDefault();

    let target = document.getElementById(id) as HTMLElement | null;

    if (!target && articleRef.current) {
      const headings = articleRef.current.querySelectorAll<HTMLElement>(
        "h1, h2, h3"
      );
      for (const el of Array.from(headings)) {
        const text = (el.textContent || "").trim();
        const slug = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        if (slug === id) {
          target = el;
          break;
        }
      }
    }

    if (target) {
      const navbarOffset = 120;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      window.history.replaceState(null, "", `#${id}`);
      setActiveTocId(id);

      if (!target.id) {
        target.id = id;
      }
    }
  };

  // Fetch related articles
  const categorySlug = blog?.categories?.[0]?.slug;
  const { data: relatedData } = useQuery({
    queryKey: ["public-related-blogs", categorySlug, blog?.id],
    queryFn: () => blogsApi.getBlogs({ category: categorySlug, limit: 3 }),
    enabled: !!categorySlug,
  });

  const relatedArticles = useMemo(() => {
    if (!relatedData?.data?.items) return [];
    return relatedData.data.items.filter((item) => item.id !== blog?.id).slice(0, 3);
  }, [relatedData, blog?.id]);

  // Featured articles for the right sidebar
  const { data: featuredData } = useQuery({
    queryKey: ["public-featured-blogs"],
    queryFn: () => blogsApi.getBlogs({ featuredOnly: true, limit: 4 }),
  });

  const featuredArticles = useMemo(() => {
    const items = featuredData?.data?.items ?? [];
    const featured = items.filter((item) => item.id !== blog?.id).slice(0, 4);
    return featured.length > 0 ? featured : relatedArticles;
  }, [featuredData, relatedArticles, blog?.id]);

  // Recent blogs strip below the article
  const { data: recentData } = useQuery({
    queryKey: ["public-recent-blogs"],
    queryFn: () => blogsApi.getBlogs({ limit: 5 }),
  });

  const recentBlogs = useMemo(() => {
    const items = recentData?.data?.items ?? [];
    return items.filter((item) => item.id !== blog?.id).slice(0, 4);
  }, [recentData, blog?.id]);

  // Like Mutation
  const likeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await blogsApi.recordLike(id);
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["public-blog-article", slug], (prev: any) => {
        if (!prev) return prev;
        return { ...prev, likesCount: res.likesCount };
      });

      setIsLiked(true);

      const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
      if (blog?.id && !likedBlogs.includes(blog.id)) {
        likedBlogs.push(blog.id);
        localStorage.setItem("likedBlogs", JSON.stringify(likedBlogs));
      }
    },
    onError: () => {
      setIsLiked(false);
    },
  });

  const handleLikeClick = () => {
    if (isLiked || !blog?.id) return;
    setIsLiked(true);
    likeMutation.mutate(blog.id);
  };

  // Extract TOC items
  const tocItems: TocItem[] = useMemo(() => {
    const blockContent = (blog as any)?.blockContent;

    if (Array.isArray(blockContent) && blockContent.length > 0) {
      return blockContent
        .filter((b: any) => b?.type === "heading")
        .map((b: any) => {
          const text = Array.isArray(b.content)
            ? b.content.map((c: any) => c?.text || "").join("").trim()
            : "";
          const level =
            typeof b?.props?.level === "number" ? b.props.level : 2;
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
          return { id, text, level };
        })
        .filter((item: TocItem) => item.text.length > 0);
    }

    if (!blog?.content) return [];
    const lines = blog.content.split("\n");
    const items: TocItem[] = [];

    lines.forEach((line) => {
      const h2Match = line.match(/^##\s+(.+)/);
      const h3Match = line.match(/^###\s+(.+)/);

      if (h2Match) {
        const text = h2Match[1]!.replace(/[*_~`]/g, "").trim();
        const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        items.push({ id, text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1]!.replace(/[*_~`]/g, "").trim();
        const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        items.push({ id, text, level: 3 });
      }
    });

    return items;
  }, [blog]);

  // Ensure BlockNote-rendered headings carry anchor ids
  useEffect(() => {
    if (!blog?.id || tocItems.length === 0) return;
    const container = articleRef.current;
    if (!container) return;

    const assignIds = () => {
      let matched = 0;
      const headings = container.querySelectorAll<HTMLElement>("h1, h2, h3");
      headings.forEach((el) => {
        const text = (el.textContent || "").trim();
        const slug = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        if (tocItems.some((t) => t.id === slug)) {
          matched += 1;
          if (el.id !== slug) {
            el.id = slug;
          }
        }
        el.style.scrollMarginTop = "120px";
      });
      return matched;
    };

    assignIds();

    const observer = new MutationObserver(() => {
      if (assignIds() >= tocItems.length) {
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    const stop = window.setTimeout(() => observer.disconnect(), 10000);

    return () => {
      observer.disconnect();
      window.clearTimeout(stop);
    };
  }, [blog?.id, tocItems]);

  const publishDateStr = blog?.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "Recently Published";

  if (isLoading) {
    return (
      <main className="bg-slate-50 min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-32 pb-24 space-y-6 animate-pulse">
          <div className="h-10 bg-slate-200 rounded-xl w-3/4" />
          <div className="h-6 bg-slate-200 rounded-xl w-1/2" />
          <div className="h-96 bg-slate-200 rounded-3xl" />
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="bg-slate-50 min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 pt-40 pb-24 text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2 font-['Poppins']">Article Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">
            The article you are looking for does not exist or may have been moved.
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#072460] text-white text-xs font-bold uppercase rounded-xl hover:bg-[#0a307f] transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Articles
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const hasCoverImage = Boolean(blog.coverImage || blog.heroImage);

  return (
    <main className="relative bg-white min-h-screen font-sans">
      <Navbar />

      {/* Floating Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#072460] to-[#ffba00] transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* JSON-LD Schema Script */}
      {blog.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blog.jsonLd) }}
        />
      )}

      {/* ── Hero Band - COMPACT VERSION */}
      <div className="pt-24 pb-12 bg-[#072460] text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#ffba00]/10 blur-3xl" />
        <div aria-hidden className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ffba00] hover:underline transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Articles
          </Link>
        </div>
      </div>

      {/* ── Cover Image */}
      {hasCoverImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center max-w-5xl mx-auto px-4 -mt-10 sm:-mt-12 relative z-20"
        >
          <div className="flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-video max-h-[500px] w-full">
            <img
              src={blog.coverImage || blog.heroImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      )}

      {/* ── Title, Subtitle & Metadata */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className={`max-w-3xl mx-auto px-4 ${hasCoverImage ? "mt-6" : "-mt-2"} text-center`}
      >
        {blog.categories?.[0] && (
          <span className="inline-block px-3 py-1 bg-[#ffba00] text-[#072460] font-extrabold uppercase rounded-lg text-[10px] tracking-wider mb-4">
            {blog.categories[0].name}
          </span>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-black font-['Poppins'] tracking-tight leading-tight text-slate-900 mb-3 px-2">
          {blog.title}
        </h1>

        {blog.subtitle && (
          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-medium mb-5 px-2">
            {blog.subtitle}
          </p>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 px-2">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#072460]" /> {publishDateStr}
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#072460]" /> {blog.readingTime} min read
          </span>
          <span className="text-slate-300">•</span>
          <button
            onClick={handleLikeClick}
            disabled={isLiked || likeMutation.isPending}
            title={isLiked ? "You liked this article" : "Like Article"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm transition-all cursor-pointer ${isLiked
              ? "bg-[#072460] border-[#072460] text-white"
              : "bg-white border-slate-200 hover:border-[#072460] hover:text-[#072460] text-slate-600"
              }`}
          >
            <ThumbsUp
              className={`w-3.5 h-3.5 ${isLiked ? "text-[#ffba00]" : "text-[#ffba00]"
                }`}
            />
            {isLiked ? "Liked" : blog.likesCount}
          </button>
        </div>
      </motion.div>

      {/* ── Content Body Grid: TOC (left) | Article (center) | Featured (right) */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_280px] gap-4">

          {/* Left Sidebar: Table of Contents */}
          <aside className="hidden lg:block relative lg:col-start-1 lg:row-start-1">
            <div className="sticky top-[120px] max-h-[calc(100vh-140px)]">
              {tocItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
                >
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <List className="w-3.5 h-3.5 text-[#072460]" /> On this page
                  </h4>

                  <nav className="space-y-1.5 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {tocItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => handleTocClick(e, item.id)}
                        className={`block text-[11px] font-medium transition-all ${item.level === 3 ? "pl-2.5 text-slate-500" : ""
                          } ${item.level === 1 ? "font-bold text-slate-800" : ""
                          } ${activeTocId === item.id
                            ? "!text-[#072460] font-extrabold translate-x-1"
                            : "hover:text-slate-900"
                          }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </motion.div>
              )}
            </div>
          </aside>

          {/* Center Article Content */}
          <div ref={mainContentRef} className="min-w-0 lg:col-start-2 lg:row-start-1">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 border border-slate-100 shadow-sm"
            >
              <div ref={articleRef} className="prose prose-slate max-w-none">
                {Array.isArray((blog as any).blockContent) &&
                  (blog as any).blockContent.length > 0 ? (
                  <BlogRenderer blockContent={(blog as any).blockContent} />
                ) : (
                  <article className="prose prose-slate max-w-none prose-headings:font-['Poppins'] prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-[#072460] prose-a:font-bold prose-code:text-amber-800 prose-code:bg-amber-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100">
                    <MarkdownRenderer content={blog.content || ""} />
                  </article>
                )}
              </div>

              {/* Tags Cloud Footer */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> Tags:
                  </span>
                  {blog.tags.map((t) => (
                    <Link
                      key={t.id}
                      href={`/blogs?tag=${t.slug}`}
                      className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
                    >
                      #{t.name}
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Below-article content */}
          <div className="min-w-0 lg:col-start-2 lg:row-start-2">
            {/* Author Bio Box */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-8 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex items-start gap-4"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#072460] text-[#ffba00] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 font-['Poppins']">
                  Written by Admin
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Specialized in sports event engineering, player auction logistics, and real-time live scoring architecture.
                </p>
              </div>
            </motion.div>

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-14"
              >
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Poppins'] mb-6">
                  Related Articles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {relatedArticles.map((rel) => (
                    <Link key={rel.id} href={`/blogs/${rel.slug}`}>
                      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
                        <div>
                          <div className="h-28 sm:h-32 rounded-xl bg-slate-900 overflow-hidden mb-3">
                            <img
                              src={
                                rel.coverImage ||
                                rel.thumbnailImage ||
                                "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80"
                              }
                              alt={rel.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1 leading-snug">
                            {rel.title}
                          </h5>
                        </div>
                        <span className="text-[11px] font-bold text-[#072460] mt-3 inline-flex items-center gap-1">
                          Read Story <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Blogs Section */}
            {recentBlogs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-14"
              >
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Poppins'] mb-6 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-[#072460]" /> Recent Blogs
                </h3>
                <div className="flex gap-6 overflow-x-auto pb-4 snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
                  {recentBlogs.map((recent, idx) => (
                    <motion.div
                      key={recent.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      className="min-w-[260px] sm:min-w-[280px] snap-start shrink-0 lg:min-w-0 group"
                    >
                      <Link href={`/blogs/${recent.slug}`} className="block h-full">
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all h-full">
                          <div className="h-36 bg-slate-900 overflow-hidden">
                            <img
                              src={
                                recent.coverImage ||
                                recent.thumbnailImage ||
                                "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80"
                              }
                              alt={recent.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4">
                            <h5 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#072460] transition-colors">
                              {recent.title}
                            </h5>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar: Featured Articles + Get Started */}
          <aside className="hidden lg:block relative lg:col-start-3 lg:row-start-1">
            <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto space-y-6 pr-1">
              {/* Featured Articles */}
              {featuredArticles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
                >
                  <h3 className="text-[11px] font-bold text-slate-900 font-['Poppins'] mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ffba00]" /> Featured
                  </h3>
                  <div className="space-y-3">
                    {featuredArticles.map((feat) => (
                      <Link
                        key={feat.id}
                        href={`/blogs/${feat.slug}`}
                        className="group block"
                      >
                        <div className="flex gap-2.5 items-start">
                          <div className="w-16 h-16 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                            <img
                              src={
                                feat.coverImage ||
                                feat.thumbnailImage ||
                                "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=200&q=80"
                              }
                              alt={feat.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[11px] font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#072460] transition-colors">
                              {feat.title}
                            </h5>
                            <span className="mt-1 text-[10px] font-bold text-[#072460] inline-flex items-center gap-1">
                              Read <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Get Started Card */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-[#072460] via-[#0a307f] to-[#072460] rounded-2xl p-5 shadow-lg text-white relative overflow-hidden group"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#ffba00]/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/5 blur-xl" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold font-['Poppins'] mb-1">
                        Get Started
                      </h3>
                      <p className="text-[11px] text-white/80 leading-relaxed">
                        Start your journey today
                      </p>
                    </div>
                    <button
                      onClick={() => setShowInfoDialog(true)}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
                      title="More Info"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button className="w-full py-2.5 bg-[#ffba00] hover:bg-[#ffc933] text-[#072460] font-bold uppercase text-[10px] rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                    Start Now
                  </button>
                </div>
              </motion.div>
            </div>
          </aside>
        </div>
      </div>

      {/* Info Dialog */}
      <AnimatePresence>
        {showInfoDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoDialog(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#072460]/5 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-[#ffba00]/10 blur-2xl" />

                <button
                  onClick={() => setShowInfoDialog(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center mb-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#072460] to-[#0a307f] flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="w-8 h-8 text-[#ffba00]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Poppins'] mb-2">
                    Welcome Aboard!
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Get access to exclusive content, expert insights, and the latest updates in sports technology.
                  </p>
                </div>

                <div className="space-y-2.5 mb-6 relative z-10">
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#072460]/5 to-transparent rounded-xl border border-[#072460]/10">
                    <div className="w-5 h-5 rounded-full bg-[#072460] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Expert Content</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        In-depth articles from industry professionals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#072460]/5 to-transparent rounded-xl border border-[#072460]/10">
                    <div className="w-5 h-5 rounded-full bg-[#072460] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Real-time Updates</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Latest sports tech developments
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#072460]/5 to-transparent rounded-xl border border-[#072460]/10">
                    <div className="w-5 h-5 rounded-full bg-[#072460] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Community Access</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Network of sports tech enthusiasts
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowInfoDialog(false)}
                  className="w-full py-3 bg-gradient-to-r from-[#072460] to-[#0a307f] hover:from-[#0a307f] hover:to-[#072460] text-white font-bold uppercase text-xs rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  Got It!
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

// Markdown Renderer Component - RESPONSIVE VERSION
function MarkdownRenderer({ content }: { content: string }) {
  const paragraphs = (content || "").split("\n\n");

  return (
    <div className="space-y-4">
      {paragraphs.map((p, idx) => {
        const trimmed = p.trim();

        // H1 Heading
        if (trimmed.startsWith("# ")) {
          const text = trimmed.slice(2).trim();
          const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
          return (
            <h1
              key={idx}
              id={id}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mt-8 mb-4 px-2"
            >
              {text}
            </h1>
          );
        }

        // H2 Heading
        if (trimmed.startsWith("## ")) {
          const text = trimmed.slice(3).trim();
          const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
          return (
            <h2
              key={idx}
              id={id}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2 px-2"
            >
              {text}
            </h2>
          );
        }

        // H3 Heading
        if (trimmed.startsWith("### ")) {
          const text = trimmed.slice(4).trim();
          const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
          return (
            <h3
              key={idx}
              id={id}
              className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mt-6 mb-3 px-2"
            >
              {text}
            </h3>
          );
        }

        // Blockquotes / Callouts
        if (trimmed.startsWith("> ")) {
          const quoteText = trimmed.slice(2).trim();
          return (
            <blockquote
              key={idx}
              className="my-6 p-4 sm:p-5 bg-[#072460]/5 border-l-4 border-[#072460] rounded-r-2xl italic text-slate-800 text-sm sm:text-base leading-relaxed px-4"
            >
              {quoteText}
            </blockquote>
          );
        }

        // Code Blocks
        if (trimmed.startsWith("\`\`\`")) {
          const lines = trimmed.split("\n");
          const code = lines.slice(1, -1).join("\n");
          return (
            <div
              key={idx}
              className="my-6 rounded-2xl overflow-hidden bg-slate-900 text-slate-100 text-xs sm:text-sm font-mono p-4 sm:p-5 shadow-md mx-2"
            >
              <pre className="overflow-x-auto">
                <code className="whitespace-pre">{code}</code>
              </pre>
            </div>
          );
        }

        // Tables - Responsive with horizontal scroll container
        if (trimmed.includes("|") && trimmed.split("\n").some(line => line.includes("|"))) {
          const tableRows = trimmed.split("\n").filter(row => row.trim());
          return (
            <div key={idx} className="my-6 overflow-x-auto mx-2">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#072460]/5">
                    {tableRows[0]!.split("|").filter(cell => cell.trim()).map((cell, i) => (
                      <th
                        key={i}
                        className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-slate-900 border-b-2 border-[#072460] whitespace-nowrap"
                      >
                        {cell.trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.slice(2).map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      {row.split("|").filter(cell => cell.trim()).map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 border-b border-slate-200 whitespace-nowrap"
                        >
                          {cell.trim()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Standard Paragraph - Responsive
        return (
          <p
            key={idx}
            className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4 px-2 sm:px-0"
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}