import React, { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import { Search, ArrowLeft, BookOpen, Eye, EyeOff } from 'lucide-react';
import { FaCopy, FaShareAlt } from 'react-icons/fa';
import { MdMenuBook } from 'react-icons/md';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TafseerPopup from '../../components/AudioPlayer/tafseer_popup.js';
import SeoHead from '../../components/SeoHead';
import convertToArabicNumerals from '../../utils/convertToArabicNumerals';


export default function SurahPage({ surah, prevSurah, nextSurah }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [showTranslation, setShowTranslation] = useState(true);
  const [tafseerOpen, setTafseerOpen] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);

  // البحث في الآيات
  const handleSearch = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search-verses?q=${encodeURIComponent(query)}&limit=100`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // البحث التلقائي عند تغيير النص
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);


  let prefaceText = "";
  if (surah.number !== 1) {
    if (surah.number === 9) {
      prefaceText = "أعوذ بالله من الشيطان الرجيم";
    } else {
      prefaceText = "بسم الله الرحمن الرحيم";
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('تم نسخ الآية بنجاح ✓', {
      duration: 3000,
      position: 'bottom-center',
      style: {
        background: '#10b981',
        color: '#fff',
        fontFamily: 'hafs',
        fontSize: '16px',
        padding: '12px 24px',
      },
    });
  };

  const shareVerse = (text) => {
    if (navigator.share) {
      navigator.share({
        title: 'مشاركة آية',
        text: text,
      }).then(() => {
        toast.success('تمت المشاركة بنجاح ✓', {
          duration: 2000,
          position: 'bottom-center',
          style: {
            background: '#10b981',
            color: '#fff',
            fontFamily: 'hafs',
          },
        });
      })
        .catch((error) => console.log('حدث خطأ في المشاركة', error));
    } else {
      toast.error('ميزة المشاركة غير مدعومة على هذا المتصفح', {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: '#ef4444',
          color: '#fff',
          fontFamily: 'hafs',
        },
      });
    }
  };

  const openTafseer = (verse, verseIndex) => {
    setSelectedVerse({
      surahNumber: surah.number,
      ayahNumber: verseIndex + 1,
      ayahText: verse.text.ar,
      surahName: surah.name.ar
    });
    setTafseerOpen(true);
  };


  return (
    <>
      <Toaster />
      <SeoHead
        title={`سورة ${surah.name.ar} (${surah.name.en}) - قراءة مفصلة من القرآن الكريم`}
        description={`اكتشف سورة ${surah.name.ar} من القرآن الكريم، والتي تحتوي على ${surah.verses_count} آية ونزلت في ${surah.revelation_place.ar}. تصفح تفاصيل السورة، مع إمكانية الاستماع للتلاوة وقراءة النصوص. احصل على معلومات شاملة حول السورة ومعانيها.`}
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/quran/${surah.number}.html`}
        image={`${process.env.NEXT_PUBLIC_BASE_URL}/images/surah-${surah.number}.jpg`}
        keywords={`سورة ${surah.name.ar}, سورة ${surah.name.en}, القرآن الكريم, تفاصيل السورة, عدد الآيات, مكان نزول السورة, تلاوة القرآن, قراءة القرآن الكريم, تفسير السور, معلومات قرآنية`}
      />
      <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft size={20} />
              <span>العودة للرئيسية</span>
            </Link>
            
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Search size={18} />
              <span>البحث في القرآن</span>
            </button>
          </div>

          {/* شريط البحث */}
          {showSearch && (
            <div className="bg-zinc-800/50 rounded-lg p-4 mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="ابحث في آيات القرآن الكريم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-800 text-white placeholder-gray-400 rounded-lg px-12 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none text-right"
                />
                {isSearching && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                  </div>
                )}
              </div>
              
              {searchResults.length > 0 && (
                <div className="mt-2 text-sm text-gray-300">
                  تم العثور على {searchResults.length} نتيجة
                </div>
              )}
            </div>
          )}

          {/* معلومات السورة */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-yellow-400 mb-4">
              سورة {surah.name.ar}
            </h1>
            
            {/* معلومات تفصيلية */}
            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <p className="text-yellow-400 font-bold mb-3">معلومات عن السورة</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                <p>اسم السورة بالعربي: <span className="text-white">{surah.name.ar}</span></p>
                <p>اسم السورة بالإنجليزي: <span className="text-white">{surah.name.en}</span></p>
                <p>مكان النزول: <span className="text-white">{surah.revelation_place.ar}</span></p>
                <p>عدد الآيات: <span className="text-white">{convertToArabicNumerals(surah.verses_count)}</span></p>
                <p>عدد الكلمات: <span className="text-white">{convertToArabicNumerals(surah.words_count)}</span></p>
                <p>عدد الحروف: <span className="text-white">{convertToArabicNumerals(surah.letters_count)}</span></p>
              </div>
            </div>
            
            {/* أزرار التنقل */}
            <div className="flex justify-center gap-4 mb-4">
              {prevSurah && (
                <Link href={`/quran/${prevSurah.number}`} className="bg-slate-700 hover:bg-slate-900 text-white px-4 py-2 rounded-lg transition-colors">
                  سورة {prevSurah.name.ar}
                </Link>
              )}
              {nextSurah && (
                <Link href={`/quran/${nextSurah.number}`} className="bg-slate-900 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
                  سورة {nextSurah.name.ar}
                </Link>
              )}
            </div>
            
            <div className="flex justify-center items-center gap-4 text-gray-300">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="flex items-center gap-1 text-muted/80 hover:text-blue-300"
              >
                {showTranslation ? <EyeOff size={16} /> : <Eye size={16} />}
                {showTranslation ? 'إخفاء الترجمة' : 'إظهار الترجمة'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* نتائج البحث */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-sky-200 mb-4 flex items-center gap-2">
              <BookOpen size={24} />
              نتائج البحث ({searchResults.length})
            </h2>
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div key={index} className="bg-zinc-800  rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex items-center  gap-2 mb-3 text-blue-400">
                    <span className="font-semibold">{result.surahName}</span>
                    <span>•</span>
                    <span>الآية {result.verseNumber}</span>
                    <span>•</span>
                    <span>الجزء {result.juz}</span>
                    <span>•</span>
                    <span>الصفحة {result.page}</span>
                  </div>
                  
                  <div className="text-right mb-4">
                    <p 
                      className="text-lg leading-relaxed text-green-100"
                      dangerouslySetInnerHTML={{ __html: result.highlightedText }}
                    />
                  </div>
                  
                  {showTranslation && (
                    <div className="text-left">
                      <p className="text-gray-300 italic border-t border-gray-700 pt-3">
                        {result.englishText}
                      </p>
                    </div>
                  )}
                  
                  {result.sajda && (
                    <div className="mt-3">
                      <span className=" text-sky-100 px-2 py-1 rounded text-sm">
                        سجدة
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* عرض السورة العادي (عندما لا يوجد بحث) */}
        {searchResults.length === 0 && (
          <div>
            {/* البسملة */}
            {prefaceText && (
              <div className="text-center mb-8 p-6 bg-gray-950/30 rounded-lg border border-gray-700">
                <p className="text-4xl md:py-6 text-sky-100 font-[700]">
                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ 
                </p>
              </div>
            )}

            {/* الآيات */}
            <div className="space-y-6">
              {surah.verses.slice(0, visibleCount).map((verse, index) => {
                const formattedText = `
"${verse.text.ar}"

🌐 ترجمة:

"${verse.text.en}"

🔖 — ${surah.name.ar}:${index + 1}`;

                return (
                  <div key={index} className="bg-[#555]/40 rounded-lg p-6 border border-gray-400 hover:border-gray-600 hover:bg-gray-950/30 transition-colors relative group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-slate-700/80 text-white px-3 py-1 rounded-full text-xl font-medium">
                        {convertToArabicNumerals(index + 1)}
                      </span>
                      <div className="text-lg text-muted/70">
                        الجزء {verse.juz} • الصفحة {verse.page}
                      </div>
                    </div>
                    
                    <div 
                      className="text-right mb-4 cursor-pointer hover:bg-zinc-700/30 p-2 rounded"
                      onClick={() => openTafseer(verse, index)}
                      title="اضغط لعرض التفسير"
                    >
                      <p className="text-xl leading-relaxed text-chart-4/95 md:text-3xl">
                        {verse.text.ar}
                      </p>
                      {showTranslation && (
                        <p className="text-gray-300 italic mt-3 pt-3 border-t border-gray-600">
                          {verse.text.en}
                        </p>
                      )}
                    </div>
                    
                    {/* أزرار الأكشن */}
                    <div className="flex gap-3 px-5 py-4 justify-center mt-4 opacity-20 group-hover:opacity-100 transition-opacity transition-colors">
                      <button
                        onClick={() => openTafseer(verse, index)}
                        className="flex rounded-md items-center gap-1 bg-gray-600 hover:bg-gray-800 text-white px-3 py-1 rounded text-md transition-colors"
                        title="عرض التفسير"
                      >
                        <MdMenuBook size={16} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(formattedText)}
                        className="flex items-center gap-1 bg-green-900/50 hover:bg-green-700 text-white px-3 py-1 rounded text-md transition-colors"
                        title="نسخ الآية"
                      >
                        <FaCopy size={14} />
                      </button>
                      <button
                        onClick={() => shareVerse(formattedText)}
                        className="flex items-center gap-1 bg-purple-900/50 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        title="مشاركة الآية"
                      >
                        <FaShareAlt size={14} />
                      </button>
                    </div>
                    
                    {verse.sajda && (
                      <div className="mt-4">
                        <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-sm">
                          سجدة
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* زر تحميل المزيد */}
            {visibleCount < surah.verses.length && (
              <div className="text-center mt-8">
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ExpandMoreIcon />}
                  onClick={() => setVisibleCount(c => Math.min(c + 10, surah.verses.length))}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    borderRadius: '25px',
                    padding: '10px 32px'
                  }}
                >
                  حمّل المزيد
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* الزر العائم */}
      <Box>
        <Button
          onClick={() => router.push('/quran-pages')}
          variant="contained"
          color="warning"
          sx={{
            position: 'fixed',
            bottom: '10px',
            right: '20px',
            zIndex: 9999,
            width: '15px', 
            height: '40px',
            fontSize: '16px !important',
            fontWeight: '900',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#0A094EFF',
              transform: 'translateY(-2px)',
            },
          }}
        >
          ↪
        </Button>
      </Box>
    </div>
    
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
    </>
  );
}

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), 'public', 'json', 'metadata.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const paths = data.map(surah => ({
    params: { surahId: `${surah.number}` },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const surahId = parseInt(params.surahId);

  const surahFilePath = path.join(process.cwd(), 'public', 'json', 'surah', `surah_${surahId}.json`);
  const metadataFilePath = path.join(process.cwd(), 'public', 'json', 'metadata.json');

  try {
    const surahData = JSON.parse(fs.readFileSync(surahFilePath, 'utf8'));
    const allSurahs = JSON.parse(fs.readFileSync(metadataFilePath, 'utf8'));

    const currentSurahIndex = allSurahs.findIndex(surah => surah.number === surahId);

    const prevSurah = allSurahs[currentSurahIndex - 1] || null;
    const nextSurah = allSurahs[currentSurahIndex + 1] || null;

    return {
      props: {
        surah: surahData || null,
        prevSurah,
        nextSurah,
        surahId: params.surahId
      },
    };
  } catch (error) {
    console.error("خطأ في قراءة البيانات:", error);
    return {
      props: {
        surah: null,
        prevSurah: null,
        nextSurah: null,
        surahId: params.surahId
      },
    };
  }
}