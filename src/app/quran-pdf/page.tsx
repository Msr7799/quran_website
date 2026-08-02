import type { Metadata } from "next";
import { IslamicLibrary } from "@/components/IslamicLibrary";
import { getLibraryBooks } from "@/lib/quran";

export const metadata: Metadata = {
  title: "المكتبة الإلكترونية للمصاحف والكتب",
  description:
    "تحميل المصاحف الشريفة والكتب الإسلامية بصيغة PDF بروابط مباشرة.",
  alternates: { canonical: "/quran-pdf" },
};
export default async function PdfLibraryPage() {
  return <IslamicLibrary booksPayload={await getLibraryBooks()} />;
}
