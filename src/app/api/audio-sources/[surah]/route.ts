import { NextResponse } from "next/server";
import { getAudioSources } from "@/lib/quran";

export async function GET(_request: Request, { params }: { params: Promise<{ surah: string }> }) {
  const surah = Number((await params).surah);
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) {
    return NextResponse.json({ error: "Invalid surah" }, { status: 400 });
  }
  const document = await getAudioSources(surah);
  if (!document) return NextResponse.json({ error: "Audio sources unavailable" }, { status: 404 });
  return NextResponse.json(document.items, {
    headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
  });
}
