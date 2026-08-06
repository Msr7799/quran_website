// المسار: src/components/CollectionsCarousel.tsx — يعرض مجموعات المحتوى في شريط بطاقات متحرك.
"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Library, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";

type Collection = {
  bookNumber: number;
  bookName: string;
  aboutBook: string;
  parts_count: number;
};

// يفصل الأرقام لتطبيق خطها المخصص داخل النص.
function TextWithNumberFont({ children }: { children: string }) {
  return (
    <>
      {children.split(/(\p{N}+)/gu).map((part, index) =>
        /\p{N}/u.test(part) ? (
          <span className="number-font" key={index}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

// يعرض بطاقات المجموعات ويدير موضع الشريط.
export function CollectionsCarousel({ items }: { items: Collection[] }) {
  const { t } = useLocale();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing || items.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % items.length),
      8000,
    );
    return () => window.clearInterval(timer);
  }, [items.length, playing]);
  const item = items[index];
  if (!item) return null;
  // يحرّك شريط المجموعات في الاتجاه المطلوب.
  const go = (direction: number) =>
    setIndex((value) => (value + direction + items.length) % items.length);

  return (
    <section
      className="azkar-carousel collections-carousel"
      aria-roledescription="carousel"
      aria-label="مجموعات وكتب"
    >
      <header>
        <h3>
          <Library /> {t("ui.collections", "مجموعات وكتب")}
        </h3>
        <span className="number-font">
          {index + 1} / {items.length}
        </span>
      </header>
      <div className="azkar-slide-frame">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={item.bookNumber}
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -35 }}
            transition={{ duration: 0.3 }}
          >
            <small>
              <span className="number-font">{item.parts_count}</span> جزء
            </small>
            <h4>{item.bookName}</h4>
            <p>
              <TextWithNumberFont>{item.aboutBook}</TextWithNumberFont>
            </p>
          </motion.article>
        </AnimatePresence>
      </div>
      <footer>
        <button type="button" onClick={() => go(-1)} aria-label="الكتاب السابق">
          <ChevronRight />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "إيقاف الحركة" : "تشغيل الحركة"}
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <button type="button" onClick={() => go(1)} aria-label="الكتاب التالي">
          <ChevronLeft />
        </button>
        <div className="azkar-dots">
          {items.map((value, position) => (
            <button
              type="button"
              key={value.bookNumber}
              className={position === index ? "active" : ""}
              onClick={() => setIndex(position)}
              aria-label={`الكتاب ${position + 1}`}
            />
          ))}
        </div>
      </footer>
    </section>
  );
}
