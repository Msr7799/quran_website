import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const LANGUAGE_NAMES = {
  'ar': 'العربية',
  'en': 'English',
  'tr': 'Türkçe',
  'hi': 'हिन्दी',
  'ur': 'اردو',
  'ml': 'മലയാളം', // Malayalam (Kerala)
  'si': 'සිංහල', // Sinhala (Sri Lanka)
  'tl': 'Filipino',
  'ru': 'Русский',
  'th': 'ไทย',
  'es': 'Español' // Latino
};

// دالة للمحاولة مع نموذج معين
async function tryWithModel(genAI, modelName, promptText, maxRetries = 2) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(promptText);
      return { success: true, text: result.response.text().trim(), model: modelName };
    } catch (error) {
      console.log(`⚠️ Attempt ${i + 1}/${maxRetries} failed for ${modelName}:`, error.message);
      
      // إذا كان overloaded، انتظر قليلاً قبل المحاولة مرة أخرى
      if (error.message?.includes('overloaded') && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      } else if (i === maxRetries - 1) {
        throw error;
      }
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, action, targetLanguage = 'ar' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!genAI) {
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY not configured',
        result: prompt
      });
    }

    let result = prompt;
    let usedModel = 'none';
    
    // قائمة النماذج المتاحة فعلياً في v1beta (من الأسرع للأقوى)
    const models = [
      'gemini-1.5-flash',          // الأسرع - خيار أول
      'gemini-1.5-flash-latest',   // نسخة محدثة
      'gemini-pro',                // النموذج الأساسي المستقر
      'gemini-1.5-pro-latest'      // الأقوى - احتياطي نهائي
    ];

    // تحسين البروبت
    if (action === 'enhance') {
      const enhancePrompt = `أنت خبير في تحسين الأسئلة الإسلامية. مهمتك تحسين السؤال ليكون أكثر وضوحاً ودقة.

**قواعد التحسين:**
1. احتفظ باللغة الأصلية
2. أضف سياق إسلامي مناسب إذا كان مختصراً
3. اجعله أكثر تحديداً ووضوحاً
4. لا تغير المعنى الأساسي
5. أرجع السؤال المحسّن فقط بدون شرح

السؤال الأصلي: ${prompt}

السؤال المحسّن:`;

      // محاولة مع النماذج المتاحة
      let lastError;
      for (const modelName of models) {
        try {
          console.log(`🔄 Trying model: ${modelName}`);
          const modelResult = await tryWithModel(genAI, modelName, enhancePrompt);
          result = modelResult.text;
          usedModel = modelResult.model;
          console.log(`✅ Success with model: ${usedModel}`);
          break;
        } catch (error) {
          lastError = error;
          console.log(`❌ Failed with ${modelName}:`, error.message);
        }
      }
      
      if (result === prompt && lastError) {
        throw lastError; // فشلت جميع المحاولات
      }
    }

    // ترجمة البروبت
    if (action === 'translate') {
      const langName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
      
      const translatePrompt = `أنت مترجم محترف متخصص في المواضيع الإسلامية.
مهمتك ترجمة النص إلى ${langName} بدقة.

**قواعد الترجمة:**
1. إذا كان النص بنفس اللغة المطلوبة، أرجعه كما هو
2. احتفظ بالمصطلحات الإسلامية الصحيحة
3. ترجم بلغة واضحة ومفهومة
4. أرجع الترجمة فقط بدون شرح أو مقدمات

النص الأصلي: ${prompt}

الترجمة إلى ${langName}:`;

      // محاولة مع النماذج المتاحة
      let lastError;
      for (const modelName of models) {
        try {
          console.log(`🔄 Trying model: ${modelName}`);
          const modelResult = await tryWithModel(genAI, modelName, translatePrompt);
          result = modelResult.text;
          usedModel = modelResult.model;
          console.log(`✅ Success with model: ${usedModel}`);
          break;
        } catch (error) {
          lastError = error;
          console.log(`❌ Failed with ${modelName}:`, error.message);
        }
      }
      
      if (result === prompt && lastError) {
        throw lastError; // فشلت جميع المحاولات
      }
    }

    return res.status(200).json({ 
      originalPrompt: prompt,
      result: result,
      action: action,
      targetLanguage: targetLanguage,
      usedModel: usedModel // النموذج الذي نجح
    });

  } catch (error) {
    console.error('❌ Error processing prompt:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      action: req.body.action,
      hasApiKey: !!process.env.GEMINI_API_KEY
    });
    
    return res.status(500).json({ 
      error: 'Failed to process prompt',
      errorMessage: error.message,
      result: req.body.prompt
    });
  }
}
