// src/pages/quran-pdf/index.jsx - صفحة المصحف PDF المحدثة
import React from 'react';
import Head from 'next/head';
import VerticalAccordion from '../../components/ui/Accordions/VerticalAccordion';
import { HoverImageLinks } from '../../components/ui/hover-image-links';

/**
 * صفحة المصحف PDF المحدثة
 * تعرض مجموعة من المصاحف المتاحة للتحميل
 */
const QuranPdfPage = () => {
  return (
    <>
      <Head>
        <title>تحميل المصاحف PDF | تطبيق القرآن الكريم</title>
        <meta name="description" content="تحميل مجموعة منوعة من المصاحف الشريفة بصيغة PDF عالية الجودة" />
      </Head>
      
      <div className="min-h-screen md:pb-20 pb-30 max-w-screen md:-pr-50  bg-black/80">
        <div className="container mx-auto">
          <div className="text-center mb-2">
            <h1 className="md:text-7xl text-4xl font-[700] text-chart-1/80 md:mb-10 pt-20 font-uthmanic">
              المكتبة الالكترونيه 
              </h1>
              <h1 className="md:text-7xl text-4xl font-[700] text-white/60 md:mb-10 md:py-1 font-uthmanic">
              وتحميل مجموعه من المصاحف المتنوعه
            </h1>
            <p className="text-white/60  md:text-4xl font-[700] md:pb-10 pb-5 text-xl">
             رابط تحميل PDF مباشر وبجوده عاليه مجموعة منتقاة من المصاحف المختلفة برويات معتمدة
            </p>
          </div>
          <div className="m-10">

          <VerticalAccordion />
          </div>
          
          {/* قسم الكتب الإسلامية */}
          <HoverImageLinks />
        </div>
      </div>
    </>
  );
};

export default QuranPdfPage;
