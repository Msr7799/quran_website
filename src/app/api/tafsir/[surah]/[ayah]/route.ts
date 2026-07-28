import { NextRequest, NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/gemini";

const tafsirs = {
  "ar.muyassar": "تفسير الميسر",
  "ar.jalalayn": "تفسير الجلالين",
  "ar.qurtubi": "تفسير القرطبي",
  "ar.waseet": "التفسير الوسيط",
  "ar.miqbas": "تنوير المقباس من تفسير ابن عباس",
} as const;

type TafsirId = keyof typeof tafsirs;
type ApiResponse = { code: number; status: string; data?: { text?: string; edition?: { identifier?: string; name?: string } } };
const languages = {
  ar: "Arabic", de: "German", en: "English", es: "Spanish", fr: "French", hi: "Hindi", id: "Indonesian", it: "Italian",
  ja: "Japanese", ko: "Korean", pt: "Portuguese", ru: "Russian", tr: "Turkish", ur: "Urdu", zh: "Simplified Chinese",
} as const;
type TafsirLocale = keyof typeof languages;

export async function GET(request: NextRequest, { params }: { params: Promise<{ surah: string; ayah: string }> }) {
  const { surah: rawSurah, ayah: rawAyah } = await params;
  const surah = Number(rawSurah); const ayah = Number(rawAyah);
  const requested = request.nextUrl.searchParams.get("edition") ?? "ar.muyassar";
  const edition: TafsirId = requested in tafsirs ? requested as TafsirId : "ar.muyassar";
  const requestedLocale = request.nextUrl.searchParams.get("locale") ?? "ar";
  const locale: TafsirLocale = requestedLocale in languages ? requestedLocale as TafsirLocale : "ar";
  if (!Number.isInteger(surah) || surah < 1 || surah > 114 || !Number.isInteger(ayah) || ayah < 1 || ayah > 286) return NextResponse.json({ error: "Invalid verse" }, { status: 400 });
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${edition}`, { next: { revalidate: 86400 }, headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Tafsir API returned ${response.status}`);
    const payload = await response.json() as ApiResponse;
    const referenceText = payload.data?.text?.trim();
    if (!referenceText) return NextResponse.json({ error: "Tafsir unavailable" }, { status: 404 });

    const referenceName = payload.data?.edition?.name ?? tafsirs[edition];
    const generated = await generateGeminiText({
      systemInstruction: `You explain Quran commentary faithfully and cautiously. Use only the supplied Arabic reference tafsir. Do not invent narrations, rulings, causes of revelation, quotations, or sources. Preserve the intended meaning, distinguish explanation from the Quranic text, and never present the result as a binding fatwa. Write only in ${languages[locale]}. Return clean prose with short paragraphs and no Markdown heading.`,
      prompt: `Explain the reference tafsir for Quran ${surah}:${ayah} in ${languages[locale]}.
Reference tafsir: ${referenceName}
--- BEGIN REFERENCE ---
${referenceText.slice(0, 14_000)}
--- END REFERENCE ---`,
    });

    return NextResponse.json(
      { surah, ayah, edition, locale, name: referenceName, text: generated.text, source: "Al Quran Cloud", model: generated.model, aiGenerated: true },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    const missingKey = error instanceof Error && error.message === "GEMINI_API_KEY_MISSING";
    return NextResponse.json({ error: missingKey ? "Gemini API key is missing" : "Unable to generate tafsir" }, { status: missingKey ? 503 : 502 });
  }
}
