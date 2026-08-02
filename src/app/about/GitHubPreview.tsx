"use client";

import Image from "next/image";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { cloudinaryAsset } from "@/lib/cloudinary-assets";
import styles from "./about.module.css";

const DEFAULT_ZOOM = 1.25;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.25;

export function GitHubPreview() {
  const { t } = useLocale();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const centerImage = useCallback(() => {
    requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      viewport.scrollLeft = Math.max(0, (viewport.scrollWidth - viewport.clientWidth) / 2);
    });
  }, []);

  useEffect(() => {
    centerImage();
  }, [centerImage, zoom]);

  return (
    <figure className={styles.githubPreview}>
      <div className={styles.githubToolbar} aria-label={t("about.zoomTools", "أدوات تكبير صورة حساب GitHub")}>
        <div className={styles.zoomControls}>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(MAX_ZOOM, value + ZOOM_STEP))}
            disabled={zoom >= MAX_ZOOM}
            aria-label={t("about.zoomIn", "تكبير الصورة")}
          >
            <Plus aria-hidden="true" />
          </button>
          <output aria-live="polite">{Math.round(zoom * 100)}%</output>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(MIN_ZOOM, value - ZOOM_STEP))}
            disabled={zoom <= MIN_ZOOM}
            aria-label={t("about.zoomOut", "تصغير الصورة")}
          >
            <Minus aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setZoom(DEFAULT_ZOOM)} aria-label={t("about.resetZoom", "إعادة ضبط التكبير")}>
            <RotateCcw aria-hidden="true" />
          </button>
        </div>
        <span>{t("about.dragHint", "اسحب أو مرّر لاستعراض الصورة")}</span>
      </div>

      <div
        ref={viewportRef}
        className={styles.githubScroll}
        tabIndex={0}
        role="region"
        aria-label={t("about.previewAria", "معاينة مكبرة وقابلة للتمرير لحساب المطور على GitHub")}
      >
        <Image
          className={styles.githubImage}
          src={cloudinaryAsset("/about/my-github.png")}
          alt={t("about.githubImageAlt", "صورة كاملة لحساب المطور على GitHub")}
          width={1920}
          height={2805}
          sizes="(max-width: 760px) 185vw, 900px"
          style={{ width: `${zoom * 100}%`, height: "auto" }}
          onLoad={centerImage}
        />
      </div>

      <figcaption className={styles.githubCaption}>
        <span>{t("about.previewCaption", "المعاينة تبدأ من المنتصف ويمكن التحكم بحجمها")}</span>
        <a href="https://github.com/msr7799" target="_blank" rel="noreferrer">{t("about.openGithub", "فتح الحساب على GitHub")}</a>
      </figcaption>
    </figure>
  );
}
