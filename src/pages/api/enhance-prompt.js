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

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    let result = prompt;

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

      const enhanceResult = await model.generateContent(enhancePrompt);
      result = enhanceResult.response.text().trim();
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

      const translateResult = await model.generateContent(translatePrompt);
      result = translateResult.response.text().trim();
    }

    return res.status(200).json({ 
      originalPrompt: prompt,
      result: result,
      action: action,
      targetLanguage: targetLanguage
    });

  } catch (error) {
    console.error('Error processing prompt:', error);
    return res.status(500).json({ 
      error: 'Failed to process prompt',
      result: req.body.prompt
    });
  }
}
