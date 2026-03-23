"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Article } from "@/types";
import CoverImage from "@/components/ui/CoverImage";

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
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-[#faf9f6] dark:bg-background-dark border-t border-accent-gold/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white font-kufi"
            >
              السير والسلوك
            </motion.h2>
            <p className="text-gray-500 dark:text-gray-400 font-amiri text-lg mt-3 max-w-2xl">
              آداب الطريق وأوراد المريد والمجاهدة، فمن لم يكن له شيخ فشيخه الشيطان.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 dark:border-gray-800">
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
                className={`relative p-8 sm:p-10 hover:bg-primary dark:hover:bg-primary transition-all duration-500 group overflow-hidden min-h-[320px] sm:min-h-[380px] flex flex-col justify-end block ${
                  i < 2 ? "border-b md:border-b-0 md:border-l border-gray-200 dark:border-gray-800" : ""
                }`}
              >
                {article.coverImage && (
                  <CoverImage
                    src={article.coverImage}
                    alt={article.title_ar}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                  />
                )}
                <div className="relative z-10">
                  <h4 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-white transition-colors text-gray-900 dark:text-white font-kufi">
                    {article.title_ar}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 group-hover:text-white/70 transition-colors line-clamp-2 text-sm font-amiri">
                    {article.excerpt_ar}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            href="/ar/conduct"
            className="group inline-flex items-center gap-2 text-base sm:text-lg text-primary dark:text-accent-gold font-bold font-amiri hover:gap-3 transition-all"
          >
            <span>جميع آداب الطريق</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
