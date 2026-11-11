import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildCallInvite,
  callbackThanksPlain,
  callbackWindow,
  callWindowLabel,
  chicagoCivilToDate,
  customerCallbackSubject,
  nextCallSlot,
} from "./call-window";

test("Weekday uses today when the slot is still ahead, otherwise the next weekday", () => {
  const wednesdayMorning = chicagoCivilToDate(2026, 11, 11, 7, 0); // Wed
  const morning = nextCallSlot("weekday", "morning", wednesdayMorning);
  assert.equal(morning.toISOString(), chicagoCivilToDate(2026, 11, 11, 9, 0).toISOString());

  const wednesdayNoon = chicagoCivilToDate(2026, 11, 11, 12, 0);
  const afternoon = nextCallSlot("weekday", "morning", wednesdayNoon);
  assert.equal(afternoon.toISOString(), chicagoCivilToDate(2026, 11, 12, 9, 0).toISOString());

  const fridayEvening = chicagoCivilToDate(2026, 11, 13, 19, 0); // Fri after 6 PM
  const nextWeek = nextCallSlot("weekday", "morning", fridayEvening);
  assert.equal(nextWeek.toISOString(), chicagoCivilToDate(2026, 11, 16, 9, 0).toISOString());
});

test("Weekend is the next Saturday at the chosen time", () => {
  const thursday = chicagoCivilToDate(2026, 11, 12, 8, 0);
  const saturday = nextCallSlot("weekend", "afternoon", thursday);
  assert.equal(saturday.toISOString(), chicagoCivilToDate(2026, 11, 14, 14, 0).toISOString());

  const saturdayMorning = chicagoCivilToDate(2026, 11, 14, 8, 0);
  const sameDay = nextCallSlot("weekend", "morning", saturdayMorning);
  assert.equal(sameDay.toISOString(), chicagoCivilToDate(2026, 11, 14, 9, 0).toISOString());

  const saturdayNight = chicagoCivilToDate(2026, 11, 14, 19, 0);
  const nextSat = nextCallSlot("weekend", "evening", saturdayNight);
  assert.equal(nextSat.toISOString(), chicagoCivilToDate(2026, 11, 21, 18, 0).toISOString());
});

test("Any day is tomorrow at the chosen slot", () => {
  const friday = chicagoCivilToDate(2026, 11, 13, 7, 0);
  const tomorrow = nextCallSlot("any", "evening", friday);
  assert.equal(tomorrow.toISOString(), chicagoCivilToDate(2026, 11, 14, 18, 0).toISOString());
});

test("the invite is a Chicago-timed .ics for the computed slot", () => {
  const now = chicagoCivilToDate(2026, 11, 11, 7, 0);
  const invite = buildCallInvite({
    name: "TEST Ada Quail",
    phone: "337-555-0101",
    day: "weekday",
    time: "morning",
    now,
  });
  assert.ok(invite);
  assert.equal(invite.filename, "justin-callback.ics");
  assert.equal(invite.contentType, "text/calendar");
  assert.match(invite.content, /BEGIN:VCALENDAR/);
  assert.match(invite.content, /DTSTART:20261111T150000Z/); // 9 AM CST
  assert.match(invite.content, /DTEND:20261111T160000Z/); // 10 AM CST
  assert.match(invite.content, /SUMMARY:Call TEST Ada Quail/);
  assert.equal(callWindowLabel("weekday", "morning"), "Weekday · Morning (9 AM CT)");
});

test("the one-hour callback window is formatted for the thank-you and emails", () => {
  const wednesdayMorning = chicagoCivilToDate(2026, 11, 11, 7, 0);
  const morning = callbackWindow("weekday", "morning", wednesdayMorning);
  assert.ok(morning);
  assert.equal(morning.dayLabel, "Wednesday, Nov 11");
  assert.equal(morning.startLabel, "9 AM");
  assert.equal(morning.endLabel, "10 AM");
  assert.equal(morning.compact, "Wednesday, Nov 11, 9–10 AM CT");
  assert.equal(morning.phrase, "Wednesday, Nov 11 between 9 AM and 10 AM CT");
  assert.equal(
    customerCallbackSubject("weekday", "morning", wednesdayMorning),
    "Justin will call you Wednesday, Nov 11 between 9 AM and 10 AM CT",
  );
  assert.match(
    callbackThanksPlain("Adam Bomb", "weekday", "morning", wednesdayMorning),
    /You're all set, Adam\. Justin, the owner, will call you Wednesday, Nov 11 between 9 AM and 10 AM CT to discuss your project\. Save his number so you know it's him calling: \(337\) 522-0023\. Need to change the time\? Call or text Justin at that number\./,
  );

  const afterTwo = chicagoCivilToDate(2026, 11, 11, 15, 0);
  const afternoon = callbackWindow("weekday", "afternoon", afterTwo);
  assert.ok(afternoon);
  assert.equal(afternoon.dayLabel, "Thursday, Nov 12");
  assert.equal(afternoon.compactRange, "2–3 PM CT");

  const friday = chicagoCivilToDate(2026, 11, 13, 7, 0);
  const evening = callbackWindow("any", "evening", friday);
  assert.ok(evening);
  assert.equal(evening.dayLabel, "Saturday, Nov 14");
  assert.equal(evening.startLabel, "6 PM");
  assert.equal(evening.endLabel, "7 PM");
});
