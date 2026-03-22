import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

// Firebase configuration - loaded from .env
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
 * Demo article with rich Tiptap content
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

  // Rich Tiptap JSON content (Arabic) - stored as string
  content_ar: JSON.stringify({
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
            text: "إن النفس الإنسانية تمر بثلاث مراتب أساسية في رحلتها نحو الكمال الروحي. وقد ذكر القرآن الكريم هذه المراتب بوضوح، فقال تعالى:",
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "— سورة يوسف، آية 53",
              },
            ],
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
            text: "هي النفس التي تأمر صاحبها بالمعصية والشهوات. وهي أدنى مراتب النفس، حيث تكون الغلبة فيها للهوى والشيطان. ",
          },
          {
            type: "text",
            marks: [{ type: "bold" }],
            text: "وهذه المرتبة هي مرتبة الغفلة",
          },
          {
            type: "text",
            text: "، حيث يكون القلب بعيداً عن ذكر الله.",
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
            text: "وهي النفس التي تلوم صاحبها على التقصير في طاعة الله. قال تعالى:",
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "وَلَا أُقْسِمُ بِالنَّفْسِ اللَّوَّامَةِ",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "— سورة القيامة، آية 2",
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "هذه النفس تجاهد الهوى وتسعى للتوبة والإنابة. وهي علامة على اليقظة الروحية.",
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "وما النفس إلا حيث يجعلها الفتى",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "فإن أطعمت تاقت وإلا تسلّت",
              },
            ],
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
            text: "وهي أعلى مراتب النفس، حيث تطمئن بذكر الله وتستقر على الطاعة. قال تعالى:",
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "— سورة الفجر، آية 27-28",
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "في هذه المرتبة، يصل العبد إلى حالة من السكينة والرضا، حيث يرضى بقضاء الله وقدره، ويطمئن قلبه بذكر الله.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          {
            type: "text",
            text: "الطريق إلى الترقي",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "الترقي من مرتبة إلى أخرى يحتاج إلى:",
          },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "المجاهدة المستمرة",
                  },
                  {
                    type: "text",
                    text: ": في ترك المعاصي ومخالفة الهوى",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "ذكر الله الدائم",
                  },
                  {
                    type: "text",
                    text: ": فإن القلوب تطمئن بذكر الله",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "صحبة الصالحين",
                  },
                  {
                    type: "text",
                    text: ": فالمرء على دين خليله",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "العلم النافع",
                  },
                  {
                    type: "text",
                    text: ": الذي يزكي النفس ويطهرها",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "نسأل الله أن يرزقنا نفساً مطمئنة راضية مرضية، وأن يجعلنا من عباده الصالحين.",
          },
        ],
      },
    ],
  }),

  // English content (same structure) - stored as string
  content_en: JSON.stringify({
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
            text: "The human soul passes through three fundamental stages in its journey toward spiritual perfection. The Quran mentions these stages clearly:",
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "Indeed, the soul commands evil",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "— Surah Yusuf, Verse 53",
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          {
            type: "text",
            text: "First Stage: The Commanding Soul",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This is the soul that commands its owner to disobedience and desires. It is the lowest stage of the soul, where desire and Satan dominate. ",
          },
          {
            type: "text",
            marks: [{ type: "bold" }],
            text: "This is the stage of heedlessness",
          },
          {
            type: "text",
            text: ", where the heart is far from remembering God.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          {
            type: "text",
            text: "Second Stage: The Reproaching Soul",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This soul reproaches its owner for falling short in obedience to God. God says:",
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "And I swear by the reproaching soul",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "— Surah Al-Qiyamah, Verse 2",
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This soul struggles against desire and seeks repentance and turning back to God. It is a sign of spiritual awakening.",
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "The soul is but where the man places it",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "If fed, it craves; if not, it finds contentment",
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          {
            type: "text",
            text: "Third Stage: The Tranquil Soul",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This is the highest stage of the soul, where it finds tranquility in remembering God and remains steadfast in obedience. God says:",
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "O tranquil soul! Return to your Lord, well-pleased and well-pleasing",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "— Surah Al-Fajr, Verses 27-28",
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "At this stage, the servant reaches a state of serenity and contentment, accepting God's decree with satisfaction, and the heart finds peace in His remembrance.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          {
            type: "text",
            text: "The Path to Ascension",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Ascending from one stage to another requires:",
          },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Continuous Striving",
                  },
                  {
                    type: "text",
                    text: ": In abandoning sins and opposing desires",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Constant Remembrance of God",
                  },
                  {
                    type: "text",
                    text: ": For hearts find peace in the remembrance of God",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Companionship of the Righteous",
                  },
                  {
                    type: "text",
                    text: ": For one takes on the religion of their close friend",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Beneficial Knowledge",
                  },
                  {
                    type: "text",
                    text: ": That purifies and cleanses the soul",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "We ask God to grant us a tranquil soul, content and pleasing, and to make us among His righteous servants.",
          },
        ],
      },
    ],
  }),

  // Metadata
  category: "human",
  status: "published",
  featured: true,
  coverImage: "/NotTheBody.jpg",

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
    title: "مراتب النفس: من الأمارة إلى المطمئنة | عودة",
    description:
      "رحلة النفس عبر مراتبها الثلاثة من النفس الأمارة بالسوء إلى النفس المطمئنة",
    keywords: ["النفس", "التزكية", "الروحانية", "الإسلام", "التصوف"],
  },
  seo_meta_en: {
    title: "Stages of the Self: From Commanding to Tranquil | The Return",
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
