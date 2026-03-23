import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

/**
 * 🌍 Next.js Middleware للتوجيه التلقائي للغات
 * يقوم بتوجيه المستخدم للغة المناسبة بناءً على:
 * 1. اللغة في الـ URL (/ar/, /en/, etc.)
 * 2. لغة المتصفح (Accept-Language header)
 * 3. اللغة الافتراضية (العربية)
 */

export default createMiddleware({
  // قائمة اللغات المدعومة
  locales,
  
  // اللغة الافتراضية
  defaultLocale,
  
  // استراتيجية الـ URL:
  // 'as-needed' = اللغة الافتراضية بدون prefix (/page)
  // باقي اللغات مع prefix (/en/page, /tr/page)
  localePrefix: 'as-needed',
  
  // اكتشاف اللغة تلقائياً من المتصفح
  localeDetection: true
});

export const config = {
  // المسارات التي يجب أن يعمل عليها الـ middleware
  // يستثني: api routes, _next (Next.js internals), static files
  matcher: [
    // تطبيق على جميع المسارات
    '/((?!api|_next|_vercel|.*\\..*).*)',
    
    // تطبيق على الـ root
    '/',
    
    // تطبيق على routes مع locale prefix
    '/(ar|en|tr|hi|ur|ru|es|fr|de|it|pt|zh|ja|ko|id)/:path*'
  ]
};
