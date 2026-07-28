"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { SurahMeta } from "@/lib/types";

const PAGE_SIZE = 12;

export function SurahGrid({ surahs, compact = false }: { surahs: SurahMeta[]; compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const filtered = useMemo(() => surahs.filter((surah) => `${surah.name.ar} ${surah.name.en} ${surah.name.transliteration} ${surah.number}`.toLowerCase().includes(query.toLowerCase())), [query, surahs]);
  const searching = Boolean(query.trim());
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = searching ? filtered : filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const navigate = (nextPage: number) => { setDirection(nextPage > page ? 1 : -1); setPage(nextPage); };

  return <div className="surah-directory">
    <label className="filter-input"><Search /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="ابحث باسم السورة أو رقمها" /></label>
    <div className="surah-pages">
      {!searching && <button type="button" className="surah-page-arrow previous" disabled={page === 0} onClick={() => navigate(page - 1)} aria-label="دفعة السور السابقة"><ChevronRight /></button>}
      <div className="surah-page-window">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div className={`surah-grid ${compact ? "compact" : ""}`} key={searching ? query : page} custom={direction} variants={{ enter: (side: number) => ({ opacity: 0, x: side > 0 ? -120 : 120 }), center: { opacity: 1, x: 0 }, exit: (side: number) => ({ opacity: 0, x: side > 0 ? 120 : -120 }) }} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 210, damping: 26 }}>
            {visible.map((surah) => <Link className="surah-card" href={`/quran/${surah.number}`} key={surah.number}><span className="surah-number number-font">{surah.number}</span><span><strong>سورة {surah.name.ar}</strong><small>{surah.name.transliteration}</small></span><span className="surah-meta"><span className="number-font">{surah.verses_count}</span> آية</span></Link>)}
            {!visible.length && <p className="surah-empty">لا توجد سورة مطابقة للبحث.</p>}
          </motion.div>
        </AnimatePresence>
      </div>
      {!searching && <button type="button" className="surah-page-arrow next" disabled={page >= pageCount - 1} onClick={() => navigate(page + 1)} aria-label="دفعة السور التالية"><ChevronLeft /></button>}
    </div>
    {!searching && <div className="surah-page-indicator"><span className="number-font">{page + 1}</span><i>/</i><span className="number-font">{pageCount}</span></div>}
  </div>;
}
