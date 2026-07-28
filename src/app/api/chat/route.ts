import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { getGeminiApiKey, isGeminiModel, type GeminiModel } from "@/lib/gemini";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };
type TavilyResult = { title?: string; url?: string; content?: string };
const responseLanguages = { ar: "Arabic", en: "English", tr: "Turkish", hi: "Hindi", ur: "Urdu", ru: "Russian", es: "Spanish", fr: "French", de: "German", it: "Italian", pt: "Portuguese", zh: "Simplified Chinese", ja: "Japanese", ko: "Korean", id: "Indonesian" } as const;

function isTemporaryGeminiError(error: unknown) {
  const value = error as { status?: number; code?: number; message?: string };
  const message = value?.message ?? String(error);
  return value?.status === 429 || value?.status === 503 || value?.code === 429 || value?.code === 503 || /(?:429|503|UNAVAILABLE|RESOURCE_EXHAUSTED|high demand)/i.test(message);
}

function pause(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const systemInstruction = `أنت نور AI، مساعد قرآني محترف وودود داخل موقع القرآن المجيد.
ابدأ بالجواب المباشر، ثم نظّمه بعناوين وقوائم أو جداول عند الحاجة. استخدم Markdown واضحاً ومعتدلاً.
لا تنسب آية أو حديثاً إلا عند الثقة، واذكر السورة ورقم الآية أو مصدر الحديث قدر الإمكان.
ميّز بوضوح بين النص الشرعي والشرح، ولا تختلق مصدراً أو حكماً. لا تصدر فتوى ملزمة، ووجّه المستخدم إلى عالم موثوق في المسائل الحساسة.
إذا زُوّدت بنتائج بحث، استخدمها عند صلتها بالسؤال، واذكر الروابط بصيغة Markdown [اسم المصدر](الرابط). لا تدّعِ التصفح إن لم توجد نتائج.
لا تعرض أفكارك الداخلية أو سلسلة الاستدلال؛ قدّم النتيجة والأسباب المختصرة المفيدة فقط.`;

async function searchWeb(query: string): Promise<TavilyResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("مفتاح Tavily غير موجود في ملف .env.");
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, query, search_depth: "advanced", max_results: 10, include_answer: false, include_images: false }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error("تعذر إكمال البحث في الويب.");
  const data = await response.json() as { results?: TavilyResult[] };
  return (data.results ?? []).filter((item) => item.url && item.title).slice(0, 10);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as { model?: unknown; messages?: ChatMessage[]; webSearch?: boolean; locale?: unknown };
    const model = isGeminiModel(payload.model) ? payload.model : "gemini-2.5-flash";
    const messages = Array.isArray(payload.messages) ? payload.messages.slice(-16) : [];
    const latest = messages.at(-1);
    const locale = typeof payload.locale === "string" && payload.locale in responseLanguages ? payload.locale as keyof typeof responseLanguages : "ar";
    if (!latest || latest.role !== "user" || !latest.content.trim()) return NextResponse.json({ error: "اكتب سؤالك أولاً." }, { status: 400 });
    const apiKey = await getGeminiApiKey();
    if (!apiKey) return NextResponse.json({ error: "مفتاح Gemini غير موجود في ملف .env." }, { status: 503 });

    const sources = payload.webSearch ? await searchWeb(latest.content.trim()) : [];
    const webContext = sources.length ? `\n\nنتائج بحث حديثة:\n${sources.map((item, index) => `${index + 1}. ${item.title}\n${item.url}\n${item.content ?? ""}`).join("\n\n")}` : "";
    const context = messages.map((message) => `${message.role === "user" ? "المستخدم" : "نور"}: ${message.content}`).join("\n\n") + webContext;
    const ai = new GoogleGenAI({ apiKey });
    const fallbackModels: GeminiModel[] = model === "gemini-2.5-flash-lite"
      ? [model, "gemini-2.5-flash"]
      : [model, "gemini-2.5-flash-lite"];
    const candidates = [...new Set(fallbackModels)];
    let text = "";
    let usedModel: GeminiModel = model;
    let lastError: unknown;

    generation: for (const candidate of candidates) {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const response = await ai.models.generateContent({
            model: candidate,
            contents: context,
            config: {
              systemInstruction: `${systemInstruction}\nAlways answer in ${responseLanguages[locale]}, unless the user explicitly asks for another language. Keep Quranic Arabic quotations in Arabic and explain them in ${responseLanguages[locale]}. Cite useful sources inline with short Markdown links, but do not append a raw or numbered sources section because the interface renders the source cards separately.`,
              temperature: 0.35,
              maxOutputTokens: 4096,
              ...(candidate.startsWith("gemini-2.5") ? { thinkingConfig: { thinkingBudget: 1024 } } : {}),
            },
          });
          text = response.text?.trim() ?? "";
          usedModel = candidate;
          if (text) break generation;
        } catch (error) {
          lastError = error;
          if (!isTemporaryGeminiError(error)) throw error;
          if (attempt === 0) await pause(900);
        }
      }
    }

    if (!text && lastError) throw lastError;
    if (!text) return NextResponse.json({ error: "لم تصل إجابة من Gemini. حاول مرة أخرى." }, { status: 502 });
    return NextResponse.json({ text, model: usedModel, sources: sources.map(({ title, url }) => ({ title, url })) });
  } catch (error) {
    const unavailable = isTemporaryGeminiError(error);
    return NextResponse.json(
      { error: unavailable ? "خدمة Gemini مشغولة حاليًا. حاول مرة أخرى بعد لحظات." : "تعذر الاتصال بخدمة الذكاء الاصطناعي. حاول مرة أخرى." },
      { status: unavailable ? 503 : 500 },
    );
  }
}
