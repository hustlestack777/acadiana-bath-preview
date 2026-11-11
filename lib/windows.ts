/** Window quote magnet: planning bands, copy constants, and estimate math.
 * Customer-facing copy must not name brands, licenses, timelines, deposits, or "AI".
 */

export const GET_MY_CUSTOM_QUOTE = "Get My Custom Quote";

export const WINDOWS_CONSENT_TEXT =
  "By submitting, you agree Acadiana Bathrooms may call or text you about your quote, including automated texts. Msg & data rates may apply. Reply STOP to opt out.";

export const BUTTON_SUB =
  "Justin will call you to talk through your windows and set up a time to measure.";

export const WINDOWS_SOURCE_PAGE = "/windows";

export const SERVICE_AREA_WINDOWS =
  "Serving Acadiana and South Louisiana, from Lake Charles to Baton Rouge, including Prairieville and Gonzales, and from Alexandria to Houma and Thibodaux.";

export const MAX_STANDARD_STEPPER = 30;

export type MaterialId = "vinyl" | "fiberglass-wood" | "impact" | "premium" | "unsure";

export type StyleId = "single-hung" | "double-hung" | "picture" | "bay-bow" | "slider" | "casement" | "unsure";

export type RoomId =
  | "living"
  | "kitchen"
  | "dining"
  | "bedrooms"
  | "bathrooms"
  | "sunroom"
  | "hallway"
  | "other";

/** Installed planning bands per standard opening, until Justin supplies his rates. */
export const MATERIAL_BANDS: Record<MaterialId, { low: number; high: number; label: string }> = {
  vinyl: { low: 450, high: 1350, label: "vinyl" },
  "fiberglass-wood": { low: 400, high: 2200, label: "fiberglass or wood" },
  impact: { low: 800, high: 2000, label: "impact-resistant glass" },
  premium: { low: 1300, high: 3500, label: "premium wood and fiberglass" },
  unsure: { low: 450, high: 3500, label: "a mix of materials" },
};

/** Bay or bow openings are priced separately, not as extra standard windows. */
export const BAY_BOW_BAND = { low: 2000, high: 8000, openHigh: true };

export const STYLES: { id: StyleId; name: string; blurb: string }[] = [
  { id: "single-hung", name: "Single-hung", blurb: "The bottom sash opens. A common, straightforward replacement." },
  { id: "double-hung", name: "Double-hung", blurb: "Both sashes slide, and many tilt in for cleaning. The most requested style." },
  { id: "picture", name: "Picture", blurb: "A fixed pane that doesn't open. Often used for a view or over a kitchen sink." },
  { id: "bay-bow", name: "Bay or bow", blurb: "Projects from the wall and adds light and space. Priced as its own opening." },
  { id: "slider", name: "Slider", blurb: "Opens side to side. A good fit for wider, shorter openings." },
  { id: "casement", name: "Casement", blurb: "Cranks open from the side and seals tightly when closed." },
  { id: "unsure", name: "Not sure — I'll decide with Justin", blurb: "Justin will confirm what fits each opening when he measures." },
];

export const MATERIALS: { id: MaterialId; name: string; blurb: string }[] = [
  { id: "vinyl", name: "Vinyl", blurb: "A solid, lower-maintenance path for most homes." },
  {
    id: "fiberglass-wood",
    name: "Fiberglass or wood",
    blurb: "Strong, and it holds its shape well in South Louisiana heat and humidity.",
  },
  {
    id: "impact",
    name: "Impact-resistant glass",
    blurb:
      "Aimed at coastal and high-wind homes, including places from Lake Charles to Houma and Thibodaux. Justin will confirm whether this package is the right fit when he measures.",
  },
  {
    id: "premium",
    name: "Premium wood and fiberglass",
    blurb: "The higher-end look and feel, including wood interiors and fiberglass or clad exteriors.",
  },
  {
    id: "unsure",
    name: "Not sure yet",
    blurb: "We'll show a wider estimate. Justin will walk you through the differences at the measure.",
  },
];

export const ROOMS: { id: RoomId; name: string }[] = [
  { id: "living", name: "Living room" },
  { id: "kitchen", name: "Kitchen" },
  { id: "dining", name: "Dining room" },
  { id: "bedrooms", name: "Bedrooms" },
  { id: "bathrooms", name: "Bathrooms" },
  { id: "sunroom", name: "Sunroom or bonus room" },
  { id: "hallway", name: "Hallway or stair" },
  { id: "other", name: "Other" },
];

export type WindowEstimateInput = {
  /** Confirmed standard openings. Null when the customer is unsure. */
  standardCount: number | null;
  bayBowCount: number;
  material: MaterialId;
};

export type WindowEstimate = {
  low: number;
  high: number;
  openHigh: boolean;
  standardLow: number;
  standardHigh: number;
  bayLow: number;
  bayHigh: number;
  materialLabel: string;
  standardCount: number;
  bayBowCount: number;
};

export function formatUsd(amount: number, openEnded = false) {
  const rounded = Math.round(amount);
  const formatted = rounded.toLocaleString("en-US");
  return openEnded ? `$${formatted}+` : `$${formatted}`;
}

export function formatRange(low: number, high: number, openHigh = false) {
  return `${formatUsd(low)} to ${formatUsd(high, openHigh)}`;
}

function tidyMoney(value: number) {
  // Keep published band endpoints (450, 1,350) and other mid-fifty totals as-is.
  if (value % 50 === 0) return value;
  return Math.round(value / 100) * 100;
}

export function parseWindowCount(value: string | number | null | undefined): number | null {
  if (value == null || value === "" || value === "unsure") return null;
  const count = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(count) || count < 1) return null;
  return count;
}

export function computeWindowEstimate(input: WindowEstimateInput): WindowEstimate | null {
  const standardCount = input.standardCount;
  const bayBowCount = Math.max(0, Math.floor(input.bayBowCount) || 0);
  if (standardCount == null) return null;
  if (!Number.isInteger(standardCount) || standardCount < 0) return null;
  if (standardCount === 0 && bayBowCount === 0) return null;

  const band = MATERIAL_BANDS[input.material] ?? MATERIAL_BANDS.unsure;
  const standardLow = tidyMoney(standardCount * band.low);
  const standardHigh = tidyMoney(standardCount * band.high);
  const bayLow = tidyMoney(bayBowCount * BAY_BOW_BAND.low);
  const bayHigh = tidyMoney(bayBowCount * BAY_BOW_BAND.high);
  return {
    low: standardLow + bayLow,
    high: standardHigh + bayHigh,
    openHigh: bayBowCount > 0,
    standardLow,
    standardHigh,
    bayLow,
    bayHigh,
    materialLabel: band.label,
    standardCount,
    bayBowCount,
  };
}

export function estimateHeadline(estimate: WindowEstimate) {
  const windowWord = estimate.standardCount === 1 ? "window" : "windows";
  const material = estimate.materialLabel;
  if (estimate.standardCount === 0 && estimate.bayBowCount > 0) {
    const opening = estimate.bayBowCount === 1 ? "bay or bow opening" : "bay or bow openings";
    return `Based on ${estimate.bayBowCount} ${opening}, a typical installed range is about ${formatRange(estimate.low, estimate.high, estimate.openHigh)}.`;
  }
  let text = `Based on ${estimate.standardCount} ${windowWord} in ${material}, a typical installed range is about ${formatRange(estimate.standardLow, estimate.standardHigh)}.`;
  if (estimate.bayBowCount > 0) {
    const opening = estimate.bayBowCount === 1 ? "bay or bow opening" : "bay or bow openings";
    text += ` Including ${estimate.bayBowCount} ${opening}, which is estimated separately from a standard window, typically ${formatRange(estimate.bayLow, estimate.bayHigh, true)}. Combined, that's about ${formatRange(estimate.low, estimate.high, true)}.`;
  }
  return text;
}

export function windowLeadSubject(name: string, city: string, standardCount: number | null, material: MaterialId) {
  const who = name.trim() || "New lead";
  const town = city.trim();
  const count = standardCount == null ? "count TBD" : `${standardCount} window${standardCount === 1 ? "" : "s"}`;
  const materialLabel = MATERIAL_BANDS[material]?.label ?? "windows";
  const core = `New window lead · ${who} · ${town || "South Louisiana"} · ${count} · ${materialLabel}`;
  return /^\s*test/i.test(who) ? `[TEST] ${core}` : core;
}

export function windowLeadNotes(input: {
  standardCount: number | null;
  bayBowCount: number;
  material: MaterialId;
  impactChoice: boolean;
  styles: StyleId[];
  rooms: RoomId[];
  replaceAll: "all" | "some" | "";
  estimate: WindowEstimate | null;
  consentAt: Date;
  streetViewSuggested?: number | null;
}) {
  const styleNames = input.styles
    .map((id) => STYLES.find((item) => item.id === id)?.name)
    .filter(Boolean)
    .join(", ");
  const roomNames = input.rooms
    .map((id) => ROOMS.find((item) => item.id === id)?.name)
    .filter(Boolean)
    .join(", ");
  const count = input.standardCount == null ? "Unsure — Justin will count at the measure" : String(input.standardCount);
  const lines = [
    `Standard windows: ${count}`,
    input.streetViewSuggested != null ? `Street View suggestion (customer confirmed or edited): ${input.streetViewSuggested}` : "",
    input.bayBowCount > 0 ? `Bay or bow openings: ${input.bayBowCount}` : "Bay or bow openings: none",
    `Material: ${MATERIAL_BANDS[input.material]?.label ?? input.material}`,
    `Impact-resistant glass: ${input.impactChoice || input.material === "impact" ? "yes" : "no"}`,
    styleNames ? `Styles: ${styleNames}` : "Styles: not specified",
    roomNames ? `Rooms: ${roomNames}` : "Rooms: not specified",
    input.replaceAll === "all" ? "Replace: all windows in the house" : input.replaceAll === "some" ? "Replace: only some" : "",
    input.estimate
      ? `Estimate shown: ${formatRange(input.estimate.low, input.estimate.high, input.estimate.openHigh)} (ballpark, not a quote)`
      : "Estimate shown: none (count unsure)",
    `Consent: yes, ${input.consentAt.toLocaleString("en-US", { timeZone: "America/Chicago", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).replace(/\u202f/g, " ")}`,
    `Consent text: ${WINDOWS_CONSENT_TEXT}`,
  ];
  return lines.filter(Boolean).join("\n");
}
