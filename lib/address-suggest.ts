/** As-you-type US address lookup, same path as the Blake preview lead form.
 * ArcGIS World Geocoding suggest (no key) is primary, then Photon.
 * Nominatim is not used — its usage policy bans autocomplete.
 * Results stay in the United States and prefer Louisiana / Acadiana.
 */

export const ADDRESS_MIN_CHARS = 3;
export const ADDRESS_LIMIT = 6;
export const ADDRESS_DEBOUNCE_MS = 300;

/** Lafayette — center of the planned Acadiana coverage. */
export const ADDRESS_PROXIMITY = { lon: -92.02, lat: 30.22 };

const SERVICE_BBOX = { xmin: -94.2, ymin: 29.2, xmax: -90.2, ymax: 31.7 };
const USER_AGENT = "AcadianaBathroomsConsult/1.0 (consult address lookup)";

export type AddressHit = {
  id: string;
  label: string;
  street: string;
  city: string;
  region: string;
  zip: string;
  lat: number | null;
  lon: number | null;
  magicKey?: string;
};

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export function isLouisiana(hit: Pick<AddressHit, "label" | "region">) {
  return /\b(LA|Louisiana)\b/.test(`${hit.label} ${hit.region}`);
}

export function preferLouisiana(list: AddressHit[]) {
  const local = list.filter(isLouisiana);
  return (local.length ? local : list).slice(0, ADDRESS_LIMIT);
}

export function parseUsAddressLabel(label: string) {
  const parts = label
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !/^(usa|us|united states)$/i.test(part));
  const street = parts[0] ?? "";
  let city = "";
  let region = "";
  let zip = "";
  for (const part of parts.slice(1)) {
    const zipOnly = part.match(/^(\d{5})(?:-\d{4})?$/);
    if (zipOnly) {
      zip = zip || zipOnly[1];
      continue;
    }
    if (/^(LA|Louisiana)$/i.test(part)) {
      region = "LA";
      continue;
    }
    if (/^[A-Z]{2}$/.test(part)) {
      region = region || part;
      continue;
    }
    const stateZip = part.match(/^([A-Za-z][A-Za-z .]*?)\s+(\d{5})(?:-\d{4})?$/);
    if (stateZip) {
      const state = stateZip[1].trim();
      region = region || (/^louisiana$/i.test(state) ? "LA" : state.length === 2 ? state.toUpperCase() : state);
      zip = zip || stateZip[2];
      continue;
    }
    if (!city) city = part;
  }
  return { street, city, region, zip };
}

type EsriSuggestion = { text?: string; magicKey?: string };
type EsriCandidate = {
  address?: string;
  location?: { x?: number; y?: number };
  attributes?: {
    StAddr?: string;
    City?: string;
    Region?: string;
    RegionAbbr?: string;
    Postal?: string;
  };
};

export function hitsFromEsriSuggestions(suggestions: EsriSuggestion[]): AddressHit[] {
  return suggestions
    .filter((item) => item.text)
    .map((item, index) => {
      const label = item.text ?? "";
      const parsed = parseUsAddressLabel(label);
      return {
        id: `esri-${item.magicKey || index}`,
        label,
        street: "",
        city: parsed.city,
        region: parsed.region,
        zip: parsed.zip,
        lat: null,
        lon: null,
        magicKey: item.magicKey,
      };
    });
}

export function hitFromEsriCandidate(candidate: EsriCandidate, fallback?: Partial<AddressHit>): AddressHit | null {
  if (!candidate.location || candidate.location.x == null || candidate.location.y == null) return null;
  const label = candidate.address || fallback?.label || "";
  const parsed = parseUsAddressLabel(label);
  const attributes = candidate.attributes ?? {};
  const region = attributes.RegionAbbr || (attributes.Region === "Louisiana" ? "LA" : attributes.Region) || parsed.region;
  return {
    id: fallback?.id || "esri-resolved",
    label,
    street: attributes.StAddr || parsed.street,
    city: attributes.City || parsed.city,
    region,
    zip: attributes.Postal || parsed.zip,
    lat: Number(candidate.location.y),
    lon: Number(candidate.location.x),
    magicKey: fallback?.magicKey,
  };
}

type PhotonFeature = {
  properties?: {
    osm_id?: number | string;
    housenumber?: string;
    street?: string;
    name?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    countrycode?: string;
  };
  geometry?: { coordinates?: [number, number] };
};

export function hitsFromPhoton(features: PhotonFeature[]): AddressHit[] {
  const hits: AddressHit[] = [];
  for (const feature of features) {
    const properties = feature.properties ?? {};
    const country = (properties.countrycode || "").toLowerCase();
    if (country && country !== "us") continue;
    const coordinates = feature.geometry?.coordinates;
    if (!coordinates) continue;
    const [lon, lat] = coordinates;
    const street = [properties.housenumber, properties.street || (!properties.housenumber ? properties.name : "")]
      .filter(Boolean)
      .join(" ");
    const city = properties.city || properties.town || properties.village || "";
    const region = properties.state === "Louisiana" ? "LA" : properties.state || "";
    const zip = properties.postcode || "";
    const label = [street || properties.name, city, region, zip].filter(Boolean).join(", ");
    hits.push({
      id: `ph-${properties.osm_id || label}`,
      label,
      street,
      city,
      region,
      zip,
      lat: Number(lat),
      lon: Number(lon),
    });
  }
  return hits;
}

type NominatimHit = {
  place_id?: number | string;
  display_name?: string;
  lat?: string;
  lon?: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country_code?: string;
  };
};

export function hitsFromNominatim(rows: NominatimHit[]): AddressHit[] {
  const hits: AddressHit[] = [];
  for (const [index, row] of rows.entries()) {
    const address = row.address ?? {};
    const country = (address.country_code || "").toLowerCase();
    if (country && country !== "us") continue;
    const lat = Number(row.lat);
    const lon = Number(row.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const street = [address.house_number, address.road].filter(Boolean).join(" ");
    const city = address.city || address.town || address.village || "";
    const region = address.state === "Louisiana" ? "LA" : address.state || "";
    const parsed = parseUsAddressLabel(row.display_name || "");
    hits.push({
      id: `nom-${row.place_id || index}`,
      label: row.display_name || [street, city, region].filter(Boolean).join(", "),
      street: street || parsed.street,
      city: city || parsed.city,
      region: region || parsed.region,
      zip: address.postcode || parsed.zip,
      lat,
      lon,
    });
  }
  return hits;
}

async function fetchJson(fetchImpl: FetchLike, url: string, init?: RequestInit) {
  const response = await fetchImpl(url, {
    ...init,
    signal: AbortSignal.timeout(8000),
    headers: { Accept: "application/json", "User-Agent": USER_AGENT, ...(init?.headers ?? {}) },
  });
  if (!response.ok) throw new Error(`http ${response.status}`);
  return response.json() as Promise<unknown>;
}

async function esriSuggest(query: string, fetchImpl: FetchLike) {
  let fallback: AddressHit[] = [];
  const attempts: Array<Record<string, string>> = [{ category: "Address" }, {}];
  for (const extra of attempts) {
    const params = new URLSearchParams({
      f: "json",
      text: query,
      maxSuggestions: String(ADDRESS_LIMIT),
      countryCode: "USA",
      location: `${ADDRESS_PROXIMITY.lon},${ADDRESS_PROXIMITY.lat}`,
      distance: "290000",
      ...extra,
    });
    const data = (await fetchJson(
      fetchImpl,
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?${params}`,
    )) as { suggestions?: EsriSuggestion[] };
    const list = hitsFromEsriSuggestions(data.suggestions ?? []);
    const local = list.filter(isLouisiana);
    if (local.length) return local.slice(0, ADDRESS_LIMIT);
    if (!fallback.length && list.length) fallback = list;
  }
  return fallback.slice(0, ADDRESS_LIMIT);
}

async function esriResolve(hit: Partial<AddressHit> & { label: string }, fetchImpl: FetchLike) {
  const params = new URLSearchParams({
    f: "json",
    maxLocations: "1",
    outSR: "4326",
    sourceCountry: "USA",
    outFields: "Match_addr,Addr_type,StAddr,City,Region,RegionAbbr,Postal",
  });
  if (hit.magicKey) {
    params.set("magicKey", hit.magicKey);
    params.set("singleLine", hit.label);
  } else {
    params.set("singleLine", hit.label);
    params.set("location", `${ADDRESS_PROXIMITY.lon},${ADDRESS_PROXIMITY.lat}`);
  }
  const data = (await fetchJson(
    fetchImpl,
    `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?${params}`,
  )) as { candidates?: EsriCandidate[] };
  const candidate = data.candidates?.[0];
  if (!candidate) return null;
  return hitFromEsriCandidate(candidate, hit);
}

async function photonSuggest(query: string, fetchImpl: FetchLike) {
  const params = new URLSearchParams({
    q: query,
    limit: String(ADDRESS_LIMIT),
    lang: "en",
    lat: String(ADDRESS_PROXIMITY.lat),
    lon: String(ADDRESS_PROXIMITY.lon),
    bbox: [SERVICE_BBOX.xmin, SERVICE_BBOX.ymin, SERVICE_BBOX.xmax, SERVICE_BBOX.ymax].join(","),
  });
  const data = (await fetchJson(fetchImpl, `https://photon.komoot.io/api/?${params}`)) as {
    features?: PhotonFeature[];
  };
  return preferLouisiana(hitsFromPhoton(data.features ?? []));
}

export async function suggestAddresses(query: string, options?: { fetchImpl?: FetchLike }) {
  const trimmed = query.trim();
  if (trimmed.length < ADDRESS_MIN_CHARS) return [];
  const fetchImpl = options?.fetchImpl ?? fetch;
  try {
    const esri = await esriSuggest(trimmed, fetchImpl);
    if (esri.length) return esri;
  } catch {
    // Try the next geocoder.
  }
  try {
    return await photonSuggest(trimmed, fetchImpl);
  } catch {
    return [];
  }
}

export async function resolveAddress(hit: Partial<AddressHit> & { label: string }, options?: { fetchImpl?: FetchLike }) {
  const fetchImpl = options?.fetchImpl ?? fetch;
  try {
    const resolved = await esriResolve(hit, fetchImpl);
    if (resolved?.street) return resolved;
    if (resolved && hit.street) return { ...resolved, street: hit.street };
    if (resolved) return resolved;
  } catch {
    // Keep whatever the suggestion already had.
  }
  const parsed = parseUsAddressLabel(hit.label);
  return {
    id: hit.id || "typed",
    label: hit.label,
    street: hit.street || parsed.street,
    city: hit.city || parsed.city,
    region: hit.region || parsed.region,
    zip: hit.zip || parsed.zip,
    lat: hit.lat ?? null,
    lon: hit.lon ?? null,
    magicKey: hit.magicKey,
  } satisfies AddressHit;
}
