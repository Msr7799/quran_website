import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "القرآن المجيد",
    short_name: "القرآن",
    description: "قراءة واستماع وبحث وتصفّح في القرآن الكريم",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#071813",
    theme_color: "#0c7652",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { src: "/alf.png", sizes: "1028x884", type: "image/png", purpose: "any" },
    ],
  };
}
