export function cloudinaryAsset(publicPath: string) {
  const cleanPath = publicPath.split("?")[0].replace(/^\/+/, "");
  const encodedPath = cleanPath.split("/").map(encodeURIComponent).join("/");
  return `/api/media/${encodedPath}`;
}
