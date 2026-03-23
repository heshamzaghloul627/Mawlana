"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/types";

export default function QuranSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-20">
        {/* Sidebar */}
        <div className="md:w-1/3 space-y-6">
          <div className="relative overflow-hidden aspect-square border border-accent-gold/20 bg-gradient-to-br from-primary/5 to-accent-gold/10">
            {articles[0]?.coverImage && (
              <img
                src={articles[0].coverImage}
                alt="علوم القرآن"
                className="w-full h-full object-cover grayscale opacity-50"
              />
            )}
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-amiri"
          >
            علوم القرآن
          </motion.h2>
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 font-amiri">
            القرآن حمال أوجه، وهنا نبحث في وجوهه الإشارية وما بطن من معانيه العظيمة.
          </p>
          <Link
            href="/ar/quran"
            className="inline-block px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-amiri font-bold hover:bg-primary dark:hover:bg-accent-gold transition-colors"
          >
            استكشف المكتبة القرآنية
          </Link>
        </div>

        {/* Article List */}
        <div className="md:w-2/3 grid grid-cols-1 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/ar/quran/${article.slug_ar}`}
              className="border-b border-primary/10 dark:border-accent-gold/10 pb-6 flex justify-between items-center group cursor-pointer"
            >
              <div className="flex gap-4 sm:gap-6 items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden border border-accent-gold/20 bg-gradient-to-br from-primary/5 to-accent-gold/10">
                  {article.coverImage && (
                    <img
                      src={article.coverImage}
                      alt={article.title_ar}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg sm:text-2xl font-bold group-hover:text-primary dark:group-hover:text-accent-gold transition-colors text-gray-900 dark:text-white font-amiri">
                    {article.title_ar}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base line-clamp-1">
                    {article.excerpt_ar}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
