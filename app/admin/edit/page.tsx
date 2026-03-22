"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  getArticleById,
  updateArticle,
} from "@/lib/firebase/articles";
import {
  formatWithAI,
  regenerateImage,
  extractTextFromTiptap,
  listCovers,
  uploadCover,
  type CoverImage,
} from "@/lib/openai/format";
import { parseTiptapContent } from "@/lib/utils/parseTiptapContent";
import type { Article, TiptapContent, Category } from "@/types";
import {
  Save,
  Loader2,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ImageIcon,
  Sparkles,
  FolderOpen,
  Upload,
  X,
} from "lucide-react";

const TiptapEditor = dynamic(() => import("@/components/admin/TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" size={24} />
    </div>
  ),
});

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "quran", label: "أنوار القرآن" },
  { value: "human", label: "الإنسان" },
  { value: "divine", label: "المعرفة الإلهية" },
  { value: "behavior", label: "السلوك" },
];

export default function AdminEditPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable fields
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<Category>("divine");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [featured, setFeatured] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [tiptapJson, setTiptapJson] = useState<TiptapContent | null>(null);

  // AI re-formatting
  const [rawText, setRawText] = useState("");
  const [isFormatting, setIsFormatting] = useState(false);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);

  // Cover image browsing/upload
  const [showCoverBrowser, setShowCoverBrowser] = useState(false);
  const [covers, setCovers] = useState<CoverImage[]>([]);
  const [loadingCovers, setLoadingCovers] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("لم يتم تحديد معرّف المقال");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const data = await getArticleById(id!);
        if (!data) {
          setError("المقال غير موجود");
          setLoading(false);
          return;
        }
        setArticle(data);
        setTitle(data.title_ar);
        setExcerpt(data.excerpt_ar);
        setCategory(data.category);
        setStatus(data.status);
        setFeatured(data.featured);
        setCoverImage(data.coverImage || null);

        const parsed = parseTiptapContent(data.content_ar);
        setTiptapJson(parsed);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSave = useCallback(async () => {
    if (!tiptapJson || !id) return;
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      await updateArticle(id, {
        title_ar: title,
        excerpt_ar: excerpt,
        category,
        status,
        featured,
        coverImage: coverImage,
        content_ar: JSON.stringify(tiptapJson) as unknown as TiptapContent,
        seo_meta_ar: {
          title: `${title} | عودة`,
          description: excerpt,
          keywords: [],
        },
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  }, [id, title, excerpt, category, status, featured, coverImage, tiptapJson]);

  const handleReformat = useCallback(async () => {
    if (!rawText.trim()) return;
    setIsFormatting(true);
    setError(null);

    try {
      const data = await formatWithAI(rawText, title, category);
      setTiptapJson(data.tiptapJson);
      if (data.excerpt) setExcerpt(data.excerpt);
      if (data.coverImageUrl) setCoverImage(data.coverImageUrl);
      setRawText("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsFormatting(false);
    }
  }, [rawText, title, category]);

  const handleReformatExisting = useCallback(async () => {
    if (!tiptapJson) return;
    setIsFormatting(true);
    setError(null);

    try {
      const plainText = extractTextFromTiptap(tiptapJson);
      if (!plainText.trim()) {
        setError("المحتوى فارغ، لا يمكن إعادة التنسيق");
        return;
      }
      const data = await formatWithAI(plainText, title, category);
      setTiptapJson(data.tiptapJson);
      if (data.excerpt) setExcerpt(data.excerpt);
      if (data.coverImageUrl) setCoverImage(data.coverImageUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsFormatting(false);
    }
  }, [tiptapJson, title, category]);

  const handleRegenerateImage = useCallback(async () => {
    setIsRegeneratingImage(true);
    setError(null);

    try {
      const newImageUrl = await regenerateImage(title, excerpt);
      if (newImageUrl) {
        setCoverImage(newImageUrl);
      } else {
        setError("فشل توليد الصورة، حاول مرة أخرى");
      }
    } catch (err: any) {
      setError(err.message || "فشل توليد الصورة");
    } finally {
      setIsRegeneratingImage(false);
    }
  }, [title, excerpt]);

  const handleBrowseCovers = useCallback(async () => {
    setShowCoverBrowser(true);
    setLoadingCovers(true);
    try {
      const result = await listCovers();
      setCovers(result);
    } catch (err: any) {
      setError(err.message || "فشل تحميل الصور");
    } finally {
      setLoadingCovers(false);
    }
  }, []);

  const handleUploadCover = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadCover(file);
      setCoverImage(url);
    } catch (err: any) {
      setError(err.message || "فشل رفع الصورة");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-accent-gold" size={32} />
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="text-center py-20" dir="rtl">
        <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
        <p className="text-red-500 text-lg">{error}</p>
        <a
          href="/admin"
          className="inline-flex items-center gap-2 mt-4 text-accent-gold hover:underline"
        >
          <ArrowRight size={16} className="rotate-180" />
          العودة للوحة التحكم
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="/admin"
            className="p-2 rounded-lg text-charcoal-light dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ArrowRight size={20} className="rotate-180" />
          </a>
          <h1 className="text-xl font-bold text-charcoal dark:text-gray-100">
            تعديل المقال
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-green-500 text-sm">
              <CheckCircle size={14} />
              تم الحفظ
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-gold text-white font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            حفظ التعديلات
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-charcoal dark:text-gray-200 mb-2">
            العنوان
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-charcoal dark:text-gray-100 focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-charcoal dark:text-gray-200 mb-2">
            التصنيف
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-charcoal dark:text-gray-100 focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold outline-none transition"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-charcoal dark:text-gray-200 mb-2">
            الحالة
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "draft" | "published")
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-charcoal dark:text-gray-100 focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold outline-none transition"
          >
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-accent-gold focus:ring-accent-gold"
            />
            <span className="text-sm font-bold text-charcoal dark:text-gray-200">
              مقال مميز
            </span>
          </label>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-bold text-charcoal dark:text-gray-200 mb-2">
          المقتطف
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-charcoal dark:text-gray-100 focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold outline-none transition font-amiri"
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-bold text-charcoal dark:text-gray-200 mb-2">
          <ImageIcon size={14} className="inline ml-1" />
          صورة الغلاف
        </label>
        {coverImage ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <button
                onClick={() => setCoverImage(null)}
                className="px-3 py-1 rounded-lg bg-black/60 text-white text-xs hover:bg-black/80 transition"
              >
                إزالة
              </button>
              <button
                onClick={handleRegenerateImage}
                disabled={isRegeneratingImage}
                className="px-3 py-1 rounded-lg bg-accent-gold/80 text-white text-xs hover:bg-accent-gold transition disabled:opacity-50 flex items-center gap-1"
              >
                {isRegeneratingImage ? (
                  <Loader2 className="animate-spin" size={12} />
                ) : (
                  <Sparkles size={12} />
                )}
                توليد صورة جديدة
              </button>
              <button
                onClick={handleBrowseCovers}
                className="px-3 py-1 rounded-lg bg-black/60 text-white text-xs hover:bg-black/80 transition flex items-center gap-1"
              >
                <FolderOpen size={12} />
                استعراض
              </button>
              <label className="px-3 py-1 rounded-lg bg-black/60 text-white text-xs hover:bg-black/80 transition flex items-center gap-1 cursor-pointer">
                <Upload size={12} />
                رفع صورة
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadCover}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleRegenerateImage}
              disabled={isRegeneratingImage || isUploading}
              className="flex-1 h-48 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-accent-gold hover:border-accent-gold transition disabled:opacity-50"
            >
              {isRegeneratingImage ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span className="text-sm">جارٍ توليد الصورة...</span>
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  <span className="text-sm">توليد بالذكاء الاصطناعي</span>
                </>
              )}
            </button>
            <button
              onClick={handleBrowseCovers}
              disabled={isUploading}
              className="h-48 w-36 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-accent-gold hover:border-accent-gold transition disabled:opacity-50"
            >
              <FolderOpen size={24} />
              <span className="text-sm">استعراض</span>
            </button>
            <label className="h-48 w-36 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-accent-gold hover:border-accent-gold transition cursor-pointer">
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span className="text-sm">جارٍ الرفع...</span>
                </>
              ) : (
                <>
                  <Upload size={24} />
                  <span className="text-sm">رفع صورة</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadCover}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
        )}

        {/* Cover Browser Modal */}
        {showCoverBrowser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden" dir="rtl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-charcoal dark:text-gray-100">
                  استعراض صور الغلاف
                </h3>
                <button
                  onClick={() => setShowCoverBrowser(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)]">
                {loadingCovers ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-accent-gold" size={32} />
                  </div>
                ) : covers.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">لا توجد صور</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {covers.map((cover) => (
                      <button
                        key={cover.name}
                        onClick={() => {
                          setCoverImage(cover.url);
                          setShowCoverBrowser(false);
                        }}
                        className="group relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-accent-gold transition"
                      >
                        <img
                          src={cover.url}
                          alt=""
                          className="w-full h-32 object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <span className="text-white text-xs">
                            {Math.round(cover.size / 1024)} KB
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Re-format */}
      <div className="space-y-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 text-sm font-bold text-charcoal dark:text-gray-200">
          <Sparkles size={14} className="text-accent-gold" />
          إعادة تنسيق بالذكاء الاصطناعي
        </div>

        {/* Reformat existing content */}
        <button
          onClick={handleReformatExisting}
          disabled={isFormatting || !tiptapJson}
          className="w-full py-3 rounded-lg bg-gradient-to-l from-accent-gold to-yellow-600 text-white font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isFormatting && !rawText.trim() ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              جارٍ إعادة التنسيق...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              أعد تنسيق المحتوى الحالي
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
          <span className="text-xs text-gray-400">أو أدخل نصًا جديدًا</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Reformat from raw text */}
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="الصق النص الخام الجديد هنا..."
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-charcoal dark:text-gray-100 font-amiri text-lg leading-relaxed resize-y outline-none focus:ring-2 focus:ring-accent-gold/50"
        />
        <button
          onClick={handleReformat}
          disabled={isFormatting || !rawText.trim()}
          className="px-4 py-2 rounded-lg bg-accent-gold text-white font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
        >
          {isFormatting && rawText.trim() ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              جارٍ التنسيق...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              نسّق النص الجديد
            </>
          )}
        </button>
      </div>

      {/* Tiptap Editor */}
      <div>
        <label className="block text-sm font-bold text-charcoal dark:text-gray-200 mb-2">
          المحتوى
        </label>
        <TiptapEditor
          content={tiptapJson}
          onChange={(json) => setTiptapJson(json)}
        />
      </div>
    </div>
  );
}
