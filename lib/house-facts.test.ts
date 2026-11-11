import assert from "node:assert/strict";
import { test } from "node:test";
import { describeFloodZone, lookupHouseFacts, PROPERTY_RECORD_PROVIDERS } from "./house-facts";
import { buildLeadEmail, houseFactRows } from "./lead-email";

test("FEMA zones read as plain English", () => {
  assert.equal(describeFloodZone("X", "AREA OF MINIMAL FLOOD HAZARD", "F"), "Zone X, minimal flood hazard");
  assert.equal(describeFloodZone("AE", "", "T"), "Zone AE, Special Flood Hazard Area");
  assert.equal(describeFloodZone("X", "0.2 PCT ANNUAL CHANCE FLOOD HAZARD", "F"), "Zone X, moderate flood hazard (0.2% annual chance)");
  assert.equal(describeFloodZone("", "", ""), "");
});

test("no paid property-record provider is registered", () => {
  assert.equal(PROPERTY_RECORD_PROVIDERS.length, 0);
});

test("house facts use the geocoder parish and FEMA zone", async () => {
  const fetchImpl = async (url: string) => {
    if (url.includes("reverseGeocode")) return Response.json({ address: { Subregion: "Ascension Parish" } });
    if (url.includes("NFHL")) return Response.json({ features: [{ attributes: { FLD_ZONE: "AE", ZONE_SUBTY: "", SFHA_TF: "T" } }] });
    return new Response("no", { status: 500 });
  };
  const facts = await lookupHouseFacts({ address: "615 E Worthy St, Gonzales, LA", latitude: 30.22, longitude: -90.91 }, { fetchImpl });
  assert.equal(facts?.parish, "Ascension Parish");
  assert.equal(facts?.floodZone, "Zone AE, Special Flood Hazard Area");
  assert.match(facts?.streetViewUrl ?? "", /map_action=pano&viewpoint=30\.22,-90\.91/);
  const rows = houseFactRows(facts);
  assert.deepEqual(rows.map((row) => row.label), ["Parish", "Flood zone (FEMA, for reference only)"]);
});

test("a slow or failing lookup is skipped quietly inside the time budget", async () => {
  const hang = (_url: string, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => init?.signal?.addEventListener("abort", () => reject(new Error("aborted"))));
  const started = Date.now();
  const facts = await lookupHouseFacts({ address: "1 Main St", latitude: 30, longitude: -92 }, { fetchImpl: hang, timeoutMs: 150 });
  assert.equal(facts, null);
  assert.ok(Date.now() - started < 1000);
  const failing = await lookupHouseFacts({ address: "1 Main St", latitude: null, longitude: null }, {
    fetchImpl: async () => {
      throw new Error("down");
    },
  });
  assert.equal(failing, null);
});

test("the lead email shows About the house only when facts exist", () => {
  const base = {
    kind: "new" as const, id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", createdAt: new Date(), name: "Jane", phone: "3375550142", email: "",
    street: "1 Main St", city: "Lafayette", zip: "70501", latitude: 30.2, longitude: -92, project: "showers", width: "", depth: "",
    height: "", measurements: "", features: "", budget: "", homeowner: "", payment: "", timing: "", preferredCallTime: "", photos: [],
  };
  const without = buildLeadEmail(base);
  assert.equal(without.html.includes("About the house"), false);
  const withFacts = buildLeadEmail({
    ...base,
    houseFacts: { parish: "Lafayette Parish", floodZone: "Zone X, minimal flood hazard", latitude: 30.2, longitude: -92, streetViewUrl: "", records: [] },
  });
  assert.match(withFacts.html, /About the house/);
  assert.match(withFacts.html, /Flood zone \(FEMA, for reference only\)/);
  assert.match(withFacts.html, /Zone X, minimal flood hazard/);
  assert.match(withFacts.text, /Parish: Lafayette Parish/);
});
