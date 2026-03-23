"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getFeaturedArticles, getCategoryName } from "@/lib/firebase/articles";
import type { Article } from "@/types";
import CoverImage from "@/components/ui/CoverImage";

export default function RecentArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const results = await getFeaturedArticles(3);
      setArticles(results);
      setLoading(false);
    }

    fetchArticles();
  }, []);

  if (loading || articles.length === 0) return null;

  return (
    <section className="reading-container py-20">
      {/* Section Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-charcoal mb-3">
          أحدث المقالات
        </h2>
        <p className="text-base text-charcoal-light font-crimson" lang="en">
          Recent Articles
        </p>
        <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mt-4" />
      </motion.div>

      {/* Article Cards */}
      <div className="space-y-6">
        {articles.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            <Link href={`/ar/${article.category}/${article.slug_ar}`}>
              <div className="group rounded-lg border border-gold/20 bg-ivory/50 backdrop-blur-sm hover:border-gold/40 transition-all duration-500 overflow-hidden">
                {article.coverImage && (
                  <div className="h-48 overflow-hidden">
                    <CoverImage
                      src={article.coverImage}
                      alt={article.title_ar}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      thumbnail
                    />
                  </div>
                )}

                <div className="p-6">
                  <span className="inline-block text-xs text-emerald border border-emerald/30 rounded-full px-3 py-1 mb-3">
                    {getCategoryName(article.category, "ar")}
                  </span>

                  <h3 className="text-xl font-bold text-gold mb-2 group-hover:text-glow-gold transition-all duration-500">
                    {article.title_ar}
                  </h3>

                  <p className="text-charcoal-light leading-relaxed">
                    {article.excerpt_ar}
                  </p>

                  <div className="mt-3 text-sm text-gold/60 group-hover:text-gold transition-colors duration-500">
                    اقرأ المزيد ←
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
