import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#FDFBF7",
          dark: "#F5F2EB",
        },
        charcoal: {
          DEFAULT: "#2D2D2D",
          light: "#4A4A4A",
        },
        gold: {
          DEFAULT: "#C5A059",
          light: "rgba(197, 160, 89, 0.1)",
          medium: "rgba(197, 160, 89, 0.3)",
        },
        emerald: {
          DEFAULT: "#059669",
          light: "#10B981",
          dark: "#047857",
        },
      },
      fontFamily: {
        amiri: ["var(--font-amiri)", "serif"],
        crimson: ["var(--font-crimson)", "Georgia", "serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.6" }],
        base: ["1.125rem", { lineHeight: "1.8" }],
        lg: ["1.25rem", { lineHeight: "1.8" }],
        xl: ["1.5rem", { lineHeight: "2" }],
        "2xl": ["2rem", { lineHeight: "2.2" }],
        "3xl": ["2.5rem", { lineHeight: "2.2" }],
        "4xl": ["3rem", { lineHeight: "2" }],
      },
      animation: {
        "slow-pan": "slow-pan 60s ease-in-out infinite",
        breathe: "breathe 8s ease-in-out infinite",
        "float-slow": "float-slow 20s ease-in-out infinite",
        "glow-pulse": "glow-pulse 6s ease-in-out infinite",
      },
      keyframes: {
        "slow-pan": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(2%, 3%)" },
          "50%": { transform: "translate(-1%, 2%)" },
          "75%": { transform: "translate(3%, -2%)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        "float-slow": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
        },
        "glow-pulse": {
          "0%, 100%": {
            opacity: "0.2",
            filter: "blur(40px)",
          },
          "50%": {
            opacity: "0.4",
            filter: "blur(60px)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
