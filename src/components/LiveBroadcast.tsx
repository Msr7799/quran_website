"use client";

import {
  AlertCircle,
  Heart,
  Pause,
  Play,
  Radio,
  Share2,
  Signal,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SelectDropdown } from "@/components/ui/dropdown-menu";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  liveSaudiChannelTranslations,
  liveSports1ChannelTranslations,
  liveSunnahChannelTranslations,
} from "@/i18n/footerLiveTranslations";
import type { Radio as RadioType } from "@/lib/types";
import styles from "./LiveBroadcast.module.css";

export function LiveBroadcast({ radios }: { radios: RadioType[] }) {
  const { locale, t } = useLocale();
  const channels = [
    { id: 1, type: "hls" as const, name: t("live.primary") },
    { id: 2, type: "hls" as const, name: liveSunnahChannelTranslations[locale] },
    { id: 3, type: "hls" as const, name: liveSports1ChannelTranslations[locale] },
    { id: 4, type: "hls" as const, name: liveSaudiChannelTranslations[locale] },
    { id: 5, type: "youtube" as const, name: t("live.backup"), url: "https://www.youtube.com/embed/CmppEPGps1w?autoplay=1&mute=0" },
  ];
  const [channelId, setChannelId] = useState(1);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [radioId, setRadioId] = useState(radios[0]?.id ?? 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [radioError, setRadioError] = useState(false);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const activeChannel = channels.find((channel) => channel.id === channelId) ?? channels[0];
  const activeRadio = radios.find((radio) => radio.id === radioId) ?? radios[0];

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
    audioRef.current.muted = muted;
  }, [muted, volume]);

  useEffect(() => {
    const video = videoRef.current;
    const streamChannel = channelId === 1
      ? "quran"
      : channelId === 2
        ? "sunnah"
        : channelId === 3
          ? "sports1"
          : channelId === 4
            ? "saudi"
            : null;
    if (!streamChannel || !video) return;
    let disposed = false;
    let retries = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let hls: import("hls.js").default | null = null;

    const fail = () => {
      if (disposed) return;
      setVideoLoading(false);
      setVideoError(true);
    };
    const retry = () => {
      if (disposed || retries >= 3) return fail();
      retries += 1;
      retryTimer = setTimeout(() => void loadStream(), 900 * retries);
    };
    const ready = () => {
      if (disposed) return;
      retries = 0;
      setVideoLoading(false);
      setVideoError(false);
      void video.play().catch(() => undefined);
    };
    const loadStream = async () => {
      try {
        setVideoLoading(true);
        const response = await fetch(`/api/quran-live?channel=${streamChannel}`, { cache: "no-store" });
        const data = await response.json().catch(() => ({})) as { streamUrl?: string };
        if (!response.ok || !data.streamUrl) throw new Error("Missing HLS stream");
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = data.streamUrl;
          video.load();
          return;
        }
        const { default: Hls } = await import("hls.js");
        if (disposed || !Hls.isSupported()) throw new Error("HLS is not supported");
        if (!hls) {
          hls = new Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 30 });
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, ready);
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (!data.fatal || disposed) return;
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) retry();
            else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls?.recoverMediaError();
            else fail();
          });
        }
        hls.loadSource(data.streamUrl);
      } catch { retry(); }
    };
    const onCanPlay = () => ready();
    const onNativeError = () => { if (!hls) retry(); };
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onNativeError);
    void loadStream();

    return () => {
      disposed = true;
      if (retryTimer) clearTimeout(retryTimer);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onNativeError);
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [channelId]);

  function selectChannel(id: number) {
    setChannelId(id);
    setVideoLoading(true);
    setVideoError(false);
  }

  function selectRadio(id: number) {
    audioRef.current?.pause();
    setRadioId(id);
    setIsPlaying(false);
    setRadioError(false);
    setFavorite(false);
  }

  async function toggleRadio() {
    const audio = audioRef.current;
    if (!audio || !activeRadio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    setRadioError(false);
    setIsConnecting(true);
    try {
      await audio.play();
    } catch {
      setRadioError(true);
      setIsConnecting(false);
      setIsPlaying(false);
    }
  }

  function moveRadio(direction: -1 | 1) {
    if (radios.length === 0) return;
    const currentIndex = Math.max(0, radios.findIndex((radio) => radio.id === activeRadio?.id));
    selectRadio(radios[(currentIndex + direction + radios.length) % radios.length].id);
  }

  function changeVolume(value: number) {
    setVolume(value);
    setMuted(value === 0);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
      audioRef.current.muted = value === 0;
    }
  }

  function toggleMute() {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (audioRef.current) audioRef.current.muted = nextMuted;
  }

  async function shareRadio() {
    const shareData = { title: activeRadio?.name ?? t("live.radioTitle"), url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
    } else {
      await navigator.clipboard?.writeText(shareData.url).catch(() => undefined);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.heading}>
          <h1><Radio aria-hidden="true" /> {t("live.title")}</h1>
          <p>{t("live.subtitle")}</p>
        </header>

        {videoError && <div className={styles.error}><AlertCircle /> {t("live.videoError")}</div>}

        <section className={styles.broadcast} aria-label={t("live.channelsLabel")}>
          <div className={styles.videoFrame}>
            {activeChannel.type === "hls" ? (
              <video ref={videoRef} controls autoPlay playsInline aria-label={activeChannel.name} />
            ) : (
              <iframe
                key={activeChannel.id}
                src={activeChannel.url}
                title={activeChannel.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setVideoLoading(false)}
                onError={() => { setVideoLoading(false); setVideoError(true); }}
              />
            )}
            {videoLoading && <div className={styles.videoLoading}><span /><p>{t("live.loading")}</p></div>}
          </div>

          <div className={styles.channelInfo}>
            <div>
              <h2>{activeChannel.name}</h2>
              <p><span className={styles.statusDot} /> {t("live.connected")}</p>
            </div>
            <span><Signal /> {t("live.quality")}</span>
          </div>

          <div className={styles.channelList}>
            <h3>{t("live.available")}</h3>
            <div>
              {channels.map((channel) => (
                <button
                  type="button"
                  className={channel.id === activeChannel.id ? styles.activeChannel : ""}
                  onClick={() => selectChannel(channel.id)}
                  key={channel.id}
                >
                  <Radio />
                  <span>{channel.name}</span>
                  {channel.id === activeChannel.id && <i className={styles.equalizer}><b /><b /><b /></i>}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.radioSection} aria-labelledby="radio-player-title">
          <header>
            <h2 id="radio-player-title"><Radio /> {t("live.radioPlayer")}</h2>
            <p>{t("live.radioSubtitle")}</p>
          </header>

          <div className={styles.radioPlayer}>
            {activeRadio ? <audio
              ref={audioRef}
              src={activeRadio.url}
              preload="none"
              onLoadStart={() => setIsConnecting(true)}
              onCanPlay={() => setIsConnecting(false)}
              onPlaying={() => { setIsPlaying(true); setIsConnecting(false); }}
              onPause={() => setIsPlaying(false)}
              onError={() => { setRadioError(true); setIsPlaying(false); setIsConnecting(false); }}
            /> : null}

            <div className={styles.playerHeader}>
              <div><Radio /><span><strong>{t("live.radioTitle")}</strong><small>{t("live.radioTagline")}</small></span></div>
              <div>
                <button type="button" className={favorite ? styles.favorite : ""} onClick={() => setFavorite((value) => !value)} aria-label={t("live.favorite")}><Heart /></button>
                <button type="button" onClick={shareRadio} aria-label={t("live.share")}><Share2 /></button>
              </div>
            </div>

            <div className={styles.nowPlaying}>
              <i className={isPlaying ? styles.playingBars : ""}><b /><b /><b /></i>
              <strong>{activeRadio?.name ?? t("live.noStations")}</strong>
              <small>{isConnecting ? t("live.connecting") : isPlaying ? t("live.onAir") : t("live.ready")}</small>
            </div>

            <SelectDropdown
              value={activeRadio ? String(activeRadio.id) : ""}
              options={radios.map((radio) => ({ value: String(radio.id), label: radio.name, searchText: radio.name }))}
              onValueChange={(value) => selectRadio(Number(value))}
              ariaLabel={t("live.choose")}
              placeholder={t("live.choose")}
              className={`${styles.radioDropdownTrigger} ${isPlaying ? styles.activeRadioTrigger : ""}`}
              contentClassName={styles.radioDropdownMenu}
            />

            {radioError && <div className={styles.playerError}><AlertCircle /> {t("live.radioError")}</div>}

            <div className={styles.playerControls}>
              <button type="button" onClick={() => moveRadio(-1)} aria-label={t("live.previous")}><SkipBack /></button>
              <button type="button" className={`${styles.playButton} ${isPlaying ? styles.activePlay : ""}`} onClick={toggleRadio} disabled={!activeRadio} aria-label={isPlaying ? t("live.pause") : t("live.play")}>{isPlaying ? <Pause /> : <Play />}</button>
              <button type="button" onClick={() => moveRadio(1)} aria-label={t("live.next")}><SkipForward /></button>
            </div>

            <div className={styles.volumeControl}>
              <button type="button" onClick={toggleMute} aria-label={muted ? t("live.unmute") : t("live.mute")}>{muted || volume === 0 ? <VolumeX /> : <Volume2 />}</button>
              <input type="range" min="0" max="100" value={muted ? 0 : volume} onChange={(event) => changeVolume(Number(event.target.value))} aria-label={t("live.volume")} />
              <span>{muted ? 0 : volume}%</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
