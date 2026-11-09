/** Google Maps / Street View links and an optional Static API snapshot.
 * Never scrape Google. The image is fetched only when a key is already configured.
 */

export const GOOGLE_MAPS_KEY_ENV_NAMES = [
  "GOOGLE_MAPS_API_KEY",
  "GOOGLE_MAPS_KEY",
  "GOOGLE_STREET_VIEW_API_KEY",
  "GOOGLE_STREETVIEW_API_KEY",
  "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
] as const;

/** Documented name to set on Render when a Street View image should be embedded. */
export const GOOGLE_MAPS_API_KEY = "GOOGLE_MAPS_API_KEY";

export function readGoogleMapsKey(env: NodeJS.ProcessEnv = process.env) {
  for (const name of GOOGLE_MAPS_KEY_ENV_NAMES) {
    const value = env[name]?.trim();
    if (value) return value;
  }
  return "";
}

export function mapsSearchUrl(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

export function streetViewPanoUrl(lat: number, lon: number) {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`;
}

/** Opens Street View when we have a pin. Otherwise opens the address in Maps. */
export function openInMapsUrl(address: string, lat: number | null, lon: number | null) {
  if (lat != null && lon != null && Number.isFinite(lat) && Number.isFinite(lon)) {
    return streetViewPanoUrl(lat, lon);
  }
  return mapsSearchUrl(address);
}

export function streetViewLocation(address: string, lat: number | null, lon: number | null) {
  if (lat != null && lon != null && Number.isFinite(lat) && Number.isFinite(lon)) {
    return `${lat},${lon}`;
  }
  return address.trim();
}

export function streetViewStaticUrls(location: string, key: string) {
  const shared = new URLSearchParams({
    location,
    fov: "80",
    pitch: "0",
    source: "outdoor",
    key,
  });
  return {
    metadata: `https://maps.googleapis.com/maps/api/streetview/metadata?${shared.toString()}`,
    image: `https://maps.googleapis.com/maps/api/streetview?${new URLSearchParams({
      size: "640x400",
      location,
      fov: "80",
      pitch: "0",
      source: "outdoor",
      key,
    }).toString()}`,
  };
}

export type StreetViewImage = { bytes: Buffer; contentType: string };

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/** Download a Street View JPEG when a key exists and Google has outdoor imagery. */
export async function fetchStreetViewImage(
  input: { address: string; lat: number | null; lon: number | null },
  options?: { fetchImpl?: FetchLike; env?: NodeJS.ProcessEnv },
): Promise<StreetViewImage | null> {
  const key = readGoogleMapsKey(options?.env);
  const location = streetViewLocation(input.address, input.lat, input.lon);
  if (!key || !location) return null;
  const fetchImpl = options?.fetchImpl ?? fetch;
  const urls = streetViewStaticUrls(location, key);
  try {
    const metaResponse = await fetchImpl(urls.metadata, { signal: AbortSignal.timeout(6000) });
    if (!metaResponse.ok) return null;
    const meta = (await metaResponse.json()) as { status?: string };
    if (meta.status !== "OK") return null;
    const imageResponse = await fetchImpl(urls.image, { signal: AbortSignal.timeout(8000) });
    if (!imageResponse.ok) return null;
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) return null;
    const bytes = Buffer.from(await imageResponse.arrayBuffer());
    if (bytes.length < 500) return null;
    return { bytes, contentType: contentType.split(";")[0] || "image/jpeg" };
  } catch {
    return null;
  }
}
