import type { Metadata } from "next";
import { DualCalendar, type ReligiousEvent } from "@/components/DualCalendar";
import { decodeLegacyArabic, religiousEventTitle } from "@/lib/religious-events";
import { getReligiousEvents } from "@/lib/quran";

export const metadata: Metadata = { title: "التقويم الهجري والميلادي", description: "تقويم ميلادي وهجري يعرض المناسبات الدينية والأحاديث المرتبطة بها." };
type EventFile = { data: Array<{ id: number; title: string; month: number; day: number[]; isReminder: boolean; hadith: Array<{ hadith: string; bookInfo: string }> }> };

export default async function CalendarPage() {
  const source = await getReligiousEvents() as EventFile;
  const events: ReligiousEvent[] = source.data.map((item) => ({
    id: item.id, key: item.title, title: religiousEventTitle(item.title), month: item.month, day: item.day, isReminder: item.isReminder,
    hadith: decodeLegacyArabic(item.hadith[0]?.hadith ?? ""), bookInfo: decodeLegacyArabic(item.hadith[0]?.bookInfo ?? ""),
  }));
  return <section className="calendar-page"><div className="section-heading"><span className="eyebrow">مواعيدك الإسلامية</span><h2>التقويم الهجري والميلادي</h2><p>تصفّح الأيام الميلادية وما يقابلها هجرياً، وتعرّف على المناسبات المسجلة في ملف المناسبات الدينية.</p></div><DualCalendar events={events} /></section>;
}
