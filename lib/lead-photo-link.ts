import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "./site";

/**
 * Signed, unguessable links to a lead's photos so Justin can tap a photo in the lead
 * email and open it full size. The link carries the lead id, the photo's position
 * (lead_photos ordered by filename, byte order), and an HMAC of both.
 */
function secret() {
  return process.env.LEAD_PHOTO_SECRET || process.env.DATABASE_URL || "";
}

export function photoSignature(leadId: string, index: number, key = secret()) {
  if (!key) return "";
  return createHmac("sha256", key).update(`lead-photo:${leadId}:${index}`).digest("hex").slice(0, 32);
}

export function verifyPhotoSignature(leadId: string, index: number, sig: string, key = secret()) {
  const expected = photoSignature(leadId, index, key);
  if (!expected || sig.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}

export function leadPhotoUrl(leadId: string, index: number, key = secret()) {
  const sig = photoSignature(leadId, index, key);
  if (!sig) return "";
  return `${SITE_URL}/api/lead-photo/${leadId}/${index}?sig=${sig}`;
}

/** Byte-order sort so the email order matches `ORDER BY filename COLLATE "C"`. */
export function sortPhotosByFilename<T extends { filename: string }>(photos: T[]) {
  return [...photos].sort((a, b) => (a.filename < b.filename ? -1 : a.filename > b.filename ? 1 : 0));
}
