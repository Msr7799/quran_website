import "server-only";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { getSynchronizedReciter, type SynchronizedReciter } from "./reciters";
import type { Surah } from "./types";

const PUBLIC_DATA_REVALIDATE_SECONDS = 86400;
const HUTHAIFY_DATABASE_PATH = path.join(
  process.cwd(),
  "public",
  "surah-recitation-ali-abdur-rahman-al-huthaify.db",
  "surah-recitation-ali-abdur-rahman-al-huthaify.db",
);

function normalizePublicPath(relativePath: string) {
  const slashPath = relativePath.replaceAll("\\", "/");
  const parts = slashPath.split("/");
  if (
    slashPath.startsWith("/")
    || parts.some((part) => part === "" || part === "." || part === "..")
  ) {
    throw new Error(`Invalid public data path: ${relativePath}`);
  }
  return parts.join("/");
}

function publicDataUrl(request: Request, relativePath: string) {
  const normalizedPath = normalizePublicPath(relativePath);
  const encodedPath = normalizedPath.split("/").map(encodeURIComponent).join("/");
  const origin = new URL(request.url).origin;
  return new URL(`/${encodedPath}`, `${origin}/`);
}

async function fetchPublicJson<T>(request: Request, relativePath: string, revalidate = true): Promise<T> {
  const cookie = request.headers.get("cookie");
  const headers = cookie ? { cookie } : undefined;
  const response = await fetch(
    publicDataUrl(request, relativePath),
    revalidate
      ? { headers, next: { revalidate: PUBLIC_DATA_REVALIDATE_SECONDS } }
      : { headers, cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`Failed to load public data ${relativePath}: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function loadSurahForRecitation(request: Request, surahNumber: number) {
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) return null;
  return fetchPublicJson<Surah>(request, `data/surah/surah_${surahNumber}.json`);
}

export async function loadSurahReciterFiles<TAudio, TSegments>(
  request: Request,
  reciter: Extract<SynchronizedReciter, { source: "surah-json" }>,
) {
  const configured = getSynchronizedReciter(reciter.id);
  if (!configured || configured.source !== "surah-json") {
    throw new Error(`Unknown surah JSON reciter: ${reciter.id}`);
  }
  const folder = normalizePublicPath(configured.folder);
  const [audioData, segmentMap] = await Promise.all([
    fetchPublicJson<TAudio>(request, `${folder}/surah.json`, false),
    fetchPublicJson<TSegments>(request, `${folder}/segments.json`, false),
  ]);
  return { audioData, segmentMap };
}

export async function loadAyahReciterFile<TAudio>(
  request: Request,
  reciter: Extract<SynchronizedReciter, { source: "ayah-json" }>,
) {
  const configured = getSynchronizedReciter(reciter.id);
  if (!configured || configured.source !== "ayah-json") {
    throw new Error(`Unknown ayah JSON reciter: ${reciter.id}`);
  }
  return fetchPublicJson<TAudio>(request, normalizePublicPath(configured.file), false);
}

export function openSqliteRecitationDatabase(
  reciter: Extract<SynchronizedReciter, { source: "sqlite" }>,
) {
  const configured = getSynchronizedReciter(reciter.id);
  if (!configured || configured.source !== "sqlite" || configured.id !== "ali-abdur-rahman-al-huthaify") {
    throw new Error(`Unknown SQLite reciter: ${reciter.id}`);
  }
  return new DatabaseSync(HUTHAIFY_DATABASE_PATH, { readOnly: true });
}
