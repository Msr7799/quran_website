import IslamicChatInline from '../components/IslamicChatInline';
import Head from 'next/head';

export default function ChatBot() {
  return (
    <>
      <Head>
        <title>المساعد الإسلامي - نور | موقع القرآن الكريم</title>
        <meta name="description" content="مساعد إسلامي ذكي للإجابة على أسئلتك الدينية" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-chart-17 via-chart-17 to-neutral-800">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-chart-10 blur-2xl opacity-50 animate-pulse" />
                <div className="relative bg-chart-4 text-white p-6 rounded-full">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl pb-4 py-14 pt-3 mb-20 md:text-6xl font-bold mb-6 bg-gradient-to-r from-chart-3 to-chart-16 bg-clip-text text-transparent">
              نور - المساعد الإسلامي الذكي
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-neutral-300 mb-8 leading-relaxed">
              مساعدك الشخصي للإجابة على أسئلتك الدينية
              <br />
              بذكاء اصطناعي متقدم ومعرفة إسلامية شاملة
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-chart-13 rounded-2xl p-6 shadow-lg shadow-2xl shadow-[rgba(0, 0, 0, 0.6)]  border border-chart-3">
                <div className="text-4xl mb-3">📖</div>
                <h3 className="text-lg font-bold text-white mb-2">تفسير القرآن</h3>
                <p className="text-neutral-300 text-sm">
                  تفسير الآيات القرآنية وشرح معانيها بأسلوب واضح ومفصل
                </p>
              </div>

              <div className="bg-chart-13 rounded-2xl p-6 shadow-lg shadow-2xl shadow-[rgba(0, 0, 0, 0.6)]  border border-chart-3">
                <div className="text-4xl mb-3">📿</div>
                <h3 className="text-lg font-bold text-white mb-2">شرح الأحاديث</h3>
                <p className="text-neutral-300 text-sm">
                  شرح الأحاديث النبوية الصحيحة وبيان فقهها وفوائدها
                </p>
              </div>

              <div className="bg-chart-13 rounded-2xl p-6 shadow-lg shadow-2xl shadow-[rgba(0, 0, 0, 0.6)]  border border-chart-3">
                <div className="text-4xl mb-3">🕌</div>
                <h3 className="text-lg font-bold text-white mb-2">الفقه والفتاوى</h3>
                <p className="text-neutral-300 text-sm">
                  إجابات شرعية موثوقة في العبادات والمعاملات
                </p>
              </div>

              <div className="bg-chart-13 rounded-2xl p-6 shadow-lg shadow-2xl shadow-[rgba(0, 0, 0, 0.6)]  border border-chart-3">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="text-lg font-bold text-white mb-2">العقيدة والتوحيد</h3>
                <p className="text-neutral-300 text-sm">
                  شرح مسائل العقيدة والإيمان على منهج أهل السنة
                </p>
              </div>


              <div className="bg-chart-13 rounded-2xl p-6 shadow-lg shadow-2xl shadow-[rgba(0, 0, 0, 0.6)]  border border-chart-3">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-lg font-bold text-white mb-2">السيرة النبوية</h3>
                <p className="text-neutral-300 text-sm">
                  قصص من حياة النبي ﷺ والصحابة والأنبياء
                </p>
              </div>

              <div className="bg-chart-13 rounded-2xl p-6 shadow-lg shadow-2xl shadow-[rgba(0, 0, 0, 0.6)]  border border-chart-3">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="text-lg font-bold text-white mb-2">متعدد اللغات</h3>
                <p className="text-neutral-300 text-sm">
                  يجيب بلغتك المفضلة مع دعم كامل للعربية والإنجليزية
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12">
              <p className="text-lg text-neutral-300 mb-4">
                👇 ابدأ المحادثة مع المساعد الإسلامي مباشرة
              </p>
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-6 py-3 rounded-full text-sm font-medium">
                <span className="animate-pulse">●</span>
                جاهز للإجابة على أسئلتك الآن
              </div>
            </div>
          </div>
        </div>

        {/* Chatbot Section */}
        <div className="container mx-auto px-4 pb-16">
          <IslamicChatInline />
        </div>
      </div>
    </>
  );
}
