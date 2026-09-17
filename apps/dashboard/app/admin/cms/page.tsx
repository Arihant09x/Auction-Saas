"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useAuthStore } from "../../../store/auth.store";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Eye,
  Copy,
  Sparkles,
  Image as ImageIcon,
  Tag as TagIcon,
  Layers,
  TrendingUp,
  Flame,
  Check,
  AlertCircle,
  X,
  Upload,
  Calendar,
  BarChart3,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adminBlogsApi,
  AdminBlogArticle,
  AdminCategory,
  AdminTag,
  MediaItem,
} from "../../../lib/admin-blogs-api";
import { uploadImage } from "@/app/actions/cloudinary";

const BlogEditor = dynamic(() => import("@/components/BlogEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[420px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="w-8 h-8 border-4 border-[#072460] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold">Loading editor...</span>
      </div>
    </div>
  ),
});

const BlogRenderer = dynamic(
  () => import("@/components/BlogRenderer").then((mod) => mod.BlogRenderer),
  { ssr: false }
);

type ActiveTab = "dashboard" | "articles" | "editor" | "categories-tags" | "media" | "contact";
type EditorMode = "edit" | "split" | "preview";

export default function AdminCmsPage() {
  const { firebaseToken, user } = useAuthStore();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<ActiveTab>("articles");
  const [articleSearch, setArticleSearch] = useState("");
  const [articleStatusFilter, setArticleStatusFilter] = useState<string>("ALL");
  const [articlePage, setArticlePage] = useState(1);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Row‑level loading indicators
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  // Editor Form State
  const [editorTitle, setEditorTitle] = useState("");
  const [editorSubtitle, setEditorSubtitle] = useState("");
  const [editorExcerpt, setEditorExcerpt] = useState("");
  const [editorSlug, setEditorSlug] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editorBlockContent, setEditorBlockContent] = useState<any[] | null>(null);
  const [editorStatus, setEditorStatus] = useState<"DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED">("DRAFT");
  const [editorCoverImage, setEditorCoverImage] = useState("");
  const [editorScheduledAt, setEditorScheduledAt] = useState("");
  const [editorIsFeatured, setEditorIsFeatured] = useState(false);
  const [editorIsTrending, setEditorIsTrending] = useState(false);
  const [editorAllowComments, setEditorAllowComments] = useState(true);
  const [editorCategoryIds, setEditorCategoryIds] = useState<string[]>([]);
  const [editorTagNames, setEditorTagNames] = useState("");
  const [editorMetaTitle, setEditorMetaTitle] = useState("");
  const [editorMetaDescription, setEditorMetaDescription] = useState("");
  const [editorKeywords, setEditorKeywords] = useState("");
  const [editorCanonicalUrl, setEditorCanonicalUrl] = useState("");
  const [editorCategoryNames, setEditorCategoryNames] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [mediaSearch, setMediaSearch] = useState("");
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);

  const [editorMode, setEditorMode] = useState<EditorMode>("edit");
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiAudience, setAiAudience] = useState("");
  const [aiTone, setAiTone] = useState("Engaging and Informative");
  const [previewArticle, setPreviewArticle] = useState<AdminBlogArticle | null>(null);
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatColor, setNewCatColor] = useState("#072460");
  const [newTagName, setNewTagName] = useState("");
  const [mediaUploadAlt, setMediaUploadAlt] = useState("");
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // ─── Queries ────────────────────────────────────────────────────────────────

  const { data: analytics } = useQuery({
    queryKey: ["admin-blogs-analytics"],
    queryFn: () => adminBlogsApi.getAnalytics(firebaseToken!),
    enabled: !!firebaseToken && activeTab === "dashboard",
  });

  const { data: blogsData, isLoading: isLoadingBlogs } = useQuery({
    queryKey: ["admin-blogs", articlePage, articleSearch, articleStatusFilter],
    queryFn: () =>
      adminBlogsApi.getAdminBlogs(firebaseToken!, {
        page: articlePage,
        limit: 10,
        search: articleSearch.trim() || undefined,
        status: articleStatusFilter !== "ALL" ? articleStatusFilter : undefined,
      }),
    enabled: !!firebaseToken,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => adminBlogsApi.getCategories(),
    enabled: !!firebaseToken,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["admin-tags"],
    queryFn: () => adminBlogsApi.getTags(),
    enabled: !!firebaseToken,
  });

  const { data: mediaData, isLoading: isLoadingMedia } = useQuery({
    queryKey: ["admin-media"],
    queryFn: () => adminBlogsApi.getMediaList(firebaseToken!),
    enabled: !!firebaseToken && activeTab === "media",
  });

  const { data: contactMessages, isLoading: isLoadingContact } = useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/contact`,
        { headers: { Authorization: `Bearer ${firebaseToken}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!firebaseToken && activeTab === "contact",
  });

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const saveBlogMutation = useMutation({
    mutationFn: async () => {
      if (!editorTitle.trim()) throw new Error("Title is required");
      if (!editorContent.trim() && (!editorBlockContent || editorBlockContent.length === 0)) {
        throw new Error("Content is required");
      }

      const tagNamesList = editorTagNames
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: editorTitle,
        subtitle: editorSubtitle || undefined,
        excerpt: editorExcerpt || undefined,
        slug: editorSlug || undefined,
        content: editorContent,
        blockContent: editorBlockContent?.length ? editorBlockContent : undefined,
        status: editorStatus,
        coverImage: editorCoverImage || undefined,
        scheduledAt: editorScheduledAt ? new Date(editorScheduledAt).toISOString() : undefined,
        isFeatured: editorIsFeatured,
        isTrending: editorIsTrending,
        allowComments: editorAllowComments,
        categoryIds: editorCategoryIds,
        tagNames: tagNamesList,
        metaTitle: editorMetaTitle || editorTitle,
        metaDescription: editorMetaDescription || editorExcerpt,
        keywords: editorKeywords || undefined,
        canonicalUrl: editorCanonicalUrl || undefined,
      };

      return editingArticleId
        ? adminBlogsApi.updateBlog(firebaseToken!, editingArticleId, payload)
        : adminBlogsApi.createBlog(firebaseToken!, payload);
    },
    onMutate: () => {
      toast.loading(editingArticleId ? "Updating article..." : "Creating article...", {
        id: "save-blog",
      });
    },
    onSuccess: (saved) => {
      toast.dismiss("save-blog");
      toast.success(
        editingArticleId ? "Article updated successfully!" : "Article created successfully!"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      setEditingArticleId(saved.id);
    },
    onError: (err: any) => {
      toast.dismiss("save-blog");
      toast.error(err.message || "Failed to save article");
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: (id: string) => adminBlogsApi.deleteBlog(firebaseToken!, id),
    onMutate: () => {
      toast.loading("Deleting article...", { id: "delete-blog" });
    },
    onSuccess: () => {
      toast.dismiss("delete-blog");
      toast.success("Article deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
    onError: (err: any) => {
      toast.dismiss("delete-blog");
      toast.error(err.message || "Failed to delete article");
    },
  });

  const duplicateBlogMutation = useMutation({
    mutationFn: (id: string) => adminBlogsApi.duplicateBlog(firebaseToken!, id),
    onMutate: () => {
      toast.loading("Duplicating article...", { id: "duplicate-blog" });
    },
    onSuccess: () => {
      toast.dismiss("duplicate-blog");
      toast.success("Article duplicated as draft");
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
    onError: (err: any) => {
      toast.dismiss("duplicate-blog");
      toast.error(err.message || "Failed to duplicate article");
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) =>
      adminBlogsApi.bulkUpdateStatus(firebaseToken!, ids, status),
    onMutate: ({ status }) => {
      toast.loading(`Updating ${selectedArticleIds.length} articles to ${status}...`, {
        id: "bulk-status",
      });
    },
    onSuccess: () => {
      toast.dismiss("bulk-status");
      toast.success("Bulk status updated successfully!");
      setSelectedArticleIds([]);
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
    onError: (err: any) => {
      toast.dismiss("bulk-status");
      toast.error(err.message || "Failed to update statuses");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => adminBlogsApi.bulkDelete(firebaseToken!, ids),
    onMutate: (ids) => {
      toast.loading(`Deleting ${ids.length} articles...`, { id: "bulk-delete" });
    },
    onSuccess: () => {
      toast.dismiss("bulk-delete");
      toast.success("Selected articles deleted!");
      setSelectedArticleIds([]);
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
    onError: (err: any) => {
      toast.dismiss("bulk-delete");
      toast.error(err.message || "Failed to delete articles");
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: any) => adminBlogsApi.createCategory(firebaseToken!, data),
    onMutate: () => {
      toast.loading("Creating category...", { id: "create-cat" });
    },
    onSuccess: () => {
      toast.dismiss("create-cat");
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setNewCatName("");
      setNewCatSlug("");
      setNewCatDesc("");
    },
    onError: (err: any) => {
      toast.dismiss("create-cat");
      toast.error(err.message || "Failed to create category");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => adminBlogsApi.deleteCategory(firebaseToken!, id),
    onMutate: () => {
      toast.loading("Deleting category...", { id: "delete-cat" });
    },
    onSuccess: () => {
      toast.dismiss("delete-cat");
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (err: any) => {
      toast.dismiss("delete-cat");
      toast.error(err.message || "Failed to delete category");
    },
  });

  const createTagMutation = useMutation({
    mutationFn: (data: any) => adminBlogsApi.createTag(firebaseToken!, data),
    onMutate: () => {
      toast.loading("Creating tag...", { id: "create-tag" });
    },
    onSuccess: () => {
      toast.dismiss("create-tag");
      toast.success("Tag created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      setNewTagName("");
    },
    onError: (err: any) => {
      toast.dismiss("create-tag");
      toast.error(err.message || "Failed to create tag");
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => adminBlogsApi.deleteTag(firebaseToken!, id),
    onMutate: () => {
      toast.loading("Deleting tag...", { id: "delete-tag" });
    },
    onSuccess: () => {
      toast.dismiss("delete-tag");
      toast.success("Tag deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
    },
    onError: (err: any) => {
      toast.dismiss("delete-tag");
      toast.error(err.message || "Failed to delete tag");
    },
  });

  const aiDraftMutation = useMutation({
    mutationFn: (dto: any) => adminBlogsApi.generateAiDraft(firebaseToken!, dto),
    onMutate: () => {
      toast.loading("AI is generating your draft... This may take 15-30 seconds.", {
        id: "ai-draft",
        duration: Infinity,
      });
    },
    onSuccess: (data) => {
      toast.dismiss("ai-draft");
      setEditorTitle(data.title);
      setEditorContent(data.content);
      setEditorKeywords(data.suggestedKeywords || "");
      setShowAiModal(false);
      toast.success("AI draft loaded into editor!");
      setActiveTab("editor");
    },
    onError: (err: any) => {
      toast.dismiss("ai-draft");
      toast.error(err.message || "AI generation failed. Please try again.");
    },
  });

  const aiSeoMutation = useMutation({
    mutationFn: (dto: { title: string; content: string }) =>
      adminBlogsApi.suggestSeo(firebaseToken!, dto),
    onMutate: () => {
      toast.loading("AI is analyzing SEO... Please wait.", {
        id: "ai-seo",
        duration: Infinity,
      });
    },
    onSuccess: (data) => {
      toast.dismiss("ai-seo");
      setEditorMetaTitle(data.metaTitle);
      setEditorMetaDescription(data.metaDescription);
      setEditorKeywords(data.keywords);
      toast.success("AI SEO recommendations applied!");
    },
    onError: (err: any) => {
      toast.dismiss("ai-seo");
      toast.error(err.message || "AI SEO analysis failed");
    },
  });

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    toast.loading("Uploading cover image...", { id: "upload-cover" });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadImage(formData);
      setEditorCoverImage(url);
      toast.dismiss("upload-cover");
      toast.success("Cover image uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    } catch (err: any) {
      toast.dismiss("upload-cover");
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleMediaLibraryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    toast.loading("Uploading image to library...", { id: "upload-media" });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const secureUrl = await uploadImage(formData);

      await adminBlogsApi.uploadMedia(
        firebaseToken!,
        secureUrl,
        mediaUploadAlt || file.name
      );

      toast.dismiss("upload-media");
      toast.success("Image added to library!");
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      setMediaUploadAlt("");
      e.target.value = "";
    } catch (err: any) {
      toast.dismiss("upload-media");
      console.error("Media upload error:", err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm("Delete this image permanently?")) return;

    setDeletingMediaId(id);
    toast.loading("Deleting image...", { id: "delete-media" });
    try {
      await adminBlogsApi.deleteMedia(firebaseToken!, id);
      toast.dismiss("delete-media");
      toast.success("Image deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    } catch (err: any) {
      toast.dismiss("delete-media");
      console.error("Delete media error:", err);
      toast.error(err.message || "Failed to delete image");
    } finally {
      setDeletingMediaId(null);
    }
  };

  const handleEditArticle = (article: AdminBlogArticle) => {
    setEditingArticleId(article.id);
    setEditorTitle(article.title || "");
    setEditorSubtitle(article.subtitle || "");
    setEditorExcerpt(article.excerpt || "");
    setEditorSlug(article.slug || "");
    setEditorContent(article.content || "");
    setEditorBlockContent(
      Array.isArray((article as any).blockContent) && (article as any).blockContent.length > 0
        ? (article as any).blockContent
        : null
    );
    setEditorStatus(article.status || "DRAFT");
    setEditorCoverImage(article.coverImage || "");
    setEditorScheduledAt(
      article.scheduledAt ? new Date(article.scheduledAt).toISOString().slice(0, 16) : ""
    );
    setEditorIsFeatured(article.isFeatured || false);
    setEditorIsTrending(article.isTrending || false);
    setEditorAllowComments(article.allowComments ?? true);
    setEditorCategoryIds(article.categories?.map((c) => c.id) || []);
    setEditorTagNames(article.tags?.map((t) => t.name).join(", ") || "");
    setEditorMetaTitle(article.seo?.metaTitle || article.title || "");
    setEditorMetaDescription(article.seo?.metaDescription || article.excerpt || "");
    setEditorKeywords(article.seo?.keywords || "");
    setEditorCanonicalUrl(article.seo?.canonicalUrl || "");
    setEditorCategoryNames(article.categories?.map((c) => c.name).join(", ") || "");
    setActiveTab("editor");
  };

  const handleCreateNewArticle = () => {
    setEditingArticleId(null);
    setEditorTitle("");
    setEditorSubtitle("");
    setEditorExcerpt("");
    setEditorSlug("");
    setEditorContent("");
    setEditorBlockContent(null);
    setEditorStatus("DRAFT");
    setEditorCoverImage("");
    setEditorScheduledAt("");
    setEditorIsFeatured(false);
    setEditorIsTrending(false);
    setEditorAllowComments(true);
    setEditorCategoryIds([]);
    setEditorTagNames("");
    setEditorMetaTitle("");
    setEditorMetaDescription("");
    setEditorKeywords("");
    setEditorCanonicalUrl("");
    setEditorCategoryNames("");
    setEditorMode("edit");
    setActiveTab("editor");
  };

  const extractPlainTextFromBlocks = (blocks: any[]): string => {
    if (!blocks) return "";
    let text = "";
    const traverse = (node: any) => {
      if (node.type === "text" && node.text) text += node.text + " ";
      if (node.children) node.children.forEach(traverse);
      if (node.content && Array.isArray(node.content)) node.content.forEach(traverse);
    };
    blocks.forEach(traverse);
    return text.trim();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const blogsList = blogsData?.items || [];
  const totalBlogPages = blogsData?.totalPages || 1;

  const STATUS_COLORS: Record<string, string> = {
    PUBLISHED: "bg-emerald-100 text-emerald-700",
    DRAFT: "bg-slate-100 text-slate-600",
    SCHEDULED: "bg-blue-100 text-blue-700",
    ARCHIVED: "bg-amber-100 text-amber-700",
  };

  const CMS_TABS: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: "articles", label: "All Articles", icon: FileText },
    { id: "editor", label: editingArticleId ? "Edit Article" : "New Article", icon: Plus },
    { id: "categories-tags", label: "Categories & Tags", icon: Layers },
    { id: "media", label: "Media Library", icon: ImageIcon },
    { id: "contact", label: "Inquiries", icon: AlertCircle },
    { id: "dashboard", label: "Blog Analytics", icon: BarChart3 },
  ];

  // ─── Toggle Switch Component ────────────────────────────────────────────────
  const Toggle = ({
    checked,
    onChange,
    label,
    icon: Icon,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    icon: React.ElementType;
  }) => (
    <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer select-none">
      <span className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
        <Icon className="w-4 h-4 text-[#072460]" />
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#072460] focus-visible:ring-offset-2 ${checked ? "bg-[#072460]" : "bg-slate-200"
          }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-4" : "translate-x-0"
            }`}
        />
      </button>
    </label>
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* CMS Sub-navigation */}
      <div className="bg-white border-b border-slate-200 px-6 flex gap-1 overflow-x-auto scrollbar-none shrink-0 sticky">
        {CMS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => (tab.id === "editor" ? handleCreateNewArticle() : setActiveTab(tab.id))}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${activeTab === tab.id
              ? "border-[#072460] text-[#072460]"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.id === "articles" && blogsData?.total ? (
              <span className="ml-1 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-black">
                {blogsData.total}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        {/* ═══ ARTICLES LIST ═══════════════════════════════════════════════ */}
        {activeTab === "articles" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2 flex-1 min-w-0">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={articleSearch}
                    onChange={(e) => {
                      setArticleSearch(e.target.value);
                      setArticlePage(1);
                    }}
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460] font-medium"
                  />
                </div>
                <select
                  value={articleStatusFilter}
                  onChange={(e) => {
                    setArticleStatusFilter(e.target.value);
                    setArticlePage(1);
                  }}
                  className="px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#072460] cursor-pointer"
                >
                  {["ALL", "PUBLISHED", "DRAFT", "SCHEDULED", "ARCHIVED"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCreateNewArticle}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#072460] text-white text-xs font-bold rounded-xl hover:bg-[#0a307f] transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New Article
              </button>
            </div>

            {selectedArticleIds.length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-[#072460]/5 border border-[#072460]/20 rounded-xl">
                <span className="text-xs font-bold text-[#072460]">
                  {selectedArticleIds.length} selected
                </span>
                <div className="flex gap-2 ml-auto">
                  {["PUBLISHED", "DRAFT", "ARCHIVED"].map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        bulkStatusMutation.mutate({ ids: selectedArticleIds, status: s })
                      }
                      disabled={bulkStatusMutation.isPending}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {bulkStatusMutation.isPending && (
                        <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      )}
                      {s}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${selectedArticleIds.length} articles?`)) {
                        bulkDeleteMutation.mutate(selectedArticleIds);
                      }
                    }}
                    disabled={bulkDeleteMutation.isPending}
                    className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {bulkDeleteMutation.isPending && (
                      <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            )}

            {isLoadingBlogs ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-xl h-16" />
                ))}
              </div>
            ) : blogsList.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
                <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">No articles found</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedArticleIds.length === blogsList.length && blogsList.length > 0
                          }
                          onChange={(e) =>
                            setSelectedArticleIds(
                              e.target.checked ? blogsList.map((b) => b.id) : []
                            )
                          }
                          className="rounded border-slate-300 cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-slate-600">Title</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-600">Status</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-600">Views</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-600">Date</th>
                      <th className="px-4 py-3 text-right font-bold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {blogsList.map((article) => (
                      <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedArticleIds.includes(article.id)}
                            onChange={(e) =>
                              setSelectedArticleIds(
                                e.target.checked
                                  ? [...selectedArticleIds, article.id]
                                  : selectedArticleIds.filter((id) => id !== article.id)
                              )
                            }
                            className="rounded border-slate-300 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <div>
                            <p className="font-bold text-slate-900 truncate">{article.title}</p>
                            <p className="text-slate-400 font-mono truncate text-[10px]">
                              /blogs/{article.slug}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-md font-bold text-[10px] ${STATUS_COLORS[article.status] || "bg-slate-100 text-slate-500"
                              }`}
                          >
                            {article.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-600">
                          {article.viewsCount?.toLocaleString() ?? 0}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(article.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditArticle(article)}
                              title="Edit"
                              className="p-1.5 rounded-lg hover:bg-[#072460]/10 text-[#072460] cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setPreviewArticle(article)}
                              title="Preview"
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDuplicatingId(article.id);
                                duplicateBlogMutation.mutate(article.id, {
                                  onSettled: () => setDuplicatingId(null),
                                });
                              }}
                              disabled={duplicatingId === article.id}
                              title="Duplicate"
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer disabled:opacity-50"
                            >
                              {duplicatingId === article.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <a
                              href={`${process.env.NEXT_PUBLIC_WEB_URL}/blogs/${article.slug}`}
                              target="_blank"
                              rel="noopener"
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                              title="View Live"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => {
                                if (confirm("Delete this article?")) {
                                  setDeletingArticleId(article.id);
                                  deleteBlogMutation.mutate(article.id, {
                                    onSettled: () => setDeletingArticleId(null),
                                  });
                                }
                              }}
                              disabled={deletingArticleId === article.id}
                              title="Delete"
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 cursor-pointer disabled:opacity-50"
                            >
                              {deletingArticleId === article.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalBlogPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setArticlePage((p) => Math.max(1, p - 1))}
                  disabled={articlePage === 1}
                  className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl">
                  {articlePage} / {totalBlogPages}
                </span>
                <button
                  onClick={() => setArticlePage((p) => Math.min(totalBlogPages, p + 1))}
                  disabled={articlePage === totalBlogPages}
                  className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══ ARTICLE EDITOR ══════════════════════════════════════════════ */}
        {activeTab === "editor" && (
          <div className="max-w-5xl mx-auto space-y-5 pb-8 overflow-hidden">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center gap-3 top-0 z-10 shadow-sm">
              <button
                onClick={() => setShowAiModal(true)}
                disabled={aiDraftMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Draft
              </button>
              <button
                onClick={() =>
                  aiSeoMutation.mutate({ title: editorTitle, content: editorContent })
                }
                disabled={!editorTitle || !editorContent || aiSeoMutation.isPending}
                title="AI SEO"
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-40 cursor-pointer transition-all"
              >
                {aiSeoMutation.isPending ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {aiSeoMutation.isPending ? "Analyzing..." : "AI SEO"}
              </button>

              <div className="flex-1" />

              <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                {(["edit", "split", "preview"] as EditorMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setEditorMode(m)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${editorMode === m
                      ? "bg-white shadow-sm text-[#072460]"
                      : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <button
                onClick={() => saveBlogMutation.mutate()}
                disabled={saveBlogMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#072460] text-white text-xs font-bold rounded-xl hover:bg-[#0a307f] disabled:opacity-50 cursor-pointer transition-all"
              >
                {saveBlogMutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" /> Save Article
                  </>
                )}
              </button>
            </div>

            {(editorMode === "edit" || editorMode === "split") && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Article Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a clear, compelling title"
                    value={editorTitle}
                    onChange={(e) => setEditorTitle(e.target.value)}
                    className="w-full text-xl font-bold text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#072460] placeholder-slate-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="Short supporting description"
                    value={editorSubtitle}
                    onChange={(e) => setEditorSubtitle(e.target.value)}
                    className="w-full text-sm text-slate-700 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#072460] placeholder-slate-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    URL Slug
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono shrink-0">/blogs/</span>
                    <input
                      type="text"
                      placeholder="auto-generated-from-title"
                      value={editorSlug}
                      onChange={(e) => setEditorSlug(e.target.value)}
                      className="flex-1 text-sm text-slate-700 border border-slate-200 rounded-xl px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-[#072460] placeholder-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Excerpt
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short summary used in cards and SEO"
                    value={editorExcerpt}
                    onChange={(e) => setEditorExcerpt(e.target.value)}
                    className="w-full text-sm text-slate-700 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#072460] placeholder-slate-300 resize-none"
                  />
                </div>
              </div>
            )}

            <div
              className={`grid gap-4 ${editorMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                }`}
            >
              {(editorMode === "edit" || editorMode === "split") && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                    <span className="text-xs font-bold text-slate-600">Content Editor</span>
                  </div>
                  <div className="p-2">
                    <BlogEditor
                      initialContent={editorBlockContent}
                      onChange={(blocks: any) => {
                        setEditorBlockContent(blocks);
                        const plainText = extractPlainTextFromBlocks(blocks);
                        setEditorContent(plainText);
                      }}
                    />
                  </div>
                </div>
              )}

              {(editorMode === "preview" || editorMode === "split") && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                    <span className="text-xs font-bold text-slate-600">Live Preview</span>
                  </div>
                  <div className="p-6 min-h-[300px]">
                    {editorTitle ? (
                      <>
                        <h2 className="text-2xl font-black text-slate-900 mb-4">{editorTitle}</h2>
                        {editorSubtitle && (
                          <p className="text-slate-600 mb-6 text-sm">{editorSubtitle}</p>
                        )}
                        <BlogRenderer blockContent={editorBlockContent ?? []} />
                      </>
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-16">
                        Start writing to see the preview…
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {editorMode === "edit" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Publish Settings
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                      Status
                    </label>
                    <select
                      value={editorStatus}
                      onChange={(e) => setEditorStatus(e.target.value as any)}
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460] cursor-pointer"
                    >
                      {["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {editorStatus === "SCHEDULED" && (
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Schedule Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={editorScheduledAt}
                        onChange={(e) => setEditorScheduledAt(e.target.value)}
                        className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> Cover Image
                    </label>

                    <input
                      type="text"
                      placeholder="https://... (paste an image URL)"
                      value={editorCoverImage}
                      onChange={(e) => setEditorCoverImage(e.target.value)}
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460]"
                    />

                    <div className="flex items-center gap-2 my-2">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">OR</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    <label className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-50 border border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-[#072460]/5 hover:border-[#072460]/40 transition-all">
                      {isUploadingMedia ? (
                        <div className="w-3.5 h-3.5 border-2 border-[#072460] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-[#072460]" />
                      )}
                      <span className="text-xs font-semibold text-[#072460]">
                        {isUploadingMedia ? "Uploading... Please wait" : "Upload from device"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploadingMedia}
                        className="sr-only"
                      />
                    </label>

                    {editorCoverImage && (
                      <div className="mt-3 relative">
                        <img
                          src={editorCoverImage}
                          alt="Cover preview"
                          className="w-full h-32 object-cover rounded-xl border border-slate-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setEditorCoverImage("")}
                          className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 pt-1">
                    <Toggle
                      checked={editorIsFeatured}
                      onChange={setEditorIsFeatured}
                      label="Featured"
                      icon={Flame}
                    />
                    <Toggle
                      checked={editorIsTrending}
                      onChange={setEditorIsTrending}
                      label="Trending"
                      icon={TrendingUp}
                    />
                    <Toggle
                      checked={editorAllowComments}
                      onChange={setEditorAllowComments}
                      label="Allow Comments"
                      icon={CheckCircle}
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Categories & Tags
                    </h3>

                    <div ref={categoryDropdownRef} className="relative">
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" /> Categories
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        className="w-full text-left p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none hover:border-[#072460] transition-colors"
                      >
                        {editorCategoryNames || (
                          <span className="text-slate-400">Select categories…</span>
                        )}
                      </button>
                      {isCategoryDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                          {(categories as AdminCategory[]).map((cat) => (
                            <label
                              key={cat.id}
                              className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={editorCategoryIds.includes(cat.id)}
                                onChange={(e) => {
                                  const newIds = e.target.checked
                                    ? [...editorCategoryIds, cat.id]
                                    : editorCategoryIds.filter((id) => id !== cat.id);
                                  setEditorCategoryIds(newIds);
                                  setEditorCategoryNames(
                                    (categories as AdminCategory[])
                                      .filter((c) => newIds.includes(c.id))
                                      .map((c) => c.name)
                                      .join(", ")
                                  );
                                }}
                                className="rounded border-slate-300"
                              />
                              <span className="text-xs font-medium text-slate-700">{cat.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                        <TagIcon className="w-3.5 h-3.5" /> Tags
                      </label>
                      <input
                        type="text"
                        placeholder="cricket, auction, sports (comma-separated)"
                        value={editorTagNames}
                        onChange={(e) => setEditorTagNames(e.target.value)}
                        className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460]"
                      />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      SEO Settings
                    </h3>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={editorMetaTitle}
                        onChange={(e) => setEditorMetaTitle(e.target.value)}
                        placeholder="SEO page title"
                        className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                        Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={editorMetaDescription}
                        onChange={(e) => setEditorMetaDescription(e.target.value)}
                        placeholder="SEO description"
                        className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460] resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                        Keywords
                      </label>
                      <input
                        type="text"
                        value={editorKeywords}
                        onChange={(e) => setEditorKeywords(e.target.value)}
                        placeholder="cricket, auction, bid"
                        className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                        Canonical URL
                      </label>
                      <input
                        type="text"
                        value={editorCanonicalUrl}
                        onChange={(e) => setEditorCanonicalUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ CATEGORIES & TAGS ═══════════════════════════════════════════ */}
        {activeTab === "categories-tags" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#072460]" /> Categories
              </h3>
              <div className="space-y-2.5 mb-5">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Auction Strategy"
                    value={newCatName}
                    onChange={(e) => {
                      setNewCatName(e.target.value);
                      setNewCatSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, "")
                      );
                    }}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Slug</label>
                  <input
                    type="text"
                    placeholder="auction-strategy"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#072460]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Optional description"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460]"
                  />
                </div>
                <button
                  onClick={() =>
                    createCategoryMutation.mutate({
                      name: newCatName,
                      slug: newCatSlug,
                      description: newCatDesc || undefined,
                      color: newCatColor,
                    })
                  }
                  disabled={!newCatName || createCategoryMutation.isPending}
                  className="w-full py-2.5 bg-[#072460] text-white text-xs font-bold rounded-xl hover:bg-[#0a307f] disabled:opacity-50 cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  {createCategoryMutation.isPending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Add Category"
                  )}
                </button>
              </div>
              <div className="space-y-2">
                {(categories as AdminCategory[]).map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color || "#072460" }}
                      />
                      <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                      <span className="text-[10px] text-slate-400">({cat.blogsCount ?? 0})</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm("Delete this category?")) {
                          deleteCategoryMutation.mutate(cat.id);
                        }
                      }}
                      disabled={deleteCategoryMutation.isPending}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 cursor-pointer disabled:opacity-50"
                    >
                      {deleteCategoryMutation.isPending &&
                        deleteCategoryMutation.variables === cat.id ? (
                        <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-[#072460]" /> Tags
              </h3>
              <div className="flex gap-2 mb-5">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">
                    New Tag Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. cricket"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      createTagMutation.mutate({
                        name: newTagName,
                        slug: newTagName.toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460]"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() =>
                      createTagMutation.mutate({
                        name: newTagName,
                        slug: newTagName.toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                    disabled={!newTagName || createTagMutation.isPending}
                    className="px-4 py-2.5 bg-[#072460] text-white text-xs font-bold rounded-xl hover:bg-[#0a307f] disabled:opacity-50 cursor-pointer h-[38px] flex items-center justify-center gap-1.5"
                  >
                    {createTagMutation.isPending ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(tags as AdminTag[]).map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    #{tag.name}
                    <span className="text-slate-400">({tag.blogsCount ?? 0})</span>
                    <button
                      onClick={() => {
                        if (confirm("Delete this tag?")) {
                          deleteTagMutation.mutate(tag.id);
                        }
                      }}
                      disabled={deleteTagMutation.isPending}
                      className="text-red-400 hover:text-red-600 cursor-pointer disabled:opacity-50"
                    >
                      {deleteTagMutation.isPending &&
                        deleteTagMutation.variables === tag.id ? (
                        <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <X className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ MEDIA LIBRARY ═══════════════════════════════════════════════ */}
        {activeTab === "media" && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Upload Media</h3>

              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  Alt Text / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cricket stadium at night"
                  value={mediaUploadAlt}
                  onChange={(e) => setMediaUploadAlt(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460]"
                />
              </div>

              <label className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#072460] hover:bg-[#072460]/5 transition-all">
                {isUploadingMedia ? (
                  <div className="w-5 h-5 border-2 border-[#072460] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 text-[#072460]" />
                )}
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    {isUploadingMedia ? "Uploading to Cloudinary..." : "Click to upload image"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {isUploadingMedia
                      ? "Please wait while we save your image"
                      : "JPG, PNG, WebP up to 10MB"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMediaLibraryUpload}
                  disabled={isUploadingMedia}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search media by name or alt text..."
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460] font-medium"
              />
            </div>

            {isLoadingMedia ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-slate-200 rounded-xl aspect-square" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {((mediaData as any)?.items || [])
                  .filter((m: MediaItem) =>
                    mediaSearch
                      ? (m.altText || "").toLowerCase().includes(mediaSearch.toLowerCase()) ||
                      (m.publicId || "").toLowerCase().includes(mediaSearch.toLowerCase())
                      : true
                  )
                  .map((media: MediaItem) => (
                    <div
                      key={media.id}
                      className="group relative rounded-xl overflow-hidden bg-slate-100 aspect-square border border-slate-200"
                    >
                      <img
                        src={media.secureUrl}
                        alt={media.altText || ""}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            navigator.clipboard
                              .writeText(media.secureUrl)
                              .then(() => toast.success("URL copied!"))
                          }
                          title="Copy URL"
                          className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMedia(media.id)}
                          disabled={deletingMediaId === media.id}
                          title="Delete"
                          className="p-2 bg-red-500/70 rounded-lg text-white hover:bg-red-600 cursor-pointer disabled:opacity-50"
                        >
                          {deletingMediaId === media.id ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {media.altText && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] font-semibold px-2 py-1 truncate">
                          {media.altText}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {!isLoadingMedia && ((mediaData as any)?.items || []).length === 0 && (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
                <ImageIcon className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">No media uploaded yet</p>
              </div>
            )}
          </div>
        )}

        {/* ═══ CONTACT MESSAGES ════════════════════════════════════════════ */}
        {activeTab === "contact" && (
          <div className="space-y-3">
            {isLoadingContact ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-2xl h-20 border border-slate-200"
                />
              ))
            ) : (
              ((contactMessages as any)?.data || contactMessages || []).map((msg: any) => (
                <div
                  key={msg.id}
                  className={`bg-white border rounded-2xl p-4 ${!msg.isRead ? "border-[#072460]/30 bg-[#072460]/5" : "border-slate-200"
                    }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="text-sm font-bold text-slate-900">{msg.name}</span>
                      <span className="text-xs text-slate-500 ml-2">{msg.email}</span>
                      {msg.mobile && (
                        <span className="text-xs text-slate-400 ml-2">{msg.mobile}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ═══ BLOG ANALYTICS ══════════════════════════════════════════════ */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Total Blogs", value: analytics?.overview?.totalBlogs },
              { label: "Published", value: analytics?.overview?.publishedBlogs },
              { label: "Drafts", value: analytics?.overview?.draftBlogs },
              { label: "Scheduled", value: analytics?.overview?.scheduledBlogs },
              {
                label: "Total Views",
                value: analytics?.overview?.totalViews?.toLocaleString(),
              },
              {
                label: "Total Likes",
                value: analytics?.overview?.totalLikes?.toLocaleString(),
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-2xl font-black text-slate-900">{value ?? "—"}</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── AI Draft Modal ──────────────────────────────────────────────────── */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" /> AI Draft Generator
              </h3>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                disabled={aiDraftMutation.isPending}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  Topic / Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. How to win a cricket auction"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  disabled={aiDraftMutation.isPending}
                  className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  Target Audience
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sports organizers, team managers"
                  value={aiAudience}
                  onChange={(e) => setAiAudience(e.target.value)}
                  disabled={aiDraftMutation.isPending}
                  className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Tone</label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  disabled={aiDraftMutation.isPending}
                  className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer disabled:bg-slate-50"
                >
                  {[
                    "Engaging and Informative",
                    "Professional",
                    "Casual",
                    "Authoritative",
                    "Conversational",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAiModal(false)}
                disabled={aiDraftMutation.isPending}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  aiDraftMutation.mutate({
                    topic: aiTopic,
                    targetAudience: aiAudience,
                    tone: aiTone,
                  })
                }
                disabled={!aiTopic || aiDraftMutation.isPending}
                className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {aiDraftMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Generating... (~20s)
                  </>
                ) : (
                  "Generate Draft"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Article Preview Modal ──────────────────────────────────────────── */}
      {previewArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 shrink-0">
              <h3 className="text-sm font-bold text-slate-900">Preview</h3>
              <button
                onClick={() => setPreviewArticle(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <h2 className="text-xl font-black text-slate-900 mb-2">{previewArticle.title}</h2>
              {previewArticle.subtitle && (
                <p className="text-slate-600 text-sm mb-4">{previewArticle.subtitle}</p>
              )}
              <BlogRenderer
                blockContent={
                  Array.isArray((previewArticle as any).blockContent)
                    ? (previewArticle as any).blockContent
                    : []
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}