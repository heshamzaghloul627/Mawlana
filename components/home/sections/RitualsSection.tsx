"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/types";

export default function RitualsSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 3);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto flex gap-8 lg:gap-12 items-center flex-col md:flex-row">
        {/* Left: Hero area */}
        <div className="md:w-1/2">
          <div className="mb-6 border border-accent-gold/20 overflow-hidden h-64 bg-gradient-to-br from-primary/5 to-accent-gold/10">
            {mainArticle?.coverImage && (
              <img
                src={mainArticle.coverImage}
                alt="المناسك"
                className="w-full h-full object-cover grayscale"
              />
            )}
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white font-amiri"
          >
            المناسك
          </motion.h2>
          <p className="text-lg sm:text-2xl text-gray-600 dark:text-gray-400 mb-6 font-amiri leading-loose">
            ليست المناسك مجرد حركات، بل هي لغة الجسد في مخاطبة الروح. نكشف هنا عن الأسرار الروحية للصلاة والصيام والحج.
          </p>
          <Link
            href="/ar/rituals"
            className="inline-block px-8 sm:px-10 py-3 sm:py-4 border-2 border-primary dark:border-accent-gold text-primary dark:text-accent-gold font-bold hover:bg-primary dark:hover:bg-accent-gold hover:text-white dark:hover:text-gray-900 transition-all font-amiri"
          >
            اكتشف أسرار العبادات
          </Link>
        </div>

        {/* Right: Article list */}
        <div className="md:w-1/2 grid grid-cols-1 gap-6">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              href={`/ar/rituals/${article.slug_ar}`}
              className="border border-accent-gold/20 p-4 sm:p-6 bg-white dark:bg-gray-900 flex gap-4 sm:gap-6 items-center group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden border border-accent-gold/20 bg-gradient-to-br from-primary/5 to-accent-gold/10">
                {article.coverImage && (
                  <img
                    src={article.coverImage}
                    alt={article.title_ar}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                )}
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold mb-1 text-gray-900 dark:text-white font-amiri">
                  {article.title_ar}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                  {article.excerpt_ar}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
