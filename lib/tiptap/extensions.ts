import { Node, mergeAttributes } from "@tiptap/core";

/**
 * QuranVerse — A block node for Quranic verses
 *
 * JSON format:
 * {
 *   "type": "quranVerse",
 *   "attrs": { "surah": "الكهف", "ayah": "65" },
 *   "content": [{ "type": "text", "text": "وَعَلَّمْنَاهُ مِن لَّدُنَّا عِلْمًا" }]
 * }
 *
 * Renders as:
 * <div class="quran-verse" data-surah="الكهف" data-ayah="65">
 *   <div class="quran-verse-text">[content]</div>
 * </div>
 *
 * CSS adds ﴿ ﴾ brackets via ::before/::after on .quran-verse-text
 * CSS adds citation via ::after on .quran-verse using data-* attributes
 */
export const QuranVerse = Node.create({
  name: "quranVerse",
  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      surah: {
        default: "",
        renderHTML: (attributes) => ({ "data-surah": attributes.surah }),
        parseHTML: (element) => element.getAttribute("data-surah") || "",
      },
      ayah: {
        default: "",
        renderHTML: (attributes) => ({ "data-ayah": attributes.ayah }),
        parseHTML: (element) => element.getAttribute("data-ayah") || "",
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="quranVerse"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "quranVerse",
        class: "quran-verse",
      }),
      ["div", { class: "quran-verse-text" }, 0],
    ];
  },
});

/**
 * PoetryBlock — A container for poetry lines (hemistichs)
 *
 * JSON format:
 * {
 *   "type": "poetryBlock",
 *   "content": [
 *     { "type": "poetryLine", "content": [{ "type": "text", "text": "شطر أول" }] },
 *     { "type": "poetryLine", "content": [{ "type": "text", "text": "شطر ثاني" }] }
 *   ]
 * }
 *
 * Renders as a 2-column grid where hemistichs pair up automatically
 */
export const PoetryBlock = Node.create({
  name: "poetryBlock",
  group: "block",
  content: "poetryLine+",

  parseHTML() {
    return [{ tag: 'div[data-type="poetryBlock"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "poetryBlock",
        class: "poetry-block",
      }),
      0,
    ];
  },
});

/**
 * PoetryLine — A single hemistich (شطر) within a PoetryBlock
 *
 * Each line represents one hemistich. Two consecutive lines form a bayt (بيت).
 * The PoetryBlock's CSS grid arranges them in pairs.
 */
export const PoetryLine = Node.create({
  name: "poetryLine",
  group: "block",
  content: "inline*",

  parseHTML() {
    return [{ tag: 'div[data-type="poetryLine"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "poetryLine",
        class: "poetry-line",
      }),
      0,
    ];
  },
});
