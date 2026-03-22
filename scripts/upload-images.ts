import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { readFileSync } from "fs";
import { join } from "path";

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

// Articles with local images in public/
const localImages: { docId: string; localPath: string; title: string }[] = [
  { docId: "YLc0SVyHEpsWaBRhTe8f", localPath: "/Self01.jpg", title: "النفس" },
  { docId: "iBfqUeWXW5XHMjLPK0Xb", localPath: "/NotTheBody.jpg", title: "مراتب النفس" },
  { docId: "m61tmIyC5B6hPemPzSNK", localPath: "/WheresGod.jpg", title: "المعراج" },
  { docId: "pBX8WX6SC9gmUocFtPdq", localPath: "/Fanaa.jpg", title: "الفناء والبقاء" },
];

// Articles with expired DALL-E URLs — clear them for now
const expiredImages: { docId: string; title: string }[] = [
  { docId: "5oh3NYODeu1JAeeK614u", title: "الصيام" },
  { docId: "hwnMsZ0tV8RaGlORwz4f", title: "كهف الروح" },
  { docId: "orKjgbnYa0SQ7enw38f2", title: "الحاقة" },
];

async function uploadAll() {
  console.log(`Uploading to project: ${firebaseConfig.projectId}\n`);

  // Upload local images to Storage
  for (const { docId, localPath, title } of localImages) {
    const filename = localPath.replace("/", "");
    const filePath = join("public", filename);

    try {
      const fileBuffer = readFileSync(filePath);
      const contentType = filename.endsWith(".png") ? "image/png" : "image/jpeg";
      const storageRef = ref(storage, `covers/${filename}`);

      console.log(`  Uploading ${filename}...`);
      await uploadBytes(storageRef, fileBuffer, { contentType });
      const downloadUrl = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "articles", docId), { coverImage: downloadUrl });
      console.log(`  ✓ ${title} — uploaded & updated`);
    } catch (err: any) {
      console.error(`  ✗ ${title} — ${err.message}`);
    }
  }

  // Clear expired DALL-E URLs
  console.log("");
  for (const { docId, title } of expiredImages) {
    await updateDoc(doc(db, "articles", docId), { coverImage: null });
    console.log(`  ✓ ${title} — cleared expired DALL-E URL`);
  }

  console.log("\nDone!");
}

uploadAll().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
