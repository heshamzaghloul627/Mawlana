"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Mountain,
  BookOpen,
  Users,
  BookMarked,
  Sun as SunIcon,
  Shield,
  Route,
  Landmark,
  Eye,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { CATEGORY_CONFIG } from "@/lib/categories";
import logoImg from "@/public/logo.png";

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Mountain: <Mountain className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  BookMarked: <BookMarked className="w-5 h-5" />,
  Sun: <SunIcon className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Route: <Route className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
  Eye: <Eye className="w-5 h-5" />,
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const { theme, toggleTheme } = useTheme();

  // Close mobile menu on route change (resize)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMegaEnter = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setMegaMenuOpen(true);
  };

  const handleMegaLeave = () => {
    megaMenuTimeout.current = setTimeout(() => setMegaMenuOpen(false), 150);
  };

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-background-dark/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3">
            <Image
              src={logoImg}
              alt="عودة"
              width={40}
              height={40}
              className="rounded-full object-cover shadow-lg shadow-primary/20"
            />
            <span className="text-2xl font-kufi font-bold text-gray-900 dark:text-white tracking-wide">
              عودة
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 space-x-reverse items-center">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-accent-gold px-3 py-2 text-lg font-amiri transition-colors"
            >
              الرئيسية
            </Link>

            {/* العلوم الإلهية - Mega Menu */}
            <div
              className="relative"
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
            >
              <button
                className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-accent-gold px-3 py-2 text-lg font-amiri transition-colors"
              >
                <span>العلوم الإلهية</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    megaMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 w-[580px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl transition-all duration-300 p-6 grid grid-cols-2 gap-x-8 gap-y-1 rounded-lg ${
                  megaMenuOpen
                    ? "visible opacity-100 translate-y-0"
                    : "invisible opacity-0 -translate-y-2"
                }`}
              >
                {CATEGORY_CONFIG.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/ar/${cat.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-r-2 border-transparent hover:border-primary"
                    onClick={() => setMegaMenuOpen(false)}
                  >
                    <span className="text-primary dark:text-accent-gold">
                      {iconMap[cat.icon]}
                    </span>
                    <div>
                      <span className="text-gray-900 dark:text-white font-amiri text-base font-medium">
                        {cat.name_ar}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {cat.description_ar}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/about"
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-accent-gold px-3 py-2 text-lg font-amiri transition-colors"
            >
              عن مولانا
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-accent-gold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              aria-label="تبديل المظهر"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* EN */}
            <Link
              href="/en"
              className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-semibold text-sm"
            >
              EN
            </Link>

            {/* تواصل معنا */}
            <Link
              href="https://t.me/Awdaah"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex bg-primary/10 dark:bg-accent-gold/10 text-primary dark:text-accent-gold border border-primary/20 dark:border-accent-gold/20 px-4 py-2 rounded-full font-amiri text-lg hover:bg-primary hover:text-white dark:hover:bg-accent-gold dark:hover:text-background-dark transition-all duration-300"
            >
              تواصل معنا
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="القائمة"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/"
              className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-accent-gold font-amiri text-lg transition-colors rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              الرئيسية
            </Link>

            {/* Categories Accordion */}
            <div>
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-accent-gold font-amiri text-lg transition-colors rounded-lg"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                <span>العلوم الإلهية</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    categoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {categoriesOpen && (
                <div className="mr-4 border-r-2 border-primary/20 space-y-0.5 pb-2">
                  {CATEGORY_CONFIG.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/ar/${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-accent-gold font-amiri text-base transition-colors rounded-lg"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="text-primary/60 dark:text-accent-gold/60">
                        {iconMap[cat.icon]}
                      </span>
                      <span>{cat.name_ar}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-accent-gold font-amiri text-lg transition-colors rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              عن مولانا
            </Link>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3 space-y-1">
              <Link
                href="https://t.me/Awdaah"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 text-primary dark:text-accent-gold font-amiri text-lg"
                onClick={() => setMobileOpen(false)}
              >
                تواصل معنا
              </Link>
              <Link
                href="/en"
                className="block px-4 py-3 text-gray-600 dark:text-gray-300 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                English
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
