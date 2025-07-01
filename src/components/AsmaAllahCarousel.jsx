import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Box, Typography, Card, CardContent, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const CarouselContainer = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  borderRadius: '12px',
  backgroundColor: 'var(--secondary-color)',
  border: '1px solid var(--border-color)',
  position: 'relative',
  width: '100%',
  maxWidth: '1000px',
  margin: '0 auto',
}));

const SlideCard = styled(Card)(({ theme }) => ({
  minWidth: '100%',
  width: '100%',
  margin: '0',
  backgroundColor: 'var(--card-bg-color)',
  backdropFilter: 'blur(10px)',
  border: '2px solid var(--border-color)',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  boxShadow: 'var(--card-shadow)',
  '&:hover': {
    backgroundColor: 'var(--button-hover-bg-color)',
    color: 'var(--button-hover-text-color)',
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
  },
}));

const ArabicName = styled(Typography)(({ theme }) => ({
  fontFamily: 'Amiri, serif',
  fontSize: '2rem',
  fontWeight: 'bold',
  color: 'var(--primary-color)',
  textAlign: 'center',
  marginBottom: '12px',
  textShadow: '0 2px 4px rgba(0,0,0,0.15)',
}));

const Meaning = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  textAlign: 'center',
  lineHeight: 1.5,
  fontWeight: 'medium',
  color: 'var(--text-color-2)',
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'var(--button-bg-color)',
  color: 'var(--button-text-color)',
  '&:hover': {
    backgroundColor: 'var(--button-hover-bg-color)',
    color: 'var(--button-hover-text-color)',
  },
  width: '40px',
  height: '40px',
  margin: '0 8px',
}));

const DotsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '12px',
}));

const Dot = styled(Box)(({ theme }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: 'var(--border-color)',
  margin: '0 4px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  transform: 'scale(1)',
  '&[data-active="true"]': {
    backgroundColor: 'var(--primary-color)',
    transform: 'scale(1.2)',
  },
}));

const AsmaAllahCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      slidesToScroll: 1,
      containScroll: false,
      draggable: true,
      direction: 'rtl'
    },
    [Autoplay({ delay: 7000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  
  const [names, setNames] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  
  const scrollTo = useCallback((index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);
  
  // Update selected index when slide changes
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    onSelect(); // Call once initially
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

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
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
          <NavigationButton onClick={scrollPrev} aria-label="السابق">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </NavigationButton>
        </Box>
        
        <div className="embla__viewport" ref={emblaRef}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              py: 2,
              px: 1,
            }}
            className="embla__container"
          >
            {names.map((item, index) => (
              <Box
                key={index}
                sx={{
                  flex: '0 0 100%',
                  minWidth: '100%',
                  maxWidth: '100%',
                  padding: '0.5rem',
                  position: 'relative'
                }}
                className="embla__slide"
              >
                <SlideCard elevation={0}>
                  <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                    <ArabicName variant="h5">
                      {item.name}
                    </ArabicName>
                    <Meaning variant="body1">
                      {item.meaning}
                    </Meaning>
                  </CardContent>
                </SlideCard>
              </Box>
            ))}
          </Box>
        </div>
        
        <Box sx={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
          <NavigationButton onClick={scrollNext} aria-label="التالي">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </NavigationButton>
        </Box>
      </Box>
      
      <DotsContainer>
        {names.map((_, index) => (
          <Dot
            key={index}
            data-active={index === selectedIndex}
            onClick={() => scrollTo(index)}
            aria-label={`انتقل إلى الاسم ${index + 1}`}
          />
        ))}
      </DotsContainer>
    </CarouselContainer>
  );
};

export default AsmaAllahCarousel;