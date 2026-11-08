/** Planned towns only. ZIP codes are not used to approve coverage. */

export const CORRIDOR = [
  "Lake Charles",
  "Jennings",
  "Crowley",
  "Lafayette",
  "Opelousas",
  "Baton Rouge",
] as const;

export const ALSO_PLANNED = [
  "Broussard",
  "Youngsville",
  "New Iberia",
  "Franklin",
  "Morgan City",
  "Thibodaux",
  "Houma",
  "Alexandria",
] as const;

export const EXCLUDED = ["Prairieville", "Gonzales"] as const;

export const SUPPORTED_TOWNS = [...CORRIDOR, ...ALSO_PLANNED] as const;

const FILLERS = new Set(["la", "louisiana", "city", "town", "the", "of"]);

export type Coverage =
  | { status: "empty" }
  | { status: "excluded"; name: string }
  | { status: "supported"; name: string }
  | { status: "unknown" };

function normalize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsPhrase(text: string, phrase: string) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`).test(text);
}

export function checkCity(input: string): Coverage {
  const trimmed = input.trim();
  if (!trimmed) return { status: "empty" };

  const normalized = normalize(trimmed);
  if (!normalized) return { status: "unknown" };

  for (const town of EXCLUDED) {
    if (containsPhrase(normalized, town.toLowerCase())) {
      return { status: "excluded", name: town };
    }
  }

  const hits = SUPPORTED_TOWNS.filter((town) =>
    containsPhrase(normalized, town.toLowerCase()),
  );

  if (hits.length !== 1) return { status: "unknown" };

  const town = hits[0];
  const remainder = normalized
    .replace(town.toLowerCase(), " ")
    .split(/\s+/)
    .filter(Boolean);

  if (remainder.every((word) => FILLERS.has(word))) {
    return { status: "supported", name: town };
  }

  return { status: "unknown" };
}
