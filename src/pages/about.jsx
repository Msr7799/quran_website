// pages/about.jsx
import SeoHead from '../components/SeoHead';
import styles from '../styles/About.module.css';
import { FaInfoCircle, FaHome, FaEnvelope, FaCode } from 'react-icons/fa';
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
          <h2 className={styles.title}><FaCode className={styles.titleIcon} title='التكنولوجيا المستخدمة' aria-label='التكنولوجيا المستخدمة' /> التكنولوجيا المستخدمة</h2>
          <p className={styles.paragraph}>
            تم بناء هذا الموقع باستخدام أحدث التقنيات والأدوات لضمان أداء عالٍ وتجربة مستخدم ممتازة:
          </p>
          <div className={styles.techGrid}>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/Next.js-OaGXgRZeP_brandlogos.net.svg" alt="Next.js"  fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>Next.js</span>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/react-logo-A60AB5e1_brandlogos.net.svg" alt="React" fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>React</span>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/node.js-logo-brandlogos.net_9gb0f3wp3.svg" alt="Node.js" fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>Node.js</span>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/MongoDB.svg" alt="MongoDB" fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>MongoDB</span>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/tailwind-css-logo-brandlogos.net_lx9ncaaci.svg" alt="Tailwind CSS" fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>Tailwind CSS</span>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/vercel-logo-brandlogos.net_z7tyu1fer.svg" alt="Vercel" fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>Vercel</span>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/github-wordmark-logo-brandlogos.net_8jszq0y8b.svg" alt="GitHub" fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>GitHub</span>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/postman-logo-brandlogos.net_394yrhhe5.svg" alt="Postman" fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>Postman</span>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/SQLite-kATlFTaf_brandlogos.net.svg" alt="SQLite" fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>SQLite</span>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/i6.svg" alt="API Development" fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>API Development</span>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/b3.svg" alt="Backend Services" fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>Backend Services</span>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/p5.svg" alt="Performance" fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>Performance</span>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/p6.svg" alt="Progressive Web App" fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>Progressive Web App</span>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techIconWrapper}>
                <Image src="/about/window.svg" alt="Cross Platform" fill className={styles.techIcon} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.techName}>Cross Platform</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.title}><FaEnvelope className={styles.titleIcon} title='معلومات المطور' aria-label='معلومات المطور' /> المطور</h2>
          <p className='mb-7'> موقع بيانات القرآن يوفر api لانشاء مواقع القرآن الكريم يحمل على بيانات للتحميل الماشر ويمكنك أستعمال ال endpoints

          </p>
          <div style={{ marginBottom: 16, position: 'relative', width: '100%', height: '300px' }}>
            <a href="https://msr-quran-data.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer', display: 'block', position: 'relative', width: '100%', height: '100%' }}>
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
            </a>
          </div>
          <div className={styles.developerImageContainer}>
            <a href="https://github.com/msr7799" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer', display: 'block' }}>
              <Image
                src="/about/about-me.gif"
                alt="حساب GitHub للمطور"
                width={800}
                height={400}
                className={styles.developerImage}
                title='حساب GitHub للمطور'
                priority
              />
            </a>
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