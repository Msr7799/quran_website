import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { languageNames } from '../i18n';

/**
 * 🌍 Language Switcher Component
 * مكون تغيير اللغة - يظهر في الزاوية اليمنى العليا
 */

const LanguageSwitcher = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLocale = router.locale || 'ar';
  const currentLang = languageNames[currentLocale as keyof typeof languageNames];

  const handleLanguageChange = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      {/* زر تبديل اللغة الدائري */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[var(--chart-17)] to-[var(--chart-21)] border-2 border-[var(--chart-6)]/30 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* خلفية متحركة */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* العلم والكود */}
        <div className="relative flex flex-col items-center justify-center">
          <span className="text-2xl mb-0.5">{currentLang.flag}</span>
          <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">
            {currentLocale}
          </span>
        </div>

        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-chart-3"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.button>

      {/* قائمة اللغات المنسدلة */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 left-0 w-72 max-h-[500px] overflow-y-auto bg-[#1a1a1a] border-2 border-[var(--chart-6)]/30 rounded-2xl shadow-2xl"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
              }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[var(--chart-17)] to-[var(--chart-21)] px-4 py-3 border-b border-[var(--chart-6)]/30">
                <h3 className="text-white font-bold text-sm flex items-center gap-2 arabic-font">
                  <span>🌍</span>
                  <span>اختر اللغة / Select Language</span>
                </h3>
              </div>

              {/* Languages List */}
              <div className="p-2">
                {Object.entries(languageNames).map(([code, lang]) => (
                  <motion.button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      currentLocale === code
                        ? 'bg-gradient-to-r from-[var(--chart-3)]/20 to-[var(--chart-3)]/10 border-2 border-[var(--chart-3)]/50'
                        : 'hover:bg-[#2a2a2a] border-2 border-transparent'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* العلم */}
                    <span className="text-3xl flex-shrink-0">{lang.flag}</span>

                    {/* معلومات اللغة */}
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-white text-sm">
                        {lang.native}
                      </div>
                      <div className="text-xs text-gray-400">
                        {lang.english}
                      </div>
                    </div>

                    {/* علامة الاختيار */}
                    {currentLocale === code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--chart-3)] flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}

                    {/* Arrow on hover */}
                    {currentLocale !== code && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="flex-shrink-0 text-[var(--chart-3)]"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-[#1a1a1a] border-t border-[var(--chart-6)]/30 px-4 py-2">
                <p className="text-xs text-center text-gray-500 arabic-font">
                  ✨ 15 لغة متاحة • Powered by next-intl
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
