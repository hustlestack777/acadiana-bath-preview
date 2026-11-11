import { homeowners, pathProjects, payments, projects, timings } from "./copy";

/** Human labels for stored ids. Unknown ids are title-cased, never shown raw. */
export function choiceLabel(id: string, list: readonly { id: string; label: string }[]) {
  const trimmed = id.trim();
  if (!trimmed) return "";
  return list.find((item) => item.id === trimmed)?.label ?? titleCase(trimmed);
}

export function projectLabels(value: string) {
  const selected = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (!selected.length) return "";
  return selected.map((id) => choiceLabel(id, [...projects, ...pathProjects])).join(", ");
}

export function homeownerLabel(id: string) {
  return choiceLabel(id, homeowners);
}

export function paymentLabel(id: string) {
  return choiceLabel(id, payments);
}

export function timingLabel(id: string) {
  return choiceLabel(id, timings);
}

function titleCase(id: string) {
  return id
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const core = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (core.length === 10) {
    return `(${core.slice(0, 3)}) ${core.slice(3, 6)}-${core.slice(6)}`;
  }
  return phone.trim();
}

export function phoneTel(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  if (digits.length >= 7) return `tel:+${digits}`;
  return "";
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "";
}

function inchMark(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) return "";
  const shown = Number.isInteger(parsed) ? String(parsed) : String(parsed);
  return `${shown}\u2033`;
}

/** Thank-you card: `60″ × 30″ alcove`. Empty when the customer gave no size. */
export function formatThankYouSize(width: string, depth: string, height: string, note: string) {
  const dims = [width, depth, height].map(inchMark).filter(Boolean);
  const extra = note.trim();
  const shortExtra = extra.length > 0 && extra.length <= 48 ? extra : "";
  if (dims.length && shortExtra) return `${dims.join(" \u00d7 ")} ${shortExtra}`;
  if (dims.length) return dims.join(" \u00d7 ");
  return extra;
}

/** Email job line: `60″ wide × 30″ deep × 14″ high`. The written note stays in Notes. */
export function formatEmailSize(width: string, depth: string, height: string) {
  const parts: string[] = [];
  const wide = inchMark(width);
  const deep = inchMark(depth);
  const high = inchMark(height);
  if (wide) parts.push(`${wide} wide`);
  if (deep) parts.push(`${deep} deep`);
  if (high) parts.push(`${high} high`);
  return parts.join(" \u00d7 ");
}

/** `Lafayette, LA 70508`. Street is intentionally not included. */
export function localityLine(city: string, zip: string) {
  const place = city.trim();
  const postal = zip.trim();
  if (!place && !postal) return "";
  if (!place) return postal;
  return postal ? `${place}, LA ${postal}` : `${place}, LA`;
}

export function fullAddress(street: string, city: string, zip: string) {
  return [street.trim(), localityLine(city, zip)].filter(Boolean).join(", ");
}

export function leadNotes(measurements: string, features: string, budget: string) {
  return [measurements, features, budget]
    .map((item) => item.trim())
    .filter(Boolean)
    .join("\n");
}

export function formatChicago(date: Date) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
  return formatted.replace(/\u202f/g, " ");
}

export function isTestLead(name: string) {
  return name.trim().toUpperCase().startsWith("TEST");
}

export function leadSubject(name: string, town: string, kind: "new" | "update") {
  const who = name.trim() || "New lead";
  const where = town.trim();
  const core =
    kind === "update"
      ? `Consult update \u00b7 ${who}${where ? ` \u00b7 ${where}` : ""}`
      : `New consult \u00b7 ${who}${where ? ` \u00b7 ${where}` : ""}`;
  return isTestLead(name) ? `[TEST] ${core}` : core;
}
