/**
 * One-time migration: compress all existing cover images in Firebase Storage.
 *
 * For each image in covers/:
 *   - Downloads the original
 *   - Generates: full WebP, thumbnail WebP, JPEG fallback
 *   - Uploads the new variants
 *   - Updates any Firestore articles referencing the old URL
 *
 * Run: npx tsx scripts/compress-existing-covers.ts
 */
import { config } from "dotenv";
config();
config({ path: "functions/.env" });

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  getBytes,
  deleteObject,
} from "firebase/storage";
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

async function compressAndUpload(
  imageBuffer: Buffer,
  basePath: string
): Promise<{ webpUrl: string; thumbUrl: string; jpegUrl: string }> {
  const sharpInput = sharp(imageBuffer);

  const [webpFull, webpThumb, jpegFull] = await Promise.all([
    sharpInput.clone().resize(1200, 675, { fit: "cover" }).webp({ quality: 75 }).toBuffer(),
    sharpInput.clone().resize(600, 338, { fit: "cover" }).webp({ quality: 65 }).toBuffer(),
    sharpInput.clone().resize(1200, 675, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer(),
  ]);

  const webpPath = `${basePath}.webp`;
  const thumbPath = `${basePath}_thumb.webp`;
  const jpegPath = `${basePath}.jpg`;
  const cacheControl = "public, max-age=31536000";

  await Promise.all([
    uploadBytes(ref(storage, webpPath), webpFull, {
      contentType: "image/webp",
      cacheControl,
    }),
    uploadBytes(ref(storage, thumbPath), webpThumb, {
      contentType: "image/webp",
      cacheControl,
    }),
    uploadBytes(ref(storage, jpegPath), jpegFull, {
      contentType: "image/jpeg",
      cacheControl,
    }),
  ]);

  const [webpUrl, thumbUrl, jpegUrl] = await Promise.all([
    getDownloadURL(ref(storage, webpPath)),
    getDownloadURL(ref(storage, thumbPath)),
    getDownloadURL(ref(storage, jpegPath)),
  ]);

  return { webpUrl, thumbUrl, jpegUrl };
}

async function main() {
  console.log("🔍 Listing all covers in storage...\n");

  const coversRef = ref(storage, "covers");
  const result = await listAll(coversRef);

  // Filter to only original files (skip already-processed _thumb files)
  const originals = result.items.filter((item) => {
    const name = item.name;
    // Skip thumbnails and already-generated webp companions
    if (name.includes("_thumb")) return false;
    return true;
  });

  console.log(`Found ${originals.length} cover files to process.\n`);

  // Load all articles to map URLs
  const articlesSnap = await getDocs(collection(db, "articles"));
  const articles = articlesSnap.docs.map((d) => ({
    id: d.id,
    coverImage: d.data().coverImage as string | null,
  }));

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const item of originals) {
    const name = item.name;
    // Derive base path (without extension)
    const basePath = `covers/${name.replace(/\.[^.]+$/, "")}`;

    // Check if WebP version already exists
    const webpName = name.replace(/\.[^.]+$/, ".webp");
    const alreadyWebp = name.endsWith(".webp");
    const hasWebpCompanion = result.items.some((i) => i.name === webpName && i.name !== name);

    if (alreadyWebp && result.items.some((i) => i.name === name.replace(".webp", "_thumb.webp"))) {
      console.log(`  ⏭  ${name} — already has thumb, skipping`);
      skipped++;
      continue;
    }

    if (!alreadyWebp && hasWebpCompanion) {
      console.log(`  ⏭  ${name} — WebP version exists, skipping`);
      skipped++;
      continue;
    }

    try {
      console.log(`  📥 Downloading ${name}...`);
      const bytes = await getBytes(item);
      const buffer = Buffer.from(bytes);

      const originalSize = (buffer.length / 1024).toFixed(0);
      console.log(`     Original size: ${originalSize} KB`);

      console.log(`  🔧 Compressing...`);
      const { webpUrl } = await compressAndUpload(buffer, basePath);

      // Update Firestore articles that reference this image
      const oldUrl = await getDownloadURL(item);
      const matchingArticles = articles.filter(
        (a) => a.coverImage && a.coverImage === oldUrl
      );

      for (const article of matchingArticles) {
        await updateDoc(doc(db, "articles", article.id), {
          coverImage: webpUrl,
        });
        console.log(`  📝 Updated article ${article.id} → WebP URL`);
      }

      // If no articles matched by exact URL, try matching by storage path
      if (matchingArticles.length === 0) {
        const pathArticles = articles.filter(
          (a) => a.coverImage && a.coverImage.includes(name)
        );
        for (const article of pathArticles) {
          await updateDoc(doc(db, "articles", article.id), {
            coverImage: webpUrl,
          });
          console.log(`  📝 Updated article ${article.id} → WebP URL (path match)`);
        }
      }

      processed++;
      console.log(`  ✅ ${name} — done\n`);
    } catch (err: any) {
      console.error(`  ❌ ${name} — ${err.message}\n`);
      errors++;
    }
  }

  console.log("\n═══════════════════════════════════");
  console.log(`✅ Processed: ${processed}`);
  console.log(`⏭  Skipped:   ${skipped}`);
  console.log(`❌ Errors:    ${errors}`);
  console.log("═══════════════════════════════════\n");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
