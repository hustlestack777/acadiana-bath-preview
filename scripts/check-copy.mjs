import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const roots = ["app", "components", "lib", "public", "README.md"];
const skip = new Set(["node_modules", ".next", "uploads"]);
const extensions = new Set([".ts", ".tsx", ".css", ".md", ".svg", ".mjs", ".json"]);

const APPROVED_RANGE =
  "Starting at $5K, with most projects $5K–$30K+, depending on size, materials and layout. Tell us about your project and the best day and time to reach you. We'll call to discuss your project, your style and what you have in mind, then set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then. When you're ready to move forward, we manage your project from design to the finished bathroom.";

const APPROVED_HERO_QUOTE = "Starting at $5K · Free quote.";
const APPROVED_PRICE_FROM = "Bathroom remodels starting at $5K.";
const APPROVED_PRICE_SHORT = "most projects $5K–$30K+";
const APPROVED_PRICE_SHORT_CAP = "Most projects $5K–$30K+";
const APPROVED_SCHEMA_PRICE_RANGE = "$5,000+";
const APPROVED_JOBS_START = "Jobs start at $5K, with most projects $5K–$30K+";
const APPROVED_STARTING_RANGE = "Starting at $5K, with most projects $5K–$30K+";
const APPROVED_STARTING = "Starting at $5K";
const APPROVED_JOBS_START_SHORT = "Jobs start at $5K";

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

// Official Onyx "Yes, Guaranteed Forever" wording approved by Shaun on Nov 11, 2026.
// Any other use of "guarantee" still fails.
const APPROVED_ONYX_GUARANTEE = [
  "The Onyx Collection “Yes, Guaranteed Forever”",
  "We install The Onyx Collection shower panels, bases, and accessories. Those Onyx-manufactured products are covered by The Onyx Collection’s own manufacturer guarantee, officially named “Yes, Guaranteed Forever.”",
  "In The Onyx Collection’s words: “If our product ever fails, we will either provide you with a new item or refund the cost.”",
  "This guarantee applies only to Onyx-manufactured products we install. It does not cover tile, grout, caulk, or our installation work.",
  "We stand behind our work, and we will make issues right.",
  "Questions about an Onyx-manufactured product can also go to The Onyx Collection at 1-800-ONYXTOP (1-800-669-9867), or see their guarantee page at ",
  "onyxcollection.com/guarantee",
  "https://onyxcollection.com/guarantee/",
  "Yes, Guaranteed Forever",
  "manufacturer guarantee",
  "their guarantee page",
];

let failed = 0;
for (const file of files) {
  if (file.endsWith(`${path.sep}scripts${path.sep}check-copy.mjs`)) continue;
  if (file.endsWith(`${path.sep}lib${path.sep}logic.test.ts`)) continue;
  // The one approved price range (Shaun, 11/10/2026) is allowed; any other dollar amount still fails.
  let text = (await readFile(file, "utf8"))
    .replaceAll("Lifetime Guarantee", "")
    .replaceAll(APPROVED_RANGE, "")
    .replaceAll(APPROVED_HERO_QUOTE, "")
    .replaceAll(APPROVED_PRICE_FROM, "")
    .replaceAll(APPROVED_SCHEMA_PRICE_RANGE, "")
    .replaceAll(APPROVED_JOBS_START, "")
    .replaceAll(APPROVED_STARTING_RANGE, "")
    .replaceAll(APPROVED_PRICE_SHORT_CAP, "")
    .replaceAll(APPROVED_PRICE_SHORT, "")
    .replaceAll(APPROVED_JOBS_START_SHORT, "")
    .replaceAll(APPROVED_STARTING, "");
  for (const phrase of APPROVED_ONYX_GUARANTEE) {
    text = text.replaceAll(phrase, "");
  }
  for (const rule of rules) {
    if (rule.name === "dollar amount" && file.endsWith(`${path.sep}lib${path.sep}leads.ts`)) continue;
    if (rule.name === "dollar amount" && file.endsWith(".test.ts")) continue;
    if (rule.name === "dollar amount" && file.endsWith(`${path.sep}route.ts`) && file.includes(`${path.sep}api${path.sep}`)) continue;
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


const BANNED_PHRASES = [
  { name: "lifetime", re: /lifetime/i },
  { name: "financing", re: /financ/i },
  { name: "licensed", re: /licensed/i },
  { name: "insured", re: /insured/i },
  { name: "handles everything", re: /handles everything/i },
  { name: "free consult", re: /free consult/i },
  { name: "in-home consult", re: /in-home consult|in home consult/i },
  { name: "consultation", re: /consultation/i },
  { name: "comes to your home", re: /comes to your home|come out to your home/i },
  { name: "talk it through", re: /talk it through/i },
  { name: "talk through", re: /talk through/i },
  { name: "Charpentier", re: /charpentier/i },
  { name: "after that visit", re: /after that visit/i },
  { name: "after the visit", re: /after the visit/i },
];

function publicCopy(text) {
  // "walk you through" is approved and is not "talk through".
  return text.replaceAll("walk you through", "");
}

const skipBannedName = new Set([
  path.join(root, "scripts", "check-copy.mjs"),
]);

for (const file of files) {
  if (skipBannedName.has(file)) continue;
  const rel = path.relative(root, file);
  // Identifier-only files / tests that assert the ban may mention a phrase; still scan
  // public copy modules, pages, chat, llms, schema, and markdown.
  const scan = /^(app|components|lib|public)\/|README\.md$/.test(rel);
  if (!scan) continue;
  if (rel.endsWith(".test.ts") || rel.endsWith(".test.tsx")) continue;
  const text = publicCopy(await readFile(file, "utf8"));
  for (const rule of BANNED_PHRASES) {
    if (rule.re.test(text)) {
      failed += 1;
      console.error(`${rule.name}: ${rel}`);
    }
  }
}

if (failed) {
  console.error(`${failed} copy check(s) failed.`);
  process.exit(1);
}
console.log(`Copy check passed for ${files.length} files.`);
