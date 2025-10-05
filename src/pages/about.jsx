// pages/about.jsx
import SeoHead from '../components/SeoHead';
import styles from '../styles/About.module.css';
import { FaInfoCircle, FaHome, FaEnvelope } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function About() {
  const [mounted, setMounted] = useState(false);

  // حل مشكلة hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // أو يمكنك إرجاع loader
  }

  return (
    <>
      <SeoHead
        title="من نحن - موقع القرآن الكريم"
        description="تعرف على موقع القرآن الكريم ورؤيته لتقديم محتوى متكامل للقرآن الكريم."
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/about`}
        image={`${process.env.NEXT_PUBLIC_BASE_URL}/images/about-image.jpg`}
        keywords="موقع القرآن الكريم, معلومات عنا, رؤية الموقع"
      />
      <div style={{
        backgroundColor: '#0d1117',
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
      }}>
        <main className={styles.container}>
        <section className={styles.section}>
          <h1 className={styles.title}><FaHome className={styles.titleIcon} title='من نحن' aria-label='من نحن' /> من نحن</h1>
          <p className={styles.paragraph} title='بحمد الله وتوفيقه نقدم موقع القرآن الكريم' aria-label='بحمد الله وتوفيقه نقدم موقع القرآن الكريم'>
            بحمد الله وتوفيقه، نقدم موقع القرآن الكريم الذي يهدف إلى تقديم محتوى شامل ومتقدم يخص كتاب الله العزيز، 
            بما في ذلك فهرس القرآن وملفات PDF و MP3 وصفحات للقراء. نسأل الله العلي العظيم أن يجعل هذا العمل 
            في ميزان الحسنات، وأن ينفع به المسلمين في كل مكان.
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.title}><FaInfoCircle className={styles.titleIcon} title='رؤيتنا' aria-label='رؤيتنا' /> رؤيتنا</h2>
          <p className={styles.paragraph}>
            رؤيتنا بأن يكون عندنا موقع يقدم جميع ما يخدم كتاب الله ويجعل وصوله سهلاً لكل العالم، ومساعدة المطورين على الحصول على بيانات القرآن لعمل برامج القرآن. وكل البيانات تم توفيرها من مجمع الملك فهد لطباعة المصحف الشريف ومن منبرهم الرسمي.
          </p>
          <p className={styles.paragraph}>
            نسعى لإنشاء مكتبة دينية متكاملة تشمل علوم القرآن والتجويد والفقه والتوحيد والأحاديث وصور من حياة الأنبياء والتفاسير والمعاجم. نهدف بإذن الله للوصول إلى العالم وتوفير هذه المراجع والبيانات الإسلامية ورفع كلمة الله.
          </p>
          <p className={styles.paragraph}>
            من نظرتنا أننا نطمح بأن يوفقنا الله لإنهاء البرنامج الخاص للهواتف في أقرب وقت ممكن بإذن الله.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.title}><FaEnvelope className={styles.titleIcon} title='معلومات المطور' aria-label='معلومات المطور' /> المطور</h2>
          <div style={{ marginBottom: 16, position: 'relative', width: '100%', height: '300px' }}>
            <Image
              src="/quran_data_website.png"
              alt="Quran Data Website"
              fill
              style={{ 
                objectFit: 'contain',
                borderRadius: 8 
              }}
              title='معلومات عن المطور'
              priority
            />
          </div>
          <p className={styles.paragraph}>
            هذا الموقع تم تطويره كجزء من مشروع لتقديم محتوى القرآن الكريم بشكل متكامل وسهل الاستخدام.
            نحن نؤمن بأهمية توفير موارد تعليمية ودينية عالية الجودة للمستخدمين.
          </p>
          <p className={styles.paragraph}>
            للمزيد من المعلومات أو للاستفسارات، لا تتردد في <a href="mailto:alromaihi2224@gmail.com" className={styles.link} title='تواصل عبر البريد الإلكتروني' aria-label='تواصل عبر البريد الإلكتروني'>التواصل معنا</a>.
          </p>
        </section>

        </main>
      </div>
    </>
  );
}