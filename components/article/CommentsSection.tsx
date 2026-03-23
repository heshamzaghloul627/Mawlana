"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Reply, ChevronDown } from "lucide-react";
import { getApprovedComments, submitComment } from "@/lib/firebase/comments";
import type { Comment } from "@/types";

interface CommentsSectionProps {
  articleId: string;
  articleTitle: string;
  articleSlug: string;
  articleCategory: string;
  lang: "ar" | "en";
}

export default function CommentsSection({
  articleId,
  articleTitle,
  articleSlug,
  articleCategory,
  lang,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

  // Load saved name/email from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("awdah-commenter");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
      }
    } catch {}
  }, []);

  // Fetch approved comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const result = await getApprovedComments(articleId);
        setComments(result);
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [articleId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSubmitting(true);

      try {
        await submitComment({
          name: name.trim(),
          email: email.trim(),
          text: text.trim(),
          articleId,
          articleTitle,
          articleSlug,
          articleCategory,
        });

        // Save name/email for next time
        localStorage.setItem(
          "awdah-commenter",
          JSON.stringify({ name: name.trim(), email: email.trim() })
        );

        setText("");
        setSubmitted(true);
        setFormOpen(false);
        setTimeout(() => setSubmitted(false), 6000);
      } catch (err: any) {
        setError(err.message || "فشل إرسال التعليق");
      } finally {
        setSubmitting(false);
      }
    },
    [name, email, text, articleId, articleTitle, articleSlug, articleCategory]
  );

  const isAr = lang === "ar";

  return (
    <motion.section
      className="mt-20 pt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      {/* Decorative separator */}
      <div className="flex items-center gap-6 mb-14">
        <div className="h-px flex-grow bg-gradient-to-l from-accent-gold/40 to-transparent" />
        <span className="text-accent-gold font-amiri text-lg">✦</span>
        <div className="h-px flex-grow bg-gradient-to-r from-accent-gold/40 to-transparent" />
      </div>

      {/* Section Header */}
      <div className="flex items-baseline justify-between mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-kufi font-bold text-gray-900 dark:text-white">
            {isAr ? "المحاورة" : "Discussion"}
          </h2>
          {comments.length > 0 && (
            <p className="text-gray-400 dark:text-gray-500 font-amiri text-sm mt-1">
              {isAr
                ? `${comments.length} ${comments.length === 1 ? "تعليق" : comments.length === 2 ? "تعليقان" : comments.length <= 10 ? "تعليقات" : "تعليقًا"}`
                : `${comments.length} comment${comments.length !== 1 ? "s" : ""}`}
            </p>
          )}
        </div>

        {!formOpen && !submitted && (
          <button
            onClick={() => setFormOpen(true)}
            className="text-sm sm:text-base text-primary dark:text-accent-gold font-bold font-amiri hover:opacity-80 transition-opacity"
          >
            {isAr ? "أضف تعليقًا" : "Add a comment"}
          </button>
        )}
      </div>

      {/* Success message */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-10 py-4 px-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg"
          >
            <p className="text-emerald-700 dark:text-emerald-300 text-sm font-amiri">
              {isAr
                ? "جزاك الله خيرًا — تم إرسال تعليقك وسيظهر بعد المراجعة."
                : "Thank you — your comment has been submitted and will appear after review."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Form — collapsible */}
      <AnimatePresence>
        {formOpen && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden mb-12"
          >
            <div className="border-r-2 border-accent-gold/40 pr-6 sm:pr-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 tracking-wide">
                    {isAr ? "الاسم" : "NAME"}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={100}
                    className="w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-primary dark:focus:border-accent-gold transition-colors font-amiri"
                    placeholder={isAr ? "كيف نناديك؟" : "What should we call you?"}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 tracking-wide">
                    {isAr ? "البريد الإلكتروني" : "EMAIL"}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-primary dark:focus:border-accent-gold transition-colors font-amiri"
                    placeholder={isAr ? "لن يُنشر" : "Won't be published"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 tracking-wide">
                  {isAr ? "التعليق" : "COMMENT"}
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  minLength={5}
                  maxLength={2000}
                  rows={4}
                  className="w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-primary dark:focus:border-accent-gold transition-colors font-amiri resize-none leading-relaxed"
                  placeholder={isAr ? "شاركنا رأيك أو سؤالك..." : "Share your thoughts or questions..."}
                />
              </div>

              {error && (
                <p className="text-red-500 dark:text-red-400 text-sm font-amiri">{error}</p>
              )}

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold tracking-wide hover:bg-primary dark:hover:bg-accent-gold transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isAr ? "إرسال التعليق" : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors font-amiri"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-gray-300 dark:text-gray-600" />
        </div>
      ) : comments.length === 0 && !submitted ? (
        <div className="text-center py-16">
          <p className="text-gray-400 dark:text-gray-500 font-amiri text-lg">
            {isAr ? "لا توجد تعليقات بعد" : "No comments yet"}
          </p>
          <p className="text-gray-300 dark:text-gray-600 font-amiri text-sm mt-1">
            {isAr ? "كن أول من يشارك رأيه" : "Be the first to share your thoughts"}
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {comments.map((comment, i) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="py-7 border-b border-gray-100 dark:border-gray-800/60 last:border-b-0"
            >
              {/* Comment Header */}
              <div className="flex items-baseline justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent-gold/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary dark:text-accent-gold text-xs font-bold font-kufi">
                      {comment.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-bold text-sm text-gray-900 dark:text-white font-amiri">
                    {comment.name}
                  </span>
                </div>
                <time className="text-xs text-gray-300 dark:text-gray-600 font-amiri">
                  {formatDate(comment.created_at, lang)}
                </time>
              </div>

              {/* Comment Text */}
              <p className="text-gray-600 dark:text-gray-300 text-[15px] font-amiri leading-[1.9] whitespace-pre-wrap mr-11">
                {comment.text}
              </p>

              {/* Admin Reply */}
              {comment.adminReply && (
                <div className="mt-5 mr-11 pr-5 border-r-2 border-accent-gold/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply className="w-3.5 h-3.5 text-accent-gold" />
                    <span className="text-xs font-bold text-accent-gold font-amiri">
                      {isAr ? "رد المحرر" : "Editor's Reply"}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-[15px] font-amiri leading-[1.9] whitespace-pre-wrap">
                    {comment.adminReply}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

function formatDate(timestamp: any, lang: "ar" | "en"): string {
  try {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp?._seconds ? timestamp._seconds * 1000 : timestamp);
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}
