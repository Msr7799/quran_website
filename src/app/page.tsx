import { readFile } from "node:fs/promises";
import path from "node:path";
import { HeroCarousel } from "@/components/HeroCarousel";
import { HomeContent } from "@/components/HomeContent";
import { getSurahs } from "@/lib/quran";
import { getHeroMedia } from "@/lib/hero-media";
import { connection } from "next/server";

type AzkarFile = { data: Array<{ id: number; category: string; zekr: string; reference: string }> };
type Collection = { bookNumber: number; bookName: string; aboutBook: string; parts_count: number };

function decodeText(value: string) {
  return /[ÃØÙÛ]/.test(value) ? Buffer.from(value, "latin1").toString("utf8") : value;
}

async function loadHomeData() {
  const root = path.join(process.cwd(), "public", "data");
  const [azkarRaw, collectionsRaw] = await Promise.all([
    readFile(path.join(root, "azkar.json"), "utf8"),
    readFile(path.join(root, "collections.json"), "utf8"),
  ]);
  const azkar = JSON.parse(azkarRaw) as AzkarFile;
  const collections = JSON.parse(collectionsRaw) as Collection[];
  return {
    azkar: azkar.data.slice(0, 12).map((item) => ({ ...item, category: decodeText(item.category), zekr: decodeText(item.zekr), reference: decodeText(item.reference) })),
    collections: collections.map((item) => ({ ...item, bookName: decodeText(item.bookName), aboutBook: decodeText(item.aboutBook) })),
  };
}

export default async function Home() {
  // Scan the folder per request so newly added hero files appear automatically.
  await connection();
  const [surahs, content, heroMedia] = await Promise.all([getSurahs(), loadHomeData(), getHeroMedia()]);
  return <>
    <HeroCarousel desktopMedia={heroMedia.desktop} mobileMedia={heroMedia.mobile} />
    <HomeContent surahs={surahs} azkar={content.azkar} collections={content.collections} />
  </>;
}
