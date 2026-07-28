"use client";

import Image from "next/image";
import {
  BookOpen,
  Clock3,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  Search,
  SkipBack,
  SkipForward,
  UserRound,
  Volume2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import type { Reciter, SurahMeta } from "@/lib/types";
import styles from "./AudioDirectory.module.css";

function audioUrl(server: string, surah: number) {
  return `${server.replace(/\/$/, "")}/${String(surah).padStart(3, "0")}.mp3`;
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function AudioDirectory({ reciters, surahs }: { reciters: Reciter[]; surahs: SurahMeta[] }) {
  const { locale, t } = useLocale();
  const audio = useRef<HTMLAudioElement>(null);
  const [reciter, setReciter] = useState(reciters[0]);
  const [surah, setSurah] = useState(surahs[0]);
  const [reciterQuery, setReciterQuery] = useState("");
  const [surahQuery, setSurahQuery] = useState("");
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [error, setError] = useState("");
  const useArabic = locale === "ar" || locale === "ur";

  const filteredReciters = useMemo(() => {
    const query = reciterQuery.trim().toLocaleLowerCase();
    return query ? reciters.filter((item) => `${item.reciter.ar} ${item.reciter.en}`.toLocaleLowerCase().includes(query)) : reciters;
  }, [reciterQuery, reciters]);

  const filteredSurahs = useMemo(() => {
    const query = surahQuery.trim().toLocaleLowerCase();
    return query ? surahs.filter((item) => `${item.number} ${item.name.ar} ${item.name.en} ${item.name.transliteration}`.toLocaleLowerCase().includes(query)) : surahs;
  }, [surahQuery, surahs]);

  const reciterName = useArabic ? reciter.reciter.ar : reciter.reciter.en;
  const narration = useArabic ? reciter.rewaya.ar : reciter.rewaya.en;
  const surahName = useArabic ? surah.name.ar : surah.name.en;
  const source = audioUrl(reciter.server, surah.number);

  function resetPlayback() {
    audio.current?.pause();
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError("");
  }

  function selectReciter(item: Reciter) {
    resetPlayback();
    setReciter(item);
  }

  function selectSurah(item: SurahMeta) {
    resetPlayback();
    setSurah(item);
  }

  async function togglePlayback() {
    const element = audio.current;
    if (!element) return;
    try {
      setError("");
      if (element.paused) {
        await element.play();
        setPlaying(true);
      } else {
        element.pause();
        setPlaying(false);
      }
    } catch {
      setPlaying(false);
      setError(useArabic ? "تعذّر تشغيل التلاوة. حاول مرة أخرى." : "The recitation could not be played. Please try again.");
    }
  }

  function changeSurah(offset: number) {
    const next = surahs[surah.number - 1 + offset];
    if (next) selectSurah(next);
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span><Headphones aria-hidden="true" /></span>
        <h1>{useArabic ? "استماع القرآن الكريم" : t("quran.audioQuran", "Quran Audio")}</h1>
        <p>{t("quran.audioQuranDesc", "اختر قارئًا وسورة واستمتع بتلاوة نقية ومريحة.")}</p>
      </header>

      <section className={styles.selectionSection} aria-labelledby="audio-selection-title">
        <h2 id="audio-selection-title"><Volume2 aria-hidden="true" />{useArabic ? "اختر القارئ والسورة" : "Choose a reciter and surah"}</h2>
        <div className={styles.selectionGrid}>
          <section className={styles.selectionPanel} aria-labelledby="reciter-list-title">
            <h3 id="reciter-list-title"><UserRound aria-hidden="true" />{useArabic ? "اختر القارئ" : t("quran.reciter", "Choose reciter")}<b>{filteredReciters.length}</b></h3>
            <label className={styles.searchField}>
              <Search aria-hidden="true" />
              <input value={reciterQuery} onChange={(event) => setReciterQuery(event.target.value)} placeholder={useArabic ? "البحث عن القارئ" : "Search reciters"} />
            </label>
            <div className={styles.choiceList}>
              {filteredReciters.map((item) => {
                const active = item.id === reciter.id;
                return (
                  <button className={active ? styles.activeChoice : ""} type="button" onClick={() => selectReciter(item)} key={item.id} aria-pressed={active}>
                    <span className={styles.choiceIcon}><UserRound aria-hidden="true" /></span>
                    <span><strong>{useArabic ? item.reciter.ar : item.reciter.en}</strong><small>{useArabic ? item.rewaya.ar : item.rewaya.en}</small></span>
                    {active && <i>✓</i>}
                  </button>
                );
              })}
            </div>
          </section>

          <section className={styles.selectionPanel} aria-labelledby="surah-list-title">
            <h3 id="surah-list-title"><BookOpen aria-hidden="true" />{t("ui.chooseSurah", "اختر السورة")}<b>{filteredSurahs.length}</b></h3>
            <label className={styles.searchField}>
              <Search aria-hidden="true" />
              <input value={surahQuery} onChange={(event) => setSurahQuery(event.target.value)} placeholder={useArabic ? "البحث في السور" : "Search surahs"} />
            </label>
            <div className={styles.choiceList}>
              {filteredSurahs.map((item) => {
                const active = item.number === surah.number;
                return (
                  <button className={active ? styles.activeChoice : ""} type="button" onClick={() => selectSurah(item)} key={item.number} aria-pressed={active}>
                    <span className={styles.surahNumber}>{item.number}</span>
                    <span><strong>{useArabic ? `سورة ${item.name.ar}` : item.name.en}</strong><small>{item.verses_count} {useArabic ? "آية" : "verses"}</small></span>
                    {active && <i>✓</i>}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className={styles.selectionStatus}><Clock3 aria-hidden="true" /><span>{useArabic ? `تم اختيار سورة ${surah.name.ar} بصوت ${reciter.reciter.ar}` : `${surah.name.en} selected with ${reciter.reciter.en}`}</span></div>
      </section>

      <section className={styles.listeningStage} aria-label={useArabic ? "مشغل التلاوة" : "Recitation player"}>
        <div className={styles.reciterCard}>
          <span className={styles.reciterLogo}><Image src="/images/logo.png" width={736} height={736} sizes="70px" alt="" /></span>
          <h2>{reciterName}</h2>
          <p>{narration}</p>
        </div>

        <div className={styles.playerCard}>
          <div className={styles.nowPlaying}><span><strong>{reciterName}</strong><small>{useArabic ? `سورة ${surahName}` : surahName}</small></span><button type="button" onClick={resetPlayback} aria-label={useArabic ? "إعادة ضبط المشغل" : "Reset player"}><RotateCcw /></button></div>
          <input className={styles.progress} type="range" min="0" max={duration || 1} step="0.1" value={Math.min(currentTime, duration || 0)} onChange={(event) => { const next = Number(event.target.value); if (audio.current) audio.current.currentTime = next; setCurrentTime(next); }} aria-label={useArabic ? "موضع التشغيل" : "Playback position"} />
          <div className={styles.timeRow}><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
          <div className={styles.playerControls}>
            <button type="button" onClick={() => changeSurah(-1)} disabled={surah.number === 1} aria-label={useArabic ? "السورة السابقة" : "Previous surah"}><SkipForward /></button>
            <button className={styles.playControl} type="button" onClick={togglePlayback} aria-label={playing ? (useArabic ? "إيقاف مؤقت" : "Pause") : t("common.listenNow", "تشغيل التلاوة")}>{playing ? <Pause /> : <Play />}</button>
            <button type="button" onClick={() => changeSurah(1)} disabled={surah.number === 114} aria-label={useArabic ? "السورة التالية" : "Next surah"}><SkipBack /></button>
          </div>
          <label className={styles.volumeControl}><Volume2 aria-hidden="true" /><input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => { const next = Number(event.target.value); setVolume(next); if (audio.current) audio.current.volume = next; }} aria-label={useArabic ? "مستوى الصوت" : "Volume"} /></label>
          {error && <p className={styles.errorMessage} role="alert">{error}</p>}
          <audio ref={audio} src={source} preload="metadata" onLoadedMetadata={(event) => { event.currentTarget.volume = volume; setDuration(event.currentTarget.duration); }} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setError(useArabic ? "تعذّر تحميل ملف التلاوة." : "The recitation file could not be loaded.")} />
        </div>
      </section>

      <section className={styles.verseStage}>
        <div><Play aria-hidden="true" /><strong>{useArabic ? "آيات السورة أثناء التشغيل" : "Verses during playback"}</strong></div>
        <p>{playing ? (useArabic ? `أنت تستمع الآن إلى سورة ${surah.name.ar}` : `You are now listening to ${surah.name.en}`) : (useArabic ? "ستظهر معلومات التلاوة هنا عند بدء التشغيل..." : "Recitation information will appear here when playback starts...")}</p>
      </section>
    </div>
  );
}
