import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import styles from '../styles/Quran.module.css';
import convertToArabicNumerals from '../utils/convertToArabicNumerals';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

// Dynamic imports with loading states
const SurahCardCarousel = dynamic(
  () => import('../components/SurahCard'),
  { loading: () => <div>تحميل البطاقات…</div> }
);

const QariAudioPlayer = dynamic(
  () => import('../components/QariAudioPlayer'),
  { ssr: true, loading: () => <div>تحميل مشغل الصوت…</div> }
);

const AsmaAllahCarousel = dynamic(
  () => import('../components/AsmaAllahCarousel'),
  { loading: () => <div>جاري تحميل أسماء الله الحسنى…</div> }
);

const HadithCarousel = dynamic(
  () => import('../components/HadithCarousel'),
  { loading: () => <div>جاري تحميل الأحاديث…</div> }
);

export async function getStaticProps() {
  const fs = require('fs');
  const path = require('path');

  try {
    const filePath = path.join(process.cwd(), 'public', 'json', 'metadata.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const initialSurahs = JSON.parse(fileContents);
    return { props: { initialSurahs, error: null } };
  } catch (err) {
    return { props: { initialSurahs: [], error: err.message } };
  }
}

export default function Home({ initialSurahs = [], error }) {
  const [visibleCount, setVisibleCount] = useState(12);

  const reciters = [
    { id: 'qari1', name: 'القارئ 1', audioUrl: '/audio/qari1.mp3' },
    { id: 'qari2', name: 'القارئ 2', audioUrl: '/audio/qari2.mp3' },
  ];

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, initialSurahs.length));
  };

  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.error}>حدث خطأ: {error}</div>
      </main>
    );
  }

  return (
    <>
      <SeoHead
        title="فهرس سور القرآن الكريم"
        description="تصفح السور مع تفاصيلها."
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/quran`}
        image={`${process.env.NEXT_PUBLIC_BASE_URL}/quran-image.jpg`}
      />


      {/* Hero Section - كامل العرض */}
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
        }}
      >
        {/* Hero Background */}
        <Box
          sx={{
            position: 'relative', 
            backgroundImage: 'url(./liner.svg)',
            height: '50vh',
            width: '100%',
            bottom: '10%',
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
            filter: 'contrast(1) brightness(0.9) drop-shadow(0 0 2px rgba(207, 193, 193, 0.356))',
            display: 'flex',
            alignItem: 'top',
            justifyContent: 'center',
          }}
        />

        {/* Decorative Section - كامل العرض */}
        <Box
          sx={{
            backgroundImage: 'url(/alf.gif)',
            height: '120vh',
            borderTop: '19px solid #000',
            borderBottom: '19px solid #000',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'contrast(1) brightness(0.9) drop-shadow(0 0 2px rgba(207, 193, 193, 0.356))'
          }}
        />

        {/* Logo Section */}
        <Box sx={{ 
          textAlign: 'center', 
          position: 'absolute',
          top: '50%',
          left: '50%',
          bottom: '100%',
          marginTop: '200px',
          transform: 'translate(-50%, -50%)',
          zIndex: 10
        }}>
          <img
            src="./aqra1.svg"
            alt="iqra"
            style={{
              maxWidth: '60vw',
              height: 'auto',
              filter: 'contrast(1.4) brightness(0.9) saturate(2) drop-shadow(10px 10px 50px rgba(0, 0, 0, 0.58))'
            }}
          />
        </Box>
      </Box>

      {/* المحتوى العادي مع Container */}




        {/* Hadith Carousel Section */}
        <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            الأحاديث الشريفة
          </Typography>
          
          <HadithCarousel />
        </Container>
      <main className={styles.main}>
        {/* Audio Player Section */}
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <QariAudioPlayer reciters={reciters} />
        </Container>

        {/* Surah Cards Section */}
        <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center', direction: 'rtl' }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            فهرس سور القرآن الكريم
          </Typography>
          <SurahCardCarousel surahs={initialSurahs} />
        </Container>

        {/* Asma Allah Carousel Section */}
        <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            أسماء الله الحسنى
          </Typography>
          
          {/* <AsmaAllahCarousel /> */}
          
        </Container>

      </main>
    </>
  );
}