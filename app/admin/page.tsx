"use client";

import { useEffect, useState } from "react";
import {
  getAllArticlesAdmin,
  deleteArticle,
  getCategoryName,
} from "@/lib/firebase/articles";
import type { Article } from "@/types";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  FileText,
  Eye,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getAllArticlesAdmin();
      setArticles(data);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل تريد حذف المقال "${title}"؟`)) return;

    setDeletingId(id);
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("فشل الحذف");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "—";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return "—";
    }
  };

  return (
    <div className="max-w-6xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-gray-100">
            المقالات
          </h1>
          <p className="text-sm text-charcoal-light dark:text-gray-400 mt-1">
            {articles.length} مقال
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchArticles}
            disabled={loading}
            className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-charcoal-light dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            title="تحديث"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <a
            href="/admin/write"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-gold text-white font-bold hover:opacity-90 transition"
          >
            <Plus size={18} />
            مقال جديد
          </a>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-accent-gold" size={32} />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
          <p className="text-charcoal-light dark:text-gray-400 text-lg">
            لا توجد مقالات بعد
          </p>
          <a
            href="/admin/write"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-accent-gold text-white font-bold hover:opacity-90 transition"
          >
            <Plus size={16} />
            أنشئ أول مقال
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-sm font-bold text-charcoal dark:text-gray-300">
                  العنوان
                </th>
                <th className="px-4 py-3 text-sm font-bold text-charcoal dark:text-gray-300">
                  التصنيف
                </th>
                <th className="px-4 py-3 text-sm font-bold text-charcoal dark:text-gray-300">
                  التاريخ
                </th>
                <th className="px-4 py-3 text-sm font-bold text-charcoal dark:text-gray-300">
                  الحالة
                </th>
                <th className="px-4 py-3 text-sm font-bold text-charcoal dark:text-gray-300">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {article.coverImage && (
                        <img
                          src={article.coverImage}
                          alt=""
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <span className="font-bold text-charcoal dark:text-gray-100 line-clamp-1">
                        {article.title_ar}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary dark:bg-primary/20">
                      {getCategoryName(article.category, "ar")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal-light dark:text-gray-400">
                    {formatDate(article.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                        article.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {article.status === "published" ? "منشور" : "مسودة"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {article.slug_ar && (
                        <a
                          href={`/ar/${article.category}/${article.slug_ar}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded text-gray-400 hover:text-primary hover:bg-primary/10 transition"
                          title="معاينة"
                        >
                          <Eye size={16} />
                        </a>
                      )}
                      <a
                        href={`/admin/edit?id=${article.id}`}
                        className="p-1.5 rounded text-gray-400 hover:text-accent-gold hover:bg-accent-gold/10 transition"
                        title="تعديل"
                      >
                        <Pencil size={16} />
                      </a>
                      <button
                        onClick={() =>
                          handleDelete(article.id, article.title_ar)
                        }
                        disabled={deletingId === article.id}
                        className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                        title="حذف"
                      >
                        {deletingId === article.id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
