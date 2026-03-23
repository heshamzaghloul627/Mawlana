/**
 * Generate cover images for all demo articles that don't have one.
 *
 * Uses OpenAI DALL-E 3 directly + uploads to Firebase Storage.
 * Requires: OPENAI_API_KEY in .env
 *
 * Run: npx tsx scripts/generate-covers.ts
 */
import { config } from "dotenv";
config(); // load .env
config({ path: "functions/.env" }); // load functions/.env (has OPENAI_API_KEY)
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import OpenAI from "openai";
import sharp from "sharp";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const IMAGE_PROMPT_ENGINEER = [
  'You are a visual poet and cinematic art director for a spiritual Islamic editorial platform called "عودة" (The Return).',
  "",
  "Your job: given an Arabic article title and excerpt, craft a DALL-E image prompt that captures the **deep spiritual meaning** of the text — not its literal subject matter.",
  "",
  "## CREATIVE PHILOSOPHY:",
  "- Think like a cinematographer and a Sufi at the same time",
  "- Translate **inner states** (longing, awe, surrender, awakening, loss of ego) into **visual metaphors**",
  '- Go beyond the obvious. If the article is about fasting, don\'t show food or an empty plate — show a vast desert at dawn where the horizon line dissolves into light',
  "- Every image should feel like a still frame from a Terrence Malick or Roger Deakins film — profound, quiet, luminous",
  "",
  "## VISUAL LANGUAGE:",
  "- Cinematic realism with high-end editorial photography aesthetics",
  "- Abstract compositions that evoke meaning through metaphor, not illustration",
  "- Play with: light and shadow, scale and vastness, stillness and motion, depth of field",
  "- Textures: ancient stone, flowing water, swirling dust particles in light beams, weathered manuscripts, cracked earth, star trails",
  "- Color palettes: warm golden hour tones, deep midnight blues, amber candlelight, misty silvers, desert ochres",
  "",
  "## ABSOLUTE CONSTRAINTS — NEVER INCLUDE:",
  "- Human faces, human figures, human body shapes, or silhouettes of people",
  "- Women's bodies in any form",
  "- Cartoon, illustration, anime, or 3D render styles",
  "- Text, letters, Arabic calligraphy, words, or watermarks",
  "",
  "## OUTPUT:",
  'Return a single JSON object: { "imagePrompt": "..." }',
  "The prompt should be 2-4 sentences, vivid, specific, and poetic.",
].join("\n");

const IMAGE_STYLE_SUFFIX =
  "Soft portrait mode with shallow depth of field and gentle bokeh. Cinematic photography, shot on 35mm film with a wide aperture lens. Warm, diffused natural lighting. No people, no faces, no human figures, no silhouettes, no text, no letters, no calligraphy, no watermarks. No cartoon, no illustration, no 3D render.";

async function craftImagePrompt(title: string, excerpt: string): Promise<string | null> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: IMAGE_PROMPT_ENGINEER },
      { role: "user", content: `Title: ${title}\nExcerpt: ${excerpt}` },
    ],
    temperature: 0.9,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed.imagePrompt || null;
  } catch {
    return null;
  }
}

async function generateImage(prompt: string): Promise<Buffer> {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `${prompt}\n\n${IMAGE_STYLE_SUFFIX}`,
    n: 1,
    size: "1792x1024",
    quality: "standard",
    response_format: "b64_json",
  });

  const b64 = response.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image data returned");
  return Buffer.from(b64, "base64");
}

async function uploadToStorage(imageBuffer: Buffer, articleId: string): Promise<string> {
  const ts = Date.now();
  const sharpInput = sharp(imageBuffer);

  const [webpFull, webpThumb, jpegFull] = await Promise.all([
    sharpInput.clone().resize(1200, 675, { fit: "cover" }).webp({ quality: 75 }).toBuffer(),
    sharpInput.clone().resize(600, 338, { fit: "cover" }).webp({ quality: 65 }).toBuffer(),
    sharpInput.clone().resize(1200, 675, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer(),
  ]);

  const webpPath = `covers/${articleId}-${ts}.webp`;
  const thumbPath = `covers/${articleId}-${ts}_thumb.webp`;
  const jpegPath = `covers/${articleId}-${ts}.jpg`;
  const cacheControl = "public, max-age=31536000";

  await Promise.all([
    uploadBytes(ref(storage, webpPath), webpFull, { contentType: "image/webp", cacheControl }),
    uploadBytes(ref(storage, thumbPath), webpThumb, { contentType: "image/webp", cacheControl }),
    uploadBytes(ref(storage, jpegPath), jpegFull, { contentType: "image/jpeg", cacheControl }),
  ]);

  return getDownloadURL(ref(storage, webpPath));
}

async function main() {
  console.log("🎨 Generating cover images for articles without covers...\n");

  // Fetch all published articles without cover images
  const articlesRef = collection(db, "articles");
  const q = query(articlesRef, where("status", "==", "published"));
  const snapshot = await getDocs(q);

  const articlesWithoutCover: Array<{ id: string; title: string; excerpt: string }> = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (!data.coverImage) {
      articlesWithoutCover.push({
        id: docSnap.id,
        title: data.title_ar || "",
        excerpt: data.excerpt_ar || "",
      });
    }
  });

  console.log(`Found ${articlesWithoutCover.length} articles without cover images.\n`);

  if (articlesWithoutCover.length === 0) {
    console.log("✅ All articles already have cover images!");
    return;
  }

  let success = 0;
  let failed = 0;

  for (const article of articlesWithoutCover) {
    try {
      console.log(`  🖌️  [${success + failed + 1}/${articlesWithoutCover.length}] ${article.title}`);

      // Step 1: Craft prompt
      const imagePrompt = await craftImagePrompt(article.title, article.excerpt);
      if (!imagePrompt) {
        console.log(`     ⚠️  Failed to craft prompt, skipping`);
        failed++;
        continue;
      }
      console.log(`     📝 Prompt: ${imagePrompt.substring(0, 80)}...`);

      // Step 2: Generate image
      console.log(`     🎨 Generating image with DALL-E 3...`);
      const imageBuffer = await generateImage(imagePrompt);

      // Step 3: Upload to Storage
      console.log(`     ☁️  Uploading to Firebase Storage...`);
      const coverUrl = await uploadToStorage(imageBuffer, article.id);

      // Step 4: Update Firestore
      const docRef = doc(db, "articles", article.id);
      await updateDoc(docRef, {
        coverImage: coverUrl,
        updated_at: Timestamp.now(),
      });

      console.log(`     ✅ Done → ${coverUrl.substring(0, 60)}...\n`);
      success++;

      // Small delay to respect rate limits
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err: any) {
      console.error(`     ❌ Error: ${err.message}\n`);
      failed++;
    }
  }

  console.log(`\n✨ Complete! ${success} generated, ${failed} failed.`);
}

main().catch(console.error);
