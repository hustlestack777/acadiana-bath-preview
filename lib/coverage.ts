/**
 * Service area. Based in Lafayette, serving Acadiana and South Louisiana.
 * There is no allow-list: any town or ZIP is accepted on every form, and Justin confirms the visit.
 * MAIN_TOWNS only feeds suggestions.
 */

export const SERVICE_AREA =
  "Serving Acadiana and South Louisiana, from Lake Charles to Baton Rouge, including Prairieville and Gonzales, and from Alexandria down to Houma and Thibodaux.";

export const MAIN_TOWNS = [
  "Lafayette",
  "Broussard",
  "Youngsville",
  "Scott",
  "Carencro",
  "Breaux Bridge",
  "New Iberia",
  "Abbeville",
  "Crowley",
  "Opelousas",
  "Eunice",
  "Lake Charles",
  "Sulphur",
  "Moss Bluff",
  "Jennings",
  "Alexandria",
  "Pineville",
  "Baton Rouge",
  "Prairieville",
  "Gonzales",
  "Houma",
  "Thibodaux",
  "Morgan City",
] as const;

/** Kept for older imports: suggestions only, never a gate. */
export const SUPPORTED_TOWNS = MAIN_TOWNS;

export type Coverage = { status: "empty" } | { status: "invalid" } | { status: "supported"; name: string };

/** Accepts any town or ZIP. Only blank or absurdly long input is rejected. */
export function checkCity(input: string): Coverage {
  const trimmed = input.trim().replace(/\s+/g, " ");
  if (!trimmed) return { status: "empty" };
  if (trimmed.length > 80) return { status: "invalid" };
  const known = MAIN_TOWNS.find((town) => town.toLowerCase() === trimmed.toLowerCase().replace(/,?\s*(la|louisiana)\.?$/, ""));
  return { status: "supported", name: known ?? trimmed };
}
