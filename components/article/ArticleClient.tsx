"use client";

import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getArticleBySlug, CATEGORIES } from "@/lib/firebase/articles";
import type { ArticleWithFallback, Category } from "@/types";
import Reader from "@/components/article/Reader";
import TiptapRenderer from "@/components/article/TiptapRenderer";
import FallbackBanner from "@/components/article/FallbackBanner";
import {
  extractHeadings,
  estimateReadingTime,
} from "@/lib/utils/parseTiptapContent";

interface ArticleClientProps {
  langOverride?: string;
  categoryOverride?: string;
  slugOverride?: string;
}

export default function ArticleClient({
  langOverride,
  categoryOverride,
  slugOverride,
}: ArticleClientProps) {
  const params = useParams<{ lang: string; category: string; slug: string }>();
  const pathname = usePathname();

  const lang = (
    (langOverride || params?.lang) === "en" ? "en" : "ar"
  ) as "ar" | "en";
  const category = (categoryOverride || params?.category) as Category;
  const rawSlug = slugOverride || params?.slug || "";
  const slug = decodeURIComponent(rawSlug);

  const [article, setArticle] = useState<ArticleWithFallback | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug || !CATEGORIES.includes(category)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    async function fetchArticle() {
      try {
        const result = await getArticleBySlug(slug, lang);

        if (!result || result.category !== category) {
          setNotFound(true);
        } else {
          setArticle(result);
          const seo =
            lang === "en" && result.seo_meta_en
              ? result.seo_meta_en
              : result.seo_meta_ar;
          if (seo?.title) {
            document.title = seo.title;
          }
        }
      } catch (error) {
        console.error("Error loading article:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug, lang, category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.p
          className="text-2xl text-primary"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {lang === "ar" ? "جاري التحميل..." : "Loading..."}
        </motion.p>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center space-y-6 px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-6xl text-primary/40">404</p>
          <p className="text-2xl text-slate-900 dark:text-white font-amiri font-bold">ضللت الطريق</p>
          <p className="text-lg font-crimson text-slate-500 dark:text-gray-400" lang="en">
            Lost on the Path
          </p>
          <p className="text-base text-slate-500 dark:text-gray-400">
            المقال الذي تبحث عنه غير موجود، أو لعله لم يُكتب بعد
          </p>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
          <Link
            href="/"
            className="inline-block text-primary hover:text-primary-dark transition-colors duration-500 border-b border-primary/50 hover:border-primary pb-1"
          >
            العودة إلى الرئيسية
          </Link>
        </motion.div>
      </div>
    );
  }

  const displayLang = article.fallback ? "ar" : lang;
  const title =
    lang === "en" && article.title_en && !article.fallback
      ? article.title_en
      : article.title_ar;
  const content =
    lang === "en" && article.content_en && !article.fallback
      ? article.content_en
      : article.content_ar;

  const headings = extractHeadings(content);
  const readingTime = estimateReadingTime(content);

  return (
    <>
      {article.fallback && <FallbackBanner />}

      <Reader
        title={title}
        author={article.author}
        category={article.category}
        lang={displayLang}
        headings={headings}
        coverImage={article.coverImage}
        createdAt={article.created_at}
        readingTime={readingTime}
        content={<TiptapRenderer content={content} lang={displayLang} />}
      />
    </>
  );
}
