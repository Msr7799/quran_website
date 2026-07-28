import { ExternalLink } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./ChatSources.module.css";

export type ChatSource = { title?: string; url: string };

function sourceMeta(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    return { host, favicon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64` };
  } catch {
    return { host: url, favicon: "" };
  }
}

export function SmartSourceLink({ href, children, ...props }: ComponentPropsWithoutRef<"a"> & { children?: ReactNode }) {
  const meta = href ? sourceMeta(href) : null;
  return <a {...props} href={href} className={styles.inlineLink} target="_blank" rel="noopener noreferrer">
    {meta?.favicon && <span className={styles.inlineFavicon} style={{ backgroundImage: `url(${meta.favicon})` }} aria-hidden="true" />}
    <span>{children}</span>
  </a>;
}

export function ChatSources({ sources, label }: { sources?: ChatSource[]; label: string }) {
  const unique = [...new Map((sources ?? []).filter((source) => source.url).map((source) => [source.url, source])).values()];
  if (!unique.length) return null;
  return <section className={styles.sources} aria-label={label}>
    <h4>{label}</h4>
    <div className={styles.grid}>
      {unique.map((source) => {
        const meta = sourceMeta(source.url);
        return <a className={styles.card} href={source.url} target="_blank" rel="noopener noreferrer" key={source.url} title={source.title || meta.host}>
          <span className={styles.favicon} style={{ backgroundImage: `url(${meta.favicon})` }} aria-hidden="true" />
          <span className={styles.text}><strong>{source.title || meta.host}</strong><small>{meta.host}</small></span>
          <ExternalLink className={styles.external} aria-hidden="true" />
        </a>;
      })}
    </div>
  </section>;
}
