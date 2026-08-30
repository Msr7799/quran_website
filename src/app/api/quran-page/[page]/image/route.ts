import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 1 || page > 604) return NextResponse.json({ error: "Invalid Quran page" }, { status: 400 });
  try {
    const response = await fetch(`https://msr-quran-data.vercel.app/data/quran_image/${page}.png`, { next: { revalidate: 2592000 } });
    if (!response.ok || !response.body) throw new Error(`Quran image API returned ${response.status}`);
    return new NextResponse(response.body, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=604800, stale-while-revalidate=2592000" } });
  } catch {
    return NextResponse.json({ error: "Unable to load Quran image" }, { status: 502 });
  }
}
