import assert from "node:assert/strict";
import test from "node:test";
import { CHAT_ANSWERS, GIGI_SYSTEM_PROMPT, replyTo, respond, type GigiSession } from "./chat";
import { GIGI_REVIEW_LINE, gigiReviewLine } from "./gigi-review";
import { GOOGLE_WRITE_REVIEW_URL } from "./site";

const BANNED_PLACE_ID = "ChIJE5QseWJ1V6oR60AQJjTIOEI";

test("Gigi shares the write-review link only when asked or after a happy finished job", () => {
  assert.equal(GOOGLE_WRITE_REVIEW_URL, "https://search.google.com/local/writereview?placeid=ChIJy8M1qHT6IA4RDVwX3-vb_p0");
  assert.match(GIGI_REVIEW_LINE, new RegExp(GOOGLE_WRITE_REVIEW_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(/licensed|kitchen|\$5K|ChIJE5QseWJ1V6oR60AQJjTIOEI/i.test(GIGI_REVIEW_LINE), false);
  assert.equal(GIGI_REVIEW_LINE.includes(BANNED_PLACE_ID), false);

  for (const message of [
    "How do I leave a review?",
    "Where can I write a review?",
    "The job is finished and we're happy",
    "We were happy with the bathroom",
    "You finished the shower and we loved it",
  ]) {
    assert.equal(replyTo(message), GIGI_REVIEW_LINE, message);
    assert.equal(respond(message).text, GIGI_REVIEW_LINE, message);
  }

  assert.match(GIGI_SYSTEM_PROMPT, /Do not mention reviews at any other time, including during a sale/);
  assert.match(GIGI_SYSTEM_PROMPT, new RegExp(GOOGLE_WRITE_REVIEW_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(GIGI_SYSTEM_PROMPT.includes(BANNED_PLACE_ID), false);
});

test("Gigi does not push a review during a sale or invent review text", () => {
  assert.equal(gigiReviewLine("I'm happy to get a quote"), null);
  assert.equal(gigiReviewLine("how many reviews do you have"), null);
  assert.equal(replyTo("how many reviews do you have"), CHAT_ANSWERS.proof);
  assert.equal(replyTo("how many reviews do you have").includes(GOOGLE_WRITE_REVIEW_URL), false);
  assert.equal(replyTo("what's your rating").includes(GOOGLE_WRITE_REVIEW_URL), false);

  let session: GigiSession = { phase: "intro" };
  for (const message of ["What's a ballpark price?", "Shower remodel", "Modern & clean", "Lafayette", "yes"]) {
    const next = respond(message, session);
    assert.equal(next.text.includes(GOOGLE_WRITE_REVIEW_URL), false, message);
    assert.equal(/5-star|2 reviews/i.test(next.text), false, message);
    session = next.session;
  }

  const midSale = respond("The bathroom is finished and we are happy", { phase: "look", look: "Modern & clean" });
  assert.equal(midSale.text, GIGI_REVIEW_LINE);
  assert.equal(midSale.session.phase, "look");
});
