import "server-only";
import type { Filter } from "mongodb";
import { getDatabase } from "./mongodb";
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
  normalizedText: string;
};

type DatasetDocument<T> = { _id: string; data: T };
type SurahDocument = Surah & { _id: number };
type VerseDocument = Verse & { _id: string; surahNumber: number };

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

async function getDataset<T>(id: string) {
  const database = await getDatabase();
  const document = await database.collection<DatasetDocument<T>>("content_datasets").findOne({ _id: id });
  if (!document) throw new Error(`MongoDB dataset is missing: ${id}`);
  return document.data;
}

export const getSurahs = () => getDataset<SurahMeta[]>("metadata");

export async function getSurah(id: number) {
  if (!Number.isInteger(id) || id < 1 || id > 114) return null;
  const database = await getDatabase();
  const document = await database.collection<SurahDocument>("quran_surahs").findOne({ _id: id });
  if (!document) return null;
  const { _id, ...surah } = document;
  void _id;
  return surah as Surah;
}

export const getReciters = () => getDataset<Reciter[]>("reciters");

export async function getRadios() {
  return (await getDataset<{ radios: Radio[] }>("radios")).radios;
}

export const getAzkar = () => getDataset<{ data: Array<{ id: number; category: string; zekr: string; reference: string }> }>("azkar");
export const getCollections = () => getDataset<Array<{ bookNumber: number; bookName: string; aboutBook: string; parts_count: number }>>("collections");
export const getReligiousEvents = () => getDataset<{ data: Array<{ id: number; title: string; month: number; day: number[]; isReminder: boolean; isLottie: boolean; isSvg: boolean; lottiePath: string; svgPath: string; hadith: Array<{ hadith: string; bookInfo: string }> }> }>("religious-events");
export const getLibraryBooks = () => getDataset<unknown>("library-books");

export async function getAudioSources(surah: number) {
  const database = await getDatabase();
  return database.collection<{ _id: number; items: Array<{ id: number; link: string }> }>("audio_sources").findOne({ _id: surah });
}

export async function getPage(page: number) {
  if (!Number.isInteger(page) || page < 1 || page > 604) return [];
  const [metadata, database] = await Promise.all([getSurahs(), getDatabase()]);
  const verses = await database.collection<VerseDocument>("quran_verses")
    .find({ page }).sort({ surahNumber: 1, number: 1 }).toArray();
  const bySurah = new Map<number, Verse[]>();
  for (const { _id, surahNumber, ...verse } of verses) {
    void _id;
    const list = bySurah.get(surahNumber) ?? [];
    list.push(verse as Verse);
    bySurah.set(surahNumber, list);
  }
  return [...bySurah].map(([surahNumber, pageVerses]) => ({
    surah: metadata[surahNumber - 1],
    verses: pageVerses,
  })).filter((item) => item.surah);
}

export function normalizeQuranSearch(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
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
  const database = await getDatabase();
  const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const filter: Filter<HafsSmartAyah> = { normalizedText: { $regex: escaped } };
  const ayahs = await database.collection<HafsSmartAyah>("quran_search").find(filter).sort({ id: 1 }).limit(limit).toArray();
  return ayahs.map((ayah): QuranSearchResult => ({
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
  }));
}
