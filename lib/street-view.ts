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

export const NOMINATIM_USER_AGENT = "AcadianaBathroomsConsult/1.0 (lead street-view links)";
const GEOCODE_TIMEOUT_MS = 4000;

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

export function hasMapPin(lat: number | null, lon: number | null) {
  return lat != null && lon != null && Number.isFinite(lat) && Number.isFinite(lon);
}

export type HouseMapLinks = {
  streetViewUrl: string;
  mapsUrl: string;
  latitude: number | null;
  longitude: number | null;
  geocoded: boolean;
};

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/** One keyless Nominatim lookup. Never throws. Times out so a lead is never blocked. */
export async function geocodeAddressWithNominatim(
  address: string,
  options?: { fetchImpl?: FetchLike },
): Promise<{ lat: number; lon: number } | null> {
  const trimmed = address.trim();
  if (!trimmed) return null;
  const fetchImpl = options?.fetchImpl ?? fetch;
  const params = new URLSearchParams({
    format: "jsonv2",
    limit: "1",
    countrycodes: "us",
    q: trimmed,
  });
  try {
    const response = await fetchImpl(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": NOMINATIM_USER_AGENT,
      },
      signal: AbortSignal.timeout(GEOCODE_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    const rows = (await response.json()) as Array<{ lat?: string; lon?: string }>;
    const lat = Number(rows[0]?.lat);
    const lon = Number(rows[0]?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    return { lat, lon };
  } catch {
    return null;
  }
}

/** Street View pano when we have a pin (saved or geocoded). Maps search otherwise, plus a plain Maps link. */
export async function resolveHouseMapLinks(
  address: string,
  lat: number | null,
  lon: number | null,
  options?: { fetchImpl?: FetchLike },
): Promise<HouseMapLinks> {
  const mapsUrl = mapsSearchUrl(address);
  let latitude = hasMapPin(lat, lon) ? lat : null;
  let longitude = hasMapPin(lat, lon) ? lon : null;
  let geocoded = false;
  if (!hasMapPin(latitude, longitude)) {
    const pin = await geocodeAddressWithNominatim(address, options);
    if (pin) {
      latitude = pin.lat;
      longitude = pin.lon;
      geocoded = true;
    }
  }
  const streetViewUrl = hasMapPin(latitude, longitude)
    ? streetViewPanoUrl(latitude as number, longitude as number)
    : mapsUrl;
  return { streetViewUrl, mapsUrl, latitude, longitude, geocoded };
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
