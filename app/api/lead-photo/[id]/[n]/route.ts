import { getPool } from "@/lib/leads";
import { verifyPhotoSignature } from "@/lib/lead-photo-link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Full-size lead photo for the signed link in Justin's lead email. */
export async function GET(request: Request, context: { params: Promise<{ id: string; n: string }> }) {
  const { id, n } = await context.params;
  const index = Number(n);
  const sig = new URL(request.url).searchParams.get("sig") || "";
  const notFound = () =>
    new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" } });
  if (!/^[0-9a-f-]{36}$/i.test(id) || !Number.isInteger(index) || index < 0 || index > 20) return notFound();
  if (!verifyPhotoSignature(id, index, sig)) return notFound();
  const db = getPool();
  if (!db) return notFound();
  const found = await db.query<{ content_type: string; bytes: Buffer }>(
    `SELECT content_type, bytes FROM lead_photos WHERE lead_id = $1 ORDER BY filename COLLATE "C", id OFFSET $2 LIMIT 1`,
    [id, index],
  );
  const photo = found.rows[0];
  if (!photo) return notFound();
  return new Response(new Uint8Array(photo.bytes), {
    status: 200,
    headers: {
      "Content-Type": /^image\/(jpeg|png|webp|gif)$/.test(photo.content_type) ? photo.content_type : "image/jpeg",
      "Cache-Control": "private, max-age=86400",
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Disposition": "inline",
    },
  });
}
