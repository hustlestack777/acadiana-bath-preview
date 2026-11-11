/**
 * Budget question for /design and the consult forms. Justin will refine this.
 * These are the visitor's own budget ranges (their answer), not our prices.
 * `order` lists style keys from lib/design-styles.ts, best fit first. Styles not listed keep their default order after these.
 */
export type BudgetId = "under-7500" | "7500-15k" | "15k-30k" | "30k-plus";

export const budgetQuestion = "What budget are you working with?";

export const budgetOptions: { id: BudgetId; label: string; order: string[] }[] = [
  { id: "under-7500", label: "Under $7,500", order: ["ss-walkin", "ss-arch", "curbless", "dark-spa"] },
  { id: "7500-15k", label: "$7,500–$15K", order: ["ss-arch", "ss-walkin", "curbless", "warm-arch", "sand-niche"] },
  { id: "15k-30k", label: "$15K–$30K", order: ["zellige", "warm-arch", "sand-niche", "dark-spa", "slab-vanity", "neo-deco"] },
  { id: "30k-plus", label: "$30K+", order: ["slab-vanity", "zellige", "warm-arch", "neo-deco", "sand-niche", "dark-spa"] },
];

export function findBudget(id: string) {
  return budgetOptions.find((option) => option.id === id) ?? null;
}

/** "Budget: $15K–$30K" for the lead email and DB, or "" when skipped. */
export function budgetTag(id: string) {
  const option = findBudget(id);
  return option ? `Budget: ${option.label}` : "";
}

/** All styles, best fit for the budget first. */
export function orderByBudget<T extends { key: string }>(styles: T[], id: string): T[] {
  const order = findBudget(id)?.order ?? [];
  const rank = (key: string) => {
    const index = order.indexOf(key);
    return index === -1 ? order.length : index;
  };
  return styles
    .map((style, index) => ({ style, index }))
    .sort((a, b) => rank(a.style.key) - rank(b.style.key) || a.index - b.index)
    .map(({ style }) => style);
}
