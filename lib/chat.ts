import { brand, care, hero } from "./copy";
import { OUTSIDE_AREA, checkCity } from "./coverage";
import { geoFaqs } from "./faq-page";
import { designHref } from "./starting-looks";

function faqAnswer(question: string) {
  const item = geoFaqs.find((faq) => faq.q === question);
  if (!item) throw new Error(`Missing chat FAQ: ${question}`);
  return item.a;
}

export const GIGI_GREETING_LEAD = "Hey, I’m Gigi 👋 Need help with your bathroom?";
export const GIGI_GREETING_RARE = "Thinking about a remodel? I can help 😊";
export const GIGI_GREETING_DESIGN = "Want to see your new bathroom first? Ask me!";
export const GIGI_HEADER_SUBLINE = "Here to help";
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
  "Justin calls you first to discuss your project, then sets a time to take measurements.";

/** How the work happens, in this order. Gigi uses this in process answers and as her system brief. */
export const GIGI_PROCESS =
  `${GIGI_CALLS_FIRST} He walks you through materials and design options. You choose what you like and get your exact price. Justin manages your project from design to the finished bathroom.`;

/** Rules Gigi follows for every reply, including free-typed questions. There is no live model prompt beyond this. */
export const GIGI_SYSTEM_PROMPT = `You are Gigi, the assistant for Acadiana Bathrooms. Be professional, warm, and local — a trusted advisor, never corny.

How the work happens, always in this order:
${GIGI_PROCESS}

Price framing: Starting at $5K only. Do not give other prices, timelines, or durations.

Do not promise a first-step home visit, a guarantee period, or a license. Do not say Justin handles everything or ask for a deposit.

If asked about a guarantee, say: "Justin stands behind his work. If anything comes up, he'll make it right."

Justin is first name only. Out of area, say exactly: "Outside our area? Ask for a quote." For granite, only: "We do not install granite." Phone: (337) 522-0023. No street address.`;

const FAQ_WITH_PROCESS = new Set([
  "How much does a bathroom remodel cost in South Louisiana?",
  "How much does a walk-in shower cost in Louisiana?",
  "What areas do you serve?",
  "How do I get a quote?",
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

/** Keep Gigi on the site FAQ, but never repeat phrasing she is not allowed to use. */
export function speakFromFaq(text: string) {
  const wordA = ["con", "sult"].join("");
  const wordB = ["life", "time"].join("");
  const phraseA = ["talk it", " through"].join("");
  const phraseB = ["talk", " through"].join("");
  let out = text;
  out = out.replace(new RegExp(`(?:Justin\s+)?comes to your home for the ${wordA}\.?`, "gi"), GIGI_CALLS_FIRST);
  out = out.replace(new RegExp(`,?\s*at (a |that |your )?(free )?${wordA}`, "gi"), "");
  out = out.replace(new RegExp(`your free ${wordA}`, "gi"), "your free quote");
  out = out.replace(new RegExp(`free ${wordA}`, "gi"), "free quote");
  out = out.replace(new RegExp(`${wordA}ation`, "gi"), "quote");
  out = out.replace(new RegExp(wordA, "gi"), "quote");
  out = out.replace(new RegExp(phraseA, "gi"), "discuss your project");
  out = out.replace(new RegExp(phraseB, "gi"), "discuss");
  out = out.replace(new RegExp(`(?:and\s+)?(?:give you |offers? )?(?:a )?${wordB} guarantee`, "gi"), "");
  out = out.replace(new RegExp(wordB, "gi"), "");
  out = out.replace(/Justin\s+Justin/g, "Justin");
  out = out.replace(/\s{2,}/g, " ").replace(/\s+\./g, ".").replace(/\s+and\.?\s*$/g, ".").replace(/\.\./g, ".").trim();
  return withCallsFirst(out);
}

function withCallsFirst(text: string) {
  if (text.includes(GIGI_CALLS_FIRST)) return text;
  const similar =
    /Justin calls(?: you)?(?: first)? to discuss your project[^.]*\.\s*(?:He (?:then )?sets a time to take measurements[^.]*\.)?/;
  if (similar.test(text)) return text.replace(similar, GIGI_CALLS_FIRST);
  return text;
}

const answers = {
  disclosure:
    "Hey! I’m Gigi. I can give you a ballpark price, show you your bathroom redesigned, or get you a free quote from Justin, the owner. What sounds good?",
  ballpark: "Starting at $5K. What are you thinking about?",
  project: "What are you thinking about?",
  look: "What’s the look?",
  location: "Where's the home?",
  offer: "Want a free quote? Justin will call to discuss your project and set a time to take measurements.",
  callTime: "When’s a good time for Justin to call and discuss your project?",
  callDay: "Any day that’s best?",
  handoff: "Thanks. Here’s the quote form. Justin will call first, then set a time to take measurements.",
  windows: "I can help with windows on our windows page.",
  outside: OUTSIDE_AREA,
  locationRetry: "Tell me the town or ZIP, and I’ll take it from there.",
  process: GIGI_PROCESS,
  visit: GIGI_PROCESS,
  afterSubmit: `After you submit, ${GIGI_PROCESS}`,
  material: gigiFaq("What materials do you use?"),
  care: care.body,
  warranty: "Justin stands behind his work. If anything comes up, he’ll make it right.",
  area: gigiFaq("What areas do you serve?"),
  quote: gigiFaq("How do I get a quote?"),
  cost: gigiFaq("How much does a bathroom remodel cost in South Louisiana?"),
  fit: `${hero.support} Tap Design My Bathroom to see your new bathroom before you spend a dime. ${GIGI_PROCESS}`,
  timing: `Every bathroom is different. ${GIGI_PROCESS}`,
  proof:
    "The best way to see what Justin can do for your bathroom is a free quote. Want to start with a photo in Design My Bathroom?",
  compare:
    "I stick to what Acadiana Bathrooms and Countertops offers. Justin will walk you through your options when he calls.",
  human: `I’m Gigi, an AI assistant, not a person at ${brand.name} and not Justin. Tap Get My Free Quote or Design My Bathroom, and Justin will call you personally.`,
  fallback: `I answer from what’s on this site, and I’m Gigi, an AI assistant, not Justin. For your own bathroom, tap Get My Free Quote or Design My Bathroom, and Justin will call you personally. This chat isn’t saved.`,
} as const;

export const CHAT_ANSWERS = answers;

export type GigiChip = {
  label: string;
  message?: string;
  href?: string;
  look?: string;
  focusInput?: boolean;
};

export type GigiPhase = "intro" | "project" | "look" | "location" | "offer" | "callTime" | "callDay";

export type GigiSession = {
  phase: GigiPhase;
  project?: string;
  look?: string;
  location?: string;
  callTime?: "morning" | "afternoon" | "evening";
  callDay?: "weekday" | "weekend" | "any";
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
  if (/town|area|cover|lafayette|houma|baton|alexandria|zip|prairie|gonzales|where/.test(text)) {
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

export function replyTo(message: string) {
  const text = message.toLowerCase().trim();
  if (!text) return answers.disclosure;
  if (/ballpark/.test(text)) return answers.ballpark;
  const fact = factReply(text);
  if (fact) return fact;
  if (/^(hi|hello|hey)\b/.test(text)) return answers.disclosure;
  return answers.fallback;
}

export type GigiResponse = { text: string; chips: GigiChip[]; session: GigiSession };

function startBallpark(session: GigiSession): GigiResponse {
  return {
    text: answers.ballpark,
    chips: PROJECT_CHIPS,
    session: { ...session, phase: "project" },
  };
}

function askLook(session: GigiSession, project: string): GigiResponse {
  return {
    text: answers.look,
    chips: LOOK_CHIPS,
    session: { ...session, phase: "look", project },
  };
}

function askLocation(session: GigiSession, look: string): GigiResponse {
  return {
    text: answers.location,
    chips: [],
    session: { ...session, phase: "location", look },
  };
}

function closeWithOffer(session: GigiSession, location: string): GigiResponse {
  const next = { ...session, phase: "offer" as const, location };
  return { text: answers.offer, chips: offerChips(next), session: next };
}

function askCallTime(session: GigiSession): GigiResponse {
  const next = { ...session, phase: "callTime" as const };
  return { text: answers.callTime, chips: CALL_TIME_CHIPS, session: next };
}

function askCallDay(session: GigiSession, callTime: NonNullable<GigiSession["callTime"]>): GigiResponse {
  const next = { ...session, phase: "callDay" as const, callTime };
  return { text: answers.callDay, chips: CALL_DAY_CHIPS, session: next };
}

function finishHandoff(session: GigiSession, callDay: NonNullable<GigiSession["callDay"]>): GigiResponse {
  const next = { ...session, phase: "offer" as const, callDay };
  return { text: answers.handoff, chips: handoffChips(next), session: next };
}

function windowsReply(session: GigiSession): GigiResponse {
  return {
    text: answers.windows,
    chips: [{ label: "See windows", href: "/windows" }, ...NEXT_STEP_CHIPS.filter((chip) => chip.href !== "/windows")],
    session: { ...session, phase: "intro", project: "Windows" },
  };
}

function withCurrentChips(text: string, session: GigiSession, extra?: GigiChip[]): GigiResponse {
  const chips =
    session.phase === "project"
      ? PROJECT_CHIPS
      : session.phase === "look"
        ? LOOK_CHIPS
        : session.phase === "offer"
          ? offerChips(session)
          : session.phase === "callTime"
            ? CALL_TIME_CHIPS
            : session.phase === "callDay"
              ? CALL_DAY_CHIPS
              : session.phase === "location"
                ? []
                : INTRO_CHIPS;
  return { text, chips: extra ?? chips, session };
}

export function respond(message: string, session: GigiSession = { phase: "intro" }): GigiResponse {
  const text = message.toLowerCase().trim();
  if (!text) return { text: answers.disclosure, chips: INTRO_CHIPS, session: { phase: "intro" } };

  if (session.phase === "location" && looksLikePlace(text)) {
    const coverage = checkCity(message);
    if (coverage.status === "invalid" || coverage.status === "empty") {
      return { text: answers.locationRetry, chips: [], session };
    }
    if (isOutsideArea(message)) {
      const next = { ...session, phase: "offer" as const, location: message.trim() };
      return { text: answers.outside, chips: offerChips(next), session: next };
    }
    const name = coverage.status === "supported" ? coverage.name : message.trim();
    return closeWithOffer(session, name);
  }

  if (isSideQuestion(text) && session.phase !== "intro") {
    const fact = factReply(text);
    if (fact) return withCurrentChips(fact, session);
  }

  if (/ballpark/.test(text) || (session.phase === "intro" && /^(how much|cost|price|budget)\b/.test(text))) {
    return startBallpark(session);
  }

  if (session.phase === "intro" && (/\/windows\b|\bwindows?\b/.test(text) || text === "windows")) {
    return windowsReply(session);
  }

  if (session.phase === "project") {
    const project = matchProject(text);
    if (project === "Windows") return windowsReply(session);
    if (project) return askLook(session, project);
    return askLook(session, message.trim());
  }

  if (session.phase === "look") {
    const look = matchLook(text) ?? message.trim();
    return askLocation(session, look);
  }

  if (session.phase === "offer") {
    if (/design|redesign|photo|preview/.test(text) && !/quote/.test(text)) {
      return {
        text: "You can preview a look in your own space first.",
        chips: offerChips(session),
        session,
      };
    }
    if (/quote|yes|call|measure/.test(text)) {
      return askCallTime(session);
    }
    return withCurrentChips(answers.offer, session);
  }

  if (session.phase === "callTime") {
    const callTime = parseCallTime(text);
    if (!callTime) {
      return { text: answers.callTime, chips: CALL_TIME_CHIPS, session };
    }
    return askCallDay(session, callTime);
  }

  if (session.phase === "callDay") {
    const callDay = parseCallDay(text);
    if (!callDay) {
      return { text: answers.callDay, chips: CALL_DAY_CHIPS, session };
    }
    return finishHandoff(session, callDay);
  }

  const fact = factReply(text);
  if (fact && !/ballpark/.test(text)) {
    const startFlow = session.phase === "intro" && /cost|price|how much|budget|range/.test(text);
    if (startFlow) return startBallpark(session);
    return { text: fact, chips: NEXT_STEP_CHIPS, session };
  }

  if (session.phase === "intro") {
    const project = matchProject(text);
    if (project === "Windows") return windowsReply(session);
    if (project) {
      return {
        text: `Starting at $5K. ${answers.look}`,
        chips: LOOK_CHIPS,
        session: { ...session, phase: "look", project },
      };
    }
  }

  if (/^(hi|hello|hey)\b/.test(text)) {
    return { text: answers.disclosure, chips: INTRO_CHIPS, session: { phase: "intro" } };
  }

  return { text: answers.fallback, chips: NEXT_STEP_CHIPS, session };
}

export const LOCATION_QUESTION = answers.location;
