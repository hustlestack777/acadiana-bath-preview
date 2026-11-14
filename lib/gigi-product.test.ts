import assert from "node:assert/strict";
import test from "node:test";
import { replyTo, respond } from "./chat";
import { matchProduct } from "./gigi-product";
import { WINDOW_PRICE_LINE } from "./windows";

const banned = /licensed|insured|lifetime|consultation|dealer|factory-direct|authorized/i;
const otherRoom = new RegExp(["kit", "chen"].join(""), "i");
const starting = /\$5K|\$5,000|Starting at \$5K/i;
const phonePromise = /I(?:'|’)ll call|I will call|call you back|we(?:'|’)ll call/i;
const hiddenPhone = "337-405-9945";

test("a zellige question names the handmade tile and the confirmed suppliers", () => {
  const answer = replyTo("What is zellige tile?");
  assert.match(answer, /handmade/i);
  assert.match(answer, /Riad Tile/);
  assert.match(answer, /Get My Free Quote/);
  assert.equal(starting.test(answer), false);
  assert.equal(otherRoom.test(answer), false);
  assert.equal(banned.test(answer), false);
});

test("argon and Zion gas get the same window answer", () => {
  for (const question of ["What is argon?", "Someone called it Zion gas"]) {
    const answer = replyTo(question);
    assert.match(answer, /argon/i, question);
    assert.match(answer, /inert gas/i, question);
    assert.match(answer, /windows page/i, question);
    assert.equal(starting.test(answer), false, question);
    assert.equal(phonePromise.test(answer), false, question);
    assert.equal(banned.test(answer), false, question);
    assert.equal(answer.includes(hiddenPhone), false, question);
    const chat = respond(question);
    assert.equal(chat.text, answer);
    assert.equal(chat.chips.some((chip) => chip.href === "/windows"), true);
  }
});

test("a window price question depends on count and size", () => {
  for (const question of ["how much are windows?", "How much do windows cost?"]) {
    const answer = replyTo(question);
    assert.match(answer, /how many/i, question);
    assert.match(answer, /size/i, question);
    assert.match(answer, /material/i, question);
    assert.match(answer, /glass/i, question);
    assert.match(answer, /windows page/i, question);
    assert.doesNotMatch(answer, /bathroom starting price/i, question);
    assert.equal(starting.test(answer), false, question);
    assert.equal(otherRoom.test(answer), false, question);
    const chat = respond(question);
    assert.equal(starting.test(chat.text), false);
    assert.equal(chat.chips.some((chip) => chip.href === "/windows"), true);
  }
});

test("Pella is named as a partner, and unconfirmed brands are not claimed", () => {
  const pella = replyTo("Do you work with Pella?");
  assert.match(pella, /We work with Pella/);
  assert.match(pella, /not a factory store/);
  assert.equal(/dealer/i.test(pella), false);
  assert.equal(starting.test(pella), false);

  const fixture = replyTo("Do you use Kohler?");
  assert.match(fixture, /haven't confirmed/);
  assert.equal(/we work with Kohler/i.test(fixture), false);
});

test("product answers stay off banned claims", () => {
  const prompts = [
    "What is zellige?",
    "Do I have to seal zellige?",
    "What grout do you use with zellige?",
    "Can zellige go on a shower floor?",
    "Do you work with Riad Tile?",
    "Do you work with TileBar?",
    "What is a safe shower floor tile?",
    "What grout is best for a shower?",
    "Can Onyx go in a steam shower?",
    "What is Onyx made of?",
    "How do I clean an Onyx shower?",
    "Do you use Onyx?",
    "Is vinyl plank okay in a bathroom?",
    "Can I put wallpaper in a bathroom?",
    "Do you do frameless glass?",
    "What is Low-E glass?",
    "Should I get double-pane or triple-pane?",
    "What do the numbers on the window sticker mean?",
    "Can I get black-frame windows?",
    "Will new windows lower my electric bill?",
    "Do you do windows?",
  ];
  for (const prompt of prompts) {
    const answer = replyTo(prompt);
    assert.equal(banned.test(answer), false, prompt);
    assert.equal(otherRoom.test(answer), false, prompt);
    assert.equal(matchProduct(prompt) !== null || /windows page/i.test(answer), true, prompt);
    if (matchProduct(prompt)?.topic === "window" || /window/i.test(prompt)) {
      assert.equal(starting.test(answer), false, prompt);
      assert.equal(phonePromise.test(answer), false, prompt);
    }
    assert.equal(answer.includes(hiddenPhone), false, prompt);
  }
});
