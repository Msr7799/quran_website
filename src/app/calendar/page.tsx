import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { DualCalendar, type ReligiousEvent } from "@/components/DualCalendar";
import { religiousEventTitle } from "@/lib/religious-events";

export const metadata: Metadata = { title: "التقويم الهجري والميلادي", description: "تقويم ميلادي وهجري يعرض المناسبات الدينية والأحاديث المرتبطة بها." };
type EventFile = { data: Array<{ id: number; title: string; month: number; day: number[]; isReminder: boolean; isLottie: boolean; isSvg: boolean; lottiePath: string; svgPath: string; hadith: Array<{ hadith: string; bookInfo: string }> }> };

export default async function CalendarPage() {
  const raw = await readFile(path.join(process.cwd(), "public", "library", "religious_event.json"), "utf8");
  const source = JSON.parse(raw) as EventFile;
  const events: ReligiousEvent[] = source.data.map((item) => ({
    id: item.id, key: item.title, title: religiousEventTitle(item.title), month: item.month, day: item.day, isReminder: item.isReminder,
    hadith: item.hadith[0]?.hadith ?? "", bookInfo: item.hadith[0]?.bookInfo ?? "",
    visual: item.isLottie && item.lottiePath ? { type: "lottie", src: `/lottie/${item.lottiePath}.json` } : item.isSvg && item.svgPath ? { type: "svg", src: item.svgPath.replace(/^assets\/svg\//, "/svg/") } : item.isReminder ? { type: "lottie", src: "/lottie/notification.json" } : undefined,
  }));
  return <section className="calendar-page"><div className="section-heading"><span className="eyebrow">مواعيدك الإسلامية</span><h2>التقويم الهجري والميلادي</h2><p>تصفّح الأيام الميلادية وما يقابلها هجرياً، وتعرّف على المناسبات المسجلة في ملف المناسبات الدينية.</p></div><DualCalendar events={events} /></section>;
}
