"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import logoImg from "@/public/logo.png";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/ar/quran", label: "أنوار القرآن" },
  { href: "/ar/human", label: "الإنسان" },
  { href: "/ar/divine", label: "المعرفة الإلهية" },
  { href: "/ar/behavior", label: "السلوك" },
  { href: "/about", label: "عن مولانا" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-accent-gold px-3 py-2 text-lg font-amiri transition-colors"
              >
                {link.label}
              </Link>
            ))}
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
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-accent-gold font-amiri text-lg transition-colors rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
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
