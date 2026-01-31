import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

// Firebase configuration - replace with your actual values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Demo article with simplified Tiptap content
 */
const demoArticle = {
  // Slugs
  slug_ar: "marat-al-nafs",
  slug_en: "stages-of-the-self",

  // Titles
  title_ar: "مراتب النفس: من الأمارة إلى المطمئنة",
  title_en: "Stages of the Self: From Commanding to Tranquil",

  // Excerpts
  excerpt_ar:
    "رحلة النفس عبر مراتبها الثلاثة: النفس الأمارة بالسوء، النفس اللوامة، والنفس المطمئنة",
  excerpt_en:
    "The soul's journey through its three stages: the commanding soul, the reproaching soul, and the tranquil soul",

  // Simplified Tiptap JSON content (Arabic)
  content_ar: {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "مراتب النفس الثلاثة",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "إن النفس الإنسانية تمر بثلاث مراتب أساسية في رحلتها نحو الكمال الروحي.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          {
            type: "text",
            text: "المرتبة الأولى: النفس الأمارة بالسوء",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "هي النفس التي تأمر صاحبها بالمعصية والشهوات. وهي أدنى مراتب النفس.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          {
            type: "text",
            text: "المرتبة الثانية: النفس اللوامة",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "وهي النفس التي تلوم صاحبها على التقصير في طاعة الله.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          {
            type: "text",
            text: "المرتبة الثالثة: النفس المطمئنة",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "وهي أعلى مراتب النفس، حيث تطمئن بذكر الله وتستقر على الطاعة.",
          },
        ],
      },
    ],
  },

  // Simplified English content
  content_en: {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "The Three Stages of the Self",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The human soul passes through three fundamental stages in its journey toward spiritual perfection.",
          },
        ],
      },
    ],
  },

  // Metadata
  pillar: "self",
  status: "published",
  featured: true,

  // Versioning
  version_ar: 1,
  version_en: 1,

  // Timestamps
  created_at: Timestamp.now(),
  updated_at: Timestamp.now(),

  // Author
  author: "الشيخ أحمد الرفاعي",

  // SEO
  seo_meta_ar: {
    title: "مراتب النفس: من الأمارة إلى المطمئنة | محراب الروح",
    description:
      "رحلة النفس عبر مراتبها الثلاثة من النفس الأمارة بالسوء إلى النفس المطمئنة",
    keywords: ["النفس", "التزكية", "الروحانية", "الإسلام", "التصوف"],
  },
  seo_meta_en: {
    title: "Stages of the Self: From Commanding to Tranquil | Mihrab Al-Ruh",
    description:
      "The soul's journey through its three stages from the commanding soul to the tranquil soul",
    keywords: ["soul", "purification", "spirituality", "Islam", "Sufism"],
  },
};

/**
 * Seed the database with demo article
 */
async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Add demo article to Firestore
    const articlesRef = collection(db, "articles");
    const docRef = await addDoc(articlesRef, demoArticle);

    console.log("✅ Demo article added successfully!");
    console.log(`📄 Document ID: ${docRef.id}`);
    console.log(`🔗 Arabic URL: /ar/self/${demoArticle.slug_ar}`);
    console.log(`🔗 English URL: /en/self/${demoArticle.slug_en}`);
    console.log("\n🎉 Database seeding completed!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
