'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Settings, X, Globe, Clock, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CopyButton } from './ui/animate-ui/primitives/buttons/copy';
import { LoadingIndicator } from './gsap/loading-indicator';
import { toast } from 'sonner';
import  AnimatedOutlineButton  from './ui/animated-outline-button';


interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Model {
  id: string;
  object: string;
  created?: number;
  owned_by?: string;
  description?: string;
  category?: string;
}

export default function IslamicChatInline() {
  // تحميل المحادثة من sessionStorage عند البدء
  const loadMessages = () => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('islamicChatMessages');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error loading messages:', e);
        }
      }
    }
    // الرسالة الافتراضية
    return [
      {
        role: 'assistant',
        content: '# السلام عليكم ورحمة الله وبركاته 🕌\n\nأنا **نور**، مساعدك الإسلامي الذكي! 📿\n\nيمكنني مساعدتك في:\n- 📖 تفسير القرآن الكريم\n- 📿 شرح الأحاديث النبوية\n- 🕌 الفقه والعبادات\n- ✨ العقيدة والتوحيد\n- 📚 السيرة النبوية وقصص الأنبياء\n- 🤲 الفتاوى والأحكام المعاصرة\n\nكيف يمكنني مساعدتك اليوم؟'
      }
    ];
  };

  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"loading" | "searching" | "syncing">("loading");
  const [showSettings, setShowSettings] = useState(false);
  
  // للمقارنة بين البروبت الأصلي والمحسّن
  const [showComparison, setShowComparison] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [useTavily, setUseTavily] = useState(false);
  const [useTime, setUseTime] = useState(false);
  const [fontSize, setFontSize] = useState(16); // حجم الخط بالبكسل
  const [targetLanguage, setTargetLanguage] = useState('EN'); // لغة الترجمة (DeepL format)
  
  // Dynamic Models من API
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isInitialMount = useRef(true); // لمنع infinite loop

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // تحميل النماذج من API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        console.log('🔄 [IslamicChatInline] جاري تحميل النماذج من API...');
        setModelsLoading(true);
        const response = await fetch('/api/chat/models');
        
        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        
        const data = await response.json();
        console.log('✅ [IslamicChatInline] تم تحميل النماذج بنجاح!');
        console.log(`📊 [IslamicChatInline] عدد النماذج: ${data.data?.length || 0}`);
        console.log(`🔗 [IslamicChatInline] المصدر: ${data.source}`);
        console.log('📋 [IslamicChatInline] النماذج:', data.data);
        
        setAvailableModels(data.data || []);
      } catch (error) {
        console.error('❌ [IslamicChatInline] Error fetching models:', error);
        toast.error('فشل تحميل النماذج. تحقق من HF_TOKEN في .env');
        setAvailableModels([]);
      } finally {
        setModelsLoading(false);
        console.log('🏁 [IslamicChatInline] انتهى تحميل النماذج');
      }
    };
    
    fetchModels();
  }, []);

  // تحميل الإعدادات عند البدء (أولاً)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('islamicChatSettings');
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          setModel(settings.model || 'gemini-2.5-flash');
          setTemperature(settings.temperature || 0.7);
          setMaxTokens(settings.maxTokens || 1024);
          setUseTavily(settings.useTavily || false);
          setUseTime(settings.useTime || false);
          setFontSize(settings.fontSize || 16);
          setTargetLanguage(settings.targetLanguage || 'ar');
        } catch (e) {
          console.error('Error loading settings:', e);
        }
      }
      // بعد التحميل، نسمح بالحفظ
      isInitialMount.current = false;
    }
  }, []);

  // حفظ المحادثة في sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      sessionStorage.setItem('islamicChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // حفظ الإعدادات في sessionStorage (بعد التحميل الأولي فقط)
  useEffect(() => {
    if (!isInitialMount.current && typeof window !== 'undefined') {
      const settings = {
        model,
        temperature,
        maxTokens,
        useTavily,
        useTime,
        fontSize,
        targetLanguage
      };
      sessionStorage.setItem('islamicChatSettings', JSON.stringify(settings));
    }
  }, [model, temperature, maxTokens, useTavily, useTime, fontSize, targetLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // تحديد نوع التحميل: searching إذا كان Tavily مفعل، وإلا loading
    setLoadingType(useTavily ? "searching" : "loading");
    setIsLoading(true);

    // AbortController لإلغاء الطلب عند الحاجة
    const abortController = new AbortController();

    try {
      const response = await fetch('/api/chat/huggingface-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          model,
          temperature,
          maxTokens,
          useTavily,
          useTime
        }),
        signal: abortController.signal // إضافة signal للإلغاء
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') break;

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    assistantMessage += parsed.content;
                    setMessages(prev => {
                      const newMessages = [...prev];
                      newMessages[newMessages.length - 1] = {
                        role: 'assistant',
                        content: assistantMessage
                      };
                      return newMessages;
                    });
                  }
                } catch (e) {
                  console.error('Error parsing chunk:', e);
                }
              }
            }
          }
        } finally {
          // cleanup: إغلاق الـ reader
          reader.releaseLock();
        }
      }
    } catch (error) {
      // إلغاء الطلب في حالة الخطأ
      abortController.abort();
      console.error('Error sending message:', error);
      
      let errorMessage = '❌ عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.';
      
      // معالجة خطأ Rate Limit
      const errorStr = error instanceof Error ? error.message : String(error);
      if (errorStr.includes('429') || errorStr.toLowerCase().includes('rate limit')) {
        // قائمة النماذج البديلة من Hugging Face
        const allModels = [
          { id: 'meta-llama/Llama-3.2-3B-Instruct', name: 'Llama 3.2 3B' },
          { id: 'meta-llama/Llama-3.2-1B-Instruct', name: 'Llama 3.2 1B' },
          { id: 'microsoft/Phi-3-mini-4k-instruct', name: 'Phi-3 Mini' },
          { id: 'google/gemma-2-2b-it', name: 'Gemma 2 2B' },
          { id: 'HuggingFaceH4/zephyr-7b-beta', name: 'Zephyr 7B' },
          { id: 'mistralai/Mistral-7B-Instruct-v0.3', name: 'Mistral 7B' },
          { id: 'Ellbendls/Qwen-2.5-3b-Quran', name: 'Qwen Quran' }
        ];
        
        const currentIndex = allModels.findIndex(m => m.id === model);
        const currentModelName = allModels[currentIndex]?.name || 'النموذج الحالي';
        
        // اختر النموذج التالي (إذا كان الأخير، ارجع للأول)
        const nextIndex = (currentIndex + 1) % allModels.length;
        const alternativeModel = allModels[nextIndex];
        
        // تبديل تلقائي للنموذج البديل
        setModel(alternativeModel.id);
        
        // إشعار للمستخدم
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('تم التبديل للنموذج البديل', {
            body: `تم التبديل من ${currentModelName} إلى ${alternativeModel.name}`,
            icon: '/icon.png'
          });
        }
        
        errorMessage = `⚠️ **تم التبديل التلقائي للنموذج البديل!**\n\n` +
                      `النموذج **${currentModelName}** وصل للحد الأقصى من الاستخدام المجاني مؤقتاً.\n\n` +
                      `✅ **تم التبديل تلقائياً إلى ${alternativeModel.name}**\n\n` +
                      `يمكنك الآن إعادة إرسال سؤالك بالنموذج الجديد.\n\n` +
                      `💡 **نصيحة:** جميع النماذج مجانية، جرّب أكثر من واحد للحصول على أفضل النتائج!\n\n` +
                      `**خيارات أخرى:**\n` +
                      `• ⏰ انتظر دقائق وارجع لـ ${currentModelName}\n` +
                      `• 🔄 غيّر يدوياً من الإعدادات ⚙️\n` +
                      `• 🔑 أو أضف API Key خاص بك في OpenRouter`;
      }
      
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // تحسين البروبت
  const handleEnhance = async () => {
    if (!input.trim()) return;
    
    setLoadingType("syncing");
    setIsLoading(true);
    try {
      const response = await fetch('/api/enhance-prompt-hf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          action: 'enhance'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // حفظ البروبت الأصلي والمحسّن
        setOriginalPrompt(input);
        setEnhancedPrompt(data.result);
        setShowComparison(true);
        
        const modelInfo = data.usedModel ? ` (${data.usedModel})` : '';
        toast.success(`تم تحسين السؤال! اختر النسخة التي تفضلها 🎯${modelInfo}`);
      } else {
        console.error('❌ Enhancement failed:', data);
        toast.error(`فشل التحسين: ${data.errorMessage || data.error}`);
      }
    } catch (error) {
      console.error('❌ Error enhancing prompt:', error);
      toast.error('حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };
  
  // اختيار البروبت الأصلي
  const selectOriginal = () => {
    setShowComparison(false);
    toast.info('تم الاحتفاظ بالسؤال الأصلي ✅');
  };
  
  // اختيار البروبت المحسّن
  const selectEnhanced = () => {
    setInput(enhancedPrompt);
    setShowComparison(false);
    toast.success('تم تطبيق السؤال المحسّن! 🎯');
  };

  // ترجمة البروبت باستخدام DeepL
  const handleTranslate = async () => {
    if (!input.trim()) return;
    
    setLoadingType("syncing");
    setIsLoading(true);
    try {
      console.log('🌌 [Translate] جاري الترجمة باستخدام DeepL...');
      
      const response = await fetch('/api/translate/deepl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: input,
          targetLanguage: targetLanguage
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setInput(data.translatedText);
        const detectedLang = data.detectedSourceLanguage || 'غير محدد';
        toast.success(`✅ تمت الترجمة بنجاح! (${detectedLang} → ${targetLanguage}) 🌌`);
        console.log('✅ [Translate] تمت الترجمة بنجاح');
      } else {
        console.error('❌ [Translate] Translation failed:', data);
        toast.error(`❌ فشل الترجمة: ${data.error || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('❌ [Translate] Error:', error);
      toast.error('❌ حدث خطأ في الاتصال بالخادم. تحقق من DEEPL_AUTH_KEY');
    } finally {
      setIsLoading(false);
    }
  };

  // دالة لمسح المحادثة
  const clearChat = () => {
    if (messages.length <= 1) {
      toast.info('المحادثة فارغة بالفعل! 📭');
      return;
    }

    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          const initialMessage: Message = {
            role: 'assistant',
            content: '# السلام عليكم ورحمة الله وبركاته 🕌\n\nأنا **نور**، مساعدك الإسلامي الذكي! 📿\n\nكيف يمكنني مساعدتك اليوم؟'
          };
          setMessages([initialMessage]);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('islamicChatMessages', JSON.stringify([initialMessage]));
          }
          resolve(initialMessage);
        }, 500);
      }),
      {
        loading: 'جاري مسح المحادثة... 🗑️',
        success: 'تم مسح المحادثة بنجاح! ✨',
        error: 'حدث خطأ في المسح'
      }
    );
  };

  /**
   * دالة ذكية لتحديد نوع الخط بناءً على المحتوى
   * - الخط العثماني: فقط للآيات القرآنية (بين ﴿ ﴾) والسلام
   * - الخط العربي: للأرقام، التواريخ، وبقية الإجابات
   */
  const getContentClass = (content: string) => {
    // نتحقق فقط من الآيات القرآنية الواضحة (بين ﴿ ﴾)
    const hasQuranBrackets = /﴿[^﴾]+﴾/g.test(content);
    
    // أو السلام الكامل
    const hasSalam = /السلام عليكم ورحمة الله وبركاته/g.test(content);
    
    // فقط للآيات القرآنية والسلام نستخدم العثماني
    // بقية النصوص (أرقام، تواريخ، شروحات) تستخدم arabic-font
    if (hasQuranBrackets || hasSalam) {
      return 'quran-font'; // Uthmanic Hafs Font - للآيات فقط
    }
    
    return 'arabic-font'; // Arabic Font - للأرقام والتواريخ والنصوص العادية
  };

  return (
    <div className="w-full max-w-7xl mx-auto arabic-font px-2 sm:px-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-chart-19 to-chart-12/80 p-3 sm:p-6 rounded-t-2xl sm:rounded-t-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-chart-13/50 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg sm:text-2xl arabic-font">نور - المساعد الإسلامي</h2>
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <p className="text-orange-100 text-xs sm:text-sm arabic-font">متصل الآن • جاهز للمساعدة</p>
                
                {/* Memory Indicator */}
                {messages.length > 1 && (
                  <span className="text-[10px] sm:text-xs bg-blue-500/20 mt-1 sm:mt-3 mr-1 sm:mr-3 border border-blue-400/30 text-blue-300 px-1.5 sm:px-2 py-0.5 rounded-full arabic-font">
                    💾 <span className="hidden sm:inline">{messages.length} رسائل</span><span className="sm:hidden">{messages.length}</span>
                  </span>
                )}
                
                {/* Model Badge */}
                <span className="text-[10px] sm:text-xs mt-1 sm:mt-3 bg-neutral-500/50 mr-1 sm:mr-3 border border-green-500/30 text-green-300 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1.5 font-medium arabic-font">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-pulse"></span>
                  {model.includes('Llama-3.2-3B') ? 'Llama 3.2 3B' :
                   model.includes('Llama-3.2-1B') ? 'Llama 3.2 1B' :
                   model.includes('Phi-3-mini') ? 'Phi-3 Mini' :
                   model.includes('gemma-2-2b') ? 'Gemma 2 2B' :
                   model.includes('Qwen-2.5-3b-Quran') ? 'Qwen Quran' :
                   model.includes('qwen2.5-32B_muslim') ? 'Qwen Muslim 32B' :
                   model.includes('zephyr-7b') ? 'Zephyr 7B' :
                   model.includes('Mistral-7B') ? 'Mistral 7B' : 'HF Model'}
                </span>
                
                {useTavily && (
                  <span className="text-[10px] sm:text-xs text-green-300 mt-1 sm:mt-3 bg-neutral-500/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-green-300 flex items-center gap-0.5 sm:gap-1 arabic-font">
                    <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">بحث</span>
                  </span>
                )}
                {useTime && (
                  <span className="text-[10px] sm:text-xs text-green-300 mt-1 sm:mt-3 bg-neutral-500/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-green-300 flex items-center gap-0.5 sm:gap-1 arabic-font">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">وقت</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Clear Chat Button */}
            <button
              onClick={clearChat}
              className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-red-500/20 transition-all duration-300 group"
              aria-label="مسح المحادثة"
              title="مسح المحادثة"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-red-400" />
            </button>
            
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              aria-label="الإعدادات"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="bg-neutral-800 border-x border-neutral-700 p-3 sm:p-6 space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-xl arabic-font">⚙️ الإعدادات</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="p-2 rounded-full hover:bg-neutral-700 transition-all"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-white font-semibold text-sm arabic-font">🤖 النموذج</label>
              {modelsLoading && (
                <span className="text-xs text-chart-3 arabic-font">⏳ جاري التحميل...</span>
              )}
            </div>
            
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={modelsLoading || availableModels.length === 0}
              className="w-full bg-neutral-900 text-white border-2 border-neutral-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-chart-3 arabic-font text-sm disabled:opacity-50"
            >
              {availableModels.length > 0 ? (
                (() => {
                  const grouped: Record<string, Model[]> = {};
                  availableModels.forEach(m => {
                    const cat = m.category || 'other';
                    if (!grouped[cat]) grouped[cat] = [];
                    grouped[cat].push(m);
                  });
                  
                  const categoryLabels: Record<string, string> = {
                    'gemini': '🌟 Google Gemini (موصى به - مجاني 100%)',
                    'islamic': '📖 نماذج إسلامية متخصصة',
                    'arabic': '🇦🇪 نماذج عربية',
                    'llama': '🦙 Meta Llama',
                    'microsoft': '🔷 Microsoft',
                    'google': '💎 Google',
                    'fast': '⚡ نماذج سريعة',
                    'other': '🤖 نماذج أخرى'
                  };
                  
                  return Object.entries(grouped).map(([cat, models]) => (
                    <optgroup key={cat} label={categoryLabels[cat] || cat}>
                      {models.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.description || m.id}
                        </option>
                      ))}
                    </optgroup>
                  ));
                })()
              ) : (
                <option disabled>❌ فشل تحميل النماذج</option>
              )}
            </select>
            
            <p className="text-xs text-neutral-400 arabic-font">
              {availableModels.length > 0 ? (
                `✅ ${availableModels.length} نموذج متاح • 🤗 HF Router`
              ) : (
                modelsLoading ? '⏳ جاري التحميل...' : '❌ فشل تحميل النماذج - تحقق من HF_TOKEN'
              )}
            </p>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-white font-semibold text-sm arabic-font">🎨 الإبداع / الحرارة</label>
              <span className="text-chart-3 font-bold arabic-font">{temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-chart-3"
            />
            <div className="flex justify-between text-xs text-neutral-400 arabic-font">
              <span>دقيق (0)</span>
              <span>متوازن (1)</span>
              <span>مبدع (2)</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-white font-semibold text-sm arabic-font">📝 عدد التوكنز</label>
              <span className="text-chart-3 font-bold arabic-font">{maxTokens}</span>
            </div>
            <input
              type="range"
              min="512"
              max="8192"
              step="512"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-chart-3"
            />
            <div className="flex justify-between text-xs text-neutral-400 arabic-font">
              <span>قصير (1024)</span>
              <span>متوسط (2048-4096)</span>
              <span>طويل (8192)</span>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-white font-semibold text-sm arabic-font">🔠 حجم الخط</label>
              <span className="text-chart-3 font-bold arabic-font">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-chart-3"
            />
            <div className="flex justify-between text-xs text-neutral-400 arabic-font">
              <span>صغير (12px)</span>
              <span>متوسط (16px)</span>
              <span>كبير (24px)</span>
            </div>
          </div>

          {/* MCP Tools */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold text-sm arabic-font">🔧 الأدوات المساعدة</p>
              <span className="text-xs text-neutral-400 arabic-font">MCP Servers</span>
            </div>
            <p className="text-xs text-neutral-400 bg-neutral-900 p-3 rounded-lg border border-neutral-700 arabic-font">
              💡 تفعيل هذه الأدوات يمنح المساعد قدرات إضافية للبحث والوصول للمعلومات الحديثة
            </p>
            
            {/* Tavily Search */}
            <div className="flex items-center justify-between bg-neutral-900 p-4 rounded-xl border border-neutral-700">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-chart-3" />
                <div>
                  <p className="text-white font-medium arabic-font">البحث في الإنترنت</p>
                  <p className="text-neutral-400 text-xs arabic-font">Tavily Search</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useTavily}
                  onChange={(e) => setUseTavily(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-chart-3 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-chart-3"></div>
              </label>
            </div>

            {/* Time Tool */}
            <div className="flex items-center justify-between bg-neutral-900 p-4 rounded-xl border border-neutral-700">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-chart-3" />
                <div>
                  <p className="text-white font-medium arabic-font">معرفة الوقت</p>
                  <p className="text-neutral-400 text-xs arabic-font">Time & Date</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useTime}
                  onChange={(e) => setUseTime(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-chart-3 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-chart-3"></div>
              </label>
            </div>
          </div>

          {/* Translation Language - تصميم محسّن */}
          <div className="space-y-2">
            <label className="text-white font-semibold text-sm arabic-font flex items-center gap-2">
              🌌 لغة الترجمة
              <span className="text-xs text-chart-3 font-normal">(لزر الترجمة)</span>
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full bg-gradient-to-r from-neutral-900 to-neutral-800 text-white border-2 border-neutral-600 hover:border-chart-3 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-chart-3 arabic-font text-sm cursor-pointer transition-all"
            >
              <option value="AR" className="bg-neutral-900">🇸🇦 العربية (Arabic)</option>
              <option value="EN" className="bg-neutral-900">🇬🇧 English (إنجليزي)</option>
              <option value="TR" className="bg-neutral-900">🇹🇷 Türkçe (تركي)</option>
              <option value="HI" className="bg-neutral-900">🇮🇳 हिन्दी (Hindi)</option>
              <option value="UR" className="bg-neutral-900">🇵🇰 اردو (Urdu)</option>
              <option value="RU" className="bg-neutral-900">🇷🇺 Русский (Russian)</option>
              <option value="ES" className="bg-neutral-900">🇪🇸 Español (Spanish)</option>
              <option value="FR" className="bg-neutral-900">🇫🇷 Français (French)</option>
              <option value="DE" className="bg-neutral-900">🇩🇪 Deutsch (German)</option>
              <option value="IT" className="bg-neutral-900">🇮🇹 Italiano (Italian)</option>
              <option value="PT" className="bg-neutral-900">🇧🇷 Português (Portuguese)</option>
              <option value="ZH" className="bg-neutral-900">🇨🇳 中文 (Chinese)</option>
              <option value="JA" className="bg-neutral-900">🇯🇵 日本語 (Japanese)</option>
              <option value="KO" className="bg-neutral-900">🇰🇷 한국어 (Korean)</option>
              <option value="ID" className="bg-neutral-900">🇮🇩 Bahasa Indonesia</option>
            </select>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400 arabic-font">
                ✅ ترجمة فورية بواسطة DeepL
              </span>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-[10px] border border-green-500/30">
                15 لعة
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-chart-17/20 border-x border-neutral-700">
        {/* Messages */}
        <div className="h-[600px] sm:h-[800px] md:h-[900px] overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-b from-[#111]/80 to-[#1131/80">
          {messages.map((message, index) => (
            <div key={index} className="w-full">
              <div
                className={`w-[95%] sm:w-[85%] md:w-[70%] rounded-xl sm:rounded-2xl p-3 sm:p-5 relative group ${
                  message.role === 'user'
                    ? 'ml-auto mb-3 sm:mb-5 mt-4 sm:mt-10 bg-gradient-to-br from-[#212121]/60 to-[#212121]/50 text-white shadow-xl shadow-chart-6/50 border border-[#3d3d3d]/30'
                    : 'mr-auto mt-4 sm:mt-10 bg-gradient-to-br from-chart-21/70 to-chart-21/90 text-neutral-200 shadow-2xl shadow-chart-6/50 border-3 border-neutral-900'
                }`}
              >
                {/* Copy Button */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton
                    content={message.content}
                    variant="outline"
                    size="sm"
                    className="bg-neutral-700/90 hover:bg-neutral-600 border-neutral-600 scale-75 sm:scale-100"
                  />
                </div>

                {message.role === 'assistant' ? (
                  <div 
                    className={`prose prose-sm prose-invert max-w-none prose-headings:text-chart-3 prose-a:text-chart-3 prose-strong:text-chart-16 prose-code:text-chart-3 prose-pre:bg-neutral-700 pr-8 sm:pr-12 ${getContentClass(message.content)}`}
                    style={{ fontSize: `${Math.max(14, fontSize - 2)}px` }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p 
                    className="whitespace-pre-wrap pr-8 sm:pr-12 arabic-font"
                    style={{ fontSize: `${Math.max(14, fontSize - 2)}px` }}
                  >
                    {message.content}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#101010] rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xl border border-neutral-700">
                <LoadingIndicator 
                  type={loadingType}
                  text={
                    loadingType === "loading" ? "جاري الكتابة..." :
                    loadingType === "syncing" ? "جاري المعالجة..." :
                    "جاري البحث في الإنترنت..."
                  }
                />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Comparison Modal - مقارنة البروبت */}
        {showComparison && (
          <div className="p-3 sm:p-6 bg-chart-17 border-t border-neutral-700">
            <div className="bg-gradient-to-r from-chart-3/10 to-chart-16/10 rounded-xl sm:rounded-2xl p-3 sm:p-6 border-2 border-chart-3/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-xl arabic-font flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-chart-3" />
                  قارن واختر النسخة الأفضل
                </h3>
                <button
                  onClick={() => setShowComparison(false)}
                  className="text-neutral-400 hover:text-white transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* البروبت الأصلي */}
                <div className="bg-neutral-700 rounded-xl p-4 border-2 border-neutral-700 hover:border-blue-500/50 transition-all cursor-pointer"
                     onClick={selectOriginal}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-blue-400 font-semibold arabic-font flex items-center gap-2">
                      📝 السؤال الأصلي
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); selectOriginal(); }}
                      className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-4 py-2 rounded-lg transition-all text-sm arabic-font"
                    >
                      اختيار
                    </button>
                  </div>
                  <p className="text-neutral-300 arabic-font leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                    {originalPrompt}
                  </p>
                </div>
                
                {/* البروبت المحسّن */}
                <div className="bg-neutral-900 rounded-xl p-4 border-2 border-chart-3/50 hover:border-chart-3 transition-all cursor-pointer relative"
                     onClick={selectEnhanced}>
                  <div className="absolute -top-3 -right-3 bg-chart-3 text-white px-3 py-1 rounded-full text-xs font-bold">
                    محسّن ✨
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-chart-3 font-semibold arabic-font flex items-center gap-2">
                      🎯 السؤال المحسّن
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); selectEnhanced(); }}
                      className="bg-gradient-to-r from-chart-3 to-chart-16 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-chart-3/30 transition-all text-sm arabic-font font-bold"
                    >
                      تطبيق
                    </button>
                  </div>
                  <p className="text-neutral-300 arabic-font leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                    {enhancedPrompt}
                  </p>
                </div>
              </div>
              
              <p className="text-center text-neutral-400 text-sm mt-4 arabic-font">
                💡 اضغط على أي بطاقة أو استخدم الأزرار للاختيار
              </p>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 sm:p-6 bg-chart-17 border-t border-neutral-700">
          <div className="relative w-full">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب سؤالك هنا... (اضغط Enter للإرسال)"
              className="w-full resize-none rounded-2xl border-2 border-neutral-600 bg-chart-17 px-4 pl-14 sm:pl-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-chart-19 focus:border-transparent text-white placeholder:text-neutral-500 arabic-font text-sm sm:text-base"
              style={{ fontSize: `${Math.max(14, fontSize - 2)}px` }}
              rows={3}
              disabled={isLoading}
            />
 
            <AnimatedOutlineButton variant='custom'
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="absolute right-92 bottom-10 !bg-chart-11 border border-muted/20 hover:scale-105 text-white p-1.5 rounded-lg hover:shadow-lg hover:shadow-chart-3/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center w-8 h-8"              aria-label="إرسال"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </AnimatedOutlineButton>
          </div>

          {/* أزرار التحسين والترجمة */}
          <div className="flex flex-row gap-1.5 sm:gap-2 mt-2">
            <AnimatedOutlineButton variant='custom'
              onClick={handleEnhance}
              disabled={isLoading || !input.trim()}
              className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 border border-purple-500/30 text-purple-300 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:from-purple-600/30 hover:to-purple-500/30 hover:border-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed arabic-font text-[11px] sm:text-xs"
              title="تحسين السؤال باستخدام AI"
            >
              <span className="text-sm sm:text-base">🎯</span>
              <span>تحسين</span>
            </AnimatedOutlineButton>
  

             <AnimatedOutlineButton variant='blue'
               
              onClick={handleTranslate}
              disabled={isLoading || !input.trim()}
              className="flex-1 flex items-center justify-center gap-1 !bg-gradient-to-r !from-blue-600/20 !to-blue-500/20 !border !border-blue-500/30 text-blue-300 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:from-blue-600/30 hover:to-blue-500/30 hover:border-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed arabic-font text-[11px] sm:text-xs"
              title={`ترجمة إلى ${targetLanguage === 'ar' ? 'العربية' : targetLanguage}`}
            >
              <span className="text-sm sm:text-base">🌐</span>
              <span>ترجمة</span>
              </AnimatedOutlineButton>
          
          </div>
          
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 sm:mt-3 text-center arabic-font hidden sm:block">
            💡 نصيحة: يمكنك الضغط على Shift+Enter للسطر الجديد
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-chart-12 p-2 sm:p-4 rounded-b-2xl sm:rounded-b-3xl border-x border-b border-neutral-700">
        <div className="space-y-1 sm:space-y-2">
          <p className="text-[10px] sm:text-xs text-center text-neutral-400 arabic-font">
            ⚠️ المساعد ليس مفتياً - للمسائل الكبيرة، يُنصح بالرجوع للعلماء المتخصصين
          </p>
          <p className="text-[10px] sm:text-xs text-center text-neutral-300 arabic-font">
            💾 المحادثة محفوظة مؤقتاً - تُحذف عند إغلاق التبويب
          </p>
        </div>
      </div>
    </div>
  );
}
