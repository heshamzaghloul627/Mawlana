"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, User, Mail, Loader2, Reply } from "lucide-react";
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
        setTimeout(() => setSubmitted(false), 5000);
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
      className="mt-16 pt-12 border-t border-slate-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-accent-gold/10 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-primary dark:text-accent-gold" />
        </div>
        <h2 className="text-2xl font-amiri font-bold text-slate-900 dark:text-white">
          {isAr ? "التعليقات" : "Comments"}
        </h2>
        {comments.length > 0 && (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-gray-800 text-sm text-slate-500 dark:text-gray-400">
            {comments.length}
          </span>
        )}
      </div>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1a202e] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-gray-800 mb-8"
      >
        <h3 className="font-medium text-slate-900 dark:text-white mb-4">
          {isAr ? "أضف تعليقًا" : "Leave a comment"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <User className="absolute top-3 right-3 w-4 h-4 text-slate-400 dark:text-gray-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isAr ? "الاسم" : "Name"}
              required
              minLength={2}
              maxLength={100}
              className="w-full pr-10 pl-4 py-2.5 rounded-lg bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-accent-gold/30 focus:border-primary dark:focus:border-accent-gold transition text-sm"
            />
          </div>
          <div className="relative">
            <Mail className="absolute top-3 right-3 w-4 h-4 text-slate-400 dark:text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isAr ? "البريد الإلكتروني" : "Email"}
              required
              className="w-full pr-10 pl-4 py-2.5 rounded-lg bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-accent-gold/30 focus:border-primary dark:focus:border-accent-gold transition text-sm"
            />
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isAr ? "اكتب تعليقك هنا..." : "Write your comment here..."}
          required
          minLength={5}
          maxLength={2000}
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-accent-gold/30 focus:border-primary dark:focus:border-accent-gold transition text-sm resize-none mb-4"
        />

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-green-600 dark:text-green-400 text-sm font-medium"
            >
              {isAr
                ? "تم إرسال تعليقك بنجاح وسيظهر بعد المراجعة"
                : "Your comment has been submitted and will appear after review"}
            </motion.p>
          ) : (
            <motion.button
              key="submit"
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary dark:bg-accent-gold text-white dark:text-background-dark font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isAr ? "إرسال" : "Submit"}
            </motion.button>
          )}
        </AnimatePresence>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400 dark:text-gray-500" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-slate-400 dark:text-gray-500 py-8">
          {isAr ? "لا توجد تعليقات بعد. كن أول من يعلّق!" : "No comments yet. Be the first to comment!"}
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment, i) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white dark:bg-[#1a202e] rounded-xl p-5 shadow-sm border border-slate-100 dark:border-gray-800"
            >
              {/* Comment Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 dark:bg-accent-gold/10 flex items-center justify-center">
                  <span className="text-primary dark:text-accent-gold text-sm font-bold">
                    {comment.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-900 dark:text-white">
                    {comment.name}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-gray-500">
                    {formatDate(comment.created_at, lang)}
                  </p>
                </div>
              </div>

              {/* Comment Text */}
              <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {comment.text}
              </p>

              {/* Admin Reply */}
              {comment.adminReply && (
                <div className="mt-4 bg-primary/5 dark:bg-accent-gold/5 rounded-lg p-4 border-r-4 border-primary dark:border-accent-gold">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply className="w-4 h-4 text-primary dark:text-accent-gold" />
                    <span className="text-xs font-medium text-primary dark:text-accent-gold">
                      {isAr ? "رد الإدارة" : "Admin Reply"}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
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
