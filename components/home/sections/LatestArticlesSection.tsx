"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { getArticles, getCategoryName } from "@/lib/firebase/articles";
import type { Article } from "@/types";
import CoverImage from "@/components/ui/CoverImage";

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
        const latest = await getArticles({ status: "published", limit: 5 });
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

  const [hero, ...rest] = articles;

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-white dark:bg-background-dark" id="featured">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-kufi"
          >
            احدث الأنوار
          </motion.h2>
        </div>

        {/* Hero Article */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Link
            href={`/ar/${hero.category}/${hero.slug_ar}`}
            className="group block md:flex md:gap-0 overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-2xl"
          >
            <div className="md:w-3/5 aspect-[16/10] md:aspect-auto relative overflow-hidden rounded-2xl md:rounded-l-none">
              {hero.coverImage ? (
                <CoverImage
                  src={hero.coverImage}
                  alt={hero.title_ar}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent-gold/10" />
              )}
            </div>
            <div className="md:w-2/5 p-8 sm:p-10 flex flex-col justify-center">
              <span className="text-xs sm:text-sm tracking-[0.2em] uppercase font-bold text-accent-gold mb-3 block">
                {getCategoryName(hero.category, "ar")}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-kufi mb-3 leading-snug">
                {hero.title_ar}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 line-clamp-3 text-sm sm:text-base font-amiri leading-relaxed mb-5">
                {hero.excerpt_ar}
              </p>
              <span className="text-sm sm:text-base text-primary dark:text-accent-gold font-bold font-amiri">
                اقرأ المقال كاملاً
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Remaining Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rest.map((article, i) => (
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
                className="group block"
              >
                <div className="aspect-[4/3] overflow-hidden relative mb-4 rounded-xl">
                  {article.coverImage ? (
                    <CoverImage
                      src={article.coverImage}
                      alt={article.title_ar}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      thumbnail
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent-gold/10" />
                  )}
                  <div className="absolute inset-0 bg-amber-900/5 mix-blend-multiply" />
                </div>
                <span className="text-xs tracking-[0.2em] uppercase font-bold text-accent-gold/70 mb-1 block">
                  {getCategoryName(article.category, "ar")}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-kufi line-clamp-2 mb-1">
                  {article.title_ar}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-1 font-amiri">
                  {article.excerpt_ar}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all — left side (end in RTL), prominent */}
        <div className="mt-12 flex justify-end">
          <Link
            href="/ar/how-to-start"
            className="group inline-flex items-center gap-2 text-base sm:text-lg text-primary dark:text-accent-gold font-bold font-amiri hover:gap-3 transition-all"
          >
            <span>عرض جميع الأنوار</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
