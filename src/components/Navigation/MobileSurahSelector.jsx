// src/components/Navigation/MobileSurahSelector.jsx - مكون اختيار السورة للموبايل
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Autocomplete,
  TextField
} from '@mui/material';
import { MenuBook } from '@mui/icons-material';

// استيراد البيانات
import surahsData from '../../../public/json/metadata.json';
import { getSurahPage } from '../../utils/surahPageMapping';

const MobileSurahSelector = ({ 
  onPageChange,
  isFullscreen = false
}) => {
  const router = useRouter();
  const [surahInput, setSurahInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // فحص حجم الشاشة بدلاً من useMediaQuery
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 960); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // إعداد قائمة السور للبحث
  const surahOptions = surahsData.map(surah => ({
    id: surah.number,
    label: surah.name.ar,
    transliteration: surah.name.transliteration,
    page: getSurahPage(surah.number)
  }));

  // دالة التنقل إلى صفحة معينة
  const navigateToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= 604) {
      if (onPageChange) {
        onPageChange(pageNumber);
      } else {
        router.push(`/quran-pages/${pageNumber}`);
      }
    }
  };

  // معالجة اختيار السورة
  const handleSurahSelect = (event, selectedSurah) => {
    if (selectedSurah) {
      const pageNumber = selectedSurah.page;
      navigateToPage(pageNumber);
      setSurahInput('');
    }
  };

  // معالجة تغيير نص البحث للسورة
  const handleSurahInputChange = (event, newValue) => {
    setSurahInput(newValue);
  };

  if (!isMobile || isFullscreen) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1100,
        width: '90%',
        maxWidth: '300px'
      }}
    >
      <div className="theme-paper" style={{ padding: '8px' }}>
        <Autocomplete
          options={surahOptions}
          getOptionLabel={(option) => option.label}
          onChange={handleSurahSelect}
          onInputChange={handleSurahInputChange}
          value={null}
          inputValue={surahInput}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="اختر السورة للانتقال إليها"
              variant="outlined"
              size="small"
              className="theme-input"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <MenuBook 
                    className="theme-icon"
                    style={{ marginRight: '8px', fontSize: '1.2rem' }}
                  />
                )
              }}
              style={{
                width: '100%'
              }}
            />
          )}
          renderOption={(props, option) => (
            <li
              {...props}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                backgroundColor: 'var(--theme-bg-paper)',
                color: 'var(--theme-text-primary)',
                borderBottom: '1px solid var(--theme-border)'
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>
                {option.label}
              </span>
              <span style={{ 
                fontSize: '0.8rem',
                color: 'var(--theme-text-secondary)',
                marginLeft: '8px'
              }}>
                صفحة {option.page}
              </span>
            </li>
          )}
          noOptionsText="لا توجد سور"
          clearOnEscape
          blurOnSelect
        />
      </div>
    </div>
  );
};

export default MobileSurahSelector;