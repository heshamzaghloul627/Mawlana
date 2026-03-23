"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Mail, Quote } from "lucide-react";
import { getAllCategoriesArticles } from "@/lib/firebase/articles";
import type { Article, Category } from "@/types";
import {
  HowToStartSection,
  ValleysSection,
  StationsSection,
  SpiritsSection,
  QuranSection,
  SunnahSection,
  InfallibilitySection,
  ConductSection,
  RitualsSection,
  TruthsSection,
  LatestArticlesSection,
} from "@/components/home/sections";

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
            رحلة باطنية للعودة الي الصبغة الالهية
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
  const [categoryArticles, setCategoryArticles] = useState<Record<Category, Article[]> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const allCategories = await getAllCategoriesArticles(3);
        setCategoryArticles(allCategories);
      } catch (err) {
        console.error("Error fetching category articles:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const articles = categoryArticles;

  return (
    <main>
      <HeroSection />
      <QuranQuoteBanner />

      {/* احدث الأنوار — Latest Articles */}
      <LatestArticlesSection />

      {/* Category Sections */}
      {!loading && articles && (
        <>
          <HowToStartSection articles={articles["how-to-start"]} />
          <ValleysSection articles={articles["valleys"]} />
          <StationsSection articles={articles["stations"]} />
          <SpiritsSection articles={articles["spirits"]} />
          <QuranSection articles={articles["quran"]} />
          <SunnahSection articles={articles["sunnah"]} />
          <InfallibilitySection articles={articles["infallibility"]} />
          <ConductSection articles={articles["conduct"]} />
          <RitualsSection articles={articles["rituals"]} />
          <TruthsSection articles={articles["truths"]} />
        </>
      )}

      <SoulLevels />
      <NewsletterCTA />
    </main>
  );
}
