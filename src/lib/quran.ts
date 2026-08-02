import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Radio, Reciter, Surah, SurahMeta, Verse } from "./types";

type HafsSmartAyah = {
  id: number;
  jozz: number;
  sura_no: number;
  sura_name_en: string;
  sura_name_ar: string;
  page: number;
  line_start: number;
  line_end: number;
  aya_no: number;
  aya_text: string;
  aya_text_emlaey: string;
};

export type QuranSearchResult = {
  id: number;
  surahNumber: number;
  surahName: string;
  surahNameEn: string;
  ayahNumber: number;
  text: string;
  page: number;
  juz: number;
  lineStart: number;
  lineEnd: number;
};

const HAFS_SMART_FILE = path.join(process.cwd(), "public", "hafs_smart.json");
const QURAN_DATA_DIR = path.join(process.cwd(), "public", "data");
const SURAH_DATA_DIR = path.join(QURAN_DATA_DIR, "surah");
const SURAH_METADATA_FILE = path.join(QURAN_DATA_DIR, "metadata.json");
const RECITERS_FILE = path.join(QURAN_DATA_DIR, "quranMp3.json");
const RADIOS_FILE = path.join(QURAN_DATA_DIR, "radios.json");
let hafsSmartData: Promise<HafsSmartAyah[]> | undefined;

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

function getHafsSmartAyahs() {
  hafsSmartData ??= readJson<HafsSmartAyah[]>(HAFS_SMART_FILE);
  return hafsSmartData;
}

export const getSurahs = () => readJson<SurahMeta[]>(SURAH_METADATA_FILE);

export async function getSurah(id: number) {
  if (!Number.isInteger(id) || id < 1 || id > 114) return null;
  return readJson<Surah>(path.join(SURAH_DATA_DIR, `surah_${id}.json`));
}

export const getReciters = () => readJson<Reciter[]>(RECITERS_FILE);

export async function getRadios() {
  return (await readJson<{ radios: Radio[] }>(RADIOS_FILE)).radios;
}

export async function getPage(page: number) {
  if (!Number.isInteger(page) || page < 1 || page > 604) return [];
  const metadata = await getSurahs();
  const results: Array<{ surah: SurahMeta; verses: Verse[] }> = [];
  for (const meta of metadata) {
    const surah = await getSurah(meta.number);
    const verses = surah?.verses.filter((verse) => verse.page === page) ?? [];
    if (verses.length) results.push({ surah: meta, verses });
  }
  return results;
}

function normalizeQuranSearch(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g, "")
    .replace(/[ٱأإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .toLocaleLowerCase("ar")
    .replace(/\s+/g, " ")
    .trim();
}

export async function searchQuran(query: string, limit = 80) {
  const clean = normalizeQuranSearch(query);
  if (clean.length < 2) return [];
  const ayahs = await getHafsSmartAyahs();
  const results: QuranSearchResult[] = [];
  for (const ayah of ayahs) {
    const searchable = normalizeQuranSearch(ayah.aya_text_emlaey);
    if (searchable.includes(clean)) {
      results.push({
        id: ayah.id,
        surahNumber: ayah.sura_no,
        surahName: ayah.sura_name_ar,
        surahNameEn: ayah.sura_name_en,
        ayahNumber: ayah.aya_no,
        text: ayah.aya_text_emlaey,
        page: ayah.page,
        juz: ayah.jozz,
        lineStart: ayah.line_start,
        lineEnd: ayah.line_end,
      });
      if (results.length >= limit) break;
    }
  }
  return results;
}
