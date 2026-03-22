"use client";

import { motion } from "framer-motion";

export default function FallbackBanner() {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] border-b text-center py-3 text-sm backdrop-blur-sm bg-primary/5 border-b-primary/20 text-primary-dark"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="font-crimson" lang="en">
        Translation pending — showing the original Arabic manuscript
      </span>
    </motion.div>
  );
}
