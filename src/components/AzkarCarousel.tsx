"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";

type Zekr = { id: number; category: string; zekr: string; reference: string };

export function AzkarCarousel({ items }: { items: Zekr[] }) {
  const { t } = useLocale();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing || items.length < 2) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % items.length), 9000);
    return () => window.clearInterval(timer);
  }, [items.length, playing]);
  const item = items[index];
  if (!item) return null;
  const go = (direction: number) => setIndex((value) => (value + direction + items.length) % items.length);

  return <section className="azkar-carousel" aria-roledescription="carousel" aria-label="أذكار مختارة">
    <header><h3><Sparkles /> {t("ui.azkar", "أذكار مختارة")}</h3><span>{index + 1} / {items.length}</span></header>
    <div className="azkar-slide-frame"><AnimatePresence mode="wait" initial={false}><motion.article key={item.id} initial={{ opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -35 }} transition={{ duration: .3 }}>
      <small>{item.category}</small><p>{item.zekr}</p><span>{item.reference}</span>
    </motion.article></AnimatePresence></div>
    <footer><button type="button" onClick={() => go(-1)} aria-label="الذكر السابق"><ChevronRight /></button><button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "إيقاف الحركة" : "تشغيل الحركة"}>{playing ? <Pause /> : <Play />}</button><button type="button" onClick={() => go(1)} aria-label="الذكر التالي"><ChevronLeft /></button><div className="azkar-dots">{items.map((value, position) => <button type="button" key={value.id} className={position === index ? "active" : ""} onClick={() => setIndex(position)} aria-label={`الذكر ${position + 1}`} />)}</div></footer>
  </section>;
}
