const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const rootFolder = "quran-website";

export function cloudinaryAsset(publicPath: string) {
  if (!cloudName) throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured");

  const cleanPath = publicPath.split("?")[0].replace(/^\/+/, "");
  const extension = cleanPath.split(".").pop()?.toLowerCase();
  const resourceType = extension === "mp4" ? "video" : "image";
  const transformation = resourceType === "video"
    ? "q_auto"
    : extension === "svg" || extension === "gif"
      ? "q_auto"
      : "f_auto,q_auto";
  const encodedPath = cleanPath.split("/").map(encodeURIComponent).join("/");
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformation}/${rootFolder}/${encodedPath}`;
}
