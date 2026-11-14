import assert from "node:assert/strict";
import { test } from "node:test";
import { CALL_DAY_CHIPS, CALL_TIME_CHIPS, CHAT_AGENT_NAME, CHAT_ANSWERS, GIGI_CALLS_FIRST, GIGI_GREETING_DESIGN, GIGI_GREETING_LEAD, GIGI_GREETING_RARE, GIGI_PROCESS, GIGI_SYSTEM_PROMPT, INTRO_CHIPS, LOOK_CHIPS, LOOK_IDS, PROJECT_CHIPS, estimateHrefForSession, greetingForPath, replyTo, respond, shouldShowGreeting, speakFromFaq } from "./chat";
import { checkCity } from "./coverage";
import { validateDetails, validateExtras, validateStreet, validateZip } from "./estimate";
import { leadNotifyRecipients, validateLead } from "./leads";
import { priceRange, projects } from "./copy";
import { warrantyPlainText } from "./warranty";
import { WINDOW_PRICE_LINE } from "./windows";

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
    const withoutCardPhrase = output.replaceAll(warrantyPlainText, "").replaceAll("We stand behind our work", "").replaceAll("Lifetime Guarantee", "");
    assert.equal(withoutCardPhrase.toLowerCase().includes(pledge), false, output);
    assert.equal(output.toLowerCase().includes(quarriedPhrase), false, output);
    assert.equal(/bath fitter|re-bath|rebath/i.test(output), false, output);
    // Only the approved range may carry a dollar amount.
    const withoutRange = output.replaceAll(priceRange, "").replaceAll("Starting at $5K, with most projects $5,000 to $30,000+", "").replaceAll("Starting at $5K", "").replaceAll("$5,000 to $30,000+", "");
    assert.equal(/\$\s?\d/.test(withoutRange), false, output);
    assert.equal(withoutRange.includes("5,000") || withoutRange.includes("5000"), false);
  }
  assert.match(replyTo("What is the product warranty?"), /We stand behind our work/);
  assert.match(replyTo(`what is your ${pledge}?`), /We stand behind our work/);
  assert.match(replyTo("Is it natural stone?"), /solid surface/i);
  assert.match(replyTo("how much"), /Starting at \$5K/);
  assert.match(replyTo("how much"), /\$5,000 to \$30,000\+/);
  assert.match(replyTo("are you a person"), /AI assistant/i);
  assert.match(replyTo("are you a person"), new RegExp(CHAT_AGENT_NAME));
  assert.match(CHAT_ANSWERS.disclosure, new RegExp(`${CHAT_AGENT_NAME}, Acadiana Bathrooms' AI design assistant`));
  assert.match(CHAT_ANSWERS.disclosure, /what you're picturing/i);
  assert.doesNotMatch(CHAT_ANSWERS.disclosure, /not a person|isn't saved|what's on this site/i);
  assert.match(CHAT_ANSWERS.disclosure, /AI design assistant/);
  assert.match(replyTo("What's a ballpark price?"), /Starting at \$5K/);
  assert.match(replyTo("What's a ballpark price?"), /materials/i);
  assert.doesNotMatch(replyTo("What's a ballpark price?"), /What are you thinking about/);
  assert.equal(replyTo("how much do windows cost"), CHAT_ANSWERS.windows);
  assert.match(replyTo("how much do windows cost"), new RegExp(WINDOW_PRICE_LINE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(/\$5K|\$5,000/.test(replyTo("how much do windows cost")), false);
  assert.equal(replyTo("how much", "/windows"), CHAT_ANSWERS.windows);
  assert.match(replyTo("how much is a shower"), /Starting at \$5K/);
});

test("Gigi's greeting bubble copy and page rules", () => {
  assert.equal(shouldShowGreeting("/"), true);
  assert.equal(shouldShowGreeting("/design"), true);
  assert.equal(shouldShowGreeting("/privacy"), false);
  assert.equal(shouldShowGreeting("/privacy/"), false);
  assert.equal(shouldShowGreeting("/terms"), false);
  assert.equal(shouldShowGreeting("/policy"), false);
  assert.equal(shouldShowGreeting("/blog"), false);
  assert.equal(shouldShowGreeting("/blog/some-post"), false);
  assert.equal(greetingForPath("/design", 0), GIGI_GREETING_DESIGN);
  assert.equal(greetingForPath("/design", 0.99), GIGI_GREETING_DESIGN);
  assert.equal(greetingForPath("/", 0.14), GIGI_GREETING_RARE);
  assert.equal(greetingForPath("/", 0.15), GIGI_GREETING_LEAD);
  assert.equal(greetingForPath("/estimate", 0.9), GIGI_GREETING_LEAD);
});

test("Gigi walks through the quote flow with matching chips", () => {
  const intro = respond("hello");
  assert.match(intro.text, /bathroom, or windows/i);
  assert.doesNotMatch(intro.text, /not a person|isn't saved|what's on this site/i);
  assert.deepEqual(intro.chips.map((chip) => chip.label), INTRO_CHIPS.map((chip) => chip.label));

  const start = respond("What's a ballpark price?", intro.session);
  assert.match(start.text, /Starting at \$5K/);
  assert.match(start.text, /materials/i);
  assert.doesNotMatch(start.text, /What are you thinking about/);
  assert.equal(PROJECT_CHIPS.length, 6);

  const windows = respond("Windows", start.session);
  assert.match(windows.text, /windows page/i);
  assert.match(windows.text, new RegExp(WINDOW_PRICE_LINE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(/\$5K|\$5,000/.test(windows.text), false);
  assert.equal(windows.chips.some((chip) => chip.href === "/windows"), true);

  const windowPrice = respond("how much do windows cost");
  assert.equal(windowPrice.text, CHAT_ANSWERS.windows);
  assert.equal(/\$5K|\$5,000/.test(windowPrice.text), false);

  const onWindows = respond("how much", { phase: "intro" }, { pathname: "/windows" });
  assert.equal(onWindows.text, CHAT_ANSWERS.windows);
  const showerOnWindows = respond("how much is a shower remodel", { phase: "intro" }, { pathname: "/windows" });
  assert.match(showerOnWindows.text, /Starting at \$5K/);

  const project = respond("Tub to shower", start.session);
  assert.match(project.text, /tub to shower/i);
  assert.doesNotMatch(project.text, /What's the look\?/);
  assert.equal(LOOK_CHIPS.at(-1)?.focusInput, true);

  const outside = respond("New Orleans");
  assert.equal(outside.text, "Outside our area? Ask for a quote.");
  assert.equal(outside.chips[0]?.label, "Get my free quote");

  const href = estimateHrefForSession({
    phase: "contact",
    project: "Tub to shower",
    look: "Bold color or tile",
    location: "Lafayette",
    callTime: "morning",
    callDay: "weekday",
  });
  assert.match(href, /\/estimate\?/);
  assert.match(href, /callTime=morning/);
  assert.match(href, /callDay=weekday/);
  assert.match(href, /city=Lafayette/);
  assert.match(href, /project=Tub\+to\+shower/);
  assert.match(href, /look=Bold\+color\+or\+tile/);
  assert.match(href, /#start$/);
  assert.equal(CALL_TIME_CHIPS.length, 4);
  assert.equal(CALL_DAY_CHIPS.length, 3);
});

test("Gigi answers do not promise an in-home consult", () => {
  const samples = [
    ...Object.values(CHAT_ANSWERS),
    respond("Where do you work?").text,
    respond("How do I get a quote?").text,
    respond("how much").text,
    respond("are you a person").text,
  ];
  for (const text of samples) {
    assert.equal(/comes to your home|in-home consult|in home consult/i.test(text), false, text);
  }
});

test("Gigi explains the process the same way for free-typed questions", () => {
  const how = replyTo("how does it work?");
  const house = replyTo("do you come to my house?");
  const after = replyTo("what happens after I submit?");
  assert.equal(how, GIGI_PROCESS);
  assert.match(how, new RegExp(GIGI_CALLS_FIRST.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(how, /you'll get your exact price right then/);
  assert.match(how, /we manage your project from design to the finished bathroom/);
  assert.match(house, new RegExp(GIGI_CALLS_FIRST.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(/comes to your home for|in-home consult|free consult/i.test(house), false);
  assert.match(after, /After you submit/);
  assert.match(after, new RegExp(GIGI_CALLS_FIRST.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(after, /we manage your project from design to the finished bathroom/);
  assert.match(GIGI_SYSTEM_PROMPT, new RegExp(GIGI_CALLS_FIRST.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(GIGI_SYSTEM_PROMPT, /trusted advisor/);
  assert.match(GIGI_SYSTEM_PROMPT, /Take this one beat at a time/);
  assert.match(GIGI_SYSTEM_PROMPT, /never a list of questions/);
  assert.match(GIGI_SYSTEM_PROMPT, /bathroom remodels only/);
  assert.match(GIGI_SYSTEM_PROMPT, new RegExp(WINDOW_PRICE_LINE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("Gigi's spoken answers avoid banned consult and claim wording", () => {
  const banned = /free consult|in-home consult|consultation|comes to your home for|talk it through|talk through|handles everything|lifetime guarantee|licensed|insured|\bdeposits?\b/i;
  const spoken = [...Object.values(CHAT_ANSWERS), ...["how does it work?", "do you come to my house?", "what happens after I submit?", "How do I get a quote?", "Where do you work?", "how much", "what is your guarantee"].map((q) => replyTo(q))];
  for (const text of spoken) {
    assert.equal(banned.test(text), false, text);
  }
  assert.equal(replyTo("What is the product warranty?"), CHAT_ANSWERS.warranty);
  assert.match(CHAT_ANSWERS.warranty, /We stand behind our work/);
});

test("Gigi reads FAQ answers and cleans phrasing she should not use", () => {
  const word = ["con", "sult"].join("");
  const dirty = `Starting at $5K. Justin comes to your home for the ${word}. He will talk it through and give you a lifetime guarantee.`;
  const clean = speakFromFaq(dirty);
  assert.match(clean, /Starting at \$5K/);
  assert.match(clean, new RegExp(GIGI_CALLS_FIRST.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(new RegExp(`${word}(?!ant)`, "i").test(clean), false, clean);
  assert.equal(/talk through|lifetime/i.test(clean), false, clean);
  assert.match(CHAT_ANSWERS.cost, /Starting at \$5K/);
  assert.match(CHAT_ANSWERS.quote, /\(337\) 522-0023|Design My Bathroom/);
  assert.match(CHAT_ANSWERS.area, /Acadiana|South Louisiana|Outside our area/);
  assert.equal(/talk through|lifetime/i.test(CHAT_ANSWERS.cost + CHAT_ANSWERS.quote + CHAT_ANSWERS.area), false);
});

test("the consultant upsells upgraded stone honestly and never offers granite", () => {
  const stone = replyTo("do you do granite countertops?");
  assert.match(stone, /do not install granite/i);
  assert.match(stone, /quartzite or marble/i);
  assert.match(stone, /set a time to take measurements/i);
  assert.equal(/licensed|insured|lifetime|hurry|limited time|text me|sms/i.test(stone), false, stone);
});
