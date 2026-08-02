import type { Document } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DocumentPart = { index: number; start: number; end: number; bytes: number; secureUrl: string };
type DocumentAsset = Document & { _id: string; filename: string; contentType: string; totalBytes: number; parts: DocumentPart[] };

async function getManifest() {
  const database = await getDatabase();
  return database.collection<DocumentAsset>("document_assets").findOne({ _id: "quran-tafseel" });
}

function responseHeaders(asset: DocumentAsset, length: number) {
  return new Headers({
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    "Content-Disposition": `inline; filename="${asset.filename}"`,
    "Content-Length": String(length),
    "Content-Type": asset.contentType,
  });
}

function requestedRange(header: string | null, total: number) {
  const match = header?.match(/^bytes=(\d+)-(\d*)$/);
  if (!match) return { start: 0, end: total - 1, partial: false };
  const start = Number(match[1]);
  const end = match[2] ? Math.min(Number(match[2]), total - 1) : total - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= total) return null;
  return { start, end, partial: true };
}

export async function HEAD() {
  const asset = await getManifest();
  if (!asset) return new Response(null, { status: 404 });
  return new Response(null, { headers: responseHeaders(asset, asset.totalBytes) });
}

export async function GET(request: Request) {
  const asset = await getManifest();
  if (!asset) return new Response("Quran PDF is unavailable", { status: 404 });
  const range = requestedRange(request.headers.get("range"), asset.totalBytes);
  if (!range) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${asset.totalBytes}` } });

  const selectedParts = asset.parts.filter((part) => part.end >= range.start && part.start <= range.end);
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (const part of selectedParts) {
          const localStart = Math.max(range.start, part.start) - part.start;
          const localEnd = Math.min(range.end, part.end) - part.start;
          const response = await fetch(part.secureUrl, { headers: { Range: `bytes=${localStart}-${localEnd}` } });
          if (!response.ok) throw new Error(`Cloudinary PDF part failed: ${response.status}`);
          let bytes = new Uint8Array(await response.arrayBuffer());
          if (response.status === 200 && (localStart !== 0 || localEnd !== part.bytes - 1)) bytes = bytes.slice(localStart, localEnd + 1);
          controller.enqueue(bytes);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
  const headers = responseHeaders(asset, range.end - range.start + 1);
  if (range.partial) headers.set("Content-Range", `bytes ${range.start}-${range.end}/${asset.totalBytes}`);
  return new Response(stream, { status: range.partial ? 206 : 200, headers });
}
