import "server-only";
import { getDatabase } from "./mongodb";
import { getSynchronizedReciter, type SynchronizedReciter } from "./reciters";
import { getSurah } from "./quran";
import type { Surah } from "./types";

type RecitationDocument = {
  _id: string;
  source: "surah-json" | "ayah-json" | "sqlite";
  audioData: unknown;
  segmentMap?: unknown;
};

async function getRecitationSource(reciterId: string) {
  const database = await getDatabase();
  const document = await database.collection<RecitationDocument>("recitation_sources").findOne({ _id: reciterId });
  if (!document) throw new Error(`MongoDB recitation source is missing: ${reciterId}`);
  return document;
}

export async function loadSurahForRecitation(_request: Request, surahNumber: number) {
  return getSurah(surahNumber) as Promise<Surah | null>;
}

export async function loadSurahReciterFiles<TAudio, TSegments>(
  _request: Request,
  reciter: Extract<SynchronizedReciter, { source: "surah-json" }>,
) {
  const configured = getSynchronizedReciter(reciter.id);
  if (!configured || configured.source !== "surah-json") throw new Error(`Unknown reciter: ${reciter.id}`);
  const document = await getRecitationSource(reciter.id);
  return { audioData: document.audioData as TAudio, segmentMap: document.segmentMap as TSegments };
}

export async function loadAyahReciterFile<TAudio>(
  _request: Request,
  reciter: Extract<SynchronizedReciter, { source: "ayah-json" }>,
) {
  const configured = getSynchronizedReciter(reciter.id);
  if (!configured || configured.source !== "ayah-json") throw new Error(`Unknown reciter: ${reciter.id}`);
  return (await getRecitationSource(reciter.id)).audioData as TAudio;
}

export async function loadSqliteRecitationData(
  reciter: Extract<SynchronizedReciter, { source: "sqlite" }>,
) {
  const configured = getSynchronizedReciter(reciter.id);
  if (!configured || configured.source !== "sqlite") throw new Error(`Unknown reciter: ${reciter.id}`);
  const document = await getRecitationSource(reciter.id);
  return {
    audioData: document.audioData as Record<string, { audio_url: string; duration: number }>,
    segmentMap: (document.segmentMap ?? {}) as Record<string, { timestamp_from: number; timestamp_to: number; duration_sec: number; segments?: Array<[number, number, number]> }>,
  };
}
