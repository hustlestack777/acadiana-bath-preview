import { GOOGLE_WRITE_REVIEW_URL } from "./site";

/** Warm one-liner. Share it only after a finished job, a happy customer, or a request to leave a review. */
export const GIGI_REVIEW_LINE = `Thank you. You can leave us a review here: ${GOOGLE_WRITE_REVIEW_URL}`;

/**
 * Rule for the system prompt. The scripted fallback uses gigiReviewLine for the same cases.
 * Do not ask for a review during a sale, and do not invent review text.
 */
export const GIGI_REVIEW_RULE = `Reviews: if a customer says they finished a job, says they were happy, or asks how to leave a review, answer with only this line: "${GIGI_REVIEW_LINE}" Do not mention reviews at any other time, including during a sale. Do not invent review text, reviewer names, or a review count.`;

function asksHowToLeaveReview(text: string) {
  if (/leave (?:us |me |you )?a review|write (?:us |me |you )?a review|post a review/.test(text)) return true;
  if (/google review|review on google/.test(text)) return true;
  if (/how (?:do|can|to) (?:i|we) (?:leave|write|post) (?:us |you |me )?a review/.test(text)) return true;
  if (/where (?:do|can|should) (?:i|we) (?:leave|write|post) (?:us |you )?a review/.test(text)) return true;
  return false;
}

function saysFinishedJob(text: string) {
  const done = /\b(finished|completed|wrapped up|all done|job'?s done|work is done)\b/.test(text);
  const job = /\b(job|project|bathroom|shower|install|installation|remodel|work)\b/.test(text);
  return done && job;
}

function saysHappyWithWork(text: string) {
  if (/\b(?:were|was|we(?:'re| are)|i(?:'m| am)) happy\b(?!\s+to\b)/.test(text)) return true;
  if (/\bhappy with\b/.test(text)) return true;
  if (/\b(?:so|really|very) happy\b/.test(text)) return true;
  if (/\bloved (?:it|the|our|my)\b/.test(text)) return true;
  if (/\bturned out (?:great|beautiful|wonderful|perfect)\b/.test(text)) return true;
  return false;
}

/** The write-review line when the customer earned it, otherwise null so a sale stays a sale. */
export function gigiReviewLine(text: string) {
  const normalized = text.toLowerCase();
  if (!asksHowToLeaveReview(normalized) && !saysFinishedJob(normalized) && !saysHappyWithWork(normalized)) return null;
  return GIGI_REVIEW_LINE;
}
