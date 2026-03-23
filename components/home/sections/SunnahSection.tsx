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

export default function SunnahSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#faf9f6] dark:bg-background-dark border-t border-accent-gold/10">
      <div className="max-w-7xl mx-auto">
        {/* Centered heading with decorative lines */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-grow bg-accent-gold/20" />
          <div className="h-px flex-grow bg-accent-gold/20" />
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-bold text-center text-gray-900 dark:text-white font-kufi mb-4"
        >
          أنوار النبوة
        </motion.h2>
        <p className="text-gray-500 dark:text-gray-400 font-amiri text-lg mt-3 max-w-2xl mx-auto text-center">
          الهدي النبوي وفقه القلوب في الأحاديث الشريفة، أدباً وأخلاقاً وسلوكاً.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-14">
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
                className="relative overflow-hidden bg-white dark:bg-gray-900 group hover:bg-primary dark:hover:bg-primary transition-all duration-500 block"
              >
                {article.coverImage && (
                  <CoverImage
                    src={article.coverImage}
                    alt={article.title_ar}
                    className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale group-hover:opacity-20 group-hover:scale-105 transition-all duration-700"
                  />
                )}
                <div className="p-8 sm:p-10 relative z-10 min-h-[200px] flex flex-col justify-end">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-white transition-colors text-gray-900 dark:text-white font-kufi">
                    {article.title_ar}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 group-hover:text-white/70 transition-colors line-clamp-2 text-sm font-amiri leading-relaxed">
                    {article.excerpt_ar}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            href="/ar/sunnah"
            className="group inline-flex items-center gap-2 text-base sm:text-lg text-primary dark:text-accent-gold font-bold font-amiri hover:gap-3 transition-all"
          >
            <span>جميع أنوار النبوة</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
