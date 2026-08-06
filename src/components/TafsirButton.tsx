// المسار: src/components/TafsirButton.tsx — يعرض نافذة التفسير ويدير نسخها ومشاركتها.
"use client";

import { BookOpenText, Check, Copy, LoaderCircle, Share2, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { localeInfo, type Locale, useLocale } from "@/i18n/LocaleProvider";
import { SelectDropdown } from "@/components/ui/dropdown-menu";

const editions = [
  ["ar.muyassar", "تفسير الميسر"], ["ar.jalalayn", "تفسير الجلالين"], ["ar.qurtubi", "تفسير القرطبي"],
  ["ar.waseet", "التفسير الوسيط"], ["ar.miqbas", "تنوير المقباس"],
] as const;
type Tafsir = { name: string; text: string; source: string; locale: Locale; model: string; aiGenerated: boolean };

// يجلب التفسير ويعرضه حسب اللغة والنسخة المختارة.
export function TafsirButton({ surah, ayah, surahName, arabicText }: { surah: number; ayah: number; surahName: string; arabicText: string }) {
  const { locale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [edition, setEdition] = useState("ar.muyassar");
  const [languageOverride, setLanguageOverride] = useState<Locale | null>(null);
  const [tafsir, setTafsir] = useState<Tafsir | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const language = languageOverride ?? locale;

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    let active = true;
    fetch(`/api/tafsir/${surah}/${ayah}?edition=${edition}&locale=${language}`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("tafsir"); return response.json(); })
      .then((value: Tafsir) => { if (active) setTafsir(value); })
      .catch((reason: unknown) => { if ((reason as { name?: string })?.name !== "AbortError" && active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [open, edition, language, surah, ayah]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // يغلق نافذة التفسير عند ضغط مفتاح الهروب.
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", closeOnEscape); };
  }, [open]);

  // يعيد تهيئة حالة التفسير قبل جلب نسخة جديدة.
  const reload = () => { setTafsir(null); setLoading(true); setError(false); setCopied(false); };
  // يغيّر نسخة التفسير ويطلب إعادة تحميلها.
  const changeEdition = (value: string) => { reload(); setEdition(value); };
  // يغيّر لغة التفسير ويطلب إعادة تحميله.
  const changeLanguage = (value: string) => { reload(); setLanguageOverride(value as Locale); };
  const shareText = tafsir ? `${t("tafsir.title")} — سورة ${surahName} (${surah}:${ayah})\n\n${tafsir.text}\n\n${arabicText}` : "";
  // ينسخ نص التفسير ومرجع الآية إلى الحافظة.
  async function copyTafsir() {
    if (!shareText || !navigator.clipboard) return;
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  // يشارك التفسير أو ينسخه عند تعذر المشاركة.
  async function shareTafsir() {
    if (!shareText) return;
    if (navigator.share) await navigator.share({ title: t("tafsir.title"), text: shareText, url: window.location.href }).catch(() => undefined);
    else await copyTafsir();
  }

  return <>
    <button className="tafsir-trigger" onClick={(event) => { event.stopPropagation(); reload(); setLanguageOverride(null); setOpen(true); }} aria-label={t("tafsir.title")}><BookOpenText /><span>{t("tafsir.trigger")}</span></button>
    {open && <div className="tafsir-overlay" onClick={() => setOpen(false)}><section className="tafsir-dialog" role="dialog" aria-modal="true" aria-labelledby="tafsir-title" onClick={(event) => event.stopPropagation()}>
      <header>
        <div><small>سورة {surahName} · {t("quran.ayah")} {ayah}</small><h2 id="tafsir-title">{t("tafsir.title")}</h2></div>
        <div className="tafsir-header-actions">
          <button onClick={copyTafsir} disabled={!tafsir} aria-label={copied ? t("tafsir.copied") : t("tafsir.copy")} title={copied ? t("tafsir.copied") : t("tafsir.copy")}>{copied ? <Check /> : <Copy />}</button>
          <button onClick={shareTafsir} disabled={!tafsir} aria-label={t("tafsir.share")} title={t("tafsir.share")}><Share2 /></button>
          <button onClick={() => setOpen(false)} aria-label={t("tafsir.close")} title={t("tafsir.close")}><X /></button>
        </div>
      </header>
      <div className="tafsir-selectors">
        <div className="select-label"><span>{t("tafsir.chooseEdition")}</span><SelectDropdown value={edition} onValueChange={changeEdition} ariaLabel={t("tafsir.chooseEdition")} options={editions.map(([value, label]) => ({ value, label }))} /></div>
        <div className="select-label"><span>{t("tafsir.chooseLanguage")}</span><SelectDropdown value={language} onValueChange={changeLanguage} ariaLabel={t("tafsir.chooseLanguage")} options={Object.entries(localeInfo).map(([value, info]) => ({ value, label: `${info.flag} ${info.native}`, searchText: `${info.native} ${info.english}` }))} /></div>
      </div>
      <div className="tafsir-content">
        {loading && <p className="tafsir-loading"><LoaderCircle className="spin" /> {t("tafsir.loading")}</p>}
        {error && <p className="tafsir-error">{t("tafsir.error")}</p>}
        {!loading && !error && tafsir && <>
          <div className="tafsir-ai-label"><Sparkles /> Gemini · {tafsir.name}</div>
          <p className="tafsir-ai-text" lang={language} dir={localeInfo[language].dir} data-no-translate>{tafsir.text}</p>
          <blockquote className="tafsir-arabic-verse" lang="ar" dir="rtl" data-no-translate>{arabicText}</blockquote>
        </>}
      </div>
      <footer><span><Sparkles /> {t("tafsir.aiNote")}</span><span>{t("tafsir.source")}: <a href="https://alquran.cloud/api" target="_blank" rel="noreferrer">Al Quran Cloud</a></span></footer>
    </section></div>}
  </>;
}
