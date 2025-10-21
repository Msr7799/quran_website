// src/components/AudioPlayer/tafseer_popup.js - نافذة منبثقة للتفسير

import React, { useState, useEffect, useCallback } from 'react';
import { LoaderOne } from '../ui/loader.tsx';
import { CopyButton } from '../ui/animate-ui/primitives/buttons/copy.tsx';

// مكون زر متحرك مخصص للتفسير
const AnimatedButton = ({ children, onClick, disabled, startIcon, sx, ...props }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative px-4 py-2 text-sm font-medium bg-transparent hover:bg-[#2a2a2a] text-white transition-all duration-300 rounded-lg border border-transparent hover:border-[#4fc3f7]/30 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      style={sx}
      {...props}
    >
      <span className="flex items-center gap-2">
        {startIcon && <span>{startIcon}</span>}
        <span>{children}</span>
      </span>
      
      {/* تأثير الحدود المتحركة */}
      <span className="absolute left-0 top-0 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent transition-all duration-300 group-hover:w-full" />
      <span className="absolute right-0 top-0 h-0 w-[1px] bg-gradient-to-b from-transparent via-[#4fc3f7] to-transparent transition-all delay-100 duration-300 group-hover:h-full" />
      <span className="absolute bottom-0 right-0 h-[1px] w-0 bg-gradient-to-l from-transparent via-[#4fc3f7] to-transparent transition-all delay-200 duration-300 group-hover:w-full" />
      <span className="absolute bottom-0 left-0 h-0 w-[1px] bg-gradient-to-t from-transparent via-[#4fc3f7] to-transparent transition-all delay-300 duration-300 group-hover:h-full" />
    </button>
  );
};
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  MenuBook as BookIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import convertToArabicNumerals from '../../utils/convertToArabicNumerals.js';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: '1px solid #333333'
  }
}));

const ArabicText = styled(Typography)(() => ({
  fontFamily: 'var(--font-family-arabic)',
  fontSize: '1.5rem',
  lineHeight: 1.8,
  textAlign: 'right',
  direction: 'rtl',
  color: '#ffffff',
  marginBottom: '16px',
  '@media (max-width: 600px)': {
    fontSize: '1.3rem',
    lineHeight: 1.7
  },
  '@media (min-width: 900px)': {
    fontSize: '1.7rem',
    lineHeight: 1.9
  }
}));

const TafseerText = styled(Typography)(() => ({
  fontFamily: 'var(--font-family-arabic)',
  fontSize: '1.2rem',
  lineHeight: 1.7,
  textAlign: 'right',
  direction: 'rtl',
  color: '#cccccc',
  backgroundColor: '#2a2a2a',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #444444',
  '@media (max-width: 600px)': {
    fontSize: '1.1rem',
    lineHeight: 1.6,
    padding: '16px'
  },
  '@media (min-width: 900px)': {
    fontSize: '1.4rem',
    lineHeight: 1.8,
    padding: '24px'
  }
}));

/**
 * نافذة منبثقة لعرض تفسير الآيات
 */
const TafseerPopup = ({
  open,
  onClose,
  ayahData,
  surahNumber,
  ayahNumber,
  ayahText = '',
  surahName = ''
}) => {
  // استخراج البيانات من ayahData إذا كان متوفراً
  const actualSurahNumber = ayahData?.surahNumber || surahNumber;
  const actualAyahNumber = ayahData?.ayahNumber || ayahNumber;
  const actualAyahText = ayahData?.ayahText || ayahText;
  const actualSurahName = ayahData?.surahName || surahName;
  const [tafseerData, setTafseerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);

  // تعريف دالة جلب التفسير أولاً
  const fetchTafseer = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // محاولة جلب التفسير من مصادر متعددة
      const sources = [
        {
          name: 'تفسير الجلالين',
          url: `http://api.quran-tafseer.com/tafseer/1/${actualSurahNumber}/${actualAyahNumber}`
        },
        {
          name: 'تفسير ابن كثير',
          url: `http://api.quran-tafseer.com/tafseer/2/${actualSurahNumber}/${actualAyahNumber}`
        },
        {
          name: 'تفسير السعدي',
          url: `http://api.quran-tafseer.com/tafseer/3/${actualSurahNumber}/${actualAyahNumber}`
        }
      ];

      const tafseerResults = [];
      
      for (const source of sources) {
        try {
          const response = await fetch(source.url);
          if (response.ok) {
            const data = await response.json();
            if (data.text) {
              tafseerResults.push({
                name: source.name,
                text: data.text
              });
            }
          }
        } catch (err) {
          console.warn(`Failed to fetch from ${source.name}:`, err);
        }
      }

      if (tafseerResults.length > 0) {
        setTafseerData(tafseerResults);
      } else {
        setError('لم يتم العثور على تفسير لهذه الآية');
      }
      
    } catch (err) {
      setError('خطأ في جلب التفسير');
      console.error('Tafseer fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [actualSurahNumber, actualAyahNumber]);

  // جلب بيانات التفسير
  useEffect(() => {
    if (open && actualSurahNumber && actualAyahNumber) {
      fetchTafseer();
    }
  }, [open, actualSurahNumber, actualAyahNumber, fetchTafseer]);

  // إضافة معالج للـ Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  const handleShare = async () => {
    const shareText = `
${actualSurahName} - الآية ${convertToArabicNumerals(actualAyahNumber)}
${actualAyahText}

${tafseerData?.[0]?.text || ''}
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${actualSurahName} - الآية ${convertToArabicNumerals(actualAyahNumber)}`,
          text: shareText
        });
      } catch (err) {
        console.log('Share cancelled:', err.message);
      }
    } else {
      // نسخ إلى الحافظة
      navigator.clipboard.writeText(shareText).then(() => {
        // يمكن إضافة إشعار هنا
      });
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // يمكن إضافة منطق حفظ الإشارة المرجعية هنا
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="tafseer-dialog-title"
    >
      <DialogTitle id="tafseer-dialog-title" sx={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #151515' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <BookIcon sx={{ color: 'var(--chart-10)' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#ffffff', 
                fontFamily: 'var(--font-family-arabic)',
                fontSize: { xs: '2rem', sm: '2rem', md: '2.4rem' }
              }}
            >
              تفسير {actualSurahName} - الآية {convertToArabicNumerals(actualAyahNumber)}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#ffffff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#343434', borderColor: '#262626' }}>
        {/* نص الآية */}
        {actualAyahText && (
          <Box mb={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Chip
                label="نص الآية"
                variant="outlined"
                sx={{ 
                  p: 2.5, 
                  color: 'var(--chart-10)', 
                  borderColor: 'var(--chart-4)',
                  backgroundColor: '#2a2a2a',
                  fontSize: '20px',
                }}
              />
              <CopyButton 
                content={actualAyahText}
                variant="outline" 
                size="sm"
                className="bg-[#262626] border-none shadow-[#000] hover:bg-[#262626] text-chart-4 shadow-sm  hover:text-chart-18" />
            </Box>
            <ArabicText>
              {actualAyahText}
            </ArabicText>
            <Divider sx={{ backgroundColor: '#7d7a7a' }} />
          </Box>
        )}

        {/* محتوى التفسير */}
        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <LoaderOne />
          </Box>
        )}

        {error && (
          <Box textAlign="center" py={4}>
            <Typography sx={{ 
              color: '#ff6b6b',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
            }}>{error}</Typography>
            <div style={{ marginTop: '16px' }}>
              <AnimatedButton 
                onClick={fetchTafseer}
                sx={{ 
                  color: '#4fc3f7',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
                }}
              >
                إعادة المحاولة
              </AnimatedButton>
            </div>
          </Box>
        )}

        {tafseerData && tafseerData.length > 0 && (
          <Box>
            {tafseerData.map((tafseer, index) => (
              <Box key={index} mb={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Chip 
                    label={tafseer.name} 
                    variant="outlined" 
                    sx={{ 
                      p: 2.5,
                      color: 'var(--chart-10)', 
                      borderColor: '#311111',
                      boxShadow:'0px 3px 3px #000',
                      backgroundColor: '#2a2a2a',
                      fontSize: '20px',
                    }}
                  />
                  <CopyButton 
                    content={`تفسير ${tafseer.name}:\n\n${tafseer.text}`}
                    variant="outline" 
                    size="sm"
                    className="bg-[#262626] border-none shadow-[#000] hover:bg-[#262626] text-chart-10 shadow-sm  hover:text-chart-18"
                  />
                </Box>
                <TafseerText>
                  {tafseer.text}
                </TafseerText>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ backgroundColor: '#311111', borderTop: '1px solid #333333', gap: 2 }}>
        <AnimatedButton
          onClick={handleBookmark}
          startIcon={<BookmarkIcon />}
          sx={{ 
            color: bookmarked ? 'var(--chart-3)' : '#cccccc',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
          }}
        >
          {bookmarked ? 'محفوظ' : 'حفظ'}
        </AnimatedButton>
        
        <AnimatedButton
          onClick={handleShare}
          startIcon={<ShareIcon />}
          disabled={!tafseerData}
          sx={{ 
            color: tafseerData ? '#cccccc' : '#666666',
            fontSize: { xs: '2rem', sm: '2rem', md: '2rem' }
          }}
        >
          
        </AnimatedButton>

        {/* زر نسخ كامل للآية والتفاسير */}
        {tafseerData && (
          <CopyButton 
            content={`${actualAyahText ? `${actualAyahText}\n\n` : ''}${tafseerData.map(t => `تفسير ${t.name}:\n${t.text}`).join('\n\n')}`}
            variant="outline" 
            size="sm"
            className="bg-[#000] border-[var(--chart-10)] hover:text-chart-18 hover:bg-[#262626] text-[var(--chart-10)]"
          />
        )}
      </DialogActions>
    </StyledDialog>
  );
};

export default TafseerPopup;
