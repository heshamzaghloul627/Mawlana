"use client";

import Link from "next/link";
import Image from "next/image";
import { Share2, AtSign } from "lucide-react";
import { CATEGORY_CONFIG } from "@/lib/categories";
import logoImg from "@/public/logo.png";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0b0e14] border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top: Logo + Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={logoImg}
                alt="عودة"
                width={48}
                height={48}
                className="rounded-full object-cover shadow-lg shadow-primary/20"
              />
              <h3 className="text-3xl font-kufi font-bold text-gray-900 dark:text-white">
                عودة
              </h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-amiri text-base leading-relaxed text-center md:text-right">
              مساحة إلكترونية تهدف لإحياء القلوب وإنارة العقول بنور الوحي
              والتزكية.
            </p>
          </div>

          {/* All Categories - 2 columns */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-bold text-primary dark:text-accent-gold uppercase tracking-widest mb-4 text-center md:text-right">
              العلوم الإلهية
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {CATEGORY_CONFIG.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/ar/${cat.slug}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent-gold transition-colors text-sm font-medium py-1"
                >
                  {cat.name_ar}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-bold text-primary dark:text-accent-gold uppercase tracking-widest mb-4 text-center md:text-right">
              روابط سريعة
            </h4>
            <div className="flex flex-col gap-2 items-center md:items-start">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent-gold transition-colors text-sm font-medium py-1"
              >
                الرئيسية
              </Link>
              <Link
                href="/about"
                className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent-gold transition-colors text-sm font-medium py-1"
              >
                عن مولانا
              </Link>
              <Link
                href="https://t.me/Awdaah"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent-gold transition-colors text-sm font-medium py-1"
              >
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-12">
          <Link
            href="https://t.me/Awdaah"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-accent-gold dark:hover:text-background-dark transition-all"
          >
            <Share2 className="w-4 h-4" />
          </Link>
          <Link
            href="#"
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-accent-gold dark:hover:text-background-dark transition-all"
          >
            <AtSign className="w-4 h-4" />
          </Link>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            &copy; ٢٠٢٥ عودة. جميع الحقوق محفوظة.
          </p>
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
            صُمم بحب وسلام.
          </p>
        </div>
      </div>
    </footer>
  );
}
