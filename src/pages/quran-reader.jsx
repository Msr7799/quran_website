import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { LoaderOne } from '@/components/ui/loader';
import { 

  Menu, 
  X, 
  Copy,
  Share2, 
  Search,
  Settings,
  Plus,
  Minus,
  Play,
  Pause,
  Languages,
  Eye,
  EyeOff,
  Palette,
  Keyboard,
  Navigation,
  Book
} from 'lucide-react';

// Import TafseerPopup component
import TafseerPopup from '../components/AudioPlayer/tafseer_popup.js';
import DropDownButton from '../components/ui/animate-ui/primitives/buttons/dropdown-button.tsx';
import { CopyButton } from '../components/ui/animate-ui/primitives/buttons/copy.tsx';
export default function QuranReader() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVerses, setSelectedVerses] = useState(new Set());
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPageSelector, setShowPageSelector] = useState(false);
  
  // ✨ ميزات جديدة تفاعلية
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentReciter, setCurrentReciter] = useState('1'); // Mishary Rashid Al Afasy
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState('english');
  const [verseTranslations, setVerseTranslations] = useState({});

  // خيارات اللغات للدروب داون
  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'urdu', label: 'اردو' },
    { value: 'bengali', label: 'বাংলা' }
  ];

  // خيارات القراء للدروب داون
  const reciterOptions = [
    { value: '1', label: 'مشاري العفاسي' },
    { value: '2', label: 'أبو بكر الشاطري' },
    { value: '3', label: 'ناصر القطامي' },
    { value: '4', label: 'ياسر الدوسري' },
    { value: '5', label: 'هاني الرفاعي' }
  ];

  // تحديد الخط المناسب حسب اللغة
  const getFontForLanguage = (language) => {
    switch (language) {
      case 'urdu':
        return 'font-["Noto_Sans_Urdu",_serif]';
      case 'bengali':
        return 'font-["Noto_Sans_Bengali",_serif]';
      case 'english':
      default:
        return 'font-["Inter",_sans-serif]';
    }
  };
  const audioRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [fontSize, setFontSize] = useState(26);
  const [lineSpacing, setLineSpacing] = useState(1.8);
  const [showVerseNumbers, setShowVerseNumbers] = useState(true);
  const [highlightOnHover, setHighlightOnHover] = useState(true);

  // 🔍 ميزات التنقل والتفسير الجديدة
  const [showNavigation, setShowNavigation] = useState(false);
  const [navigationQuery, setNavigationQuery] = useState('');
  const [navigationResults, setNavigationResults] = useState([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [allSurahs, setAllSurahs] = useState([]);
  
  // 📚 ميزات التفسير
  const [tafseerOpen, setTafseerOpen] = useState(false);


  // ✨ البحث في الصفحة الحالية (في النص الإملائي)
  const searchInCurrentPage = (query) => {
    if (!query || !pageData?.lines) {
      setSearchResults([]);
      return;
    }
    
    const results = [];
    pageData.lines.forEach(line => {
      line.verses.forEach(verse => {
        // البحث في النص الإملائي لأنه أسهل للقراءة
        if (verse.textEmlaey && verse.textEmlaey.includes(query.trim())) {
          results.push(verse);
        }
      });
    });
    
    setSearchResults(results);
  };

  // ✨ تغيير حجم الخط
  const adjustFontSize = (change) => {
    const newSize = Math.max(16, Math.min(32, fontSize + change));
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize.toString());
  };

  // ✨ تغيير التباعد
  const adjustLineSpacing = (change) => {
    const newSpacing = Math.max(1.2, Math.min(2.5, lineSpacing + change));
    setLineSpacing(newSpacing);
    localStorage.setItem('lineSpacing', newSpacing.toString());
  };

  // جلب بيانات الصفحة
  const fetchPageData = async (pageNum) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/quran-reader/${pageNum}`);
      const data = await response.json();
      
      if (data.success) {
        setPageData(data.data);
      } else {
        console.error('Failed to fetch page data');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // تحديث الصفحة الحالية عند تغيير URL
  useEffect(() => {
    const pageFromQuery = parseInt(router.query.page) || 1;
    setCurrentPage(pageFromQuery);
  }, [router.query.page]);

  // تحميل بيانات السور عند بداية التطبيق
  useEffect(() => {
    const loadSurahsData = async () => {
      try {
        const response = await fetch('/json/metadata.json');
        const data = await response.json();
        setAllSurahs(data);
      } catch (error) {
        console.error('Error loading surahs data:', error);
      }
    };
    
    loadSurahsData();
  }, []);

  // دالة لمعالجة البيانات وإضافة عناوين السور
  const processPageDataWithSurahHeaders = (pageData) => {
    if (!pageData?.lines) return [];
    
    // إذا لم يتم تحميل أسماء السور بعد، اعرض الآيات بدون عناوين
    if (!allSurahs.length) {
      return pageData.lines.map((line, lineIndex) => ({
        type: 'verse-line',
        ...line,
        lineIndex
      }));
    }
    
    const processedLines = [];
    let currentSurah = null;
    
    pageData.lines.forEach((line, lineIndex) => {
      // التحقق من وجود سورة جديدة في هذا السطر
      const firstVerse = line.verses[0];
      if (firstVerse && firstVerse.surahNo !== currentSurah) {
        currentSurah = firstVerse.surahNo;
        
        // إضافة عنوان السورة
        const surahInfo = allSurahs.find(s => s.number === currentSurah);
        if (surahInfo) {
          processedLines.push({
            type: 'surah-header',
            surahInfo,
            id: `surah-header-${currentSurah}`
          });
        }
      }
      
      // إضافة السطر العادي
      processedLines.push({
        type: 'verse-line',
        ...line,
        lineIndex
      });
    });
    
    return processedLines;
  };

  // جلب الصفحة عند تغيير رقم الصفحة
  useEffect(() => {
    if (currentPage) {
      fetchPageData(currentPage);
    }
  }, [currentPage]);

  // إعادة معالجة البيانات عند تحميل بيانات السور
  useEffect(() => {
    // لا نحتاج لفعل شيء هنا - البيانات ستعاد معالجتها تلقائياً
  }, [allSurahs]);

  // ✨ جلب الترجمة والصوت من QuranAPI
  const fetchVerseData = async (surahNo, ayahNo) => {
    try {
      console.log(`جاري جلب البيانات: السورة ${surahNo} الآية ${ayahNo}`);
      const response = await fetch(`https://quranapi.pages.dev/api/${surahNo}/${ayahNo}.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('البيانات المُستلمة:', data);
      
      // حفظ البيانات في state
      const verseKey = `${surahNo}:${ayahNo}`;
      setVerseTranslations(prev => ({
        ...prev,
        [verseKey]: {
          english: data.english || 'ترجمة غير متوفرة',
          bengali: data.bengali || 'অনুবাদ উপলব্ধ নেই',
          urdu: data.urdu || 'ترجمہ دستیاب نہیں',
          audio: data.audio || {}
        }
      }));
      
      console.log('تم حفظ البيانات للآية:', verseKey);
      return data;
    } catch (error) {
      console.error('خطأ في جلب بيانات الآية:', error);
      
      // في حالة الخطأ، أضف بيانات افتراضية
      const verseKey = `${surahNo}:${ayahNo}`;
      setVerseTranslations(prev => ({
        ...prev,
        [verseKey]: {
          english: 'Translation not available',
          bengali: 'অনুবাদ উপলব্ধ নেই',
          urdu: 'ترجمہ دستیاب نہیں',
          audio: {}
        }
      }));
      
      return null;
    }
  };

  // 🎵 تشغيل الصوت للآية
  const playVerseAudio = async (surahNo, ayahNo) => {
    try {
      if (!verseTranslations[`${surahNo}:${ayahNo}`]) {
        await fetchVerseData(surahNo, ayahNo);
      }
      
      const verseData = verseTranslations[`${surahNo}:${ayahNo}`];
      if (verseData && verseData.audio && verseData.audio[currentReciter]) {
        const audioUrl = verseData.audio[currentReciter].url;
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          setIsPlaying(true);
          setSelectedVerse(`${surahNo}:${ayahNo}`);
        }
      }
    } catch (error) {
      console.error('خطأ في تشغيل الصوت:', error);
    }
  };

  // 🎵 التحكم في التشغيل/الإيقاف
  const toggleAudio = async (surahNo, ayahNo) => {
    if (isPlaying && audioRef.current) {
      // إيقاف الصوت
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // تشغيل الصوت
      await playVerseAudio(surahNo, ayahNo);
    }
  };


  // 👆 التعامل مع النقر على الآية
  const handleVerseClick = (verse) => {
    setSelectedVerse(`${verse.surahNo}:${verse.ayahNo}`);
    // فقط إظهار الـ sidebar في الموبايل، في الـ desktop سيظهر تلقائياً
    if (window.innerWidth < 1024) {
      setShowSidebar(true);
    }
    
    // جلب بيانات الآية إذا لم تكن محملة
    if (!verseTranslations[`${verse.surahNo}:${verse.ayahNo}`]) {
      fetchVerseData(verse.surahNo, verse.ayahNo);
    }
  };

  // التنقل بين الصفحات
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= 604) {
      setCurrentPage(pageNum);
      router.push(`/quran-reader?page=${pageNum}`, undefined, { shallow: true });
      setSelectedVerses(new Set());
      setShowPageSelector(false);
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // تحديد/إلغاء تحديد آية
  const toggleVerseSelection = (verseId) => {
    const newSelected = new Set(selectedVerses);
    if (newSelected.has(verseId)) {
      newSelected.delete(verseId);
    } else {
      newSelected.add(verseId);
    }
    setSelectedVerses(newSelected);
  };

  // نسخ الآيات المحددة
  const copySelectedVerses = () => {
    if (selectedVerses.size === 0) return;
    
    const selectedTexts = pageData.verses
      .filter(v => selectedVerses.has(v.id))
      .map(v => `${v.text} {${v.surahNo}:${v.ayahNo}}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(selectedTexts);
    alert(`تم نسخ ${selectedVerses.size} آية`);
  };

  // مشاركة الآيات المحددة
  const shareSelectedVerses = () => {
    if (selectedVerses.size === 0) return;
    
    const selectedTexts = pageData.verses
      .filter(v => selectedVerses.has(v.id))
      .map(v => `${v.text} {${v.surahNo}:${v.ayahNo}}`)
      .join('\n\n');
    
    if (navigator.share) {
      navigator.share({
        title: `آيات من القرآن الكريم - الصفحة ${currentPage}`,
        text: selectedTexts,
      });
    } else {
      copySelectedVerses();
    }
  };

  // تحديد الكل / إلغاء تحديد الكل
  const toggleSelectAll = () => {
    if (selectedVerses.size === pageData?.verses?.length) {
      setSelectedVerses(new Set());
    } else {
      setSelectedVerses(new Set(pageData?.verses?.map(v => v.id) || []));
    }
  };

  // 📚 فتح التفسير للآية
  const openTafseer = (verse) => {
    setSelectedVerse({
      surahNumber: verse.surahNo,
      ayahNumber: verse.ayahNo,
      ayahText: verse.text,
      surahName: verse.surahName || `سورة ${verse.surahNo}`
    });
    setTafseerOpen(true);
  };

  // 🔍 البحث والتنقل (رقم السورة/الآية أو اسم السورة)
  const handleNavigation = async (query) => {
    if (!query || query.trim().length < 1) {
      setNavigationResults([]);
      return;
    }

    setIsNavigating(true);
    try {
      // البحث بالرقم أولاً (سورة:آية أو سورة فقط)
      const numberMatch = query.match(/^(\d+)(?::(\d+))?$/);
      if (numberMatch) {
        const surahNum = parseInt(numberMatch[1]);
        const ayahNum = numberMatch[2] ? parseInt(numberMatch[2]) : null;
        
        if (surahNum >= 1 && surahNum <= 114) {
          // الانتقال مباشرة للسورة/الآية
          await navigateToSurahAyah(surahNum, ayahNum);
          return;
        }
      }

      // البحث بالاسم
      const response = await fetch(`/api/search-surahs?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setNavigationResults(data.results);
      }
    } catch (error) {
      console.error('Navigation search error:', error);
      setNavigationResults([]);
    } finally {
      setIsNavigating(false);
    }
  };

  // الانتقال لسورة وآية محددة
  const navigateToSurahAyah = async (surahNum, ayahNum = null) => {
    try {
      // الحصول على رقم الصفحة التي تحتوي على هذه الآية
      const response = await fetch(`/api/get-verse-page?surah=${surahNum}&ayah=${ayahNum || 1}`);
      const data = await response.json();
      
      if (data.success && data.page) {
        goToPage(data.page);
        setShowNavigation(false);
        setNavigationQuery('');
        setNavigationResults([]);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <LoaderOne />
          <p className="text-gray-300 mt-6 text-lg font-medium">جاري تحميل الصفحة...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>قارئ القرآن الكريم - الصفحة {currentPage}</title>
        <meta name="description" content={`قارئ القرآن الكريم - الصفحة ${currentPage} من المصحف الشريف`} />
      </Head>

      <div className="min-h-screen bg-neutral-900 text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 md:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              {/* Logo & Menu */}
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <Menu size={18} className="sm:w-5 sm:h-5" />
                </button>
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-sky-200">قارئ القرآن</h1>
              </div>

              {/* Page Info */}
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => setShowPageSelector(!showPageSelector)}
                  className="bg-gray-700 hover:bg-slate-600 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg transition-colors relative"
                >
                  <span className="text-xs sm:text-sm">الصفحة {currentPage}</span>
                  {pageData?.pageInfo && (
                    <div className="text-xs sm:text-sm text-gray-300">
                      الجزء {pageData.pageInfo.juz}
                    </div>
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                {/* Navigation Button */}
                <button
                  onClick={() => setShowNavigation(!showNavigation)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${showNavigation ? 'bg-chart-4': 'bg-gray-600 hover:bg-gray-500'}`}
                  title="الانتقال للسورة أو الآية"
                >
                  <Navigation size={14} className="sm:w-4 sm:h-4" />
                </button>

                {/* Search Button */}
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${showSearch ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                  title="البحث في الصفحة"
                >
                  <Search size={14} className="sm:w-4 sm:h-4" />
                </button>

                {/* Settings Button */}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${showSettings ? 'bg-purple-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                  title="الإعدادات"
                >
                  <Settings size={14} className="sm:w-4 sm:h-4" />
                </button>

                {selectedVerses.size > 0 && (
                  <>
                    <button
                      onClick={copySelectedVerses}
                      className="p-1.5 sm:p-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors"
                      title="نسخ المحدد"
                    >
                      <Copy size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={shareSelectedVerses}
                      className="p-1.5 sm:p-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors"
                      title="مشاركة المحدد"
                    >
                      <Share2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <span className="text-xs sm:text-sm text-gray-300 px-1 sm:px-2">
                      {selectedVerses.size}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Navigation Panel */}
            {showNavigation && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-neutral-800 rounded-lg">
                <h3 className="text-base sm:text-lg font-bold text-indigo-300 mb-3 sm:mb-4 flex items-center gap-2">
                  <Navigation size={16} className="sm:w-5 sm:h-5" />
                  الانتقال السريع
                </h3>
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                  <Navigation size={14} className="text-gray-400 sm:w-4 sm:h-4" />
                  <input
                    type="text"
                    value={navigationQuery}
                    onChange={(e) => {
                      setNavigationQuery(e.target.value);
                      handleNavigation(e.target.value);
                    }}
                    placeholder="رقم السورة أو الآية (مثل 2:255)..."
                    className="flex-1 bg-neutral-700 text-white px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-xs sm:text-sm rounded-lg border border-gray-600 focus:border-indigo-400 focus:outline-none"
                  />
                  {isNavigating && (
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-indigo-400"></div>
                  )}
                </div>
                
                {/* أمثلة سريعة */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  <button
                    onClick={() => {
                      setNavigationQuery('2:255');
                      handleNavigation('2:255');
                    }}
                    className="px-2 py-1 sm:px-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs sm:text-sm transition-colors"
                  >
                    آية الكرسي
                  </button>
                  <button
                    onClick={() => {
                      setNavigationQuery('36');
                      handleNavigation('36');
                    }}
                    className="px-2 py-1 sm:px-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs sm:text-sm transition-colors"
                  >
                    سورة يس
                  </button>
                  <button
                    onClick={() => {
                      setNavigationQuery('18:10');
                      handleNavigation('18:10');
                    }}
                    className="px-2 py-1 sm:px-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs sm:text-sm transition-colors"
                  >
                    أصحاب الكهف
                  </button>
                </div>

                {/* نتائج البحث */}
                {navigationResults.length > 0 && (
                  <div className="max-h-40 overflow-y-auto">
                    <h4 className="text-sm font-bold text-gray-300 mb-2">النتائج:</h4>
                    {navigationResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => navigateToSurahAyah(result.number)}
                        className="w-full text-right p-2 hover:bg-neutral-700 rounded-lg transition-colors flex justify-between items-center"
                      >
                        <span className="text-white">{result.name.ar}</span>
                        <span className="text-indigo-300 text-sm">سورة {result.number}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Search Panel */}
            {showSearch && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-neutral-800 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <Search size={14} className="text-gray-400 sm:w-4 sm:h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      searchInCurrentPage(e.target.value);
                    }}
                    placeholder="ابحث في الصفحة..."
                    className="flex-1 bg-neutral-700 text-white px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-xs sm:text-sm rounded-lg border border-gray-600 focus:border-sky-400 focus:outline-none"
                  />
                  {searchResults.length > 0 && (
                    <span className="text-xs sm:text-sm text-gray-300">
                      {searchResults.length}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-neutral-800 rounded-lg">
                <h3 className="text-base sm:text-lg font-bold text-sky-200 mb-3 sm:mb-4 flex items-center gap-2">
                  <Settings size={16} className="sm:w-5 sm:h-5" />
                  إعدادات العرض
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Font Size */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm md:text-base text-gray-300">حجم الخط</label>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        onClick={() => adjustFontSize(-2)}
                        className="p-1 sm:p-1.5 rounded bg-gray-600 hover:bg-gray-500"
                      >
                        <Minus size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                      <span className="text-xs sm:text-sm w-10 sm:w-12 text-center">{fontSize}px</span>
                      <button
                        onClick={() => adjustFontSize(2)}
                        className="p-1 sm:p-1.5 rounded bg-gray-600 hover:bg-gray-500"
                      >
                        <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Line Spacing */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm md:text-base text-gray-300">التباعد بين السطور</label>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        onClick={() => adjustLineSpacing(-0.1)}
                        className="p-1 sm:p-1.5 rounded bg-gray-600 hover:bg-gray-500"
                      >
                        <Minus size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                      <span className="text-xs sm:text-sm w-10 sm:w-12 text-center">{lineSpacing.toFixed(1)}</span>
                      <button
                        onClick={() => adjustLineSpacing(0.1)}
                        className="p-1 sm:p-1.5 rounded bg-gray-600 hover:bg-gray-500"
                      >
                        <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Show Verse Numbers */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm md:text-base text-gray-300">إظهار أرقام الآيات</label>
                    <button
                      onClick={() => setShowVerseNumbers(!showVerseNumbers)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 border-2 border-chart-13 shadow-md shadow-chart-17 rounded transition-colors ${
                        showVerseNumbers ? 'bg-chart-18' : 'bg-chart-19'
                      }`}
                    >
                      {showVerseNumbers ? <Eye size={14} className="sm:w-4 sm:h-4" /> : <EyeOff size={14} className="sm:w-4 sm:h-4" />}
                      <span className="text-xs sm:text-sm">{showVerseNumbers ? 'مُفعل' : 'مُعطل'}</span>
                    </button>
                  </div>

                  {/* Highlight on Hover */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm md:text-base text-gray-300">تمييز عند التمرير</label>
                    <button
                      onClick={() => setHighlightOnHover(!highlightOnHover)}
                      className={`flex items-center shadow-md shadow-[#000] border-2 border-chart-17 gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded transition-colors ${
                        highlightOnHover ? 'bg-chart-13' : 'bg-gray-600'
                      }`}
                    >
                      <Palette size={14} className="sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{highlightOnHover ? 'مُفعل' : 'مُعطل'}</span>
                    </button>
                  </div>
                </div>

                {/* Keyboard Shortcuts Info */}
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg">
                  <h4 className="text-xs sm:text-sm font-bold text-chart-10 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                    <Keyboard size={14} className="sm:w-4 sm:h-4" />
                    اختصارات لوحة المفاتيح
                  </h4>
                  <div className="text-xs sm:text-sm text-gray-400">
                    <div>Ctrl+F: البحث | Ctrl+A: تحديد الكل</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex max-w-7xl mx-auto">
          {/* Sidebar - Desktop */}
          <aside className={`hidden lg:block w-80 bg-[#1a1a1a] min-h-screen border-r border-[#333333] mb-2 p-5`}>
            <div className="space-y-6">
                            {/* 🎵 قسم الآية المختارة - Desktop */}
              {selectedVerse && (
                <div className="bg-[#343434] rounded-lg p-4 border border-[#262626]">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Book size={16} className="mr-2 text-[var(--chart-10)]"/>
                    الآية المختارة
                  </h4>
                  
                  {/* أزرار التحكم */}
                  <div className="grid grid-cols-2 gap-3 pb-6">
                    {/* نسخ النص */}
                    <div className="flex items-center justify-center p-1 rounded-lg transition-all duration-300 border-transparent" title="نسخ النص">
                      <CopyButton
                        content={(() => {
                          const verseKey = selectedVerse;
                          const verse = pageData?.lines
                            ?.flatMap(line => line.verses)
                            ?.find(v => `${v.surahNo}:${v.ayahNo}` === verseKey);
                          return verse ? verse.text : '';
                        })()}
                        variant="ghost"
                        size="sm"
                        className="text-chart-10 bg-chart-17 hover:bg-chart-13 hover:text-chart-18 py-6 px-8 "
                      />
                    </div>

                    {/* تشغيل الصوت */}
                    <div className="items-center justify-center rounded-lg transition-all duration-300 border-transparent" title="تشغيل الصوت">
                      <button
                        onClick={() => {
                          if (typeof selectedVerse === 'string') {
                            const [surahNo, ayahNo] = selectedVerse.split(':').map(Number);
                            toggleAudio(surahNo, ayahNo);
                          }
                        }}
                        className="flex items-center justify-center bg-chart-13 !px-6 !py-6 rounded-lg transition-all duration-300 border border-transparent hover:border-[var(--chart-10)]/30 text-white px-6 py-8"
                      >
                        {isPlaying ? 
                          <Pause size={18} className="text-chart-20" /> : 
                          <Play size={18} className="text-chart-18" />
                        }
                      </button>
                    </div>
                  </div>

                  {/* اختيار القارئ */}
                  <div className="mb-4">
                    <label className="block text-base text-white mb-2">القارئ</label>
                    <DropDownButton
                      options={reciterOptions}
                      value={currentReciter}
                      onChange={(value) => setCurrentReciter(value)}
                      placeholder="اختر القارئ"
                      className="w-full bg-[var(--chart-17)]"
                    />
                  </div>

                  {/* زر الترجمة */}
                  <button
                    onClick={() => {
                      setShowTranslation(!showTranslation);
                      if (!showTranslation && typeof selectedVerse === 'string') {
                        const [surahNo, ayahNo] = selectedVerse.split(':').map(Number);
                        if (!verseTranslations[selectedVerse]) {
                          fetchVerseData(surahNo, ayahNo);
                        }
                      }
                    }}
                    className={`w-full flex items-center bg-chart-17 justify-center p-3 rounded-lg transition-all duration-300 border ${
                      showTranslation 
                        ? 'bg-[#3a3a3a] hover:bg-chart-13 text-white border-[var(--chart-13)]' 
                        : 'bg-[#262626] hover:bg-[#3a3a] text-white border-transparent hover:border-[var(--chart-18)]/30'
                    }`}
                  >
                    <Languages size={14} className="mr-1" />
                    <span className="text-md">
                      {showTranslation ? 'إخفاء الترجمة' : 'عرض الترجمة'}
                    </span>
                  </button>

                  {/* عرض الترجمة */}
                  {showTranslation && (
                    <div className="mt-4 bg-[#3a3a3a] shadow-md shadow-chart-17 rounded-lg p-4 border border-[#444444]">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-base text-white font-medium">الترجمة</span>
                        <DropDownButton
                          options={languageOptions}
                          value={translationLanguage}
                          onChange={(value) => setTranslationLanguage(value)}
                          className="bg-[var(--chart-17)]"
                        />
                      </div>
                      <p className={`text-sm text-[#cccccc] leading-relaxed ${getFontForLanguage(translationLanguage)}`}>
                        {verseTranslations[selectedVerse] 
                          ? verseTranslations[selectedVerse][translationLanguage] 
                          : 'جاري تحميل الترجمة...'}
                      </p>
                      {!verseTranslations[selectedVerse] && (
                        <div className="text-sm text-[#999999] mt-2">
                          <div className="animate-pulse">🔄 loading...</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* نمط العرض */}
              <div className="bg-[#343434] rounded-lg p-4 border border-[#262626]">
                <h3 className="font-bold text-white mb-4 text-center">نمط العرض</h3>
                
                {/* خيارات النمط */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setLineSpacing(1.4)}
                      className={`py-2 px-3 rounded-lg text-sm transition-all duration-300 border ${
                        lineSpacing <= 1.5 ? 'bg-[var(--chart-10)] text-white border-[var(--chart-10)]' : 'bg-[#262626] text-white border-transparent hover:bg-[#3a3a3a] hover:border-[var(--chart-10)]/30'
                      }`}
                    >
                      فقرة واحدة
                    </button>
                    <button 
                      onClick={() => setLineSpacing(2.0)}
                      className={`py-2 px-3 rounded-lg text-sm transition-all duration-300 border ${
                        lineSpacing > 1.5 ? 'bg-[#311111] text-white border-[#221111]' : 'bg-[#262626] text-white border-transparent hover:bg-[#3a3a3a] hover:border-[#221111]/30'
                      }`}
                    >
                      أسطر متباعدة
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setShowVerseNumbers(true)}
                      className={`py-2 px-3 rounded-lg text-sm transition-all duration-300 border ${
                        showVerseNumbers ? 'bg-[var(--chart-10)] text-white border-[var(--chart-10)]' : 'bg-[#262626] text-white border-transparent hover:bg-[#3a3a3a] hover:border-[var(--chart-10)]/30'
                      }`}
                    >
                      خط أسود
                    </button>
                    <button 
                      onClick={() => setShowVerseNumbers(false)}
                      className={`py-2 px-3 rounded-lg text-sm transition-all duration-300 border ${
                        !showVerseNumbers ? 'bg-[var(--chart-10)] text-white border-[var(--chart-10)]' : 'bg-[#262626] text-white border-transparent hover:bg-[#3a3a3a] hover:border-[var(--chart-10)]/30'
                      }`}
                    >
                      ملون (تجويد)
                    </button>
                  </div>
                </div>
              </div>

              {/* انتقال سريع */}
              <div className="bg-[#343434] rounded-lg p-4 border border-[#262626]">
                <h3 className="font-bold text-white mb-4 text-center">انتقال سريع</h3>
                
                {/* شريط البحث */}
                <div className="mb-4">
                  <div className="flex bg-white rounded-lg p-2">
                    <input
                      type="text"
                      value={navigationQuery}
                      onChange={(e) => {
                        setNavigationQuery(e.target.value);
                        handleNavigation(e.target.value);
                      }}
                      placeholder="اسم السورة"
                      className="flex-1 bg-transparent text-neutral-700 px-2 outline-none text-right"
                    />
                    <span className="text-gray-600 px-2 text-sm">رقم الآية</span>
                    <button className="text-gray-600">☰</button>
                  </div>
                </div>

                {/* قائمة السور */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {allSurahs.map((surah) => (
                    <div key={surah.number} className="flex items-center gap-3">
                      <button
                        onClick={() => navigateToSurahAyah(surah.number)}
                        className="bg-gray-600 hover:bg-gray-700 text-white w-8 h-8 rounded flex items-center justify-center font-bold text-sm transition-colors"
                      >
                        {surah.number}
                      </button>
                      <button
                        onClick={() => navigateToSurahAyah(surah.number)}
                        className="flex-1 text-right text-gray-300 hover:text-gray-200 transition-colors font-medium"
                      >
                        {surah.name.ar}
                      </button>
                    </div>
                  ))}
                </div>

                {/* نتائج البحث */}
                {navigationResults.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-bold text-gray-300">النتائج:</h4>
                    {navigationResults.map((result, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <button
                          onClick={() => navigateToSurahAyah(result.number)}
                          className="bg-gray-600 hover:bg-gray-700 text-white w-8 h-8 rounded flex items-center justify-center font-bold text-sm transition-colors"
                        >
                          {result.number}
                        </button>
                        <button
                          onClick={() => navigateToSurahAyah(result.number)}
                          className="flex-1 text-right text-gray-300 hover:text-gray-200 transition-colors font-medium"
                        >
                          {result.name.ar}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <button
                  onClick={toggleSelectAll}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  {selectedVerses.size === pageData?.verses?.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Page Navigation */}
       
       

            {/* Quran Page Content */}
            <div className="bg-neutral-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 border border-gray-700">
              {processPageDataWithSurahHeaders(pageData).map((item) => {
                if (item.type === 'surah-header') {
                  // عرض عنوان السورة
                  return (
                    <div key={item.id} className="mb-4 sm:mb-5 md:mb-6 mt-6 sm:mt-7 md:mt-8 first:mt-0">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center bg-chart-17 border border-gray-700 backdrop-blur-sm text-white px-3 py-1 sm:px-4 md:px-5 lg:px-6 rounded-sm shadow-lg">
                          <div className="text-right">
                            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">{item.surahInfo.name.ar}</div>
                            <div className="text-xs sm:text-sm md:text-base opacity-90">{item.surahInfo.name.en}</div>
                          </div>
                          <div className="mx-2 sm:mx-3 w-px h-6 sm:h-7 md:h-8 bg-white/30"></div>
                          <div className="text-left">
                            <div className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">سورة رقم</div>
                            <div className="text-base sm:text-lg md:text-xl font-bold">{item.surahInfo.number}</div>
                          </div>
                        </div>
                        <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-400">
                          {item.surahInfo.verses_count} آية • {item.surahInfo.revelation_place.ar}
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4 border-t border-gray-600"></div>
                    </div>
                  );
                } else {
                  // عرض سطر الآيات العادي
                  return (
                    <div key={`line-${item.lineIndex}`} className="mb-4 text-right" style={{ lineHeight: lineSpacing }}>
                      {item.verses.map((verse, verseIndex) => (
                        <span
                          key={verse.id}
                          onClick={(e) => {
                            if (e.ctrlKey || e.metaKey) {
                              // Ctrl/Cmd + Click للتفسير
                              openTafseer(verse);
                            } else {
                              // Click عادي لتفعيل الأدوات
                              handleVerseClick(verse);
                              toggleVerseSelection(verse.id);
                            }
                          }}
                          onDoubleClick={() => openTafseer(verse)}
                          className={`inline-block cursor-pointer px-1 py-0.5 rounded transition-all duration-200 relative group ${
                            selectedVerses.has(verse.id)
                              ? 'bg-sky-600/30 text-sky-100 shadow-md'
                              : highlightOnHover 
                                ? 'hover:bg-gray-700/50 text-gray-100'
                                : 'text-gray-100'
                          } ${
                            searchResults.some(r => r.id === verse.id) 
                              ? 'bg-chart-17 ' 
                              : ''
                          } ${
                            selectedVerse === `${verse.surahNo}:${verse.ayahNo}` 
                              ? 'bg-green-600/30 border border-green-500/50' 
                              : ''
                          }`}
                          style={{ fontSize: `${fontSize}px` }}
                          title={`${verse.surahNameAr} - آية ${verse.ayahNo} | انقر للأدوات أو مرتين للتفسير`}
                        >
                          {verse.text}
                          {showVerseNumbers && (
                            <span className="inline-block mx-0.5 sm:mx-1 text-xs sm:text-sm md:text-base bg-gray-600 text-white px-1 rounded">
                              {verse.ayahNo}
                            </span>
                          )}
                          
                          {/* أيقونة التفسير عند Hover */}
                          <span className="invisible group-hover:visible absolute -top-1.5 sm:-top-2 -right-0.5 sm:-right-1 bg-indigo-600 text-white text-xs sm:text-sm px-0.5 sm:px-1 rounded opacity-75">
                            <Book size={10} className="sm:w-3 sm:h-3" />
                          </span>
                          
                          {verseIndex < item.verses.length - 1 && ' '}
                        </span>
                      ))}
                    </div>
                  );
                }
              })}
            </div>

            {/* Bottom Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
              <button
                onClick={goToPrevPage}
                disabled={currentPage <= 1}
                className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-sm sm:text-base bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                الصفحة السابقة
              </button>
              
              <button
                onClick={() => setShowPageSelector(!showPageSelector)}
                className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                اذهب إلى صفحة
              </button>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage >= 604}
                className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-sm sm:text-base bg-slate-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                الصفحة التالية
              </button>
            </div>
          </main>
        </div>

        {/* Mobile Sidebar */}
        {showSidebar && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)}></div>
            <div className="absolute left-0 top-0 h-full w-72 sm:w-80 bg-[#1a1a1a] p-3 sm:p-4 md:p-5 overflow-y-auto border-r border-[#333333]">
              <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-base sm:text-lg font-bold text-white">القائمة</h3>
                <button onClick={() => setShowSidebar(false)} className="text-white hover:text-[var(--chart-10)] transition-colors">
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
              
              {/* 🎵 قسم الآية المختارة */}
              {selectedVerse && (
                <div className="bg-[#343434] rounded-lg p-4 border border-[#262626] mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Book size={16} className="mr-2 text-[var(--chart-10)]" />
                    الآية المختارة
                  </h4>
                  
                  {/* أزرار التحكم */}
                  <div className="grid grid-cols-2 gap-3 pb-6">
                    {/* نسخ النص */}
                    <div className="flex items-center justify-center  rounded-lg transition-all duration-300 border border-transparent  " title="نسخ النص">
                      <CopyButton
                        content={(() => {
                          const verseKey = selectedVerse;
                          const verse = pageData?.lines
                            ?.flatMap(line => line.verses)
                            ?.find(v => `${v.surahNo}:${v.ayahNo}` === verseKey);
                          return verse ? verse.text : '';
                        })()}
                        variant="ghost"
                        size="lg"
                        className="text-[var(--chart-10)] py-6 px-8 bg-chart-17 hover:bg-chart-13 hover:text-chart-18"
                      />
                    </div>

                    {/* تشغيل الصوت */}
                    <div className="flex items-center  justify-center rounded-lg transition-all duration-300 border-transparent" title="تشغيل الصوت">
                      <button
                        onClick={() => {
                          if (typeof selectedVerse === 'string') {
                            const [surahNo, ayahNo] = selectedVerse.split(':').map(Number);
                            toggleAudio(surahNo, ayahNo);
                          }
                        }}
                        className=" items-center justify-center !px-6 !py-5 bg-chart-13 rounded-lg transition-all duration-300 border border-transparent hover:border-[var(--chart-10)]/30 text-white px-6 py-8"
                      >
                        {isPlaying ? 
                          <Pause size={18} className="text-chart-20" /> : 
                          <Play size={18} className="text-chart-18" />
                        }
                      </button>
                    </div>
                  </div>

                  {/* اختيار القارئ */}
                  <div className="mb-4">
                    <label className="block text-base text-white mb-2">القارئ</label>
                    <DropDownButton
                      options={reciterOptions}
                      value={currentReciter}
                      onChange={(value) => setCurrentReciter(value)}
                      placeholder="اختر القارئ"
                      className="w-full bg-[var(--chart-17)]"
                    />
                  </div>

                  {/* زر الترجمة */}
                  <button
                    onClick={() => {
                      setShowTranslation(!showTranslation);
                      if (!showTranslation && typeof selectedVerse === 'string') {
                        const [surahNo, ayahNo] = selectedVerse.split(':').map(Number);
                        if (!verseTranslations[selectedVerse]) {
                          fetchVerseData(surahNo, ayahNo);
                        }
                      }
                    }}
                    className={`w-full flex items-center justify-center p-3 rounded-lg transition-all duration-300 border ${
                      showTranslation 
                        ? 'bg-[var(--chart-18)] hover:bg-[var(--chart-18)]/80 text-white border-[var(--chart-18)]' 
                        : 'bg-[#262626] hover:bg-[#3a3a3a] text-white border-transparent hover:border-[var(--chart-18)]/30'
                    }`}
                  >
                    <Languages size={14} className="mr-1" />
                    <span className="text-sm">
                      {showTranslation ? 'إخفاء الترجمة' : 'عرض الترجمة'}
                    </span>
                  </button>

                  {/* عرض الترجمة */}
                  {showTranslation && (
                    <div className="mt-4 bg-[#2a2a2a] rounded-lg p-4 border border-[#444444]">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-base text-white font-medium">الترجمة</span>
                        <DropDownButton
                          options={languageOptions}
                          value={translationLanguage}
                          onChange={(value) => setTranslationLanguage(value)}
                          className="bg-[var(--chart-17)]"
                        />
                      </div>
                      <p className={`text-sm text-[#cccccc] leading-relaxed ${getFontForLanguage(translationLanguage)}`}>
                        {verseTranslations[selectedVerse] 
                          ? verseTranslations[selectedVerse][translationLanguage] 
                          : 'جاري تحميل الترجمة...'}
                      </p>
                      {!verseTranslations[selectedVerse] && (
                        <div className="text-sm text-[#999999] mt-2">
                          <div className="animate-pulse">🔄 جاري الاتصال بـ QuranAPI...</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* نفس محتوى desktop sidebar */}
              <div className="space-y-6">
                
                {/* نمط العرض */}
                <div className="bg-[#343434] rounded-lg p-4 border border-[#262626]">
                  <h3 className="font-bold text-white mb-4 text-center">نمط العرض</h3>
                  
                  {/* خيارات النمط */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setLineSpacing(1.4)}
                        className={`py-2 px-3 rounded-lg text-sm transition-all duration-300 border ${
                          lineSpacing <= 1.5 ? 'bg-[var(--chart-10)] text-white border-[var(--chart-10)]' : 'bg-[#262626] text-white border-transparent hover:bg-[#3a3a3a] hover:border-[var(--chart-10)]/30'
                        }`}
                      >
                        فقرة واحدة
                      </button>
                      <button 
                        onClick={() => setLineSpacing(2.0)}
                        className={`py-2 px-3 rounded-lg text-sm transition-all duration-300 border ${
                          lineSpacing > 1.5 ? 'bg-[#221111] text-white border-[#221111]' : 'bg-[#262626] text-white border-transparent hover:bg-[#3a3a3a] hover:border-[#221111]/30'
                        }`}
                      >
                        أسطر متباعدة
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setShowVerseNumbers(true)}
                        className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                          showVerseNumbers ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        خط أسود
                      </button>
                      <button 
                        onClick={() => setShowVerseNumbers(false)}
                        className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                          !showVerseNumbers ? 'bg-neutral-600 text-white' : 'bg-neutral-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        ملون (تجويد)
                      </button>
                    </div>
                  </div>
                </div>

                {/* انتقال سريع */}
                <div className="bg-neutral-700 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-bold text-gray-300 mb-4 text-center">انتقال سريع</h3>
                  
                  {/* شريط البحث */}
                  <div className="mb-4">
                    <div className="flex bg-white rounded-lg p-2">
                      <input
                        type="text"
                        value={navigationQuery}
                        onChange={(e) => {
                          setNavigationQuery(e.target.value);
                          handleNavigation(e.target.value);
                        }}
                        placeholder="اسم السورة"
                        className="flex-1 bg-transparent text-neutral-700 px-2 outline-none text-right"
                      />
                      <span className="text-gray-600 px-2 text-sm">رقم الآية</span>
                      <button className="text-gray-600">☰</button>
                    </div>
                  </div>

                  {/* قائمة السور للموبايل */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {allSurahs.map((surah) => (
                      <div key={surah.number} className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            navigateToSurahAyah(surah.number);
                            setShowSidebar(false);
                          }}
                          className="bg-gray-600 hover:bg-gray-700 text-white w-8 h-8 rounded flex items-center justify-center font-bold text-sm transition-colors"
                        >
                          {surah.number}
                        </button>
                        <button
                          onClick={() => {
                            navigateToSurahAyah(surah.number);
                            setShowSidebar(false);
                          }}
                          className="flex-1 text-right text-gray-300 hover:text-gray-200 transition-colors font-medium"
                        >
                          {surah.name.ar}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={toggleSelectAll}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  {selectedVerses.size === pageData?.verses?.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Selector Modal */}
        {showPageSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowPageSelector(false)}></div>
            <div className="bg-neutral-800 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 w-full max-w-sm sm:max-w-md relative">
              <h3 className="text-base sm:text-lg font-bold text-sky-200 mb-3 sm:mb-4">اذهب إلى صفحة</h3>
              <input
                type="number"
                min="1"
                max="604"
                defaultValue={currentPage}
                className="w-full bg-neutral-700 text-white px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg border border-gray-600 focus:border-sky-400 focus:outline-none"
                placeholder="رقم الصفحة (1-604)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const pageNum = parseInt(e.target.value);
                    if (pageNum >= 1 && pageNum <= 604) {
                      goToPage(pageNum);
                    }
                  }
                }}
              />
              <div className="flex gap-2 mt-3 sm:mt-4">
                <button
                  onClick={() => {
                    const input = document.querySelector('input[type="number"]');
                    const pageNum = parseInt(input.value);
                    if (pageNum >= 1 && pageNum <= 604) {
                      goToPage(pageNum);
                    }
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 sm:px-4 text-sm sm:text-base rounded-lg transition-colors"
                >
                  اذهب
                </button>
                <button
                  onClick={() => setShowPageSelector(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 sm:px-4 text-sm sm:text-base rounded-lg transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}


        {/* مشغل الصوت المخفي */}
        <audio
          ref={audioRef}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
          preload="none"
        />

        {/* مكون التفسير */}
        {selectedVerse && (
          <TafseerPopup
            open={tafseerOpen}
            onClose={() => setTafseerOpen(false)}
            surahNumber={selectedVerse.surahNumber}
            ayahNumber={selectedVerse.ayahNumber}
            ayahText={selectedVerse.ayahText}
            surahName={selectedVerse.surahName}
          />
        )}
      </div>
    </>
  );
}
