import { createHash } from "node:crypto";
import dns from "node:dns";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import { v2 as cloudinary } from "cloudinary";
import { MongoClient } from "mongodb";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(projectRoot, "public", "Quran_Tafseel-Mawdo_text.pdf");
const partSize = 9_000_000;
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

function uploadPart(index, start, end) {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream({
      resource_type: "raw",
      public_id: `quran-website/documents/Quran_Tafseel-Mawdo_text/part-${String(index + 1).padStart(3, "0")}.txt`,
      overwrite: true,
      invalidate: true,
    }, (error, result) => {
      if (error) reject(error);
      else if (result) resolve(result);
      else reject(new Error(`Cloudinary returned no result for part ${index + 1}`));
    });
    createReadStream(filePath, { start, end }).on("error", reject).pipe(upload);
  });
}

const details = await stat(filePath);
const hash = createHash("sha256");
for await (const chunk of createReadStream(filePath)) hash.update(chunk);

const parts = [];
for (let start = 0, index = 0; start < details.size; start += partSize, index += 1) {
  const end = Math.min(details.size - 1, start + partSize - 1);
  const uploaded = await uploadPart(index, start, end);
  parts.push({ index, start, end, bytes: end - start + 1, secureUrl: uploaded.secure_url, publicId: uploaded.public_id });
  console.log(`Uploaded PDF part ${index + 1}/${Math.ceil(details.size / partSize)}`);
}

if (parts.reduce((total, part) => total + part.bytes, 0) !== details.size) throw new Error("PDF part verification failed");

const client = await connectMongo();
try {
  await client.db(process.env.MONGODB_DB_NAME ?? "quran_website").collection("document_assets").replaceOne(
    { _id: "quran-tafseel" },
    { _id: "quran-tafseel", filename: "Quran_Tafseel-Mawdo_text.pdf", contentType: "application/pdf", totalBytes: details.size, sha256: hash.digest("hex"), parts, migratedAt: new Date() },
    { upsert: true },
  );
} finally {
  await client.close();
}

console.log(JSON.stringify({ bytes: details.size, parts: parts.length, verified: true }));
