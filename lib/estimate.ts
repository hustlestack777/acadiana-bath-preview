import { finishes, homeowners, pathProjects, payments, projects, timings } from "./copy";

export type DetailInput = {
  project: string;
  notSure: boolean;
  width: string;
  depth: string;
  height?: string;
  measurements?: string;
  finish: string;
  features: string;
  name: string;
  phone: string;
  email: string;
  preferred: string;
  timing: string;
  homeowner?: string;
  payment?: string;
  consent?: boolean;
  preferredCallTime?: string;
};

const PROJECT_IDS = new Set<string>([...projects, ...pathProjects].map((item) => item.id));
const FINISH_IDS = new Set<string>(finishes.map((item) => item.id));
const TIMING_IDS = new Set<string>(timings.map((item) => item.id));
const HOMEOWNER_IDS = new Set<string>(homeowners.map((item) => item.id));
const PAYMENT_IDS = new Set<string>(payments.map((item) => item.id));

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function emailOk(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Street address for the visit. A house number is required so the crew can find the house. */
export function validateStreet(street: string) {
  const trimmed = street.trim();
  if (!trimmed) return "Enter the street address so we can find the house.";
  if (trimmed.length < 5 || trimmed.length > 200) {
    return "Enter the street address, including the house number.";
  }
  if (!/\d/.test(trimmed)) return "Include the house number so we can find the house.";
  return "";
}

export function validateZip(zip: string) {
  const trimmed = zip.trim();
  if (!trimmed) return "";
  if (!/^\d{5}(?:-\d{4})?$/.test(trimmed)) {
    return "Use a 5-digit ZIP, or leave it blank.";
  }
  return "";
}

/** Validate the 4-step consult form (before extras). Dimensions stay optional. */
export function validateDetails(input: DetailInput) {
  const errors: Record<string, string> = {};

  const selected = input.project.split(",").map((item) => item.trim()).filter(Boolean);
  if (!selected.length || selected.some((item) => !PROJECT_IDS.has(item))) {
    errors.project = "Choose at least one project option.";
  }

  if (!HOMEOWNER_IDS.has(input.homeowner ?? "")) {
    errors.homeowner = "Tell us whether you own or rent.";
  }

  if (!PAYMENT_IDS.has(input.payment ?? "")) {
    errors.payment = "Choose a payment preference. Not sure yet is fine.";
  }

  if (!TIMING_IDS.has(input.timing)) {
    errors.timing = "Choose a project timing. This is your timing, not a scheduled date.";
  }

  // Finish is no longer asked on the short form. Accept a known id or blank (saved as unsure).
  if (input.finish && !FINISH_IDS.has(input.finish)) {
    errors.finish = "Choose a finish direction. Not sure yet is fine.";
  }

  if (input.features.trim().length > 600) {
    errors.features = "Keep the feature note under 600 characters.";
  }

  // Dimensions are optional (usually added after submit).
  const dims: Array<[string, string | undefined]> = [
    ["width", input.width],
    ["depth", input.depth],
    ["height", input.height],
  ];
  for (const [, raw] of dims) {
    const value = (raw ?? "").trim();
    if (!value) continue;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 240) {
      errors.dimensions = "Use rough numbers in inches (1 to 240), or leave the size blank.";
      break;
    }
  }
  if ((input.measurements ?? "").trim().length > 600) {
    errors.measurements = "Keep the measurements note under 600 characters.";
  }

  if (input.name.trim().length < 2) {
    errors.name = "Enter your name.";
  }

  const phoneDigits = digits(input.phone);
  if (input.phone.trim() && (phoneDigits.length < 7 || phoneDigits.length > 15)) {
    errors.phone = "Enter a phone number with at least 7 digits, or clear the field.";
  }

  if (input.email.trim() && !emailOk(input.email)) {
    errors.email = "Enter a valid email, or clear the field.";
  }

  if (input.preferred !== "phone" && input.preferred !== "email") {
    errors.preferred = "Choose phone or email as the way to reach you.";
  } else if (input.preferred === "phone" && phoneDigits.length < 7) {
    errors.phone = "Enter the phone number you want used for this consult.";
  } else if (input.preferred === "email" && !emailOk(input.email)) {
    errors.email = "Enter the email you want used for this consult.";
  }

  if (!input.consent) {
    errors.consent = "Check the box so Acadiana Bathrooms and Countertops can contact you about this request.";
  }

  if ((input.preferredCallTime ?? "").trim().length > 300) {
    errors.preferredCallTime = "Keep the preferred call time under 300 characters.";
  }

  return errors;
}

/** Optional extras after the lead is saved. */
export function validateExtras(input: {
  width?: string;
  depth?: string;
  height?: string;
  measurements?: string;
  preferredCallTime?: string;
}) {
  const errors: Record<string, string> = {};
  const dims: Array<[string, string | undefined]> = [
    ["width", input.width],
    ["depth", input.depth],
    ["height", input.height],
  ];
  for (const [, raw] of dims) {
    const value = (raw ?? "").trim();
    if (!value) continue;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 240) {
      errors.dimensions = "Use rough numbers in inches (1 to 240), or leave the size blank.";
      break;
    }
  }
  if ((input.measurements ?? "").trim().length > 600) {
    errors.measurements = "Keep the measurements note under 600 characters.";
  }
  if ((input.preferredCallTime ?? "").trim().length > 300) {
    errors.preferredCallTime = "Keep the preferred call time under 300 characters.";
  }
  return errors;
}
