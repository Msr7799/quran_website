// المسار: src/components/Header.tsx — يعرض رأس الموقع وأدوات التنقل والبحث والمظهر.
"use client";

import Image from "next/image";
import { cloudinaryAsset } from "@/lib/cloudinary-assets";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronsUp, Languages, LoaderCircle, Menu, Moon, Search, Sun, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { navigation } from "./icons";
import { localeInfo, useLocale } from "@/i18n/LocaleProvider";

// يدير قائمة التنقل والبحث وتبديل المظهر.
export function Header() {
  const pathname = usePathname(); const router = useRouter();
  const { locale, setLocale, t } = useLocale();
  const [menu, setMenu] = useState(false); const [languagesOpen, setLanguagesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); const [dark, setDark] = useState(true); const [query, setQuery] = useState("");
  const [navigating, setNavigating] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const railRef = useRef<HTMLElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => { const saved = localStorage.getItem("theme"); const value = saved ? saved === "dark" : true; queueMicrotask(() => setDark(value)); document.documentElement.dataset.theme = value ? "dark" : "light"; document.documentElement.style.colorScheme = value ? "dark" : "light"; }, []);
  useEffect(() => { queueMicrotask(() => setNavigating(false)); }, [pathname]);
  useEffect(() => {
    // يبدأ تتبع السحب من حافة الشاشة السفلية أو من القائمة المفتوحة.
    const onTouchStart = (event: TouchEvent) => {
      if (!window.matchMedia("(max-width: 780px)").matches) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const startedOnRail = railRef.current?.contains(event.target as Node) ?? false;
      touchStart.current = touch.clientY >= window.innerHeight - 110 || startedOnRail
        ? { x: touch.clientX, y: touch.clientY }
        : null;
    };

    // يفتح القائمة بالسحب للأعلى ويغلقها بالسحب للأسفل فوقها.
    const onTouchEnd = (event: TouchEvent) => {
      const start = touchStart.current;
      const touch = event.changedTouches[0];
      touchStart.current = null;
      if (!start || !touch) return;
      const verticalDistance = start.y - touch.clientY;
      const horizontalDistance = Math.abs(start.x - touch.clientX);
      if (Math.abs(verticalDistance) < 45 || Math.abs(verticalDistance) <= horizontalDistance * 1.2) return;
      if (verticalDistance > 0) {
        setMenu(true);
        setShowSwipeHint(false);
      } else {
        setMenu(false);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);
  // يبدّل بين المظهر الفاتح والداكن ويحفظ الاختيار.
  function toggleTheme() { const value = !dark; setDark(value); document.documentElement.dataset.theme = value ? "dark" : "light"; document.documentElement.style.colorScheme = value ? "dark" : "light"; localStorage.setItem("theme", value ? "dark" : "light"); }
  // ينقل المستخدم إلى صفحة نتائج البحث.
  function search(event: FormEvent) { event.preventDefault(); if (query.trim()) { router.push(`/search/${encodeURIComponent(query.trim())}`); setSearchOpen(false); } }
  const basmala = <>
    <Image className="basmala-image basmala-light" src={cloudinaryAsset("/images/basmalh-light.svg")} width={520} height={120} loading="eager" style={{ width: "100%", height: "auto" }} alt="" />
    <Image className="basmala-image basmala-dark" src={cloudinaryAsset("/images/basmalh-dark.svg")} width={520} height={120} loading="eager" style={{ width: "100%", height: "auto" }} alt="" />
  </>;
  return <>
    <header className={pathname === "/" ? "basmala-header home-basmala-header" : "basmala-header"}>{pathname === "/" ? <span aria-label="القرآن المجيد">{basmala}</span> : <Link href="/" prefetch={false} aria-label="القرآن المجيد">{basmala}</Link>}</header>
    <button className="site-logo" type="button" onClick={() => setMenu((value) => !value)} aria-label="فتح القائمة الرئيسية" aria-expanded={menu}><Image src={cloudinaryAsset("/alf.png")} width={1028} height={884} alt="شعار القرآن المجيد" priority /></button>
    <button className="language-orb" onClick={() => setLanguagesOpen(!languagesOpen)} aria-label="اختيار اللغة"><Languages /><small>{locale.toUpperCase()}</small></button>
    {languagesOpen && <aside className="language-panel"><header><strong>اختر اللغة / Select Language</strong><button onClick={() => setLanguagesOpen(false)}><X /></button></header><div>{Object.entries(localeInfo).map(([code, language]) => <button className={locale === code ? "selected" : ""} onClick={() => { setLocale(code as keyof typeof localeInfo); setLanguagesOpen(false); }} key={code}><span>{locale === code && <Check />}</span><strong>{language.native}<small>{language.english}</small></strong><b>{language.flag}</b></button>)}</div><footer>متوفر بـ 15 لغة · Powered by next-intl</footer></aside>}
    <button className="rail-trigger" onClick={() => setMenu(!menu)} aria-label="القائمة">{menu ? <X /> : <Menu />}</button>
    {!menu && showSwipeHint && <div className="mobile-rail-swipe-hint" aria-hidden="true"><ChevronsUp /></div>}
    <aside ref={railRef} className={menu ? "floating-rail open" : "floating-rail"}>
      <button onClick={() => setSearchOpen(true)} data-label={t("common.search", "البحث")}><Search /></button>
      {navigation.map((item) => { const Icon = item.icon; const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)); const label = t(item.translationKey, item.label); return active ? <button className="active" type="button" data-label={label} aria-label={label} key={item.href}><Icon /></button> : <Link href={item.href} prefetch={false} onClick={() => { setNavigating(true); setMenu(false); }} data-label={label} aria-label={label} key={item.href}><Icon /></Link>; })}
      <button className="theme-rail" onClick={toggleTheme} data-label="تبديل المظهر">{dark ? <Sun /> : <Moon />}</button>
    </aside>
    {navigating && <div className="route-loading-overlay" role="status" aria-live="polite"><span><LoaderCircle className="spin" /></span><strong>{t("common.loading", "جاري التحميل...")}</strong></div>}
    {searchOpen && <div className="search-overlay" onClick={() => setSearchOpen(false)}><form onSubmit={search} onClick={(e) => e.stopPropagation()}><button type="button" onClick={() => setSearchOpen(false)}><X /></button><Search /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("homepage.searchPlaceholder", "ابحث في القرآن الكريم...")} /><button className="search-submit">{t("common.search", "بحث")}</button></form></div>}
  </>;
}
