/**
 * Browser-only: shrink a phone photo before upload so 8 photos fit in one lead
 * email and the free Postgres. Returns the original file if it cannot be decoded
 * (for example HEIC on a browser without HEIC support) and it is already small.
 */
export const RESIZE_MAX_EDGE = 1600;
export const RESIZE_QUALITY = 0.8;

export async function resizePhoto(file: File, maxEdge = RESIZE_MAX_EDGE, quality = RESIZE_QUALITY): Promise<File | null> {
  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    bitmap = null;
  }
  if (!bitmap) {
    return /^image\/(jpeg|png|webp)$/.test(file.type) && file.size <= 2 * 1024 * 1024 ? file : null;
  }
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return file.size <= 2 * 1024 * 1024 ? file : null;
  }
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob) return file.size <= 2 * 1024 * 1024 ? file : null;
  const base = file.name.replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "-").slice(0, 80) || "photo";
  return new File([blob], `${base}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
}
