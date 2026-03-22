import type { Metadata } from "next";
import { Amiri, Tajawal, Crimson_Pro } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";
import ThemeProvider from "@/components/ThemeProvider";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-kufi",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-crimson",
});

export const metadata: Metadata = {
  title: "عودة | The Return",
  description: "عودة الإنسان إلى أصله.. إلى الله",
  openGraph: {
    title: "عودة | The Return",
    description: "رحلتك من كثافة الطين إلى لطافة النور",
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
    <html
      lang="ar"
      dir="rtl"
      className={`dark ${amiri.variable} ${tajawal.variable} ${crimsonPro.variable}`}
      suppressHydrationWarning
    >
      <body className="font-amiri antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("awdah-theme")==="light"){document.documentElement.classList.remove("dark")}}catch(e){}`,
          }}
        />
        <ThemeProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
