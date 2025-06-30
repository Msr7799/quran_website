/*
Project: Reciters Image Fetcher
Description: Node.js script to fetch images for Quran reciters via Google CSE JSON API,
store images locally under /public/reciters_images/, and generate JSON mapping.
Includes Jest test for fetchImage function and a git commit message for Copilot.
*/

import fs from 'fs-extra';
import fetch from 'node-fetch';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
dotenv.config();

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'reciters_images');
const MAPPING_FILE = path.join(process.cwd(), 'public', 'reciters-images.json');
const BING_API_KEY = process.env.BING_API_KEY;

async function fetchImage(name) {
  // Bing Image Search API
  const endpoint = 'https://api.bing.microsoft.com/v7.0/images/search';
  const params = new URLSearchParams({
    q: `${name} الشيخ`,
    count: '1',
    safeSearch: 'Strict',
    imageType: 'Photo',
  });
  const res = await fetch(`${endpoint}?${params}`, {
    headers: {
      'Ocp-Apim-Subscription-Key': BING_API_KEY,
    },
  });
  if (!res.ok) {
    console.error(`Bing API error for ${name}:`, res.status, await res.text());
    return null;
  }
  const json = await res.json();
  const url = json.value?.[0]?.contentUrl;
  return url || null;
}

async function downloadImage(url, filename) {
  const res = await fetch(url);
  const buffer = await res.buffer();
  await fs.outputFile(path.join(OUTPUT_DIR, filename), buffer);
}

export async function main() {
  console.log('Script started');
  await fs.emptyDir(OUTPUT_DIR);
  console.log('⏳ جاري جلب قائمة القراء من API... (قد يستغرق حتى 30 ثانية بسبب استضافة Render المجانية)');
  let res;
  try {
    res = await fetch('https://quran-api-qklj.onrender.com/api/reciters', { timeout: 3000 });
  } catch (err) {
    console.error('❌ فشل الاتصال بـ API. تأكد أن الرابط يعمل أو أعد المحاولة لاحقاً.');
    process.exit(1);
  }
  const apiJson = await res.json();
  if (!apiJson.success || !Array.isArray(apiJson.data)) {
    console.error('❌ صيغة البيانات من API غير متوقعة.');
    process.exit(1);
  }
  const reciters = apiJson.data;
  const map = {};
  let successCount = 0;

  for (const reciter of reciters) {
    const name = reciter.reciter_name_ar || reciter.reciter_name_en;
    const url = await fetchImage(name);
    console.log(`${name} -> ${url}`);
    if (url) {
      const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const ext = path.extname(url).split('?')[0] || '.jpg';
      const filename = `${safeName}${ext}`;
      await downloadImage(url, filename);
      map[name] = `/reciters_images/${filename}`;
      successCount++;
    } else {
      map[name] = null;
    }
    await new Promise(r => setTimeout(r, 150)); // rate limit
  }

  await fs.writeJson(MAPPING_FILE, map, { spaces: 2 });
  console.log('✅ Images and mapping JSON saved.');
  console.log(`📸 تم استخراج ${successCount} صورة من أصل ${reciters.length}`);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
