import type { Metadata } from "next";
import { LiveBroadcast } from "@/components/LiveBroadcast";
import { getRadios } from "@/lib/quran";

export const metadata: Metadata = {
  title: "البث المباشر",
  description: "شاهد قنوات القرآن الكريم واستمع إلى الإذاعات القرآنية المباشرة على مدار الساعة.",
  alternates: { canonical: "/live" },
};

export default async function LivePage() {
  return <LiveBroadcast radios={await getRadios()} />;
}
