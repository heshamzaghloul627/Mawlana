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
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function HowToStartSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="py-28 sm:py-36 px-4 sm:px-6 lg:px-12 bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white font-kufi"
          >
            كيف أبدأ
          </motion.h2>
          <p className="text-gray-500 dark:text-gray-400 font-amiri text-lg mt-3 max-w-2xl">
            دليل المبتدئين في طريق المعرفة الإلهية، من أين تبدأ وكيف تسير.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
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
                className="group block overflow-hidden"
              >
                {/* Full-bleed image */}
                <div className="aspect-[16/9] overflow-hidden relative">
                  {article.coverImage ? (
                    <CoverImage
                      src={article.coverImage}
                      alt={article.title_ar}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      thumbnail
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent-gold/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  {/* Content over image bottom */}
                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8">
                    <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-accent-gold mb-2 block">
                      الدرس {i === 0 ? "الأول" : "الثاني"}
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-kufi leading-snug">
                      {article.title_ar}
                    </h3>
                    <p className="text-white/70 leading-relaxed mt-2 line-clamp-2 text-sm sm:text-base font-amiri">
                      {article.excerpt_ar}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all — bottom start */}
        <div className="mt-12 flex justify-end">
          <Link
            href="/ar/how-to-start"
            className="group inline-flex items-center gap-2 text-base sm:text-lg text-primary dark:text-accent-gold font-bold font-amiri hover:gap-3 transition-all"
          >
            <span>كل إرشادات البداية</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
