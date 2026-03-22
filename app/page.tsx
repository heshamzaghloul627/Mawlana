"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, Mail, Quote, Clock } from "lucide-react";
import {
  getFeaturedArticles,
  getAllCategoriesArticles,
  getCategoryName,
} from "@/lib/firebase/articles";
import type { Article, Category } from "@/types";
import type { Timestamp } from "firebase/firestore";

/* ==============================
   Animation Variants
   ============================== */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ==============================
   Utilities
   ============================== */
function formatArabicDate(timestamp: Timestamp): string {
  try {
    const date = timestamp.toDate();
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

/* ==============================
   Hero Section
   ============================== */
function HeroSection() {
  return (
    <header className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.png"
          alt=""
          className="w-full h-full object-cover opacity-60 dark:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-light/80 to-background-light dark:via-background-dark/80 dark:to-background-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-dark/30 to-primary/20 mix-blend-overlay" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Bismillah Badge */}
        <motion.div className="mb-6 inline-block" variants={scaleIn}>
          <span className="py-1.5 px-5 rounded-full border border-accent-gold/40 text-accent-gold bg-white/60 dark:bg-background-dark/50 backdrop-blur-sm text-sm font-amiri tracking-wider">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-kufi font-bold text-gray-900 dark:text-white mb-6 leading-tight drop-shadow-xl"
          variants={fadeUp}
        >
          عودة
          <span className="block text-3xl md:text-5xl font-amiri font-normal mt-4 text-primary dark:text-accent-gold opacity-90">
            عودة الإنسان إلى أصله.. إلى الله
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-xl md:text-2xl font-amiri text-gray-700 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto"
          variants={fadeUp}
        >
          استكشف أعماق ذاتك من خلال بصيرة القرآن الكريم. مساحة للتأمل،
          والارتقاء الروحي، وفهم النفس البشرية.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          variants={fadeUp}
        >
          <Link
            href="#featured"
            className="px-8 py-3 rounded-full bg-primary hover:bg-primary-dark text-white text-lg font-amiri shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1"
          >
            ابدأ الرحلة
          </Link>
          <Link
            href="#levels"
            className="px-8 py-3 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-900 dark:text-white text-lg font-amiri backdrop-blur-sm transition-all transform hover:-translate-y-1"
          >
            مراتب النفس
          </Link>
        </motion.div>
      </motion.div>

      {/* Decorative Arch Wave */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[60px] md:h-[100px]"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            className="fill-[#f6f6f8] dark:fill-[#111621]"
            d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"
          />
        </svg>
      </div>
    </header>
  );
}

/* ==============================
   Quran Quote Section
   ============================== */
function QuranQuoteBanner() {
  return (
    <section
      className="py-20 relative bg-background-light dark:bg-background-dark overflow-hidden"
      id="quran"
    >
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(#d4af37 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="rounded-2xl border border-accent-gold/20 dark:border-accent-gold/10 bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm py-14 px-8 text-center">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto mb-6" />
          <Quote className="w-8 h-8 text-accent-gold/30 mx-auto mb-5" />
          <h2 className="text-3xl md:text-5xl font-amiri leading-loose text-gray-900 dark:text-white">
            اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ
          </h2>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent mx-auto mt-6 mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wider font-amiri">
            سورة النور : ٣٥
          </p>
        </div>
      </div>
    </section>
  );
}

/* ==============================
   Featured Article (Compact Horizontal)
   ============================== */
function FeaturedArticles({ articles }: { articles: Article[] }) {
  const [first, ...rest] = articles;

  return (
    <section className="py-16 bg-background-light dark:bg-background-dark" id="featured">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-amiri font-bold text-gray-900 dark:text-white">
            مقالات مميزة
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto mt-4" />
        </div>

        {/* Primary featured article — large card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link href={`/ar/${first.category}/${first.slug_ar}`}>
            <div className="bg-white dark:bg-[#1a202e] rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row group">
              <div className="md:w-1/2 relative h-56 md:h-72">
                {first.coverImage ? (
                  <img
                    src={first.coverImage}
                    alt={first.title_ar}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent-gold/10" />
                )}
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
                <div className="absolute top-4 right-4">
                  <span className="bg-accent-gold text-background-dark text-xs font-bold px-3 py-1 rounded-full">
                    مقال مميز
                  </span>
                </div>
              </div>
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                <div className="text-xs text-primary dark:text-accent-gold font-bold mb-2">
                  {getCategoryName(first.category, "ar")}
                </div>
                <h3 className="text-2xl md:text-3xl font-amiri font-bold text-gray-900 dark:text-white mb-4 leading-relaxed">
                  {first.title_ar}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-amiri leading-loose line-clamp-3 mb-6">
                  {first.excerpt_ar}
                </p>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-2 text-primary dark:text-accent-gold font-bold font-amiri text-lg">
                    <span>اقرأ المقال</span>
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                  <div className="h-px flex-grow bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatArabicDate(first.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Additional featured articles — smaller cards */}
        {rest.length > 0 && (
          <div className={`grid gap-6 mt-8 ${rest.length === 1 ? "grid-cols-1 max-w-2xl mx-auto" : "grid-cols-1 md:grid-cols-2"}`}>
            {rest.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i + 1) * 0.15 }}
              >
                <Link href={`/ar/${article.category}/${article.slug_ar}`}>
                  <div className="bg-white dark:bg-[#1a202e] rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 group">
                    <div className="relative h-48">
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={article.title_ar}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent-gold/10" />
                      )}
                      <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
                      <div className="absolute top-3 right-3">
                        <span className="bg-accent-gold text-background-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
                          مميز
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="text-xs text-primary dark:text-accent-gold font-bold mb-1.5">
                        {getCategoryName(article.category, "ar")}
                      </div>
                      <h3 className="text-xl font-amiri font-bold text-gray-900 dark:text-white mb-2 leading-relaxed line-clamp-2">
                        {article.title_ar}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 font-amiri leading-loose line-clamp-2 text-sm mb-4">
                        {article.excerpt_ar}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-primary dark:text-accent-gold font-bold font-amiri text-sm">
                          اقرأ المقال
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatArabicDate(article.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ==============================
   Category Section (3 articles)
   ============================== */
function CategorySection({
  categorySlug,
  articles,
}: {
  categorySlug: Category;
  articles: Article[];
}) {
  const categoryName = getCategoryName(categorySlug, "ar");

  if (articles.length === 0) return null;

  return (
    <section className="py-16 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-amiri font-bold text-gray-900 dark:text-white">
              {categoryName}
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-transparent mt-2" />
          </div>
          <Link
            href={`/ar/${categorySlug}`}
            className="flex items-center gap-1 text-sm text-primary dark:text-accent-gold font-bold hover:underline"
          >
            <span>عرض المزيد</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/ar/${article.category}/${article.slug_ar}`}>
                <article className="group bg-white dark:bg-[#151b26] rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full">
                  <div className="relative h-40 overflow-hidden">
                    {article.coverImage ? (
                      <img
                        src={article.coverImage}
                        alt={article.title_ar}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent-gold/10" />
                    )}
                    <div className="absolute top-3 right-3 bg-background-dark/80 backdrop-blur-md text-white text-xs px-2.5 py-0.5 rounded-full border border-white/10">
                      {categoryName}
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-lg font-amiri font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary dark:group-hover:text-accent-gold transition-colors line-clamp-2">
                      {article.title_ar}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3 flex-grow line-clamp-2">
                      {article.excerpt_ar}
                    </p>
                    <div className="flex items-center justify-between mt-auto border-t border-gray-100 dark:border-gray-700 pt-3">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatArabicDate(article.created_at)}
                      </span>
                      <span className="text-primary dark:text-accent-gold text-sm font-bold">
                        اقرأ
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==============================
   Soul Levels Stepper
   ============================== */
function SoulLevels() {
  const levels = [
    {
      num: "١",
      name: "النفس الأمارة",
      desc: "تأمر بالسوء وتتبع الشهوات.",
      hoverBg: "group-hover:bg-red-900/20",
      hoverText: "group-hover:text-red-500",
    },
    {
      num: "٢",
      name: "النفس اللوامة",
      desc: "تلوم صاحبها على التقصير.",
      hoverBg: "group-hover:bg-orange-900/20",
      hoverText: "group-hover:text-orange-500",
    },
    {
      num: "٣",
      name: "النفس الملهمة",
      desc: "أُلهمت فجورها وتقواها.",
      hoverBg: "group-hover:bg-yellow-900/20",
      hoverText: "group-hover:text-yellow-500",
    },
    {
      num: "٤",
      name: "النفس المطمئنة",
      desc: "سكنت إلى الله ورضيت به.",
      highlighted: true,
      hoverBg: "",
      hoverText: "",
    },
    {
      num: "٥",
      name: "الراضية",
      desc: "رضيت عن الله وعن قدره.",
      hoverBg: "group-hover:bg-emerald-900/20",
      hoverText: "group-hover:text-emerald-500",
    },
    {
      num: "٦",
      name: "المرضية",
      desc: "رضي الله عنها وأرضاها.",
      hoverBg: "group-hover:bg-blue-900/20",
      hoverText: "group-hover:text-blue-500",
    },
    {
      num: "٧",
      name: "الكاملة",
      desc: "أعلى مراتب الصفاء والنور.",
      hoverBg: "group-hover:bg-accent-gold/20",
      hoverText: "group-hover:text-accent-gold",
    },
  ];

  return (
    <section
      className="py-24 bg-gray-50 dark:bg-[#0d1119] relative overflow-hidden"
      id="levels"
    >
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(#d4af37 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary dark:text-accent-gold font-amiri text-xl mb-2 block">
            رحلة الصعود
          </span>
          <h2 className="text-4xl font-amiri font-bold text-gray-900 dark:text-white">
            مراتب النفس السبع
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto mt-4" />
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 z-0 rounded-full">
            <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-primary via-accent-gold to-transparent opacity-50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            {levels.map((level) =>
              level.highlighted ? (
                <div key={level.num} className="relative group lg:-mt-6">
                  <div className="bg-primary dark:bg-primary/20 p-6 rounded-xl border border-primary shadow-xl hover:shadow-2xl transition-all z-20 relative h-full flex flex-col items-center text-center ring-4 ring-primary/10">
                    <div className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center mb-4">
                      <span className="font-bold text-xl">{level.num}</span>
                    </div>
                    <h3 className="text-xl font-bold font-amiri mb-2 text-white">
                      {level.name}
                    </h3>
                    <p className="text-sm text-white/80">{level.desc}</p>
                  </div>
                </div>
              ) : (
                <div key={level.num} className="relative group">
                  <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all z-10 relative h-full flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 ${level.hoverBg} ${level.hoverText} flex items-center justify-center mb-4 transition-colors`}
                    >
                      <span className="font-bold text-lg">{level.num}</span>
                    </div>
                    <h3 className="text-lg font-bold font-amiri mb-2 text-gray-900 dark:text-gray-100">
                      {level.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {level.desc}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==============================
   Newsletter CTA
   ============================== */
function NewsletterCTA() {
  return (
    <section className="py-24 bg-[#0b0e14] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-accent-gold/10 blur-2xl" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <Mail className="w-12 h-12 mx-auto mb-6 text-white/80" />
        <h2 className="text-3xl md:text-4xl font-amiri font-bold mb-6">
          انضم إلى قائمتنا الروحية
        </h2>
        <p className="text-lg text-white/70 mb-10 font-amiri max-w-2xl mx-auto leading-relaxed">
          استقبل رسائل أسبوعية تلامس الروح، ومقتطفات من الحكمة، وإشعارات
          بأحدث المقالات والدروس.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="flex-1 px-6 py-4 rounded-full border-none text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
            placeholder="بريدك الإلكتروني.."
            type="email"
            dir="ltr"
          />
          <button
            className="px-8 py-4 bg-primary hover:bg-primary-dark rounded-full font-bold text-white transition-all duration-300 shadow-lg shadow-primary/20"
            type="submit"
          >
            اشتراك
          </button>
        </form>
        <p className="mt-4 text-xs text-white/40">
          نحترم خصوصيتك ولا نرسل رسائل مزعجة.
        </p>
      </div>
    </section>
  );
}

/* ==============================
   Home Page
   ============================== */
export default function HomePage() {
  const [featured, setFeatured] = useState<Article[]>([]);
  const [categoryArticles, setCategoryArticles] = useState<Record<Category, Article[]>>({
    quran: [],
    human: [],
    divine: [],
    behavior: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [featuredResults, allCategories] = await Promise.all([
        getFeaturedArticles(3),
        getAllCategoriesArticles(3),
      ]);
      setFeatured(featuredResults);
      setCategoryArticles(allCategories);
      setLoading(false);
    }
    fetchData();
  }, []);

  const categories: Category[] = ["quran", "human", "divine", "behavior"];

  return (
    <main>
      <HeroSection />
      <QuranQuoteBanner />

      {!loading && featured.length > 0 && <FeaturedArticles articles={featured} />}

      {!loading &&
        categories.map((cat) => (
          <CategorySection
            key={cat}
            categorySlug={cat}
            articles={categoryArticles[cat]}
          />
        ))}

      <SoulLevels />
      <NewsletterCTA />
    </main>
  );
}
