import type { Metadata } from "next";
import { NoorChat } from "@/components/NoorChat";

export const metadata: Metadata = {
  title: "نور AI | المساعد الإسلامي",
  description: "مساعد إسلامي ذكي للإجابة العامة والإرشاد إلى القرآن الكريم والمصادر الموثوقة.",
  robots: { index: false, follow: true },
};

export default function ChatPage() {
  return <NoorChat />;
}
