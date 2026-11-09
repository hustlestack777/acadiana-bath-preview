import assert from "node:assert/strict";
import { test } from "node:test";
import { buildLeadEmail } from "./lead-email";
import { formatChicago, formatEmailSize, formatThankYouSize, leadSubject } from "./lead-display";
import { fetchStreetViewImage, openInMapsUrl, readGoogleMapsKey } from "./street-view";

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
  assert.match(email.html, /Call \(337\) 555-0142/);
  assert.match(email.html, /mailto:jane\.comeaux@email\.com/);
  assert.match(email.html, /Email Jane/);
  assert.match(email.html, /412 Sample Street/);
  assert.match(email.html, /Lafayette, LA 70508/);
  assert.match(email.html, /map_action=pano/);
  assert.match(email.html, /Open Street View/);
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
  assert.equal(email.html.includes("Their photos"), false);
  assert.match(email.html, /cid:house-street-view/);
  assert.match(email.html, /Open in Maps/);
  assert.equal(email.html.includes("Open Street View"), false);
  assert.equal(email.attachments.some((item) => item.contentId === "house-street-view"), true);
});

test("an update email uses the same card and a consult-update subject", () => {
  const email = sample({ kind: "update", newPhotoCount: 2, name: "TEST Jane" });
  assert.equal(email.subject, "[TEST] Consult update · TEST Jane · Lafayette");
  assert.match(email.html, /Consult update/);
  assert.match(email.html, /Added 2 photos/);
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
