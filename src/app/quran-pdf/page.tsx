import type { Metadata } from "next";
import { IslamicLibrary } from "@/components/IslamicLibrary";

export const metadata: Metadata = {
  title: "المكتبة الإلكترونية للمصاحف والكتب",
  description:
    "تحميل المصاحف الشريفة والكتب الإسلامية بصيغة PDF بروابط مباشرة.",
  alternates: { canonical: "/quran-pdf" },
};
export default function PdfLibraryPage() {
  return <IslamicLibrary />;
}
