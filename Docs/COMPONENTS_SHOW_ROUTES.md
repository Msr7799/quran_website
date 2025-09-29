# معرض مكونات الواجهة - Routes

## 📍 الصفحات المتاحة:

### 1. Pages Router (التقليدي):
```
/components-show
```
**الملف:** `src/pages/components-show.tsx`

### 2. App Router (Next.js 13+):
```
/components-show
```
**الملف:** `src/app/components-show/page.tsx`

---

## 🚀 كيفية الوصول:

### من المتصفح:
```
http://localhost:3000/components-show
```

### إضافة رابط في القائمة:
```jsx
import Link from 'next/link';

<Link href="/components-show">
  <Button>معرض المكونات</Button>
</Link>
```

---

## 📱 المميزات:

✅ **SEO محسّن** - Meta tags كاملة  
✅ **Open Graph** - للمشاركة على وسائل التواصل  
✅ **Twitter Cards** - بطاقات تويتر  
✅ **RTL Support** - دعم اللغة العربية  
✅ **Dark Mode** - الوضع المظلم  
✅ **Responsive Design** - تصميم متجاوب  

---

## 🎨 التبويبات المتاحة:

1. **النماذج** - Forms & Inputs
2. **التخطيط** - Layout Components
3. **التنقل** - Navigation Elements
4. **عرض البيانات** - Data Display
5. **التغذية الراجعة** - Feedback Components

---

## 🔧 إضافة رابط للصفحة الرئيسية:

في `src/pages/index.jsx` أضف:

```jsx
import Link from 'next/link';

// داخل الـ JSX
<Link href="/components-show">
  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg text-white hover:shadow-lg transition-all cursor-pointer">
    <h3 className="text-xl font-bold mb-2">🎨 معرض المكونات</h3>
    <p>استكشف جميع مكونات الواجهة المتاحة</p>
  </div>
</Link>
```

---

## 📱 للاختبار:

1. تشغيل السيرفر: `pnpm dev`
2. انتقل إلى: `http://localhost:3000/components-show`
3. جرب التبويبات والمكونات التفاعلية

**🎉 الصفحة جاهزة للاستخدام!**
