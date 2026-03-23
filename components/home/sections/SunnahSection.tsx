"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function SunnahSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-gray-50 dark:bg-[#0d1119]">
      <div className="max-w-7xl mx-auto">
        {/* Centered heading with decorative lines */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-grow bg-primary/20 dark:bg-accent-gold/20" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold px-6 text-gray-900 dark:text-white font-amiri"
          >
            أنوار النبوة
          </motion.h2>
          <div className="h-px flex-grow bg-primary/20 dark:bg-accent-gold/20" />
        </div>

        <div className="flex justify-end mb-8">
          <Link
            href="/ar/sunnah"
            className="text-primary dark:text-accent-gold hover:underline font-bold font-amiri"
          >
            جميع أنوار النبوة
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
                href={`/ar/sunnah/${article.slug_ar}`}
                className="relative overflow-hidden border border-accent-gold/20 bg-white dark:bg-gray-900 group hover:bg-primary dark:hover:bg-primary transition-all duration-500 block"
              >
                {article.coverImage && (
                  <img
                    src={article.coverImage}
                    alt={article.title_ar}
                    className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale group-hover:opacity-20 group-hover:scale-110 transition-all duration-700"
                  />
                )}
                <div className="p-8 relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-white transition-colors text-gray-900 dark:text-white font-amiri">
                    {article.title_ar}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 group-hover:text-white/80 mb-4 transition-colors line-clamp-2">
                    {article.excerpt_ar}
                  </p>
                  <span className="text-primary dark:text-accent-gold font-bold group-hover:text-white transition-colors font-amiri">
                    طالع المبحث
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
