"use client";

import { motion } from "framer-motion";
import { generatePaperGrain, generateGeometricPattern } from "@/lib/utils/patterns";

export default function Atmosphere() {

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base Ivory Background */}
      <div className="absolute inset-0 bg-ivory" />

      {/* Paper Grain Texture */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `url("${generatePaperGrain()}")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Geometric Pattern Overlay */}
      <motion.div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `url("${generateGeometricPattern()}")`,
          backgroundRepeat: "repeat",
          willChange: "transform",
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Divine Light Orb 1 - Golden Glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(197, 160, 89, 0.25) 0%, transparent 70%)",
          filter: "blur(60px)",
          willChange: "transform, opacity",
        }}
        initial={{ x: "20%", y: "10%", opacity: 0.2 }}
        animate={{
          x: ["20%", "25%", "15%", "20%"],
          y: ["10%", "20%", "5%", "10%"],
          opacity: [0.2, 0.3, 0.25, 0.2],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Divine Light Orb 2 - Emerald Accent */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(5, 150, 105, 0.15) 0%, transparent 70%)",
          filter: "blur(50px)",
          willChange: "transform, opacity",
        }}
        initial={{ x: "70%", y: "60%", opacity: 0.15 }}
        animate={{
          x: ["70%", "75%", "68%", "70%"],
          y: ["60%", "65%", "55%", "60%"],
          opacity: [0.15, 0.25, 0.18, 0.15],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Subtle Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(45, 45, 45, 0.03) 100%)",
        }}
      />

      {/* Breathing Light Effect at Top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[300px]"
        style={{
          background: "linear-gradient(to bottom, rgba(197, 160, 89, 0.08), transparent)",
          willChange: "opacity",
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
