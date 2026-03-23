"use client";

import { motion } from "framer-motion";
import { BookOpen, Heart, Sparkles, Compass, Mountain, Shield, Sun, Route, Landmark, Eye, Users } from "lucide-react";
import type { Category } from "@/types";

interface GenerativeCoverProps {
  title: string;
  category: Category;
  subtitle?: string;
  lang?: "ar" | "en";
}

const CATEGORY_CONFIG: Record<
  Category,
  {
    gradient: string;
    icon: typeof BookOpen;
    nameAr: string;
    nameEn: string;
  }
> = {
  "how-to-start": {
    gradient: "from-amber-950 via-yellow-900 to-neutral-950",
    icon: Sparkles,
    nameAr: "كيف أبدأ",
    nameEn: "How to Start",
  },
  valleys: {
    gradient: "from-emerald-950 via-emerald-900 to-neutral-950",
    icon: Mountain,
    nameAr: "الأودية السبعة",
    nameEn: "The 7 Valleys",
  },
  stations: {
    gradient: "from-indigo-950 via-indigo-900 to-neutral-950",
    icon: BookOpen,
    nameAr: "مقامات الرحلة",
    nameEn: "Spiritual Stations",
  },
  spirits: {
    gradient: "from-purple-950 via-purple-900 to-neutral-950",
    icon: Users,
    nameAr: "الأرواح ثلاثة",
    nameEn: "The Three Spirits",
  },
  quran: {
    gradient: "from-amber-950 via-yellow-900 to-neutral-950",
    icon: BookOpen,
    nameAr: "علوم القرآن",
    nameEn: "Quranic Sciences",
  },
  sunnah: {
    gradient: "from-amber-950 via-amber-900 to-neutral-950",
    icon: Sun,
    nameAr: "أنوار النبوة",
    nameEn: "Prophetic Lights",
  },
  infallibility: {
    gradient: "from-slate-900 via-slate-800 to-neutral-950",
    icon: Shield,
    nameAr: "عصمة الأنبياء",
    nameEn: "Prophets' Infallibility",
  },
  conduct: {
    gradient: "from-slate-900 via-indigo-950 to-neutral-950",
    icon: Route,
    nameAr: "السير والسلوك",
    nameEn: "Path & Conduct",
  },
  rituals: {
    gradient: "from-emerald-950 via-teal-900 to-neutral-950",
    icon: Landmark,
    nameAr: "المناسك",
    nameEn: "Rituals",
  },
  truths: {
    gradient: "from-rose-950 via-rose-900 to-neutral-950",
    icon: Eye,
    nameAr: "حقائق",
    nameEn: "Spiritual Truths",
  },
};

function GeometricOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="cover-geo"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0 L44 16 L60 20 L44 24 L40 40 L36 24 L20 20 L36 16Z"
            fill="#C5A059"
            opacity="0.6"
          />
          <circle cx="0" cy="0" r="1.5" fill="#C5A059" opacity="0.4" />
          <circle cx="80" cy="0" r="1.5" fill="#C5A059" opacity="0.4" />
          <circle cx="0" cy="80" r="1.5" fill="#C5A059" opacity="0.4" />
          <circle cx="80" cy="80" r="1.5" fill="#C5A059" opacity="0.4" />
          <circle cx="40" cy="40" r="1" fill="#C5A059" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cover-geo)" />
    </svg>
  );
}

export default function GenerativeCover({
  title,
  category,
  subtitle,
  lang = "ar",
}: GenerativeCoverProps) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.quran;
  const Icon = config.icon;
  const categoryName = lang === "ar" ? config.nameAr : config.nameEn;

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br ${config.gradient}`}
      style={{ minHeight: "60vh" }}
    >
      <GeometricOverlay />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: -12 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <Icon
            className="text-gold/[0.05]"
            style={{ width: "24rem", height: "24rem" }}
            strokeWidth={0.5}
          />
        </motion.div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(197,160,89,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 text-gold/70 text-sm tracking-wider">
            <Icon className="w-4 h-4" />
            <span className="font-amiri">{categoryName}</span>
          </span>
        </motion.div>

        <motion.h1
          className="font-amiri text-4xl md:text-5xl lg:text-6xl font-bold text-gold leading-relaxed max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          lang={lang}
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="mt-6 text-lg md:text-xl text-white/60 font-crimson max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #FDFBF7 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
