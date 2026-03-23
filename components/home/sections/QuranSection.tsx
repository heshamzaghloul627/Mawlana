"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Article } from "@/types";
import CoverImage from "@/components/ui/CoverImage";

export default function QuranSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-20">
        {/* Sidebar */}
        <div className="md:w-1/3 space-y-6">
          <div className="relative overflow-hidden aspect-[4/3]">
            {articles[0]?.coverImage ? (
              <CoverImage
                src={articles[0].coverImage}
                alt="علوم القرآن"
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent-gold/10" />
            )}
            <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white font-kufi"
          >
            علوم القرآن
          </motion.h2>
          <p className="text-gray-500 dark:text-gray-400 font-amiri leading-relaxed">
            القرآن حمال أوجه، وهنا نبحث في وجوهه الإشارية وما بطن من معانيه العظيمة.
          </p>
        </div>

        {/* Article List */}
        <div className="md:w-2/3 flex flex-col justify-center gap-0">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/ar/quran/${article.slug_ar}`}
              className="flex justify-between items-center group py-8 border-b border-gray-200 dark:border-gray-800 first:border-t"
            >
              <div className="flex gap-5 items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden">
                  {article.coverImage ? (
                    <CoverImage
                      src={article.coverImage}
                      alt={article.title_ar}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      thumbnail
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent-gold/10" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold group-hover:text-primary dark:group-hover:text-accent-gold transition-colors text-gray-900 dark:text-white font-kufi">
                    {article.title_ar}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-1 font-amiri">
                    {article.excerpt_ar}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-12 flex justify-end">
        <Link
          href="/ar/quran"
          className="group inline-flex items-center gap-2 text-base sm:text-lg text-primary dark:text-accent-gold font-bold font-amiri hover:gap-3 transition-all"
        >
          <span>استكشف علوم القرآن</span>
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
