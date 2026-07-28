export const religiousEventNames: Record<string, string> = {
  startHijriYear: "بداية السنة الهجرية",
  "reminderToFastTasoo'a": "تذكير بصيام تاسوعاء",
  reminderToFastAshura: "تذكير بصيام عاشوراء",
  ashura: "يوم عاشوراء",
  ramadhan: "بداية شهر رمضان",
  nightOfQadir: "تحرّي ليلة القدر",
  "EidAl-Fitr": "عيد الفطر",
  sexShawwal: "صيام الست من شوال",
  arafahReminder: "تذكير بصيام يوم عرفة",
  arafah: "يوم عرفة",
  "tenDaysOfDhul-Hijjah": "العشر الأوائل من ذي الحجة",
  "EidAl-Adha": "عيد الأضحى",
};

export function religiousEventTitle(key: string) { return religiousEventNames[key] ?? key; }
export function decodeLegacyArabic(value: string) { return /[ØÙÛ]/.test(value) ? Buffer.from(value, "latin1").toString("utf8") : value; }
