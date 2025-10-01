// src/pages/index.jsx - الصفحة الرئيسية المحدثة
import { useTheme } from "next-themes"
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';// استيراد انتقائي لتحسين الأداء
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
import { WordRotate } from  '@registry/magicui/word-rotate';
import dynamic from 'next/dynamic';
import LoginButton from '../components/auth/LoginButton';

// تحميل SwipeCarousel ديناميكياً للشاشات الكبيرة فقط (مخفي في الشاشات الصغيرة)
const SwipeCarousel = dynamic(() => import('../components/SwipCarsouel').then(mod => mod.SwipeCarousel), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-2xl font-uthmanic animate-pulse">جاري التحميل...</div>
    </div>
  )
});
/**
 * الصفحة الرئيسية المحدثة باستخدام النظام الجديد
 * تدعم التصميم المتجاوب وتستخدم CSS المتغيرات
 */
const HomePage = () => {
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  // حالة AppAppBar للتحكم بالقائمة الجانبية - تم إزالة المتغيرات غير المستخدمة

  // تأكد من تحميل المكون قبل العرض
  useEffect(() => {
    setMounted(true);

    // إخفاء loader بعد تحميل الصفحة
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // تطبيق نفس نظام الثيم المستخدم في AppAppBar.jsx
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

    // متابعة تغييرات الثيم من localStorage
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem('theme');
      if (currentTheme) {
        setIsDarkMode(currentTheme === 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // متابعة تغييرات data-theme attribute
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
  const [isMobile, setIsMobile] = useState(false);

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
      src: 'img/hero.png',
      alt: 'الاستماع للقرآن',
      title: 'الاستماع للقرآن'
    }
  ];

  // قائمة الصور للهواتف
  const mobileImages = [
    {
    src: 'mobile-hero-1.gif',
    alt: 'quran-hero-mobile',
    title: 'اول صوره'

    },
    {
      src: 'mobile-hero-2.png',
      alt: 'المصحف الشريف',
      title: 'كتاب الله العزيز'
    },
    {
      src: 'mobile-hero-3.png',
      alt: 'آيات القرآن الكريم',
      title: 'نور وهداية'
    },
    {
      src: 'mobile-hero-4.png',
      alt: 'الخط العربي الإسلامي',
      title:'القرآن العظيم'
    },
    {
      src: 'mobile-hero-5.png',
      alt: 'تلاوة القرآن',
      title: 'صوت الحق'
    },
    {
      src: 'mobile-hero-6.png',
      alt: 'المسجد النبوي',
      title: 'بيت الله الحرام'
    },
    {
      src: 'mobile-hero-7.png',
      alt: 'الدعاء والذكر',
      title: 'طمأنينة القلب'
    },
    {
      src: 'mobile-hero-8.png',
      alt: 'نور الإسلام',
      title: 'هداية ورحمة'
    },
    {
      src: 'mobile-hero-9.png',
      alt: 'المصحف والسبحة',
      title: 'عبادة وتسبيح'
    },
    {
      src: 'mobile-hero-1.gif',
      alt: 'القرآن الكريم - التلاوة المباركة',
      title: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ'
    }
  ];

  // اختيار الصور حسب نوع الجهاز
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
    
    // تحديد المدة الزمنية حسب نوع الصورة
    const getDelay = () => {
      // إذا كانت الصورة الحالية هي GIF (آخر صورة في قائمة الهاتف)
      if (isMobile && currentImage?.src === 'mobile-hero-1.gif') {
        return 11000; // 10 ثوان + ثانية إضافية
      }
      return 10000; // المدة العادية
    };

    const timeout = setTimeout(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, getDelay());

    return () => clearTimeout(timeout);
  }, [mounted, heroImages, currentImageIndex, isMobile]);

  // الميزات الرئيسية للموقع
  const features = [
    {
      icon: BookOpen,
      title: 'تصفح المصحف',
      description: 'تصفح القرآن الكريم صفحة بصفحة بتصميم جميل وواضح',
      href: '/quran-pages/1',
      color: '#34495e'
    },
    {
      icon: Volume2,
      title: 'الصوتيات',
      description: 'استمع للقرآن الكريم بأصوات أشهر القراء',
      href: '/quran-sound',
      color: '#27ae60'
    },
    {
      icon: FileText,
      title: 'المصحف PDF',
      description: 'حمل المصحف الشريف بصيغة PDF لتصفحه في أي وقت',
      href: '/quran-pdf',
      color: '#f39c12'
    },
    {
      icon: Radio,
      title: 'الإذاعة المباشرة',
      description: 'استمع للبث المباشر من إذاعة القرآن الكريم',
      href: '/live',
      color: '#e74c3c'
    },
    {
      icon: Search,
      title: 'البحث في القرآن',
      description: 'ابحث في آيات القرآن الكريم بسهولة ويسر',
      href: '/search',
      color: '#3498db'
    },
    {
      icon: Zap,
      title: 'API للمطورين',
      description: 'استخدم API القرآن الكريم في تطبيقاتك',
      href: 'https://msr-quran-data.vercel.app',
      color: '#9b59b6'
    }
  ];

  // إحصائيات الموقع
  const stats = [
    { number: '114', label: 'سورة', icon: BookMarked },
    { number: '6236', label: 'آية', icon: Sparkles },
    { number: '30', label: 'جزء', icon: Book },
    { number: '153', label: 'قارئ', icon: Mic }
  ];
  const theme = useTheme()


  // لا نعرض loader كـ early return لحل مشكلة SSR

  return (
    <>
      <Head>
        <title>القرآن الكريم - القرآن الإلكتروني</title>
        <meta name="description" content="موقع شامل لتلاوة وتصفح واستماع القرآن الكريم بأفضل جودة وأسهل طريقة." />
        <meta name="keywords" content="القرآن الكريم, تلاوة القرآن, تصفح القرآن, استماع القرآن, القرآن الإلكتروني, القرآن الكريم الإلكتروني" />
      </Head> 

      <div className="w-full bg-[var(--sidebar-primary)] min-h-screen  transition-opacity duration-700 ease-in-out" style={{
        opacity: mounted && !isLoading ? 1 : 0
      }}>
        {/* البسملة في أعلى الموقع */}
        <div className="flex justify-center mb-15 items-center py-5 w-full  mb-0 rounded-[10px] relative -bottom-10 border-[3px] border-solid border-[var(--muted-foreground)]/50">          
           {mounted && (
            <Image
              src={isDarkMode ? "/basmalh-dark.svg" : "/basmalh-dark.svg"}
              alt="بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ"
              width={500}
              height={200}
              priority
              quality={95}
              key={`basmala-${isDarkMode ? 'dark' : 'light'}`}
              onLoad={() => {
              }}
              onError={(e) => {
                console.log('خطأ في تحميل البسملة:', e.target.src);
              }}
            />
          )}
          
          {/* عرض معلومات الثيم للفحص */}
          {process.env.NODE_ENV === 'development' && mounted && (
            <div style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              background: 'rgba(0,0,0,0.8)', 
              color: 'white', 
              padding: '5px', 
              fontSize: '12px',
              borderRadius: '5px',
              zIndex: 1000
            }}>
            </div>
          )}
        </div>

        {/* SwipeCarousel Hero للشاشات الكبيرة فقط - مخفي في الشاشات الصغيرة */}
        <section className="hidden lg:block w-full h-screen relative ">
          <SwipeCarousel />
          
        </section>

        {/* Hero Section العادي للهواتف والتابلت */}
        <section className="lg:hidden relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden will-change-transform contain-layout-style-paint">
          <div className="absolute inset-0 z-[1] w-full h-full">
            <div className="absolute inset-0 w-full h-full overflow-hidden will-change-transform">
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
            <div className="absolute inset-0 bg-transparent z-[2]"></div>
          </div>

          {/* مؤشرات الصور */}
          <div className="absolute bottom-[3rem] left-1/2 transform -translate-x-1/2 flex gap-[0.5rem] z-[4]">
            {heroImages.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-3 h-3 rounded-full border-2 border-white bg-white/90 cursor-pointer transition-all duration-300 ${index === currentImageIndex ? 'bg-white' : 'hover:bg-white/70'}`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`صورة ${index + 1}`}
                aria-pressed={index === currentImageIndex}
              />
            ))}
          </div>
        </section>

{/* Navigation section — تصحيح الفتح والإغلاق */}
<section className="md:mt-80 justify-center items-center ">
  <div className="relative p-6 z-[3] text-center text-card/90 bg-black/50 rounded-2xl backdrop-blur-[15px] border border-[var(--muted-foreground)]/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)]  md:right-50 md:left-50 md:max-w-[calc(80vw-40px)] sm:max-w-[calc(80vw-30px)]  mb-4 sm:p-4">
  <ShineBorder shineColor={theme.theme === "dark" ? "white" : "black"} />  
  <WordRotate
      className="md:text-6xl text-2xl px-6 md:mb-6 font-semibold  [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] "
      words={['القرآن الكريم', 'كتاب أٌحكمت آياته', 'النور المبين', 'شفاءُ للناس', 'القرآن المجيد', 'يهدي للحق' , 'صحفٍٍ مكرمة', 'تنزيلٌ من رب العالمين']}
    />

    {/* شريط البحث في القرآن */}
    <div className="mb-8 px-4">
      <QuranSearchWidget />
    </div>

    {/* زر تسجيل الدخول */}
    <div className="mb-6 px-4">
      <LoginButton />
    </div>

    <div className="flex gap-3 sm:mt-7 md:gap-4 md:flex-col mt-5 items-center sm:flex-col sm:gap-2 justify-center flex-wrap">
      <Link href="/quran-pages/1" className=" md:mb-3 overflow-hidden  md:ml-10 text-center px-5 py-3 md:py-3 md:px-6 md:w-[200px] sm:py-3 sm:w-full border-2 border-chart-4/20 text-lg md:text-2xl font-semibold rounded-lg transition-all duration-400 no-underline bg-transparent text-white/60  hover:bg-[var(--chart-4)]/10 hover:text-[var(--muted-foreground)]/50 hover:text-white hover:translate-y-[-2px] shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)]">
        ابدأ التصفح
      </Link>
      <Link href="/quran-sound" className="relative  md:mb-3 overflow-hidden  md:ml-10 items-center px-5 py-3 md:py-2 md:px-4 md:w-[200px] sm:py-3 sm:w-full text-lg md:text-2xl font-semibold rounded-lg transition-all duration-500 no-underline bg-transparent text-[var(--muted-foreground)]/50 border hover:border-[var(--chart-3)] hover:bg-[var(--chart-3)]/15 hover:text-white hover:translate-y-[-2px] shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)]">
        استمع الآن
      </Link>
    </div>
  </div>

</section>


        {/* الإحصائيات */}
        <section className="md:py-15 mt-4 bg-[var(--muted)]/20 justfy-center">

  
          <div className="sm:max-w-2xl md:max-w-6xl px-5 py-5 md:min-w-2xl items-center justify-center">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10 md:grid-cols-2 sm:grid-cols-1 md:gap-4 rounded-xl transition-all duration-400 ">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="relative text-center px-8 py-8 md:px-4 bg-[var(--sidebar-primary)]/20 rounded-xl border-[2px] border-[var(--muted-foreground)]/10 shadow-[var(--shadow-md)] transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[var(--shadow-lg)] group">
                    <ShineBorder
                     shineColor={[ "#aec6ff"]}
                     borderWidth= "1"
                     duration= "11"

                     />
                    <div className="mb-4 text-[var(--chart-4)] flex justify-center items-center transition-all duration-300 group-hover:scale-[1.2] group-hover:text-[var(--primary-dark)]">
                      <IconComponent size={40} strokeWidth={1.5} />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-[var(--muted)] mb-2">{stat.number}</div>
                    <div className="text-xl md:text-base text-[var(--text-secondary)]">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
         </section>

        {/* الميزات الرئيسية */}
        <section className="py-16 bg-[var(--background-color)]">
          <div className="max-w-6xl mx-auto px-6 md:px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-2xl font-bold text-[var(--text-primary)] mb-4">ميزات الموقع</h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                اكتشف جميع الخدمات التي يوفرها موقع القرآن الكريم
              </p>
            </div>
            
            <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-8 md:grid-cols-1 md:gap-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return feature.href.startsWith('http') ? (
                  <a key={index} href={feature.href} target="_blank" rel="noopener noreferrer" className="bg-[var(--background-paper)] rounded-xl p-8 md:p-6 no-underline text-white transition-all duration-300 border border-[var(--border-color)] relative overflow-hidden group hover:translate-y-[-8px] hover:shadow-[var(--shadow-2xl)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-[var(--primary-color)] before:to-[var(--primary-light)] before:transform before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100">
                    <div className="mb-4 flex justify-center items-center w-20 h-20 bg-white/10 rounded-xl transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110" style={{ color: feature.color }}>
                      <IconComponent size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl text-accent font-semibold mb-4">{feature.title}</h3>
                    <p className="text-3xl text-space/70 text-chart-4/70 text-shadow-[0px_2px_2px_rgba(221,255,255,.08)] leading-relaxed mb-6">{feature.description}</p>
                    <div className="absolute bottom-6 left-6 text-[var(--primary-color)] transition-all duration-300 flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(52,73,94,0.1)] group-hover:translate-x-[-4px] group-hover:bg-[rgba(52,73,94,0.2)]">
                      <ArrowLeft size={20} strokeWidth={2} />
                    </div>
                  </a>
                ) : (
                  <Link key={index} href={feature.href} className="bg-neutral-900 rounded-xl p-8 md:p-6 no-underline text-[var(--text-primary)] transition-all duration-300 border border-[var(--muted-foreground)] relative overflow-hidden group hover:translate-y-[-8px] hover:shadow-[var(--shadow-2xl)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-[var(--primary-color)] before:to-[var(--primary-light)] before:transform before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100">
                    <div className="mb-4 flex justify-center items-center w-20 h-20 bg-white/10 rounded-xl transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110" style={{ color: feature.color }}>
                      <IconComponent size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl text-space/70 text-accent font-semibold mb-4">{feature.title}</h3>
                    <p className="text-3xl text-chart-4/70 leading-relaxed mb-6">{feature.description}</p>
                    <div className="absolute bottom-6 left-6 text-[var(--muted-foreground)] transition-all duration-300 flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(52,73,94,0.1)] group-hover:translate-x-[-4px] group-hover:bg-[rgba(52,73,94,0.2)]">
                      <ArrowLeft size={20} strokeWidth={2} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* قسم الدعوة للعمل */}
        <section className="py-16 bg-gradient-to-br from-[var(--secondary-color)] to-[var(--secondary-dark)] text-white">
          <div className="max-w-6xl mx-auto px-6 md:px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-2xl font-bold mb-4">ابدأ رحلتك مع القرآن الكريم</h2>
              <p className="text-lg leading-relaxed mb-8 opacity-90">
                انضم إلى الملايين الذين يستخدمون موقعنا لتلاوة وتصفح القرآن الكريم
              </p>
              <div className="flex gap-4 justify-center flex-wrap md:flex-col md:items-center">
                <Link href="/quran-pages/1" className="inline-flex items-center px-8 py-4 md:py-3 text-xl md:text-xl bg-chart-3 font-semibold rounded-xl transition-all duration-300 no-underline shadow-[var(--shadow-lg)] hover:translate-y-[-2px] hover:shadow-[var(--shadow-xl)] bg-[var(--primary-color)] text-white border-none hover:bg-[var(--primary-dark)] hover:text-rose-500 md:w-full md:max-w-72 md:justify-center">
                  ابدأ الآن
                </Link>
                <Link href="/about" className="inline-flex items-center px-8 py-4 md:py-3 text-lg text-muted-foreground font-semibold rounded-xl transition-all duration-300 no-underline shadow-[var(--shadow-lg)] hover:translate-y-[-2px] hover:shadow-[var(--shadow-xl)] bg-transparent text-[var(--primary-color)] border-2 border-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white md:w-full md:max-w-72 md:justify-center">
                  اعرف المزيد
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Loader overlay لحل مشكلة SSR */}
      {(!mounted || isLoading) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(250,250,250,0.95)] backdrop-blur-[4px] transition-opacity duration-500 ease-out" aria-hidden={!isLoading}>
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