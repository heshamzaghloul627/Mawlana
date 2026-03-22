"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { createArticle } from "@/lib/firebase/articles";
import { formatWithAI, generateContent } from "@/lib/openai/format";
import type { TiptapContent, Category } from "@/types";
import {
  Sparkles,
  Save,
  Loader2,
  ImageIcon,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Wand2,
} from "lucide-react";

// Dynamic import to avoid SSR issues with Tiptap
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

type Step = "input" | "review" | "published";

export default function AdminWritePage() {
  // Step 1 state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("الشيخ أحمد الرفاعي");
  const [category, setCategory] = useState<Category>("divine");
  const [rawText, setRawText] = useState("");

  // AI generation state
  const [articleIdea, setArticleIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // AI processing state
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatError, setFormatError] = useState<string | null>(null);

  // Step 2 state
  const [tiptapJson, setTiptapJson] = useState<TiptapContent | null>(null);
  const [excerpt, setExcerpt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("input");

  // Publish state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  const handleFormat = useCallback(async () => {
    if (!rawText.trim() || !title.trim()) return;

    setIsFormatting(true);
    setFormatError(null);

    try {
      const data = await formatWithAI(rawText, title, category);
      setTiptapJson(data.tiptapJson);
      setExcerpt(data.excerpt || "");
      setImageUrl(data.coverImageUrl || null);
      setStep("review");
    } catch (err: any) {
      setFormatError(err.message);
    } finally {
      setIsFormatting(false);
    }
  }, [rawText, title, category]);

  const handleGenerate = useCallback(async () => {
    if (!articleIdea.trim() || !title.trim()) return;

    setIsGenerating(true);
    setFormatError(null);

    try {
      const content = await generateContent(articleIdea, title, category);
      setRawText(content);
      setArticleIdea("");
    } catch (err: any) {
      setFormatError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }, [articleIdea, title, category]);

  const handlePublish = useCallback(async () => {
    if (!tiptapJson || !title.trim()) return;

    setIsPublishing(true);

    try {
      // Generate slug from title
      const slugAr = title
        .replace(/[^\u0621-\u064Aa-zA-Z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .substring(0, 80);

      const articleId = await createArticle({
        slug_ar: slugAr,
        slug_en: "",
        title_ar: title,
        title_en: null,
        excerpt_ar: excerpt,
        excerpt_en: null,
        content_ar: JSON.stringify(tiptapJson) as unknown as TiptapContent,
        content_en: null,
        category,
        status: "published",
        featured: false,
        version_ar: 1,
        version_en: 0,
        author,
        coverImage: imageUrl,
        seo_meta_ar: {
          title: `${title} | عودة`,
          description: excerpt,
          keywords: [],
        },
        seo_meta_en: null,
      });

      setPublishedId(articleId);
      setStep("published");
    } catch (err: any) {
      setFormatError(err.message || "Publishing failed");
    } finally {
      setIsPublishing(false);
    }
  }, [tiptapJson, title, excerpt, imageUrl, category]);

  return (
    <div className="max-w-5xl mx-auto" dir="rtl">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[
          { key: "input", label: "إدخال النص", icon: FileText },
          { key: "review", label: "مراجعة وتعديل", icon: Sparkles },
          { key: "published", label: "تم النشر", icon: CheckCircle },
        ].map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            {i > 0 && (
              <ArrowRight
                size={16}
                className="text-gray-400 rotate-180 mx-2"
              />
            )}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                step === s.key
                  ? "bg-accent-gold/20 text-accent-gold font-bold"
                  : step === "published" ||
                      (step === "review" && s.key === "input")
                    ? "bg-green-500/10 text-green-500"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
              }`}
            >
              <s.icon size={14} />
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Input */}
      {step === "input" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-charcoal dark:text-gray-200 mb-2">
                عنوان المقال
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="أدخل عنوان المقال..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-charcoal dark:text-gray-100 focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold outline-none transition"
              />
            </div>

            {/* Category */}
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

          {/* Author */}
          <div>
            <label className="block text-sm font-bold text-charcoal dark:text-gray-200 mb-2">
              الكاتب
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="اسم الكاتب..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-charcoal dark:text-gray-100 focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold outline-none transition"
            />
          </div>

          {/* AI Generate from Idea */}
          <div className="p-4 rounded-xl border border-dashed border-accent-gold/40 bg-accent-gold/5 dark:bg-accent-gold/5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-charcoal dark:text-gray-200">
              <Wand2 size={14} className="text-accent-gold" />
              توليد محتوى من فكرة (اختياري)
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              اكتب فكرة المقال أو موضوعه وسيقوم الذكاء الاصطناعي بكتابة النص الخام في الحقل أدناه. يمكنك تعديله قبل التنسيق.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={articleIdea}
                onChange={(e) => setArticleIdea(e.target.value)}
                placeholder="مثال: مقال عن التوبة وأثرها في تزكية النفس..."
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-charcoal dark:text-gray-100 focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold outline-none transition text-sm"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !articleIdea.trim() || !title.trim()}
                className="px-4 py-2.5 rounded-lg bg-accent-gold text-white font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2 text-sm whitespace-nowrap"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    جارٍ الكتابة...
                  </>
                ) : (
                  <>
                    <Wand2 size={14} />
                    اكتب المقال
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Raw Text */}
          <div>
            <label className="block text-sm font-bold text-charcoal dark:text-gray-200 mb-2">
              النص الخام
            </label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="الصق النص العربي الخام هنا... أو استخدم توليد المحتوى أعلاه. سيقوم الذكاء الاصطناعي بتنسيقه وتحديد الآيات القرآنية والأشعار تلقائيًا"
              rows={18}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-charcoal dark:text-gray-100 focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold outline-none transition font-amiri text-lg leading-relaxed resize-y"
            />
          </div>

          {/* Error */}
          {formatError && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <AlertCircle size={18} />
              <span className="text-sm">{formatError}</span>
            </div>
          )}

          {/* Format Button */}
          <button
            onClick={handleFormat}
            disabled={isFormatting || !rawText.trim() || !title.trim()}
            className="w-full py-4 rounded-lg bg-gradient-to-l from-accent-gold to-yellow-600 text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isFormatting ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                جارٍ التنسيق وتوليد الغلاف...
              </>
            ) : (
              <>
                <Sparkles size={22} />
                نسّق النص واصنع الغلاف
              </>
            )}
          </button>
        </div>
      )}

      {/* Step 2: Review */}
      {step === "review" && (
        <div className="space-y-6">
          {/* Cover Image Preview */}
          {imageUrl && (
            <div>
              <label className="block text-sm font-bold text-charcoal dark:text-gray-200 mb-2">
                <ImageIcon size={14} className="inline ml-1" />
                صورة الغلاف المُولَّدة
              </label>
              <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={imageUrl}
                  alt="Generated cover"
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <button
                  onClick={() => setImageUrl(null)}
                  className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/60 text-white text-xs hover:bg-black/80 transition"
                >
                  إزالة الصورة
                </button>
              </div>
            </div>
          )}

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

          {/* Tiptap Editor */}
          <div>
            <label className="block text-sm font-bold text-charcoal dark:text-gray-200 mb-2">
              المحتوى المُنسَّق (قابل للتعديل)
            </label>
            <TiptapEditor
              content={tiptapJson}
              onChange={(json) => setTiptapJson(json)}
            />
          </div>

          {/* Error */}
          {formatError && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <AlertCircle size={18} />
              <span className="text-sm">{formatError}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep("input")}
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-charcoal dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              رجوع للتعديل
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex-1 py-3 rounded-lg bg-gradient-to-l from-primary to-primary-dark text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  جارٍ النشر...
                </>
              ) : (
                <>
                  <Save size={20} />
                  نشر في Firestore
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Published */}
      {step === "published" && publishedId && (
        <div className="text-center py-16 space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <CheckCircle className="text-green-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-charcoal dark:text-gray-100">
            تم النشر بنجاح!
          </h2>
          <p className="text-charcoal-light dark:text-gray-400">
            معرّف المقال: <code className="text-accent-gold">{publishedId}</code>
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/admin"
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-charcoal dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              لوحة التحكم
            </a>
            <button
              onClick={() => {
                setStep("input");
                setTitle("");
                setRawText("");
                setTiptapJson(null);
                setExcerpt("");
                setImageUrl(null);
                setPublishedId(null);
                setFormatError(null);
              }}
              className="px-6 py-3 rounded-lg bg-accent-gold text-white font-bold hover:opacity-90 transition"
            >
              كتابة مقال جديد
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
