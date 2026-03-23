"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatecommentstatus = exports.replytocomment = exports.getcomments = exports.submitcomment = exports.uploadcover = exports.listcovers = exports.deletearticle = exports.updatearticle = exports.createarticle = exports.getarticle = exports.getarticles = exports.generatecontent = exports.regenerateimage = exports.formatwithai = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const openai_1 = __importDefault(require("openai"));
const sharp_1 = __importDefault(require("sharp"));
const resend_1 = require("resend");
const prompts_1 = require("./prompts");
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();
const ARTICLES = "articles";
const COMMENTS = "comments";
const ADMIN_EMAILS = [
    "hesham.zaghloul@zatsys.com",
    "mr.hesham.zaghloul@gmail.com",
    "t25g1980@gmail.com",
];
async function verifyAuth(req) {
    // Try Authorization header first, then fall back to body token
    // (Firebase Hosting rewrites may strip the Authorization header)
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split("Bearer ")[1];
    }
    else if (req.body?.authToken) {
        token = req.body.authToken;
    }
    if (!token) {
        throw { code: 401, message: "يجب تسجيل الدخول أولاً" };
    }
    let decoded;
    try {
        decoded = await admin.auth().verifyIdToken(token);
    }
    catch {
        throw { code: 401, message: "رمز المصادقة غير صالح" };
    }
    const email = decoded.email || "";
    if (!ADMIN_EMAILS.includes(email)) {
        throw { code: 403, message: "ليس لديك صلاحية الوصول" };
    }
    return { uid: decoded.uid, email };
}
function sendError(res, err) {
    const code = typeof err.code === "number" ? err.code : 500;
    const message = err.message || "Internal error";
    res.status(code).json({ error: { message, status: code } });
}
function getOpenAI() {
    const key = process.env.OPENAI_API_KEY;
    if (!key)
        throw { code: 500, message: "OpenAI API key not configured" };
    return new openai_1.default({ apiKey: key });
}
async function craftImagePrompt(openai, title, excerpt) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
            { role: "system", content: prompts_1.IMAGE_PROMPT_ENGINEER },
            { role: "user", content: `العنوان: ${title}\nالمقتطف: ${excerpt}` },
        ],
        temperature: 0.9,
        max_tokens: 512,
    });
    const raw = response.choices[0]?.message?.content;
    if (!raw)
        return null;
    try {
        return JSON.parse(raw).imagePrompt || null;
    }
    catch {
        return null;
    }
}
async function generateAndUploadImage(openai, imagePrompt, storagePath) {
    const finalPrompt = `${imagePrompt}. ${prompts_1.IMAGE_STYLE_SUFFIX}`;
    const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: "1792x1024",
        quality: "standard",
        response_format: "b64_json",
    });
    const b64 = imageResponse.data?.[0]?.b64_json;
    if (!b64)
        return null;
    const bucket = storage.bucket();
    const rawBuffer = Buffer.from(b64, "base64");
    // Compress: resize to 1200px wide, convert to JPEG at 80% quality
    const jpegBuffer = await (0, sharp_1.default)(rawBuffer)
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
exports.formatwithai = functions
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
                { role: "system", content: prompts_1.SYSTEM_PROMPT },
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
        let parsed;
        try {
            parsed = JSON.parse(formatContent);
        }
        catch {
            res.status(500).json({ error: { message: "AI returned malformed JSON. Try again." } });
            return;
        }
        const { tiptapJson, excerpt } = parsed;
        if (!tiptapJson || tiptapJson.type !== "doc") {
            res.status(500).json({ error: { message: "AI returned invalid Tiptap JSON" } });
            return;
        }
        let imagePrompt = "";
        let coverImageUrl = null;
        try {
            imagePrompt = (await craftImagePrompt(openai, title, excerpt)) || "";
            if (imagePrompt) {
                const id = articleId || `new-${Date.now()}`;
                const path = `covers/${id}-${Date.now()}.png`;
                coverImageUrl = await generateAndUploadImage(openai, imagePrompt, path);
            }
        }
        catch (err) {
            console.error("Image generation failed:", err);
        }
        res.json({ result: { tiptapJson, excerpt, imagePrompt, coverImageUrl } });
    }
    catch (err) {
        sendError(res, err);
    }
});
exports.regenerateimage = functions
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
    }
    catch (err) {
        sendError(res, err);
    }
});
exports.generatecontent = functions
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
                { role: "system", content: prompts_1.GENERATE_CONTENT_PROMPT },
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
    }
    catch (err) {
        sendError(res, err);
    }
});
// ─── Article CRUD Functions ─────────────────────────────────
exports.getarticles = functions
    .region("us-east1")
    .https.onRequest(async (req, res) => {
    try {
        await verifyAuth(req);
        const { status, includeAll } = req.body.data || req.body;
        let q = db.collection(ARTICLES);
        if (includeAll) {
            q = q.orderBy("created_at", "desc");
        }
        else {
            q = q.where("status", "==", status || "published").orderBy("created_at", "desc");
        }
        const snapshot = await q.get();
        res.json({ result: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
    }
    catch (err) {
        sendError(res, err);
    }
});
exports.getarticle = functions
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
    }
    catch (err) {
        sendError(res, err);
    }
});
exports.createarticle = functions
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
    }
    catch (err) {
        sendError(res, err);
    }
});
exports.updatearticle = functions
    .region("us-east1")
    .https.onRequest(async (req, res) => {
    try {
        await verifyAuth(req);
        const body = req.body.data || req.body;
        const { id, ...data } = body;
        if (!id) {
            res.status(400).json({ error: { message: "id is required" } });
            return;
        }
        const cleanData = { updated_at: new Date() };
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                cleanData[key] = value;
            }
        }
        await db.collection(ARTICLES).doc(id).update(cleanData);
        res.json({ result: { success: true } });
    }
    catch (err) {
        sendError(res, err);
    }
});
exports.deletearticle = functions
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
    }
    catch (err) {
        sendError(res, err);
    }
});
// ─── Storage Functions ──────────────────────────────────────
exports.listcovers = functions
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
    }
    catch (err) {
        sendError(res, err);
    }
});
exports.uploadcover = functions
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
        const jpegBuffer = await (0, sharp_1.default)(rawBuffer)
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
    }
    catch (err) {
        sendError(res, err);
    }
});
// ─── Comment Functions ──────────────────────────────────────
exports.submitcomment = functions
    .region("us-east1")
    .https.onRequest(async (req, res) => {
    try {
        const data = req.body.data || req.body;
        const { name, email, text, articleId, articleTitle, articleSlug, articleCategory } = data;
        // Validation
        if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
            res.status(400).json({ error: { message: "الاسم مطلوب (2-100 حرف)" } });
            return;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({ error: { message: "البريد الإلكتروني غير صالح" } });
            return;
        }
        if (!text || typeof text !== "string" || text.trim().length < 5 || text.trim().length > 2000) {
            res.status(400).json({ error: { message: "التعليق مطلوب (5-2000 حرف)" } });
            return;
        }
        if (!articleId || !articleTitle || !articleSlug || !articleCategory) {
            res.status(400).json({ error: { message: "بيانات المقال مطلوبة" } });
            return;
        }
        await db.collection(COMMENTS).add({
            articleId,
            articleTitle: articleTitle.trim(),
            articleSlug: articleSlug.trim(),
            articleCategory: articleCategory.trim(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            text: text.trim(),
            status: "pending",
            created_at: new Date(),
        });
        res.json({ result: { success: true } });
    }
    catch (err) {
        sendError(res, err);
    }
});
exports.getcomments = functions
    .region("us-east1")
    .https.onRequest(async (req, res) => {
    try {
        await verifyAuth(req);
        const data = req.body.data || req.body;
        const { status, articleId } = data;
        let q = db.collection(COMMENTS);
        if (status) {
            q = q.where("status", "==", status);
        }
        if (articleId) {
            q = q.where("articleId", "==", articleId);
        }
        q = q.orderBy("created_at", "desc");
        const snapshot = await q.get();
        res.json({ result: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
    }
    catch (err) {
        sendError(res, err);
    }
});
exports.replytocomment = functions
    .region("us-east1")
    .runWith({ timeoutSeconds: 30, secrets: ["RESEND_API_KEY"] })
    .https.onRequest(async (req, res) => {
    try {
        await verifyAuth(req);
        const data = req.body.data || req.body;
        const { commentId, reply, newStatus } = data;
        if (!commentId || !reply?.trim()) {
            res.status(400).json({ error: { message: "commentId و reply مطلوبان" } });
            return;
        }
        const commentRef = db.collection(COMMENTS).doc(commentId);
        const commentDoc = await commentRef.get();
        if (!commentDoc.exists) {
            res.status(404).json({ error: { message: "التعليق غير موجود" } });
            return;
        }
        const comment = commentDoc.data();
        const now = new Date();
        await commentRef.update({
            adminReply: reply.trim(),
            adminRepliedAt: now,
            status: newStatus || "approved",
        });
        // Send email notification
        try {
            const resendKey = process.env.RESEND_API_KEY;
            if (resendKey) {
                const resend = new resend_1.Resend(resendKey);
                const articleUrl = `https://thereturn-d3f2e.web.app/ar/${comment.articleCategory}/${encodeURIComponent(comment.articleSlug)}`;
                await resend.emails.send({
                    from: "عودة <onboarding@resend.dev>",
                    to: comment.email,
                    subject: `رد على تعليقك في مقال: ${comment.articleTitle}`,
                    html: `
              <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f7; border-radius: 12px;">
                <h2 style="color: #1a1a2e; margin-bottom: 8px;">عودة</h2>
                <p style="color: #555; margin-bottom: 24px;">تم الرد على تعليقك في مقال <strong>${comment.articleTitle}</strong></p>

                <div style="background: #fff; border-radius: 8px; padding: 16px; margin-bottom: 16px; border-right: 4px solid #ccc;">
                  <p style="color: #888; font-size: 13px; margin: 0 0 6px;">تعليقك:</p>
                  <p style="color: #333; margin: 0;">${comment.text}</p>
                </div>

                <div style="background: #fff; border-radius: 8px; padding: 16px; margin-bottom: 24px; border-right: 4px solid #c8a96e;">
                  <p style="color: #c8a96e; font-size: 13px; margin: 0 0 6px;">الرد:</p>
                  <p style="color: #333; margin: 0;">${reply.trim()}</p>
                </div>

                <a href="${articleUrl}" style="display: inline-block; background: #1a1a2e; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">
                  قراءة المقال
                </a>

                <p style="color: #aaa; font-size: 12px; margin-top: 32px;">هذا البريد تم إرساله تلقائيًا من موقع عودة</p>
              </div>
            `,
                });
            }
        }
        catch (emailErr) {
            console.error("Failed to send reply email:", emailErr);
            // Don't fail the request if email fails
        }
        res.json({ result: { success: true } });
    }
    catch (err) {
        sendError(res, err);
    }
});
exports.updatecommentstatus = functions
    .region("us-east1")
    .https.onRequest(async (req, res) => {
    try {
        await verifyAuth(req);
        const data = req.body.data || req.body;
        const { commentId, status } = data;
        if (!commentId || !["approved", "rejected", "pending"].includes(status)) {
            res.status(400).json({ error: { message: "commentId و status مطلوبان" } });
            return;
        }
        const commentRef = db.collection(COMMENTS).doc(commentId);
        const commentDoc = await commentRef.get();
        if (!commentDoc.exists) {
            res.status(404).json({ error: { message: "التعليق غير موجود" } });
            return;
        }
        await commentRef.update({ status });
        res.json({ result: { success: true } });
    }
    catch (err) {
        sendError(res, err);
    }
});
//# sourceMappingURL=index.js.map