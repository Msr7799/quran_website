import Image from "next/image";
import { cloudinaryAsset } from "@/lib/cloudinary-assets";
import type { ComponentType } from "react";
import { Bot, CalendarDays, Headphones, Home, Info, Radio, Video } from "lucide-react";

type IconComponent = ComponentType<{ className?: string }>;
const assetIcon = (src: string, alt: string): IconComponent => function AssetIcon({ className }) {
  return <Image className={`nav-asset-icon ${className ?? ""}`} src={src} width={30} height={30} alt={alt} aria-hidden="true" />;
};

const QuranWrittenIcon = assetIcon(cloudinaryAsset("/quran-writen-icon.svg"), "");
const MushafIcon = assetIcon(cloudinaryAsset("/moshaf.svg"), "");
const BooksPdfIcon = assetIcon(cloudinaryAsset("/books-pdf.svg"), "");
const ResearchIcon = assetIcon(cloudinaryAsset("/research.svg"), "");

export type NavItem = { href: string; label: string; translationKey: string; icon: IconComponent };

export const navigation: NavItem[] = [
  { href: "/", label: "الرئيسية", translationKey: "common.home", icon: Home },
  { href: "/quran/1", label: "قراءة القرآن", translationKey: "quran.read", icon: QuranWrittenIcon },
  { href: "/quran-pages/7", label: "تصفح المصحف", translationKey: "navigation.quranPages", icon: MushafIcon },
  { href: "/quran-sound", label: "الاستماع", translationKey: "navigation.quranSound", icon: Headphones },
  { href: "/quran-pdf", label: "المصحف PDF", translationKey: "navigation.quranPDF", icon: BooksPdfIcon },
  { href: "/live", label: "البث المباشر", translationKey: "navigation.live", icon: Radio },
  { href: "/youtube", label: "محتوى اليوتيوب", translationKey: "youtube.navigation", icon: Video },
  { href: "/calendar", label: "التقويم الهجري والميلادي", translationKey: "navigation.calendar", icon: CalendarDays },
  { href: "/search", label: "البحث في القرآن", translationKey: "navigation.quranSearch", icon: ResearchIcon },
  { href: "/chat-bot", label: "المساعد الإسلامي", translationKey: "navigation.chatBot", icon: Bot },
  { href: "/about", label: "عن الموقع", translationKey: "common.about", icon: Info },
];
