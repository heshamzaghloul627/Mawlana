import type { Metadata } from "next";
import { getArticles, getArticleBySlug } from "@/lib/firebase/articles";
import ArticleClient from "@/components/article/ArticleClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getArticles();
  const params: { lang: string; category: string; slug: string }[] = [];

  for (const article of articles) {
    if (article.slug_ar && article.category) {
      params.push({ lang: "ar", category: article.category, slug: article.slug_ar });
    }
    if (article.slug_en && article.category) {
      params.push({ lang: "en", category: article.category, slug: article.slug_en });
    }
  }

  // Must have at least one param for output: 'export'
  if (params.length === 0) {
    params.push({ lang: "ar", category: "quran", slug: "placeholder" });
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = await getArticleBySlug(
    decodeURIComponent(slug),
    lang as "ar" | "en"
  );

  if (!article) {
    return { title: "عودة | The Return" };
  }

  const title =
    lang === "en" && article.title_en ? article.title_en : article.title_ar;
  const description =
    lang === "en" && article.excerpt_en
      ? article.excerpt_en
      : article.excerpt_ar;

  return {
    title: `${title} | عودة`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: lang === "ar" ? "ar_SA" : "en_US",
      siteName: "عودة | The Return",
      ...(article.coverImage && {
        images: [
          {
            url: article.coverImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: article.coverImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(article.coverImage && { images: [article.coverImage] }),
    },
  };
}

export default function ArticlePage() {
  return <ArticleClient />;
}
