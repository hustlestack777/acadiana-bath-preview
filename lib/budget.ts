/**
 * Budget question for /design and the consult forms. Justin will refine this.
 * These are the visitor's own budget ranges (their answer), not our prices.
 * `order` lists Boogie image numbers (the `boogie` field in lib/design-styles.ts), best fit first.
 */
export type BudgetId = "under-7500" | "7500-15k" | "15k-30k" | "30k-plus";

export const budgetQuestion = "What budget are you working with?";

/**
 * Boogie's starting mapping (boogie_NN image numbers, "ss" = solid surface walk-in card), Nov 10, 2026.
 * Listed numbers show first, in this order. Every other look follows in its default order,
 * so the rest sit in the middle and all looks always show.
 */
export const budgetOptions: { id: BudgetId; label: string; order: string[] }[] = [
  { id: "under-7500", label: "Under $7,500", order: ["13", "16"] },
  { id: "7500-15k", label: "$7,500–$15K", order: ["17", "21", "15", "22"] },
  { id: "15k-30k", label: "$15K–$30K", order: ["18", "20", "19", "09"] },
  { id: "30k-plus", label: "$30K+", order: ["10", "24", "14"] },
];

export function findBudget(id: string) {
  return budgetOptions.find((option) => option.id === id) ?? null;
}

/** "Budget: $15K–$30K" for the lead email and DB, or "" when skipped. */
export function budgetTag(id: string) {
  const option = findBudget(id);
  return option ? `Budget: ${option.label}` : "";
}

/**
 * All styles, best fit for the budget first. Then the looks no tier claims (the middle),
 * then other tiers' picks, nearest budget tier first. Skipped budget keeps the default order.
 */
export function orderByBudget<T extends { boogie: string }>(styles: T[], id: string): T[] {
  const tier = budgetOptions.findIndex((option) => option.id === id);
  if (tier === -1) return styles;
  const rank = (boogie: string) => {
    const own = budgetOptions[tier].order.indexOf(boogie);
    if (own !== -1) return own;
    const other = budgetOptions.findIndex((option) => option.order.includes(boogie));
    if (other === -1) return 100;
    return 200 + Math.abs(other - tier) * 20 + budgetOptions[other].order.indexOf(boogie);
  };
  return styles
    .map((style, index) => ({ style, index }))
    .sort((a, b) => rank(a.style.boogie) - rank(b.style.boogie) || a.index - b.index)
    .map(({ style }) => style);
}
