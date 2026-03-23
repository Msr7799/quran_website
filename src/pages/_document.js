import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* === إعدادات الـ SEO الاحترافية === */}
        <meta name="description" content="تطبيق القرآن الكريم الشامل. استمع واقرأ وابحث في القرآن الكريم والأحاديث النبوية، مع ترجمات وتفاسير متعددة ومميزات متقدمة الذكاء الاصطناعي." />
        <meta name="keywords" content="القرآن الكريم, استماع القرآن, قراءة القرآن, القرآن اونلاين, تفسير القرآن, أحاديث نبوية, الذكاء الاصطناعي الإسلامي, quran, quran online, quran audio, islamic chatbot, quran translation" />
        <meta name="author" content="Mohamed Saud Alromaihi" />
        <meta name="robots" content="index, follow" />
        
        {/* === Open Graph (للمشاركة على واتساب، تويتر، فيسبوك) === */}
        <meta property="og:title" content="منصة القرآن الكريم الذكية" />
        <meta property="og:description" content="اقرأ واستمع للقرآن الكريم، وابحث في الأحاديث النبوية مع مساعد إسلامي ذكي." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://msr-quran-app.vercel.app/" />
        <meta property="og:image" content="https://msr-quran-app.vercel.app/logo.png" />
        
        {/* === Twitter Card === */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="القرآن الكريم الشامل" />
        <meta name="twitter:description" content="أفضل تجربة تفاعلية لقراءة واستماع القرآن الكريم." />
        <meta name="twitter:image" content="https://msr-quran-app.vercel.app/logo.png" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        
        {/* تحسين تحميل الخطوط */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;600;700&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Urdu:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />


        <link 
          href="https://fonts.googleapis.com/icon?family=Material+Icons" 
          rel="stylesheet" 
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* منع الوميض فوراً */
            html {
              background-color: #fafafa !important;
              transition: none !important;
            }
            body {
              background-color: #fafafa !important;
              margin: 0;
              padding: 0;
              transition: none !important;
            }
            /* إخفاء المحتوى حتى يتم تحميل React */
            #__next {
              opacity: 0;
              transition: opacity 0.3s ease-in-out;
            }
            #__next.loaded {
              opacity: 1;
            }
            /* fallback إذا لم يعمل JavaScript */
            noscript + #__next {
              opacity: 1 !important;
            }
            `,
          }}
        />
        <noscript>
          <style>
            {`#__next { opacity: 1 !important; }`}
          </style>
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // منع وميض الصفحة - محسن وآمن
            (function() {
              // تطبيق الخلفية بأمان
              function applyBackgroundSafely() {
                try {
                  if (document.documentElement) {
                    document.documentElement.style.backgroundColor = '#fafafa';
                  }
                  if (document.body) {
                    document.body.style.backgroundColor = '#fafafa';
                  }
                } catch (error) {
                  console.warn('خطأ في تطبيق الخلفية:', error);
                }
              }

              let loaded = false;

              function showContent() {
                if (!loaded) {
                  loaded = true;
                  try {
                    const nextDiv = document.getElementById('__next');
                    if (nextDiv) {
                      nextDiv.classList.add('loaded');
                    }
                  } catch (error) {
                    console.warn('خطأ في إظهار المحتوى:', error);
                  }
                }
              }

              // تطبيق الخلفية بأمان
              applyBackgroundSafely();

              // إعادة المحاولة عند تحميل DOM
              document.addEventListener('DOMContentLoaded', function() {
                applyBackgroundSafely();
                showContent();
              });

              // إظهار المحتوى عند تحميل React
              window.addEventListener('load', showContent);

              // backup timeout - إظهار المحتوى بعد 2 ثانية كحد أقصى
              setTimeout(showContent, 2000);

              // إظهار فوري إذا كان DOM جاهز
              if (document.readyState === 'complete') {
                setTimeout(function() {
                  applyBackgroundSafely();
                  showContent();
                }, 100);
              }
            })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
 
      </body>
    </Html>
  );
}
