"use client";

import { motion } from "framer-motion";
import Pillars from "@/components/home/Pillars";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8 px-6">
          <motion.h1
            className="text-4xl font-bold text-gold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0.7, 1, 0.7], y: 0 }}
            transition={{
              opacity: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
              y: {
                duration: 1,
                ease: "easeOut",
              },
            }}
          >
            محراب الروح
          </motion.h1>

          <motion.p
            className="text-xl text-charcoal-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            مخطوطة رقمية حية
          </motion.p>

          <motion.div
            className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />

          <motion.p
            className="text-lg font-crimson text-charcoal-light"
            lang="en"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            The Road to Truth
          </motion.p>

          <motion.p
            className="text-base text-charcoal-light max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            منصة معرفية روحية تهدف لنشر العلم اللدني وتعريف الإنسان بمراتب تطوره الأربعة:
            الجسد، النفس، العقل، والروح
          </motion.p>
        </div>
      </section>

      {/* Pillars Section - Fades in after Hero animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
      >
        <Pillars />
      </motion.div>
    </main>
  );
}
