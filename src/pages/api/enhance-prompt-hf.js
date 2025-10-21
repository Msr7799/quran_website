import { HfInference } from '@huggingface/inference';

const hf = process.env.HF_TOKEN ? new HfInference(process.env.HF_TOKEN) : null;

// نماذج Hugging Face للتحسين والترجمة
const MODELS = {
  // للتحسين - نماذج تدعم chat completion
  enhance: [
    'meta-llama/Llama-3.2-3B-Instruct',
    'Qwen/Qwen2.5-3B-Instruct',
    'microsoft/Phi-3-mini-4k-instruct'
  ],
  // للترجمة - نماذج ترجمة مدعومة
  translate: [
    'Helsinki-NLP/opus-mt-en-ar',
    'Helsinki-NLP/opus-mt-ar-en'
  ]
};

// دالة للتحسين باستخدام LLM
async function enhanceWithLLM(prompt) {
  for (const model of MODELS.enhance) {
    try {
      console.log(`🔄 Trying enhance model: ${model}`);
      
      const response = await hf.chatCompletion({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are an expert in improving Islamic questions. Make questions clearer and more precise while keeping the original language and Islamic context."
          },
          {
            role: "user",
            content: `Improve this question (return ONLY the improved version without explanation):\n\n${prompt}`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      const result = response.choices[0]?.message?.content?.trim() || prompt;
      console.log(`✅ Enhanced with: ${model}`);
      return { success: true, text: result, model };
      
    } catch (error) {
      console.log(`❌ Failed with ${model}:`, error.message);
      continue;
    }
  }
  
  throw new Error('All enhance models failed');
}

// دالة للترجمة باستخدام Helsinki-NLP
async function translateWithHelsinki(prompt, targetLang) {
  // اختر النموذج حسب اتجاه الترجمة
  const model = targetLang === 'ar' 
    ? 'Helsinki-NLP/opus-mt-en-ar'  // English to Arabic
    : 'Helsinki-NLP/opus-mt-ar-en'; // Arabic to English

  try {
    console.log(`🔄 Translating to ${targetLang} using ${model}`);
    
    const response = await hf.translation({
      model: model,
      inputs: prompt
    });

    const result = response.translation_text || response[0]?.translation_text || prompt;
    console.log(`✅ Translated successfully`);
    return { success: true, text: result, model: model.split('/')[1] };
    
  } catch (error) {
    console.log(`❌ Translation failed:`, error.message);
    
    // Fallback: استخدم LLM للترجمة
    return await translateWithLLM(prompt, targetLang);
  }
}

// Fallback: ترجمة باستخدام LLM
async function translateWithLLM(prompt, targetLang) {
  const langNames = {
    'ar': 'Arabic', 'en': 'English', 'tr': 'Turkish',
    'hi': 'Hindi', 'ur': 'Urdu', 'ml': 'Malayalam',
    'si': 'Sinhala', 'tl': 'Filipino', 'ru': 'Russian',
    'th': 'Thai', 'es': 'Spanish'
  };
  
  const targetLangName = langNames[targetLang] || 'Arabic';

  for (const model of MODELS.enhance) {
    try {
      console.log(`🔄 Trying translate with: ${model}`);
      
      const response = await hf.chatCompletion({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are a professional translator specialized in Islamic topics. Translate accurately to ${targetLangName} keeping Islamic terms correct.`
          },
          {
            role: "user",
            content: `Translate this to ${targetLangName} (return ONLY the translation):\n\n${prompt}`
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      });

      const result = response.choices[0]?.message?.content?.trim() || prompt;
      console.log(`✅ Translated with: ${model}`);
      return { success: true, text: result, model };
      
    } catch (error) {
      console.log(`❌ Failed with ${model}:`, error.message);
      continue;
    }
  }
  
  throw new Error('All translate models failed');
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

    if (!hf || !process.env.HF_TOKEN) {
      return res.status(500).json({ 
        error: 'HF_TOKEN not configured',
        result: prompt
      });
    }

    let result;
    let usedModel = 'none';

    // تحسين البروبت
    if (action === 'enhance') {
      const enhanceResult = await enhanceWithLLM(prompt);
      result = enhanceResult.text;
      usedModel = enhanceResult.model;
    }

    // ترجمة البروبت
    if (action === 'translate') {
      const translateResult = await translateWithHelsinki(prompt, targetLanguage);
      result = translateResult.text;
      usedModel = translateResult.model;
    }

    return res.status(200).json({ 
      originalPrompt: prompt,
      result: result || prompt,
      action: action,
      targetLanguage: targetLanguage,
      usedModel: usedModel,
      provider: 'huggingface'
    });

  } catch (error) {
    console.error('❌ Error processing prompt:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      action: req.body.action,
      hasToken: !!process.env.HF_TOKEN
    });
    
    return res.status(500).json({ 
      error: 'Failed to process prompt',
      errorMessage: error.message,
      result: req.body.prompt
    });
  }
}
