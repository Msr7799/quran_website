"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type HeroCarouselProps = {
  desktopMedia: string[];
  mobileMedia: string[];
};

type HeroVideoProps = {
  active: boolean;
  label: string;
  onEnded: () => void;
  playing: boolean;
  preload: "auto" | "metadata";
  src: string;
};

function isVideo(src: string) {
  return /\.mp4(?:\?|$)/i.test(src);
}

function HeroVideo({ active, label, onEnded, playing, preload, src }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!active) {
      video.pause();
      video.currentTime = 0;
    }
  }, [active]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active) return;

    if (playing) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [active, playing]);

  return (
    <video
      ref={videoRef}
      className={active ? "active" : ""}
      src={src}
      autoPlay={active && playing}
      muted
      playsInline
      preload={preload}
      onEnded={onEnded}
      aria-label={label}
    />
  );
}

export function HeroCarousel({ desktopMedia, mobileMedia }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const mobileSlides = mobileMedia.length > 0 ? mobileMedia : desktopMedia;
  const desktopSlides = desktopMedia.length > 0 ? desktopMedia : mobileMedia;
  const images = isMobile ? mobileSlides : desktopSlides;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const update = () => {
      setIsMobile(media.matches);
      const slideCount = media.matches ? mobileSlides.length : desktopSlides.length;
      setIndex((value) => slideCount > 0 ? value % slideCount : 0);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [desktopSlides.length, mobileSlides.length]);

  useEffect(() => {
    const activeSlide = images[index];
    if (!playing || images.length < 2 || !activeSlide || isVideo(activeSlide)) return;

    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % images.length), 7000);
    return () => window.clearTimeout(timer);
  }, [images, index, playing]);

  const previous = () => setIndex((value) => images.length > 0 ? (value - 1 + images.length) % images.length : 0);
  const next = () => setIndex((value) => images.length > 0 ? (value + 1) % images.length : 0);

  return (
    <section className="visual-hero" aria-label="صور القرآن الكريم">
      <div className="visual-slides">
        {images.map((src, item) => {
          const className = item === index ? "active" : "";
          const label = `صورة روحانية للقرآن الكريم ${item + 1}`;

          return isVideo(src) ? (
            <HeroVideo
              src={src}
              active={item === index}
              playing={playing}
              preload={item === 0 ? "auto" : "metadata"}
              label={label}
              onEnded={() => {
                if (item === index && playing) next();
              }}
              key={src}
            />
          ) : (
            <Image
              className={className}
              src={src}
              fill
              sizes="100vw"
              preload={item === 0}
              unoptimized={src.endsWith(".gif")}
              alt={label}
              key={src}
            />
          );
        })}
      </div>
      <div className="visual-shade" />
      <div className="carousel-controls">
        <button type="button" onClick={next} aria-label="الصورة التالية"><ChevronLeft /></button>
        <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "إيقاف العرض" : "تشغيل العرض"}>{playing ? <Pause /> : <Play />}</button>
        <button type="button" onClick={previous} aria-label="الصورة السابقة"><ChevronRight /></button>
      </div>
      <div className="carousel-dots">
        {images.map((src, item) => <button type="button" className={item === index ? "active" : ""} onClick={() => setIndex(item)} key={src} aria-label={`الصورة ${item + 1}`} />)}
      </div>
    </section>
  );
}
