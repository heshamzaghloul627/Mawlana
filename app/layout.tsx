import type { Metadata } from "next";
import { Amiri } from "next/font/google";
import { Crimson_Pro } from "next/font/google";
import "./globals.css";
import Atmosphere from "@/components/ui/Atmosphere";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-crimson",
});

export const metadata: Metadata = {
  title: "محراب الروح | Mihrab Al-Ruh",
  description: "مخطوطة رقمية حية - A Living Digital Manuscript",
  openGraph: {
    title: "محراب الروح | Mihrab Al-Ruh",
    description: "The Road to Truth - Spiritual Knowledge Platform",
    locale: "ar_SA",
    alternateLocale: ["en_US"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${crimsonPro.variable}`}>
      <body className="font-amiri text-charcoal antialiased">
        <Atmosphere />
        <div className="relative z-0">
          {children}
        </div>
      </body>
    </html>
  );
}
