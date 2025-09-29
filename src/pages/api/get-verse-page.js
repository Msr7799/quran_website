// src/pages/api/get-verse-page.js - الحصول على رقم الصفحة التي تحتوي على آية محددة
import { surahToPageMapping } from '../../utils/surahPageMapping.js';

// الحصول على رقم الصفحة من رقم السورة والآية باستخدام البيانات الحقيقية
const getPageFromSurahAyah = (surahNumber, ayahNumber) => {
  // استخدام البيانات الحقيقية من surahPageMapping
  const surahStartPage = surahToPageMapping[surahNumber];
  
  if (!surahStartPage) {
    return null;
  }

  // للآية الأولى، إرجاع بداية السورة
  if (ayahNumber <= 1) {
    return surahStartPage;
  }

  // العثور على الصفحة التقريبية بناءً على رقم الآية
  // هذا تقدير بسيط - يمكن تحسينه بناءً على بيانات أكثر دقة
  let estimatedPage = surahStartPage;
  
  // تقدير عدد الآيات في الصفحة (متوسط 15-20 آية)
  const estimatedVersesPerPage = 15;
  const additionalPages = Math.floor((ayahNumber - 1) / estimatedVersesPerPage);
  estimatedPage += additionalPages;

  // التأكد من عدم تجاوز الصفحة التالية للسورة
  const nextSurahNumber = surahNumber + 1;
  const nextSurahPage = surahToPageMapping[nextSurahNumber];
  
  if (nextSurahPage && estimatedPage >= nextSurahPage) {
    estimatedPage = nextSurahPage - 1;
  }

  // التأكد من عدم تجاوز الحد الأقصى للصفحات (604)
  return Math.min(estimatedPage, 604);
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { surah, ayah } = req.query;
    
    if (!surah) {
      return res.status(400).json({ 
        success: false, 
        message: 'Surah number is required' 
      });
    }

    const surahNumber = parseInt(surah);
    const ayahNumber = ayah ? parseInt(ayah) : 1;

    if (surahNumber < 1 || surahNumber > 114) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid surah number. Must be between 1 and 114' 
      });
    }

    if (ayahNumber < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ayah number. Must be greater than 0' 
      });
    }

    const page = getPageFromSurahAyah(surahNumber, ayahNumber);

    if (!page) {
      return res.status(404).json({ 
        success: false, 
        message: 'Page not found for the specified surah and ayah' 
      });
    }

    return res.status(200).json({
      success: true,
      page: page,
      surah: surahNumber,
      ayah: ayahNumber,
      message: `الصفحة ${page} تحتوي على الآية ${ayahNumber} من سورة ${surahNumber}`
    });

  } catch (error) {
    console.error('Get verse page error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
