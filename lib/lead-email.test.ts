import assert from "node:assert/strict";
import { test } from "node:test";
import { buildLeadEmail } from "./lead-email";
import { formatChicago, formatEmailSize, formatThankYouSize, leadSubject } from "./lead-display";
import { fetchStreetViewImage, mapsDirectionsUrl, openInMapsUrl, readGoogleMapsKey, resolveHouseMapLinks, NOMINATIM_USER_AGENT } from "./street-view";

const when = new Date("2026-11-09T23:14:00Z");

function sample(overrides: Partial<Parameters<typeof buildLeadEmail>[0]> = {}) {
  return buildLeadEmail({
    kind: "new",
    id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    createdAt: when,
    name: "Jane Comeaux",
    phone: "3375550142",
    email: "jane.comeaux@email.com",
    street: "412 Sample Street",
    city: "Lafayette",
    zip: "70508",
    latitude: 30.22,
    longitude: -92.02,
    project: "tub-to-shower",
    width: "60",
    depth: "30",
    height: "14",
    measurements: "alcove",
    features: "",
    budget: "",
    homeowner: "own",
    payment: "not-sure",
    timing: "ready",
    preferredCallTime: "",
    photos: [
      { filename: "tub.jpg", contentType: "image/jpeg", bytes: Buffer.from("jpeg-a") },
      { filename: "bath.jpg", contentType: "image/jpeg", bytes: Buffer.from("jpeg-b") },
    ],
    ...overrides,
  });
}

test("lead subject matches the phone-readable pattern and keeps the TEST prefix", () => {
  assert.equal(leadSubject("Jane Comeaux", "Lafayette", "new"), "New consult · Jane Comeaux · Lafayette");
  assert.equal(leadSubject("test Ada", "Houma", "new"), "[TEST] New consult · test Ada · Houma");
  assert.equal(leadSubject("TEST Ada", "Houma", "update"), "[TEST] Consult update · TEST Ada · Houma");
});

test("chicago time is used instead of an ISO timestamp", () => {
  const formatted = formatChicago(when);
  assert.equal(formatted.includes("2026-11-09T"), false);
  assert.match(formatted, /Nov 9/);
  assert.match(formatted, /5:14/);
  assert.match(formatted, /PM/);
});

test("size lines are plain English and empty fields stay blank", () => {
  assert.equal(formatThankYouSize("60", "30", "", "alcove"), "60″ × 30″ alcove");
  assert.equal(formatEmailSize("60", "30", "14"), "60″ wide × 30″ deep × 14″ high");
  assert.equal(formatThankYouSize("", "", "", ""), "");
  assert.equal(formatEmailSize("", "", ""), "");
});

test("the lead email is a card with real labels, inline photos, and no empty none-lines", () => {
  const email = sample();
  assert.equal(email.subject, "New consult · Jane Comeaux · Lafayette");
  assert.match(email.html, /NEW CONSULT|New consult/);
  assert.match(email.html, /Jane Comeaux/);
  assert.match(email.html, /tel:\+13375550142/);
  assert.match(email.html, />\(337\) 555-0142</);
  assert.match(email.html, />Call now</);
  assert.match(email.html, /mailto:jane\.comeaux@email\.com/);
  assert.match(email.html, /Email Jane/);
  assert.match(email.html, /412 Sample Street/);
  assert.match(email.html, /Lafayette, LA 70508/);
  assert.match(email.html, /map_action=pano/);
  assert.match(email.html, /Open Street View/);
  assert.match(email.html, /Open in Google Maps/);
  assert.match(email.html, /google\.com\/maps\/search\/\?api=1&amp;query=/);
  assert.match(email.html, /Get directions/);
  assert.match(email.html, /google\.com\/maps\/dir\/\?api=1&amp;destination=/);
  assert.match(email.text, /Street View: https:\/\/www\.google\.com\/maps\/@\?api=1&map_action=pano/);
  assert.match(email.text, /Directions from your location: https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=/);
  assert.match(email.text, /Open in Google Maps: https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/);
  assert.match(email.html, /Tub-to-shower conversion/);
  assert.match(email.html, /60″ wide × 30″ deep × 14″ high/);
  assert.match(email.html, /I own this home/);
  assert.match(email.html, /Ready to review options/);
  assert.match(email.html, /Not sure yet/);
  assert.match(email.html, /alcove/);
  assert.match(email.html, /cid:photo-1/);
  assert.match(email.html, /cid:photo-2/);
  assert.match(email.html, /Their photos/);
  assert.match(email.html, /Internal lead email only/);
  assert.equal(email.html.includes("(none)"), false);
  assert.equal(email.html.includes("not-sure"), false);
  assert.equal(email.text.includes("(none)"), false);
  assert.equal(email.text.includes("2026-11-09T"), false);
  const inline = email.attachments.filter((item) => item.contentId);
  const files = email.attachments.filter((item) => !item.contentId);
  assert.equal(inline.length, 2);
  assert.equal(files.length, 2);
  assert.equal(files[0]?.filename, inline[0]?.filename);
});

test("empty notes, payment, and photos are left out, and a street view image is embedded when provided", () => {
  const email = sample({
    payment: "",
    measurements: "",
    width: "",
    depth: "",
    height: "",
    photos: [],
    houseImage: { bytes: Buffer.from("street-view-bytes-are-long-enough"), contentType: "image/jpeg" },
  });
  assert.equal(email.html.includes("Notes"), false);
  assert.equal(email.html.includes("Payment"), false);
  assert.match(email.html, /No photos uploaded\./);
  assert.equal(email.html.includes("cid:photo-1"), false);
  assert.match(email.html, /cid:house-street-view/);
  assert.match(email.html, /Open Street View/);
  assert.match(email.html, /Open in Google Maps/);
  assert.equal(email.html.includes(">Open in Maps<"), false);
  assert.equal(email.attachments.some((item) => item.contentId === "house-street-view"), true);
});

test("an update email uses the same card and a consult-update subject", () => {
  const email = sample({ kind: "update", newPhotoCount: 2, name: "TEST Jane" });
  assert.equal(email.subject, "[TEST] Consult update · TEST Jane · Lafayette");
  assert.match(email.html, /Consult update/);
  assert.match(email.html, /Added 2 photos/);
});

test("directions link uses the address and driving mode", () => {
  assert.match(mapsDirectionsUrl("412 Sample Street, Lafayette, LA 70508"), /google\.com\/maps\/dir\/\?api=1&destination=412%20Sample%20Street%2C%20Lafayette%2C%20LA%2070508&travelmode=driving/);
  assert.equal(mapsDirectionsUrl("  "), "");
});

test("maps link opens street view when a pin exists", () => {
  assert.match(openInMapsUrl("412 Sample Street, Lafayette, LA 70508", 30.2, -92.02), /map_action=pano&viewpoint=30\.2,-92\.02/);
  assert.match(openInMapsUrl("412 Sample Street, Lafayette, LA 70508", null, null), /google\.com\/maps\/search/);
  assert.equal(readGoogleMapsKey({ GOOGLE_STREET_VIEW_API_KEY: " existing " } as unknown as NodeJS.ProcessEnv), "existing");
  assert.equal(readGoogleMapsKey({} as unknown as NodeJS.ProcessEnv), "");
});

test("street view image is skipped without a key and when imagery is missing", async () => {
  const calls: string[] = [];
  const fetchImpl = async (url: string) => {
    calls.push(url);
    return new Response(JSON.stringify({ status: "ZERO_RESULTS" }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const missing = await fetchStreetViewImage(
    { address: "412 Sample Street, Lafayette, LA 70508", lat: 30.2, lon: -92 },
    { fetchImpl, env: { GOOGLE_MAPS_API_KEY: "test-key" } as unknown as NodeJS.ProcessEnv },
  );
  assert.equal(missing, null);
  assert.match(calls[0] ?? "", /streetview\/metadata/);
  assert.equal(calls[0]?.includes("test-key"), true);
  const noKey = await fetchStreetViewImage(
    { address: "412 Sample Street", lat: null, lon: null },
    { fetchImpl, env: {} as unknown as NodeJS.ProcessEnv },
  );
  assert.equal(noKey, null);
  assert.equal(calls.length, 1);
});

test("geocoding fills a street view pin, and a missing result falls back to a maps search link", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetchImpl = async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    return new Response(JSON.stringify([{ lat: "30.224", lon: "-92.019" }]), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  const pinned = await resolveHouseMapLinks("705 W University Ave, Lafayette, LA 70506", 30.22, -92.02, { fetchImpl });
  assert.equal(calls.length, 0);
  assert.match(pinned.streetViewUrl, /map_action=pano&viewpoint=30\.22,-92\.02/);
  assert.match(pinned.mapsUrl, /google\.com\/maps\/search\/\?api=1&query=/);
  assert.equal(pinned.geocoded, false);

  const geocoded = await resolveHouseMapLinks("705 W University Ave, Lafayette, LA 70506", null, null, { fetchImpl });
  assert.equal(calls.length, 1);
  assert.match(calls[0]?.url ?? "", /nominatim\.openstreetmap\.org\/search/);
  assert.equal((calls[0]?.init?.headers as Record<string, string>)["User-Agent"], NOMINATIM_USER_AGENT);
  assert.match(geocoded.streetViewUrl, /map_action=pano&viewpoint=30\.224,-92\.019/);
  assert.equal(geocoded.geocoded, true);
  assert.equal(geocoded.latitude, 30.224);
  assert.equal(geocoded.longitude, -92.019);

  const failed = await resolveHouseMapLinks("705 W University Ave, Lafayette, LA 70506", null, null, {
    fetchImpl: async () => new Response("nope", { status: 500 }),
  });
  assert.match(failed.streetViewUrl, /google\.com\/maps\/search\/\?api=1&query=/);
  assert.equal(failed.streetViewUrl, failed.mapsUrl);
  assert.equal(failed.geocoded, false);

  const crashed = await resolveHouseMapLinks("705 W University Ave, Lafayette, LA 70506", null, null, {
    fetchImpl: async () => {
      throw new Error("network down");
    },
  });
  assert.equal(crashed.streetViewUrl, crashed.mapsUrl);
  assert.match(crashed.mapsUrl, /query=/);
});

test("an email without a pin still includes a street view fallback and a google maps link", () => {
  const email = sample({ latitude: null, longitude: null, photos: [] });
  assert.match(email.html, /Open Street View/);
  assert.match(email.html, /Open in Google Maps/);
  assert.match(email.html, /google\.com\/maps\/search\/\?api=1&amp;query=/);
  assert.equal(email.html.includes("map_action=pano"), false);
});

test("the lead email includes the source page, referrer, and campaign when present", () => {
  const email = sample({
    sourcePage: "/serving-houma",
    formPage: "/estimate",
    referrer: "https://www.google.com/",
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: "spring",
  });
  assert.match(email.html, /Source/);
  assert.match(email.html, /\/serving-houma \(form \/estimate\)/);
  assert.match(email.html, /Referrer/);
  assert.match(email.html, /google\.com/);
  assert.match(email.html, /Campaign/);
  assert.match(email.html, /google \/ cpc \/ spring/);
  assert.match(email.text, /Source: \/serving-houma \(form \/estimate\)/);
});

test("the lead email records the exact consent checkbox, page path, and timestamp", () => {
  const email = sample({
    consent: true,
    consentAt: when,
    consentText: 'Checkbox on /estimate: "I agree that Acadiana Bathrooms and Countertops may contact me about this project request by phone, text, or email."',
  });
  assert.match(email.html, /Consent/);
  assert.match(email.html, /Yes, Nov 9, 5:14 PM/);
  assert.match(email.html, /Checkbox on \/estimate/);
  assert.match(
    email.html,
    /I agree that Acadiana Bathrooms and Countertops may contact me about this project request by phone, text, or email/,
  );
  assert.match(email.text, /Checkbox on \/estimate/);
});


test("design picks, talking points, and related looks show clearly in Justin's lead email", () => {
  const email = sample({
    features: [
      "Path: Design My Bathroom",
      "Style picked: Tub-to-shower (walk-in) · Green zellige (Custom tile)",
      "Conversion: Tub-to-shower (walk-in)",
      "Walls: Green zellige (Custom tile)",
      "Floor: Hex",
      "Fixture finish: Brass",
      "Talking point (Good): They picked a tub-to-shower (walk-in) with green zellige walls, a hex floor, and brass fixtures. Starting at $5K.",
      "Talking point (Better): Upgrade to talk through: a marble-lined niche, frameless clear glass.",
      "Talking point (Best): If they want the full treatment: going curbless with a linear drain.",
      "Related looks shown: Green zellige, Green zellige + hex floor, Emerald zellige",
    ].join("\n"),
  });
  assert.match(email.text, /Conversion: Tub-to-shower \(walk-in\)/);
  assert.match(email.text, /Floor: Hex/);
  assert.match(email.text, /Fixture finish: Brass/);
  assert.match(email.text, /Talking point \(Good\):/);
  assert.match(email.text, /Starting at \$5K/);
  assert.match(email.text, /Related looks shown: Green zellige/);
  assert.match(email.html, /Tub-to-shower \(walk-in\)/);
  assert.match(email.html, /marble-lined niche/);
  assert.doesNotMatch(email.text, /AI design|granite|licensed|insured|deposit|about a minute/i);
});
