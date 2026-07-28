import { NextResponse } from "next/server";

const editions = {
  de: { edition: "deu-frankbubenheima", author: "Frank Bubenheim & Nadeem Elyas", source: "https://quranenc.com/en/browse/german_bubenheim" },
  en: { edition: "eng-rowwadtranslati", author: "Rowwad Translation Center", source: "https://quranenc.com/en/browse/english_rwwad" },
  es: { edition: "spa-islamicfoundati1", author: "Islamic Foundation", source: "https://quranenc.com/en/browse/spanish_montada_latin" },
  fr: { edition: "fra-islamicfoundati", author: "Islamic Foundation", source: "https://quranenc.com/en/browse/french_montada" },
  hi: { edition: "hin-maulanaazizulha", author: "Maulana Azizul Haque Al-Umari", source: "https://quranenc.com/en/browse/hindi_omari" },
  id: { edition: "ind-indonesianislam", author: "Indonesian Islamic Affairs Ministry", source: "https://quranenc.com/en/browse/indonesian_affairs" },
  it: { edition: "ita-hamzarobertopic", author: "Hamza Roberto Piccardo", source: "https://tanzil.net" },
  ja: { edition: "jpn-ryoichimita", author: "Ryoichi Mita", source: "https://quranenc.com/en/browse/japanese_meta" },
  ko: { edition: "kor-hamidchoi", author: "Hamid Choi", source: "https://qurancomplex.gov.sa" },
  pt: { edition: "por-helminasr", author: "Helmi Nasr", source: "https://quranenc.com/en/browse/portuguese_nasr" },
  ru: { edition: "rus-elmirkuliev", author: "Elmir Kuliev", source: "https://tanzil.net" },
  tr: { edition: "tur-diyanetisleri", author: "Diyanet İşleri", source: "https://tanzil.net" },
  ur: { edition: "urd-muhammadjunagar", author: "Muhammad Junagarhi", source: "https://tanzil.net" },
  zh: { edition: "zho-muhammadmakin", author: "Muhammad Makin", source: "https://quranenc.com/en/browse/chinese_makin" },
} as const;

type TranslationLocale = keyof typeof editions;
type EditionResponse = { chapter?: Array<{ chapter?: number; verse?: number; text?: string }> };

async function fetchEdition(edition: string, surah: number) {
  const base = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${edition}/${surah}`;
  for (const extension of ["min.json", "json"]) {
    const response = await fetch(`${base}.${extension}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(12_000),
    });
    if (response.ok) return response.json() as Promise<EditionResponse>;
  }
  throw new Error("Translation source unavailable");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; surah: string }> },
) {
  const { locale: rawLocale, surah: rawSurah } = await params;
  const surah = Number(rawSurah);
  if (!(rawLocale in editions) || !Number.isInteger(surah) || surah < 1 || surah > 114) {
    return NextResponse.json({ error: "Unsupported translation or surah" }, { status: 404 });
  }

  const locale = rawLocale as TranslationLocale;
  const selected = editions[locale];
  try {
    const data = await fetchEdition(selected.edition, surah);
    const verses = (data.chapter ?? [])
      .filter((verse) => verse.chapter === surah && Number.isInteger(verse.verse) && typeof verse.text === "string")
      .map((verse) => ({ verse: verse.verse as number, text: (verse.text as string).trim() }));
    if (!verses.length) throw new Error("Translation chapter is empty");

    return NextResponse.json(
      { locale, surah, verses, author: selected.author, source: selected.source, repository: "fawazahmed0/quran-api" },
      { headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" } },
    );
  } catch {
    return NextResponse.json({ error: "Unable to load this Quran translation" }, { status: 502 });
  }
}
