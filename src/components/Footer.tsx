// المسار: src/components/Footer.tsx — يعرض تذييل الموقع وروابطه ومعلوماته.
"use client";

import Image from "next/image";
import Link from "next/link";
import { GitFork, Globe2 } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { cloudinaryAsset } from "@/lib/cloudinary-assets";
import styles from "./Footer.module.css";

const channelUrl = "https://www.youtube.com/channel/UCseM-nFP_VlkEO7LveaD72Q";

// يعرض روابط التذييل وبيانات المشروع.
export function Footer() {
  const { t } = useLocale();
  const quranLinks = [
    { href: "/quran/1", label: t("footer.quranHome") },
    { href: "/quran/1", label: t("footer.surahs") },
    { href: "/search", label: t("footer.verseSearch") },
    { href: "/quran-pages/7", label: t("footer.quranPages") },
    { href: "/quran-sound", label: t("footer.recitations") },
    { href: "/quran-pdf", label: t("footer.mushafLibrary") },
  ];
  const siteLinks = [
    { href: "/live", label: t("footer.live") },
    { href: "/youtube", label: t("youtube.navigation", "محتوى اليوتيوب") },
    { href: "/calendar", label: t("footer.calendar") },
    { href: "/chat-bot", label: t("footer.noor") },
    { href: "/quran-reader", label: t("footer.reader") },
    { href: "/about", label: t("footer.about") },
    { href: "/manifest.webmanifest", label: t("footer.install") },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <section className={styles.channel} aria-labelledby="youtube-channel-title">
          <a href={channelUrl} target="_blank" rel="noopener noreferrer" className={styles.channelLogo} aria-label={t("footer.visitChannel")}>
            <Image src={cloudinaryAsset("/images/yt-logo.png")} width={112} height={112} sizes="112px" alt={t("footer.logoAlt")} />
          </a>
          <h2 id="youtube-channel-title">{t("footer.channelTitle")}</h2>
          <p>{t("footer.channelDesc")}</p>
          <a href={channelUrl} target="_blank" rel="noopener noreferrer" className={styles.youtubeButton}>
            <Image src={cloudinaryAsset("/images/youtube-icon.png")} width={30} height={30} alt="" aria-hidden="true" />
            <span>{t("footer.visitChannel")}</span>
          </a>
        </section>

        <div className={styles.mainContent}>
          <section className={styles.about}>
            <h2>{t("footer.siteTitle")}</h2>
            <p>{t("footer.siteDesc")}</p>
            <p>{t("footer.siteMission")}</p>
            <div className={styles.socialLinks}>
              <a href="https://github.com/Msr7799" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitFork /></a>
              <Link href="/about" aria-label={t("footer.about")}><Globe2 /></Link>
              <a href={channelUrl} target="_blank" rel="noopener noreferrer" aria-label={t("footer.channelTitle")}>
                <Image src={cloudinaryAsset("/images/youtube-icon.png")} width={24} height={24} alt="" aria-hidden="true" />
              </a>
            </div>
          </section>

          <nav className={styles.linkGroups} aria-label={t("footer.linksLabel")}>
            <div>
              <h3>{t("footer.quranBasics")}</h3>
              <ul>{quranLinks.map((item) => <li key={`${item.href}-${item.label}`}><Link href={item.href}>{item.label}</Link></li>)}</ul>
            </div>
            <div>
              <h3>{t("footer.siteServices")}</h3>
              <ul>{siteLinks.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul>
            </div>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>{t("footer.dedication")}</p>
          <strong>{t("footer.charity")}</strong>
        </div>
      </div>
    </footer>
  );
}
