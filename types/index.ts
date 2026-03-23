import { Timestamp } from "firebase/firestore";

/**
 * Article category types
 */
export type Category =
  | "how-to-start"
  | "valleys"
  | "stations"
  | "spirits"
  | "quran"
  | "sunnah"
  | "infallibility"
  | "conduct"
  | "rituals"
  | "truths";

/**
 * Article status
 */
export type ArticleStatus = "draft" | "published";

/**
 * SEO metadata structure
 */
export interface SEOMeta {
  title: string;
  description: string;
  keywords: string[];
}

/**
 * Tiptap JSON content structure
 * This is a simplified type - actual Tiptap JSON can be more complex
 */
export interface TiptapContent {
  type: string;
  content?: TiptapContent[];
  attrs?: Record<string, any>;
  marks?: Array<{
    type: string;
    attrs?: Record<string, any>;
  }>;
  text?: string;
}

/**
 * Main Article interface matching Firestore schema
 */
export interface Article {
  id: string;

  // Slugs for URL routing
  slug_ar: string;
  slug_en: string;

  // Titles
  title_ar: string;
  title_en: string | null;

  // Excerpts/Descriptions
  excerpt_ar: string;
  excerpt_en: string | null;

  // Main content (Tiptap JSON)
  content_ar: TiptapContent;
  content_en: TiptapContent | null;

  // Article metadata
  category: Category;
  status: ArticleStatus;
  featured: boolean;

  // Versioning
  version_ar: number;
  version_en: number;

  // Timestamps
  created_at: Timestamp;
  updated_at: Timestamp;

  // Author info
  author: string;

  // Cover image URL
  coverImage?: string | null;

  // SEO
  seo_meta_ar: SEOMeta;
  seo_meta_en: SEOMeta | null;
}

/**
 * Article with fallback flag for missing translations
 */
export interface ArticleWithFallback extends Article {
  fallback?: boolean;
  fallbackLanguage?: "ar" | "en";
}

/**
 * Query options for fetching articles
 */
export interface ArticleQueryOptions {
  lang?: "ar" | "en";
  category?: Category;
  status?: ArticleStatus;
  featured?: boolean;
  limit?: number;
}

/**
 * Comment status
 */
export type CommentStatus = "pending" | "approved" | "rejected";

/**
 * Comment on an article
 */
export interface Comment {
  id: string;
  articleId: string;
  articleTitle: string;
  articleSlug: string;
  articleCategory: string;
  name: string;
  email: string;
  text: string;
  status: CommentStatus;
  adminReply?: string;
  adminRepliedAt?: Timestamp;
  created_at: Timestamp;
}

/**
 * Site metadata
 */
export interface SiteMetadata {
  telegram_link: string;
  hero_quote_ar: string;
  hero_quote_en: string;
  categories: {
    [key in Category]: {
      name_ar: string;
      name_en: string;
      description_ar: string;
      description_en: string;
    };
  };
}
