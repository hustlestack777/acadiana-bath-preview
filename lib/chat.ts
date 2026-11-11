import { brand, care, hero, solidPath } from "./copy";
import { geoFaqs } from "./faq-page";

function faqAnswer(question: string) {
  const item = geoFaqs.find((faq) => faq.q === question);
  if (!item) throw new Error(`Missing chat FAQ: ${question}`);
  return item.a;
}

const answers = {
  disclosure: `Hey there! I’m Gigi, the AI assistant for ${brand.name}. I’m not a person, and I answer from what’s on this site. What you type here stays in your browser and isn’t saved. For your own bathroom, tap Design My Bathroom or Get My Free Quote.`,
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
