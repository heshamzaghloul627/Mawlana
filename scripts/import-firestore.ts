import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { readFileSync } from "fs";

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

function restoreTimestamps(obj: any): any {
  if (obj && typeof obj === "object" && obj._timestamp) {
    return Timestamp.fromDate(new Date(obj._timestamp));
  }
  if (Array.isArray(obj)) {
    return obj.map(restoreTimestamps);
  }
  if (obj && typeof obj === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = restoreTimestamps(value);
    }
    return result;
  }
  return obj;
}

async function importAll() {
  console.log(`Importing to project: ${firebaseConfig.projectId}`);

  const raw = readFileSync("scripts/exported-articles.json", "utf-8");
  const articles = JSON.parse(raw);

  for (const article of articles) {
    const { _id, ...data } = article;
    const restored = restoreTimestamps(data);
    await setDoc(doc(collection(db, "articles"), _id), restored);
    console.log(`  Imported: ${_id} — ${restored.title_ar?.substring(0, 50)}`);
  }

  console.log(`\nDone! Imported ${articles.length} articles.`);
}

importAll().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
