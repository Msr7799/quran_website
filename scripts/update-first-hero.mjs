import dns from "node:dns";
import { MongoClient } from "mongodb";

const videoUrl = process.argv[2];
const uri = process.env.MONGODB_URI;

if (!videoUrl || !/^https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/.*\.mp4(?:\?.*)?$/i.test(videoUrl)) {
  throw new Error("Pass a valid Cloudinary MP4 URL as the first argument.");
}
if (!uri) throw new Error("MONGODB_URI is not configured.");

const connect = () => new MongoClient(uri, { serverSelectionTimeoutMS: 20_000 }).connect();
let client;

try {
  try {
    client = await connect();
  } catch (error) {
    if (uri.startsWith("mongodb+srv://") && error instanceof Error && error.message.includes("querySrv ECONNREFUSED")) {
      dns.setServers(["1.1.1.1", "8.8.8.8"]);
      client = await connect();
    } else {
      throw error;
    }
  }

  const database = client.db(process.env.MONGODB_DB_NAME ?? "quran_website");
  const collection = database.collection("media_assets");
  const heroPattern = /^images\/heroes\/hero(?:-?(\d+))?\.(?:mp4|png|jpe?g|webp)$/i;
  const heroes = await collection.find(
    { publicPath: { $regex: "^images/heroes/hero" } },
    { projection: { publicPath: 1, secureUrl: 1, resourceType: 1, format: 1 } },
  ).toArray();
  const firstHero = heroes
    .flatMap((item) => {
      const match = item.publicPath?.match(heroPattern);
      return match ? [{ item, order: match[1] === undefined ? -1 : Number(match[1]) }] : [];
    })
    .sort((first, second) => first.order - second.order || first.item.publicPath.localeCompare(second.item.publicPath, "en", { numeric: true }))[0]?.item;

  if (!firstHero) throw new Error("No desktop hero record was found in media_assets.");

  const publicId = new URL(videoUrl).pathname.split("/").at(-1)?.replace(/\.mp4$/i, "") ?? "";
  await collection.updateOne(
    { _id: firstHero._id },
    {
      $set: { secureUrl: videoUrl, publicId, resourceType: "video", format: "mp4", updatedAt: new Date() },
      $unset: { bytes: "", sha256: "", width: "", height: "" },
    },
  );

  const updated = await collection.findOne(
    { _id: firstHero._id },
    { projection: { publicPath: 1, secureUrl: 1, publicId: 1, resourceType: 1, format: 1, updatedAt: 1 } },
  );
  console.log(JSON.stringify({ previous: firstHero, updated }, null, 2));
} finally {
  await client?.close();
}
