import assert from "node:assert/strict";
import test from "node:test";
import { respond } from "./chat";

const disclaimer = /not a person|isn.t saved|what.s on this site|i only answer from/i;
const robotic = /What are you thinking about\?|What's the look\?|Where's the home\?|Want a free quote\?|When.s a good time to call\?/;
const priceLeak = /\$5\s?k|\$5,?000|five thousand/i;

function questions(text: string) {
  return (text.match(/\?/g) ?? []).length;
}

test("penny tile is answered before any script", () => {
  const reply = respond("penny tile?");
  assert.match(reply.text, /penny/i);
  assert.match(reply.text, /grout/i);
  assert.match(reply.text, /Justin, the owner/);
  assert.match(reply.text, /custom tile/i);
  assert.match(reply.text, /shower floor or a whole wall/i);
  assert.equal(questions(reply.text), 1);
  assert.doesNotMatch(reply.text, disclaimer);
  assert.doesNotMatch(reply.text, robotic);
  assert.ok(reply.chips.some((chip) => /floor/i.test(chip.label)));
  assert.ok(reply.chips.some((chip) => /wall/i.test(chip.label)));

  const unsure = respond("Not sure yet", reply.session);
  assert.match(unsure.text, /larger tile|quieter|solid-surface|floor/i);
  assert.doesNotMatch(unsure.text, /What's the look\?/);
  assert.doesNotMatch(unsure.text, /Where's the home/);
  assert.equal(questions(unsure.text) <= 1, true);
  assert.doesNotMatch(unsure.text, /Justin, the owner/);
});

test("not sure offers ideas instead of asking for a look", () => {
  const reply = respond("I'm not sure what look I want");
  assert.match(reply.text, /penny tile/i);
  assert.match(reply.text, /herringbone|chevron|geometric/i);
  assert.doesNotMatch(reply.text, /What's the look\?/);
  assert.doesNotMatch(reply.text, disclaimer);
  assert.equal(questions(reply.text) <= 1, true);
});

test("a ballpark question states Starting at $5K and why it varies", () => {
  const reply = respond("What's a ballpark price?");
  assert.match(reply.text, /Starting at \$5K/);
  assert.match(reply.text, /size/i);
  assert.match(reply.text, /materials/i);
  assert.match(reply.text, /layout/i);
  assert.doesNotMatch(reply.text, robotic);
  assert.equal(questions(reply.text) <= 1, true);
  assert.doesNotMatch(reply.text, disclaimer);
});

test("a windows price question never says $5K", () => {
  const first = respond("how much are new windows?");
  assert.equal(priceLeak.test(first.text), false);
  assert.match(first.text, /how many windows/i);
  assert.match(first.text, /size/i);
  const second = respond("just a ballpark", first.session);
  assert.equal(priceLeak.test(second.text), false);
  assert.doesNotMatch(second.text, /Starting at/i);
});

test("an off-topic question is answered and steered back", () => {
  const paris = respond("What's the capital of France?");
  assert.match(paris.text, /Paris/);
  assert.match(paris.text, /bathroom/i);
  assert.equal(questions(paris.text) <= 1, true);
  assert.doesNotMatch(paris.text, disclaimer);
  const pizza = respond("What's the best pizza in Paris?");
  assert.match(pizza.text, /don't want to invent/i);
  assert.match(pizza.text, /bathroom|quote/i);
  assert.equal(questions(pizza.text) <= 1, true);
});
