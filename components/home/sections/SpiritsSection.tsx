"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/types";

const arabicNumbers = ["١", "٢", "٣"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function SpiritsSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-gray-50 dark:bg-[#0d1119]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-amiri"
          >
            الأرواح ثلاثة
          </motion.h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-amiri text-lg">
            فهم لطائف النفس البشرية ومراتب الترقي الروحي من الترابي إلى القدسي.
          </p>
          <Link
            href="/ar/spirits"
            className="inline-block mt-4 text-primary dark:text-accent-gold hover:underline font-bold font-amiri"
          >
            استكشف عالم الأرواح
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.slice(0, 3).map((article, i) => (
            <motion.div
              key={article.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Link
                href={`/ar/spirits/${article.slug_ar}`}
                className="group relative p-8 sm:p-10 bg-gray-100 dark:bg-gray-800 overflow-hidden min-h-[380px] flex flex-col justify-end block"
              >
                {article.coverImage && (
                  <img
                    src={article.coverImage}
                    alt={article.title_ar}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                  />
                )}
                <div className="absolute -right-8 -top-8 text-primary/10 dark:text-accent-gold/10 text-[10rem] font-bold select-none transition-transform group-hover:scale-110 pointer-events-none">
                  {arabicNumbers[i]}
                </div>
                <h4 className="text-xl sm:text-2xl font-bold mb-3 relative z-10 text-gray-900 dark:text-white font-amiri">
                  {article.title_ar}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 relative z-10 line-clamp-2">
                  {article.excerpt_ar}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
