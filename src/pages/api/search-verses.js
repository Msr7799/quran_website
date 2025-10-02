import fs from 'fs';
import path from 'path';

// تحميل وتحليل ملف CSV مع معالجة متقدمة للفواصل
let quranData = [];

const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

try {
  const csvPath = path.join(process.cwd(), 'public', 'hafs_smart.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n').slice(1); // تجاهل العنوان الأول
  
  quranData = lines
    .filter(line => line.trim()) // إزالة الأسطر الفارغة
    .map(line => {
      const columns = parseCSVLine(line);
      return {
        id: parseInt(columns[0]) || 0,
        juz: parseInt(columns[1]) || 0,
        surahNumber: parseInt(columns[2]) || 0,
        surahNameEn: columns[3] ? columns[3].replace(/"/g, '') : '',
        surahNameAr: columns[4] ? columns[4].replace(/"/g, '') : '',
        page: parseInt(columns[5]) || 0,
        lineStart: parseInt(columns[6]) || 0,
        lineEnd: parseInt(columns[7]) || 0,
        ayahNumber: parseInt(columns[8]) || 0,
        ayahText: columns[9] ? columns[9].replace(/"/g, '') : '',
        ayahTextEmlaey: columns[10] ? columns[10].replace(/"/g, '') : ''
      };
    })
    .filter(verse => verse.surahNumber > 0 && verse.ayahNumber > 0); // فلترة البيانات الصحيحة فقط
    
  console.log(`Loaded ${quranData.length} verses from CSV`);
} catch (error) {
  console.error('Error loading CSV file:', error);
  quranData = [];
}

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
    const results = [];
    const searchTerm = query.trim();

    // البحث في بيانات القرآن من ملف CSV
    for (const verse of quranData) {
      // البحث في النص العربي العادي والإملائي
      if ((verse.ayahText && verse.ayahText.includes(searchTerm)) || 
          (verse.ayahTextEmlaey && verse.ayahTextEmlaey.includes(searchTerm))) {
        
        results.push({
          surahNumber: verse.surahNumber,
          surahName: verse.surahNameAr,
          verseNumber: verse.ayahNumber,
          arabicText: verse.ayahTextEmlaey || verse.ayahText,
          juz: verse.juz,
          page: verse.page,
          // إضافة highlight للنص المطابق
          highlightedText: (verse.ayahTextEmlaey || verse.ayahText).replace(
            new RegExp(searchTerm, 'gi'), 
            `<span class="bg-yellow-400/80 text-black px-1 rounded">${searchTerm}</span>`
          )
        });

        // توقف عند الوصول للحد المطلوب
        if (results.length >= parseInt(limit)) {
          break;
        }
      }
    }

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
