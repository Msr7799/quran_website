export function getReciterImage(reciterId: number | string) {
  const numericId = typeof reciterId === "number" ? reciterId : Number(reciterId);
  return Number.isInteger(numericId) && numericId > 0 ? `/api/reciter-image/${numericId}` : undefined;
}
