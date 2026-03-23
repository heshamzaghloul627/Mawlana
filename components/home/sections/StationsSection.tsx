"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Article } from "@/types";
import CoverImage from "@/components/ui/CoverImage";

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
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white font-kufi"
          >
            مقامات الرحلة
          </motion.h2>
          <p className="text-gray-500 dark:text-gray-400 font-amiri text-lg mt-3 max-w-2xl">
            مقامات السالكين من التوبة إلى الرضا، منازل يرتقي فيها القلب درجة بعد درجة.
          </p>
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
                href={`/ar/stations/${article.slug_ar}`}
                className="flex flex-col sm:flex-row gap-6 group cursor-pointer border-r-2 border-accent-gold/30 pr-6 hover:border-accent-gold transition-colors duration-500"
              >
                <div className="relative flex-shrink-0 w-full sm:w-44 h-44 overflow-hidden">
                  {article.coverImage ? (
                    <CoverImage
                      src={article.coverImage}
                      alt={article.title_ar}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      thumbnail
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent-gold/10" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-white/80 font-kufi text-4xl font-bold">
                      {arabicNumerals[i] || ""}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white font-kufi">
                    {article.title_ar}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 text-sm font-amiri leading-relaxed">
                    {article.excerpt_ar}
                  </p>
                  <span className="text-xs text-primary dark:text-accent-gold font-bold tracking-wide">
                    اقرأ المزيد
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            href="/ar/stations"
            className="group inline-flex items-center gap-2 text-base sm:text-lg text-primary dark:text-accent-gold font-bold font-amiri hover:gap-3 transition-all"
          >
            <span>عرض جميع المقامات</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
