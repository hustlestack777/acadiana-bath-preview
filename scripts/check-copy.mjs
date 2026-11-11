import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const roots = ["app", "components", "lib", "public", "README.md"];
const skip = new Set(["node_modules", ".next", "uploads"]);
const extensions = new Set([".ts", ".tsx", ".css", ".md", ".svg", ".mjs", ".json"]);

const APPROVED_RANGE =
  "Complete bathroom remodels typically run $5,000 to $30,000+, depending on size, materials and layout. Your free consult gets you an exact number.";

const APPROVED_HERO_QUOTE = "Bathroom remodels from $5,000. Free in-home quote.";
const APPROVED_PRICE_SHORT = "$5,000 to $30,000+";
const APPROVED_SCHEMA_PRICE_RANGE = "$5,000–$30,000+";

const rules = [
  { name: "guarantee", re: /guarantee/i },
  { name: "real stone", re: /real stone/i },
  { name: "bath fitter", re: /bath fitter/i },
  { name: "re-bath", re: /re-bath/i },
  { name: "rebath", re: /rebath/i },
  { name: "dollar amount", re: /\$\s?\d{2,}/ },
  { name: "5000", re: /\b5,?000\b/ },
];

async function filesIn(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await filesIn(full)));
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

const files = [];
for (const item of roots) {
  const full = path.join(root, item);
  if (item.endsWith(".md")) files.push(full);
  else files.push(...(await filesIn(full)));
}

let failed = 0;
for (const file of files) {
  if (file.endsWith(`${path.sep}scripts${path.sep}check-copy.mjs`)) continue;
  if (file.endsWith(`${path.sep}lib${path.sep}logic.test.ts`)) continue;
  // The one approved price range (Shaun, 11/10/2026) is allowed; any other dollar amount still fails.
  const text = (await readFile(file, "utf8"))
    .replaceAll("Lifetime Guarantee", "")
    .replaceAll(APPROVED_RANGE, "")
    .replaceAll(APPROVED_HERO_QUOTE, "")
    .replaceAll(APPROVED_SCHEMA_PRICE_RANGE, "")
    .replaceAll(APPROVED_PRICE_SHORT, "");
  for (const rule of rules) {
    if (rule.name === "dollar amount" && file.endsWith(`${path.sep}lib${path.sep}leads.ts`)) continue;
    // Visitor budget ranges (their answer, not our prices). Shaun asked for them 11/10/2026.
    if (rule.name === "dollar amount" && file.endsWith(`${path.sep}lib${path.sep}budget.ts`)) continue;
    // Window quote planning ranges (Shaun approved building with range guesses, 11/10/2026).
    if (rule.name === "dollar amount" && /windows/.test(path.relative(root, file))) continue;
    if (rule.re.test(text)) {
      failed += 1;
      console.error(`${rule.name}: ${path.relative(root, file)}`);
    }
  }
}

if (failed) {
  console.error(`${failed} copy check(s) failed.`);
  process.exit(1);
}
console.log(`Copy check passed for ${files.length} files.`);
