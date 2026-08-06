// المسار: src/components/VerseActions.tsx — يوفر إجراءات نسخ الآية ومشاركتها.
"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

// يعرض أزرار نسخ نص الآية ومشاركته.
export function VerseActions({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  // ينسخ نص الآية إلى الحافظة.
  async function copy() { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }
  // يشارك نص الآية أو ينسخه عند تعذر المشاركة.
  async function share() { if (navigator.share) await navigator.share({ title: "آية من القرآن الكريم", text }); else await copy(); }
  return <div className="verse-actions"><button onClick={copy} aria-label="نسخ الآية">{copied ? <Check /> : <Copy />}</button><button onClick={share} aria-label="مشاركة الآية"><Share2 /></button></div>;
}
