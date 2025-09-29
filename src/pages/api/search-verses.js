import fs from 'fs';
import path from 'path';

// تحميل بيانات السور من ملف metadata.json
let surahsMetadata = [];

try {
  const metadataPath = path.join(process.cwd(), 'public', 'json', 'metadata.json');
  const metadataFile = fs.readFileSync(metadataPath, 'utf8');
  surahsMetadata = JSON.parse(metadataFile);
} catch (error) {
  console.error('Error loading surah metadata:', error);
  surahsMetadata = [];
}

// استخراج أسماء السور العربية من البيانات الحقيقية
const surahNames = surahsMetadata.map(surah => surah.name.ar);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { q: query, limit = 50 } = req.query;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({ 
      message: 'Query too short. Please provide at least 2 characters.' 
    });
  }

  try {
    const versesDir = path.join(process.cwd(), 'public', 'json', 'verses');
    const results = [];
    const searchTerm = query.trim();

    // قراءة جميع ملفات الآيات
    const files = fs.readdirSync(versesDir).filter(file => file.endsWith('.json'));
    
    for (const file of files) {
      try {
        const filePath = path.join(versesDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const verse = JSON.parse(fileContent);

        // البحث في النص العربي
        if (verse.text && verse.text.ar && verse.text.ar.includes(searchTerm)) {
          // استخراج رقم السورة ورقم الآية من اسم الملف
          const [surahNum, verseNum] = file.replace('.json', '').split('_').map(Number);
          
          results.push({
            surahNumber: surahNum,
            surahName: surahNames[surahNum - 1] || `السورة ${surahNum}`,
            verseNumber: verseNum,
            arabicText: verse.text.ar,
            englishText: verse.text.en,
            juz: verse.juz,
            page: verse.page,
            sajda: verse.sajda || false,
            // إضافة highlight للنص المطابق
            highlightedText: verse.text.ar.replace(
              new RegExp(searchTerm, 'g'), 
              `<mark class="bg-yellow-300 dark:bg-yellow-600">${searchTerm}</mark>`
            )
          });

          // توقف عند الوصول للحد المطلوب
          if (results.length >= parseInt(limit)) {
            break;
          }
        }
      } catch (fileError) {
        console.warn(`Error reading file ${file}:`, fileError.message);
        continue;
      }
    }

    // ترتيب النتائج حسب السورة والآية
    results.sort((a, b) => {
      if (a.surahNumber !== b.surahNumber) {
        return a.surahNumber - b.surahNumber;
      }
      return a.verseNumber - b.verseNumber;
    });

    res.status(200).json({
      success: true,
      query: searchTerm,
      total: results.length,
      results
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error while searching verses',
      error: error.message 
    });
  }
}
