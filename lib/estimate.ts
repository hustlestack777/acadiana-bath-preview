import { finishes, projects, timings } from "./copy";

export type DetailInput = {
  project: string;
  notSure: boolean;
  width: string;
  depth: string;
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

  if (!input.notSure) {
    const width = Number(input.width);
    const depth = Number(input.depth);
    const widthOk = input.width.trim() !== "" && Number.isFinite(width) && width > 0 && width <= 240;
    const depthOk = input.depth.trim() !== "" && Number.isFinite(depth) && depth > 0 && depth <= 240;
    if (!widthOk || !depthOk) {
      errors.dimensions =
        "Enter a rough width and depth in inches, or choose Not sure.";
    }
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
