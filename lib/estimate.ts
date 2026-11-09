import { finishes, projects, timings } from "./copy";

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
};

const PROJECT_IDS = new Set<string>(projects.map((item) => item.id));
const FINISH_IDS = new Set<string>(finishes.map((item) => item.id));
const TIMING_IDS = new Set<string>(timings.map((item) => item.id));

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function emailOk(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateZip(zip: string) {
  const trimmed = zip.trim();
  if (!trimmed) return "";
  if (!/^\d{5}(?:-\d{4})?$/.test(trimmed)) {
    return "Use a 5-digit ZIP, or leave it blank. The city decides coverage on this prototype.";
  }
  return "";
}

export function validateDetails(input: DetailInput) {
  const errors: Record<string, string> = {};

  const selected = input.project.split(",").map((item) => item.trim()).filter(Boolean);
  if (!selected.length || selected.some((item) => !PROJECT_IDS.has(item))) {
    errors.project = "Choose at least one service.";
  }

  // Dimensions are optional. Rough numbers are fine; Justin measures in person.
  // TODO: AI dimension estimate from photos (known fixture sizes) - not built yet.
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

  if (!FINISH_IDS.has(input.finish)) {
    errors.finish = "Choose a finish direction. Not sure yet is fine.";
  }

  if (input.features.trim().length > 600) {
    errors.features = "Keep the feature note under 600 characters.";
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
    errors.phone = "Enter the phone number you want used for this project review.";
  } else if (input.preferred === "email" && !emailOk(input.email)) {
    errors.email = "Enter the email you want used for this project review.";
  }

  if (!TIMING_IDS.has(input.timing)) {
    errors.timing = "Choose a project timing. This is your timing, not a scheduled date.";
  }

  return errors;
}
