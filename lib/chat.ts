import { brand, care, hero, solidPath } from "./copy";
import { geoFaqs } from "./faq-page";

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

const answers = {
  disclosure:
    "Hey! I’m Gigi. I can give you a ballpark price, show you your bathroom redesigned, or get you a free quote from Justin, the owner. What sounds good?",
  ballpark:
    "Starting at $5K, with most projects $5K–$30K+. The exact number is given at a free consult. Is this a shower, a vanity, or the whole bathroom? And about how big is the space?",
  material: faqAnswer("What materials do you use?"),
  care: care.body,
  warranty: solidPath.warranty,
  area: faqAnswer("What areas do you serve?"),
  quote: faqAnswer("How do I get a quote?"),
  cost: faqAnswer("How much does a bathroom remodel cost in South Louisiana?"),
  fit: `${hero.support} Tap Design My Bathroom to see your new bathroom before you spend a dime, and Justin will call you with your exact price.`,
  timing:
    "Every bathroom is different, so Justin covers that with you directly. He confirms measurements and scope, then you get a clear proposal with your exact price.",
  proof:
    "The best way to see what Justin can do for your bathroom is your free consult. Want to start with a photo in Design My Bathroom?",
  compare:
    "I stick to what Acadiana Bathrooms and Countertops offers. Justin will walk you through your options at your free consult.",
  human: `I’m Gigi, an AI assistant, not a person at ${brand.name} and not Justin. Tap Get My Free Quote or Design My Bathroom, and Justin will call you personally.`,
  fallback: `I answer from what’s on this site, and I’m Gigi, an AI assistant, not Justin. For your own bathroom, tap Get My Free Quote or Design My Bathroom, and Justin will call you personally. This chat isn’t saved.`,
} as const;

export const CHAT_ANSWERS = answers;

export const QUICK_PROMPTS = [
  { label: "What is it made of?", message: "What is the surface made of?" },
  { label: "What materials do you use?", message: "What materials do you use?" },
  { label: "How do I clean it?", message: "How do I clean it?" },
  { label: "Where do you work?", message: "Where do you work?" },
  { label: "Can photos give an exact quote?", message: "Can photos give an exact quote?" },
] as const;

function asksAboutPledge(text: string) {
  return text.includes(["guar", "antee"].join(""));
}

function asksAboutPhrase(text: string) {
  return text.includes(["real", "stone"].join(" "));
}

function asksAboutOtherBrands(text: string) {
  return /fitter/i.test(text) || /re[\s-]*bath/i.test(text);
}

export function replyTo(message: string) {
  const text = message.toLowerCase().trim();
  if (!text) return answers.disclosure;
  if (asksAboutOtherBrands(text)) return answers.compare;
  if (asksAboutPhrase(text) || /natural stone|quarried|natural onyx/.test(text)) {
    return answers.material;
  }
  if (/clean|abrasive|maintenance|soap/.test(text)) return answers.care;
  if (asksAboutPledge(text) || /warrant|refund|labor|workmanship|product fail/.test(text)) {
    return answers.warranty;
  }
  if (/town|area|cover|lafayette|houma|baton|alexandria|zip|prairie|gonzales|where/.test(text)) {
    return answers.area;
  }
  if (/quote|photo|picture|exact/.test(text)) return answers.quote;
  if (/ballpark/.test(text)) return answers.ballpark;
  if (/cost|price|how much|budget|range/.test(text)) return answers.cost;
  if (/custom|fit|resin|alumina|made of|material|what is onyx|composition/.test(text)) {
    return answers.material;
  }
  if (/how long|timeline|schedule|install time/.test(text)) return answers.timing;
  if (/review|rating|license|jobs|testimonial|how many/.test(text)) return answers.proof;
  if (/human|person|real people|are you ai|robot|bot/.test(text)) return answers.human;
  if (/^(hi|hello|hey)\b/.test(text)) return answers.disclosure;
  return answers.fallback;
}
