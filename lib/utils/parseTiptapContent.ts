import type { TiptapContent } from "@/types";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Parses Tiptap content which may be stored as a JSON string in Firestore
 * or may already be a parsed object. Returns null if parsing fails.
 */
export function parseTiptapContent(
  content: TiptapContent | string | null | undefined
): TiptapContent | null {
  if (!content) return null;

  // Already a parsed object
  if (typeof content === "object" && content.type === "doc") {
    return content;
  }

  // Stringified JSON from Firestore
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object" && parsed.type === "doc") {
        return parsed as TiptapContent;
      }
    } catch (e) {
      console.error("Failed to parse Tiptap content:", e);
    }
  }

  return null;
}

/**
 * Extracts headings from TipTap JSON for building a table of contents.
 * Returns an array of { id, text, level } objects.
 */
export function extractHeadings(
  content: TiptapContent | string | null | undefined
): TocHeading[] {
  const parsed = parseTiptapContent(content);
  if (!parsed?.content) return [];

  const headings: TocHeading[] = [];
  let index = 0;

  for (const node of parsed.content) {
    if (node.type === "heading" && node.content) {
      const level = node.attrs?.level ?? 2;
      const text = extractText(node);
      if (text.trim()) {
        headings.push({ id: `section-${index}`, text: text.trim(), level });
        index++;
      }
    }
  }

  return headings;
}

function extractText(node: TiptapContent): string {
  if (node.text) return node.text;
  if (!node.content) return "";
  return node.content.map(extractText).join("");
}

/**
 * Estimates reading time in minutes for Arabic content.
 * Arabic reading speed ~180 words/min.
 */
export function estimateReadingTime(
  content: TiptapContent | string | null | undefined
): number {
  const parsed = parseTiptapContent(content);
  if (!parsed) return 1;

  const allText = extractText(parsed);
  const wordCount = allText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 180));
}
