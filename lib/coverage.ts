/**
 * Service area. Based in Lafayette, serving Acadiana and South Louisiana.
 * There is no allow-list: any town or ZIP is accepted on every form, and Justin confirms the visit.
 * MAIN_TOWNS only feeds suggestions and visible town lists.
 * Focus markets set 11/11/2026. Do not list North Shore, New Orleans, or DeRidder.
 */

export const SERVICE_AREA =
  "Serving Acadiana and South Louisiana, from Lake Charles to Baton Rouge, including Lafayette, New Iberia, Youngsville, Broussard, Crowley, Jennings, Sulphur, Westlake, Moss Bluff, Prairieville, Gonzales and Plaquemine, and from Alexandria down to Houma and Thibodaux, north to about Gillis.";

export const OUTSIDE_AREA =
  "Outside our area? Reach out anyway. Justin takes projects outside the area, with travel built into your quote.";

export const MAIN_TOWNS = [
  "Lafayette",
  "New Iberia",
  "Youngsville",
  "Broussard",
  "Crowley",
  "Jennings",
  "Lake Charles",
  "Sulphur",
  "Westlake",
  "Moss Bluff",
  "Alexandria",
  "Baton Rouge",
  "Gonzales",
  "Prairieville",
  "Plaquemine",
  "Houma",
  "Thibodaux",
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
