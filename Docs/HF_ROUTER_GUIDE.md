# 🚀 دليل استخدام Hugging Face Router

## 📖 نظرة عامة

تم تحديث **المساعد الإسلامي "نور"** ليستخدم **Hugging Face Router** بنفس طريقة [HuggingChat](https://huggingface.co/chat)! 🎉

### ✨ ما الجديد؟

- ✅ **OpenAI-Compatible API** - استخدام معيار OpenAI
- ✅ **Dynamic Model Loading** - جلب النماذج تلقائياً
- ✅ **HF Router** - وصول لجميع النماذج بدون endpoints منفصلة
- ✅ **Streaming Support** - ردود فورية مع Server-Sent Events
- ✅ **Fallback System** - تبديل تلقائي بين Router والـ Inference API المباشر

---

## 🔧 الإعداد

### 1. المتغيرات المطلوبة في `.env`

```env
# Hugging Face Token (مطلوب)
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Hugging Face Router (اختياري - مفعّل افتراضياً)
HF_ROUTER_URL=https://router.huggingface.co/v1
HF_ROUTER_ENABLED=true

# Gemini API (اختياري)
GEMINI_API_KEY=your-gemini-api-key

# OpenAI API (اختياري)
OPENAI_API_KEY=your-openai-api-key
```

### 2. الحصول على HF Token

1. سجّل دخول في [Hugging Face](https://huggingface.co/)
2. اذهب إلى [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. أنشئ Token جديد (`Read` permissions كافية)
4. انسخ الـ Token وضعه في `.env`

---

## 🎯 كيفية العمل

### Architecture Overview

```
المستخدم → IslamicChatbot
           ↓
  /api/chat/huggingface-chat
           ↓
   ┌─────────────────┐
   │  HF Router?     │
   └────┬────────┬───┘
        ↓        ↓
    ✅ نعم    ❌ لا
        ↓        ↓
   HF Router  Direct HF
   (OpenAI)   Inference API
        ↓        ↓
   Streaming Response
```

### 🔀 Router vs Direct API

| Feature | HF Router | Direct HF API |
|---------|-----------|---------------|
| **Protocol** | OpenAI-compatible | Hugging Face SDK |
| **Models** | جميع النماذج المدعومة | نماذج محددة |
| **Setup** | `HF_ROUTER_ENABLED=true` | `HF_ROUTER_ENABLED=false` |
| **Endpoint** | `/v1/chat/completions` | SDK Methods |
| **Use Case** | الافتراضي (موصى به) | Fallback |

---

## 🤖 النماذج المتاحة

### جلب قائمة النماذج

```bash
GET /api/chat/models
```

**Response:**
```json
{
  "data": [
    {
      "id": "gemini-2.5-flash",
      "object": "model",
      "owned_by": "google",
      "description": "⭐ Gemini 2.5 Flash - الأفضل (مجاني 100%)",
      "category": "gemini"
    },
    {
      "id": "Ellbendls/Qwen-2.5-3b-Quran",
      "object": "model",
      "owned_by": "Ellbendls",
      "description": "📖 نموذج متخصص في تفسير القرآن الكريم",
      "category": "islamic"
    }
  ],
  "source": "hf-router"
}
```

### النماذج المدمجة حالياً

#### 🌟 Google Gemini (مجاني 100%)
- `gemini-2.5-flash` - ⭐ الأفضل (افتراضي)
- `gemini-2.5-flash-lite` - ⚡ الأسرع
- `gemini-1.5-pro` - 🧠 المهام المعقدة
- `gemini-1.5-flash` - متوازن

#### 📖 نماذج إسلامية متخصصة
- `Ellbendls/Qwen-2.5-3b-Quran` - تفسير القرآن
- `ibrax/qwen2.5-32B_muslim_belief` - العقيدة الإسلامية

#### 🇦🇪 نماذج عربية
- `inceptionai/jais-adapted-70b` - Jais 70B (إماراتي)

#### 🔥 نماذج LLM قوية
- `meta-llama/Llama-3.2-3B-Instruct`
- `meta-llama/Llama-3.2-1B-Instruct`
- `microsoft/Phi-3-mini-4k-instruct`
- `google/gemma-2-2b-it`

#### ⚡ نماذج سريعة
- `HuggingFaceH4/zephyr-7b-beta`
- `mistralai/Mistral-7B-Instruct-v0.3`

---

## 📡 استخدام API

### Chat Completion Request

```javascript
POST /api/chat/huggingface-chat

Body:
{
  "messages": [
    { "role": "user", "content": "ما معنى آية الكرسي؟" }
  ],
  "model": "gemini-2.5-flash",
  "temperature": 0.7,
  "max_tokens": 1024,
  "useTavily": false,  // بحث الإنترنت
  "useTime": false     // معرفة الوقت
}
```

### Streaming Response (Server-Sent Events)

```
data: {"content":"السلام"}
data: {"content":" عليكم"}
data: {"content":" ورحمة"}
data: {"content":" الله"}
data: [DONE]
```

---

## 🔄 Fallback System

### متى يتم التبديل التلقائي؟

1. **429 Rate Limit** - النموذج وصل للحد الأقصى
2. **Router Error** - خطأ في HF Router
3. **Connection Timeout** - انقطاع الاتصال

### كيف يعمل؟

```javascript
// 1. محاولة HF Router
try {
  return await fetchFromRouter();
} catch (error) {
  if (error.status === 429) {
    // 2. تبديل للنموذج البديل
    switchToAlternativeModel();
    
    // 3. محاولة Direct API
    return await fetchFromDirectAPI();
  }
}
```

### النماذج البديلة

عند حدوث Rate Limit، يتم التبديل تلقائياً بهذا الترتيب:
1. `Llama-3.2-3B-Instruct` ↓
2. `Llama-3.2-1B-Instruct` ↓
3. `Phi-3-mini-4k-instruct` ↓
4. `Gemma-2-2b-it` ↓
5. `Zephyr-7b-beta` ↓
6. العودة للأول

---

## 🎨 تكامل Frontend

### استخدام في React Component

```jsx
import { useState } from 'react';

function ChatComponent() {
  const [loading, setLoading] = useState(false);
  
  const sendMessage = async (userInput) => {
    setLoading(true);
    
    const response = await fetch('/api/chat/huggingface-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: userInput }
        ],
        model: 'gemini-2.5-flash'
      })
    });
    
    // Handle streaming
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          
          const parsed = JSON.parse(data);
          console.log(parsed.content);
        }
      }
    }
    
    setLoading(false);
  };
  
  return (/* ... */);
}
```

### جلب النماذج المتاحة

```jsx
const [models, setModels] = useState([]);

useEffect(() => {
  fetch('/api/chat/models')
    .then(res => res.json())
    .then(data => setModels(data.data));
}, []);
```

---

## 🐛 Troubleshooting

### ❌ خطأ: "HF_TOKEN not configured"

**الحل:**
```bash
# تأكد من وجود HF_TOKEN في .env
HF_TOKEN=hf_xxxxxxxxxx
```

### ❌ خطأ: "Router error: 401 Unauthorized"

**الحل:**
1. تحقق من صلاحية الـ Token
2. تأكد من عدم انتهاء صلاحيته
3. أنشئ Token جديد

### ❌ خطأ: "429 Rate Limit"

**الحل:**
- ✅ **تلقائي**: سيتم التبديل للنموذج البديل
- ⏰ **يدوي**: انتظر دقائق وحاول مرة أخرى
- 🔑 **حل دائم**: استخدم API Key خاص (مدفوع)

### ❌ خطأ: "Failed to fetch models"

**الحل:**
- سيتم استخدام النماذج الافتراضية (Fallback)
- تحقق من اتصال الإنترنت
- تحقق من `HF_ROUTER_URL`

---

## 📊 المقارنة مع الإصدار السابق

| Feature | القديم | الجديد ✨ |
|---------|--------|----------|
| **Protocol** | SDK فقط | OpenAI + SDK |
| **Models** | ثابتة | ديناميكية |
| **Router** | ❌ | ✅ |
| **Fallback** | يدوي | تلقائي |
| **Compatibility** | محدودة | HuggingChat-like |

---

## 🚀 الخطوات التالية

### خطط مستقبلية

- [ ] دعم **Function Calling** (Tools)
- [ ] دعم **Multimodal** (صور + نص)
- [ ] دعم **MCP Servers**
- [ ] **Caching** للنماذج
- [ ] **Rate Limiting** محلي

### كيف تساهم؟

1. Fork المشروع
2. أضف نموذج إسلامي جديد في `getIslamicModels()`
3. اختبر التكامل
4. افتح Pull Request

---

## 📚 مصادر إضافية

- [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers)
- [HuggingChat GitHub](https://github.com/huggingface/chat-ui)
- [OpenAI API Spec](https://platform.openai.com/docs/api-reference)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

---

## 💬 الدعم

للمساعدة:
- 🐛 [فتح Issue جديد](https://github.com/Msr7799/Quran_Website/issues)
- 💬 [تواصل مع المطور](mailto:alromaihi2224@gmail.com)

---

**تم التحديث:** نوفمبر 2024  
**الإصدار:** 2.0.0 - HF Router Integration
