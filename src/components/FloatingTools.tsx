// المسار: src/components/FloatingTools.tsx — يوفر أدوات عائمة للصعود والمحادثة السريعة.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bot, ExternalLink, Globe2, MessageCircle, Send, Sparkles, Trash2, User, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatSources, SmartSourceLink, type ChatSource } from "./ChatSources";
import { useLocale } from "@/i18n/LocaleProvider";
import { LottiePlayer } from "./LottiePlayer";
import styles from "./FloatingTools.module.css";

type Message = { role: "user" | "assistant"; content: string; sources?: ChatSource[] };

// يدير الأدوات العائمة ونافذة المحادثة المصغرة.
export function FloatingTools() {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [error, setError] = useState("");
  const [online, setOnline] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const visibleMessages: Message[] = messages.length ? messages : [{ role: "assistant", content: t("ai.welcome") }];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = sessionStorage.getItem("noor-floating-chat");
      if (!saved) return;
      try { setMessages(JSON.parse(saved) as Message[]); } catch { sessionStorage.removeItem("noor-floating-chat"); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    // يغلق نافذة المحادثة عند ضغط مفتاح الهروب.
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" }); }, [messages, loading, reduceMotion]);

  useEffect(() => {
    const updateNetwork = () => setOnline(navigator.onLine);
    const updateScroll = () => setShowScrollTop(window.scrollY > 520);
    updateNetwork();
    updateScroll();
    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => {
      window.removeEventListener("online", updateNetwork);
      window.removeEventListener("offline", updateNetwork);
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  // يرسل سؤال المستخدم ويضيف إجابة المساعد.
  async function submit(event?: FormEvent) {
    event?.preventDefault();
    const content = input.trim();
    if (!content || loading) return;
    const next = [...visibleMessages, { role: "user" as const, content }];
    setMessages(next); setInput(""); setError(""); setLoading(true);
    sessionStorage.setItem("noor-floating-chat", JSON.stringify(next));
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gemini-2.5-flash", messages: next, webSearch, locale }),
        signal: AbortSignal.timeout(90_000),
      });
      const data = await response.json().catch(() => ({})) as { text?: string; error?: string; sources?: ChatSource[] };
      if (!response.ok || !data.text?.trim()) throw new Error(t("common.error"));
      const completed = [...next, { role: "assistant" as const, content: data.text, sources: data.sources }];
      setMessages(completed);
      sessionStorage.setItem("noor-floating-chat", JSON.stringify(completed));
    } catch (reason) {
      const timedOut = reason instanceof DOMException && reason.name === "TimeoutError";
      setError(timedOut ? `${t("common.error")}: ${t("common.loading")}` : reason instanceof Error ? reason.message : t("common.error"));
    } finally { setLoading(false); }
  }

  // يمسح سجل المحادثة ويعيد رسالة الترحيب.
  const clearChat = () => {
    setMessages([]); setError("");
    sessionStorage.removeItem("noor-floating-chat");
  };

  return <div className={styles.layer}>
    {!online && <div className={styles.offlineNotice} role="status" aria-live="polite"><LottiePlayer src="/lottie/noInternet.json" /><span>{locale === "ar" ? "لا يوجد اتصال بالإنترنت" : "No internet connection"}</span></div>}
    {showScrollTop && <button className={styles.scrollTop} type="button" onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })} aria-label={locale === "ar" ? "العودة إلى أعلى الصفحة" : "Back to top"}><LottiePlayer src="/lottie/arrow.json" /></button>}
    {pathname === "/" && <>
      <AnimatePresence>
        {isOpen && <motion.section className={styles.panel} role="dialog" aria-label={t("chat.title")} initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: .82, y: 28 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: .88, y: 22 }} transition={{ type: "spring", stiffness: 320, damping: 28 }}>
          <header className={styles.header}>
            <div className={styles.identity}><span className={styles.avatar}><Sparkles /><i className={styles.online} /></span><span className={styles.title}><strong>{t("chat.title")}</strong><small>{t("ai.connected")}</small></span></div>
            <div className={styles.controls}><button className={styles.iconButton} type="button" onClick={clearChat} aria-label={t("chat.clear")} title={t("chat.clear")}><Trash2 /></button><button className={styles.iconButton} type="button" onClick={() => setIsOpen(false)} aria-label={t("common.close")}><X /></button></div>
          </header>
          <div className={styles.messages} aria-live="polite">
            {visibleMessages.map((message,index) => <motion.article initial={reduceMotion ? false : { opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className={`${styles.message} ${message.role === "user" ? styles.user : ""}`} key={`${message.role}-${index}`}><span className={styles.messageIcon}>{message.role === "assistant" ? <Bot /> : <User />}</span><div className={styles.bubble}>{message.role === "assistant" ? <><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: SmartSourceLink }}>{message.content}</ReactMarkdown><ChatSources sources={message.sources} label={t("ai.sources")} /></> : message.content}</div></motion.article>)}
            {loading && <article className={styles.message}><span className={styles.messageIcon}><Bot /></span><div className={`${styles.bubble} ${styles.typing}`}><i /><i /><i /><span>{webSearch ? t("ai.searching") : t("ai.typing")}</span></div></article>}
            <div ref={bottomRef} />
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <form className={styles.composer} onSubmit={(event) => void submit(event)}><textarea ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submit(); } }} placeholder={t("chat.placeholder")} rows={1} maxLength={4000} /><button className={styles.send} type="submit" disabled={loading || !input.trim()} aria-label={t("chat.send")}><Send /></button></form>
          <div className={styles.footerLine}><button className={styles.webToggle} type="button" data-active={webSearch} onClick={() => setWebSearch((value) => !value)} aria-pressed={webSearch}><Globe2 /> {t("chat.tavilySearch")}</button><Link className={styles.fullLink} href="/chat-bot">{t("ai.fullPage")} <ExternalLink size={11} /></Link></div>
        </motion.section>}
      </AnimatePresence>
      {!isOpen && <motion.button className={styles.chatButton} type="button" aria-label={t("chat.title")} title={t("chat.title")} whileHover={reduceMotion ? undefined : { rotate: [0,-5,5,0] }} whileTap={{ scale: .92 }} onClick={() => setIsOpen(true)}><span className={styles.ring} /><MessageCircle /><span className={styles.badge}><Sparkles /></span></motion.button>}
    </>}
  </div>;
}
