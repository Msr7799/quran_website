/**
 * 🤖 Unified Islamic Chat API
 * يدعم نماذج Hugging Face و Google Gemini المجانية
 */

import { HfInference } from '@huggingface/inference';
import { GoogleGenerativeAI } from '@google/generative-ai';

const hf = new HfInference(process.env.HF_TOKEN);
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// System Prompt إسلامي متخصص
const ISLAMIC_SYSTEM_PROMPT = `أنت "نور"، مساعد إسلامي ذكي ومتخصص. مهمتك مساعدة المسلمين في:

📖 **القرآن الكريم**: تفسير الآيات، معاني الكلمات، أسباب النزول، الإعجاز القرآني
📿 **السنة النبوية**: شرح الأحاديث، التخريج، الفقه الحديثي
🕌 **الفقه والعبادات**: الصلاة، الصيام، الزكاة، الحج، الأحكام الشرعية
✨ **العقيدة**: التوحيد، الإيمان، اليوم الآخر
📚 **السيرة النبوية**: قصص الأنبياء، التاريخ الإسلامي
🤲 **الفتاوى**: المسائل المعاصرة (مع التنبيه للرجوع للعلماء)

**قواعد الإجابة:**
1. أجب بالعربية الفصحى الواضحة
2. استشهد بالآيات والأحاديث الصحيحة مع التوثيق
3. كن دقيقاً وموثوقاً في المعلومات
4. استخدم الأسلوب الودود المحترم
5. للمسائل الكبيرة: انصح بالرجوع للعلماء المتخصصين
6. ضع الآيات القرآنية بين ﴿ ﴾ للتمييز
7. استخدم الإيموجي بشكل مناسب

ابدأ دائماً بالبسملة أو السلام.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model, temperature = 0.7, max_tokens = 1024 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // التحقق من HF_TOKEN
    if (!process.env.HF_TOKEN) {
      return res.status(500).json({ 
        error: 'HF_TOKEN not configured. Please add it to .env file' 
      });
    }

    // تحديد النموذج الافتراضي إذا لم يُحدد
    const selectedModel = model || 'gemini-2.5-flash';

    // التحقق من نوع النموذج
    const isGemini = selectedModel.startsWith('gemini-');

    // إعداد Headers للـ Streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // === Google Gemini ===
    if (isGemini) {
      if (!genAI) {
        return res.status(500).json({ 
          error: 'GEMINI_API_KEY not configured. Please add it to .env file' 
        });
      }

      try {
        const geminiModel = genAI.getGenerativeModel({ model: selectedModel });
        
        // بناء المحادثة - نضع System Prompt كأول رسالة
        const allMessages = messages.slice(0, -1);
        const chatHistory = [];
        
        // نضيف System Prompt كأول رسالة user
        let addedSystemPrompt = false;
        
        // نبحث عن أول رسالة من user
        let foundFirstUser = false;
        for (const msg of allMessages) {
          if (msg.role === 'user') {
            foundFirstUser = true;
            
            // نضيف System Prompt قبل أول رسالة user
            if (!addedSystemPrompt) {
              chatHistory.push({
                role: 'user',
                parts: [{ text: ISLAMIC_SYSTEM_PROMPT + '\n\n' + msg.content }]
              });
              addedSystemPrompt = true;
              continue; // نتخطى هذه الرسالة لأننا دمجناها مع System Prompt
            }
          }
          
          // نضيف الرسائل فقط بعد أول user message
          if (foundFirstUser) {
            chatHistory.push({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content }]
            });
          }
        }

        const chat = geminiModel.startChat({
          history: chatHistory,
          generationConfig: {
            temperature: parseFloat(temperature),
            maxOutputTokens: parseInt(max_tokens)
          }
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessageStream(lastMessage);

        // إرسال البيانات بشكل متدفق
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
          }
        }

        res.write('data: [DONE]\n\n');
        res.end();
        return;
      } catch (geminiError) {
        console.error('❌ Gemini error:', geminiError);
        res.write(`data: ${JSON.stringify({ 
          error: `خطأ في Gemini: ${geminiError.message}` 
        })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }
    }

    // === Hugging Face ===
    // بناء المحادثة مع System Prompt
    const formattedMessages = [
      { role: 'system', content: ISLAMIC_SYSTEM_PROMPT },
      ...messages
    ];

    try {
      // استدعاء Hugging Face Inference API مع Streaming
      const stream = await hf.chatCompletionStream({
        model: selectedModel,
        messages: formattedMessages,
        temperature: parseFloat(temperature),
        max_tokens: parseInt(max_tokens),
        stream: true
      });

      // إرسال البيانات بشكل متدفق
      for await (const chunk of stream) {
        if (chunk.choices && chunk.choices.length > 0) {
          const delta = chunk.choices[0].delta;
          
          if (delta && delta.content) {
            // إرسال المحتوى على شكل Server-Sent Events
            res.write(`data: ${JSON.stringify({ 
              content: delta.content 
            })}\n\n`);
          }
        }
      }

      // إشارة انتهاء الـ Stream
      res.write('data: [DONE]\n\n');
      res.end();

    } catch (streamError) {
      console.error('❌ Streaming error:', streamError);
      
      // Fallback: استخدام non-streaming إذا فشل الـ streaming
      const response = await hf.chatCompletion({
        model: selectedModel,
        messages: formattedMessages,
        temperature: parseFloat(temperature),
        max_tokens: parseInt(max_tokens)
      });

      const content = response.choices[0].message.content;
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }

  } catch (error) {
    console.error('❌ Error in Hugging Face chat:', error);
    
    // إرسال رسالة خطأ واضحة
    const errorMessage = error.message || 'Unknown error occurred';
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      res.write(`data: ${JSON.stringify({ 
        error: 'النموذج وصل للحد الأقصى. جرب نموذج آخر أو انتظر قليلاً.' 
      })}\n\n`);
    } else if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
      res.write(`data: ${JSON.stringify({ 
        error: 'خطأ في التوكن. تأكد من HF_TOKEN في ملف .env' 
      })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ 
        error: `خطأ: ${errorMessage}` 
      })}\n\n`);
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  }
}
