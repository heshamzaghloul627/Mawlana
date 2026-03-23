"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/types";
import { getCategoryName } from "@/lib/firebase/articles";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function HowToStartSection({ articles }: { articles: Article[] }) {
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
              كيف أبدأ
            </motion.h2>
            <div className="w-16 h-1 bg-accent-gold" />
          </div>
          <Link
            href="/ar/how-to-start"
            className="text-primary dark:text-accent-gold hover:underline font-bold font-amiri"
          >
            كل إرشادات البداية
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
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
                href={`/ar/how-to-start/${article.slug_ar}`}
                className="group block border border-accent-gold/20 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="h-64 overflow-hidden relative bg-gradient-to-br from-primary/10 to-accent-gold/10">
                  {article.coverImage && (
                    <img
                      src={article.coverImage}
                      alt={article.title_ar}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
                </div>
                {/* Content overlapping image */}
                <div className="p-8 sm:p-10 -mt-20 relative z-10">
                  <span className="text-xs text-primary dark:text-accent-gold font-bold mb-3 block">
                    الدرس {i === 0 ? "الأول" : "الثاني"}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white font-amiri">
                    {article.title_ar}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
                    {article.excerpt_ar}
                  </p>
                  <span className="text-primary dark:text-accent-gold font-bold flex items-center gap-2 font-amiri">
                    واصل القراءة
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
