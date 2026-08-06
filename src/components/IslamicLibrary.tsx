// المسار: src/components/IslamicLibrary.tsx — يعرض كتب ومصاحف المكتبة الإسلامية.
"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { BookOpen, Download, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { cloudinaryAsset } from "@/lib/cloudinary-assets";

const mushafs = [
  { title: "مصحف المدينة المنورة باللون الأزرق", en: "Madinah Mushaf — Blue", image: "001.png", fileSize: "160 MB", year: "1429 للهجرة", color: "أزرق", link: "https://archive.org/download/Quran-Kareem-Khawagah-The-Blue-Page-Quran/Quran-Kareem-Khawagah-The-Blue-Page-Quran.pdf" },
  { title: "مصحف المدينة المنورة باللون الأخضر", en: "Madinah Mushaf — Green", image: "002.png", fileSize: "158 MB", year: "1429 للهجرة", color: "أخضر", link: "https://archive.org/download/EQuran00001/E-Quran-00001.pdf" },
  { title: "مصحف المدينة المنورة الجوامعي الكبير", en: "Large Madinah Mushaf", image: "003.png", fileSize: "93 MB", year: "1427 للهجرة", color: "أزرق", link: "https://archive.org/download/arabic-568335686835685363568q3an1/arabic-quran2.pdf" },
  { title: "مصحف التجويد الملون", en: "Color Tajweed Mushaf", image: "004.png", fileSize: "192 MB", year: "1420 للهجرة", color: "ملونة", link: "https://archive.org/download/bensaoud_gmail_20170308_0721/%D9%85%D8%B5%D8%AD%D9%81%20%D8%A7%D9%84%D8%AA%D8%AC%D9%88%D9%8A%D8%AF%20%D8%A7%D9%84%D9%85%D9%84%D9%88%D9%86.pdf" },
  { title: "مصحف رواية ورش عن نافع", en: "Warsh ‘an Nafi‘ Mushaf", image: "005.png", fileSize: "146 MB", year: "1428 للهجرة", color: "أبيض", link: "https://archive.org/download/WARSHMADINAHE/WARSH__MADINAH.pdf" },
  { title: "مصحف رواية قالون عن نافع", en: "Qalun ‘an Nafi‘ Mushaf", image: "006.png", fileSize: "154 MB", year: "1431 للهجرة", color: "أبيض", link: "https://archive.org/download/0471Pdf_201804/0471%20%20%D9%83%D8%AA%D8%A7%D8%A8%20%D8%A7%D9%82%D8%B1%D8%A7%20%20%D8%A7%D9%88%D9%86%D9%84%D8%A7%D9%8A%D9%86%20%20%20%20%20pdf%20%20%20%20%20%D9%85%D8%B5%D8%AD%D9%81%20%D8%A7%D9%84%D9%85%D8%AF%D9%8A%D9%86%D8%A9%20%D8%A7%D9%84%D9%86%D8%A8%D9%88%D9%8A%D8%A9%20%D8%A8%D8%B1%D9%88%D8%A7%D9%8A%D8%A9%20%D9%82%D8%A7%D9%84%D9%88%D9%86%20%D8%B9%D9%86%20%D9%86%D8%A7%D9%81%D8%B9.pdf" },
  { title: "القرآن الكريم PDF للجوال", en: "Mobile Quran PDF", image: "007.png", fileSize: "4 MB", year: "غير معروف", color: "أبيض", link: "https://archive.org/download/EQuran00003/E-Quran-00003.pdf" },
  { title: "مصحف التجويد الملون مع تفسير الجلالين", en: "Color Tajweed with Tafsir Al-Jalalayn", image: "008.png", fileSize: "395 MB", year: "1420 للهجرة", color: "ملونة", link: "https://archive.org/download/Quran25/Quran25.pdf" },
  { title: "مصحف التفصيل الموضوعي ملون ومفهرس", en: "Indexed Thematic Detail Mushaf", image: "09.png", fileSize: "485 MB", year: "1428 للهجرة", color: "ملونة", link: "https://dn760105.eu.archive.org/0/items/quran-tafseer-mawdo/Quran_Tafseel-Mawdo_text.pdf" },
  { title: "المصحف الباكستاني ملون", en: "Color Pakistani Mushaf", image: "010.png", fileSize: "83 MB", year: "غير معروف", color: "ملونة", link: "https://archive.org/download/alquran16linescolourtajwidiwithcontents/Al%20Quran%20-%2016%20Lines%20Colour%20Tajwidi%20%28With%20Contents%29.pdf" },
  { title: "مصحف الأسماء والصفات والأفعال", en: "Mushaf of the Divine Names, Attributes and Actions", image: "012.png", fileSize: "577.3 MB", year: "2012-06-02", color: "أسود وذهبي", link: "https://dn711108.ca.archive.org/0/items/Moshaf_201504241323442/moshaf.pdf" },
] as const;

type JsonFile = { type: string; size?: string; url: string };
type JsonVolume = { volume: number; files: JsonFile[] };
type JsonBook = { title: { ar: string; en: string }; files?: JsonFile[]; volumes?: JsonVolume[] };
type JsonCategory = { name: string; books: JsonBook[] };
export type BooksPayload = { categories: JsonCategory[] };
type DisplayBook = { title: string; subtitle: string; image: string; href: string; size?: string };

// يبني اسم ملف غلاف الكتاب أو المجلد.
function coverName(book: JsonBook, volume?: number) {
  if (book.title.en === "Al-Fiqh_Al-Islami_Wa_Adillatuh") return `Al-Fiqh_Al-Islami_Wa_Adillatuh${volume}.png`;
  if (book.title.en === "Seeret_El-Naby") return volume ? `Seeret_El-Naby${volume}.png` : "Seeret_El-Naby_Cover.png";
  return `${book.title.en}.png`;
}

// يحوّل تصنيف الكتب ومجلداته إلى قائمة عرض مسطحة.
function flattenCategory(category: JsonCategory): DisplayBook[] {
  return category.books.flatMap((book) => book.volumes?.map((volume) => ({ title: `${book.title.ar} — الجزء ${volume.volume}`, subtitle: category.name, image: coverName(book, volume.volume), href: volume.files[0]?.url ?? "#", size: volume.files[0]?.size })) ?? [{ title: book.title.ar, subtitle: category.name, image: coverName(book), href: book.files?.[0]?.url ?? "#", size: book.files?.[0]?.size }]);
}

// يعرض بطاقة كتاب مع تفاصيل تظهر عند التفاعل.
function HoverBook({ item }: { item: DisplayBook }) {
  const ref = useRef<HTMLAnchorElement>(null); const x = useMotionValue(0); const y = useMotionValue(0);
  const left = useTransform(useSpring(x), [-.5, .5], ["45%", "68%"]); const top = useTransform(useSpring(y), [-.5, .5], ["35%", "65%"]);
  return <motion.a ref={ref} href={item.href} target="_blank" rel="noreferrer" className="library-book-link" initial="idle" whileHover="hover" onMouseMove={(event) => { const box = ref.current?.getBoundingClientRect(); if (box) { x.set((event.clientX - box.left) / box.width - .5); y.set((event.clientY - box.top) / box.height - .5); } }}>
    <span><strong>{item.title}</strong><small>{item.size ? `${item.subtitle} · ${item.size}` : item.subtitle}</small></span><ExternalLink />
    <motion.div className="hover-book-cover" style={{ left, top }} variants={{ idle: { opacity: 0, scale: .7 }, hover: { opacity: 1, scale: 1 } }}><Image src={cloudinaryAsset(`/images/library/${item.image}`)} alt={item.title} width={230} height={310} /></motion.div>
  </motion.a>;
}

// ينظّم المصاحف والكتب ويعرضها حسب اللغة.
export function IslamicLibrary({ booksPayload }: { booksPayload: unknown }) {
  const { locale, t } = useLocale(); const [open, setOpen] = useState(0);
  const bookCategories = (booksPayload as BooksPayload).categories ?? [];
  // يختار عنوان المصحف الملائم للغة الحالية.
  const localizedTitle = (item: typeof mushafs[number]) => locale === "ar" || locale === "ur" ? item.title : item.en;
  return <div className="library-page">
    <header className="library-hero"><span>{t("library.eyebrow", "المكتبة الإلكترونية")}</span><h1>{t("library.title", "مجموعة من المصاحف المتنوعة")}</h1><p>{t("library.description", "مصاحف وكتب إسلامية منتقاة بروابط مباشرة ونسخ عالية الجودة.")}</p></header>
    <section className="mushaf-accordion" aria-label={t("library.mushafs", "المصاحف المتاحة")}>{mushafs.map((item, index) => <div className={open === index ? "mushaf-panel open" : "mushaf-panel"} key={item.title}>
      <button onClick={() => setOpen(index)} aria-expanded={open === index}><BookOpen /><span>{localizedTitle(item)}</span></button>
      <AnimatePresence>{open === index && <motion.article initial={{ width: 0, opacity: 0 }} animate={{ width: "100%", opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ type: "spring", damping: 24 }} style={{ backgroundImage: `url(${cloudinaryAsset(`/images/library/quran_pdf/${item.image}`)})` }}><div><h2>{localizedTitle(item)}</h2><p>{t("library.mushafDescription", "نسخة واضحة ومزخرفة من المصحف الشريف مناسبة للقراءة والتحميل.")}</p><div className="mushaf-details"><span>{t("library.fileSize", "حجم الملف")}: {item.fileSize}</span><span>عام الطباعة: {item.year}</span><span>لون الخلفية: {item.color}</span></div><a href={item.link} target="_blank" rel="noreferrer"><Download /> {t("library.download", "تحميل المصحف")}</a></div></motion.article>}</AnimatePresence>
    </div>)}</section>
    <section className="islamic-books"><h2>{t("library.islamicBooks", "الكتب الإسلامية")}</h2>{bookCategories.map((category) => <div className="book-group" key={category.name}><h3>{category.name}</h3>{flattenCategory(category).map((item) => <HoverBook item={item} key={`${item.title}-${item.href}`} />)}</div>)}</section>
  </div>;
}
