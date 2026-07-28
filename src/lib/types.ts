export type Localized = { ar: string; en: string };

export type Verse = {
  number: number;
  text: Localized;
  juz: number;
  page: number;
  sajda: boolean;
};

export type SurahMeta = {
  number: number;
  name: Localized & { transliteration: string };
  revelation_place: Localized;
  verses_count: number;
  words_count: number;
  letters_count: number;
};

export type Surah = SurahMeta & { verses: Verse[] };

export type Reciter = {
  id: number;
  reciter: Localized;
  rewaya: Localized;
  server: string;
};

export type Radio = { id: number; name: string; url: string };
