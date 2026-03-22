import { auth } from "@/lib/firebase/config";

/**
 * Calls a Cloud Function through the Firebase Hosting proxy.
 * Uses the onCall wire protocol: POST with { data: ... } body,
 * response is { result: ... } or { error: ... }.
 */
async function callFunction<T>(name: string, data: any, timeoutMs = 120000): Promise<T> {
  const user = auth.currentUser;
  let authToken: string | null = null;
  if (user) {
    authToken = await user.getIdToken();
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`/api/${name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, authToken }),
      signal: controller.signal,
    });

    const json = await response.json();

    if (json.error) {
      const msg = json.error.message || json.error.status || "Unknown error";
      throw new Error(msg);
    }

    return json.result as T;
  } finally {
    clearTimeout(timer);
  }
}

export interface FormatResult {
  tiptapJson: any;
  excerpt: string;
  imagePrompt: string;
  coverImageUrl: string | null;
}

/**
 * Formats raw text into Tiptap JSON and generates a cover image.
 * Runs server-side via Cloud Function.
 */
export async function formatWithAI(
  rawText: string,
  title: string,
  category: string,
  articleId?: string
): Promise<FormatResult> {
  return callFunction<FormatResult>("formatwithai", { rawText, title, category, articleId }, 300000);
}

/**
 * Regenerates only the cover image. Runs server-side via Cloud Function.
 * Returns the permanent Storage URL directly.
 */
export async function regenerateImage(
  title: string,
  excerpt: string,
  articleId?: string
): Promise<string | null> {
  const result = await callFunction<{ coverImageUrl: string | null }>(
    "regenerateimage",
    { title, excerpt, articleId },
    120000
  );
  return result.coverImageUrl;
}

/**
 * Generates raw Arabic spiritual content from a topic/idea.
 * Runs server-side via Cloud Function.
 */
export async function generateContent(
  idea: string,
  title: string,
  category: string
): Promise<string> {
  const result = await callFunction<{ content: string }>(
    "generatecontent",
    { idea, title, category },
    120000
  );
  return result.content;
}

/**
 * Extracts plain text from a Tiptap JSON document. Runs client-side.
 */
export function extractTextFromTiptap(node: any): string {
  if (!node) return "";
  if (node.text) return node.text;
  if (!node.content) return "";
  return node.content.map(extractTextFromTiptap).join("\n");
}

export interface CoverImage {
  name: string;
  url: string;
  size: number;
  created: string;
}

/**
 * Lists all cover images from Firebase Storage.
 */
export async function listCovers(): Promise<CoverImage[]> {
  return callFunction<CoverImage[]>("listcovers", {});
}

/**
 * Uploads an image file to Storage as a compressed cover.
 */
export async function uploadCover(file: File): Promise<string> {
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
  const result = await callFunction<{ url: string }>("uploadcover", {
    base64,
    filename: file.name,
  });
  return result.url;
}
