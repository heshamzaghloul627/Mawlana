"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ReaderProps {
  title: string;
  content: React.ReactNode;
  author?: string;
  pillar?: string;
  lang?: "ar" | "en";
  telegramLink?: string;
}

export default function Reader({
  title,
  content,
  author = "مؤلف مجهول",
  pillar = "spirit",
  lang = "ar",
  telegramLink = "https://t.me/mihrab_al_ruh",
}: ReaderProps) {
  const [showHeader, setShowHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();

  // Detect scroll direction - show header only when scrolling UP
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < 100) {
      setShowHeader(false);
    } else if (latest < lastScrollY) {
      // Scrolling up
      setShowHeader(true);
    } else {
      // Scrolling down
      setShowHeader(false);
    }
    setLastScrollY(latest);
  });

  return (
    <article className="min-h-screen" lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Sticky Minimal Header - Appears only when scrolling UP */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 spiritual-glass border-b border-gold/10"
        initial={{ y: -100 }}
        animate={{ y: showHeader ? 0 : -100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Back Button */}
          <Link
            href={lang === "ar" ? "/ar" : "/en"}
            className="flex items-center gap-2 text-charcoal-light hover:text-gold transition-colors duration-300"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-sm">رجوع</span>
          </Link>

          {/* Language Toggle */}
          <Link
            href={lang === "ar" ? "/en" : "/ar"}
            className="flex items-center gap-2 text-charcoal-light hover:text-gold transition-colors duration-300"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm">{lang === "ar" ? "EN" : "AR"}</span>
          </Link>
        </div>
      </motion.header>

      {/* Main Reading Area */}
      <div className="reading-container py-24">
        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {title}
        </motion.h1>

        {/* Pillar Badge */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald/30 text-emerald text-sm">
            <span>{getPillarName(pillar, lang)}</span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="prose prose-lg max-w-none text-xl leading-loose text-charcoal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {content}
        </motion.div>

        {/* Signature Block */}
        <Signature author={author} telegramLink={telegramLink} lang={lang} />
      </div>
    </article>
  );
}

function Signature({
  author,
  telegramLink,
  lang,
}: {
  author: string;
  telegramLink: string;
  lang: "ar" | "en";
}) {
  return (
    <motion.div
      className="mt-20 pt-12 border-t border-gold/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1 }}
    >
      {/* Author */}
      <div className="text-center mb-6">
        <p className="text-lg text-charcoal-light">
          {lang === "ar" ? "كتبه: " : "Written by: "}
          <span className="text-gold font-semibold">{author}</span>
        </p>
      </div>

      {/* Separator */}
      <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />

      {/* Quiet Call to Action */}
      <div className="text-center">
        <p className="text-base text-charcoal-light mb-3">
          {lang === "ar"
            ? "إذا أردت أن تسير معنا في هذا الطريق، فاصحبنا في محراب الحوار"
            : "If you wish to walk this path with us, join us in the niche of dialogue"}
        </p>
        <Link
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-gold hover:text-emerald transition-colors duration-500 border-b border-gold/50 hover:border-emerald pb-1"
        >
          {lang === "ar" ? "محراب الحوار على تيليجرام" : "Dialogue Niche on Telegram"}
        </Link>
      </div>

      {/* Watermark */}
      <div className="text-center mt-8 text-xs text-charcoal-light/50">
        <p>{lang === "ar" ? "محراب الروح • مخطوطة رقمية حية" : "Mihrab Al-Ruh • A Living Digital Manuscript"}</p>
      </div>
    </motion.div>
  );
}

function getPillarName(pillar: string, lang: "ar" | "en"): string {
  const names: Record<string, { ar: string; en: string }> = {
    body: { ar: "الجسد", en: "The Vessel" },
    self: { ar: "النفس", en: "The Self" },
    intellect: { ar: "العقل", en: "The Intellect" },
    spirit: { ar: "الروح", en: "The Spirit" },
  };
  return names[pillar]?.[lang] || names.spirit[lang];
}
