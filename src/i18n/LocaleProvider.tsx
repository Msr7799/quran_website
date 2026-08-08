"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { usePathname } from "next/navigation";
import ar from "@/messages/ar.json"; import en from "@/messages/en.json"; import tr from "@/messages/tr.json"; import hi from "@/messages/hi.json"; import ur from "@/messages/ur.json"; import ru from "@/messages/ru.json"; import es from "@/messages/es.json"; import fr from "@/messages/fr.json"; import de from "@/messages/de.json"; import it from "@/messages/it.json"; import pt from "@/messages/pt.json"; import zh from "@/messages/zh.json"; import ja from "@/messages/ja.json"; import ko from "@/messages/ko.json"; import id from "@/messages/id.json";
import { aboutTranslations } from "./aboutTranslations";
import { libraryTranslations } from "./libraryTranslations";
import { uiTranslations } from "./uiTranslations";
import { footerLiveTranslations } from "./footerLiveTranslations";
import { aiTranslations } from "./aiTranslations";
import { tafsirTranslations } from "./tafsirTranslations";
import { youtubeTranslations } from "./youtubeTranslations";
import { waqfTranslations } from "./waqfTranslations";

export const localeInfo = {
  ar: { native: "العربية", english: "Arabic", flag: "🇸🇦", dir: "rtl" }, en: { native: "English", english: "English", flag: "🇬🇧", dir: "ltr" }, tr: { native: "Türkçe", english: "Turkish", flag: "🇹🇷", dir: "ltr" }, hi: { native: "हिन्दी", english: "Hindi", flag: "🇮🇳", dir: "ltr" }, ur: { native: "اردو", english: "Urdu", flag: "🇵🇰", dir: "rtl" }, ru: { native: "Русский", english: "Russian", flag: "🇷🇺", dir: "ltr" }, es: { native: "Español", english: "Spanish", flag: "🇪🇸", dir: "ltr" }, fr: { native: "Français", english: "French", flag: "🇫🇷", dir: "ltr" }, de: { native: "Deutsch", english: "German", flag: "🇩🇪", dir: "ltr" }, it: { native: "Italiano", english: "Italian", flag: "🇮🇹", dir: "ltr" }, pt: { native: "Português", english: "Portuguese", flag: "🇧🇷", dir: "ltr" }, zh: { native: "中文", english: "Chinese", flag: "🇨🇳", dir: "ltr" }, ja: { native: "日本語", english: "Japanese", flag: "🇯🇵", dir: "ltr" }, ko: { native: "한국어", english: "Korean", flag: "🇰🇷", dir: "ltr" }, id: { native: "Bahasa Indonesia", english: "Indonesian", flag: "🇮🇩", dir: "ltr" },
} as const;
export type Locale = keyof typeof localeInfo;
type Messages = Record<string, unknown>;
const sourceMessages = { ar, en, tr, hi, ur, ru, es, fr, de, it, pt, zh, ja, ko, id } as const;
function mergeMessages(base: Messages, translated: Messages): Messages {
  const result: Messages = { ...base };
  for (const [key, value] of Object.entries(translated)) result[key] = value && typeof value === "object" && !Array.isArray(value) ? mergeMessages((result[key] as Messages) ?? {}, value as Messages) : value;
  return result;
}
const messages = Object.fromEntries(Object.entries(sourceMessages).map(([locale, value]) => {
  const content = footerLiveTranslations[locale as Locale];
  return [locale, mergeMessages(en as Messages, {
    ...value,
    about: aboutTranslations[locale as Locale],
    library: libraryTranslations[locale as Locale],
    ui: uiTranslations[locale as Locale],
    footer: { ...((value as Messages).footer as Messages), ...content.footer },
    live: content.live,
    ai: aiTranslations[locale as Locale],
    tafsir: tafsirTranslations[locale as Locale],
    youtube: youtubeTranslations[locale as Locale],
    waqf: waqfTranslations[locale as Locale],
  })];
})) as Record<Locale, Messages>;
function flatten(source: Messages, prefix = "", output: Record<string, string> = {}) { for (const [key, value] of Object.entries(source)) { const path = prefix ? `${prefix}.${key}` : key; if (typeof value === "string") output[path] = value; else if (value && typeof value === "object") flatten(value as Messages, path, output); } return output; }
const flat = Object.fromEntries(Object.entries(messages).map(([locale, value]) => [locale, flatten(value)])) as Record<Locale, Record<string, string>>;
const valueToKey = new Map<string, string>(); Object.values(flat).forEach((dictionary) => Object.entries(dictionary).forEach(([key, value]) => valueToKey.set(value.trim(), key)));
const excluded = ".arabic-verse,.basmala,[data-no-translate]";
function translateDom(locale: Locale) { const dictionary = flat[locale]; const root = document.getElementById("app-root"); if (!root) return; const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let node: Node | null; while ((node = walker.nextNode())) { const parent = node.parentElement; if (!parent || parent.closest(excluded) || ["SCRIPT", "STYLE", "OPTION"].includes(parent.tagName)) continue; const raw = node.textContent ?? ""; const clean = raw.trim(); const key = valueToKey.get(clean); const target = key && (dictionary[key] ?? flat.en[key] ?? flat.ar[key]); if (target && target !== clean) node.textContent = raw.replace(clean, target); } root.querySelectorAll<HTMLElement>("[placeholder],[title],[aria-label]").forEach((element) => ["placeholder", "title", "aria-label"].forEach((attribute) => { const value = element.getAttribute(attribute); const key = value && valueToKey.get(value.trim()); const target = key && (dictionary[key] ?? flat.en[key] ?? flat.ar[key]); if (target && target !== value) element.setAttribute(attribute, target); })); }
type LocaleState = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: string, fallback?: string) => string };
const LocaleContext = createContext<LocaleState>({ locale: "ar", setLocale: () => undefined, t: (_, fallback = "") => fallback });
export function LocaleProvider({ children }: { children: React.ReactNode }) { const pathname = usePathname(); const [locale, updateLocale] = useState<Locale>("ar"); useEffect(() => { const stored = localStorage.getItem("locale") as Locale | null; if (stored && stored in localeInfo) queueMicrotask(() => updateLocale(stored)); }, []); useEffect(() => { document.documentElement.lang = locale; document.documentElement.dir = localeInfo[locale].dir; localStorage.setItem("locale", locale); const frame = requestAnimationFrame(() => translateDom(locale)); return () => cancelAnimationFrame(frame); }, [locale, pathname]); const setLocale = useCallback((value: Locale) => updateLocale(value), []); const t = useCallback((key: string, fallback = key) => flat[locale][key] ?? flat.en[key] ?? flat.ar[key] ?? fallback, [locale]); const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]); return <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="Asia/Bahrain"><LocaleContext.Provider value={value}>{children}</LocaleContext.Provider></NextIntlClientProvider>; }
export const useLocale = () => useContext(LocaleContext);
