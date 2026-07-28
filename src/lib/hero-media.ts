import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const HERO_DIRECTORY = path.join(process.cwd(), "public", "images", "heroes");
const SUPPORTED_EXTENSIONS = "(?:mp4|png|jpe?g|webp)";
const desktopName = new RegExp(`^hero(?:-?(\\d+))?\\.${SUPPORTED_EXTENSIONS}$`, "i");
const mobileName = new RegExp(`^mobile-hero(?:-?(\\d+))?\\.${SUPPORTED_EXTENSIONS}$`, "i");

type HeroFile = { name: string; order: number };

function matchHeroFile(name: string, pattern: RegExp): HeroFile | null {
  const match = name.match(pattern);
  if (!match) return null;

  return {
    name,
    // The unnumbered file (hero/mobile-hero) always comes first.
    order: match[1] === undefined ? -1 : Number(match[1]),
  };
}

function sortHeroFiles(files: HeroFile[]) {
  return files.sort((first, second) =>
    first.order - second.order ||
    first.name.localeCompare(second.name, "en", { numeric: true, sensitivity: "base" }),
  );
}

export async function getHeroMedia() {
  const entries = await readdir(HERO_DIRECTORY, { withFileTypes: true });
  const fileNames = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  const toPublicUrl = async (file: HeroFile) => {
    const details = await stat(path.join(HERO_DIRECTORY, file.name));
    const version = `${Math.trunc(details.mtimeMs)}-${details.size}`;
    return `/images/heroes/${file.name}?v=${version}`;
  };
  const collect = (pattern: RegExp) => Promise.all(sortHeroFiles(
    fileNames.flatMap((name) => {
      const file = matchHeroFile(name, pattern);
      return file ? [file] : [];
    }),
  ).map(toPublicUrl));

  const [desktop, mobile] = await Promise.all([
    collect(desktopName),
    collect(mobileName),
  ]);

  return {
    desktop,
    mobile,
  };
}
