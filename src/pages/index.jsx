// src/pages/index.jsx - الصفحة الرئيسية المحدثة والمحسّنة
import { useTheme } from "next-themes"
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Volume2, 
  FileText, 
  Radio, 
  Search, 
  Zap, 
  BookMarked, 
  Sparkles, 
  Book, 
  Mic, 
  ArrowLeft 
} from 'lucide-react';
import QuranLoader from '../components/QuranLoader';
import QuranSearchWidget from '../components/QuranSearchWidget';
import { ShineBorder } from '@/registry/magicui/shine-border';
import { WordRotate } from '@registry/magicui/word-rotate';
import { LightRays } from "@/registry/magicui/light-rays";
import dynamic from 'next/dynamic';
import { signIn } from 'next-auth/react';
import DrawOutlineButton from '../components/ui/animated-button';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

// تحميل SwipeCarousel ديناميكياً للشاشات الكبيرة فقط
const SwipeCarousel = dynamic(() => import('../components/SwipCarsouel').then(mod => mod.SwipeCarousel), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-[#22262d] flex items-center justify-center">
      <div className="text-white text-2xl font-uthmanic animate-pulse">جاري التحميل...</div>
    </div>
  )
});

/**
 * الصفحة الرئيسية المحدثة بتصميم احترافي داكن وكلاسيكي
 * تدعم التصميم المتجاوب مع تأثيرات Light Rays
 */
const HomePage = () => {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const theme = useTheme();

  // تأكد من تحميل المكون قبل العرض
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // تطبيق نظام الثيم
  useEffect(() => {
    if (mounted) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
    }

    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem('theme');
      if (currentTheme) {
        setIsDarkMode(currentTheme === 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const theme = document.documentElement.getAttribute('data-theme');
          setIsDarkMode(theme === 'dark');
        }
      });
    });

    if (mounted) {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
  }, [mounted]);

  // كشف حجم الشاشة
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // قائمة الصور للديسكتوب
  const desktopImages = [
    {
      src: 'alf.gif',
      alt: 'القرآن الكريم - التلاوة المباركة',
      title: 'تلاوة القرآن الكريم'
    },
    {
      src: 'img/hero1.png',
      alt: 'المصحف الشريف',
      title: 'المصحف الشريف'
    },
    {
      src: 'img/hero2.png',
      alt: 'الاستماع للقرآن',
      title: 'الاستماع للقرآن'
    },
    {
      src: 'img/hero3.png',
      alt: 'القرآن الكريم',
      title: 'كلام الله'
    },
    {
      src: 'img/hero4.png',
      alt: 'آيات القرآن',
      title: 'نور وهداية'
    },
    {
      src: 'img/hero5.png',
      alt: 'المصحف المبارك',
      title: 'الذكر الحكيم'
    },
    {
      src: 'img/hero6.png',
      alt: 'القرآن العظيم',
      title: 'الفرقان'
    },
    {
      src: 'img/hero7.png',
      alt: 'التلاوة المباركة',
      title: 'القرآن المجيد'
    }
  ];

  // قائمة الصور للهواتف
  const mobileImages = [
    { src: 'mobile-hero-1.gif', alt: 'quran-hero-mobile', title: 'اول صوره' },
    { src: 'mobile-hero-2.png', alt: 'المصحف الشريف', title: 'كتاب الله العزيز' },
    { src: 'mobile-hero-3.png', alt: 'آيات القرآن الكريم', title: 'نور وهداية' },
    { src: 'mobile-hero-4.png', alt: 'الخط العربي الإسلامي', title: 'القرآن العظيم' },
    { src: 'mobile-hero-5.png', alt: 'تلاوة القرآن', title: 'صوت الحق' },
    { src: 'mobile-hero-6.png', alt: 'المسجد النبوي', title: 'بيت الله الحرام' },
    { src: 'mobile-hero-7.png', alt: 'الدعاء والذكر', title: 'طمأنينة القلب' },
    { src: 'mobile-hero-8.png', alt: 'نور الإسلام', title: 'هداية ورحمة' },
    { src: 'mobile-hero-9.png', alt: 'المصحف والسبحة', title: 'عبادة وتسبيح' },
    { src: 'mobile-hero-1.gif', alt: 'القرآن الكريم - التلاوة المباركة', title: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ' }
  ];

  const heroImages = isMobile ? mobileImages : desktopImages;

  // إعادة تعيين الفهرس عند تغيير نوع الجهاز
  useEffect(() => {
    if (currentImageIndex >= heroImages.length) {
      setCurrentImageIndex(0);
    }
  }, [isMobile, heroImages.length, currentImageIndex]);

  // تبديل الصور تلقائياً
  useEffect(() => {
    if (!mounted || !heroImages.length) return;
    
    const currentImage = heroImages[currentImageIndex];
    const getDelay = () => {
      if (isMobile && currentImage?.src === 'mobile-hero-1.gif') {
        return 11000;
      }
      return 10000;
    };

    const timeout = setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, getDelay());

    return () => clearTimeout(timeout);
  }, [mounted, heroImages, currentImageIndex, isMobile]);

  // الميزات الرئيسية للموقع
  const features = [
    {
      icon: BookOpen,
      title: t('quran.browseQuran'),
      description: t('quran.browseQuranDesc'),
      href: '/quran-pages/1',
      color: '#2196F3'
    },
    {
      icon: Volume2,
      title: t('quran.audioQuran'),
      description: t('quran.audioQuranDesc'),
      href: '/quran-sound',
      color: '#FF9800'
    },
    {
      icon: FileText,
      title: t('quran.pdfQuran'),
      description: t('quran.pdfQuranDesc'),
      href: '/quran-pdf',
      color: '#F44336'
    },
    {
      icon: Radio,
      title: t('quran.liveRadio'),
      description: t('quran.liveRadioDesc'),
      href: '/live',
      color: '#E91E63'
    },
    {
      icon: Search,
      title: t('quran.searchQuran'),
      description: t('quran.searchQuranDesc'),
      href: '/search',
      color: '#9C27B0'
    },
    {
      icon: Zap,
      title: t('quran.apiDevelopers'),
      description: t('quran.apiDevelopersDesc'),
      href: 'https://msr-quran-data.vercel.app',
      color: '#607D8B'
    }
  ];

  // إحصائيات الموقع
  const stats = [
    { number: '114', label: t('homepage.stats.surahs'), icon: BookMarked },
    { number: '6236', label: t('homepage.stats.ayahs'), icon: Sparkles },
    { number: '30', label: t('homepage.stats.juz'), icon: Book },
    { number: '153', label: t('homepage.stats.reciters'), icon: Mic }
  ];

  return (
    <>
      <Head>
        <title>{t('homepage.title')}</title>
        <meta name="description" content={t('homepage.description')} />
        <meta name="keywords" content="القرآن الكريم, تلاوة القرآن, تصفح القرآن, استماع القرآن, القرآن الإلكتروني, القرآن الكريم الإلكتروني" />
      </Head> 

      <div className="w-full bg-gradient-to-b from-[#22262d] via-[#252526] to-[#22262d] dark:from-[#22262d] dark:via-[#252526] dark:to-[#22262d] min-h-screen transition-opacity duration-700 ease-in-out relative overflow-hidden" style={{
        opacity: mounted && !isLoading ? 1 : 0
      }}>
        {/* تأثير Light Rays في الخلفية */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <LightRays 
            count={12}
            color={isDarkMode ? "rgba(30, 144, 158, 0.08)" : "rgba(30, 144, 158, 0.12)"}
            blur={48}
            speed={18}
            length="85vh"
          />
        </div>

        {/* مبدل اللغة - في أعلى اليسار */}
        <div className="absolute top-4 left-4 z-[9999]">
          <LanguageSwitcher />
        </div>

        {/* البسملة في أعلى الموقع */}
        <div className="relative z-10 flex justify-center items-center py-4 sm:py-6 md:py-8 w-full mb-2 sm:mb-3 md:mb-4 rounded-lg border-2 border-[#565656]/30 bg-gradient-to-r from-[#252525]/80 via-[#252526]/80 to-[#252525]/80 backdrop-blur-sm shadow-2xl">          
          {mounted && (
            <Image
              src={isDarkMode ? "/basmalh-dark.svg" : "/basmalh-dark.svg"}
              alt="بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ"
              width={500}
              height={200}
              priority
              quality={95}
              className="drop-shadow-2xl w-[280px] sm:w-[350px] md:w-[400px] lg:w-[500px] h-auto"
              key={`basmala-${isDarkMode ? 'dark' : 'light'}`}
            />
          )}
        </div>

        {/* SwipeCarousel Hero للشاشات الكبيرة فقط */}
        <section className="hidden lg:block w-full h-screen relative z-10">
          <SwipeCarousel />
        </section>

        {/* Hero Section للهواتف والتابلت */}
        <section className="lg:hidden relative z-10 h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
          <div className="absolute inset-0 z-[1] w-full h-full">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {heroImages[currentImageIndex] && (
                <Image
                  src={heroImages[currentImageIndex].src.startsWith('/') ? heroImages[currentImageIndex].src : `/${heroImages[currentImageIndex].src}`}
                  alt={heroImages[currentImageIndex].alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={currentImageIndex === 0}
                  quality={90}
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#22262d]/90 via-[#252526]/50 to-transparent z-[2]"></div>
          </div>

          {/* مؤشرات الصور */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2 z-[4]">
            {heroImages.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-3 h-3 rounded-full border-2 border-[#565656]/80 transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-[#565656] scale-125 shadow-lg shadow-[#565656]/50' 
                    : 'bg-[#3e3e42]/60 hover:bg-[#3e3e42]/90'
                }`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`صورة ${index + 1}`}
                aria-pressed={index === currentImageIndex}
              />
            ))}
          </div>
        </section>

        {/* Navigation section */}
        <section className="relative z-10 lg:mt-48 flex justify-center items-center px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="relative p-4 sm:p-5 md:p-6 lg:p-8 text-center w-full max-w-6xl bg-gradient-to-br from-chart-17/90 via-chart-17/90 to-chart-17/90 rounded-xl sm:rounded-2xl backdrop-blur-xl border-2 border-[#565656]/30 shadow-2xl shadow-[#565656]/10">
            <ShineBorder 
              shineColor={theme.theme === "dark" ? "rgba(186, 187, 229, 0.4)" : "rgba(67, 85, 109, 0.6)"} 
              borderWidth={4}
              duration={15}
            />
            
            <WordRotate
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl px-2 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 lg:py-7 xl:py-8 font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f9f9f9] via-[#f9f9f9]/80 to-[#25344e]/20 drop-shadow-2xl"
              words={['القرآن الكريم', 'كتابٌ أُحكِمَت آياتُه', 'النور المبين', 'شفاءٌ للناس', 'القرآن المجيد', 'يهدي للحق', 'صُحُفٌ مُكَرَّمة', 'تنزيلٌ من رب العالمين']}
            />

            {/* شريط البحث في القرآن */}
            <div className="mb-4 sm:mb-6 md:mb-8 px-2 md:px-4">
              <QuranSearchWidget />
            </div>

            {/* زر تسجيل الدخول */}
            <div className="mb-4 sm:mb-6 md:mb-8 px-2 md:px-4 flex justify-center">
              <button 
                onClick={() => signIn('google')}
                className="transition-transform hover:scale-105 active:scale-95"
              >
                <Image 
                  src="/google-btn-muted.svg" 
                  alt="تسجيل الدخول بجوجل" 
                  width={179} 
                  height={46}
                  className="w-auto h-10 sm:h-12 md:h-14"
                />
              </button>
            </div>
            <div className="mb-4 sm:mb-6 flex flex-col arabic-font sm:flex-row lg:flex-row gap-3 sm:gap-4 md:gap-6 items-center justify-center">
              <DrawOutlineButton>{t('common.startBrowsing')}</DrawOutlineButton>
              
              <Link 
                href="/quran-reader?page=1" 
                className="group relative w-full arabic-font sm:w-auto px-4 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 text-base sm:text-lg md:text-xl font-bold rounded-lg sm:rounded-xl transition-all duration-300 bg-gradient-to-br from-[#4a5568] via-[#2d3748] to-[#1a202c] hover:from-[#5a6578] hover:via-[#4a5568] hover:to-[#2d3748] text-white shadow-2xl shadow-black/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:scale-105 hover:-translate-y-1 border border-[#606060]/30 hover:border-[#707070]/50 overflow-hidden"
              >
                <span>{t('quran.tafseerAyahByAyah')}</span>
                {/* TOP - الخط العلوي */}
                <span className="absolute left-0 top-0 h-[1px] w-0 border-t-2 border-white/60 transition-all duration-200 group-hover:w-full" />
                {/* RIGHT - الخط الأيمن */}
                <span className="absolute right-0 top-0 h-0 w-[1px] border-r-2 border-white/60 transition-all delay-100 duration-200 group-hover:h-full" />
                {/* BOTTOM - الخط السفلي */}
                <span className="absolute bottom-0 right-0 h-[1px] w-0 border-b-2 border-white/60 transition-all delay-200 duration-200 group-hover:w-full" />
                {/* LEFT - الخط الأيسر */}
                <span className="absolute bottom-0 left-0 h-0 w-[1px] border-l-2 border-white/60 transition-all delay-300 duration-200 group-hover:h-full" />
              </Link>
              
              <Link 
                href="/quran-sound" 
                className="group relative w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 text-base sm:text-lg md:text-xl font-bold rounded-lg sm:rounded-xl transition-all duration-300 bg-gradient-to-br from-[#4a5568] via-[#2d3748] to-[#1a202c] hover:from-[#5a6578] hover:via-[#4a5568] hover:to-[#2d3748] text-white shadow-2xl shadow-black/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:scale-105 hover:-translate-y-1 border border-[#606060]/30 hover:border-[#707070]/50 overflow-hidden"
              >
                <span>{t('common.listenNow')}</span>
                {/* TOP - الخط العلوي */}
                <span className="absolute left-0 top-0 h-[1px]  w-0 border-t-2 border-white/60 transition-all duration-200 group-hover:w-full" />
                {/* RIGHT - الخط الأيمن */}
                <span className="absolute right-0 top-0 h-0 w-[1px] border-r-2 border-white/60 transition-all delay-100 duration-200 group-hover:h-full" />
                {/* BOTTOM - الخط السفلي */}
                <span className="absolute bottom-0 right-0 h-[1px] w-0 border-b-2 border-white/60 transition-all delay-200 duration-200 group-hover:w-full" />
                {/* LEFT - الخط الأيسر */}
                <span className="absolute bottom-0 left-0 h-0 w-[1px] border-l-2 border-white/60 transition-all delay-300 duration-200 group-hover:h-full" />
              </Link>
            </div>
          </div>
        </section>

        {/* الإحصائيات */}
        <section className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div 
                    key={index} 
                    className="relative group"
                  >
                    <div className="relative bg-gradient-to-br from-[#252525]/80 via-[#252526]/80 to-[#22262d]/80 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border-2 border-[#3e3e42]/30 shadow-xl hover:shadow-2xl hover:shadow-[#565656]/20 ">
                      <ShineBorder
                        shineColor={["#565656", "#25344e", "#a28c8b"]}
                        borderWidth={1}
                        duration={12}
                      />
                      <div className="mb-3 sm:mb-4 text-chart-10 flex justify-center items-center group-hover:text-chart-20">
                        <IconComponent size={32} strokeWidth={1.5} className="sm:w-10 sm:h-10 md:w-12 md:h-12 drop-shadow-lg" />
                      </div>
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg">
                        {stat.number}
                      </div>
                      <div className="text-sm sm:text-base md:text-lg lg:text-xl text-[#cccccc]/80">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* الميزات الرئيسية */}
        <section className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl pb-3 sm:pb-4 md:pb-5 font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f9f9f9] via-[#f9f9f9] to-[#25344e] mb-3 sm:mb-4 drop-shadow-xl">
                {t('common.websiteFeatures')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-chart-10 max-w-2xl mx-auto px-4">
                {t('common.allServicesDescription')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                const isExternal = feature.href.startsWith('http');
                const LinkComponent = isExternal ? 'a' : Link;
                const linkProps = isExternal 
                  ? { href: feature.href, target: "_blank", rel: "noopener noreferrer" }
                  : { href: feature.href };

                return (
                  <LinkComponent 
                    key={index} 
                    {...linkProps}
                    className="group relative bg-gradient-to-br from-[#252525]/80 via-[#252526]/80 to-[#22262d]/80 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border-2 border-[#3e3e42]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_10px_20px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.1)] hover:shadow-2xl hover:shadow-[#565656]/20 transition-all duration-300 hover:scale-105 hover:border-[#565656]/40 no-underline overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#565656]/5 via-transparent to-[#25344e]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div 
                        className="mb-3 sm:mb-4 md:mb-6 flex justify-center items-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg mx-auto"
                        style={{ 
                          backgroundColor: `${feature.color}20`,
                          color: feature.color
                        }}
                      >
                        <IconComponent size={24} strokeWidth={1.5} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-white group-hover:text-chart-4 transition-colors text-center">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-chart-10 leading-relaxed text-center arabic-font">
                        {feature.description}
                      </p>
                      <div className="mt-3 sm:mt-4 md:mt-6 flex items-center justify-center text-[#565656] group-hover:text-chart-16 transition-all duration-300 group-hover:translate-x-[-8px] arabic-font">
                        <ArrowLeft size={16} strokeWidth={2} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        <span className="mr-2 font-semibold text-xs sm:text-sm md:text-base">{t('common.discoverMore')}</span>
                      </div>
                    </div>
                  </LinkComponent>
                );
              })}
            </div>
          </div>
        </section>

        {/* قسم الدعوة للعمل */}
        <section className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-[#565656]/20 via-[#262626]/20 to-[#525252]/20 backdrop-blur-sm border-y-5 border-[#565656]/30 shadow-xl">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text pb-3 sm:pb-4 bg-gradient-to-r from-[#f8f8f8] via-[#f9f9f9] to-[#565656] mb-4 sm:mb-5 md:mb-6 drop-shadow-xl">
              {t('common.startYourJourney')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#cccccc]/80 leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-4">
              {t('common.joinMillions')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center">
              <Link 
                href="/quran-pages/1" 
                className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 md:px-10 md:py-5 text-base sm:text-lg md:text-xl lg:text-2xl font-bold rounded-lg sm:rounded-xl transition-all duration-300 bg-gradient-to-r from-[#16697a]/50 to-[#16697a]/50 hover:from-[#1aa3b5] hover:to-[#1aa3b5]/50 text-white shadow-xl shadow-[#000]/50 hover:shadow-sm hover:shadow-[#f9f9f9]/20 hover:border-6 hover:border-[#535353] hover:scale-105 border-none"
              >
                {t('common.startNow')}
              </Link>
              <Link 
                href="/about" 
                className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 md:px-10 md:py-5 text-base sm:text-lg md:text-xl lg:text-2xl font-bold rounded-lg sm:rounded-xl transition-all duration-300 bg-transparent border-2 border-chart-10 bg-chart-17 text-chart-10 hover:bg-chart-17 shadow-lg hover:shadow-xl hover:scale-105"
              >
                {t('common.learnMore')}
              </Link>
            </div>
          </div>
        </section>

        {/* مساحة إضافية في الأسفل */}
        <div className="h-12 sm:h-16 md:h-20"></div>
      </div>

      {/* Loader overlay */}
      {(!mounted || isLoading) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#22262d] backdrop-blur-sm transition-opacity duration-500 ease-out" aria-hidden={!isLoading}>
          <QuranLoader
            size={80}
            text="مرحباً بك في موقع القرآن الكريم..."
            showText={true}
          />
        </div>
      )}
    </>
  );
};

export default HomePage;