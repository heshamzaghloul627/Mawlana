"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Article } from "@/types";
import CoverImage from "@/components/ui/CoverImage";

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
    <section className="py-28 sm:py-36 px-4 sm:px-6 lg:px-12 bg-[#1C1F26] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold font-kufi"
          >
            الأرواح ثلاثة
          </motion.h2>
          <p className="text-white/50 max-w-2xl mx-auto font-amiri text-lg">
            فهم لطائف النفس البشرية ومراتب الترقي الروحي من الترابي إلى القدسي.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
                className="group relative block p-8 sm:p-10 bg-white/5 overflow-hidden min-h-[380px] flex flex-col justify-end border border-white/10 hover:border-accent-gold/30 transition-colors duration-500"
              >
                {article.coverImage && (
                  <CoverImage
                    src={article.coverImage}
                    alt={article.title_ar}
                    className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-700"
                  />
                )}
                <div className="absolute -right-4 -top-4 text-accent-gold/10 text-[10rem] font-bold select-none pointer-events-none font-kufi leading-none">
                  {arabicNumbers[i]}
                </div>
                <h4 className="text-xl sm:text-2xl font-bold mb-3 relative z-10 font-kufi">
                  {article.title_ar}
                </h4>
                <p className="text-white/50 relative z-10 line-clamp-2 text-sm font-amiri leading-relaxed">
                  {article.excerpt_ar}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            href="/ar/spirits"
            className="group inline-flex items-center gap-2 text-base sm:text-lg text-accent-gold font-bold font-amiri hover:gap-3 transition-all"
          >
            <span>استكشف عالم الأرواح</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
