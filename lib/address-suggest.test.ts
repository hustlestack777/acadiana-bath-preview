import assert from "node:assert/strict";
import { test } from "node:test";
import {
  hitsFromEsriSuggestions,
  parseUsAddressLabel,
  preferLouisiana,
  resolveAddress,
  suggestAddresses,
  type AddressHit,
} from "./address-suggest";

test("a formatted ArcGIS line splits into street, city, and ZIP", () => {
  assert.deepEqual(parseUsAddressLabel("401 Renaud Dr, Lafayette, LA, 70507, USA"), {
    street: "401 Renaud Dr",
    city: "Lafayette",
    region: "LA",
    zip: "70507",
  });
});

test("Louisiana house numbers are kept ahead of out-of-state matches", () => {
  const hits = hitsFromEsriSuggestions([
    { text: "401 Renaud Dr, Lafayette, LA, 70507, USA", magicKey: "la" },
    { text: "401 Renaud Rd, Bailey, CO, 80421, USA", magicKey: "co" },
  ]);
  const local = preferLouisiana(hits);
  assert.equal(local.length, 1);
  assert.match(local[0]?.label ?? "", /Lafayette/);
});

test("suggest uses ArcGIS first and does not call the fallbacks when it has a local hit", async () => {
  const calls: string[] = [];
  const fetchImpl = async (url: string) => {
    calls.push(url);
    return new Response(
      JSON.stringify({
        suggestions: [
          { text: "401 Renaud Dr, Lafayette, LA, 70507, USA", magicKey: "la" },
          { text: "401 Renaud Rd, Bailey, CO, 80421, USA", magicKey: "co" },
        ],
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };
  const hits = await suggestAddresses("401 Renaud", { fetchImpl });
  assert.equal(hits.length, 1);
  assert.equal(hits[0]?.magicKey, "la");
  assert.match(calls[0] ?? "", /geocode\.arcgis\.com/);
  assert.equal(calls.some((url) => url.includes("photon") || url.includes("nominatim")), false);
});

test("suggest falls through to Photon when ArcGIS is empty", async () => {
  const fetchImpl = async (url: string) => {
    if (url.includes("arcgis.com")) {
      return new Response(JSON.stringify({ suggestions: [] }), { status: 200 });
    }
    if (url.includes("photon")) {
      return new Response(
        JSON.stringify({
          features: [
            {
              properties: {
                osm_id: 1,
                housenumber: "412",
                street: "Sample Street",
                city: "Lafayette",
                state: "Louisiana",
                postcode: "70508",
                countrycode: "US",
              },
              geometry: { coordinates: [-92.02, 30.22] },
            },
          ],
        }),
        { status: 200 },
      );
    }
    throw new Error(`unexpected ${url}`);
  };
  const hits = await suggestAddresses("412 Sample", { fetchImpl });
  assert.equal(hits[0]?.street, "412 Sample Street");
  assert.equal(hits[0]?.city, "Lafayette");
  assert.equal(hits[0]?.zip, "70508");
  assert.equal(hits[0]?.lat, 30.22);
});

test("resolve fills street, city, and ZIP from the ArcGIS candidate", async () => {
  const fetchImpl = async () =>
    new Response(
      JSON.stringify({
        candidates: [
          {
            address: "401 Renaud Dr, Lafayette, Louisiana, 70507",
            location: { x: -92.047, y: 30.254 },
            attributes: {
              StAddr: "401 Renaud Dr",
              City: "Lafayette",
              RegionAbbr: "LA",
              Postal: "70507",
            },
          },
        ],
      }),
      { status: 200 },
    );
  const hit: AddressHit = {
    id: "esri-1",
    label: "401 Renaud Dr, Lafayette, LA, 70507, USA",
    street: "",
    city: "Lafayette",
    region: "LA",
    zip: "70507",
    lat: null,
    lon: null,
    magicKey: "la",
  };
  const resolved = await resolveAddress(hit, { fetchImpl });
  assert.equal(resolved.street, "401 Renaud Dr");
  assert.equal(resolved.city, "Lafayette");
  assert.equal(resolved.zip, "70507");
  assert.equal(resolved.lat, 30.254);
  assert.equal(resolved.lon, -92.047);
});
