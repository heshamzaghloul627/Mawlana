import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1754cf",
          dark: "#0f3a9a",
        },
        "accent-gold": {
          DEFAULT: "#d4af37",
        },
        "background-light": "#f6f6f8",
        "background-dark": "#111621",
        // Keep bg-light/bg-dark aliases for compatibility
        "bg-light": "#f6f6f8",
        "bg-dark": "#111621",
        warm: {
          50: "#faf6f1",
          100: "#f3ebe0",
          200: "#e8d5be",
          300: "#d4b896",
          400: "#c4a47a",
          500: "#a68557",
          600: "#8b6d42",
          700: "#6e5535",
          800: "#4a3a25",
          900: "#2e2418",
        },
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
          dark: "#064e3b",
        },
      },
      fontFamily: {
        amiri: ["var(--font-amiri)", "serif"],
        kufi: ["var(--font-kufi)", "sans-serif"],
        crimson: ["var(--font-crimson)", "Georgia", "serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "1rem",
        full: "9999px",
      },
      boxShadow: {
        nur: "0 0 40px -10px rgba(23, 84, 207, 0.15)",
        gold: "0 0 20px -5px rgba(212, 175, 55, 0.3)",
        verse: "0 0 30px -5px rgba(212, 175, 55, 0.15)",
        "floating-nav": "0 10px 40px -10px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "drift-slow": "drift 20s ease-in-out infinite",
        "drift-reverse": "drift-reverse 25s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "expand-line": "expand-line 1.5s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(30px, -20px) rotate(5deg)" },
          "66%": { transform: "translate(-20px, 15px) rotate(-3deg)" },
        },
        "drift-reverse": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(-25px, 20px) rotate(-4deg)" },
          "66%": { transform: "translate(15px, -25px) rotate(6deg)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "expand-line": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
