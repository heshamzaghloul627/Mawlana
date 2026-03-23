import type { Category } from "@/types";

export interface CategoryInfo {
  slug: Category;
  name_ar: string;
  name_en: string;
  icon: string;
  description_ar: string;
}

export const CATEGORY_CONFIG: CategoryInfo[] = [
  {
    slug: "how-to-start",
    name_ar: "كيف أبدأ",
    name_en: "How to Start",
    icon: "Sparkles",
    description_ar: "دليل المبتدئين في طريق المعرفة الإلهية",
  },
  {
    slug: "valleys",
    name_ar: "الأودية السبعة",
    name_en: "The 7 Valleys",
    icon: "Mountain",
    description_ar: "رحلة الروح عبر أودية الطلب والعشق والمعرفة",
  },
  {
    slug: "stations",
    name_ar: "مقامات الرحلة",
    name_en: "Spiritual Stations",
    icon: "BookOpen",
    description_ar: "مقامات السالكين من التوبة إلى الرضا",
  },
  {
    slug: "spirits",
    name_ar: "الأرواح ثلاثة",
    name_en: "The Three Spirits",
    icon: "Users",
    description_ar: "فهم لطائف النفس البشرية ومراتب الترقي الروحي",
  },
  {
    slug: "quran",
    name_ar: "علوم القرآن",
    name_en: "Quranic Sciences",
    icon: "BookMarked",
    description_ar: "التفسير الإشاري وأسرار الآيات القرآنية",
  },
  {
    slug: "sunnah",
    name_ar: "أنوار النبوة",
    name_en: "Prophetic Lights",
    icon: "Sun",
    description_ar: "الهدي النبوي وفقه القلوب في الأحاديث الشريفة",
  },
  {
    slug: "infallibility",
    name_ar: "عصمة الأنبياء",
    name_en: "Prophets' Infallibility",
    icon: "Shield",
    description_ar: "تنزيه مقام النبوة والرد على الشبهات",
  },
  {
    slug: "conduct",
    name_ar: "السير والسلوك",
    name_en: "Path & Conduct",
    icon: "Route",
    description_ar: "آداب الطريق وأوراد المريد والمجاهدة",
  },
  {
    slug: "rituals",
    name_ar: "المناسك",
    name_en: "Rituals",
    icon: "Landmark",
    description_ar: "الأسرار الروحية للصلاة والصيام والحج",
  },
  {
    slug: "truths",
    name_ar: "حقائق",
    name_en: "Spiritual Truths",
    icon: "Eye",
    description_ar: "خلاصات التجارب الذوقية والمعارف اللدنية",
  },
];

/**
 * Get category info by slug
 */
export function getCategoryInfo(slug: Category): CategoryInfo | undefined {
  return CATEGORY_CONFIG.find((c) => c.slug === slug);
}

/**
 * Get all category slugs
 */
export function getAllCategorySlugs(): Category[] {
  return CATEGORY_CONFIG.map((c) => c.slug);
}
