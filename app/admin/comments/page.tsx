"use client";

import { useEffect, useState } from "react";
import { callCommentFunction } from "@/lib/firebase/comments";
import type { Comment, CommentStatus } from "@/types";
import {
  MessageCircle,
  Loader2,
  RefreshCw,
  Check,
  X,
  Reply,
  Send,
  ExternalLink,
} from "lucide-react";

type FilterTab = "all" | CommentStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "بانتظار المراجعة" },
  { key: "approved", label: "معتمد" },
  { key: "rejected", label: "مرفوض" },
];

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("pending");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchComments = async (tab?: FilterTab) => {
    setLoading(true);
    try {
      const filter = (tab || activeTab) === "all" ? {} : { status: tab || activeTab };
      const result = await callCommentFunction<Comment[]>("getcomments", filter);
      setComments(result);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [activeTab]);

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setReplyingTo(null);
    setReplyText("");
  };

  const handleUpdateStatus = async (commentId: string, status: CommentStatus) => {
    setActionLoading(commentId);
    try {
      await callCommentFunction("updatecommentstatus", { commentId, status });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, status } : c))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("فشل تحديث الحالة");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    setActionLoading(commentId);
    try {
      await callCommentFunction("replytocomment", {
        commentId,
        reply: replyText.trim(),
        newStatus: "approved",
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, adminReply: replyText.trim(), status: "approved" as CommentStatus }
            : c
        )
      );
      setReplyingTo(null);
      setReplyText("");
    } catch (err) {
      console.error("Failed to reply:", err);
      alert("فشل إرسال الرد");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "—";
    try {
      const date = timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp._seconds ? timestamp._seconds * 1000 : timestamp);
      return new Intl.DateTimeFormat("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return "—";
    }
  };

  const statusBadge = (status: CommentStatus) => {
    const styles: Record<CommentStatus, string> = {
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    const labels: Record<CommentStatus, string> = {
      pending: "بانتظار المراجعة",
      approved: "معتمد",
      rejected: "مرفوض",
    };
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-gray-100">
            التعليقات
          </h1>
          <p className="text-sm text-charcoal-light dark:text-gray-400 mt-1">
            {comments.length} تعليق
          </p>
        </div>
        <button
          onClick={() => fetchComments()}
          disabled={loading}
          className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-charcoal-light dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          title="تحديث"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-white dark:bg-gray-700 text-charcoal dark:text-white shadow-sm"
                : "text-charcoal-light dark:text-gray-400 hover:text-charcoal dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-accent-gold" size={32} />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-20">
          <MessageCircle className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
          <p className="text-charcoal-light dark:text-gray-400 text-lg">
            لا توجد تعليقات
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
            >
              {/* Comment Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-gold font-bold text-sm">
                      {comment.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-charcoal dark:text-gray-100">
                      {comment.name}
                    </p>
                    <p className="text-xs text-charcoal-light dark:text-gray-400">
                      {comment.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {statusBadge(comment.status as CommentStatus)}
                  <span className="text-xs text-charcoal-light dark:text-gray-500">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
              </div>

              {/* Article Reference */}
              <div className="mb-3">
                <a
                  href={`/ar/${comment.articleCategory}/${encodeURIComponent(comment.articleSlug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary dark:text-accent-gold hover:underline"
                >
                  <ExternalLink size={12} />
                  {comment.articleTitle}
                </a>
              </div>

              {/* Comment Text */}
              <p className="text-charcoal dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                {comment.text}
              </p>

              {/* Existing Reply */}
              {comment.adminReply && (
                <div className="bg-accent-gold/5 rounded-lg p-3 mb-4 border-r-4 border-accent-gold">
                  <p className="text-xs font-medium text-accent-gold mb-1">الرد:</p>
                  <p className="text-charcoal dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {comment.adminReply}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                {comment.status !== "approved" && (
                  <button
                    onClick={() => handleUpdateStatus(comment.id, "approved")}
                    disabled={actionLoading === comment.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition disabled:opacity-50"
                  >
                    {actionLoading === comment.id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Check size={14} />
                    )}
                    اعتماد
                  </button>
                )}
                {comment.status !== "rejected" && (
                  <button
                    onClick={() => handleUpdateStatus(comment.id, "rejected")}
                    disabled={actionLoading === comment.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                  >
                    {actionLoading === comment.id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <X size={14} />
                    )}
                    رفض
                  </button>
                )}
                <button
                  onClick={() => {
                    setReplyingTo(replyingTo === comment.id ? null : comment.id);
                    setReplyText(comment.adminReply || "");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-accent-gold hover:bg-accent-gold/10 transition"
                >
                  <Reply size={14} />
                  {comment.adminReply ? "تعديل الرد" : "رد"}
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="اكتب ردك هنا... (سيتم إرسال بريد إلكتروني للمعلق)"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-charcoal dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition text-sm resize-none mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyText.trim() || actionLoading === comment.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-gold text-white font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
                    >
                      {actionLoading === comment.id ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <Send size={14} />
                      )}
                      إرسال الرد
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      className="px-4 py-2 rounded-lg text-sm text-charcoal-light dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
