"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
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

export default function ValleysSection({ articles }: { articles: Article[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  if (!articles.length) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 sm:py-28 bg-[#faf9f6] dark:bg-background-dark border-t border-accent-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white font-kufi"
            >
              الأودية السبعة
            </motion.h2>
            <p className="text-gray-500 dark:text-gray-400 font-amiri text-lg mt-3 max-w-2xl">
              رحلة الروح عبر أودية الطلب والعشق والمعرفة حتى الفناء في الله.
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal scroll with side arrows */}
      <div className="relative">
        {/* Right arrow (RTL: appears on right side) */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:border-accent-gold dark:hover:text-accent-gold transition-colors rounded-full shadow-sm"
          aria-label="السابق"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        {/* Left arrow (RTL: appears on left side) */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:border-accent-gold dark:hover:text-accent-gold transition-colors rounded-full shadow-sm"
          aria-label="التالي"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-5 lg:gap-7 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4 sm:px-6 lg:pr-12 lg:pl-[max(1rem,calc((100vw-80rem)/2+3rem))]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {articles.slice(0, 3).map((article, i) => (
          <motion.article
            key={article.id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="group flex-shrink-0 w-[80vw] sm:w-[45vw] lg:w-[28vw] xl:w-[24vw] snap-start"
          >
            <Link href={`/ar/valleys/${article.slug_ar}`} className="block">
              <div className="aspect-[4/5] relative overflow-hidden mb-5">
                {article.coverImage ? (
                  <CoverImage
                    src={article.coverImage}
                    alt={article.title_ar}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]"
                    thumbnail
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent-gold/10" />
                )}
                <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-kufi mb-2">
                {article.title_ar}
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-amiri line-clamp-2 leading-relaxed">
                {article.excerpt_ar}
              </p>
            </Link>
          </motion.article>
        ))}
        </div>
      </div>

      {/* View all — left in RTL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-12 flex justify-end">
        <Link
          href="/ar/valleys"
          className="group inline-flex items-center gap-2 text-base sm:text-lg text-primary dark:text-accent-gold font-bold font-amiri hover:gap-3 transition-all"
        >
          <span>تعرف على باقي الأرواح</span>
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
