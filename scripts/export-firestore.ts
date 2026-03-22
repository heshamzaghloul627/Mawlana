import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { writeFileSync } from "fs";

// Old project config
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

async function exportAll() {
  console.log(`Exporting from project: ${firebaseConfig.projectId}`);

  const snapshot = await getDocs(collection(db, "articles"));
  const articles: Record<string, any>[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    // Convert Firestore Timestamps to ISO strings for JSON serialization
    const serialized: Record<string, any> = { _id: doc.id };
    for (const [key, value] of Object.entries(data)) {
      if (value && typeof value === "object" && typeof value.toDate === "function") {
        serialized[key] = { _timestamp: value.toDate().toISOString() };
      } else {
        serialized[key] = value;
      }
    }
    articles.push(serialized);
  });

  const outputPath = "scripts/exported-articles.json";
  writeFileSync(outputPath, JSON.stringify(articles, null, 2), "utf-8");
  console.log(`Exported ${articles.length} articles to ${outputPath}`);
}

exportAll().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
