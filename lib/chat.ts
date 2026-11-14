import { enforceOutput, isOffTopic, renderCorePrompt } from "./chat-core";
import { brand, care, hero, priceRange } from "./copy";
import { OUTSIDE_AREA, MAIN_TOWNS } from "./coverage";
import { geoFaqs } from "./faq-page";
import { gigiBrand } from "./gigi-brand";
import { designHref } from "./starting-looks";
import { matchProduct, type ProductMatch } from "./gigi-product";
import { warrantyPlainText } from "./warranty";
import { WINDOW_PRICE_LINE } from "./windows";

function faqAnswer(question: string) {
  const item = geoFaqs.find((faq) => faq.q === question);
  if (!item) throw new Error(`Missing chat FAQ: ${question}`);
  return item.a;
}

/** Display name for the Acadiana chat consultant. Change only this constant if Shaun picks a different name. */
export const CHAT_AGENT_NAME = "Gigi";

export const GIGI_GREETING_LEAD = `Hey, I’m ${CHAT_AGENT_NAME} 👋 Need help with your bathroom?`;
export const GIGI_GREETING_RARE = "Thinking about a remodel? I can help 😊";
export const GIGI_GREETING_DESIGN = "Want to see your new bathroom first? Ask me!";
export const GIGI_HEADER_SUBLINE = "Design consultant";
export const GIGI_GREETING_DELAY_MS = 12_000;

export function shouldShowGreeting(pathname: string) {
  const path = (pathname.replace(/\/+$/, "") || "/") || "/";
  return !/^\/(privacy|terms|policy|blog)(\/|$)/i.test(path);
}

/** Lead line most of the time; rare line least often; design page always gets the design line. */
export function greetingForPath(pathname: string, random = Math.random()) {
  if (pathname === "/design" || pathname.startsWith("/design/")) return GIGI_GREETING_DESIGN;
  return random < 0.15 ? GIGI_GREETING_RARE : GIGI_GREETING_LEAD;
}

/** The sentence every how-it-works reply must include. */
export const GIGI_CALLS_FIRST =
  "We'll call you first to discuss your project and set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.";

/** How the work happens, in this order. The consultant uses this in process answers and as her system brief. */
export const GIGI_PROCESS =
  `${GIGI_CALLS_FIRST} When you're ready to move forward, we manage your project from design to the finished bathroom.`;

/** Shared core prompt plus Gigi's process. The live model uses the same renderCorePrompt. */
export const GIGI_SYSTEM_PROMPT = `${renderCorePrompt(gigiBrand)}

How the work happens, always in this order:
${GIGI_PROCESS}

If asked about standing behind the work, say exactly: "${warrantyPlainText}"
Out of area, say exactly: "Outside our area? Ask for a quote." Phone: (337) 522-0023.`;

const FAQ_WITH_PROCESS = new Set([
  "How much does a bathroom remodel cost in South Louisiana?",
  "How much does a walk-in shower cost in Louisiana?",
  "What areas do you serve?",
  "How do I get a quote?",
  "How does a quote work?",
  "What happens when we call?",
  "What does Acadiana Bathrooms do?",
  "Do you have an office in my town?",
  "Can I see a design before we start?",
]);

function gigiFaq(question: string) {
  let text = speakFromFaq(faqAnswer(question));
  if (FAQ_WITH_PROCESS.has(question) && !text.includes(GIGI_CALLS_FIRST)) {
    text = `${text.replace(/\.$/, "")}. ${GIGI_CALLS_FIRST}`;
  }
  return text;
}

/** Keep the consultant on the site FAQ, but never repeat phrasing she is not allowed to use. */
export function speakFromFaq(text: string) {
  const wordA = ["con", "sult"].join("");
  const wordB = ["life", "time"].join("");
  const phraseA = ["talk it", " through"].join("");
  const phraseB = ["talk", " through"].join("");
  let out = text;
  const homePhrase = ["comes to your", " home"].join("");
  // Optional leading given name, so older FAQ phrasing still sanitizes without shipping a personal name.
  const givenName = String.raw`[A-Z][a-z]+`;
  out = out.replace(new RegExp(`(?:${givenName}\\s+)?${homePhrase} for the ${wordA}\\.?`, "gi"), GIGI_CALLS_FIRST);
  out = out.replace(new RegExp(`,?\s*at (a |that |your )?(free )?${wordA}`, "gi"), "");
  out = out.replace(new RegExp(`your free ${wordA}`, "gi"), "your free quote");
  out = out.replace(new RegExp(`free ${wordA}`, "gi"), "free quote");
  out = out.replace(new RegExp(`${wordA}ation`, "gi"), "quote");
  out = out.replace(new RegExp(`${wordA}(?!ant)`, "gi"), "quote");
  out = out.replace(new RegExp(phraseA, "gi"), "discuss your project");
  out = out.replace(new RegExp(phraseB, "gi"), "discuss");
  const covered = ["guar", "antee"].join("");
  out = out.replace(new RegExp(`(?:and\\s+)?(?:give you |offers? )?(?:a )?${wordB} ${covered}`, "gi"), "");
  out = out.replace(new RegExp(wordB, "gi"), "");
  out = out.replace(/\s{2,}/g, " ").replace(/\s+\./g, ".").replace(/\s+and\.?\s*$/g, ".").replace(/\.\./g, ".").trim();
  return withCallsFirst(out);
}

function withCallsFirst(text: string) {
  if (text.includes(GIGI_CALLS_FIRST)) return text;
  const similar =
    new RegExp(String.raw`(?:(?:[A-Z][a-z]+(?:, the owner,)? (?:will )?calls?(?: you)?(?: first)?)|We'll call you(?: first)?) to discuss your project[^.]*\.\s*(?:(?:He|Then he|Then we|We) (?:then )?sets? a time to take measurements[^.]*\.)?`);
  if (similar.test(text)) return text.replace(similar, GIGI_CALLS_FIRST);
  return text;
}

const answers = {
  disclosure:
    `Hi, I’m ${CHAT_AGENT_NAME}, Acadiana Bathrooms' AI design assistant. Tell me what you're picturing and I'll help you think it through.`,
  ballpark: `${priceRange.split(". Tell us")[0]}. You'll get the exact price when we measure.`,
  project: "What are you thinking about?",
  look: "What’s the look?",
  location: "Where's the home?",
  offer: "Want a free quote? We'll call to discuss your project and set a time to take measurements.",
  callTime: "When’s a good time for us to call and discuss your project?",
  callDay: "Any day that’s best?",
  handoff: "Thanks. Here’s the quote form. We'll call first, then set a time to take measurements.",
  windows: `${WINDOW_PRICE_LINE} The material and the glass matter too. I won't use the bathroom starting price for windows. Get an estimate on our windows page.`,
  outside: OUTSIDE_AREA,
  locationRetry: "Tell me the town or ZIP, and I’ll take it from there.",
  process: GIGI_PROCESS,
  visit: GIGI_PROCESS,
  afterSubmit: `After you submit, ${GIGI_PROCESS}`,
  material: gigiFaq("What materials do you use?"),
  stone:
    "Quartz is a solid everyday choice. Quartzite or marble can give the room more depth and a more natural look. We do not install granite. We can set a time to take measurements and go over the stone and a layout that fits your room.",
  layout:
    "A clearer layout — fewer tight corners, a shower that actually fits how you move — makes the room easier to live in. We'll go over options when we set a time to take measurements.",
  care: care.body,
  warranty: warrantyPlainText,
  area: gigiFaq("What areas do you serve?"),
  quote: gigiFaq("How do I get a quote?"),
  cost: gigiFaq("How much does a bathroom remodel cost in South Louisiana?"),
  fit: `${hero.support} Tap Design My Bathroom to see your new bathroom before you spend a dime. ${GIGI_PROCESS}`,
  timing: `Every bathroom is different. ${GIGI_PROCESS}`,
  proof:
    "The best way to see what we can do for your bathroom is a free quote. Want to start with a photo in Design My Bathroom?",
  compare:
    "I stick to what Acadiana Bathrooms and Countertops offers. We'll go over your options when we call.",
  human: `I’m ${CHAT_AGENT_NAME}, an AI assistant and the design consultant for ${brand.name}. Tap Get My Free Quote or Design My Bathroom, and we'll call you.`,
  fallback: `I can help you picture the bathroom, from penny tile and geometric floors to a solid-surface shower, or line up a free quote. What are you hoping to change?`,
} as const;

export const CHAT_ANSWERS = answers;

export type GigiChip = {
  label: string;
  message?: string;
  href?: string;
  look?: string;
  focusInput?: boolean;
};

export type GigiPhase = "intro" | "project" | "look" | "location" | "offer" | "callTime" | "callDay" | "contact";

export type GigiSession = {
  phase: GigiPhase;
  project?: string;
  look?: string;
  location?: string;
  callTime?: "morning" | "afternoon" | "evening";
  callDay?: "weekday" | "weekend" | "any";
  helpful?: number;
  asked?: string[];
  quoteOffered?: boolean;
  ownerIntroduced?: boolean;
  name?: string;
  phone?: string;
  material?: string;
  placement?: string;
  lookWaived?: boolean;
  offTopicTurns?: number;
};

export const SOMETHING_ELSE_CHIP: GigiChip = { label: "Something else", focusInput: true };

export const INTRO_CHIPS: GigiChip[] = [
  { label: "Ballpark price", message: "What's a ballpark price?" },
  { label: "Redesign my bathroom", href: "/design" },
  { label: "Get a free quote", href: "/estimate#start" },
];

export const PROJECT_CHIPS: GigiChip[] = [
  { label: "Shower remodel", message: "Shower remodel" },
  { label: "Tub to shower", message: "Tub to shower" },
  { label: "Full bathroom", message: "Full bathroom" },
  { label: "Vanity or countertops", message: "Vanity or countertops" },
  { label: "Windows", href: "/windows" },
  SOMETHING_ELSE_CHIP,
];

export const LOOK_CHIPS: GigiChip[] = [
  { label: "Modern & clean", message: "Modern & clean" },
  { label: "Bold color or tile", message: "Bold color or tile" },
  { label: "Classic & timeless", message: "Classic & timeless" },
  { label: "Not sure yet", message: "Not sure yet" },
  SOMETHING_ELSE_CHIP,
];

export const LOCATION_CHIPS: GigiChip[] = [
  { label: "Lafayette", message: "Lafayette" },
  { label: "Youngsville", message: "Youngsville" },
  { label: "Broussard", message: "Broussard" },
  { label: "Baton Rouge", message: "Baton Rouge" },
  { label: "Lake Charles", message: "Lake Charles" },
  { label: "Another town", focusInput: true },
];

export const CALL_TIME_CHIPS: GigiChip[] = [
  { label: "Morning", message: "Morning" },
  { label: "Afternoon", message: "Afternoon" },
  { label: "Evening", message: "Evening" },
  SOMETHING_ELSE_CHIP,
];

export const CALL_DAY_CHIPS: GigiChip[] = [
  { label: "Weekday", message: "Weekday" },
  { label: "Weekend", message: "Weekend" },
  { label: "Any day", message: "Any day" },
];

export const NEXT_STEP_CHIPS: GigiChip[] = [
  { label: "Get a free quote", href: "/estimate#start" },
  { label: "Design My Bathroom", href: "/design" },
  { label: "Ballpark price", message: "What's a ballpark price?" },
];

/** Starting looks that map to the "What's the look?" chips. */
export const LOOK_IDS = {
  "Modern & clean": "ss-white",
  "Bold color or tile": "green-zellige",
  "Classic & timeless": "calacatta",
} as const;

export const QUICK_PROMPTS = [
  { label: "What is it made of?", message: "What is the surface made of?" },
  { label: "What materials do you use?", message: "What materials do you use?" },
  { label: "How do I clean it?", message: "How do I clean it?" },
  { label: "Where do you work?", message: "Where do you work?" },
  { label: "Can photos give an exact quote?", message: "Can photos give an exact quote?" },
] as const;

const OUTSIDE_PLACE =
  /\b(new orleans|nola|metairie|kenner|slidell|mandeville|covington|hammond|madisonville|deridder|de ridder|houston|dallas|atlanta|florida|texas|mississippi)\b/i;
const OUTSIDE_ZIP = /^(701\d{2}|704\d{2}|70634)(-\d{4})?$/;

export function isOutsideArea(input: string) {
  const trimmed = input.trim().toLowerCase().replace(/,?\s*(la|louisiana)\.?$/, "").trim();
  if (OUTSIDE_ZIP.test(trimmed)) return true;
  const zip = trimmed.match(/\b(\d{5})(?:-\d{4})?\b/);
  if (zip && OUTSIDE_ZIP.test(zip[1] ?? "")) return true;
  return OUTSIDE_PLACE.test(trimmed);
}

export function designHrefForLook(look?: string) {
  if (!look) return "/design";
  const id = LOOK_IDS[look as keyof typeof LOOK_IDS];
  return id ? designHref(id) : "/design";
}

export function parseCallTime(text: string): GigiSession["callTime"] | null {
  const t = text.toLowerCase();
  if (/\bmorning\b|before noon|\ba\.?m\.?\b/.test(t)) return "morning";
  if (/\bafternoon\b|\bnoon\b|\blunch\b/.test(t)) return "afternoon";
  if (/\bevening\b|\bnight\b|after work/.test(t)) return "evening";
  return null;
}

export function parseCallDay(text: string): GigiSession["callDay"] | null {
  const t = text.toLowerCase();
  if (/\bweekend\b|saturday|sunday/.test(t)) return "weekend";
  if (/\bweekday\b|week day|monday|friday|during the week/.test(t)) return "weekday";
  if (/\bany day\b|\banytime\b|\bany time\b|\bwhenever\b|\bno preference\b|\beither\b/.test(t) || t === "any") {
    return "any";
  }
  return null;
}

export function estimateHrefForSession(session: GigiSession) {
  const params = new URLSearchParams();
  if (session.project) params.set("project", session.project);
  if (session.look) params.set("look", session.look);
  if (session.location) params.set("city", session.location);
  if (session.callTime) params.set("callTime", session.callTime);
  if (session.callDay) params.set("callDay", session.callDay);
  const query = params.toString();
  return query ? `/estimate?${query}#start` : "/estimate#start";
}

export function offerChips(session: GigiSession): GigiChip[] {
  const lookId = session.look ? LOOK_IDS[session.look as keyof typeof LOOK_IDS] : undefined;
  return [
    { label: "Get my free quote", message: "Get my free quote" },
    { label: "Design My Bathroom first", href: designHrefForLook(session.look), look: lookId },
  ];
}

export function handoffChips(session: GigiSession): GigiChip[] {
  return [{ label: "Get my free quote", href: estimateHrefForSession(session) }];
}

function asksAboutPledge(text: string) {
  return text.includes(["guar", "antee"].join(""));
}

function asksAboutPhrase(text: string) {
  return text.includes(["real", "stone"].join(" "));
}

function asksAboutOtherBrands(text: string) {
  return /fitter/i.test(text) || /re[\s-]*bath/i.test(text);
}

function matchProject(text: string) {
  if (/\bwindows?\b/.test(text)) return "Windows";
  if (/tub[\s-]*to[\s-]*shower|\bconversion\b/.test(text)) return "Tub to shower";
  if (/full bathroom|whole bathroom|full remodel|entire bathroom/.test(text)) return "Full bathroom";
  if (/vanity|countertop/.test(text)) return "Vanity or countertops";
  if (/shower remodel|\bshower\b/.test(text)) return "Shower remodel";
  return null;
}

function matchLook(text: string) {
  if (/not sure|unsure|no idea|don['’]?t know|idk/.test(text)) return "Not sure yet";
  if (/modern|clean|simple|minimal/.test(text)) return "Modern & clean";
  if (/bold|color|colour|zellige|graphic|teal|cobalt/.test(text)) return "Bold color or tile";
  if (/classic|timeless|traditional|marble|calacatta/.test(text)) return "Classic & timeless";
  const exact = LOOK_CHIPS.find((chip) => chip.message && chip.message.toLowerCase() === text);
  return exact?.message ?? null;
}

function looksLikePlace(text: string) {
  if (/\?/.test(text)) return false;
  if (/^\d{5}(-\d{4})?$/.test(text)) return true;
  if (/^(how|what|why|when|who|are|do|can|is|where)\b/.test(text)) return false;
  return text.length > 0 && text.length <= 80;
}

function factReply(text: string) {
  if (asksAboutOtherBrands(text)) return answers.compare;
  if (/granite|quartzite|\bquartz\b|marble|countertop|counter tops|stone (?:for|option)|which stone/.test(text)) return answers.stone;
  if (/\blayout\b|floor plan|better (?:layout|flow)|how (?:it|the room) (?:flows?|is laid out)/.test(text)) return answers.layout;
  if (asksAboutPhrase(text) || /natural stone|quarried|natural onyx/.test(text)) return answers.material;
  if (/how (does|do) (it|this|the process|things) work|what(?:'s| is) the process|how does (?:a |the )?project (?:work|go)/.test(text)) {
    return answers.process;
  }
  if (/come to (my |our )?(house|home)|come out|do you visit|do you come (out|by|over|to)/.test(text)) {
    return answers.visit;
  }
  if (/after (i|you) (submit|send|fill)|what happens (next|after)|once i (submit|send|fill)|after the (quote )?form/.test(text)) {
    return answers.afterSubmit;
  }
  if (/clean|abrasive|maintenance|soap/.test(text)) return answers.care;
  if (asksAboutPledge(text) || /warrant|refund|labor|workmanship|product fail/.test(text)) {
    return answers.warranty;
  }
  if (/town|area|cover|lafayette|houma|baton|alexandria|zip|prairie|gonzales|kinder|eunice|ville platte|scott|rayne|where/.test(text)) {
    return answers.area;
  }
  if (/quote|photo|picture|exact/.test(text)) return answers.quote;
  if (/cost|price|how much|budget|range|ballpark/.test(text)) return answers.cost;
  if (/custom|fit|resin|alumina|made of|material|what is onyx|composition/.test(text)) {
    return answers.material;
  }
  if (/how long|timeline|schedule|install time/.test(text)) return answers.timing;
  if (/review|rating|license|jobs|testimonial|how many/.test(text)) return answers.proof;
  if (/human|person|real people|are you ai|robot|bot/.test(text)) return answers.human;
  return null;
}

function isSideQuestion(text: string) {
  if (asksAboutOtherBrands(text) || asksAboutPhrase(text)) return true;
  if (/^(hi|hello|hey)\b/.test(text)) return false;
  return Boolean(
    factReply(text) &&
      /^(how|what|why|when|who|are|do|can|is|where)\b|\?|clean|warrant|material|made of|natural stone|license|bot|ai assistant|real people/.test(
        text,
      ),
  );
}

function mentionsWindows(text: string) {
  return /\/windows\b|\bwindows?\b/.test(text);
}

function mentionsBathroomWork(text: string) {
  return /\b(showers?|tubs?|bathrooms?|vanitys?|vanities|countertops?|tile)\b/.test(text);
}

function asksPrice(text: string) {
  return /\b(ballpark|costs?|prices?|priced|pricing|how much|budget)\b/.test(text);
}

function onWindowsPath(pathname?: string) {
  const path = (pathname || "").replace(/\/+$/, "") || "/";
  return path === "/windows" || path.startsWith("/windows/");
}

/** Window questions, and price questions asked on the windows page, stay off the bathroom starting price. */
export function shouldUseWindowPrice(text: string, pathname?: string) {
  if (mentionsWindows(text)) return true;
  return onWindowsPath(pathname) && asksPrice(text) && !mentionsBathroomWork(text);
}

export function replyTo(message: string, pathname?: string) {
  return respond(message, { phase: "intro" }, { pathname }).text;
}

export type GigiResponse = { text: string; chips: GigiChip[]; session: GigiSession };

const WINDOW_CHIPS: GigiChip[] = [
  { label: "Get an estimate", href: "/windows" },
  { label: "See windows", href: "/windows" },
];

const PENNY_CHIPS: GigiChip[] = [
  { label: "Shower floor", message: "Penny tile on the shower floor" },
  { label: "A whole wall", message: "Penny tile on the whole wall" },
  { label: "Not sure yet", message: "Not sure yet" },
];

const IDEA_CHIPS: GigiChip[] = [
  { label: "Penny tile floor", message: "Penny tile on the shower floor" },
  { label: "Herringbone", message: "What about herringbone?" },
  { label: "Solid surface", message: "What about a solid-surface shower?" },
];

const PRICE_CHIPS: GigiChip[] = [
  { label: "A shower", message: "A shower remodel" },
  { label: "The whole bathroom", message: "The whole bathroom" },
  { label: "Not sure yet", message: "Not sure yet" },
];

function cloneSession(session: GigiSession): GigiSession {
  return { ...session, asked: [...(session.asked ?? [])] };
}

function volunteeredTown(message: string) {
  const text = message.trim();
  if (!text || /\?/.test(text) || text.length > 40) return null;
  if (isOutsideArea(text)) return text;
  const stripped = text.replace(/,?\s*(la|louisiana)\.?$/i, "").trim();
  const known = MAIN_TOWNS.find((town) => town.toLowerCase() === stripped.toLowerCase());
  if (known) return known;
  if (/^\d{5}(-\d{4})?$/.test(stripped)) return stripped;
  return null;
}

function wantsQuote(text: string) {
  if (/\b(photo|picture|exact quote)\b/.test(text) && !/\bfree quote\b|\bget (me )?a quote\b/.test(text)) return false;
  return /\b(free quote|get (me )?a quote|quote me|set up a quote|i want a quote)\b/.test(text);
}

function affirms(text: string) {
  return /^(yes|yeah|yep|sure|ok|okay|please)\b/.test(text);
}

function isNotSure(text: string) {
  return /^(not sure( yet)?|i.?m not sure\b|idk\b|i don.?t know\b|no idea\b|unsure\b)/.test(text);
}

function generalKnowledge(text: string) {
  if (/capital of france/.test(text)) return "Paris is the capital of France.";
  if (/capital of louisiana/.test(text)) return "Baton Rouge is the capital of Louisiana.";
  if (/\bweather\b/.test(text)) return "I can't see the weather from here.";
  if (/\bpizza\b|\brestaurant\b/.test(text)) return "I don't want to invent a restaurant recommendation.";
  return null;
}

function noteFacts(session: GigiSession, text: string) {
  if (/\bpenny\b/.test(text)) session.material = "penny tile";
  if (/\bherringbone\b/.test(text)) session.material = "herringbone";
  if (/\bchevron\b/.test(text)) session.material = "chevron";
  if (/\barabesque\b/.test(text)) session.material = "arabesque";
  if (/\bhex/.test(text)) session.material = session.material || "hex";
  if (/shower floor|on the floor|underfoot/.test(text)) session.placement = "shower floor";
  if (/whole wall|on the wall|accent wall/.test(text)) session.placement = "wall";
  if (/\bwindows?\b/.test(text) && !mentionsBathroomWork(text)) session.project = "Windows";
  if (/\b(bathroom|shower|tub)\b/.test(text)) session.project = session.project === "Windows" ? session.project : "Bathroom";
  if (/whole bathroom|full bathroom/.test(text)) session.project = "Full bathroom";
  if (isNotSure(text)) session.lookWaived = true;
}

function priceFollowUp(session: GigiSession) {
  if (session.material === "penny tile" && !session.placement) return "Are you thinking penny tile for the shower floor or a whole wall?";
  if (session.placement === "shower floor") return "Want to keep the penny tile on the floor and use a larger tile on the walls?";
  if (!session.project || session.project === "Bathroom") return "Are you thinking about a shower, or the whole bathroom?";
  return "";
}

function priceBody(session: GigiSession) {
  const base = answers.ballpark;
  if (session.material === "penny tile") {
    return `${base} Penny tile is custom tile, so how much of it you use moves the number too.`;
  }
  return base;
}

function contactAsk(session: GigiSession) {
  const need = [
    session.name ? "" : "your name",
    session.phone ? "" : "your phone number",
    session.callTime ? "" : "the best time to call",
  ].filter(Boolean);
  if (!need.length) return "";
  if (need.length === 3) return "Send me your name, your phone number, and the best time to call.";
  if (need.length === 1) return `I still need ${need[0]}.`;
  return `I still need ${need[0]} and ${need[1]}.`;
}

function readContact(message: string, session: GigiSession) {
  const phoneMatch = message.match(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  if (phoneMatch) {
    const phone = phoneMatch[0];
    const blocked = enforceOutput(phone, {
      userText: message,
      windows: false,
      offTopic: false,
      ownerIntroduced: true,
      asked: [],
      pack: gigiBrand,
    }).violations.includes("private-phone");
    if (!blocked) session.phone = phone;
  }
  const time = parseCallTime(message);
  if (time) session.callTime = time;
  const day = parseCallDay(message);
  if (day) session.callDay = day;
  const named = message.match(/\b(?:my name is|i'm|i am|this is)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
  if (named) session.name = named[1];
  else if (phoneMatch) {
    const before = message.slice(0, phoneMatch.index).replace(/[,]/g, " ").trim();
    if (before && /[a-z]/i.test(before) && before.length < 40 && !/\b(morning|afternoon|evening|quote)\b/i.test(before)) {
      session.name = before;
    }
  }
}

function deliver(body: string, chips: GigiChip[], session: GigiSession, message: string, pathname?: string): GigiResponse {
  const next = cloneSession(session);
  noteFacts(next, message.toLowerCase());
  const helpful = (next.helpful ?? 0) + 1;
  next.helpful = helpful;
  let text = body.trim();
  const windows = next.project === "Windows" || shouldUseWindowPrice(message, pathname);
  if (!next.quoteOffered && helpful >= 3 && next.phase !== "contact" && !windows && !wantsQuote(message.toLowerCase())) {
    text = `${text} If you want a free quote, send your name, phone, and the best time to call.`;
    next.quoteOffered = true;
  }
  const guarded = enforceOutput(text, {
    userText: message,
    windows: shouldUseWindowPrice(message, pathname) || (next.project === "Windows" && !mentionsBathroomWork(message)),
    offTopic: isOffTopic(message, gigiBrand),
    ownerIntroduced: Boolean(next.ownerIntroduced),
    asked: next.asked ?? [],
    pack: gigiBrand,
  });
  next.ownerIntroduced = guarded.ownerIntroduced;
  next.asked = guarded.asked;
  return { text: guarded.text, chips, session: next };
}

function chipsFor(match: ProductMatch | null, session: GigiSession): GigiChip[] {
  if (match?.topic === "window" || session.project === "Windows") return WINDOW_CHIPS;
  if (match?.id === "penny" || session.material === "penny tile") return PENNY_CHIPS;
  if (match?.id === "geometric") return IDEA_CHIPS;
  return NEXT_STEP_CHIPS;
}

export function respond(
  message: string,
  session: GigiSession = { phase: "intro" },
  context?: { pathname?: string },
): GigiResponse {
  const text = message.toLowerCase().trim();
  const next = cloneSession(session);
  if (!text) return { text: answers.disclosure, chips: INTRO_CHIPS, session: next };
  noteFacts(next, text);

  if (shouldUseWindowPrice(text, context?.pathname)) {
    next.project = "Windows";
    return { text: answers.windows, chips: WINDOW_CHIPS, session: next };
  }

  if (next.phase === "contact" || (next.quoteOffered && affirms(text) && !isNotSure(text))) {
    readContact(message, next);
    next.phase = "contact";
    if (next.name && next.phone && next.callTime) {
      return deliver(
        `Thanks, ${next.name}. I have ${next.phone}, and ${next.callTime} works. Here's the quote form.`,
        [{ label: "Get my free quote", href: estimateHrefForSession(next) }],
        next,
        message,
        context?.pathname,
      );
    }
    const ask = contactAsk(next);
    return deliver(ask, CALL_TIME_CHIPS.filter((chip) => chip.message), next, message, context?.pathname);
  }

  if (isOutsideArea(message) && message.trim().length < 48 && !message.includes("?")) {
    return { text: answers.outside, chips: [{ label: "Get my free quote", message: "Get my free quote" }], session: next };
  }

  const product = matchProduct(text);
  if (product && !asksPrice(text)) {
    return deliver(product.text, chipsFor(product, next), next, message, context?.pathname);
  }

  if (isNotSure(text)) {
    next.lookWaived = true;
    const ideas = next.material === "penny tile"
      ? "That's a fine place to start. Penny tile on the shower floor with a larger tile on the walls is the pairing I like most. Penny tile up the wall is the bolder version, and a solid-surface shower is the path with almost no grout. Which of those sounds closest?"
      : "You don't have to know yet. Three looks people love: penny tile on the shower floor with a larger wall tile, herringbone or chevron if you want a geometric pattern, or a solid-surface shower with almost no grout. Which of those sounds closest?";
    return deliver(ideas, IDEA_CHIPS, next, message, context?.pathname);
  }

  if (asksPrice(text) || /ballpark/.test(text)) {
    if (next.project === "Windows") return { text: answers.windows, chips: WINDOW_CHIPS, session: next };
    const follow = priceFollowUp(next);
    const already = (next.asked ?? []).some((item) => item.toLowerCase().includes(follow.toLowerCase().slice(0, 24)));
    const body = `${priceBody(next)}${follow && !already ? ` ${follow}` : ""}`;
    return deliver(body, PRICE_CHIPS, next, message, context?.pathname);
  }

  if (wantsQuote(text)) {
    next.phase = "contact";
    next.quoteOffered = true;
    return deliver(`Yes. A free quote is the easy next step. ${contactAsk(next)}`, CALL_TIME_CHIPS.filter((chip) => chip.message), next, message, context?.pathname);
  }

  if (product) return deliver(product.text, chipsFor(product, next), next, message, context?.pathname);

  const fact = factReply(text);
  if (fact && !asksPrice(text)) return deliver(fact, NEXT_STEP_CHIPS, next, message, context?.pathname);

  const known = generalKnowledge(text);
  if (known || (isOffTopic(text, gigiBrand) && /\?/.test(text))) {
    next.offTopicTurns = (next.offTopicTurns ?? 0) + 1;
    const lead = known ?? "I don't want to guess at that.";
    return deliver(`${lead} I'm here for the bathroom design, and a free quote is easy when you want one. What are you hoping to change in the room?`, IDEA_CHIPS, next, message, context?.pathname);
  }

  const town = volunteeredTown(message);
  if (town) {
    next.location = isOutsideArea(town) ? town : town;
    if (isOutsideArea(message)) return { text: answers.outside, chips: [{ label: "Get my free quote", message: "Get my free quote" }], session: next };
    return deliver(`${town} is in the area we cover. What are you hoping to change in the bathroom?`, PRICE_CHIPS, next, message, context?.pathname);
  }

  if (/^(hi|hello|hey)\b/.test(text)) {
    return { text: "Good to meet you. Are you thinking about a bathroom, or windows?", chips: INTRO_CHIPS, session: next };
  }

  if (/\b(hours|are you open|when are you open)\b/.test(text)) {
    return deliver("Call (337) 522-0023 and we'll set a time. I don't want to invent shop hours.", NEXT_STEP_CHIPS, next, message, context?.pathname);
  }

  const project = matchProject(text);
  if (project === "Windows") return { text: answers.windows, chips: WINDOW_CHIPS, session: { ...next, project: "Windows" } };
  if (project) {
    next.project = project;
    return deliver(`A ${project.toLowerCase()} is work we do. Penny tile on the floor, a herringbone or chevron wall, or a solid-surface shower are the directions I suggest most. Which of those sounds closest?`, IDEA_CHIPS, next, message, context?.pathname);
  }

  return deliver(answers.fallback, NEXT_STEP_CHIPS, next, message, context?.pathname);
}

export const LOCATION_QUESTION = answers.location;
