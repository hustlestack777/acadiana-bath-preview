import { NextResponse } from "next/server";
import { isTestRequest, clientIp } from "@/lib/design-sessions";
import { isTeamTestLead } from "@/lib/lead-notify";
import { consentRecord } from "@/lib/lead-consent";
import { saveLead, validateLead, type LeadInput } from "@/lib/leads";
import { fullAddress } from "@/lib/lead-display";
import {
  computeWindowEstimate,
  MATERIAL_BANDS,
  parseWindowCount,
  ROOMS,
  STYLES,
  windowCustomerRecap,
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

  const name = text(form, "name", 120);
  const phone = text(form, "phone", 40);
  const email = text(form, "email", 200);
  const test = isTestRequest(request) || isTeamTestLead(phone, email, name);
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
    streetViewSuggested: suggested,
  });

  const input: LeadInput = {
    sourcePage: text(form, "sourcePage", 80) || WINDOWS_SOURCE_PAGE,
    formPage: text(form, "formPage", 80) || WINDOWS_SOURCE_PAGE,
    landingPage: text(form, "landingPage", 80),
    referrer: text(form, "referrer", 500),
    src: text(form, "src", 200),
    utmSource: text(form, "utmSource", 200),
    utmMedium: text(form, "utmMedium", 200),
    utmCampaign: text(form, "utmCampaign", 200),
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
    measurements: "",
    finish: material,
    features: notes,
    name,
    phone,
    email,
    preferred: "phone",
    marketing: false,
    timing: "",
    budget: "",
    homeowner: "",
    payment: "",
    consent: true,
    consentAt,
    consentText: consentRecord(WINDOWS_CONSENT_TEXT, text(form, "formPage", 80) || WINDOWS_SOURCE_PAGE),
    preferredCallDay: text(form, "preferredCallDay"),
    preferredCallTime: text(form, "preferredCallTime"),
    photos: [],
  };

  const { errors } = validateLead(input);
  if (Object.keys(errors).length) {
    return fail("Please check the highlighted fields.", 400, errors);
  }

  const result = await saveLead(
    input,
    clientIp(request),
    {
      test,
      subject: windowLeadSubject(name, city, standardCount, material),
      customerRecap: windowCustomerRecap({
        standardCount,
        bayBowCount,
        material,
        styles,
        rooms,
        replaceAll: replaceAll === "all" || replaceAll === "some" ? replaceAll : "",
        estimate,
        address: fullAddress(street, city, zip),
      }),
    },
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
