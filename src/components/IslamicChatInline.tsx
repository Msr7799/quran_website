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
  const [targetLanguage, setTargetLanguage] = useState('ar'); // لغة الترجمة
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isInitialMount = useRef(true); // لمنع infinite loop

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  // ترجمة البروبت
  const handleTranslate = async () => {
    if (!input.trim()) return;
    
    setLoadingType("syncing");
    setIsLoading(true);
    try {
      const response = await fetch('/api/enhance-prompt-hf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          action: 'translate',
          targetLanguage: targetLanguage
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setInput(data.result);
        const modelInfo = data.usedModel ? ` (${data.usedModel})` : '';
        toast.success(`تم الترجمة بنجاح! 🌐${modelInfo}`);
      } else {
        console.error('❌ Translation failed:', data);
        toast.error(`فشل الترجمة: ${data.errorMessage || data.error}`);
      }
    } catch (error) {
      console.error('❌ Error translating prompt:', error);
      toast.error('حدث خطأ في الاتصال بالخادم');
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
    <div className="w-full max-w-7xl mx-auto arabic-font">
      {/* Header */}
      <div className="bg-gradient-to-r from-chart-19 to-chart-12/80 p-6 rounded-t-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-chart-13/50 rounded-full border-2 border-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl arabic-font">نور - المساعد الإسلامي</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-orange-100 text-sm arabic-font">متصل الآن • جاهز للمساعدة</p>
                
                {/* Memory Indicator */}
                {messages.length > 1 && (
                  <span className="text-xs bg-blue-500/20 mt-3 mr-3 border border-blue-400/30 text-blue-300 px-2 py-0.5 rounded-full arabic-font">
                    💾 {messages.length} رسائل محفوظة
                  </span>
                )}
                
                {/* Model Badge */}
                <span className="text-xs mt-3 bg-neutral-500/50 mr-3 border border-green-500/30 text-green-300 px-3 py-1 rounded-full flex items-center gap-1.5 font-medium arabic-font">
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
                  <span className="text-xs text-green-300 mt-3 bg-neutral-500/50 px-2 py-1 rounded-full border border-green-300 flex items-center gap-1 arabic-font">
                    <Globe className="w-3 h-3" />
                    بحث
                  </span>
                )}
                {useTime && (
                  <span className="text-xs text-green-300 mt-3 bg-neutral-500/50 px-2 py-1 rounded-full border border-green-300 flex items-center gap-1 arabic-font">
                    <Clock className="w-3 h-3" />
                    وقت
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Clear Chat Button */}
            <button
              onClick={clearChat}
              className="p-3 rounded-full bg-white/10 hover:bg-red-500/20 transition-all duration-300 group"
              aria-label="مسح المحادثة"
              title="مسح المحادثة"
            >
              <Trash2 className="w-5 h-5 text-white group-hover:text-red-400" />
            </button>
            
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              aria-label="الإعدادات"
            >
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="bg-neutral-800 border-x border-neutral-700 p-6 space-y-6">
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
            <label className="text-white font-semibold text-sm arabic-font">🤖 النموذج</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-neutral-900 text-white border-2 border-neutral-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-chart-3 arabic-font text-sm"
            >
              <optgroup label="🌟 Google Gemini (موصى به - مجاني 100%)">
                <option value="gemini-2.5-flash">⭐ Gemini 2.5 Flash (افتراضي - الأفضل)</option>
                <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash-Lite (الأسرع ⚡⚡⚡⚡)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (المهام المعقدة)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (متوازن)</option>
              </optgroup>
              
              <optgroup label="📖 نماذج إسلامية متخصصة">
                <option value="Ellbendls/Qwen-2.5-3b-Quran">Qwen 2.5 3B Quran (تفسير القرآن)</option>
                <option value="ibrax/qwen2.5-32B_muslim_belief">Qwen 32B Muslim Belief (العقيدة)</option>
              </optgroup>
              
              <optgroup label="🇦🇪 نماذج عربية إماراتية">
                <option value="inceptionai/jais-adapted-70b">Jais Adapted 70B (الأضخم! 🔥)</option>
              </optgroup>
              
              <optgroup label="🔥 نماذج LLM قوية ومتوازنة">
                <option value="meta-llama/Llama-3.2-3B-Instruct">Llama 3.2 3B Instruct</option>
                <option value="meta-llama/Llama-3.2-1B-Instruct">Llama 3.2 1B Instruct (أسرع)</option>
                <option value="microsoft/Phi-3-mini-4k-instruct">Microsoft Phi-3 Mini 4K</option>
                <option value="google/gemma-2-2b-it">Google Gemma 2 2B IT</option>
              </optgroup>
              
              <optgroup label="⚡ نماذج سريعة وخفيفة">
                <option value="HuggingFaceH4/zephyr-7b-beta">Zephyr 7B Beta</option>
                <option value="mistralai/Mistral-7B-Instruct-v0.3">Mistral 7B Instruct v0.3</option>
              </optgroup>
            </select>
            
            <p className="text-xs text-neutral-400 arabic-font">
              🤗 النماذج من Hugging Face • 🌟 Google Gemini - مجانية 100٪
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

          {/* Translation Language */}
          <div className="space-y-2">
            <label className="text-white font-semibold text-sm arabic-font">🌐 لغة الترجمة</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full bg-neutral-900 text-white border-2 border-neutral-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-chart-3 arabic-font text-sm"
            >
              <option value="ar">🇸🇦 العربية</option>
              <option value="en">🇬🇧 English</option>
              <option value="tr">🇹🇷 Türkçe</option>
              <option value="hi">🇮🇳 हिन्दी</option>
              <option value="ur">🇵🇰 اردو</option>
              <option value="ml">🇮🇳 മലയാളം (Kerala)</option>
              <option value="si">🇱🇰 සිංහල (Sri Lanka)</option>
              <option value="tl">🇵🇭 Filipino</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="th">🇹🇭 ไทย</option>
              <option value="es">🇪🇸 Español</option>
            </select>
            <p className="text-xs text-neutral-400 arabic-font">
              اختر اللغة التي تريد الترجمة إليها عند الضغط على زر الترجمة
            </p>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-chart-17/20 border-x border-neutral-700">
        {/* Messages */}
        <div className="h-[700px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#111]/80 to-[#1131/80">
          {messages.map((message, index) => (
            <div key={index} className="w-full">
              <div
                className={`w-[70%] rounded-2xl p-5 relative group ${
                  message.role === 'user'
                    ? 'mr-60 mb-5 mt-10 h-30 bg-gradient-to-br from-[#212121]/60 to-[#212121]/50 text-white shadow-xl shadow-chart-6/50 border border-[#3d3d3d]/30'
                    : 'mr-40 mt-10 bg-gradient-to-br from-chart-21/70 to-chart-21/90 text-neutral-200 shadow-2xl shadow-chart-6/50 border-3 border-neutral-900'
                }`}
              >
                {/* Copy Button */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton
                    content={message.content}
                    variant="outline"
                    size="sm"
                    className="bg-neutral-700/90 hover:bg-neutral-600 border-neutral-600"
                  />
                </div>

                {message.role === 'assistant' ? (
                  <div 
                    className={`prose prose-sm prose-invert max-w-none prose-headings:text-chart-3 prose-a:text-chart-3 prose-strong:text-chart-16 prose-code:text-chart-3 prose-pre:bg-neutral-700 pr-12 ${getContentClass(message.content)}`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p 
                    className="whitespace-pre-wrap pr-12 arabic-font"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {message.content}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#101010] rounded-2xl p-5 shadow-xl border border-neutral-700">
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
          <div className="p-6 bg-chart-17 border-t border-neutral-700">
            <div className="bg-gradient-to-r from-chart-3/10 to-chart-16/10 rounded-2xl p-6 border-2 border-chart-3/30">
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
        <div className="p-6 bg-chart-17 border-t border-neutral-700">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب سؤالك هنا... (اضغط Enter للإرسال)"
              className="flex-1 resize-none rounded-2xl border-2 border-neutral-600 bg-chart-17 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-chart-3 focus:border-transparent text-white placeholder:text-neutral-500 arabic-font"
              style={{ fontSize: `${fontSize}px` }}
              rows={2}
              disabled={isLoading}
            />
 
            <AnimatedOutlineButton variant='custom'
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className=" !bg-chart-11  border border-muted/20 hover:scale-105 text-white px-6 rounded-2xl hover:shadow-lg hover:shadow-chart-3/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center min-w-[80px]"
              aria-label="إرسال"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </AnimatedOutlineButton>
          </div>

          {/* أزرار التحسين والترجمة */}
          <div className="flex gap-2 mt-3">
            <AnimatedOutlineButton variant='custom'
              onClick={handleEnhance}
              disabled={isLoading || !input.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-500/20 border border-purple-500/30 text-purple-300 px-4 py-2.5 rounded-xl hover:from-purple-600/30 hover:to-purple-500/30 hover:border-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed arabic-font text-sm"
              title="تحسين السؤال باستخدام AI"
            >
              <span className="text-lg">🎯</span>
              <span>تحسين السؤال</span>
            </AnimatedOutlineButton>
  

             <AnimatedOutlineButton variant='blue'
               
              onClick={handleTranslate}
              disabled={isLoading || !input.trim()}
              className="flex-1 flex items-center justify-center gap-2 !bg-gradient-to-r !from-blue-600/20 !to-blue-500/20 !border !border-blue-500/30 text-blue-300 px-4 py-2.5 rounded-xl hover:from-blue-600/30 hover:to-blue-500/30 hover:border-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed arabic-font text-sm"
              title={`ترجمة إلى ${targetLanguage === 'ar' ? 'العربية' : targetLanguage}`}
            >
              <span className="text-lg">🌐</span>
              <span>ترجمة</span>
              </AnimatedOutlineButton>
          
          </div>
          
          <p className="text-sm text-neutral-400 mt-3 text-center arabic-font">
            💡 نصيحة: يمكنك الضغط على Shift+Enter للسطر الجديد
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-chart-12 p-4 rounded-b-3xl border-x border-b border-neutral-700">
        <div className="space-y-2">
          <p className="text-xs text-center text-neutral-400 arabic-font">
            ⚠️ المساعد ليس مفتياً - للمسائل الكبيرة، يُنصح بالرجوع للعلماء المتخصصين
          </p>
          <p className="text-xs text-center text-neutral-300 arabic-font">
            💾 المحادثة محفوظة مؤقتاً - تُحذف عند إغلاق التبويب
          </p>
        </div>
      </div>
    </div>
  );
}
