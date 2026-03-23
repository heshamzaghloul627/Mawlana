"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import {
  getArticlesByCategory,
  getCategoryName,
  CATEGORIES,
} from "@/lib/firebase/articles";
import type { Article, Category } from "@/types";
import CoverImage from "@/components/ui/CoverImage";

export default function CategoryClient() {
  const params = useParams<{ lang: string; category: string }>();
  const lang = (params.lang === "en" ? "en" : "ar") as "ar" | "en";
  const category = params.category as Category;

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!CATEGORIES.includes(category)) {
      setInvalid(true);
      setLoading(false);
      return;
    }

    async function fetchArticles() {
      const results = await getArticlesByCategory(category);
      setArticles(results);
      setLoading(false);
    }

    fetchArticles();
  }, [category]);

  if (invalid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-2xl text-primary font-amiri font-bold">
            {lang === "ar" ? "قسم غير معروف" : "Unknown Category"}
          </p>
          <Link
            href="/"
            className="inline-block text-primary hover:text-primary-dark transition-colors duration-500 border-b border-primary/50 hover:border-primary pb-1"
          >
            {lang === "ar" ? "العودة إلى الرئيسية" : "Return Home"}
          </Link>
        </motion.div>
      </div>
    );
  }

  const categoryName = CATEGORIES.includes(category)
    ? getCategoryName(category, lang)
    : "";

  return (
    <main
      className="min-h-screen"
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors duration-300 mb-12"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="text-sm">
              {lang === "ar" ? "الرئيسية" : "Home"}
            </span>
          </Link>
        </motion.div>

        {/* Category Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-amiri font-bold text-slate-900 dark:text-white mb-4">
            {categoryName}
          </h1>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary dark:via-accent-gold to-transparent" />
        </motion.div>

        {/* Loading */}
        {loading && (
          <motion.p
            className="text-center text-primary dark:text-accent-gold text-xl"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {lang === "ar" ? "جاري التحميل..." : "Loading..."}
          </motion.p>
        )}

        {/* Empty state */}
        {!loading && articles.length === 0 && (
          <motion.div
            className="text-center py-16 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-slate-500 dark:text-gray-400">
              {lang === "ar"
                ? "لم تُكتب مقالات بعد في هذا القسم"
                : "No articles have been written in this category yet"}
            </p>
            <p className="text-base text-slate-400 dark:text-gray-500">
              {lang === "ar" ? "قريباً إن شاء الله" : "Coming soon, God willing"}
            </p>
          </motion.div>
        )}

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => {
            const title =
              lang === "en" && article.title_en
                ? article.title_en
                : article.title_ar;
            const excerpt =
              lang === "en" && article.excerpt_en
                ? article.excerpt_en
                : article.excerpt_ar;
            const slug =
              lang === "en" && article.slug_en
                ? article.slug_en
                : article.slug_ar;

            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link href={`/${lang}/${category}/${slug}`}>
                  <article className="bg-white dark:bg-[#151b26] rounded-xl shadow-sm hover:shadow-md transition-all duration-500 border border-slate-100 dark:border-gray-800 overflow-hidden flex flex-col h-full group">
                    {/* Cover image */}
                    <div className="h-48 overflow-hidden relative">
                      {article.coverImage ? (
                        <CoverImage
                          src={article.coverImage}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          thumbnail
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 dark:from-gray-800 to-primary/5 dark:to-accent-gold/5" />
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-xs text-primary dark:text-accent-gold font-bold mb-2">
                        {categoryName}
                      </div>
                      <h2 className="text-xl font-amiri font-bold text-slate-900 dark:text-gray-100 mb-3 group-hover:text-primary dark:group-hover:text-accent-gold transition-colors">
                        {title}
                      </h2>
                      <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                        {excerpt}
                      </p>
                      <span className="text-primary dark:text-accent-gold font-semibold text-sm flex items-center mt-auto">
                        {lang === "ar" ? "اقرأ المزيد" : "Read more"}
                        <ArrowLeft className="w-3 h-3 mr-1" />
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
