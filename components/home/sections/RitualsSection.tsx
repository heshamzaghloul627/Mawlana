"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Article } from "@/types";
import CoverImage from "@/components/ui/CoverImage";

export default function RitualsSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 3);

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto flex gap-10 lg:gap-16 items-start flex-col md:flex-row">
        {/* Left: Hero area */}
        <div className="md:w-1/2">
          <div className="mb-6 overflow-hidden aspect-[16/10]">
            {mainArticle?.coverImage ? (
              <CoverImage
                src={mainArticle.coverImage}
                alt="المناسك"
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent-gold/10" />
            )}
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white font-kufi"
          >
            المناسك
          </motion.h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 font-amiri leading-relaxed">
            ليست المناسك مجرد حركات، بل هي لغة الجسد في مخاطبة الروح.
          </p>
        </div>

        {/* Right: Article list */}
        <div className="md:w-1/2 flex flex-col gap-6 md:pt-8">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              href={`/ar/rituals/${article.slug_ar}`}
              className="flex gap-5 items-center group py-6 border-b border-gray-200 dark:border-gray-800"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden">
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
                <h4 className="text-lg sm:text-xl font-bold mb-1 text-gray-900 dark:text-white font-kufi group-hover:text-primary dark:group-hover:text-accent-gold transition-colors">
                  {article.title_ar}
                </h4>
                <p className="text-sm text-gray-400 line-clamp-1 font-amiri">
                  {article.excerpt_ar}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-12 flex justify-end">
        <Link
          href="/ar/rituals"
          className="group inline-flex items-center gap-2 text-base sm:text-lg text-primary dark:text-accent-gold font-bold font-amiri hover:gap-3 transition-all"
        >
          <span>اكتشف أسرار العبادات</span>
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
