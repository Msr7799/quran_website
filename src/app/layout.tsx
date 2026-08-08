import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { FloatingTools } from "@/components/FloatingTools";
import { Header } from "@/components/Header";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { cloudinaryAsset } from "@/lib/cloudinary-assets";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alquran-almajeed.vercel.app";
const themeInitializer = `(function(){try{var saved=localStorage.getItem("theme");var dark=saved?saved==="dark":true;var root=document.documentElement;root.dataset.theme=dark?"dark":"light";root.style.colorScheme=dark?"dark":"light"}catch(error){document.documentElement.dataset.theme="dark"}})();`;
const title = "القرآن المجيد | قراءة واستماع للقرآن الكريم";
const description = "اقرأ القرآن الكريم كاملاً، واستمع لأشهر القراء، وتصفّح صفحات المصحف وابحث في الآيات بسهولة على جميع الأجهزة.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | القرآن المجيد" },
  description,
  applicationName: "القرآن المجيد",
  authors: [{ name: "القرآن المجيد" }],
  creator: "القرآن المجيد",
  keywords: ["القرآن الكريم", "القرآن المجيد", "قراءة القرآن", "استماع القرآن", "تفسير القرآن", "مصحف", "تلاوة القرآن", "سور القرآن", "Quran", "Holy Quran"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    url: "/",
    siteName: "القرآن المجيد",
    title,
    description,
    images: [{ url: cloudinaryAsset("/images/social-card.png"), width: 1200, height: 630, alt: "القرآن المجيد" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [cloudinaryAsset("/images/social-card.png")] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  manifest: "/manifest.webmanifest",
  icons: { icon: cloudinaryAsset("/alf.png"), shortcut: cloudinaryAsset("/alf.png"), apple: cloudinaryAsset("/alf.png") },
  category: "education",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3e8" },
    { media: "(prefers-color-scheme: dark)", color: "#071813" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "القرآن المجيد",
    url: siteUrl,
    inLanguage: ["ar", "en"],
    potentialAction: { "@type": "SearchAction", target: `${siteUrl}/search/{search_term_string}`, "query-input": "required name=search_term_string" },
  };

  return (
    <html lang="ar" dir="rtl" translate="no" className="notranslate" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
        <script id="theme-initializer" dangerouslySetInnerHTML={{ __html: themeInitializer }} />
      </head>
      <body>
        <LocaleProvider>
          <div id="app-root">
            <a className="skip-link" href="#main">انتقل إلى المحتوى</a>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <FloatingTools />
          </div>
        </LocaleProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
