import { createHash } from "node:crypto";
import dns from "node:dns";
import { readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import { v2 as cloudinary } from "cloudinary";
import { MongoClient } from "mongodb";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(projectRoot, "public");
const deleteLocal = process.argv.includes("--delete-local");
const cloudinaryFolder = "quran-website";
const mediaExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".mp4"]);

nextEnv.loadEnvConfig(projectRoot);

for (const key of ["MONGODB_URI", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]) {
  if (!process.env[key]) throw new Error(`${key} is not configured`);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function normalizeSearch(value) {
  return value.normalize("NFKD")
    .replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g, "")
    .replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي")
    .toLocaleLowerCase("ar").replace(/\s+/g, " ").trim();
}

function json(relativePath) {
  return readFile(path.join(publicRoot, relativePath), "utf8").then(JSON.parse);
}

async function connectMongo() {
  const connect = () => new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 20_000 }).connect();
  try {
    return await connect();
  } catch (error) {
    if (process.env.MONGODB_URI.startsWith("mongodb+srv://") && error instanceof Error && error.message.includes("querySrv ECONNREFUSED")) {
      dns.setServers(["1.1.1.1", "8.8.8.8"]);
      return connect();
    }
    throw error;
  }
}

async function upsertMany(collection, documents, chunkSize = 500) {
  for (let index = 0; index < documents.length; index += chunkSize) {
    const chunk = documents.slice(index, index + chunkSize);
    await collection.bulkWrite(chunk.map((document) => ({
      replaceOne: { filter: { _id: document._id }, replacement: document, upsert: true },
    })), { ordered: false });
  }
}

async function migrateMongo(database) {
  const datasets = [
    ["metadata", "data/metadata.json"],
    ["reciters", "data/quranMp3.json"],
    ["radios", "data/radios.json"],
    ["azkar", "data/azkar.json"],
    ["collections", "data/collections.json"],
    ["religious-events", "data/religious_event.json"],
    ["library-books", "images/library/books_url.json"],
    ["legacy-web-manifest", "images/manifest.json"],
    ["seo-keywords", "images/seo-keywords.json"],
  ];
  await upsertMany(database.collection("content_datasets"), await Promise.all(datasets.map(async ([_id, file]) => ({
    _id, data: await json(file), sourcePath: file, migratedAt: new Date(),
  }))));
  await upsertMany(database.collection("archive_files"), await Promise.all([
    ["hafs-smart-csv", "hafs_smart.csv"],
    ["seo-keywords-csv", "images/seo-keywords.csv"],
  ].map(async ([_id, file]) => ({ _id, content: await readFile(path.join(publicRoot, file), "utf8"), sourcePath: file, migratedAt: new Date() }))));

  const surahDocuments = [];
  const verseDocuments = [];
  const audioDocuments = [];
  for (let surah = 1; surah <= 114; surah += 1) {
    const padded = String(surah).padStart(3, "0");
    const data = await json(`data/surah/surah_${surah}.json`);
    surahDocuments.push({ _id: surah, ...data });
    for (const verse of data.verses) {
      verseDocuments.push({ _id: `${padded}:${String(verse.number).padStart(3, "0")}`, surahNumber: surah, ...verse });
    }
    audioDocuments.push({ _id: surah, items: await json(`data/audio/audio_surah_${surah}.json`) });
  }
  await upsertMany(database.collection("quran_surahs"), surahDocuments);
  await upsertMany(database.collection("quran_verses"), verseDocuments);
  await upsertMany(database.collection("audio_sources"), audioDocuments);

  const searchAyahs = (await json("hafs_smart.json")).map((ayah) => ({
    _id: ayah.id,
    ...ayah,
    normalizedText: normalizeSearch(ayah.aya_text_emlaey),
  }));
  await upsertMany(database.collection("quran_search"), searchAyahs);

  const surahReciters = [
    ["abdul-rahman-al-sudais", "surah-recitation-abdul-rahman-al-sudais"],
    ["abdullah-awad-al-juhani", "surah-recitation-abdullah-awad-al-juhani"],
    ["bandar-baleela", "surah-recitation-bandar-baleela"],
    ["maher-al-muaiqly", "surah-recitation-maher-al-muaiqly"],
    ["mishari-al-afasy", "surah-recitation-mishari-al-afasy"],
    ["yasser-al-dosari", "surah-recitation-yasser-al-dosari"],
    ["abdullah-ali-jabir", "surah-recitation-abdullah-ali-jabir"],
  ];
  const recitationDocuments = await Promise.all(surahReciters.map(async ([_id, folder]) => ({
    _id, source: "surah-json", audioData: await json(`${folder}/surah.json`), segmentMap: await json(`${folder}/segments.json`),
  })));
  recitationDocuments.push(
    { _id: "muhammad-siddiq-al-minshawi", source: "ayah-json", audioData: await json("ayah-recitation-muhammad-siddiq-al-minshawi-murattal-hafs-959.json/ayah-recitation-muhammad-siddiq-al-minshawi-murattal-hafs-959.json") },
    { _id: "saud-al-shuraim", source: "ayah-json", audioData: await json("ayah-recitation-saud-al-shuraim-murattal-hafs-960.json/ayah-recitation-saud-al-shuraim-murattal-hafs-960.json") },
  );

  const { DatabaseSync } = await import("node:sqlite");
  const sqlitePath = path.join(publicRoot, "surah-recitation-ali-abdur-rahman-al-huthaify.db", "surah-recitation-ali-abdur-rahman-al-huthaify.db");
  const sqlite = new DatabaseSync(sqlitePath, { readOnly: true });
  try {
    const audioRows = sqlite.prepare("SELECT surah_number, audio_url, duration FROM surah_list").all();
    const segmentRows = sqlite.prepare("SELECT surah_number, ayah_number, duration_sec, timestamp_from, timestamp_to, segments FROM segments").all();
    recitationDocuments.push({
      _id: "ali-abdur-rahman-al-huthaify",
      source: "sqlite",
      audioData: Object.fromEntries(audioRows.map((row) => [String(row.surah_number), { audio_url: row.audio_url, duration: row.duration }])),
      segmentMap: Object.fromEntries(segmentRows.map((row) => [`${row.surah_number}:${row.ayah_number}`, {
        duration_sec: row.duration_sec, timestamp_from: row.timestamp_from, timestamp_to: row.timestamp_to,
        segments: row.segments ? JSON.parse(row.segments) : [],
      }])),
    });
  } finally {
    sqlite.close();
  }
  await upsertMany(database.collection("recitation_sources"), recitationDocuments);

  await Promise.all([
    database.collection("quran_verses").createIndex({ page: 1, surahNumber: 1, number: 1 }),
    database.collection("quran_search").createIndex({ sura_no: 1, aya_no: 1 }, { unique: true }),
    database.collection("media_assets").createIndex({ publicPath: 1 }, { unique: true }),
  ]);

  return {
    datasets: datasets.length,
    surahs: surahDocuments.length,
    verses: verseDocuments.length,
    audioSources: audioDocuments.length,
    searchAyahs: searchAyahs.length,
    reciters: recitationDocuments.length,
  };
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

async function migrateMedia(database) {
  const files = (await walk(publicRoot)).filter((file) => mediaExtensions.has(path.extname(file).toLowerCase()));
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: 4 }, async () => {
    while (cursor < files.length) {
      const index = cursor++;
      const file = files[index];
      const publicPath = path.relative(publicRoot, file).replaceAll("\\", "/");
      const extension = path.extname(publicPath).toLowerCase();
      const publicId = `${cloudinaryFolder}/${publicPath.slice(0, -extension.length)}`;
      const details = await stat(file);
      const digest = createHash("sha256").update(await readFile(file)).digest("hex");
      if (extension !== ".mp4" && details.size > 10 * 1024 * 1024) {
        console.warn(`Cloudinary skipped (plan limit): ${publicPath}`);
        continue;
      }
      const existing = await database.collection("media_assets").findOne({ _id: publicPath, sha256: digest });
      if (existing) {
        results.push(existing);
        console.log(`Cloudinary reused ${results.length}/${files.length}: ${publicPath}`);
        continue;
      }
      const uploaded = await cloudinary.uploader.upload(file, {
        public_id: publicId,
        resource_type: extension === ".mp4" ? "video" : "image",
        overwrite: true,
        invalidate: true,
      });
      const document = {
        _id: publicPath,
        publicPath,
        publicId,
        resourceType: uploaded.resource_type,
        format: uploaded.format,
        bytes: details.size,
        sha256: digest,
        secureUrl: uploaded.secure_url,
        width: uploaded.width,
        height: uploaded.height,
        migratedAt: new Date(),
      };
      await database.collection("media_assets").replaceOne({ _id: publicPath }, document, { upsert: true });
      results.push(document);
      console.log(`Cloudinary ${results.length}/${files.length}: ${publicPath}`);
    }
  });
  await Promise.all(workers);
  return results;
}

function localDataPaths() {
  return [
    "data",
    "hafs_smart.json",
    "ayah-recitation-muhammad-siddiq-al-minshawi-murattal-hafs-959.json",
    "ayah-recitation-saud-al-shuraim-murattal-hafs-960.json",
    "surah-recitation-abdul-rahman-al-sudais",
    "surah-recitation-abdullah-awad-al-juhani",
    "surah-recitation-bandar-baleela",
    "surah-recitation-maher-al-muaiqly",
    "surah-recitation-mishari-al-afasy",
    "surah-recitation-yasser-al-dosari",
    "surah-recitation-abdullah-ali-jabir",
    "surah-recitation-ali-abdur-rahman-al-huthaify.db",
    "images/library/books_url.json",
    "images/manifest.json",
    "images/seo-keywords.json",
    "images/seo-keywords.csv",
    "hafs_smart.csv",
  ];
}

const client = await connectMongo();
try {
  const database = client.db(process.env.MONGODB_DB_NAME ?? "quran_website");
  const mongoCounts = await migrateMongo(database);
  console.log("MongoDB migration complete", mongoCounts);
  const media = await migrateMedia(database);
  console.log(`Cloudinary migration complete: ${media.length} assets`);

  const checks = {
    surahs: await database.collection("quran_surahs").countDocuments(),
    verses: await database.collection("quran_verses").countDocuments(),
    searchAyahs: await database.collection("quran_search").countDocuments(),
    media: await database.collection("media_assets").countDocuments(),
  };
  if (checks.surahs !== 114 || checks.verses !== 6236 || checks.searchAyahs !== 6236 || checks.media < media.length) {
    throw new Error(`Migration verification failed: ${JSON.stringify(checks)}`);
  }
  console.log("Verification complete", checks);

  if (deleteLocal) {
    for (const document of media) await rm(path.join(publicRoot, document.publicPath), { force: true });
    for (const relativePath of localDataPaths()) await rm(path.join(publicRoot, relativePath), { recursive: true, force: true });
    console.log(`Deleted ${media.length} migrated media files and migrated local data paths.`);
  }
} finally {
  await client.close();
}
