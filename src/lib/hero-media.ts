import "server-only";
import { cloudinaryAsset } from "./cloudinary-assets";
import { getDatabase } from "./mongodb";

const desktopName = /^images\/heroes\/hero(?:-?(\d+))?\.(?:mp4|png|jpe?g|webp)$/i;
const mobileName = /^images\/heroes\/mobile-hero(?:-?(\d+))?\.(?:mp4|png|jpe?g|webp)$/i;

type MediaAsset = { _id: string; publicPath: string; secureUrl?: string };

function collect(assets: MediaAsset[], pattern: RegExp) {
  return assets.flatMap((asset) => {
    const match = asset.publicPath.match(pattern);
    return match ? [{ ...asset, order: match[1] === undefined ? -1 : Number(match[1]) }] : [];
  }).sort((first, second) => first.order - second.order || first.publicPath.localeCompare(second.publicPath, "en", { numeric: true }))
    .map((item) => item.secureUrl || cloudinaryAsset(item.publicPath));
}

export async function getHeroMedia() {
  const database = await getDatabase();
  const assets = await database.collection<MediaAsset>("media_assets")
    .find({ publicPath: { $regex: "^images/heroes/" } }, { projection: { publicPath: 1, secureUrl: 1 } })
    .toArray();
  return { desktop: collect(assets, desktopName), mobile: collect(assets, mobileName) };
}
