import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

/**
 * 🌍 اللغات المدعومة في البرنامج
 * next-intl Configuration
 */

// قائمة جميع اللغات المدعومة
export const locales = [
  'ar', // 🇸🇦 العربية
  'en', // 🇬🇧 English
  'tr', // 🇹🇷 Türkçe
  'hi', // 🇮🇳 हिन्दी
  'ur', // 🇵🇰 اردو
  'ru', // 🇷🇺 Русский
  'es', // 🇪🇸 Español
  'fr', // 🇫🇷 Français
  'de', // 🇩🇪 Deutsch
  'it', // 🇮🇹 Italiano
  'pt', // 🇧🇷 Português
  'zh', // 🇨🇳 中文
  'ja', // 🇯🇵 日本語
  'ko', // 🇰🇷 한국어
  'id'  // 🇮🇩 Bahasa Indonesia
] as const;

// اللغة الافتراضية
export const defaultLocale = 'ar';

// معلومات اللغات (للـ UI)
export const languageNames = {
  ar: { native: 'العربية', english: 'Arabic', flag: '🇸🇦', dir: 'rtl' },
  en: { native: 'English', english: 'English', flag: '🇬🇧', dir: 'ltr' },
  tr: { native: 'Türkçe', english: 'Turkish', flag: '🇹🇷', dir: 'ltr' },
  hi: { native: 'हिन्दी', english: 'Hindi', flag: '🇮🇳', dir: 'ltr' },
  ur: { native: 'اردو', english: 'Urdu', flag: '🇵🇰', dir: 'rtl' },
  ru: { native: 'Русский', english: 'Russian', flag: '🇷🇺', dir: 'ltr' },
  es: { native: 'Español', english: 'Spanish', flag: '🇪🇸', dir: 'ltr' },
  fr: { native: 'Français', english: 'French', flag: '🇫🇷', dir: 'ltr' },
  de: { native: 'Deutsch', english: 'German', flag: '🇩🇪', dir: 'ltr' },
  it: { native: 'Italiano', english: 'Italian', flag: '🇮🇹', dir: 'ltr' },
  pt: { native: 'Português', english: 'Portuguese', flag: '🇧🇷', dir: 'ltr' },
  zh: { native: '中文', english: 'Chinese', flag: '🇨🇳', dir: 'ltr' },
  ja: { native: '日本語', english: 'Japanese', flag: '🇯🇵', dir: 'ltr' },
  ko: { native: '한국어', english: 'Korean', flag: '🇰🇷', dir: 'ltr' },
  id: { native: 'Bahasa Indonesia', english: 'Indonesian', flag: '🇮🇩', dir: 'ltr' }
} as const;

export default getRequestConfig(async ({ locale }) => {
  // التحقق من صحة اللغة
  if (!locales.includes(locale as any)) notFound();

  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
