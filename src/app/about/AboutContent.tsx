"use client";

import Image from "next/image";
import Link from "next/link";
import { Code2, House, Info, Mail } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { cloudinaryAsset } from "@/lib/cloudinary-assets";
import { GitHubPreview } from "./GitHubPreview";
import styles from "./about.module.css";

const technologies = [
  { name: "Next.js", image: "/about/Next.js-OaGXgRZeP_brandlogos.net.svg" },
  { name: "React", image: "/about/react-logo-A60AB5e1_brandlogos.net.svg" },
  { name: "Node.js", image: "/about/node.js-logo-brandlogos.net_9gb0f3wp3.svg" },
  { name: "MongoDB", image: "/about/MongoDB.svg" },
  { name: "Tailwind CSS", image: "/about/tailwind-css-logo-brandlogos.net_lx9ncaaci.svg" },
  { name: "Vercel", image: "/about/vercel-logo-brandlogos.net_z7tyu1fer.svg" },
  { name: "GitHub", image: "/about/github-wordmark-logo-brandlogos.net_8jszq0y8b.svg" },
  { name: "Postman", image: "/about/postman-logo-brandlogos.net_394yrhhe5.svg" },
  { name: "SQLite", image: "/about/SQLite-kATlFTaf_brandlogos.net.svg" },
  { name: "API Development", translationKey: "about.apiDevelopment", image: "/about/i6.svg" },
  { name: "Backend Services", translationKey: "about.backendServices", image: "/about/b3.svg" },
  { name: "Performance", translationKey: "about.performance", image: "/about/p5.svg" },
  { name: "Progressive Web App", translationKey: "about.progressiveWebApp", image: "/about/p6.svg" },
];

export function AboutContent() {
  const { t } = useLocale();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.section} aria-labelledby="about-us">
          <h1 id="about-us" className={styles.title}><House aria-hidden="true" />{t("about.aboutUs", "من نحن")}</h1>
          <p>{t("about.aboutIntro", "بحمد الله وتوفيقه، نقدم موقع القرآن الكريم الذي يهدف إلى تقديم محتوى شامل ومتقدم يخص كتاب الله العزيز، بما في ذلك فهرس القرآن وملفات PDF وMP3 وصفحات للقراء. نسأل الله العلي العظيم أن يجعل هذا العمل في ميزان الحسنات، وأن ينفع به المسلمين في كل مكان.")}</p>
        </section>

        <section className={styles.section} aria-labelledby="our-vision">
          <h2 id="our-vision" className={styles.title}><Info aria-hidden="true" />{t("about.vision", "رؤيتنا")}</h2>
          <p>{t("about.visionOne", "رؤيتنا أن يكون لدينا موقع يقدم كل ما يخدم كتاب الله ويجعل الوصول إليه سهلًا للعالم، مع مساعدة المطورين على الحصول على بيانات القرآن لبناء البرامج القرآنية. وقد تم توفير البيانات من مجمع الملك فهد لطباعة المصحف الشريف ومن منبره الرسمي.")}</p>
          <p>{t("about.visionTwo", "نسعى لإنشاء مكتبة دينية متكاملة تشمل علوم القرآن والتجويد والفقه والتوحيد والأحاديث وقصص الأنبياء والتفاسير والمعاجم. ونهدف بإذن الله إلى إيصال هذه المراجع والبيانات الإسلامية إلى العالم ورفع كلمة الله.")}</p>
          <p>{t("about.visionThree", "كما نطمح إلى إتمام التطبيق الخاص بالهواتف في أقرب وقت ممكن بإذن الله.")}</p>
        </section>

        <section className={styles.section} aria-labelledby="technologies">
          <h2 id="technologies" className={styles.title}><Code2 aria-hidden="true" />{t("about.technologies", "التكنولوجيا المستخدمة")}</h2>
          <p>{t("about.technologiesDesc", "تم بناء هذا الموقع باستخدام أحدث التقنيات والأدوات لضمان أداء عالٍ وتجربة مستخدم ممتازة:")}</p>
          <div className={styles.techGrid}>
            {technologies.map((technology) => (
              <article className={styles.techItem} key={technology.name}>
                <div className={styles.techIcon}>
                  <Image src={cloudinaryAsset(technology.image)} alt="" fill sizes="80px" unoptimized />
                </div>
                <span>{technology.translationKey ? t(technology.translationKey, technology.name) : technology.name}</span>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="developer">
          <h2 id="developer" className={styles.title}><Mail aria-hidden="true" />{t("about.developer", "المطور")}</h2>
          <p>{t("about.apiDescription", "موقع بيانات القرآن يوفر واجهة API لإنشاء مواقع القرآن الكريم، ويحتوي على بيانات للتحميل المباشر ونقاط نهاية جاهزة للاستخدام.")}</p>
          <a className={styles.projectImage} href="https://msr-quran-data.vercel.app/" target="_blank" rel="noreferrer">
            <Image src={cloudinaryAsset("/quran_data_website.png")} alt={t("about.quranDataAlt", "موقع بيانات القرآن الكريم")} width={1200} height={630} sizes="(max-width: 760px) 90vw, 720px" />
          </a>
          <GitHubPreview />
          <p>{t("about.developedDescription", "تم تطوير هذا الموقع كجزء من مشروع لتقديم محتوى القرآن الكريم بشكل متكامل وسهل الاستخدام. نؤمن بأهمية توفير موارد تعليمية ودينية عالية الجودة للمستخدمين.")}</p>
          <p>{t("about.contactLead", "للمزيد من المعلومات أو الاستفسارات، لا تتردد في")} {" "}<Link className={styles.link} href="mailto:alromaihi2224@gmail.com">{t("about.contactUs", "التواصل معنا")}</Link>.</p>
        </section>
      </div>
    </div>
  );
}
