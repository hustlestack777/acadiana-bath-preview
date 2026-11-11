import { NextResponse } from "next/server";
import { isTestRequest, testRecipients, clientIp } from "@/lib/design-sessions";
import { saveLead, validateLead, type LeadInput } from "@/lib/leads";
import {
  computeWindowEstimate,
  MATERIAL_BANDS,
  parseWindowCount,
  ROOMS,
  STYLES,
  windowLeadNotes,
  windowLeadSubject,
  WINDOWS_CONSENT_TEXT,
  WINDOWS_SOURCE_PAGE,
  type MaterialId,
  type RoomId,
  type StyleId,
} from "@/lib/windows";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function text(form: FormData, key: string, max = 300) {
  const value = form.get(key);
  return typeof value === "string" ? value.slice(0, max) : "";
}

function coordinate(raw: string, min: number, max: number) {
  if (!raw.trim()) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= min && value <= max ? value : null;
}

const MATERIAL_IDS = new Set(Object.keys(MATERIAL_BANDS));
const STYLE_IDS = new Set(STYLES.map((item) => item.id));
const ROOM_IDS = new Set(ROOMS.map((item) => item.id));

function fail(error: string, status: number, errors?: Record<string, string>) {
  return NextResponse.json({ ok: false, error, errors }, { status });
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Send the form again.", 400);
  }
  if (text(form, "company_fax").trim()) return fail("We couldn't submit that.", 400);

  const test = isTestRequest(request);
  const recipients = test ? testRecipients() : undefined;
  if (test && !recipients?.length) return fail("Test inbox is not set.", 503);

  const name = text(form, "name", 120);
  const phone = text(form, "phone", 40);
  const email = text(form, "email", 200);
  const street = text(form, "street", 200);
  const city = text(form, "city", 80);
  const zip = text(form, "zip", 10);
  const materialRaw = text(form, "material", 40);
  const material = (MATERIAL_IDS.has(materialRaw) ? materialRaw : "unsure") as MaterialId;
  const standardCount = parseWindowCount(text(form, "standardCount", 8) || null);
  const bayBowCount = Math.max(0, Math.min(10, Number(text(form, "bayBowCount", 4) || "0") || 0));
  const styles = text(form, "styles", 200)
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is StyleId => STYLE_IDS.has(item as StyleId));
  const rooms = text(form, "rooms", 200)
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is RoomId => ROOM_IDS.has(item as RoomId));
  const replaceAll = text(form, "replaceAll", 8);
  const suggested = parseWindowCount(text(form, "suggestedCount", 8) || null);
  const consent = text(form, "consent") === "true" || text(form, "consent") === "on";
  if (!consent) {
    return fail("Please agree so we can contact you about your quote.", 400, {
      consent: "Please check the box to continue.",
    });
  }
  const consentAt = new Date();
  const estimate = computeWindowEstimate({ standardCount, bayBowCount, material });
  const notes = windowLeadNotes({
    standardCount,
    bayBowCount,
    material,
    impactChoice: material === "impact",
    styles,
    rooms,
    replaceAll: replaceAll === "all" || replaceAll === "some" ? replaceAll : "",
    estimate,
    consentAt,
    streetViewSuggested: suggested,
  });

  const input: LeadInput = {
    sourcePage: WINDOWS_SOURCE_PAGE,
    street,
    latitude: coordinate(text(form, "latitude"), -90, 90),
    longitude: coordinate(text(form, "longitude"), -180, 180),
    city,
    zip,
    project: "windows",
    notSure: standardCount == null,
    width: "",
    depth: "",
    height: "",
    measurements: notes,
    finish: material,
    features: notes,
    name,
    phone,
    email,
    preferred: "phone",
    marketing: false,
    timing: "",
    budget: estimate ? `${estimate.low}-${estimate.high}` : "",
    homeowner: "",
    payment: "",
    consent: true,
    consentAt,
    consentText: WINDOWS_CONSENT_TEXT,
    preferredCallTime: "",
    photos: [],
  };

  const { errors } = validateLead(input);
  if (Object.keys(errors).length) {
    return fail("Please check the highlighted fields.", 400, errors);
  }

  const notifyName = test && !/^\s*test/i.test(name) ? `TEST ${name}` : name;
  const result = await saveLead(
    { ...input, name: notifyName },
    clientIp(request),
    { recipients, subject: windowLeadSubject(notifyName, city, standardCount, material) },
  );
  if (!result.ok) return fail(result.error, result.status);
  return NextResponse.json({
    ok: true,
    id: result.id,
    emailSent: result.emailSent,
    estimate: estimate
      ? { low: estimate.low, high: estimate.high, openHigh: estimate.openHigh, headline: undefined }
      : null,
    consentAt: consentAt.toISOString(),
  });
}
