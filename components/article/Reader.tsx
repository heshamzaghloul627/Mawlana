"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Bookmark,
  Share2,
  Clock,
  Calendar,
  Sparkles,
  List,
  Check,
  Link2,
  X,
} from "lucide-react";
import { getArticles, getCategoryName } from "@/lib/firebase/articles";
import type { Article } from "@/types";
import type { TocHeading } from "@/lib/utils/parseTiptapContent";

/* ==============================
   localStorage helpers for likes/bookmarks
   ============================== */
function getStoredSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function toggleInSet(key: string, id: string): boolean {
  const set = getStoredSet(key);
  const isNowActive = !set.has(id);
  if (isNowActive) set.add(id);
  else set.delete(id);
  localStorage.setItem(key, JSON.stringify([...set]));
  return isNowActive;
}

interface ReaderProps {
  title: string;
  content: React.ReactNode;
  headings?: TocHeading[];
  author?: string;
  category?: string;
  lang?: "ar" | "en";
  coverImage?: string | null;
  telegramLink?: string;
  createdAt?: any;
  readingTime?: number;
}

export default function Reader({
  title,
  content,
  headings = [],
  author = "مؤلف مجهول",
  category = "quran",
  lang = "ar",
  coverImage,
  createdAt,
  readingTime = 0,
}: ReaderProps) {
  const articleRef = useRef<HTMLElement>(null);
  const [headingsReady, setHeadingsReady] = useState(false);

  // Unique key for this article (based on title, since we don't have an id prop)
  const articleKey = title;

  // Like state
  const [liked, setLiked] = useState(false);
  // Bookmark state
  const [bookmarked, setBookmarked] = useState(false);
  // Share menu & toast
  const [shareOpen, setShareOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    setLiked(getStoredSet("awdah-likes").has(articleKey));
    setBookmarked(getStoredSet("awdah-bookmarks").has(articleKey));
  }, [articleKey]);

  const handleLike = useCallback(() => {
    const isNow = toggleInSet("awdah-likes", articleKey);
    setLiked(isNow);
  }, [articleKey]);

  const handleBookmark = useCallback(() => {
    const isNow = toggleInSet("awdah-bookmarks", articleKey);
    setBookmarked(isNow);
  }, [articleKey]);

  const handleToggleShare = useCallback(() => {
    setShareOpen((prev) => !prev);
  }, []);

  const handleCopyLink = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setShareOpen(false);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  }, []);

  const handleShareTo = useCallback(
    (platform: "facebook" | "x" | "whatsapp") => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(title);
      const urls: Record<string, string> = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        whatsapp: `https://wa.me/?text=${text}%20${url}`,
      };
      window.open(urls[platform], "_blank", "noopener,noreferrer,width=600,height=500");
      setShareOpen(false);
    },
    [title]
  );

  // Close share menu on outside click
  useEffect(() => {
    if (!shareOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-share-menu]")) setShareOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [shareOpen]);

  useEffect(() => {
    if (!articleRef.current || headings.length === 0) return;
    setHeadingsReady(false);

    function tryAssignIds(): boolean {
      if (!articleRef.current) return false;
      const els = articleRef.current.querySelectorAll("h1, h2, h3");
      if (els.length === 0) return false;

      let index = 0;
      els.forEach((el) => {
        if (el.textContent?.trim() && index < headings.length) {
          el.id = headings[index].id;
          index++;
        }
      });
      return index > 0;
    }

    if (tryAssignIds()) {
      setHeadingsReady(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (tryAssignIds()) {
        setHeadingsReady(true);
        observer.disconnect();
      }
    });

    observer.observe(articleRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [headings, content]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        lang={lang}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Cover Image */}
          {coverImage && (
            <motion.div
              className="rounded-2xl overflow-hidden shadow-lg -mx-2 sm:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={coverImage}
                alt={title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
            </motion.div>
          )}

          {/* Article Header */}
          <header className="relative space-y-6 text-center lg:text-right">
            {/* Category Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-accent-gold/10 text-primary dark:text-accent-gold text-sm font-medium mb-4 ring-1 ring-primary/20 dark:ring-accent-gold/20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-primary dark:text-accent-gold" />
              <span>{getCategoryLabel(category, lang)}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl lg:text-5xl font-amiri font-bold leading-relaxed text-slate-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {title}
            </motion.h1>

            {/* Meta Info */}
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-6 text-slate-500 dark:text-gray-400 text-sm border-b border-slate-200 dark:border-gray-700 pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-accent-gold/10 flex items-center justify-center">
                  <span className="text-primary dark:text-accent-gold text-xs font-bold">
                    {author.charAt(0)}
                  </span>
                </div>
                <span className="font-medium">{author}</span>
              </div>
              {readingTime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {lang === "ar"
                      ? `${readingTime} دقائق قراءة`
                      : `${readingTime} min read`}
                  </span>
                </div>
              )}
              {createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatTimestamp(createdAt, lang)}</span>
                </div>
              )}
            </motion.div>

            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          </header>

          {/* Article Content */}
          <motion.article
            ref={articleRef}
            className="prose prose-lg prose-slate max-w-none leading-loose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {content}
          </motion.article>

          {/* Action Bar */}
          <motion.div
            className="border-t border-slate-200 dark:border-gray-700 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="flex items-center gap-4 relative">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  liked
                    ? "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800"
                    : "bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-accent-gold/10 hover:text-primary dark:hover:text-accent-gold"
                }`}
              >
                <Heart className={`w-5 h-5 transition-all duration-300 ${liked ? "fill-red-500 dark:fill-red-400 scale-110" : ""}`} />
                <span>{lang === "ar" ? "قبول" : "Like"}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  bookmarked
                    ? "bg-primary/10 dark:bg-accent-gold/10 text-primary dark:text-accent-gold ring-1 ring-primary/20 dark:ring-accent-gold/20"
                    : "bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-accent-gold/10 hover:text-primary dark:hover:text-accent-gold"
                }`}
              >
                <Bookmark className={`w-5 h-5 transition-all duration-300 ${bookmarked ? "fill-primary dark:fill-accent-gold scale-110" : ""}`} />
                <span>{lang === "ar" ? "حفظ" : "Save"}</span>
              </button>

              {/* Share */}
              <div className="relative" data-share-menu>
                <button
                  onClick={handleToggleShare}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    shareOpen
                      ? "bg-primary/10 dark:bg-accent-gold/10 text-primary dark:text-accent-gold ring-1 ring-primary/20 dark:ring-accent-gold/20"
                      : "bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-accent-gold/10 hover:text-primary dark:hover:text-accent-gold"
                  }`}
                >
                  <Share2 className="w-5 h-5" />
                  <span>{lang === "ar" ? "نشر النور" : "Share"}</span>
                </button>

                {/* Share menu */}
                <AnimatePresence>
                  {shareOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1a202e] rounded-xl shadow-xl border border-slate-200 dark:border-gray-700 p-2 flex items-center gap-1 z-50"
                    >
                      {/* Facebook */}
                      <button
                        onClick={() => handleShareTo("facebook")}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#1877F2]/10 transition-colors group"
                        title="Facebook"
                      >
                        <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </button>

                      {/* X (Twitter) */}
                      <button
                        onClick={() => handleShareTo("x")}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors group"
                        title="X"
                      >
                        <svg className="w-5 h-5 text-slate-800 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </button>

                      {/* WhatsApp */}
                      <button
                        onClick={() => handleShareTo("whatsapp")}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#25D366]/10 transition-colors group"
                        title="WhatsApp"
                      >
                        <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </button>

                      {/* Copy Link */}
                      <button
                        onClick={handleCopyLink}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-primary/10 dark:hover:bg-accent-gold/10 transition-colors group"
                        title={lang === "ar" ? "نسخ الرابط" : "Copy link"}
                      >
                        <Link2 className="w-5 h-5 text-primary dark:text-accent-gold" />
                      </button>

                      {/* Close */}
                      <button
                        onClick={() => setShareOpen(false)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title={lang === "ar" ? "إغلاق" : "Close"}
                      >
                        <X className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Copy toast */}
                <AnimatePresence>
                  {shareToast && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-primary dark:bg-accent-gold text-white dark:text-background-dark text-sm font-medium px-4 py-2 rounded-full shadow-lg whitespace-nowrap z-50"
                    >
                      <Check className="w-4 h-4" />
                      {lang === "ar" ? "تم نسخ الرابط" : "Link copied"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-100 dark:bg-gray-800 rounded text-xs text-slate-500 dark:text-gray-400">
                #تزكية
              </span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-gray-800 rounded text-xs text-slate-500 dark:text-gray-400">
                #عودة
              </span>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8 relative">
          <div className="sticky top-32 space-y-8">
            {headings.length > 0 && (
              <TableOfContents headings={headings} lang={lang} ready={headingsReady} />
            )}
            <SuggestedArticles lang={lang} currentTitle={title} />
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ==============================
   Table of Contents (Sidebar)
   ============================== */
function TableOfContents({
  headings,
  lang,
  ready,
}: {
  headings: TocHeading[];
  lang: "ar" | "en";
  ready: boolean;
}) {
  const [activeId, setActiveId] = useState<string>("");

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings, ready]);

  return (
    <nav className="bg-white dark:bg-[#1a202e] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-5">
        <List className="w-5 h-5 text-primary dark:text-accent-gold" />
        <h3 className="font-amiri font-bold text-lg text-slate-900 dark:text-white">
          {lang === "ar" ? "فهرس المقال" : "Contents"}
        </h3>
      </div>

      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-slate-100 dark:bg-gray-700 rounded-full" />

        <ul className="space-y-1">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const indent = heading.level >= 3 ? "pr-6" : "pr-3";

            return (
              <li key={heading.id} className="relative">
                {isActive && (
                  <motion.div
                    className="absolute right-[-1px] top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-full"
                    layoutId="toc-indicator"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <button
                  onClick={() => handleClick(heading.id)}
                  className={`block w-full text-right ${indent} py-2 text-sm transition-colors duration-200 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 ${
                    isActive
                      ? "text-primary dark:text-accent-gold font-bold"
                      : "text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200"
                  }`}
                >
                  {heading.text}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/* ==============================
   Suggested Articles (Sidebar)
   ============================== */
function SuggestedArticles({ lang, currentTitle }: { lang: "ar" | "en"; currentTitle: string }) {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchSuggestions() {
      const all = await getArticles({ limit: 10 });
      const filtered = all.filter((a) => {
        const title = lang === "en" && a.title_en ? a.title_en : a.title_ar;
        return title !== currentTitle;
      });
      setArticles(filtered.slice(0, 3));
    }
    fetchSuggestions();
  }, [lang, currentTitle]);

  if (articles.length === 0) return null;

  return (
    <div className="bg-primary/5 dark:bg-accent-gold/5 rounded-xl p-6 border border-primary/10 dark:border-accent-gold/10">
      <h3 className="font-amiri font-bold text-lg text-primary dark:text-accent-gold mb-4">
        {lang === "ar" ? "نفحات مقترحة" : "Suggested Readings"}
      </h3>
      <div className="space-y-4">
        {articles.map((article, i) => {
          const articleTitle = lang === "en" && article.title_en ? article.title_en : article.title_ar;
          const slug = lang === "en" ? article.slug_en : article.slug_ar;
          const href = `/${lang}/${article.category}/${slug}`;

          return (
            <div key={article.id}>
              {i > 0 && <div className="h-px bg-primary/10 dark:bg-accent-gold/10 w-full mb-4" />}
              <Link href={href} className="block group">
                {article.coverImage && (
                  <div className="h-28 rounded-lg overflow-hidden mb-2">
                    <img
                      src={article.coverImage}
                      alt={articleTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <span className="text-xs text-slate-400 dark:text-gray-500 mb-1 block">
                  {getCategoryName(article.category, lang)}
                </span>
                <h4 className="font-medium text-slate-800 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-accent-gold transition-colors">
                  {articleTitle}
                </h4>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatTimestamp(timestamp: any, lang: "ar" | "en"): string {
  try {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

function getCategoryLabel(category: string, lang: "ar" | "en"): string {
  const labels: Record<string, { ar: string; en: string }> = {
    quran: { ar: "أنوار القرآن", en: "Lights of the Quran" },
    human: { ar: "الإنسان", en: "The Human" },
    divine: { ar: "المعرفة الإلهية", en: "Divine Knowledge" },
    behavior: { ar: "السلوك", en: "Conduct" },
  };
  return labels[category]?.[lang] || (lang === "ar" ? "إشراق روحي" : "Spiritual Illumination");
}
