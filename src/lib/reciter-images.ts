import reciterImageManifest from "../../public/reciter_images/manifest.json";

const imageById = new Map(
  reciterImageManifest
    .filter((item) => item.status === "downloaded" && item.file)
    .map((item) => [item.id, `/reciter_images/${item.file}`]),
);

export function getReciterImage(reciterId: number | string) {
  const numericId = typeof reciterId === "number" ? reciterId : Number(reciterId);
  return Number.isInteger(numericId) ? imageById.get(numericId) : undefined;
}
