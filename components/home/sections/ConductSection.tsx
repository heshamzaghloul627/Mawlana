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

export default function ConductSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-gray-50 dark:bg-[#0d1119]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-amiri"
          >
            السير والسلوك
          </motion.h2>
          <div className="flex flex-col items-end gap-3">
            <p className="text-primary dark:text-accent-gold font-bold text-lg sm:text-xl italic font-amiri">
              &ldquo;من لم يكن له شيخ فشيخه الشيطان&rdquo;
            </p>
            <Link
              href="/ar/conduct"
              className="text-primary dark:text-accent-gold hover:underline font-bold font-amiri"
            >
              جميع آداب الطريق
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 dark:border-gray-700">
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
                href={`/ar/conduct/${article.slug_ar}`}
                className={`relative p-8 sm:p-12 hover:bg-primary dark:hover:bg-primary transition-all group overflow-hidden min-h-[350px] sm:min-h-[400px] flex flex-col justify-center block ${
                  i < 2 ? "border-b md:border-b-0 md:border-l border-gray-200 dark:border-gray-700" : ""
                }`}
              >
                {article.coverImage && (
                  <img
                    src={article.coverImage}
                    alt={article.title_ar}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                  />
                )}
                <div className="relative z-10">
                  <h4 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-white transition-colors text-gray-900 dark:text-white font-amiri">
                    {article.title_ar}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 group-hover:text-white/80 transition-colors line-clamp-2">
                    {article.excerpt_ar}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
