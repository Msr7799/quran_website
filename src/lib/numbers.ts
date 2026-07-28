const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicNumber(value: number | string) {
  return String(value).replace(/\d/g, (digit) => arabicDigits[Number(digit)]);
}
