// المسار: src/components/NoorChat.tsx — يوفر واجهة المحادثة مع المساعد وإظهار المصادر.
"use client";

import { Bot, Globe2, Send, Sparkles, Trash2, User } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatSources, SmartSourceLink, type ChatSource } from "./ChatSources";
import { useLocale } from "@/i18n/LocaleProvider";
import { SelectDropdown } from "./ui/dropdown-menu";

type Message = { role: "user" | "assistant"; content: string; sources?: ChatSource[] };
type Stage = "searching" | "thinking" | "typing" | null;
const models = [
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite" },
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash-Lite" },
];
// يدير رسائل واجهة المساعد وحالات الإرسال.
export function NoorChat() {
  const { locale, t } = useLocale();
  const [model, setModel] = useState("gemini-2.5-flash");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<Stage>(null);
  const [webSearch, setWebSearch] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const loading = stage !== null;
  const visibleMessages: Message[] = messages.length ? messages : [{ role: "assistant", content: t("ai.welcome") }];
  const shortcuts = [t("ai.prompt1"), t("ai.prompt2"), t("ai.prompt3"), t("ai.prompt4")];
  const stageLabels = { searching: t("ai.searching"), thinking: t("ai.thinking"), typing: t("ai.typing") };
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, stage]);

  // يرسل السؤال إلى واجهة المحادثة ويعرض النتيجة.
  async function submit(event?: FormEvent, suggestion?: string) {
    event?.preventDefault();
    const content = (suggestion ?? input).trim();
    if (!content || loading) return;
    const nextMessages = [...visibleMessages, { role: "user" as const, content }];
    setMessages(nextMessages); setInput(""); setError(""); setStage(webSearch ? "searching" : "thinking");
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model, messages: nextMessages, webSearch, locale }), signal: AbortSignal.timeout(90_000) });
      const data = await response.json().catch(() => ({})) as { text?: string; error?: string; sources?: ChatSource[] };
      if (!response.ok || !data.text?.trim()) throw new Error(t("common.error"));
      setMessages((current) => [...current, { role: "assistant", content: data.text!, sources: data.sources }]);
    } catch (reason) {
      const timedOut = reason instanceof DOMException && reason.name === "TimeoutError";
      setError(timedOut ? `${t("common.error")}: ${t("common.loading")}` : reason instanceof Error ? reason.message : t("common.error"));
    } finally { setStage(null); }
  }

  return <main className="noor-page">
    <header className="noor-heading"><span><Sparkles /> {t("ai.badge")}</span><h1>Noor AI</h1><p>{t("ai.description")}</p></header>
    <section className="noor-shell">
      <div className="noor-toolbar"><SelectDropdown value={model} onValueChange={setModel} options={models} ariaLabel={t("chat.model")} /><div className="noor-tools"><button type="button" className={webSearch ? "active" : ""} onClick={() => setWebSearch((value) => !value)} aria-pressed={webSearch}><Globe2 /> {t("chat.tavilySearch")}</button><button type="button" onClick={() => { setMessages([]); setError(""); }}><Trash2 /> {t("chat.clear")}</button></div></div>
      <div className="noor-shortcuts">{shortcuts.map((question) => <button type="button" onClick={() => void submit(undefined, question)} key={question}>{question}</button>)}</div>
      <div className="noor-messages" aria-live="polite">
        {visibleMessages.map((message, index) => <article className={message.role} key={`${message.role}-${index}`}><span>{message.role === "assistant" ? <Bot /> : <User />}</span>{message.role === "assistant" ? <div className="noor-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: SmartSourceLink }}>{message.content}</ReactMarkdown><ChatSources sources={message.sources} label={t("ai.sources")} /></div> : <p>{message.content}</p>}</article>)}
        {stage && <article className="assistant loading"><span><Bot /></span><div className="noor-stage"><i /><i /><i /><b>{stageLabels[stage]}</b></div></article>}
        <div ref={bottomRef} />
      </div>
      {error && <p className="noor-error" role="alert">{error}</p>}
      <form className="noor-input" onSubmit={(event) => void submit(event)}><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submit(); } }} placeholder={t("chat.placeholder")} rows={2} maxLength={4000} /><button type="submit" disabled={loading || !input.trim()} aria-label={t("chat.send")}><Send /></button></form>
    </section>
  </main>;
}
