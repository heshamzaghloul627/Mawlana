import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import OpenAI from "openai";
import sharp from "sharp";
import {
  IMAGE_PROMPT_ENGINEER,
  IMAGE_STYLE_SUFFIX,
  SYSTEM_PROMPT,
  GENERATE_CONTENT_PROMPT,
} from "./prompts";

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();
const ARTICLES = "articles";

const ADMIN_EMAILS: string[] = [
  "hesham.zaghloul@zatsys.com",
  "mr.hesham.zaghloul@gmail.com",
  "t25g1980@gmail.com",
];

// ─── Helpers ─────────────────────────────────────────────────

interface AuthResult {
  uid: string;
  email: string;
}

async function verifyAuth(req: functions.https.Request): Promise<AuthResult> {
  // Try Authorization header first, then fall back to body token
  // (Firebase Hosting rewrites may strip the Authorization header)
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split("Bearer ")[1];
  } else if (req.body?.authToken) {
    token = req.body.authToken;
  }

  if (!token) {
    throw { code: 401, message: "يجب تسجيل الدخول أولاً" };
  }

  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(token);
  } catch {
    throw { code: 401, message: "رمز المصادقة غير صالح" };
  }
  const email = decoded.email || "";
  if (!ADMIN_EMAILS.includes(email)) {
    throw { code: 403, message: "ليس لديك صلاحية الوصول" };
  }
  return { uid: decoded.uid, email };
}

function sendError(res: functions.Response, err: any) {
  const code = typeof err.code === "number" ? err.code : 500;
  const message = err.message || "Internal error";
  res.status(code).json({ error: { message, status: code } });
}

function getOpenAI(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw { code: 500, message: "OpenAI API key not configured" };
  return new OpenAI({ apiKey: key });
}

async function craftImagePrompt(
  openai: OpenAI,
  title: string,
  excerpt: string
): Promise<string | null> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: IMAGE_PROMPT_ENGINEER },
      { role: "user", content: `العنوان: ${title}\nالمقتطف: ${excerpt}` },
    ],
    temperature: 0.9,
    max_tokens: 512,
  });
  const raw = response.choices[0]?.message?.content;
  if (!raw) return null;
  try {
    return JSON.parse(raw).imagePrompt || null;
  } catch {
    return null;
  }
}

async function generateAndUploadImage(
  openai: OpenAI,
  imagePrompt: string,
  storagePath: string
): Promise<string | null> {
  const finalPrompt = `${imagePrompt}. ${IMAGE_STYLE_SUFFIX}`;
  const imageResponse = await openai.images.generate({
    model: "dall-e-3",
    prompt: finalPrompt,
    n: 1,
    size: "1792x1024",
    quality: "standard",
    response_format: "b64_json",
  });

  const b64 = imageResponse.data?.[0]?.b64_json;
  if (!b64) return null;

  const bucket = storage.bucket();
  const rawBuffer = Buffer.from(b64, "base64");

  // Compress: resize to 1200px wide, convert to JPEG at 80% quality
  const jpegBuffer = await sharp(rawBuffer)
    .resize(1200, 675, { fit: "cover" })
    .jpeg({ quality: 80 })
    .toBuffer();

  const jpegPath = storagePath.replace(/\.png$/, ".jpg");
  const file = bucket.file(jpegPath);

  await file.save(jpegBuffer, {
    contentType: "image/jpeg",
    metadata: { cacheControl: "public, max-age=31536000" },
  });

  return `https://storage.googleapis.com/${bucket.name}/${jpegPath}`;
}

// ─── AI Functions ────────────────────────────────────────────

export const formatwithai = functions
  .region("us-east1")
  .runWith({ timeoutSeconds: 300, memory: "512MB" })
  .https.onRequest(async (req, res) => {
    try {
      await verifyAuth(req);
      const { rawText, title, category, articleId } = req.body.data || req.body;

      if (!rawText || !title) {
        res.status(400).json({ error: { message: "rawText and title are required" } });
        return;
      }

      const openai = getOpenAI();

      const formatResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Title: ${title}\nCategory: ${category || "divine"}\n\nRaw Text:\n${rawText}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 16384,
      });

      const choice = formatResponse.choices[0];
      const formatContent = choice?.message?.content;

      if (!formatContent) {
        res.status(500).json({ error: { message: "AI returned empty response" } });
        return;
      }

      if (choice.finish_reason === "length") {
        res.status(500).json({
          error: { message: "النص طويل جدًا — الرد تم اقتطاعه. حاول تقسيم النص إلى أجزاء أصغر." },
        });
        return;
      }

      let parsed: any;
      try {
        parsed = JSON.parse(formatContent);
      } catch {
        res.status(500).json({ error: { message: "AI returned malformed JSON. Try again." } });
        return;
      }

      const { tiptapJson, excerpt } = parsed;
      if (!tiptapJson || tiptapJson.type !== "doc") {
        res.status(500).json({ error: { message: "AI returned invalid Tiptap JSON" } });
        return;
      }

      let imagePrompt = "";
      let coverImageUrl: string | null = null;
      try {
        imagePrompt = (await craftImagePrompt(openai, title, excerpt)) || "";
        if (imagePrompt) {
          const id = articleId || `new-${Date.now()}`;
          const path = `covers/${id}-${Date.now()}.png`;
          coverImageUrl = await generateAndUploadImage(openai, imagePrompt, path);
        }
      } catch (err) {
        console.error("Image generation failed:", err);
      }

      res.json({ result: { tiptapJson, excerpt, imagePrompt, coverImageUrl } });
    } catch (err: any) {
      sendError(res, err);
    }
  });

export const regenerateimage = functions
  .region("us-east1")
  .runWith({ timeoutSeconds: 120, memory: "512MB" })
  .https.onRequest(async (req, res) => {
    try {
      await verifyAuth(req);
      const { title, excerpt, articleId } = req.body.data || req.body;

      if (!title) {
        res.status(400).json({ error: { message: "title is required" } });
        return;
      }

      const openai = getOpenAI();
      const imagePrompt = await craftImagePrompt(openai, title, excerpt || "");
      if (!imagePrompt) {
        res.status(500).json({ error: { message: "Failed to craft image prompt" } });
        return;
      }

      const id = articleId || `regen-${Date.now()}`;
      const path = `covers/${id}-${Date.now()}.png`;
      const coverImageUrl = await generateAndUploadImage(openai, imagePrompt, path);

      res.json({ result: { coverImageUrl } });
    } catch (err: any) {
      sendError(res, err);
    }
  });

export const generatecontent = functions
  .region("us-east1")
  .runWith({ timeoutSeconds: 120, memory: "256MB" })
  .https.onRequest(async (req, res) => {
    try {
      await verifyAuth(req);
      const { idea, title, category } = req.body.data || req.body;

      if (!idea || !title) {
        res.status(400).json({ error: { message: "idea and title are required" } });
        return;
      }

      const openai = getOpenAI();
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: GENERATE_CONTENT_PROMPT },
          {
            role: "user",
            content: `العنوان: ${title}\nالتصنيف: ${category}\n\nالفكرة أو الموضوع:\n${idea}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 8192,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        res.status(500).json({ error: { message: "لم يتمكن الذكاء الاصطناعي من توليد المحتوى" } });
        return;
      }

      res.json({ result: { content } });
    } catch (err: any) {
      sendError(res, err);
    }
  });

// ─── Article CRUD Functions ─────────────────────────────────

export const getarticles = functions
  .region("us-east1")
  .https.onRequest(async (req, res) => {
    try {
      await verifyAuth(req);
      const { status, includeAll } = req.body.data || req.body;

      let q: FirebaseFirestore.Query = db.collection(ARTICLES);
      if (includeAll) {
        q = q.orderBy("created_at", "desc");
      } else {
        q = q.where("status", "==", status || "published").orderBy("created_at", "desc");
      }

      const snapshot = await q.get();
      res.json({ result: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
    } catch (err: any) {
      sendError(res, err);
    }
  });

export const getarticle = functions
  .region("us-east1")
  .https.onRequest(async (req, res) => {
    try {
      await verifyAuth(req);
      const { id } = req.body.data || req.body;
      if (!id) {
        res.status(400).json({ error: { message: "id is required" } });
        return;
      }

      const doc = await db.collection(ARTICLES).doc(id).get();
      if (!doc.exists) {
        res.status(404).json({ error: { message: "Article not found" } });
        return;
      }
      res.json({ result: { id: doc.id, ...doc.data() } });
    } catch (err: any) {
      sendError(res, err);
    }
  });

export const createarticle = functions
  .region("us-east1")
  .https.onRequest(async (req, res) => {
    try {
      await verifyAuth(req);
      const data = req.body.data || req.body;
      if (!data.title_ar) {
        res.status(400).json({ error: { message: "title_ar is required" } });
        return;
      }

      const docRef = await db.collection(ARTICLES).add({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      });

      res.json({ result: { id: docRef.id } });
    } catch (err: any) {
      sendError(res, err);
    }
  });

export const updatearticle = functions
  .region("us-east1")
  .https.onRequest(async (req, res) => {
    try {
      await verifyAuth(req);
      const body = req.body.data || req.body;
      const { id, ...data } = body as { id: string; [key: string]: any };
      if (!id) {
        res.status(400).json({ error: { message: "id is required" } });
        return;
      }

      const cleanData: Record<string, any> = { updated_at: new Date() };
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          cleanData[key] = value;
        }
      }

      await db.collection(ARTICLES).doc(id).update(cleanData);
      res.json({ result: { success: true } });
    } catch (err: any) {
      sendError(res, err);
    }
  });

export const deletearticle = functions
  .region("us-east1")
  .https.onRequest(async (req, res) => {
    try {
      await verifyAuth(req);
      const { id } = req.body.data || req.body;
      if (!id) {
        res.status(400).json({ error: { message: "id is required" } });
        return;
      }

      await db.collection(ARTICLES).doc(id).delete();
      res.json({ result: { success: true } });
    } catch (err: any) {
      sendError(res, err);
    }
  });

// ─── Storage Functions ──────────────────────────────────────

export const listcovers = functions
  .region("us-east1")
  .https.onRequest(async (req, res) => {
    try {
      await verifyAuth(req);
      const bucket = storage.bucket();
      const [files] = await bucket.getFiles({ prefix: "covers/" });

      const covers = files
        .filter((f) => f.name !== "covers/")
        .map((f) => ({
          name: f.name,
          url: `https://storage.googleapis.com/${bucket.name}/${f.name}`,
          size: Number(f.metadata.size || 0),
          created: f.metadata.timeCreated || "",
        }))
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

      res.json({ result: covers });
    } catch (err: any) {
      sendError(res, err);
    }
  });

export const uploadcover = functions
  .region("us-east1")
  .runWith({ timeoutSeconds: 60, memory: "512MB" })
  .https.onRequest(async (req, res) => {
    try {
      await verifyAuth(req);
      const { base64, filename } = req.body.data || req.body;

      if (!base64 || !filename) {
        res.status(400).json({ error: { message: "base64 and filename are required" } });
        return;
      }

      // Strip data URL prefix if present
      const raw = base64.replace(/^data:image\/\w+;base64,/, "");
      const rawBuffer = Buffer.from(raw, "base64");

      // Compress to JPEG
      const jpegBuffer = await sharp(rawBuffer)
        .resize(1200, 675, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();

      const safeName = filename.replace(/\.[^.]+$/, "");
      const storagePath = `covers/${safeName}-${Date.now()}.jpg`;
      const bucket = storage.bucket();
      const file = bucket.file(storagePath);

      await file.save(jpegBuffer, {
        contentType: "image/jpeg",
        metadata: { cacheControl: "public, max-age=31536000" },
      });

      const url = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
      res.json({ result: { url } });
    } catch (err: any) {
      sendError(res, err);
    }
  });
