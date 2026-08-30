import { NextResponse } from "next/server";

type PageBoundary = { surah_number: number; verse: number; name: { ar: string; en: string; transliteration: string } };
type PageResult = { page: number; image: { url: string }; start: PageBoundary; end: PageBoundary };
type PageResponse = { success: boolean; result?: PageResult[] };

export async function GET(_: Request, { params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 1 || page > 604) return NextResponse.json({ error: "Invalid Quran page" }, { status: 400 });
  try {
    const response = await fetch(`https://msr-quran-data.vercel.app/api/pages?page=${page}`, { next: { revalidate: 2592000 }, headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Quran pages API returned ${response.status}`);
    const payload = await response.json() as PageResponse; const result = payload.result?.[0];
    if (!payload.success || !result) return NextResponse.json({ error: "Quran page unavailable" }, { status: 404 });
    return NextResponse.json({ ...result, image: `/api/quran-page/${page}/image` }, { headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=2592000" } });
  } catch {
    return NextResponse.json({ error: "Unable to load Quran page" }, { status: 502 });
  }
}
