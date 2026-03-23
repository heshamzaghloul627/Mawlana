"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { getArticles, getCategoryName } from "@/lib/firebase/articles";
import type { Article } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function LatestArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const latest = await getArticles({ status: "published", limit: 6 });
        setArticles(latest);
      } catch (err) {
        console.error("Error fetching latest articles:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  if (loading) {
    return (
      <section className="py-20 flex justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </section>
    );
  }

  if (!articles.length) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-3">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-amiri"
            >
              احدث الأنوار
            </motion.h2>
            <div className="w-16 h-1 bg-accent-gold" />
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <Link
            href="/ar/how-to-start"
            className="text-primary dark:text-accent-gold hover:underline font-bold font-amiri"
          >
            عرض جميع المقالات
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Link
                href={`/ar/${article.category}/${article.slug_ar}`}
                className="group block bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary/40 dark:hover:border-accent-gold/40 overflow-hidden transition-all"
              >
                <div className="h-44 overflow-hidden relative bg-gradient-to-br from-primary/10 to-accent-gold/10">
                  {article.coverImage && (
                    <img
                      src={article.coverImage}
                      alt={article.title_ar}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-3 start-3">
                    <span className="bg-primary/90 dark:bg-accent-gold/90 text-white dark:text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                      {getCategoryName(article.category, "ar")}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white font-amiri mb-2 line-clamp-2">
                    {article.title_ar}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {article.excerpt_ar}
                  </p>
                  <div className="text-xs text-gray-400">
                    {article.created_at?.toDate?.()
                      ? new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(
                          article.created_at.toDate()
                        )
                      : ""}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
