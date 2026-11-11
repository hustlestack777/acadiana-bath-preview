import { area, brand, care, faqs, hero, solidPath } from "./copy";

const answers = {
  disclosure: `I’m an AI assistant for ${brand.name}. I am not a person on the crew. I only use the facts published on this site. What you type in this chat stays in this browser and is not submitted or saved.`,
  material: faqs[0].a,
  care: care.body,
  warranty: `${solidPath.warranty} This covers solid surface only, not tile.`,
  area: area.faq,
  quote: faqs[1].a,
  cost: `${faqs[2].a} No dollar amount is published on this site.`,
  fit: `${hero.support} Justin confirms measurements and project scope, then you get a clear proposal.`,
  timing:
    "Installation times are not listed. Justin confirms measurements and project scope, then you get a clear proposal.",
  proof:
    "This site does not publish ratings, job counts, licenses, or testimonials.",
  compare:
    "This site does not compare other companies. I can only repeat the facts published here.",
  human: `I’m an AI assistant, not a person at ${brand.name} and not Justin. For your room, use Request My Project Review.`,
  fallback: `I only answer from the facts on this site. I am an AI assistant, not Justin. For your own room, use Request My Project Review. This chat is not submitted or saved.`,
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
  if (asksAboutPhrase(text) || /natural stone|quarried|natural on[yx]{2}/.test(text)) {
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
  if (/custom|fit|resin|alumina|made of|material|what is on[yx]{2}|composition/.test(text)) {
    return answers.material;
  }
  if (/how long|timeline|schedule|install time/.test(text)) return answers.timing;
  if (/review|rating|license|jobs|testimonial|how many/.test(text)) return answers.proof;
  if (/human|person|real people|are you ai|robot|bot/.test(text)) return answers.human;
  if (/^(hi|hello|hey)\b/.test(text)) return answers.disclosure;
  return answers.fallback;
}
