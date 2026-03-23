"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function InfallibilitySection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-white dark:bg-background-dark">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white font-amiri"
        >
          عصمة الأنبياء
        </motion.h2>
        <div className="w-24 h-1 bg-accent-gold mx-auto mb-6" />
        <Link
          href="/ar/infallibility"
          className="inline-block mb-12 text-primary dark:text-accent-gold hover:underline font-bold font-amiri"
        >
          جميع مباحث العصمة
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-right">
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
                href={`/ar/infallibility/${article.slug_ar}`}
                className="space-y-4 p-6 sm:p-8 bg-white dark:bg-gray-900 border border-accent-gold/20 group block"
              >
                <div className="h-40 mb-4 overflow-hidden bg-gradient-to-br from-primary/5 to-accent-gold/10">
                  {article.coverImage && (
                    <img
                      src={article.coverImage}
                      alt={article.title_ar}
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                    />
                  )}
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-amiri">
                  {article.title_ar}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                  {article.excerpt_ar}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
