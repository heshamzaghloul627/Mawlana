"use client";

import { motion } from "framer-motion";
import { Activity, Heart, BrainCircuit, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";

const pillars = [
  {
    id: "body",
    titleAr: "الجسد",
    titleEn: "The Vessel",
    descriptionAr: "عالم الطين والغرائز",
    descriptionEn: "The realm of clay and instincts",
    icon: Activity,
    href: "/ar/body",
  },
  {
    id: "self",
    titleAr: "النفس",
    titleEn: "The Self",
    descriptionAr: "ميدان المجاهدة والتزكية",
    descriptionEn: "The battlefield of purification",
    icon: Heart,
    href: "/ar/self",
  },
  {
    id: "intellect",
    titleAr: "العقل",
    titleEn: "The Intellect",
    descriptionAr: "تصحيح المفاهيم والعقيدة",
    descriptionEn: "Correcting concepts and creed",
    icon: BrainCircuit,
    href: "/ar/intellect",
  },
  {
    id: "spirit",
    titleAr: "الروح",
    titleEn: "The Spirit",
    descriptionAr: "عالم الأمر والسر الإلهي",
    descriptionEn: "The realm of divine command",
    icon: Sparkles,
    href: "/ar/spirit",
  },
];

export default function Pillars() {
  return (
    <section className="reading-container py-20">
      {/* Section Title */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-charcoal mb-4">
          مراتب الإنسان الأربعة
        </h2>
        <p className="text-base text-charcoal-light font-crimson" lang="en">
          The Four Ranks of Human Development
        </p>
      </motion.div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {pillars.map((pillar, index) => (
          <PillarCard key={pillar.id} pillar={pillar} index={index} />
        ))}
      </div>

      {/* The Fifth Pillar - The Niche */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
      >
        <Link
          href="https://t.me/mihrab_al_ruh"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 text-lg text-charcoal-light hover:text-gold transition-colors duration-500"
        >
          <MessageCircle className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="border-b border-transparent group-hover:border-gold transition-all duration-500">
            ادخل إلى المحراب
          </span>
          <span className="text-sm font-crimson opacity-60" lang="en">
            Enter the Niche
          </span>
        </Link>
      </motion.div>
    </section>
  );
}

function PillarCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const Icon = pillar.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.5 + index * 0.2,
        ease: "easeOut",
      }}
    >
      <Link href={pillar.href}>
        <motion.div
          className="group relative p-8 rounded-lg border border-gold/20 bg-ivory/50 backdrop-blur-sm overflow-hidden"
          whileHover="hover"
          initial="initial"
        >
          {/* Hover Background Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gold-light to-transparent opacity-0"
            variants={{
              initial: { opacity: 0 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Content */}
          <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
            {/* Icon */}
            <motion.div
              className="mb-6"
              variants={{
                initial: { scale: 1 },
                hover: { scale: 1.1 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Icon className="w-12 h-12 text-gold opacity-70 group-hover:opacity-100 transition-opacity duration-500 mx-auto" />
            </motion.div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gold mb-2">{pillar.titleAr}</h3>
            <p className="text-lg font-crimson text-charcoal-light mb-4" lang="en">
              {pillar.titleEn}
            </p>

            {/* Description */}
            <p className="text-base text-charcoal-light leading-relaxed">
              {pillar.descriptionAr}
            </p>
            <p className="text-sm font-crimson text-charcoal-light/80 mt-2" lang="en">
              {pillar.descriptionEn}
            </p>
          </div>

          {/* Hover Border Effect */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-gold pointer-events-none"
            variants={{
              initial: { opacity: 0 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              boxShadow: "inset 0 0 30px rgba(197, 160, 89, 0.2)",
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
