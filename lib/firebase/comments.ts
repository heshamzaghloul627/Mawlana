import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "./config";
import type { Comment } from "@/types";

/**
 * Fetches approved comments for a specific article (client-side, no auth needed).
 */
export async function getApprovedComments(articleId: string): Promise<Comment[]> {
  const q = query(
    collection(db, "comments"),
    where("articleId", "==", articleId),
    where("status", "==", "approved"),
    orderBy("created_at", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Comment[];
}

/**
 * Submits a new comment (public, no auth needed).
 */
export async function submitComment(data: {
  name: string;
  email: string;
  text: string;
  articleId: string;
  articleTitle: string;
  articleSlug: string;
  articleCategory: string;
}): Promise<void> {
  const response = await fetch("/api/submitcomment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });

  const json = await response.json();
  if (json.error) {
    throw new Error(json.error.message || "فشل إرسال التعليق");
  }
}

/**
 * Calls an admin-only comment Cloud Function with auth token.
 */
export async function callCommentFunction<T>(name: string, data: any): Promise<T> {
  const user = auth.currentUser;
  let authToken: string | null = null;
  if (user) {
    authToken = await user.getIdToken();
  }

  const response = await fetch(`/api/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, authToken }),
  });

  const json = await response.json();
  if (json.error) {
    throw new Error(json.error.message || "Unknown error");
  }
  return json.result as T;
}
