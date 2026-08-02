import { NextResponse } from "next/server";
import {
  loadAyahReciterFile,
  loadSqliteRecitationData,
  loadSurahForRecitation,
  loadSurahReciterFiles,
} from "@/lib/recitation-data-loader";
import { getSynchronizedReciter, type SynchronizedReciter } from "@/lib/reciters";
import type { Surah } from "@/lib/types";

export const runtime = "nodejs";

type WordSegment = [word: number, timestampFrom: number, timestampTo: number];
type Segment = { timestamp_from: number; timestamp_to: number; duration_ms?: number; segments?: WordSegment[] };
type SegmentMap = Record<string, Segment>;
type SurahAudio = Record<string, { audio_url: string; duration: number }>;
type AyahAudio = Record<string, {
  surah_number: number;
  ayah_number: number;
  audio_url: string;
  duration: number | null;
  segments: WordSegment[];
}>;
type Track = { ayah: number; audioUrl: string; timestamp_from: number; timestamp_to: number; duration: number };

function estimatedSegments(surah: Surah, durationSeconds: number) {
  const durationMs = durationSeconds * 1000;
  const weights = surah.verses.map((verse) => Math.max(1, verse.text.ar.replace(/\s/g, "").length));
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = 0;

  return surah.verses.map((verse, index) => {
    const from = cursor;
    cursor = index === weights.length - 1
      ? durationMs
      : cursor + Math.round(durationMs * weights[index] / total);
    return {
      ayah: verse.number,
      page: verse.page,
      timestamp_from: from,
      timestamp_to: cursor,
      duration_ms: cursor - from,
      segments: estimatedWordSegments(verse.text.ar, from, cursor),
    };
  });
}

function estimatedWordSegments(text: string, from: number, to: number): WordSegment[] {
  const words = text.trim().split(/\s+/);
  const weights = words.map((word) => Math.max(1, word.replace(/\s/g, "").length));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = from;
  return words.map((_, index) => {
    const wordFrom = cursor;
    cursor = index === words.length - 1 ? to : cursor + Math.round((to - from) * weights[index] / total);
    return [index + 1, wordFrom, cursor];
  });
}

function normalizedWordSegments(segments: WordSegment[] | undefined, text: string, from: number, to: number) {
  const wordCount = text.trim().split(/\s+/).length;
  const wordIds = new Set(segments?.map((segment) => segment[0]) ?? []);
  const matchesDisplayedText = wordIds.size === wordCount
    && [...wordIds].every((word) => word >= 1 && word <= wordCount);
  return matchesDisplayedText ? segments : estimatedWordSegments(text, from, to);
}

function normalizedSurahSegments(surah: Surah, segmentMap: SegmentMap, duration: number) {
  const realSegments = surah.verses
    .map((verse) => {
      const timing = segmentMap[`${surah.number}:${verse.number}`];
      if (!timing) return null;
      return {
        ayah: verse.number,
        page: verse.page,
        ...timing,
        segments: normalizedWordSegments(timing.segments, verse.text.ar, timing.timestamp_from, timing.timestamp_to),
      };
    })
    .filter((segment): segment is NonNullable<typeof segment> => segment !== null)
    .filter((segment) => typeof segment.timestamp_from === "number");

  return realSegments.length === surah.verses.length
    ? { segments: realSegments, estimated: false }
    : { segments: estimatedSegments(surah, duration), estimated: true };
}

async function loadSurahJson(request: Request, reciter: Extract<SynchronizedReciter, { source: "surah-json" }>, surah: Surah) {
  const { audioData, segmentMap } = await loadSurahReciterFiles<SurahAudio, SegmentMap>(request, reciter);
  const audio = audioData[String(surah.number)];
  if (!audio) return null;
  const timing = normalizedSurahSegments(surah, segmentMap, audio.duration);
  return { audioMode: "surah" as const, audioUrl: audio.audio_url, duration: audio.duration, tracks: [] as Track[], ...timing };
}

async function loadAyahJson(request: Request, reciter: Extract<SynchronizedReciter, { source: "ayah-json" }>, surah: Surah) {
  const audioData = await loadAyahReciterFile<AyahAudio>(request, reciter);
  let cursor = 0;
  const tracks: Track[] = [];
  const segments = surah.verses.map((verse) => {
    const audio = audioData[`${surah.number}:${verse.number}`];
    if (!audio) return null;
    const durationMs = audio.duration
      ? Math.round(audio.duration * 1000)
      : Math.max(...audio.segments.map((segment) => segment[2]), 1);
    const from = cursor;
    const to = from + durationMs;
    tracks.push({ ayah: verse.number, audioUrl: audio.audio_url, timestamp_from: from, timestamp_to: to, duration: durationMs / 1000 });
    cursor = to;
    return {
      ayah: verse.number,
      page: verse.page,
      timestamp_from: from,
      timestamp_to: to,
      duration_ms: durationMs,
      segments: normalizedWordSegments(audio.segments, verse.text.ar, 0, durationMs)
        ?.map(([word, wordFrom, wordTo]) => [word, from + wordFrom, from + wordTo] as WordSegment),
    };
  }).filter((segment): segment is NonNullable<typeof segment> => segment !== null);

  if (segments.length !== surah.verses.length || tracks.length === 0) return null;
  return { audioMode: "ayah" as const, audioUrl: tracks[0].audioUrl, duration: cursor / 1000, tracks, segments, estimated: false };
}

async function loadSqlite(reciter: Extract<SynchronizedReciter, { source: "sqlite" }>, surah: Surah) {
  const { audioData, segmentMap: storedSegments } = await loadSqliteRecitationData(reciter);
  const audio = audioData[String(surah.number)];
  if (!audio) return null;
  const segmentMap: SegmentMap = Object.fromEntries(Object.entries(storedSegments)
    .filter(([key]) => key.startsWith(`${surah.number}:`))
    .map(([key, value]) => [key, {
      timestamp_from: value.timestamp_from,
      timestamp_to: value.timestamp_to,
      duration_ms: value.duration_sec * 1000,
      segments: value.segments ?? [],
    }]));
    const timing = normalizedSurahSegments(surah, segmentMap, audio.duration);
    return { audioMode: "surah" as const, audioUrl: audio.audio_url, duration: audio.duration, tracks: [] as Track[], ...timing };
}

export async function GET(request: Request, { params }: { params: Promise<{ reciter: string; surah: string }> }) {
  const { reciter: reciterId, surah: rawSurah } = await params;
  const reciter = getSynchronizedReciter(reciterId);
  const surahNumber = Number(rawSurah);
  if (!reciter || !Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return NextResponse.json({ error: "Invalid reciter or surah" }, { status: 404 });
  }

  const surah = await loadSurahForRecitation(request, surahNumber);
  if (!surah) return NextResponse.json({ error: "Recitation unavailable" }, { status: 404 });

  const data = reciter.source === "surah-json"
    ? await loadSurahJson(request, reciter, surah)
    : reciter.source === "ayah-json"
      ? await loadAyahJson(request, reciter, surah)
      : await loadSqlite(reciter, surah);
  if (!data) return NextResponse.json({ error: "Recitation unavailable" }, { status: 404 });

  if (new URL(request.url).searchParams.has("download")) {
    const safeName = `${reciter.id}-${String(surahNumber).padStart(3, "0")}`;
    const downloadUrl = data.audioMode === "ayah" && "downloadBase" in reciter
      ? `${reciter.downloadBase}/${String(surahNumber).padStart(3, "0")}.mp3`
      : data.audioUrl;
    const audioResponse = await fetch(downloadUrl);
    if (!audioResponse.ok || !audioResponse.body) {
      return NextResponse.json({ error: "Audio download unavailable" }, { status: 502 });
    }
    return new Response(audioResponse.body, {
      headers: {
        "Content-Type": audioResponse.headers.get("content-type") ?? "audio/mpeg",
        "Content-Disposition": `attachment; filename="${safeName}.mp3"`,
      },
    });
  }

  return NextResponse.json(
    { reciter: { id: reciter.id, ar: reciter.ar, en: reciter.en }, surah: surahNumber, ...data },
    { headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" } },
  );
}
