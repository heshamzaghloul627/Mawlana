import CategoryClient from "@/components/category/CategoryClient";

export const dynamicParams = false;

export function generateStaticParams() {
  const langs = ["ar", "en"];
  const categories = ["quran", "human", "divine", "behavior"];

  return langs.flatMap((lang) =>
    categories.map((category) => ({ lang, category }))
  );
}

export default function CategoryPage() {
  return <CategoryClient />;
}
