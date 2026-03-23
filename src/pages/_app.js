// src/pages/_app.js - النسخة الجديدة بدون theme folder
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/router';
import { NextIntlClientProvider } from 'next-intl';

// استيراد ملفات CSS الموحدة
import '../styles/variables.css';
import '../styles/globals.css';
import '../styles/loaders.css';


// استيراد المكونات
import AppAppBar from '../components/AppAppBar';
import Layout from '../components/Layout';
import Footer from '../components/FooterNew';
import AuthProvider from '../components/auth/AuthProvider';
import IslamicChatbot from '../components/IslamicChatbot';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Toaster } from 'sonner';

/**
 * المكون الأساسي للتطبيق
 * يستخدم النظام الجديد المعتمد على CSS المتغيرات
 * بدلاً من Material-UI theme
 * مع دعم 15 لغة عبر next-intl
 */
export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [messages, setMessages] = useState(pageProps.messages || null);
  
  // تحميل الترجمات عند تغيير اللغة
  useEffect(() => {
    const loadMessages = async () => {
      const locale = router.locale || 'ar';
      try {
        const loadedMessages = await import(`../messages/${locale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
        // Fallback to Arabic if loading fails
        if (locale !== 'ar') {
          const fallback = await import(`../messages/ar.json`);
          setMessages(fallback.default);
        }
      }
    };
    
    if (!pageProps.messages) {
      loadMessages();
    }
  }, [router.locale, pageProps.messages]);
  
  // إعداد الوضع المظلم عند تحميل التطبيق ومنع الوميض
  useEffect(() => {
    // إظهار المحتوى فوراً عند تحميل React
    const nextDiv = document.getElementById('__next');
    if (nextDiv) {
      nextDiv.classList.add('loaded');
    }

    // التحقق من الإعدادات المحفوظة أو تفضيلات النظام
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    // حفظ الإعداد إذا لم يكن محفوظاً
    if (!savedTheme) {
      localStorage.setItem('theme', theme);
    }
    
    // تعيين اتجاه النص (RTL/LTR) حسب اللغة
    const rtlLanguages = ['ar', 'ur'];
    const currentLocale = router.locale || 'ar';
    const direction = rtlLanguages.includes(currentLocale) ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', direction);
  }, [router.locale]);

  // عدم عرض المحتوى حتى تحميل الترجمات
  if (!messages) {
    return null;
  }

  return (
    <NextIntlClientProvider
      locale={router.locale || 'ar'}
      messages={messages}
      timeZone="Asia/Riyadh"
      onError={(error) => {
        // تجاهل أخطاء الترجمة المفقودة في Development
        if (process.env.NODE_ENV === 'development') {
          console.warn('next-intl warning:', error.message);
        }
      }}
    >
      <AuthProvider session={pageProps.session}>
      <ThemeProvider
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        <Head>
        {/* Meta tags للـ SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="description" content="موقع القرآن الكريم - اقرأ واستمع للقرآن الكريم بجودة عالية" />
        <meta name="keywords" content="القرآن الكريم، قراءة القرآن، الاستماع للقرآن، المصحف الشريف" />
        <meta name="description" content="موقع القرآن الكريم الإلكتروني - تلاوة، تصفح، واستماع القرآن الكريم بأصوات أشهر القراء مع تصميم جميل ومتجاوب" />
        <meta name="keywords" content="القرآن الكريم, تلاوة القرآن, تصفح المصحف, استماع القرآن, القراء, تفسير, إسلام, مسلمون, قرآن إلكتروني" />
        <meta name="author" content="mohamed alromaihi" />
        <meta name="creator" content="mohamed alromaihi" />
        <meta name="publisher" content="موقع القرآن الكريم" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="Arabic" />
        <meta name="geo.region" content="SA" />
        <meta name="geo.placename" content="Saudi Arabia" />
        
        {/* Open Graph محسن للشبكات الاجتماعية */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="القرآن الكريم - الموقع الإلكتروني" />
        <meta property="og:title" content="القرآن الكريم - الموقع الإلكتروني الشامل" />
        <meta property="og:description" content="موقع شامل لتلاوة وتصفح واستماع القرآن الكريم بأفضل جودة وأسهل طريقة مع تصميم عصري ومتجاوب" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="شعار موقع القرآن الكريم" />
        <meta property="og:locale" content="ar_SA" />
        <meta property="og:locale:alternate" content="ar_AR" />
        
        {/* Twitter Card محسن */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="القرآن الكريم - الموقع الإلكتروني" />
        <meta name="twitter:description" content="موقع شامل لتلاوة وتصفح واستماع القرآن الكريم" />
        <meta name="twitter:image" content="/logo.png" />
        <meta name="twitter:image:alt" content="شعار موقع القرآن الكريم" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "القرآن الكريم",
              "alternateName": "الموقع الإلكتروني للقرآن الكريم",
              "description": "موقع شامل لتلاوة وتصفح واستماع القرآن الكريم",
              "url": process.env.NEXT_PUBLIC_BASE_URL || "https://msr-quran-app.vercel.app",
              "inLanguage": "ar",
              "author": {
                "@type": "Person",
                "name": "mohamed alromaihi",
                "email": "alromaihi2224@gmail.com"
              },
              "publisher": {
                "@type": "Organization",
                "name": "موقع القرآن الكريم",
                "logo": {
                  "@type": "ImageObject",
                  "url": "/logo.png"
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "/search/{search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* رابط canonical */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </Head>

      {/* ضع الـ AppAppBar هنا ليكون دائماً فوق كل شيء */}
        
        {/* تأثيرات BorderBeam حول AppAppBar */}
        <AppAppBar /> 
    
      <div className="app-container">
        {/* المحتوى الرئيسي للتطبيق */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
        
        {/* التذييل */}
      <Footer />
      </div>

      {/* المساعد الإسلامي - يظهر في جميع الصفحات عدا صفحة الشات بوت */}
      {router.pathname !== '/chat-bot' && <IslamicChatbot />}

      {/* Toaster للإشعارات */}
      <Toaster 
        position="top-center"
        richColors
        closeButton
        duration={3000}
        toastOptions={{
          style: {
            fontFamily: "'Cairo', 'Amiri', sans-serif",
            direction: 'rtl',
            fontSize: '16px'
          }
        }}
      />
   
   
      {/* الأنماط العامة للتطبيق */}
      <style jsx>{`


        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--background-color);
          color: var(--text-primary);
          font-family: var(--font-family-primary);
          line-height: 1.6;
        }

        /* تحسين الأداء */
        .app-container {
          will-change: auto;
          contain: layout style paint;
        }

        /* تحسين للحركة المنخفضة */
        @media (prefers-reduced-motion: reduce) {
          .top-logo {
            transition: none !important;
          }

          .top-logo:hover {
            transform: none !important;
          }

          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }



        /* تحسين للطباعة */
        @media print {
          .app-container {
            background: white;
            color: black;
          }
        }

        /* تحسين للشاشات عالية الكثافة */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .app-container {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }
      `}</style>
      </ThemeProvider>
    </AuthProvider>
    </NextIntlClientProvider>
  );
}
