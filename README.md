# 🕌 تطبيق القرآن الكريم

<div align="center">


![موقع القرآن الكريم](site-pic2.png)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://msr-quran-app.vercel.app)

</div>

[![Read in English](https://img.shields.io/badge/Read%20in-English-blue?style=for-the-badge&logo=googletranslate&logoColor=white)](README-ENG.md)

## 📖 نظرة عامة

تطبيق ويب شامل لقراءة وتصفح القرآن الكريم مع ميزات متقدمة للتفاعل والاستماع. يوفر التطبيق تجربة مستخدم متميزة مع دعم كامل للغة العربية والوضع المظلم.

## ✨ الميزات الرئيسية

### 📚 تصفح القرآن
- **عرض المصحف بصيغة SVG** مع إمكانية التكبير والتصغير
- **تصفح بالصفحات** مع تنقل سلس بين الصفحات
- **عرض السور** مع جميع الآيات والتفسير
- **بحث متقدم** في النصوص والسور

### 🎵 الصوتيات والتلاوة
- **158+ قارئ** من أشهر قراء العالم الإسلامي
- **تزامن دقيق** للآيات مع الصوت (19 قارئ)
- **تظليل الآيات** أثناء التلاوة
- **تحكم كامل** في التشغيل والإيقاف

### 🎨 واجهة المستخدم
- **تصميم عصري** مع Material-UI
- **دعم الوضع المظلم/النهاري**
- **تجاوب كامل** مع جميع الأجهزة
- **خطوط عربية أصيلة** (الخط العثماني)

### 📖 التفسير والمشاركة
- **تفسير متعدد المصادر** (الجلالين، ابن كثير، السعدي)
- **مشاركة الآيات** مع التفسير
- **نسخ النصوص** بسهولة
- **أرقام عربية** للآيات والصفحات

## 🛠️ التقنيات المستخدمة

### Frontend
- **Next.js 14** - إطار عمل React
- **TypeScript** - لغة البرمجة
- **Material-UI (MUI)** - مكتبة المكونات الرئيسية
- **Radix UI** - مكونات UI متقدمة
- **Tailwind CSS** - إطار عمل CSS
- **React Hooks** - إدارة الحالة

### التفاعل والحركة
- **Framer Motion** - أنيميشن وتفاعلات
- **GSAP** - أنيميشن متقدمة
- **Three.js** - رسوميات ثلاثية الأبعاد

### المصادقة وقاعدة البيانات
- **Next Auth** - نظام المصادقة
- **MongoDB** - قاعدة البيانات

### الذكاء الاصطناعي
- **Google Generative AI** - تكامل Gemini
- **Hugging Face** - نماذج AI
- **OpenAI** - تكامل ChatGPT

### البيانات
- **JSON محلي** - 6,236 ملف للآيات
- **APIs خارجية** - للتوقيتات والتفسير
- **SVG** - صور صفحات المصحف
- **MP3** - ملفات الصوت

### المكتبات الإضافية
- **React Hook Form** - إدارة النماذج
- **Lucide React** - الأيقونات
- **React Hot Toast** - الإشعارات
- **Axios** - طلبات HTTP

### الأدوات
- **PNPM** - مدير الحزم
- **ESLint** - فحص الكود
- **PostCSS** - معالجة CSS

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js 18+
- PNPM
- MongoDB (اختياري - للميزات المتقدمة)

### خطوات التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/Msr7799/Quran_Website.git

# الانتقال للمجلد
cd Quran_Website

# تثبيت التبعيات
pnpm install

# نسخ ملف البيئة
cp .env.example .env.local

# تشغيل الخادم المحلي
pnpm dev
```

افتح المتصفح على [http://localhost:3000](http://localhost:3000)

### 🔐 إعداد متغيرات البيئة

قم بتحرير ملف `.env.local` وأضف المتغيرات التالية:

```env
# قاعدة البيانات (اختياري)
MONGODB_URI=your_mongodb_connection_string

# المصادقة
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# الذكاء الاصطناعي (اختياري)
GOOGLE_AI_API_KEY=your_google_ai_key
OPENAI_API_KEY=your_openai_key
HUGGINGFACE_API_KEY=your_huggingface_key

# البريد الإلكتروني (اختياري)
EMAIL_SERVER=smtp.gmail.com
EMAIL_FROM=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**ملاحظة:** معظم الميزات تعمل بدون هذه المتغيرات. المطلوب فقط للميزات المتقدمة مثل الشات بوت والمصادقة.

### البناء للإنتاج

```bash
# بناء المشروع
pnpm build

# تشغيل الإنتاج
pnpm start
```

## 📁 هيكل المشروع

```
src/
├── components/          # المكونات القابلة لإعادة الاستخدام
│   ├── AudioPlayer/     # مشغل الصوت والتوقيتات
│   ├── QuranPage/       # عرض صفحات المصحف
│   └── ...
├── pages/              # صفحات التطبيق
│   ├── quran/          # صفحات السور
│   ├── quran-pages/    # تصفح المصحف
│   ├── quran-sound/    # الصوتيات
│   └── ...
├── styles/             # ملفات الأنماط
├── utils/              # الأدوات المساعدة
└── hooks/              # React Hooks مخصصة

public/
└── json/               # البيانات المحلية
    ├── audio/          # ملفات الصوت (114)
    ├── surah/          # بيانات السور (114)
    ├── verses/         # ملفات الآيات (6,236)
    ├── metadata.json   # البيانات الوصفية
    └── quranMp3.json   # قائمة القراء
```

## 🌐 الصفحات الرئيسية

| الصفحة | الوصف | المسار |
|---------|--------|--------|
| **الرئيسية** | نظرة عامة وروابط سريعة | `/` |
| **تصفح المصحف** | عرض صفحات القرآن SVG | `/quran-pages/[page]` |
| **قارئ القرآن** | قارئ متقدم مع ميزات إضافية | `/quran-reader` |
| **السور** | قراءة السور مع التفسير | `/quran/[surahId]` |
| **الصوتيات** | استماع للتلاوات | `/quran-sound` |
| **الشات بوت** | مساعد ذكي إسلامي (AI) | `/chat-bot` |
| **البث المباشر** | إذاعات قرآنية مباشرة | `/live` |
| **PDF** | عرض المصحف بصيغة PDF | `/quran-pdf` |
| **البحث** | البحث في القرآن | `/search` |
| **عن التطبيق** | معلومات عن المشروع | `/about` |
| **تسجيل الدخول** | نظام المصادقة | `/auth/signin` |

## 📊 إحصائيات البيانات

- **114 سورة** كاملة
- **6,236 آية** منفصلة
- **158+ قارئ** متاح
- **19 قارئ** مع تزامن دقيق
- **604 صفحة** من المصحف
- **77,429 كلمة** في القرآن
- **323,015 حرف** إجمالي

## 📖 دليل استخدام المكونات

### 🎵 AudioPlayer Component

مشغل صوت متقدم مع تزامن دقيق للآيات وتظليل تلقائي.

#### الاستخدام الأساسي:

```jsx
import QuranAudioPlayer from '@/components/AudioPlayer/QuranAudioPlayer';

function MyPage() {
  return (
    <QuranAudioPlayer
      surahNumber={1}
      reciterId="ar.abdulbasitmurattal"
      autoPlay={false}
      showTimeline={true}
      onVerseChange={(verseNumber) => console.log('الآية:', verseNumber)}
    />
  );
}
```

#### Props المتاحة:

| Prop | Type | Default | الوصف |
|------|------|---------|-------------|
| `surahNumber` | number | **required** | رقم السورة (1-114) |
| `reciterId` | string | **required** | معرف القارئ |
| `autoPlay` | boolean | `false` | التشغيل التلقائي |
| `showTimeline` | boolean | `true` | إظهار شريط الزمن |
| `highlightVerse` | boolean | `true` | تظليل الآية الحالية |
| `onVerseChange` | function | - | callback عند تغيير الآية |

#### اختصارات لوحة المفاتيح:

- `Space` - تشغيل/إيقاف
- `→` - الآية التالية
- `←` - الآية السابقة
- `↑` - رفع الصوت
- `↓` - خفض الصوت
- `R` - تكرار الآية

#### مثال متقدم:

```jsx
import { useState } from 'react';
import QuranAudioPlayer from '@/components/AudioPlayer/QuranAudioPlayer';
import CompactAudioPlayer from '@/components/AudioPlayer/CompactAudioPlayer';

function QuranPage() {
  const [currentVerse, setCurrentVerse] = useState(1);
  
  return (
    <div>
      {/* مشغل متقدم */}
      <QuranAudioPlayer
        surahNumber={2}
        reciterId="ar.alafasy"
        autoPlay={true}
        onVerseChange={setCurrentVerse}
      />
      
      {/* مشغل مضغوط */}
      <CompactAudioPlayer
        audioUrl="https://server.mp3quran.net/..."
        title="سورة البقرة"
      />
    </div>
  );
}
```

### 📖 QuranPage Component

عرض صفحات المصحف بصيغة SVG مع إمكانية التكبير والتصغير.

```jsx
import SVGPageViewer from '@/components/QuranPage/SVGPageViewer';

function QuranPageView() {
  return (
    <SVGPageViewer
      pageNumber={1}
      enableZoom={true}
      showPageNumber={true}
      onPageChange={(page) => console.log('الصفحة:', page)}
    />
  );
}
```

### 🤖 IslamicChatbot Component

مساعد ذكي إسلامي مدعوم بالذكاء الاصطناعي.

```jsx
import IslamicChatbot from '@/components/IslamicChatbot';

function ChatPage() {
  return (
    <IslamicChatbot
      model="gemini" // or "openai" or "huggingface"
      contextType="quran" // or "hadith" or "general"
      language="ar"
    />
  );
}
```

📘 **للمزيد:** راجع [دليل المكونات الكامل](Docs/COMPONENTS_SHOW_ROUTES.md)

## 🔗 APIs المستخدمة

### APIs خارجية

#### التوقيتات والصوت
- `https://mp3quran.net/api/v3/ayat_timing/reads` - قائمة القراء
- `https://mp3quran.net/api/v3/ayat_timing` - توقيتات الآيات

#### الصور
- `https://www.mp3quran.net/api/quran_pages_svg/` - صفحات SVG

#### التفسير
- `http://api.quran-tafseer.com/quran/` - تفسير الآيات

### APIs داخلية

#### البحث
```bash
GET /api/search-verses?q=الله
GET /api/search-surahs?q=البقرة
```

#### بيانات القرآن
```bash
GET /api/quran/[surahId]
GET /api/get-verse-page?surah=1&verse=1
```

#### الذكاء الاصطناعي
```bash
POST /api/chat/gemini
POST /api/chat/openai
POST /api/enhance-prompt
```

📘 **للمزيد:** راجع [دليل API الكامل](Docs/API_USE.md)

## 🔧 حل المشاكل الشائعة

### ❌ المشكلة: لا يعمل الصوت

**الحل:**
1. تأكد من تثبيت التبعيات: `pnpm install`
2. تحقق من اتصال الإنترنت
3. جرب قارئ آخر من قائمة القراء
4. تفقد Console لرؤية الأخطاء

### ❌ المشكلة: خطأ في قاعدة البيانات

**الحل:**
1. تحقق من `MONGODB_URI` في `.env.local`
2. تأكد من تشغيل MongoDB
3. تحقق من صلاحيات الوصول
4. راجع [دليل MongoDB](Docs/mongodb-atlas-setup.md)

### ❌ المشكلة: الشات بوت لا يعمل

**الحل:**
1. تأكد من إضافة API Keys في `.env.local`
2. تحقق من صلاحية المفاتيح
3. تأكد من وجود رصيد في حساب API

### ❌ المشكلة: خطأ في البناء (Build)

**الحل:**
```bash
# حذف ملفات البناء القديمة
rm -rf .next
rm -rf node_modules

# إعادة التثبيت
pnpm install

# بناء جديد
pnpm build
```

### ❌ مشاكل أخرى

للمساعدة الفورية:
- 🐛 [فتح Issue جديد](https://github.com/Msr7799/Quran_Website/issues)
- 💬 [تواصل مع المطور](mailto:alromaihi2224@gmail.com)
- 📖 [دليل الاختبار](Docs/TESTING_INSTRUCTIONS.md)

## 🗺️ خريطة الطريق

### ✅ مكتمل
- [x] مشغل الصوت مع التزامن
- [x] 158+ قارئ متاح
- [x] عرض المصحف SVG
- [x] الشات بوت الذكي
- [x] نظام المصادقة (Next Auth)
- [x] الوضع المظلم/النهاري
- [x] تصميم متجاوب كامل
- [x] بحث متقدم

### 🚧 قيد التطوير
- [ ] تطبيق موبايل (React Native)
- [ ] PWA دعم كامل
- [ ] Offline Mode
- [ ] تحسين SEO متقدم
- [ ] نظام إشعارات البريد
- [ ] تحسين الأداء

### 📋 مخطط
- [ ] دعم لغات إضافية (English, Urdu, French)
- [ ] نظام تسجيل التقدم للمستخدمين
- [ ] ميزة العلامات المرجعية
- [ ] مشاركة اجتماعية محسّنة
- [ ] تكامل مع خدمات السحابة
- [ ] أداة إحصائيات للمستخدمين

## ⚡ الأداء والتحسين

<div align="center">

| المقياس | القيمة |
|---------|-------|
| **Lighthouse Score** | 95+ |
| **First Contentful Paint** | < 1.5s |
| **Time to Interactive** | < 2.5s |
| **Speed Index** | < 2.0s |
| **Total Bundle Size** | Optimized |
| **SEO Score** | 100 |
| **Accessibility** | WCAG 2.1 AA |

</div>

### 🚀 تحسينات الأداء:
- ✅ **Code Splitting** لتقليل حجم التحميل
- ✅ **Lazy Loading** للصور والمكونات
- ✅ **Image Optimization** مع Next.js Image
- ✅ **Static Generation** للصفحات الثابتة
- ✅ **API Route Caching** لتسريع الاستجابة

## 🤝 المساهمة

نرحب بمساهماتكم! 🎉

### 📝 خطوات المساهمة:

1. **Fork** المشروع
2. **Clone** نسختك:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Quran_Website.git
   cd Quran_Website
   ```
3. أنشئ **branch** جديد:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. اعمل التعديلات والتزم بـ **coding style** الموجود
5. **Test** تغييراتك محلياً:
   ```bash
   pnpm dev
   pnpm lint
   ```
6. **Commit** برسالة واضحة:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
7. **Push** للـ branch:
   ```bash
   git push origin feature/amazing-feature
   ```
8. افتح **Pull Request**

### 📌 Guidelines:
- ✅ اتبع ESLint rules الموجودة
- ✅ أضف تعليقات للكود المعقد
- ✅ اختبر على mobile و desktop
- ✅ حافظ على الـ RTL support
- ✅ لا تحذف أو تضعف الاختبارات

### 🎯 أنواع المساهمات:
- 🐛 **Bug Fixes** - إصلاح الأخطاء
- ✨ **New Features** - ميزات جديدة
- 📝 **Documentation** - تحسين التوثيق
- 🎨 **UI/UX** - تحسين الواجهة
- ⚡ **Performance** - تحسين الأداء
- 🌍 **i18n** - دعم لغات جديدة

### 💬 Commit Convention:
```
feat: ميزة جديدة
fix: إصلاح خطأ
docs: تحديث التوثيق
style: تنسيق الكود
refactor: إعادة هيكلة
perf: تحسين الأداء
test: إضافة اختبارات
```

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 👨‍💻 المطور

**محمد الرميحي** - [@Msr7799](https://github.com/Msr7799)

## 🙏 شكر وتقدير

- **mp3quran.net** - للتوقيتات وصفحات SVG
- **quran-tafseer.com** - لخدمة التفسير
- **Material-UI** - لمكتبة المكونات
- **Next.js** - لإطار العمل الرائع

---

<div align="center">

**بُني بـ ❤️ لخدمة كتاب الله الكريم**

[🌐 الموقع المباشر](https://msr-quran-app.vercel.app) | [📚 دليل API](Docs/API_USE.md) | [🐛 الإبلاغ عن خطأ](https://github.com/Msr7799/test_quran_app/issues)

</div>
