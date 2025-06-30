import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

const CarouselContainer = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  borderRadius: '12px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
}));

const SlideCard = styled(Card)(({ theme }) => ({
  minWidth: '200px',
  margin: '0 8px',
  backgroundColor: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
  },
}));

const ArabicName = styled(Typography)(({ theme }) => ({
  fontFamily: 'Amiri, serif',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#fff',
  textAlign: 'center',
  marginBottom: '8px',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
}));

const Meaning = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: 'rgba(255,255,255,0.8)',
  textAlign: 'center',
  lineHeight: 1.4,
}));

const AsmaAllahCarousel = () => {
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true, 
      align: 'start',
      slidesToScroll: 1,
      containScroll: 'trimSnaps',
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  
  const [names, setNames] = useState([]);

  useEffect(() => {
    // أسماء الله الحسنى الـ 99
    const asmaAllah = [
      { name: 'الرَّحْمَنُ', meaning: 'الذي وسعت رحمته كل شيء' },
      { name: 'الرَّحِيمُ', meaning: 'الرحيم بعباده المؤمنين' },
      { name: 'الْمَلِكُ', meaning: 'المالك لكل شيء' },
      { name: 'الْقُدُّوسُ', meaning: 'المنزه عن كل عيب' },
      { name: 'السَّلاَمُ', meaning: 'السالم من كل آفة' },
      { name: 'الْمُؤْمِنُ', meaning: 'المؤمن لعباده' },
      { name: 'الْمُهَيْمِنُ', meaning: 'المسيطر على كل شيء' },
      { name: 'الْعَزِيزُ', meaning: 'القوي الغالب' },
      { name: 'الْجَبَّارُ', meaning: 'القاهر لكل شيء' },
      { name: 'الْمُتَكَبِّرُ', meaning: 'العظيم الكبير' },
      { name: 'الْخَالِقُ', meaning: 'خالق كل شيء' },
      { name: 'الْبَارِئُ', meaning: 'المبدع للخلق' },
      { name: 'الْمُصَوِّرُ', meaning: 'مصور كل شيء' },
      { name: 'الْغَفَّارُ', meaning: 'كثير المغفرة' },
      { name: 'الْقَهَّارُ', meaning: 'الغالب لكل شيء' },
      { name: 'الْوَهَّابُ', meaning: 'كثير العطاء' },
      { name: 'الرَّزَّاقُ', meaning: 'الرازق لجميع الخلق' },
      { name: 'الْفَتَّاحُ', meaning: 'الحاكم بين عباده' },
      { name: 'الْعَلِيمُ', meaning: 'العالم بكل شيء' },
      { name: 'الْقَابِضُ', meaning: 'القابض والباسط' },
      { name: 'الْبَاسِطُ', meaning: 'الموسع في الرزق' },
      { name: 'الْخَافِضُ', meaning: 'خافض أعدائه' },
      { name: 'الرَّافِعُ', meaning: 'رافع أوليائه' },
      { name: 'الْمُعِزُّ', meaning: 'معز من أطاعه' },
      { name: 'الْمُذِلُّ', meaning: 'مذل من عصاه' },
      { name: 'السَّمِيعُ', meaning: 'السامع لكل شيء' },
      { name: 'الْبَصِيرُ', meaning: 'المبصر لكل شيء' },
      { name: 'الْحَكَمُ', meaning: 'الحاكم العادل' },
      { name: 'الْعَدْلُ', meaning: 'العادل في أحكامه' },
      { name: 'اللَّطِيفُ', meaning: 'اللطيف بعباده' },
    ];
    
    setNames(asmaAllah);
  }, []);

  if (names.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
          جاري التحميل...
        </Typography>
      </Box>
    );
  }

  return (
    <CarouselContainer>
      <div ref={emblaRef}>
        <Box
          sx={{
            display: 'flex',
            gap: 0,
            py: 2,
            px: 1,
          }}
        >
          {names.map((item, index) => (
            <SlideCard key={index} elevation={0}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <ArabicName variant="h6">
                  {item.name}
                </ArabicName>
                <Meaning variant="body2">
                  {item.meaning}
                </Meaning>
              </CardContent>
            </SlideCard>
          ))}
        </Box>
      </div>
    </CarouselContainer>
  );
};

export default AsmaAllahCarousel;