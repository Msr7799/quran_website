import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const channels = {
  quran: {
    id: 7,
    referer: "https://aloula.sba.sa/live/quran",
    expectedPath: "/ksaquranlive/ksaquran.smil/",
  },
  sunnah: {
    id: 6,
    referer: "https://aloula.sba.sa/live/sunna",
    expectedPath: "/ksasunnalive/ksasunna.smil/",
  },
} as const;

type ChannelKey = keyof typeof channels;

function findM3u8(value: unknown): string | null {
  if (typeof value === "string") {
    try {
      const url = new URL(value.replace(/\\u0026/g, "&").replace(/\\\//g, "/"));
      return url.protocol === "https:" && url.pathname.endsWith(".m3u8") ? url.toString() : null;
    } catch { return null; }
  }
  if (Array.isArray(value)) {
    for (const item of value) { const result = findM3u8(item); if (result) return result; }
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) { const result = findM3u8(item); if (result) return result; }
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const requestedChannel = new URL(request.url).searchParams.get("channel") ?? "quran";
    if (!(requestedChannel in channels)) {
      return NextResponse.json(
        { error: "Unknown live channel" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const channelKey = requestedChannel as ChannelKey;
    const channel = channels[channelKey];
    const playerApi = `https://aloula.faulio.com/api/v1.1/channels/${channel.id}/player`;
    const response = await fetch(playerApi, {
      headers: {
        Accept: "application/json",
        Origin: "https://aloula.sba.sa",
        Referer: channel.referer,
        "User-Agent": "Mozilla/5.0 (compatible; AlQuranAlMajeed/1.0)",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) return NextResponse.json({ error: "Upstream player API failed", status: response.status }, { status: 502, headers: { "Cache-Control": "no-store" } });

    const data = await response.json() as { streams?: { hls?: unknown } };
    const direct = typeof data.streams?.hls === "string" ? findM3u8(data.streams.hls) : null;
    const streamUrl = direct ?? findM3u8(data);
    if (!streamUrl) return NextResponse.json({ error: "No HLS stream was found" }, { status: 404, headers: { "Cache-Control": "no-store" } });

    const verifiedUrl = new URL(streamUrl);
    if (verifiedUrl.hostname !== "live.kwikmotion.com" || !verifiedUrl.pathname.includes(channel.expectedPath)) {
      return NextResponse.json(
        { error: "The player API returned an unexpected stream" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { streamUrl, channel: channelKey, source: "Saudi Broadcasting Authority - Aloula", fetchedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
    );
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    return NextResponse.json({ error: timedOut ? "Player API timed out" : "Failed to fetch the live stream" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
