# 🤖 نظام التحسين والترجمة - Hugging Face Models

## 📋 النماذج المستخدمة

### 🎯 **للتحسين (Prompt Enhancement):**

#### 1️⃣ **Meta-Llama-3-8B-Instruct** (الخيار الأول)
- **الحجم:** 8B parameters
- **السرعة:** ⚡⚡⚡⚡
- **الاستخدام:** تحسين الأسئلة وجعلها أكثر وضوحاً
- **المميزات:**
  - ممتاز في فهم السياق
  - يحافظ على اللغة الأصلية
  - سريع جداً

#### 2️⃣ **Mistral-7B-Instruct-v0.2** (احتياطي)
- **الحجم:** 7B parameters
- **السرعة:** ⚡⚡⚡⚡
- **الاستخدام:** بديل قوي للتحسين
- **المميزات:**
  - مفتوح المصدر بالكامل
  - أداء ممتاز في المهام الإسلامية
  - موثوق جداً

#### 3️⃣ **Zephyr-7B-Beta** (احتياطي ثاني)
- **الحجم:** 7B parameters
- **السرعة:** ⚡⚡⚡⚡
- **الاستخدام:** خيار آمن جداً
- **المميزات:**
  - مدرب على conversations
  - يفهم التعليمات بدقة

---

### 🌐 **للترجمة (Translation):**

#### 1️⃣ **NLLB-200 (No Language Left Behind)** (الخيار الأول)
- **النموذج:** facebook/nllb-200-distilled-600M
- **اللغات المدعومة:** 200 لغة! 🌍
- **السرعة:** ⚡⚡⚡⚡⚡
- **الاستخدام:** ترجمة متخصصة
- **المميزات:**
  - مدرب على 200 لغة
  - دقة عالية في اللغات النادرة
  - يحافظ على المصطلحات الإسلامية

#### 2️⃣ **LLM Fallback** (إذا فشل NLLB)
- يستخدم نفس نماذج التحسين للترجمة
- أبطأ لكن أكثر مرونة
- ممتاز للسياق الإسلامي

---

## 🔄 **نظام Fallback:**

```
التحسين:
🥇 Meta-Llama-3-8B-Instruct
    ↓ فشل
🥈 Mistral-7B-Instruct-v0.2
    ↓ فشل
🥉 Zephyr-7B-Beta
    ✅ نجح!

الترجمة:
🥇 NLLB-200 (ترجمة متخصصة)
    ↓ فشل
🥈 LLM (Meta-Llama / Mistral)
    ✅ نجح!
```

---

## 🌍 **اللغات المدعومة في NLLB:**

| اللغة | Code | NLLB Code |
|------|------|-----------|
| العربية | `ar` | `ara_Arab` |
| English | `en` | `eng_Latn` |
| Türkçe | `tr` | `tur_Latn` |
| हिन्दी | `hi` | `hin_Deva` |
| اردو | `ur` | `urd_Arab` |
| മലയാളം | `ml` | `mal_Mlym` |
| සිංහල | `si` | `sin_Sinh` |
| Filipino | `tl` | `tgl_Latn` |
| Русский | `ru` | `rus_Cyrl` |
| ไทย | `th` | `tha_Thai` |
| Español | `es` | `spa_Latn` |

---

## ⚙️ **المعاملات (Parameters):**

### **للتحسين:**
```javascript
{
  max_new_tokens: 200,
  temperature: 0.7,    // متوازن
  top_p: 0.9,
  return_full_text: false
}
```

### **للترجمة (NLLB):**
```javascript
{
  src_lang: 'eng_Latn',  // اللغة المصدر
  tgt_lang: 'ara_Arab'   // اللغة الهدف
}
```

### **للترجمة (LLM Fallback):**
```javascript
{
  max_new_tokens: 300,
  temperature: 0.3,    // دقيق
  top_p: 0.9,
  return_full_text: false
}
```

---

## 🔑 **المتطلبات:**

1. **HF_TOKEN** في `.env` file
2. Package: `@huggingface/inference` (✅ موجود)
3. Internet connection للوصول لـ Hugging Face API

---

## 🎯 **الاستخدام:**

### **API Endpoint:**
```
POST /api/enhance-prompt-hf
```

### **للتحسين:**
```javascript
{
  "prompt": "كيف انزلة سورة النجم",
  "action": "enhance"
}
```

### **للترجمة:**
```javascript
{
  "prompt": "How was Surah An-Najm revealed",
  "action": "translate",
  "targetLanguage": "ar"
}
```

---

## 📊 **Response Format:**
```javascript
{
  "originalPrompt": "...",
  "result": "...",
  "action": "enhance|translate",
  "targetLanguage": "ar",
  "usedModel": "meta-llama/Meta-Llama-3-8B-Instruct",
  "provider": "huggingface"
}
```

---

## 🚀 **المميزات:**

✅ **3 نماذج** للتحسين + fallback system
✅ **ترجمة متخصصة** لـ 200 لغة
✅ **سريع جداً** - نماذج محسّنة
✅ **مجاني 100%** - Hugging Face Free API
✅ **Error handling** قوي
✅ **Logging** تفصيلي

---

## 🔍 **التشخيص:**

### في Console سترى:
```
🔄 Trying enhance model: meta-llama/Meta-Llama-3-8B-Instruct
✅ Enhanced with: meta-llama/Meta-Llama-3-8B-Instruct
```

### في Toast سترى:
```
تم تحسين السؤال بنجاح! 🎯 (Meta-Llama-3-8B-Instruct)
```

---

## 💡 **لماذا Hugging Face بدلاً من Gemini؟**

| الميزة | Hugging Face | Gemini |
|-------|-------------|--------|
| **الاستقرار** | ✅ مستقر جداً | ❌ 503 Overloaded |
| **النماذج** | ✅ متعددة + fallback | ⚠️ محدودة |
| **الترجمة** | ✅ NLLB 200 لغة | ⚠️ عامة |
| **التكلفة** | ✅ مجاني | ✅ مجاني |
| **السرعة** | ✅⚡⚡⚡⚡ | ✅⚡⚡⚡⚡⚡ |
| **الموثوقية** | ✅ 99.9% | ⚠️ متغيرة |

---

**🎉 الآن لديك نظام قوي وموثوق للتحسين والترجمة!**
