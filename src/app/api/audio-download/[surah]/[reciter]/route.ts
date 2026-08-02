import "server-only";
import { getAudioSources } from "@/lib/quran";

type AudioReciter = {
  id: number;
  link: string;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ surah: string; reciter: string }> },
) {
  const values = await params;
  const surah = Number(values.surah);
  const reciter = Number(values.reciter);

  if (!Number.isInteger(surah) || surah < 1 || surah > 114 || !Number.isInteger(reciter) || reciter < 1) {
    return new Response("Invalid recitation", { status: 400 });
  }

  try {
    const reciters = (await getAudioSources(surah))?.items as AudioReciter[] | undefined;
    if (!reciters) return new Response("Recitation not found", { status: 404 });
    const selected = reciters.find((item) => item.id === reciter);
    if (!selected) return new Response("Recitation not found", { status: 404 });

    const sourceUrl = new URL(selected.link);
    if (sourceUrl.protocol !== "https:") return new Response("Invalid audio source", { status: 502 });

    const upstream = await fetch(sourceUrl, { cache: "no-store", signal: request.signal });
    if (!upstream.ok || !upstream.body) return new Response("Audio source unavailable", { status: 502 });

    const headers = new Headers({
      "Content-Type": upstream.headers.get("content-type") ?? "audio/mpeg",
      "Content-Disposition": `attachment; filename="quran-${String(surah).padStart(3, "0")}-reciter-${reciter}.mp3"`,
      "Cache-Control": "private, no-store",
    });
    const contentLength = upstream.headers.get("content-length");
    if (contentLength) headers.set("Content-Length", contentLength);

    return new Response(upstream.body, { status: 200, headers });
  } catch {
    return new Response("Unable to download recitation", { status: 502 });
  }
}
