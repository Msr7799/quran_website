import { createIslamicChatCompletion } from '../../../lib/openrouter';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model, temperature, maxTokens, useTavily, useTime } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Validate API key
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('❌ OPENROUTER_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'OpenRouter API key not configured' });
    }

    // إضافة معلومات MCP للرسائل إذا كانت مفعلة
    let enhancedMessages = [...messages];
    let contextAdditions = '';
    
    // إضافة معلومات النموذج المستخدم
    const modelNames = {
      'z-ai/glm-4.5-air:free': 'GLM-4.5-Air من Zhipu AI (Z.AI)',
      'google/gemini-2.0-flash-exp:free': 'Gemini 2.0 Flash Experimental من Google'
    };
    const currentModel = modelNames[model] || model;
    contextAdditions += `\n\n🤖 **معلومات تقنية عنك:**\n- أنت تستخدم نموذج: **${currentModel}**\n- النموذج: مجاني ومفتوح عبر OpenRouter\n- عند السؤال عن هويتك التقنية، اذكر هذا النموذج بالضبط`;
    
    // إضافة معلومات الوقت إذا كانت مفعلة
    if (useTime) {
      const now = new Date();
      const bahrainTime = now.toLocaleString('ar-BH', { 
        timeZone: 'Asia/Bahrain',
        dateStyle: 'full',
        timeStyle: 'long'
      });
      
      contextAdditions += `\n\n📅 **معلومات الوقت الحالي:**\n- التاريخ والوقت في البحرين: ${bahrainTime}\n- يمكنك استخدام هذه المعلومة في إجابتك إذا كان السؤال متعلقاً بالوقت.`;
    }

    // إضافة قدرات البحث إذا كانت مفعلة
    if (useTavily) {
      contextAdditions += `\n\n🌐 **قدرات البحث متاحة:**\n- يمكنك البحث في الإنترنت للحصول على معلومات حديثة\n- استخدم هذه القدرة عند الحاجة لمعلومات محدثة أو أحداث جارية\n- ⚠️ ملاحظة: البحث الفعلي سيتم تفعيله قريباً`;
    }

    // إضافة السياق للرسالة الأخيرة
    if (contextAdditions) {
      const lastMessage = enhancedMessages[enhancedMessages.length - 1];
      if (lastMessage.role === 'user') {
        lastMessage.content += contextAdditions;
      }
    }

    // Set up SSE (Server-Sent Events) for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Create streaming completion with custom settings
    const stream = await createIslamicChatCompletion(enhancedMessages, {
      model,
      temperature,
      maxTokens
    });

    // Stream the response
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      
      if (content) {
        // Send chunk as SSE
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Send done signal
    res.write(`data: [DONE]\n\n`);
    res.end();

  } catch (error) {
    console.error('❌ Error in Islamic assistant API:', error);
    
    // If headers not sent yet, send error response
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: 'Failed to process chat request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // If streaming, send error in stream
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
}
