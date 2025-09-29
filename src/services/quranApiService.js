import { surahToPageMapping, getSurahPage } from '../utils/surahPageMapping.js';

/**
 * خدمة QuranAPI - للتعامل مع API القرآن الكريم مع البيانات الصحيحة المحلية
 * مصدر البيانات: https://quranapi.pages.dev + البيانات المحلية الجاهزة
 */

class QuranApiService {
  constructor() {
    this.baseUrl = 'https://quranapi.pages.dev/api';
    this.cache = new Map(); // تخزين مؤقت للبيانات
    this.totalSurahs = 114;
    this.totalVerses = 6236;
    this.surahPageMapping = surahToPageMapping; // البيانات الصحيحة الجاهزة
  }

  /**
   * جلب آية محددة مع البيانات الصحيحة من الملفات المحلية
   * @param {number} surahNumber - رقم السورة (1-114)
   * @param {number} ayahNumber - رقم الآية
   * @returns {Promise<Object>} بيانات الآية
   */
  async getVerse(surahNumber, ayahNumber) {
    const cacheKey = `verse-${surahNumber}-${ayahNumber}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // جلب البيانات من الملفات المحلية أولاً
      const localData = await this.getLocalSurahData(surahNumber);
      
      if (localData && localData.verses && localData.verses[ayahNumber - 1]) {
        const verse = localData.verses[ayahNumber - 1];
        
        const formattedData = {
          id: `${surahNumber}:${ayahNumber}`,
          surahNo: surahNumber,
          ayahNo: ayahNumber,
          surahName: localData.name.en,
          surahNameAr: localData.name.ar,
          surahNameTranslation: localData.name.transliteration,
          text: verse.text.ar, // النص العربي مع التشكيل
          textEmlaey: this.removeHarakat(verse.text.ar), // بدون تشكيل
          textEnglish: verse.text.en,
          textBengali: '',
          textUrdu: '',
          revelationPlace: localData.revelation_place,
          totalAyah: localData.verses_count,
          audio: {},
          page: verse.page || getSurahPage(surahNumber), // البيانات الصحيحة
          juz: verse.juz || this.getJuzNumber(surahNumber),
          sajda: verse.sajda || false
        };

        this.cache.set(cacheKey, formattedData);
        return formattedData;
      }
      
      // fallback للـ API إذا فشلت البيانات المحلية
      return await this.getVerseFromAPI(surahNumber, ayahNumber);
      
    } catch (error) {
      console.error(`خطأ في جلب الآية ${surahNumber}:${ayahNumber}:`, error);
      throw new Error(`فشل في جلب الآية: ${error.message}`);
    }
  }

  /**
   * جلب بيانات سورة من الملفات المحلية
   * @param {number} surahNumber - رقم السورة
   * @returns {Promise<Object>} بيانات السورة
   */
  async getLocalSurahData(surahNumber) {
    const cacheKey = `local-surah-${surahNumber}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`/json/surah/surah_${surahNumber}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.cache.set(cacheKey, data);
      return data;
      
    } catch (error) {
      console.warn(`فشل في جلب البيانات المحلية للسورة ${surahNumber}:`, error.message);
      return null;
    }
  }

  /**
   * جلب آية من API كـ fallback
   * @param {number} surahNumber - رقم السورة
   * @param {number} ayahNumber - رقم الآية
   * @returns {Promise<Object>} بيانات الآية من API
   */
  async getVerseFromAPI(surahNumber, ayahNumber) {
    try {
      const response = await fetch(`${this.baseUrl}/${surahNumber}/${ayahNumber}.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        id: `${surahNumber}:${ayahNumber}`,
        surahNo: surahNumber,
        ayahNo: ayahNumber,
        surahName: data.surahName,
        surahNameAr: data.surahNameArabic,
        surahNameTranslation: data.surahNameTranslation,
        text: data.arabic1,
        textEmlaey: data.arabic2,
        textEnglish: data.english,
        textBengali: data.bengali || '',
        textUrdu: data.urdu || '',
        revelationPlace: data.revelationPlace,
        totalAyah: data.totalAyah,
        audio: data.audio || {},
        page: getSurahPage(surahNumber), // استخدام البيانات الصحيحة
        juz: this.getJuzNumber(surahNumber),
        sajda: false
      };
      
    } catch (error) {
      throw new Error(`فشل في جلب الآية من API: ${error.message}`);
    }
  }

  /**
   * جلب صفحة من المصحف مع البيانات الصحيحة
   * @param {number} pageNumber - رقم الصفحة (1-604)
   * @returns {Promise<Object>} بيانات الصفحة
   */
  async getPage(pageNumber) {
    const cacheKey = `page-${pageNumber}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      if (pageNumber < 1 || pageNumber > 604) {
        throw new Error(`رقم صفحة غير صحيح: ${pageNumber}`);
      }

      const verses = [];
      
      // البحث في جميع السور عن الآيات التي تنتمي لهذه الصفحة
      for (let surahNumber = 1; surahNumber <= 114; surahNumber++) {
        try {
          const localData = await this.getLocalSurahData(surahNumber);
          
          if (localData && localData.verses) {
            for (let ayahNumber = 1; ayahNumber <= localData.verses.length; ayahNumber++) {
              const verse = localData.verses[ayahNumber - 1];
              
              if (verse.page === pageNumber) {
                const verseData = await this.getVerse(surahNumber, ayahNumber);
                verses.push(verseData);
              }
            }
          }
        } catch (error) {
          console.warn(`تخطي السورة ${surahNumber} للصفحة ${pageNumber}:`, error.message);
        }
      }
      
      // ترتيب الآيات حسب السورة ثم الآية
      verses.sort((a, b) => {
        if (a.surahNo !== b.surahNo) {
          return a.surahNo - b.surahNo;
        }
        return a.ayahNo - b.ayahNo;
      });
      
      const pageData = {
        pageNumber,
        totalPages: 604,
        verses,
        lines: this.groupVersesIntoLines(verses),
        surahs: this.getSurahsInPage(verses)
      };

      this.cache.set(cacheKey, pageData);
      return pageData;
      
    } catch (error) {
      console.error(`خطأ في جلب الصفحة ${pageNumber}:`, error);
      throw new Error(`فشل في جلب الصفحة: ${error.message}`);
    }
  }

  /**
   * البحث في القرآن باستخدام البيانات المحلية
   * @param {string} query - نص البحث
   * @param {string} language - لغة البحث ('ar', 'en')
   * @returns {Promise<Array>} نتائج البحث
   */
  async searchQuran(query, language = 'ar') {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const results = [];
    const searchQuery = query.trim().toLowerCase();
    
    for (let surahNumber = 1; surahNumber <= 114; surahNumber++) {
      try {
        const localData = await this.getLocalSurahData(surahNumber);
        
        if (localData && localData.verses) {
          for (let ayahNumber = 1; ayahNumber <= localData.verses.length; ayahNumber++) {
            const verse = localData.verses[ayahNumber - 1];
            const textToSearch = language === 'ar' ? 
              this.removeHarakat(verse.text.ar) : 
              verse.text.en;
            
            if (textToSearch && textToSearch.toLowerCase().includes(searchQuery)) {
              const verseData = await this.getVerse(surahNumber, ayahNumber);
              verseData.matchedText = this.highlightMatch(textToSearch, searchQuery);
              results.push(verseData);
            }
          }
        }
      } catch (error) {
        console.warn(`تخطي السورة ${surahNumber} في البحث:`, error.message);
      }
    }
    
    return results;
  }

  /**
   * جلب قائمة السور
   * @returns {Promise<Array>} قائمة السور
   */
  async getSurahsList() {
    const cacheKey = 'surahs-list';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const surahs = [];
      
      for (let surahNumber = 1; surahNumber <= 114; surahNumber++) {
        try {
          const localData = await this.getLocalSurahData(surahNumber);
          
          if (localData) {
            surahs.push({
              number: surahNumber,
              name: localData.name.en,
              nameArabic: localData.name.ar,
              nameTranslation: localData.name.transliteration,
              revelationPlace: localData.revelation_place,
              totalAyah: localData.verses_count,
              startPage: getSurahPage(surahNumber)
            });
          }
        } catch (error) {
          console.warn(`تخطي السورة ${surahNumber} في القائمة:`, error.message);
        }
      }

      this.cache.set(cacheKey, surahs);
      return surahs;
      
    } catch (error) {
      console.error('خطأ في جلب قائمة السور:', error);
      throw new Error(`فشل في جلب قائمة السور: ${error.message}`);
    }
  }

  /**
   * دوال مساعدة
   */

  // حساب رقم الجزء التقريبي
  getJuzNumber(surahNo) {
    // خوارزمية تقريبية بناءً على السورة والآية
    const surahJuzMapping = {
      1: 1, 2: 1, 3: 3, 4: 4, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11,
      11: 12, 12: 12, 13: 13, 14: 13, 15: 14, 16: 14, 17: 15, 18: 15, 19: 16, 20: 16,
      21: 17, 22: 17, 23: 18, 24: 18, 25: 19, 26: 19, 27: 20, 28: 20, 29: 21, 30: 21,
      31: 21, 32: 21, 33: 22, 34: 22, 35: 22, 36: 23, 37: 23, 38: 23, 39: 24, 40: 24,
      41: 25, 42: 25, 43: 25, 44: 25, 45: 25, 46: 26, 47: 26, 48: 26, 49: 26, 50: 26,
      51: 27, 52: 27, 53: 27, 54: 27, 55: 27, 56: 27, 57: 27, 58: 28, 59: 28, 60: 28,
      61: 28, 62: 28, 63: 28, 64: 28, 65: 28, 66: 28, 67: 29, 68: 29, 69: 29, 70: 29,
      71: 29, 72: 29, 73: 29, 74: 29, 75: 29, 76: 29, 77: 29, 78: 30, 79: 30, 80: 30,
      81: 30, 82: 30, 83: 30, 84: 30, 85: 30, 86: 30, 87: 30, 88: 30, 89: 30, 90: 30,
      91: 30, 92: 30, 93: 30, 94: 30, 95: 30, 96: 30, 97: 30, 98: 30, 99: 30, 100: 30,
      101: 30, 102: 30, 103: 30, 104: 30, 105: 30, 106: 30, 107: 30, 108: 30, 109: 30, 
      110: 30, 111: 30, 112: 30, 113: 30, 114: 30
    };
    
    return surahJuzMapping[surahNo] || 1;
  }

  // إزالة الحركات من النص العربي
  removeHarakat(text) {
    if (!text) return '';
    return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  }

  // تجميع الآيات في أسطر
  groupVersesIntoLines(verses) {
    const lines = [];
    let currentLine = { lineNumber: 1, verses: [] };
    let versesInLine = 0;
    const maxVersesPerLine = 3;

    verses.forEach((verse, index) => {
      currentLine.verses.push(verse);
      versesInLine++;

      if (versesInLine >= maxVersesPerLine || index === verses.length - 1) {
        lines.push(currentLine);
        currentLine = { lineNumber: lines.length + 1, verses: [] };
        versesInLine = 0;
      }
    });

    return lines;
  }

  // الحصول على السور في صفحة
  getSurahsInPage(verses) {
    const surahs = new Set();
    verses.forEach(verse => {
      surahs.add({
        number: verse.surahNo,
        nameAr: verse.surahNameAr,
        nameEn: verse.surahName
      });
    });
    return Array.from(surahs);
  }

  // تمييز نتائج البحث
  highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * مسح التخزين المؤقت
   */
  clearCache() {
    this.cache.clear();
    console.log('تم مسح التخزين المؤقت');
  }

  /**
   * معلومات التخزين المؤقت
   */
  getCacheInfo() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// إنشاء instance واحد للخدمة
const quranApiService = new QuranApiService();

export default quranApiService;
