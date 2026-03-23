"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/types";

const arabicNumerals = ["٠١", "٠٢", "٠٣"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function StationsSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-3">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-amiri"
            >
              مقامات الرحلة
            </motion.h2>
            <div className="w-16 h-1 bg-accent-gold" />
          </div>
          <Link
            href="/ar/stations"
            className="text-primary dark:text-accent-gold hover:underline font-bold font-amiri"
          >
            جميع المقامات
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {articles.slice(0, 2).map((article, i) => (
            <motion.div
              key={article.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Link
                href={`/ar/stations/${article.slug_ar}`}
                className="flex flex-col sm:flex-row gap-6 sm:gap-8 group cursor-pointer border border-accent-gold/20 p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="relative flex-shrink-0 w-full sm:w-48 h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent-gold/10">
                  {article.coverImage && (
                    <img
                      src={article.coverImage}
                      alt={article.title_ar}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-amiri text-5xl font-bold">
                    {arabicNumerals[i] || ""}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white font-amiri">
                    {article.title_ar}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {article.excerpt_ar}
                  </p>
                  <span className="text-primary dark:text-accent-gold font-bold font-amiri">
                    اقرأ المزيد
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
