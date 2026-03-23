/**
 * 🌐 DeepL Translation API
 * ترجمة النصوص باستخدام DeepL
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, targetLanguage = 'EN' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const DEEPL_AUTH_KEY = process.env.DEEPL_AUTH_KEY;

    if (!DEEPL_AUTH_KEY) {
      return res.status(500).json({ 
        error: 'DEEPL_AUTH_KEY not configured in .env' 
      });
    }

    // تحديد API URL (مجاني ينتهي بـ :fx)
    const isFreeAccount = DEEPL_AUTH_KEY.endsWith(':fx');
    const apiUrl = isFreeAccount 
      ? 'https://api-free.deepl.com/v2/translate'
      : 'https://api.deepl.com/v2/translate';

    console.log('🔄 [DeepL] جاري الترجمة...');
    console.log(`📝 [DeepL] النص: ${text.substring(0, 50)}...`);
    console.log(`🎯 [DeepL] اللغة الهدف: ${targetLanguage}`);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_AUTH_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLanguage.toUpperCase(),
        formality: 'default'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [DeepL] Error:', errorData);
      throw new Error(`DeepL API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const translatedText = data.translations[0].text;

    console.log('✅ [DeepL] تمت الترجمة بنجاح!');
    console.log(`📝 [DeepL] النتيجة: ${translatedText.substring(0, 50)}...`);

    return res.status(200).json({
      success: true,
      translatedText,
      detectedSourceLanguage: data.translations[0].detected_source_language,
      targetLanguage: targetLanguage.toUpperCase()
    });

  } catch (error) {
    console.error('❌ [DeepL] Translation error:', error);
    return res.status(500).json({ 
      error: error.message || 'Translation failed' 
    });
  }
}
