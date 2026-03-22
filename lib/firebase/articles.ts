import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  QueryConstraint,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import type {
  Article,
  ArticleWithFallback,
  ArticleQueryOptions,
  Category,
} from "@/types";

const ARTICLES_COLLECTION = "articles";

/**
 * All valid categories
 */
export const CATEGORIES: Category[] = ["quran", "human", "divine", "behavior"];

/**
 * Fetches all published articles with optional filters
 */
export async function getArticles(
  options: ArticleQueryOptions = {}
): Promise<Article[]> {
  const {
    category,
    status = "published",
    featured,
    limit = 100,
  } = options;

  try {
    const constraints: QueryConstraint[] = [
      where("status", "==", status),
      orderBy("created_at", "desc"),
    ];

    if (category) {
      constraints.push(where("category", "==", category));
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
 * Fetches articles by category
 */
export async function getArticlesByCategory(
  category: Category,
  limit?: number
): Promise<Article[]> {
  return getArticles({
    category,
    limit,
  });
}

/**
 * Fetches articles for all categories in parallel
 * Returns a record keyed by category slug
 */
export async function getAllCategoriesArticles(
  limitPerCategory: number = 3
): Promise<Record<Category, Article[]>> {
  const results = await Promise.all(
    CATEGORIES.map((cat) => getArticlesByCategory(cat, limitPerCategory))
  );

  return {
    quran: results[0],
    human: results[1],
    divine: results[2],
    behavior: results[3],
  };
}

/**
 * Creates a new article in Firestore
 */
export async function createArticle(
  data: Omit<Article, "id" | "created_at" | "updated_at">
): Promise<string> {
  const articlesRef = collection(db, ARTICLES_COLLECTION);
  const docRef = await addDoc(articlesRef, {
    ...data,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  });
  return docRef.id;
}

/**
 * Updates an existing article in Firestore
 */
export async function updateArticle(
  id: string,
  data: Partial<Omit<Article, "id" | "created_at">>
): Promise<void> {
  const docRef = doc(db, ARTICLES_COLLECTION, id);
  // Strip undefined values — Firestore rejects them
  const cleanData: Record<string, any> = { updated_at: Timestamp.now() };
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleanData[key] = value;
    }
  }
  await updateDoc(docRef, cleanData);
}

/**
 * Deletes an article from Firestore
 */
export async function deleteArticle(id: string): Promise<void> {
  const docRef = doc(db, ARTICLES_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Fetches all articles (including drafts) for admin panel
 */
export async function getAllArticlesAdmin(): Promise<Article[]> {
  try {
    const articlesRef = collection(db, ARTICLES_COLLECTION);
    const q = query(articlesRef, orderBy("created_at", "desc"));
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
    console.error("Error fetching all articles:", error);
    return [];
  }
}

/**
 * Gets the category name in the specified language
 */
export function getCategoryName(
  category: Category,
  lang: "ar" | "en"
): string {
  const names: Record<Category, { ar: string; en: string }> = {
    quran: { ar: "أنوار القرآن", en: "Lights of the Quran" },
    human: { ar: "الإنسان", en: "The Human" },
    divine: { ar: "المعرفة الإلهية", en: "Divine Knowledge" },
    behavior: { ar: "السلوك", en: "Conduct" },
  };

  return names[category]?.[lang] || category;
}
