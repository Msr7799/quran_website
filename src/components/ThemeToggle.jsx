// src/components/ThemeToggle.jsx - مكون تبديل الثيم البسيط
import React, { useState, useEffect } from 'react';

const ThemeToggle = ({ className = "" }) => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // تحديد الثيم الحالي عند التحميل
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
  }, []);

  // تبديل الثيم
  const toggleTheme = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      const newTheme = !isDark;
      setIsDark(newTheme);
      
      // حفظ الإعداد
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      
      // تطبيق الثيم
      document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
      
      // إنهاء الأنيميشن
      setTimeout(() => setIsAnimating(false), 500);
    }, 100);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${isAnimating ? 'theme-switching' : ''} ${className}`}
      title={isDark ? 'التبديل للوضع النهاري' : 'التبديل للوضع الليلي'}
      aria-label={isDark ? 'التبديل للوضع النهاري' : 'التبديل للوضع الليلي'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
