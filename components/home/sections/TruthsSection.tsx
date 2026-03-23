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

export default function TruthsSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-gray-50 dark:bg-[#0d1119]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white font-amiri"
          >
            حقائق
          </motion.h2>
          <p className="text-primary dark:text-accent-gold mt-3 text-lg sm:text-xl font-amiri">
            خلاصات التجارب الذوقية والمعارف اللدنية
          </p>
          <Link
            href="/ar/truths"
            className="inline-block mt-4 text-primary dark:text-accent-gold hover:underline font-bold font-amiri"
          >
            جميع الحقائق
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {articles.slice(0, 3).map((article, i) => (
            <motion.article
              key={article.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="space-y-4 p-6 sm:p-8 border-b-2 border-primary/10 dark:border-accent-gold/10 hover:border-primary dark:hover:border-accent-gold transition-all group bg-white dark:bg-gray-900"
            >
              <Link href={`/ar/truths/${article.slug_ar}`}>
                <div className="aspect-video mb-4 overflow-hidden border border-accent-gold/20 bg-gradient-to-br from-primary/5 to-accent-gold/10">
                  {article.coverImage && (
                    <img
                      src={article.coverImage}
                      alt={article.title_ar}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  )}
                </div>
                <span className="text-xs text-primary/60 dark:text-accent-gold/60 tracking-widest uppercase font-bold">
                  حقيقة
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-amiri">
                  {article.title_ar}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                  {article.excerpt_ar}
                </p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
