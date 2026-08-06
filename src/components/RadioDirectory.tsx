// المسار: src/components/RadioDirectory.tsx — يعرض دليل الإذاعات مع البحث والتشغيل.
"use client";
import { Pause, Play, Radio, Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Radio as RadioType } from "@/lib/types";

// يدير البحث في الإذاعات وتشغيل المحطة المختارة.
export function RadioDirectory({ radios }: { radios: RadioType[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<RadioType | null>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const filtered = useMemo(() => radios.filter((radio) => radio.name.includes(query)), [radios, query]);

  // يشغّل الإذاعة المحددة أو يوقف الإذاعة النشطة.
  async function toggle(radio: RadioType) {
    if (active?.id === radio.id) {
      audio.current?.pause();
      setActive(null);
      return;
    }

    setActive(radio);
    setTimeout(() => audio.current?.play(), 50);
  }

  return <>
    <label className="filter-input max-input">
      <Search />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن إذاعة أو قارئ" />
    </label>
    <div className="radio-grid">
      {filtered.map((radio) => <button className={active?.id === radio.id ? "radio-card active" : "radio-card"} key={radio.id} onClick={() => toggle(radio)}>
        <span><Radio /></span>
        <strong>{radio.name}</strong>
        {active?.id === radio.id ? <Pause /> : <Play />}
      </button>)}
    </div>
    {active && <audio ref={audio} src={active.url} autoPlay onPause={() => setActive(null)} />}
  </>;
}
