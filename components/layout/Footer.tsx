"use client";

import Link from "next/link";
import Image from "next/image";
import { Share2, AtSign } from "lucide-react";
import logoImg from "@/public/logo.png";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0b0e14] border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src={logoImg}
            alt="عودة"
            width={64}
            height={64}
            className="rounded-full object-cover mb-4 shadow-lg shadow-primary/20"
          />
          <h3 className="text-3xl font-kufi font-bold text-gray-900 dark:text-white mb-2">
            عودة
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-amiri text-lg max-w-lg">
            مساحة إلكترونية تهدف لإحياء القلوب وإنارة العقول بنور الوحي
            والتزكية.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <Link
            href="/ar/quran"
            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent-gold transition-colors font-medium"
          >
            أنوار القرآن
          </Link>
          <Link
            href="/ar/human"
            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent-gold transition-colors font-medium"
          >
            الإنسان
          </Link>
          <Link
            href="/ar/divine"
            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent-gold transition-colors font-medium"
          >
            المعرفة الإلهية
          </Link>
          <Link
            href="/ar/behavior"
            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent-gold transition-colors font-medium"
          >
            السلوك
          </Link>
          <Link
            href="https://t.me/Awdaah"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent-gold transition-colors font-medium"
          >
            تواصل معنا
          </Link>
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
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
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
