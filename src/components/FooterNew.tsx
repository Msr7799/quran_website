/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import ScrollToTop from './ScrollToTop';
import { FaGithub, FaXTwitter, FaGlobe } from 'react-icons/fa6';
import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';

const keywords = [
  'القرآن الكريم', 'سور القرآن', 'آيات القرآن', 'Quran Chapters', 'Quran Verses', 'Quran Pages',
  'بيانات القرآن', 'Quran API', 'Quran Data', 'قراءة القرآن', 'Quran Recitation', 'تجويد القرآن',
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
        setEmail('');
        setShowUnsubscribe(false);
      } else if (response.status === 409 && data.exists) {
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
        setEmail('');
        
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
    } catch (error: unknown) {
      console.error('خطأ في إرسال رابط إلغاء الاشتراك:', error);
      if (error instanceof Error && error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
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
      <footer className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 pt-8 pb-6 sm:px-6 lg:px-8">
          
          {/* قسم الاشتراك */}
          <div className="mx-auto max-w-md">
            <div className="flex flex-col items-center mb-4">
              <img
                src="logo.png"
                alt="Quran Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 mb-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white shadow-md"
              />
            </div>
            
            <strong 
              className="block text-center text-lg font-bold text-gray-900 sm:text-2xl dark:text-white"
              style={{ fontFamily: '"Amiri", "Times New Roman", serif' }}>
              اشترك في الحديث اليومي
            </strong>

            <p 
              className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400"
              style={{ fontFamily: '"Amiri", "Times New Roman", serif' }}>
              احصل على حديث شريف يومياً من صحيح البخاري أو مسلم في بريدك الإلكتروني
            </p>

            <form onSubmit={handleSend} className="mt-4">
              <div className="relative max-w-lg">
                <label className="sr-only" htmlFor="email">البريد الإلكتروني</label>

                <input
                  className="w-full rounded-full border-1 border-chart-8 bg-gray-200 p-3 pe-28 text-md font-medium  !bg-chart-10 !text-chart-14"
                  id="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="off"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute end-1 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[70px]"
                  style={{ fontFamily: '"Amiri", "Times New Roman", serif' }}>
                  {isLoading ? <FiLoader className="animate-spin text-lg" /> : 'اشترك'}
                </button>
              </div>
            </form>
            
            {/* رسائل الحالة */}
            {message && (
              <div className={`mt-3 p-2 sm:p-3 rounded-lg flex flex-col items-center gap-2 ${
                messageType === 'success'
                  ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'
                  : messageType === 'warning'
                  ? 'bg-orange-50 border !border-chart-8 dark:bg-orange-900/20 dark:border-orange-800'
                  : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  {messageType === 'success' ? (
                    <FiCheckCircle className="text-green-600 dark:text-green-400 text-lg flex-shrink-0" />
                  ) : messageType === 'warning' ? (
                    <FiAlertCircle className="text-orange-600 dark:text-orange-400 text-lg flex-shrink-0" />
                  ) : (
                    <FiAlertCircle className="text-red-600 dark:text-red-400 text-lg flex-shrink-0" />
                  )}
                  
                  <p 
                    className="text-gray-900 dark:text-white font-semibold text-sm text-center"
                    style={{ fontFamily: '"Amiri", "Times New Roman", serif' }}>
                    {message}
                  </p>
                </div>
                
                {showUnsubscribe && (
                  <button
                    onClick={handleUnsubscribe}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-6 rounded-full transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ fontFamily: '"Amiri", "Times New Roman", serif' }}>
                    {isLoading ? <FiLoader className="animate-spin inline" /> : '📧 إرسال رابط الإلغاء'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* المحتوى الرئيسي */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-16">
            
            {/* النصوص والأيقونات الاجتماعية */}
            <div className="mx-auto max-w-sm lg:max-w-none">
              <p 
                className="mt-2 text-center text-gray-500 lg:text-right text-sm lg:text-base dark:text-gray-400 leading-relaxed"
                style={{ fontFamily: '"Uthman", "Times New Roman", serif' }}>
                الموقع هذا يعتبر مصدر مفتوح لنشر القرآن الكريم وبجوده
                <br />
                هذا الموقع مفتوح المصدر وويمكنك أستعمال الكود في حسابي في قت هاب
                <br />
                وقريبا سيتم أنشآء تطبيقين ios & android platforms
              </p>

              <div className="mt-4 flex justify-center gap-4 lg:justify-start">
                <a
                  className="text-gray-700 transition hover:text-gray-900 dark:text-white dark:hover:text-gray-300"
                  href="https://github.com/Msr7799"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub">
                  <FaGithub className="size-6" />
                </a>

                <a
                  className="text-gray-700 transition hover:text-gray-900 dark:text-white dark:hover:text-gray-300"
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter">
                  <FaXTwitter className="size-6" />
                </a>

                <a
                  className="text-gray-700 transition hover:text-gray-900 dark:text-white dark:hover:text-gray-300"
                  href="https://msr-quran-data.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Website">
                  <FaGlobe className="size-6" />
                </a>
              </div>

              {/* زر المساعد الإسلامي */}
              <div className="mt-6 flex justify-center lg:justify-start">
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2" style={{ fontFamily: '"Amiri", "Times New Roman", serif' }}>
                  💡 ابحث عن الزر الأخضر العائم في الأسفل يسار الشاشة لفتح المساعد الإسلامي &ldquo;نور&rdquo; 🤖✨
                </p>
              </div>
            </div>

            {/* الكلمات المفتاحية */}
            <div className="grid grid-cols-2 gap-4 sm:gap-8 text-center lg:text-right">
              <div>
                <strong 
                  className="font-medium text-gray-900 dark:text-white text-sm sm:text-base"
                  style={{ fontFamily: '"Amiri", "Times New Roman", serif' }}>
                  الأساسيات القرآنية
                </strong>

                <ul className="mt-4 sm:mt-6 space-y-1">
                  {keywords.slice(0, 6).map((word, idx) => (
                    <li key={idx}>
                      <span
                        className="text-gray-700 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-default text-xs sm:text-sm"
                        style={{ fontFamily: '"Amiri", "Times New Roman", serif' }}>
                        {word}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong 
                  className="font-medium text-gray-900 dark:text-white text-sm sm:text-base"
                  style={{ fontFamily: '"Amiri", "Times New Roman", serif' }}>
                  البيانات والتقنية
                </strong>

                <ul className="mt-4 sm:mt-6 space-y-1">
                  {keywords.slice(6, 12).map((word, idx) => (
                    <li key={idx}>
                      <span
                        className="text-gray-700 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-default text-xs sm:text-sm"
                        style={{ fontFamily: '"Amiri", "Times New Roman", serif' }}>
                        {word}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800">
            <p 
              className="text-center text-xs sm:text-sm leading-relaxed text-gray-500 dark:text-gray-400"
              style={{ fontFamily: '"Amiri", "Times New Roman", serif' }}>
              اللهم أجعل هذا الموقع صدقه جاريه لي ولحمد المران ولاهل بيتنا ووالدينا وموتانا اللهم اغفر لهم ورحمهم ووفقنا لخدمة الدين
              <br />
              <br />
              اللهم أني أبتغي وجهك فبارك لنا فيه
              <br />
              <strong className="text-gray-700 dark:text-gray-300">
                📿 مـطور الموقع: محمد الـرميـحي | Msr7799
              </strong>
            </p>
          </div>
        </div>
      </footer>

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
