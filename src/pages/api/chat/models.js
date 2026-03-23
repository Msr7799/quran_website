/**
 * 🤖 Hugging Face Models Endpoint
 * يجلب قائمة النماذج المتاحة من HF Router (مثل HuggingChat)
 */

const HF_ROUTER_URL = process.env.HF_ROUTER_URL || 'https://router.huggingface.co/v1';
const HF_TOKEN = process.env.HF_TOKEN;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // جلب النماذج من HF Router
    const response = await fetch(`${HF_ROUTER_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch models from HF Router:', response.statusText);
      
      // Fallback: إرجاع النماذج الافتراضية
      return res.status(200).json({
        data: getDefaultModels(),
        source: 'fallback'
      });
    }

    const data = await response.json();
    
    // إضافة النماذج الإسلامية المتخصصة
    const enhancedModels = {
      data: [
        ...data.data,
        ...getIslamicModels()
      ],
      source: 'hf-router'
    };

    return res.status(200).json(enhancedModels);

  } catch (error) {
    console.error('Error fetching models:', error);
    
    // Fallback: إرجاع النماذج الافتراضية
    return res.status(200).json({
      data: getDefaultModels(),
      source: 'fallback',
      error: error.message
    });
  }
}

/**
 * نماذج إسلامية متخصصة
 */
function getIslamicModels() {
  return [
    {
      id: 'Ellbendls/Qwen-2.5-3b-Quran',
      object: 'model',
      created: Date.now(),
      owned_by: 'Ellbendls',
      description: '📖 نموذج متخصص في تفسير القرآن الكريم',
      category: 'islamic'
    },
    {
      id: 'ibrax/qwen2.5-32B_muslim_belief',
      object: 'model',
      created: Date.now(),
      owned_by: 'ibrax',
      description: '✨ نموذج متخصص في العقيدة الإسلامية',
      category: 'islamic'
    }
  ];
}

/**
 * نماذج افتراضية (Fallback)
 */
function getDefaultModels() {
  return [
    // Google Gemini
    {
      id: 'gemini-2.5-flash',
      object: 'model',
      created: Date.now(),
      owned_by: 'google',
      description: '⭐ Gemini 2.5 Flash - الأفضل (مجاني 100%)',
      category: 'gemini'
    },
    {
      id: 'gemini-2.5-flash-lite',
      object: 'model',
      created: Date.now(),
      owned_by: 'google',
      description: '⚡ Gemini 2.5 Flash-Lite - الأسرع',
      category: 'gemini'
    },
    {
      id: 'gemini-1.5-pro',
      object: 'model',
      created: Date.now(),
      owned_by: 'google',
      description: '🧠 Gemini 1.5 Pro - المهام المعقدة',
      category: 'gemini'
    },
    
    // Islamic Models
    ...getIslamicModels(),
    
    // Meta Llama
    {
      id: 'meta-llama/Llama-3.2-3B-Instruct',
      object: 'model',
      created: Date.now(),
      owned_by: 'meta',
      description: '🦙 Llama 3.2 3B Instruct',
      category: 'llama'
    },
    {
      id: 'meta-llama/Llama-3.2-1B-Instruct',
      object: 'model',
      created: Date.now(),
      owned_by: 'meta',
      description: '⚡ Llama 3.2 1B Instruct - سريع',
      category: 'llama'
    },
    
    // Microsoft & Google
    {
      id: 'microsoft/Phi-3-mini-4k-instruct',
      object: 'model',
      created: Date.now(),
      owned_by: 'microsoft',
      description: '🔷 Microsoft Phi-3 Mini',
      category: 'microsoft'
    },
    {
      id: 'google/gemma-2-2b-it',
      object: 'model',
      created: Date.now(),
      owned_by: 'google',
      description: '💎 Google Gemma 2 2B',
      category: 'google'
    },
    
    // UAE Models
    {
      id: 'inceptionai/jais-adapted-70b',
      object: 'model',
      created: Date.now(),
      owned_by: 'inceptionai',
      description: '🇦🇪 Jais Adapted 70B - إماراتي',
      category: 'arabic'
    },
    
    // Fast & Light
    {
      id: 'HuggingFaceH4/zephyr-7b-beta',
      object: 'model',
      created: Date.now(),
      owned_by: 'huggingface',
      description: '🌊 Zephyr 7B Beta',
      category: 'fast'
    },
    {
      id: 'mistralai/Mistral-7B-Instruct-v0.3',
      object: 'model',
      created: Date.now(),
      owned_by: 'mistralai',
      description: '🌟 Mistral 7B Instruct',
      category: 'fast'
    }
  ];
}
