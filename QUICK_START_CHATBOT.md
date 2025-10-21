# ⚡ دليل البدء السريع - المساعد الإسلامي

## 🎯 خطوات الإعداد السريعة (5 دقائق)

### 1️⃣ احصل على API Key مجاني

```bash
# اذهب إلى:
https://openrouter.ai/keys

# سجل دخول وأنشئ API key
```

### 2️⃣ أضف API Key في الملف .env

```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxx
```

### 3️⃣ شغّل المشروع

```bash
pnpm dev
```

### 4️⃣ افتح الصفحة

```
http://localhost:3000/chat-bot
```

### 5️⃣ جرب المساعد!

اضغط على الأيقونة الخضراء واسأل أي سؤال ديني! 🚀

---

## 🎨 إضافة المساعد لصفحتك

### خطوة واحدة فقط:

```tsx
import IslamicChatbot from '@/components/IslamicChatbot';

export default function HomePage() {
  return (
    <div>
      <h1>موقعك هنا</h1>
      
      {/* المساعد الإسلامي */}
      <IslamicChatbot />
    </div>
  );
}
```

**هذا كل شيء!** ✨

---

## 📱 النشر على Vercel

### في Vercel Dashboard:

1. **Settings** → **Environment Variables**
2. أضف:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key
   ```
3. **Redeploy**

---

## 💡 أمثلة سريعة للأسئلة

```
- ما تفسير سورة الفاتحة؟
- اشرح لي حديث "المسلم من سلم المسلمون من لسانه ويده"
- ما هي أركان الإسلام؟
- احكي لي عن غزوة أحد
- ما حكم الصلاة في البيت؟
```

---

## ⚠️ حل المشاكل السريع

### المساعد لا يرد؟

✅ تأكد من `OPENROUTER_API_KEY` في `.env`
✅ تأكد من تشغيل `pnpm dev`
✅ افتح Console وابحث عن أخطاء

### خطأ 404؟

✅ تأكد أن الملفات في المكان الصحيح:
```
src/lib/openrouter.ts
src/pages/api/chat/islamic-assistant.js
src/components/IslamicChatbot.tsx
```

### خطأ TypeScript؟

✅ أعد تشغيل المشروع:
```bash
pnpm dev
```

---

## 🎁 نصائح سريعة

1. **السؤال بالعربية** يعطي نتائج أفضل
2. **أسئلة محددة** تعطي إجابات أدق
3. **Shift+Enter** لسطر جديد في الرسالة
4. المساعد يدعم **Markdown** في الردود
5. يمكنك **التصغير** عند عدم الحاجة

---

## 📚 للمزيد

اقرأ الملف الكامل: [`ISLAMIC_CHATBOT_README.md`](./ISLAMIC_CHATBOT_README.md)

---

**جاهز؟ ابدأ الآن!** 🚀

```bash
pnpm dev
# ثم افتح http://localhost:3000/chat-bot
```
