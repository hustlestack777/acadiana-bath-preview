/**
 * "About the house" facts for Justin's lead email. Free, keyless public sources only:
 * - Parish: the same ArcGIS World Geocoder the address autocomplete uses (Subregion).
 * - Flood zone: FEMA National Flood Hazard Layer (NFHL), flood hazard zones layer 28.
 * The whole lookup has one 4-second budget. Any failure returns null (or drops that one
 * field) so the lead is never blocked and the email always goes out.
 *
 * HOOK for paid property records (year built, square feet, beds, baths, last sale):
 * add a PropertyRecordProvider to PROPERTY_RECORD_PROVIDERS (for example a RentCast
 * `/v1/properties?address=` lookup gated on RENTCAST_API_KEY). Each provider returns
 * label/value rows and shares the same 4-second budget. Nothing is registered today,
 * so no paid API is ever called.
 */
import { streetViewPanoUrl } from "./street-view";

export type HouseFactRow = { label: string; value: string; source?: string };

export type HouseFacts = {
  parish: string;
  floodZone: string;
  latitude: number | null;
  longitude: number | null;
  /** Google Maps Street View link-out (no image, no key). */
  streetViewUrl: string;
  /** Rows from property-record providers (year built, sq ft, beds, baths, last sale). */
  records: HouseFactRow[];
};

export type PropertyRecordProvider = (input: {
  address: string;
  latitude: number | null;
  longitude: number | null;
  signal: AbortSignal;
  fetchImpl: FetchLike;
}) => Promise<HouseFactRow[]>;

/** Register RentCast (or similar) here later. Keep empty until Shaun approves a signup. */
export const PROPERTY_RECORD_PROVIDERS: PropertyRecordProvider[] = [];

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

export const HOUSE_FACTS_TIMEOUT_MS = 4000;
export const FLOOD_ZONE_LABEL = "Flood zone (FEMA, for reference only)";

const GEOCODER = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";
const NFHL_ZONES = "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query";

async function getJson(url: string, fetchImpl: FetchLike, signal: AbortSignal) {
  const res = await fetchImpl(url, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Record<string, unknown>;
}

function validPoint(lat: number | null, lon: number | null) {
  return lat != null && lon != null && Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
}

/** Parish and a rooftop point from the ArcGIS geocoder. */
export async function lookupParish(
  address: string,
  lat: number | null,
  lon: number | null,
  fetchImpl: FetchLike,
  signal: AbortSignal,
): Promise<{ parish: string; latitude: number | null; longitude: number | null }> {
  if (validPoint(lat, lon)) {
    const params = new URLSearchParams({ location: `${lon},${lat}`, outFields: "Subregion", f: "json" });
    const data = await getJson(`${GEOCODER}/reverseGeocode?${params}`, fetchImpl, signal);
    const parish = String((data.address as Record<string, unknown> | undefined)?.Subregion ?? "").trim();
    return { parish, latitude: lat, longitude: lon };
  }
  if (!address.trim()) return { parish: "", latitude: null, longitude: null };
  const params = new URLSearchParams({
    SingleLine: address,
    outFields: "Subregion,Addr_type",
    maxLocations: "1",
    countryCode: "USA",
    f: "json",
  });
  const data = await getJson(`${GEOCODER}/findAddressCandidates?${params}`, fetchImpl, signal);
  const hit = (data.candidates as Array<Record<string, unknown>> | undefined)?.[0];
  if (!hit || Number(hit.score ?? 0) < 80) return { parish: "", latitude: null, longitude: null };
  const location = hit.location as { x?: number; y?: number } | undefined;
  const parish = String((hit.attributes as Record<string, unknown> | undefined)?.Subregion ?? "").trim();
  return {
    parish,
    latitude: typeof location?.y === "number" ? location.y : null,
    longitude: typeof location?.x === "number" ? location.x : null,
  };
}

/** Plain-English FEMA zone, e.g. "Zone X, minimal flood hazard" or "Zone AE, Special Flood Hazard Area". */
export function describeFloodZone(zone: string, subtype: string, sfha: string) {
  const z = zone.trim().toUpperCase();
  const sub = subtype.trim().toUpperCase();
  if (!z) return "";
  if (sfha.trim().toUpperCase() === "T") return `Zone ${z}, Special Flood Hazard Area`;
  if (z === "X") {
    if (sub.includes("MINIMAL")) return "Zone X, minimal flood hazard";
    if (sub.includes("0.2")) return "Zone X, moderate flood hazard (0.2% annual chance)";
    if (sub.includes("LEVEE")) return "Zone X, reduced flood risk due to levee";
    return "Zone X";
  }
  if (z === "D") return "Zone D, flood hazard undetermined";
  if (z === "OPEN WATER") return "Open water";
  return `Zone ${z}`;
}

export async function lookupFloodZone(lat: number, lon: number, fetchImpl: FetchLike, signal: AbortSignal) {
  const params = new URLSearchParams({
    geometry: `${lon},${lat}`,
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "FLD_ZONE,ZONE_SUBTY,SFHA_TF",
    returnGeometry: "false",
    f: "json",
  });
  const data = await getJson(`${NFHL_ZONES}?${params}`, fetchImpl, signal);
  const features = (data.features as Array<{ attributes?: Record<string, unknown> }> | undefined) ?? [];
  // If a point sits on a boundary, prefer the Special Flood Hazard Area polygon.
  const sorted = [...features].sort(
    (a, b) => Number(b.attributes?.SFHA_TF === "T") - Number(a.attributes?.SFHA_TF === "T"),
  );
  const top = sorted[0]?.attributes;
  if (!top) return "";
  return describeFloodZone(String(top.FLD_ZONE ?? ""), String(top.ZONE_SUBTY ?? ""), String(top.SFHA_TF ?? ""));
}

/**
 * Parish, FEMA flood zone, Street View link, and any registered property records.
 * Resolves within `timeoutMs` (default 4 s) and never throws. Returns null when nothing useful came back.
 */
export async function lookupHouseFacts(
  input: { address: string; latitude: number | null; longitude: number | null },
  options: { fetchImpl?: FetchLike; timeoutMs?: number } = {},
): Promise<HouseFacts | null> {
  if (!input.address.trim() && !validPoint(input.latitude, input.longitude)) return null;
  const fetchImpl = options.fetchImpl ?? ((url: string, init?: RequestInit) => fetch(url, init));
  const timeoutMs = options.timeoutMs ?? HOUSE_FACTS_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let deadlineTimer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<null>((resolve) => {
    deadlineTimer = setTimeout(() => resolve(null), timeoutMs + 50);
  });

  const work = (async (): Promise<HouseFacts | null> => {
    const signal = controller.signal;
    let parish = "";
    let latitude = validPoint(input.latitude, input.longitude) ? input.latitude : null;
    let longitude = latitude == null ? null : input.longitude;
    try {
      const place = await lookupParish(input.address, latitude, longitude, fetchImpl, signal);
      parish = place.parish;
      if (latitude == null) {
        latitude = place.latitude;
        longitude = place.longitude;
      }
    } catch {
      // parish is optional
    }
    const hasPoint = validPoint(latitude, longitude);
    const [floodZone, records] = await Promise.all([
      hasPoint
        ? lookupFloodZone(latitude as number, longitude as number, fetchImpl, signal).catch(() => "")
        : Promise.resolve(""),
      Promise.all(
        PROPERTY_RECORD_PROVIDERS.map((provider) =>
          provider({ address: input.address, latitude, longitude, signal, fetchImpl }).catch(() => [] as HouseFactRow[]),
        ),
      ).then((lists) => lists.flat()),
    ]);
    if (!parish && !floodZone && !records.length) return null;
    return {
      parish,
      floodZone,
      latitude: hasPoint ? latitude : null,
      longitude: hasPoint ? longitude : null,
      streetViewUrl: hasPoint ? streetViewPanoUrl(latitude as number, longitude as number) : "",
      records,
    };
  })().catch(() => null);

  try {
    return await Promise.race([work, deadline]);
  } finally {
    clearTimeout(timer);
    if (deadlineTimer) clearTimeout(deadlineTimer);
  }
}
