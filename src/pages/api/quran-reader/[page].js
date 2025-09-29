import fs from 'fs';
import path from 'path';

// جلب البيانات من الملفات المحلية
async function getLocalSurahData(surahNumber) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'json', 'surah', `surah_${surahNumber}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.warn(`فشل في جلب السورة ${surahNumber}:`, error.message);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { page } = req.query;
  const pageNum = parseInt(page);
  if (!pageNum || pageNum < 1 || pageNum > 604) {
    return res.status(400).json({ message: 'Invalid page number' });
  }

  try {
    const verses = [];
    
    // البحث في جميع السور عن الآيات في هذه الصفحة
    for (let surahNumber = 1; surahNumber <= 114; surahNumber++) {
      const surahData = await getLocalSurahData(surahNumber);
      
      if (surahData && surahData.verses) {
        for (let ayahIndex = 0; ayahIndex < surahData.verses.length; ayahIndex++) {
          const verse = surahData.verses[ayahIndex];
          
          if (verse.page === pageNum) {
            verses.push({
              id: `${surahNumber}:${verse.number}`,
              text: verse.text.ar,
              textEmlaey: verse.text.ar.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, ''),
              ayahNo: verse.number,
              surahNo: surahNumber,
              surahNameAr: surahData.name.ar,
              surahNameEn: surahData.name.en,
              juz: verse.juz,
              page: verse.page,
              sajda: verse.sajda
            });
          }
        }
      }
    }

    // ترتيب الآيات حسب رقم السورة ورقم الآية
    verses.sort((a, b) => {
      if (a.surahNo !== b.surahNo) {
        return a.surahNo - b.surahNo;
      }
      return a.ayahNo - b.ayahNo;
    });

    // تنظيم البيانات في سطور بشكل جميل
    const lines = [];
    let currentLine = { verses: [] };
    let currentLineLength = 0;
    const maxLineLength = 120; // الحد الأقصى لطول السطر بالأحرف
    
    verses.forEach((verse, index) => {
      const verseLength = verse.text.length;
      
      // إذا كان السطر فارغ أو يمكن إضافة الآية دون تجاوز الحد
      if (currentLine.verses.length === 0 || 
          (currentLineLength + verseLength <= maxLineLength && currentLine.verses.length < 6)) {
        
        currentLine.verses.push(verse);
        currentLineLength += verseLength;
      } else {
        // إنشاء سطر جديد
        lines.push(currentLine);
        currentLine = { verses: [verse] };
        currentLineLength = verseLength;
      }
      
      // بداية سورة جديدة = سطر جديد
      if (index < verses.length - 1 && verses[index + 1].surahNo !== verse.surahNo) {
        lines.push(currentLine);
        currentLine = { verses: [] };
        currentLineLength = 0;
      }
    });
    
    // إضافة السطر الأخير
    if (currentLine.verses.length > 0) {
      lines.push(currentLine);
    }

    // إنشاء معلومات الصفحة
    const uniqueSurahs = [...new Set(verses.map(v => v.surahNo))];
    const surahsInfo = uniqueSurahs.map(surahNo => {
      const firstVerse = verses.find(v => v.surahNo === surahNo);
      return {
        nameAr: firstVerse.surahNameAr,
        nameEn: firstVerse.surahNameEn
      };
    });

    const pageData = {
      pageNumber: pageNum,
      lines: lines,
      verses: verses,
      pageInfo: {
        currentPage: pageNum,
        totalPages: 604,
        surahs: surahsInfo
      }
    };

    return res.status(200).json({
      success: true,
      data: pageData
    });

  } catch (error) {
    console.error('خطأ في جلب بيانات الصفحة:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'خطأ في الخادم' 
    });
  }
}
