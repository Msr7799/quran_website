import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    images: {
      unoptimized: true,
    },
    poweredByHeader: false,
    productionBrowserSourceMaps: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: false,
    },
    // إعدادات i18n للغات المدعومة
    i18n: {
      locales: ['ar', 'en', 'tr', 'hi', 'ur', 'ru', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'id'],
      defaultLocale: 'ar',
      localeDetection: true,
    },
  };
  
  export default withNextIntl(nextConfig);