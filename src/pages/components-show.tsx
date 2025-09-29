import { NextPage } from 'next';
import Head from 'next/head';
import ComponentsShow from '@/components/components-show';

const ComponentsShowPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>معرض مكونات الواجهة | تطبيق القرآن الكريم</title>
        <meta name="description" content="استكشف جميع مكونات الواجهة المتاحة في تطبيق القرآن الكريم - أزرار، نماذج، بطاقات وأكثر" />
        <meta name="keywords" content="مكونات واجهة، UI Components، React، Next.js، تطبيق القرآن" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="معرض مكونات الواجهة | تطبيق القرآن الكريم" />
        <meta property="og:description" content="استكشف جميع مكونات الواجهة المتاحة في التطبيق" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_SA" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="معرض مكونات الواجهة" />
        <meta name="twitter:description" content="استكشف مكونات الواجهة في تطبيق القرآن الكريم" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      
      <ComponentsShow />
    </>
  );
};

export default ComponentsShowPage;
