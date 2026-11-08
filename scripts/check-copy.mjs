import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const roots = ["app", "components", "lib", "public", "README.md"];
const skip = new Set(["node_modules", ".next", "uploads"]);
const extensions = new Set([".ts", ".tsx", ".css", ".md", ".svg", ".mjs", ".json"]);

const rules = [
  { name: "guarantee", re: /guarantee/i },
  { name: "real stone", re: /real stone/i },
  { name: "bath fitter", re: /bath fitter/i },
  { name: "re-bath", re: /re-bath/i },
  { name: "rebath", re: /rebath/i },
  { name: "dollar amount", re: /\$\s?\d/ },
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
  const text = await readFile(file, "utf8");
  for (const rule of rules) {
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
