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

export default function InfallibilitySection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-white dark:bg-background-dark">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white font-kufi"
        >
          عصمة الأنبياء
        </motion.h2>
        <p className="text-gray-500 dark:text-gray-400 font-amiri text-lg mt-3 max-w-2xl mx-auto">
          تنزيه مقام النبوة والرد على الشبهات، فالأنبياء قدوة مطلقة لا يعتريها نقص.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 text-right mt-14">
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
                className="block group"
              >
                <div className="aspect-[16/10] mb-5 overflow-hidden relative">
                  {article.coverImage ? (
                    <CoverImage
                      src={article.coverImage}
                      alt={article.title_ar}
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      thumbnail
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent-gold/10" />
                  )}
                  <div className="absolute inset-0 bg-amber-900/5 mix-blend-multiply" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-kufi mb-2">
                  {article.title_ar}
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-amiri leading-relaxed line-clamp-2">
                  {article.excerpt_ar}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            href="/ar/infallibility"
            className="group inline-flex items-center gap-2 text-base sm:text-lg text-primary dark:text-accent-gold font-bold font-amiri hover:gap-3 transition-all"
          >
            <span>تعرف على باقي الأنبياء</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
