"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import ArticleClient from "@/components/article/ArticleClient";
import type { Category } from "@/types";
import { CATEGORIES } from "@/lib/firebase/articles";

const VALID_LANGS = ["ar", "en"];

export default function NotFound() {
  const pathname = usePathname();
  const segments = pathname.replace(/\/+$/, "").split("/").filter(Boolean);

  // Check if URL matches article pattern: /lang/category/slug
  if (
    segments.length === 3 &&
    VALID_LANGS.includes(segments[0]) &&
    CATEGORIES.includes(segments[1] as Category)
  ) {
    return (
      <ArticleClient
        langOverride={segments[0]}
        categoryOverride={segments[1]}
        slugOverride={segments[2]}
      />
    );
  }

  // Standard 404 UI
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="text-center space-y-6 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-6xl text-primary/40">404</p>
        <p className="text-2xl text-slate-900 dark:text-white font-amiri font-bold">ضللت الطريق</p>
        <p className="text-lg font-crimson text-slate-500 dark:text-gray-400" lang="en">
          Lost on the Path
        </p>
        <p className="text-base text-slate-500 dark:text-gray-400">
          الصفحة التي تبحث عنها غير موجودة
        </p>
        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
        <Link
          href="/"
          className="inline-block text-primary hover:text-primary-dark transition-colors duration-500 border-b border-primary/50 hover:border-primary pb-1"
        >
          العودة إلى الرئيسية
        </Link>
      </motion.div>
    </div>
  );
}
