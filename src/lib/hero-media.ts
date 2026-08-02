import "server-only";
import { cloudinaryAsset } from "./cloudinary-assets";
import { getDatabase } from "./mongodb";

const desktopName = /^images\/heroes\/hero(?:-?(\d+))?\.(?:mp4|png|jpe?g|webp)$/i;
const mobileName = /^images\/heroes\/mobile-hero(?:-?(\d+))?\.(?:mp4|png|jpe?g|webp)$/i;

type MediaAsset = { _id: string; publicPath: string };

function collect(paths: string[], pattern: RegExp) {
  return paths.flatMap((publicPath) => {
    const match = publicPath.match(pattern);
    return match ? [{ publicPath, order: match[1] === undefined ? -1 : Number(match[1]) }] : [];
  }).sort((first, second) => first.order - second.order || first.publicPath.localeCompare(second.publicPath, "en", { numeric: true }))
    .map((item) => cloudinaryAsset(item.publicPath));
}

export async function getHeroMedia() {
  const database = await getDatabase();
  const assets = await database.collection<MediaAsset>("media_assets")
    .find({ publicPath: { $regex: "^images/heroes/" } }, { projection: { publicPath: 1 } })
    .toArray();
  const paths = assets.map((asset) => asset.publicPath);
  return { desktop: collect(paths, desktopName), mobile: collect(paths, mobileName) };
}
