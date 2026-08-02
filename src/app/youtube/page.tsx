import type { Metadata } from "next";
import { connection } from "next/server";
import { YouTubeShowcase } from "@/components/YouTubeShowcase";
import { createPageMetadata } from "@/lib/seo";
import { getYouTubeHomeContent } from "@/lib/youtube";

export const metadata: Metadata = createPageMetadata({
  title: "محتوى قناة القرآن الكريم وتلاواته",
  description: "شاهد أحدث المقاطع القصيرة وتصفح قوائم تشغيل قناة القرآن الكريم وتلاواته على يوتيوب.",
  path: "/youtube",
  keywords: ["القرآن الكريم يوتيوب", "تلاوات القرآن", "مقاطع القرآن القصيرة", "قوائم تشغيل القرآن"],
});

export default async function YouTubePage() {
  await connection();
  const content = await getYouTubeHomeContent();

  return <div className="youtube-page"><YouTubeShowcase content={content} /></div>;
}
