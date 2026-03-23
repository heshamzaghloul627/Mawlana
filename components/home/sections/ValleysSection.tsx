"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function ValleysSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-gray-50 dark:bg-[#0d1119]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-3">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-amiri"
            >
              الأودية السبعة
            </motion.h2>
            <div className="w-16 h-1 bg-accent-gold" />
          </div>
          <Link
            href="/ar/valleys"
            className="text-primary dark:text-accent-gold hover:underline font-bold font-amiri"
          >
            رحلة المخطوط الكاملة
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.slice(0, 3).map((article, i) => (
            <motion.article
              key={article.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group border border-gray-200 dark:border-gray-700 hover:border-primary/40 dark:hover:border-accent-gold/40 transition-all bg-white dark:bg-gray-900 overflow-hidden"
            >
              <Link href={`/ar/valleys/${article.slug_ar}`}>
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent-gold/10">
                  {article.coverImage && (
                    <img
                      src={article.coverImage}
                      alt={article.title_ar}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  )}
                </div>
                <div className="p-6 sm:p-8">
                  <h4 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 dark:text-white font-amiri">
                    {article.title_ar}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {article.excerpt_ar}
                  </p>
                  <div className="text-sm opacity-60 text-gray-500">
                    {article.created_at?.toDate?.()
                      ? new Intl.DateTimeFormat("ar-SA", { dateStyle: "long" }).format(
                          article.created_at.toDate()
                        )
                      : ""}
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
