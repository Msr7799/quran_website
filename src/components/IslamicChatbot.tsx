'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, MessageCircle, X, BotMessageSquareIcon, Minimize2, Maximize2, Settings, Trash2, Globe, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CopyButton } from './ui/animate-ui/primitives/buttons/copy';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { LoadingIndicator } from './gsap/loading-indicator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function IslamicChatbot() {
  const router = useRouter();
  
  // تحميل المحادثة من sessionStorage
  const loadMessages = () => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('islamicChatbotMessages');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error loading messages:', e);
        }
      }
    }
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
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // للمقارنة بين البروبت الأصلي والمحسّن
  const [showComparison, setShowComparison] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  
  // Settings
  const [model, setModel] = useState('gemini-2.5-flash');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [useTavily, setUseTavily] = useState(false);
  const [useTime, setUseTime] = useState(false);
  const [fontSize, setFontSize] = useState(16);
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
      const saved = sessionStorage.getItem('islamicChatbotSettings');
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
      sessionStorage.setItem('islamicChatbotMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // حفظ الإعدادات (بعد التحميل الأولي فقط)
  useEffect(() => {
    if (!isInitialMount.current && typeof window !== 'undefined') {
      const settings = { model, temperature, maxTokens, useTavily, useTime, fontSize, targetLanguage };
      sessionStorage.setItem('islamicChatbotSettings', JSON.stringify(settings));
    }
  }, [model, temperature, maxTokens, useTavily, useTime, fontSize, targetLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

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
        signal: abortController.signal
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
      
      const errorStr = error instanceof Error ? error.message : String(error);
      if (errorStr.includes('429') || errorStr.toLowerCase().includes('rate limit')) {
        const allModels = [
          { id: 'meta-llama/Llama-3.2-3B-Instruct', name: 'Llama 3.2 3B' },
          { id: 'meta-llama/Llama-3.2-1B-Instruct', name: 'Llama 3.2 1B' },
          { id: 'microsoft/Phi-3-mini-4k-instruct', name: 'Phi-3 Mini' }
        ];
        
        const currentIndex = allModels.findIndex(m => m.id === model);
        const nextIndex = (currentIndex + 1) % allModels.length;
        const alternativeModel = allModels[nextIndex];
        
        setModel(alternativeModel.id);
        
        errorMessage = `⚠️ **تم التبديل التلقائي للنموذج البديل!**\n\nالنموذج وصل للحد الأقصى.\n\n✅ **تم التبديل تلقائياً إلى ${alternativeModel.name}**\n\nيمكنك الآن إعادة إرسال سؤالك.`;
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
            sessionStorage.setItem('islamicChatbotMessages', JSON.stringify([initialMessage]));
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

  const getContentClass = (content: string) => {
    const hasQuranBrackets = /﴿[^﴾]+﴾/g.test(content);
    const hasFullSalam = /السلام عليكم ورحمة الله وبركاته/g.test(content);
    return (hasQuranBrackets || hasFullSalam) ? 'quran-font' : 'arabic-font';
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 group"
        aria-label="فتح المساعد الإسلامي"
      >
        <div className="relative">
          {/* Glow effect - احترافي خفيف */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-400/20 to-gray-500/20 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
          
          {/* Button - احترافي نظيف */}
          <div className="relative bg-gradient-to-br from-slate-700/40 to-gray-800/50 backdrop-blur-sm text-white p-4 rounded-full shadow-lg hover:shadow-slate-500/30 transition-all duration-300 hover:scale-105 border border-slate-600/30 group-hover:border-slate-500/50">
            <MessageCircle className="w-7 h-7 drop-shadow-lg" />
          </div>
          
          {/* Badge - أقل وضوحاً */}
          <div className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-slate-800/95 backdrop-blur-sm text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-xl border border-slate-700/50">
          المساعد الإسلامي 🕌
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed ${isMinimized ? 'bottom-6 left-6' : 'inset-4 md:left-6 md:bottom-6 md:top-auto md:right-auto'} z-50 flex flex-col ${isMinimized ? 'w-90 h-20' : 'md:w-[700px] md:h-[800px]'} transition-all duration-300` }>
      {/* Chat Container */}
      <div className={`flex flex-col bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-700 overflow-hidden ${isMinimized ? 'h-60' : 'h-full'}`}>
        
        {/* Header - نفس ألوان IslamicChatInline */}
        <div className="bg-gradient-to-r from-chart-19 via-chart-12/50 to-chart-19 p-4 flex items-center justify-between border-b-2 border-chart-16/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-chart-3 rounded-full border-2 border-white" />
            </div>
            <div>
              <h4 className={`text-white font-bold text-lgrabic-font ${isMinimized ? 'top-100 absolute ' : 'text-lg'}`} >نور - المساعد الإسلامي</h4>
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-orange-100 text-sm arabic-font ${isMinimized ? 'top-100 absolute ' : 'text-lg'}`}>متصل الآن • جاهز للمساعدة</p>
                
                {messages.length > 1 && (
                  <span className={`text-xs bg-blue-500/20 border border-blue-400/30 text-blue-300 px-2 py-0.5 rounded-full arabic-font ${isMinimized ? 'top-100 absolute ' : 'text-lg'}`} >
                    💾 {messages.length} رسائل
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 transition-all duration-300 group"
              aria-label="مسح المحادثة"
              title="مسح المحادثة"
            >
              <Trash2 className="w-4 h-4 text-white group-hover:text-red-400" />
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              aria-label="الإعدادات"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={isMinimized ? "تكبير" : "تصغير"}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4 text-white" /> : <Minimize2 className="w-4 h-4 text-white" />}
            </button>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => router.push('/chat-bot')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              aria-label="نور النموذج الاسلامي"
              title="فتح صفحة نور الكاملة"
            >
              <BotMessageSquareIcon className="w-5 h-5 text-white" />
            </button>
            
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && !isMinimized && (
          <div className="bg-neutral-800 border-x border-neutral-700 p-6 space-y-6 max-h-[400px] overflow-y-auto">
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
                    <p className="text-neutral-400 text-xs arabic-font">System Time</p>
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

        {!isMinimized && (
          <>
            {/* Messages - نفس تصميم IslamicChatInline */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-neutral-950 to-neutral-900">
              {messages.map((message, index) => (
                <div key={index} className="w-full">
                  <div
                    className={`w-full rounded-2xl p-5 relative group ${
                      message.role === 'user'
                    ? 'bg-gradient-to-br from-[#212121]/60 to-[#212121]/50 text-white shadow-xl shadow-chart-6/50 border border-[#3d3d3d]/30'
                   :  '!bg-sidebar-ring/30 text-neutral-200 shadow-xl border border-neutral-700'
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
                      <p className="whitespace-pre-wrap pr-12 arabic-font" style={{ fontSize: `${fontSize}px` }}>
                        {message.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="w-full">
                  <div className="w-full bg-chart-13 rounded-2xl p-5 shadow-xl border border-neutral-700 flex items-center justify-center">
                    <LoadingIndicator 
                      type={loadingType} 
                      text={
                        loadingType === "loading" ? "جاري الكتابة..." :
                        loadingType === "syncing" ? "جاري المعالجة..." :
                        "جاري البحث..."
                      }
                      className="text-lg"
                    />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Comparison Modal - مقارنة البروبت */}
            {showComparison && (
              <div className="bg-neutral-800 p-6 border-t border-neutral-700">
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
                    <div className="bg-neutral-900 rounded-xl p-4 border-2 border-neutral-700 hover:border-blue-500/50 transition-all cursor-pointer"
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

            {/* Input - نفس تصميم IslamicChatInline */}
            <div className="bg-neutral-800 p-6 rounded-b-2xl border-t border-neutral-700">
              <div className="flex gap-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="✍️ اكتب سؤالك هنا..."
                  className="flex-1 resize-none rounded-2xl border-2 border-neutral-600 bg-neutral-900 px-6 py-4 text-white text-base focus:outline-none focus:ring-2 focus:ring-chart-3 focus:border-chart-3 placeholder:text-neutral-500 arabic-font transition-all duration-300"
                  rows={2}
                  disabled={isLoading}
                  style={{ fontSize: `${fontSize}px` }}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-br from-chart-21 to-chart-14 text-white px-6 py-4 rounded-2xl hover:shadow-md hover:shadow-[#3d3d3d]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-chart-6/70 border border-chart-13/60 disabled:hover:shadow-none flex items-center justify-center min-w-[60px]"
                  aria-label="إرسال"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Send className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* أزرار التحسين والترجمة */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleEnhance}
                  disabled={isLoading || !input.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-500/20 border border-purple-500/30 text-purple-300 px-4 py-2.5 rounded-xl hover:from-purple-600/30 hover:to-purple-500/30 hover:border-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed arabic-font text-sm"
                  title="تحسين السؤال باستخدام AI"
                >
                  <span className="text-lg">🎯</span>
                  <span>تحسين السؤال</span>
                </button>
                
                <button
                  onClick={handleTranslate}
                  disabled={isLoading || !input.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-2.5 rounded-xl hover:from-blue-600/30 hover:to-blue-500/30 hover:border-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed arabic-font text-sm"
                  title={`ترجمة إلى ${targetLanguage === 'ar' ? 'العربية' : targetLanguage}`}
                >
                  <span className="text-lg">🌐</span>
                  <span>ترجمة</span>
                </button>
              </div>
              
              <p className="text-sm bg-gradient-to-r from-chart-19 to-chart-12 text-neutral-400 mt-3 text-center arabic-font">
                💡 نصيحة: يمكنك الضغط على Shift+Enter للسطر الجديد
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
