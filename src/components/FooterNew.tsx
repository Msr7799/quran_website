/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import ScrollToTop from './ScrollToTop';
import { FaGithub, FaXTwitter, FaGlobe } from 'react-icons/fa6';
import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';

function Copyright() {
  return (
    <div className="flex flex-col items-center w-full mt-8 md:mt-16 mb-4 md:mb-8 px-4 sm:px-6 md:px-8">
      <h4 
        className="text-[rgba(91,101,97,0.8)] text-lg sm:text-xl md:text-2xl leading-relaxed md:leading-snug font-extrabold text-center tracking-wider mb-6 md:mb-12" 
        style={{ 
          textShadow: '0 3px 5px rgba(26, 26, 26, 0.05), 0 1px 2px rgba(0,0,0,0.2)',
          fontFamily: '"Amiri", "Times New Roman", serif'
        }}>
        اللهم أجعل هذا الموقع صدقه جاريه لي ولحمد المران ولاهل بيتنا ووالدينا وموتانا اللهم اغفر لهم ورحمهم ووفقنا لخدمة الدين
      </h4>
      
      <p 
        className="text-[#444] text-base sm:text-lg md:text-2xl leading-relaxed md:leading-loose font-extrabold text-center tracking-wide" 
        style={{ 
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.13)',
          fontFamily: '"Uthman", "Times New Roman", serif'
        }}>
        الموقع هذا يعتبر مصدر مفتوح لنشر القرآن الكريم وبجوده
        <br />
        هذا الموقع مفتوح المصدر وويمكنك أستعمال الكود في حسابي في قت هاب
        <br />
        وقريبا سيتم أنشآء تطبيقين ios & android platforms
        <br />
        اللهم أني أبتغي وجهك فبارك لنا فيه
        <br />
        <strong className="text-[rgba(68,74,68,0.78)]">
          📿 مـطور الموقع: محمد الـرميـحي | Msr7799 
        </strong>
      </p>
    </div>
  );
}

const keywords = [
  // المجموعة الأولى - الأساسيات
  'القرآن الكريم', 'سور القرآن', 'آيات القرآن', 'Quran Chapters', 'Quran Verses', 'Quran Pages',
  // المجموعة الثانية - البيانات والتقنية  
  'بيانات القرآن', 'Quran API', 'Quran Data', 'قراءة القرآن', 'Quran Recitation', 'تجويد القرآن',
  // المجموعة الثالثة - الصوت والتوقيت
  'صوت القرآن', 'Quran Audio', 'توقيت التلاوة', 'Quran Timing'
];

export default function FooterNew() {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState<'success' | 'error' | 'warning' | ''>('');
  const [showUnsubscribe, setShowUnsubscribe] = React.useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('يرجى إدخال بريد إلكتروني صحيح');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      
      if (data.ok) {
        setMessage('✅ تم الاشتراك بنجاح! تفقد بريدك الإلكتروني');
        setMessageType('success');
        setEmail(''); // مسح الإيميل بعد النجاح
        setShowUnsubscribe(false);
      } else if (response.status === 409 && data.exists) {
        // الإيميل موجود بالفعل - اعرض خيار إلغاء الاشتراك
        setMessage('هذا البريد الإلكتروني مشترك بالفعل');
        setMessageType('warning');
        setShowUnsubscribe(true);
      } else {
        setMessage(data.message || 'حدث خطأ أثناء الاشتراك');
        setMessageType('error');
        setShowUnsubscribe(false);
      }
    } catch (error) {
      console.error('خطأ في الاشتراك:', error);
      setMessage('حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
      setMessageType('error');
      setShowUnsubscribe(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!email) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/send-unsubscribe-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('خطأ في تحليل استجابة JSON:', parseError);
        data = { error: 'استجابة غير صحيحة من الخادم' };
      }

      if (response.ok) {
        setMessage('تم إرسال رابط تأكيد إلغاء الاشتراك إلى بريدك الإلكتروني 📧');
        setMessageType('success');
        setShowUnsubscribe(false);
        setEmail(''); // مسح الإيميل
        
        // إخفاء الرسالة بعد 10 ثواني
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 10000);
      } else if (response.status === 429) {
        setMessage(data.error || 'تم تجاوز الحد المسموح من المحاولات');
        setMessageType('error');
      } else if (response.status === 404) {
        setMessage('هذا البريد الإلكتروني غير مشترك في النشرة البريدية');
        setMessageType('warning');
        setShowUnsubscribe(false);
      } else if (response.status === 500) {
        setMessage(data.error || 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.');
        setMessageType('error');
      } else {
        setMessage(data.error || `خطأ غير متوقع (${response.status}). يرجى المحاولة لاحقاً.`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('خطأ في إرسال رابط إلغاء الاشتراك:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setMessage('فشل الاتصال بالخادم. تحقق من الاتصال بالإنترنت.');
      } else {
        setMessage('حدث خطأ في إرسال رابط التأكيد. يرجى المحاولة لاحقاً.');
      }
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <hr className="border-gray-300 dark:border-gray-700" />
      
      <div className="flex flex-col gap-6 sm:gap-12 md:gap-16 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-12 lg:px-16 text-center md:text-right bg-[#c4c4c4] text-gray-900 w-full max-w-full">
        
        <div className="flex flex-col sm:flex-row w-full justify-between gap-8 sm:gap-6">
          
          {/* قسم الاشتراك */}
          <div className="flex flex-col gap-6 sm:gap-8 min-w-full sm:min-w-[60%]">
            <div className="w-full sm:w-4/5 md:w-3/5">
              
              <img
                src="logo.png"
                alt="Quran Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border border-gray-300 dark:border-gray-700 rounded-xl bg-white shadow-md"
              />
              
              <h6 
                className="font-bold mt-4 sm:mt-6 text-[#262626] text-lg sm:text-xl md:text-2xl tracking-wide mb-3 sm:mb-4" 
                style={{ 
                  textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                  fontFamily: '"Amiri", "Times New Roman", serif'
                }}>
                اشترك في الحديث اليومي
              </h6>
              
              <p 
                className="text-[Firebrick] mb-4 sm:mb-6 text-base sm:text-lg md:text-xl font-semibold tracking-wide" 
                style={{ 
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.18)',
                  fontFamily: '"Amiri", "Times New Roman", serif'
                }}>
                احصل على حديث شريف يومياً من صحيح البخاري أو مسلم في بريدك الإلكتروني
              </p>
              
              <form onSubmit={handleSend} className="w-full">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full">
                  
                  <input
                    id="email-newsletter"
                    type="email"
                    aria-label="Enter your email address"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="off"
                    className="w-full sm:w-64 px-4 py-2.5 sm:py-2 text-gray-900 bg-white border-2 border-[rgba(31,86,115,0.8)] rounded-lg focus:outline-none focus:border-[rgba(31,86,115,0.8)] focus:ring-2 focus:ring-[rgba(31,86,115,0.3)] placeholder:text-[#262626] placeholder:opacity-50 text-base"
                  />
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-shrink-0 bg-[rgba(31,86,115,0.8)] text-[#f9f9f9] min-w-full sm:min-w-[100px] h-12 sm:h-11 text-base sm:text-sm md:text-base font-semibold uppercase tracking-wide rounded-xl shadow-lg hover:bg-[rgba(16,120,185,0.9)] hover:shadow-xl hover:-translate-y-0.5 disabled:bg-[rgba(26,94,102,0.5)] disabled:opacity-70 transition-all duration-300 flex items-center justify-center"
                    style={{ 
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      fontFamily: '"Amiri", "Times New Roman", serif'
                    }}>
                    {isLoading ? <FiLoader className="animate-spin text-xl" /> : 'اشترك'}
                  </button>
                  
                </div>
              </form>
              
              {/* رسائل الحالة */}
              {message && (
                <div className={`mt-4 p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3 ${
                  showUnsubscribe ? 'flex-col' : 'flex-row'
                } ${
                  messageType === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : messageType === 'warning'
                    ? 'bg-orange-50 border border-orange-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  
                  <div className="flex items-center gap-2 sm:gap-3">
                    {messageType === 'success' ? (
                      <FiCheckCircle className="text-green-600 text-xl sm:text-2xl flex-shrink-0" />
                    ) : messageType === 'warning' ? (
                      <FiAlertCircle className="text-orange-600 text-xl sm:text-2xl flex-shrink-0" />
                    ) : (
                      <FiAlertCircle className="text-red-600 text-xl sm:text-2xl flex-shrink-0" />
                    )}
                    
                    <p 
                      className="text-[#262626] font-semibold text-sm sm:text-base md:text-lg tracking-wide" 
                      style={{ 
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        fontFamily: '"Amiri", "Times New Roman", serif'
                      }}>
                      {message}
                    </p>
                  </div>
                  
                  {/* زر إرسال رابط إلغاء الاشتراك */}
                  {showUnsubscribe && (
                    <button
                      onClick={handleUnsubscribe}
                      disabled={isLoading}
                      className="mt-2 sm:mt-3 bg-[rgba(151,31,31,0.35)] border-2 border-[rgba(38,45,42,0.8)] text-[#262626] text-base sm:text-xl md:text-2xl font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg tracking-wide hover:border-[rgba(116,187,146,0.32)] hover:bg-[rgba(31,107,183,0.1)] hover:shadow-lg disabled:opacity-60 transition-all duration-300 flex items-center justify-center gap-2"
                      style={{ 
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.12)',
                        fontFamily: '"Amiri", "Times New Roman", serif'
                      }}>
                      {isLoading ? (
                        <FiLoader className="animate-spin text-sm" />
                      ) : (
                        '📧 إرسال رابط الإلغاء'
                      )}
                    </button>
                  )}
                  
                </div>
              )}
              
            </div>
          </div>
          
          {/* قسم الكلمات المفتاحية */}
          <div className="flex flex-col-reverse gap-2 sm:gap-3 w-full sm:w-auto mt-6 sm:mt-0">
            
            <h6 
              className="font-bold text-[#262626] text-base sm:text-lg md:text-xl mb-0 tracking-wide" 
              style={{ 
                textShadow: '0 1px 3px rgba(214, 211, 211, 0.4)',
                fontFamily: '"Uthman", "Times New Roman", serif',
                direction: 'rtl'
              }}>
              الأساسيات القرآنية
            </h6>
            
            <div className="flex flex-wrap gap-2 sm:gap-1 justify-center sm:justify-start">
              {keywords.slice(0, 6).map((word, idx) => (
                <div
                  key={idx}
                  className={`border border-[rgba(72,83,79,0.8)] text-[rgba(72,83,79,0.8)] rounded-full px-5 sm:px-2 md:px-4 py-1 sm:py-1 md:py-2 m-1 sm:m-1 md:m-2 text-base sm:text-base md:text-lg font-bold tracking-wide text-center w-fit transition-all duration-300 hover:bg-[rgba(13,76,147,0.8)] hover:text-white hover:shadow-lg ${
                    idx < 4 ? 'block' : 'hidden sm:block'
                  }`}
                  style={{ 
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    fontFamily: '"Amiri", "Times New Roman", serif'
                  }}>
                  {word}
                </div>
              ))}
            </div>
            
          </div>
          
          {/* مساحات فارغة للتوازن */}
          <div className="hidden sm:flex flex-col gap-1"></div>
          <div className="hidden sm:flex flex-col gap-1"></div>
          
        </div>
        
        {/* قسم Copyright والأيقونات الاجتماعية */}
        <div className="flex justify-between pt-12 sm:pt-16 md:pt-20 w-full border-t border-gray-300 dark:border-gray-700 mb-6">
          
          <div className="flex-1">
            <Copyright />
          </div>
          
          <div className="flex flex-row gap-2 sm:gap-3 items-start">
            
            <a
              href="https://github.com/Msr7799"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="self-center text-[#262626] hover:text-white hover:bg-[#262626] p-2 sm:p-3 rounded-full transition-all duration-300">
              <FaGithub className="text-2xl sm:text-3xl" />
            </a>
            
            <a
              href="https://x.com"
              aria-label="X"
              target="_blank"
              rel="noopener noreferrer"
              className="self-center text-gray-600 hover:text-blue-500 hover:bg-gray-100 p-2 sm:p-2.5 rounded-full transition-all duration-300">
              <FaXTwitter className="text-xl sm:text-2xl" />
            </a>
            
            <a
              href="https://msr-quran-data.vercel.app/"
              aria-label="Website"
              target="_blank"
              rel="noopener noreferrer"
              className="self-center text-gray-600 hover:text-blue-600 hover:bg-gray-100 p-2 sm:p-3 rounded-full transition-all duration-300">
              <FaGlobe className="text-2xl sm:text-3xl" />
            </a>
            
          </div>
          
        </div>
        
      </div>

      {/* مكون العودة لأعلى الصفحة */}
      <ScrollToTop
        showAfter={400}
        behavior="smooth"
        position="bottom-right"
        size="large"
        variant="primary"
        ariaLabel="العودة إلى أعلى الصفحة"
      />
    </React.Fragment>
  );
}
