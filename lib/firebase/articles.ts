import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";
import type {
  Article,
  ArticleWithFallback,
  ArticleQueryOptions,
  Pillar,
} from "@/types";

const ARTICLES_COLLECTION = "articles";

/**
 * Fetches all published articles with optional filters
 */
export async function getArticles(
  options: ArticleQueryOptions = {}
): Promise<Article[]> {
  const {
    pillar,
    status = "published",
    featured,
    limit = 100,
  } = options;

  try {
    const constraints: QueryConstraint[] = [
      where("status", "==", status),
      orderBy("created_at", "desc"),
    ];

    if (pillar) {
      constraints.push(where("pillar", "==", pillar));
    }

    if (featured !== undefined) {
      constraints.push(where("featured", "==", featured));
    }

    if (limit) {
      constraints.push(firestoreLimit(limit));
    }

    const articlesRef = collection(db, ARTICLES_COLLECTION);
    const q = query(articlesRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const articles: Article[] = [];
    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data(),
      } as Article);
    });

    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

/**
 * Fetches a single article by slug with smart fallback logic
 * If the requested language content is missing, it returns the Arabic content
 * with a fallback flag
 */
export async function getArticleBySlug(
  slug: string,
  lang: "ar" | "en" = "ar"
): Promise<ArticleWithFallback | null> {
  try {
    // Search for article by slug
    const articlesRef = collection(db, ARTICLES_COLLECTION);
    const slugField = lang === "ar" ? "slug_ar" : "slug_en";

    const q = query(
      articlesRef,
      where(slugField, "==", slug),
      where("status", "==", "published"),
      firestoreLimit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`No article found with slug: ${slug}`);
      return null;
    }

    const docSnapshot = querySnapshot.docs[0];
    const article = {
      id: docSnapshot.id,
      ...docSnapshot.data(),
    } as Article;

    // Smart fallback logic
    if (lang === "en" && !article.content_en) {
      // English requested but not available - return Arabic with fallback flag
      return {
        ...article,
        fallback: true,
        fallbackLanguage: "ar",
      };
    }

    return article;
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return null;
  }
}

/**
 * Fetches a single article by ID
 */
export async function getArticleById(
  id: string
): Promise<Article | null> {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      console.warn(`No article found with ID: ${id}`);
      return null;
    }

    return {
      id: docSnapshot.id,
      ...docSnapshot.data(),
    } as Article;
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    return null;
  }
}

/**
 * Fetches featured articles for homepage
 */
export async function getFeaturedArticles(
  limit: number = 3
): Promise<Article[]> {
  return getArticles({
    featured: true,
    limit,
  });
}

/**
 * Fetches articles by pillar
 */
export async function getArticlesByPillar(
  pillar: Pillar,
  limit?: number
): Promise<Article[]> {
  return getArticles({
    pillar,
    limit,
  });
}

/**
 * Gets the pillar name in the specified language
 */
export function getPillarName(
  pillar: Pillar,
  lang: "ar" | "en"
): string {
  const names: Record<Pillar, { ar: string; en: string }> = {
    body: { ar: "الجسد", en: "The Vessel" },
    self: { ar: "النفس", en: "The Self" },
    intellect: { ar: "العقل", en: "The Intellect" },
    spirit: { ar: "الروح", en: "The Spirit" },
  };

  return names[pillar][lang];
}
