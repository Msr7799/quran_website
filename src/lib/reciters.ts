export const synchronizedReciters = [
  { id: "abdul-rahman-al-sudais", imageId: 68, source: "surah-json", folder: "surah-recitation-abdul-rahman-al-sudais", ar: "عبد الرحمن السديس", en: "Abdul Rahman Al-Sudais" },
  { id: "abdullah-awad-al-juhani", imageId: 82, source: "surah-json", folder: "surah-recitation-abdullah-awad-al-juhani", ar: "عبدالله عواد الجهني", en: "Abdullah Awad Al-Juhani" },
  { id: "bandar-baleela", imageId: 29, source: "surah-json", folder: "surah-recitation-bandar-baleela", ar: "بندر بليلة", en: "Bandar Baleela" },
  { id: "maher-al-muaiqly", imageId: 101, source: "surah-json", folder: "surah-recitation-maher-al-muaiqly", ar: "ماهر المعيقلي", en: "Maher Al-Muaiqly" },
  { id: "mishari-al-afasy", imageId: 131, source: "surah-json", folder: "surah-recitation-mishari-al-afasy", ar: "مشاري العفاسي", en: "Mishari Al-Afasy" },
  { id: "yasser-al-dosari", imageId: 152, source: "surah-json", folder: "surah-recitation-yasser-al-dosari", ar: "ياسر الدوسري", en: "Yasser Al-Dosari" },
  { id: "muhammad-siddiq-al-minshawi", imageId: 114, source: "ayah-json", file: "ayah-recitation-muhammad-siddiq-al-minshawi-murattal-hafs-959.json/ayah-recitation-muhammad-siddiq-al-minshawi-murattal-hafs-959.json", downloadBase: "https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee", ar: "محمد صديق المنشاوي", en: "Muhammad Siddiq Al-Minshawi" },
  { id: "saud-al-shuraim", imageId: 46, source: "ayah-json", file: "ayah-recitation-saud-al-shuraim-murattal-hafs-960.json/ayah-recitation-saud-al-shuraim-murattal-hafs-960.json", downloadBase: "https://download.quranicaudio.com/quran/sa3ood_al-shuraym", ar: "سعود الشريم", en: "Saud Al-Shuraim" },
  { id: "abdullah-ali-jabir", imageId: 92, source: "surah-json", folder: "surah-recitation-abdullah-ali-jabir", ar: "علي جابر", en: "Ali Jaber" },
  { id: "ali-abdur-rahman-al-huthaify", imageId: 91, source: "sqlite", file: "surah-recitation-ali-abdur-rahman-al-huthaify.db/surah-recitation-ali-abdur-rahman-al-huthaify.db", ar: "علي عبد الرحمن الحذيفي", en: "Ali Abdur-Rahman Al-Huthaify" },
] as const;

export type SynchronizedReciterId = (typeof synchronizedReciters)[number]["id"];
export type SynchronizedReciter = (typeof synchronizedReciters)[number];

export function getSynchronizedReciter(id: string) {
  return synchronizedReciters.find((reciter) => reciter.id === id);
}
