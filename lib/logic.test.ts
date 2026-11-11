import assert from "node:assert/strict";
import { test } from "node:test";
import { CHAT_ANSWERS, replyTo } from "./chat";
import { checkCity } from "./coverage";
import { validateDetails, validateExtras, validateStreet, validateZip } from "./estimate";
import { leadNotifyRecipients, validateLead } from "./leads";
import { priceRange, projects } from "./copy";

const pledge = ["guar", "antee"].join("");
const quarriedPhrase = ["real", "stone"].join(" ");

test("lead notification accepts one address or a comma-separated list", () => {
  assert.deepEqual(leadNotifyRecipients(" a@b.com, c@d.com ,"), ["a@b.com", "c@d.com"]);
  assert.deepEqual(leadNotifyRecipients("only@one.com"), ["only@one.com"]);
  assert.deepEqual(leadNotifyRecipients("  ,  "), [
    "acadianabathandcounter@gmail.com",
    "shaun.brasher@gmail.com",
    "shaun@lagniapperealmlabs.com",
  ]);
});

test("any town or ZIP is accepted; there is no allow-list", () => {
  for (const town of ["Lafayette", "lafayette, la", "Houma", "Prairieville", "Gonzales, LA", "West Baton Rouge", "Ville Platte", "70360", "Shreveport"]) {
    assert.equal(checkCity(town).status, "supported", town);
  }
  assert.deepEqual(checkCity("houma, la"), { status: "supported", name: "Houma" });
  assert.equal(checkCity("").status, "empty");
  assert.equal(checkCity("x".repeat(81)).status, "invalid");
});

test("street address requires a house number and stays optional for zip", () => {
  assert.match(validateStreet(""), /street address/);
  assert.match(validateStreet("Main"), /house number/);
  assert.match(validateStreet("Main Street"), /house number/);
  assert.equal(validateStreet("401 Renaud Dr"), "");
  assert.equal(validateStreet("  12 County Road 4  "), "");
});

test("a consult lead is rejected without a street address", () => {
  const base = {
    sourcePage: "/estimate" as const,
    street: "",
    latitude: null,
    longitude: null,
    city: "Lafayette",
    zip: "",
    project: "tub-to-shower",
    notSure: false,
    width: "",
    depth: "",
    height: "",
    measurements: "",
    finish: "unsure",
    features: "",
    name: "Ada",
    phone: "337-555-0100",
    email: "",
    preferred: "phone" as const,
    marketing: false,
    timing: "exploring",
    budget: "",
    homeowner: "own",
    payment: "not-sure",
    consent: true,
    preferredCallTime: "",
    photos: [],
  };
  assert.match(validateLead(base).errors.street ?? "", /street address/);
  assert.equal(validateLead({ ...base, street: "401 Renaud Dr" }).errors.street, undefined);
});

test("zip is optional and is not a coverage decision", () => {
  assert.equal(validateZip(""), "");
  assert.equal(validateZip("70501"), "");
  assert.equal(validateZip("70501-1234"), "");
  assert.match(validateZip("abc"), /5-digit ZIP/);
});

test("tub-to-shower is listed first among projects", () => {
  assert.equal(projects[0]?.id, "tub-to-shower");
});

test("the consult requires project, homeowner, payment, timing, contact, and consent", () => {
  const errors = validateDetails({
    project: "",
    notSure: false,
    width: "",
    depth: "",
    finish: "",
    features: "",
    name: "",
    phone: "",
    email: "",
    preferred: "",
    timing: "",
    homeowner: "",
    payment: "",
    consent: false,
  });
  assert.ok(errors.project);
  assert.ok(errors.homeowner);
  assert.ok(errors.payment);
  assert.ok(errors.timing);
  assert.ok(errors.name);
  assert.ok(errors.preferred);
  assert.ok(errors.consent);
  assert.equal(errors.dimensions, undefined);

  const ok = validateDetails({
    project: "tub-to-shower,showers",
    notSure: true,
    width: "",
    depth: "",
    finish: "unsure",
    features: "",
    name: "Ada",
    phone: "337-555-0100",
    email: "",
    preferred: "phone",
    timing: "exploring",
    homeowner: "own",
    payment: "not-sure",
    consent: true,
  });
  assert.deepEqual(ok, {});

  const sized = validateExtras({
    width: "60",
    depth: "32",
    height: "abc",
    measurements: "Tub to ceiling is about 8 ft",
  });
  assert.ok(sized.dimensions);
  assert.equal(validateExtras({ width: "60", depth: "", height: "72" }).dimensions, undefined);
});

test("assistant answers stay inside the published facts", () => {
  const probes = [
    "What is the surface made of?",
    "Is it natural stone?",
    `is it ${quarriedPhrase}?`,
    "How do I clean it?",
    "What is the product warranty?",
    `what is your ${pledge}?`,
    "Where do you work?",
    "Can photos give an exact quote?",
    "how much does it cost",
    "do you beat bath fitter",
    "are you a person",
    "hello",
    "something unrelated",
  ];
  const outputs = [...probes.map((probe) => replyTo(probe)), ...Object.values(CHAT_ANSWERS)];
  for (const output of outputs) {
    const withoutCardPhrase = output.replaceAll("Lifetime Guarantee", "");
    assert.equal(withoutCardPhrase.toLowerCase().includes(pledge), false, output);
    assert.equal(output.toLowerCase().includes(quarriedPhrase), false, output);
    assert.equal(/bath fitter|re-bath|rebath/i.test(output), false, output);
    // Only the approved range may carry a dollar amount.
    const withoutRange = output.replaceAll(priceRange, "").replaceAll("Starting at $5K, with most projects $5K–$30K+", "").replaceAll("Starting at $5K", "").replaceAll("$5K–$30K+", "");
    assert.equal(/\$\s?\d/.test(withoutRange), false, output);
    assert.equal(withoutRange.includes("5,000") || withoutRange.includes("5000"), false);
  }
  assert.match(replyTo("What is the product warranty?"), /Lifetime Guarantee/);
  assert.match(replyTo(`what is your ${pledge}?`), /Ask Justin for the details at your free consult/);
  assert.match(replyTo("Is it natural stone?"), /solid surface/i);
  assert.match(replyTo("how much"), /Starting at \$5K/);
  assert.match(replyTo("how much"), /\$5K–\$30K\+/);
  assert.match(replyTo("are you a person"), /AI assistant/i);
  assert.match(replyTo("are you a person"), /Gigi/);
  assert.match(CHAT_ANSWERS.disclosure, /Gigi, the AI assistant/);
});
