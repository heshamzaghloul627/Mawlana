"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { QuranVerse, PoetryBlock, PoetryLine } from "@/lib/tiptap/extensions";
import { parseTiptapContent } from "@/lib/utils/parseTiptapContent";
import type { TiptapContent } from "@/types";

interface TiptapRendererProps {
  content: TiptapContent | string;
  lang?: "ar" | "en";
  className?: string;
}

export default function TiptapRenderer({
  content,
  lang = "ar",
  className = "",
}: TiptapRendererProps) {
  const parsed = parseTiptapContent(content);

  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    content: parsed,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      QuranVerse,
      PoetryBlock,
      PoetryLine,
    ],
    editorProps: {
      attributes: {
        class: `tiptap-spiritual ${lang === "ar" ? "tiptap-rtl" : "tiptap-ltr"} ${className}`.trim(),
        dir: lang === "ar" ? "rtl" : "ltr",
        lang: lang,
      },
    },
  });

  if (!parsed) {
    return (
      <div className="text-center text-charcoal-light py-12">
        <p>{lang === "ar" ? "المحتوى غير متاح" : "Content unavailable"}</p>
      </div>
    );
  }

  return <EditorContent editor={editor} />;
}
