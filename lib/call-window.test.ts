import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildCallInvite,
  callWindowLabel,
  chicagoCivilToDate,
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
  assert.match(invite.content, /SUMMARY:Call TEST Ada Quail/);
  assert.equal(callWindowLabel("weekday", "morning"), "Weekday · Morning (9 AM CT)");
});
