import test from "node:test";
import assert from "node:assert/strict";

import {
  filterEventsByCategory,
  formatEventDate,
  getCategoryOptions,
  getCurrentEventId,
  normalizeTimelineEvents,
  parseEventDate,
  paginateEvents,
} from "../timeline-core.mjs";

test("formatEventDate handles month-year input", () => {
  assert.equal(formatEventDate("Jan 2025", "en-ZA"), "Jan 2025");
});

test("formatEventDate returns fallback for invalid date", () => {
  assert.equal(formatEventDate("not-a-date"), "not-a-date");
  assert.equal(formatEventDate(""), "Date TBD");
});

test("parseEventDate supports quarter format", () => {
  const parsed = parseEventDate("Q3 2026");
  assert.ok(parsed instanceof Date);
  assert.equal(parsed.getUTCMonth(), 6);
});

test("normalizeTimelineEvents sanitizes missing fields", () => {
  const normalized = normalizeTimelineEvents([{ title: "  ", date: "" }]);
  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].title, "Untitled event 1");
  assert.equal(normalized[0].displayDate, "Date TBD");
  assert.equal(normalized[0].category, "General");
});

test("getCategoryOptions returns sorted unique categories including all", () => {
  const events = normalizeTimelineEvents([
    { title: "A", date: "Jan 2025", category: "Release" },
    { title: "B", date: "Feb 2025", category: "Design" },
    { title: "C", date: "Mar 2025", category: "Release" },
  ]);

  assert.deepEqual(getCategoryOptions(events), ["all", "Design", "Release"]);
});

test("filterEventsByCategory supports all and specific category", () => {
  const events = normalizeTimelineEvents([
    { title: "A", date: "Jan 2025", category: "Release" },
    { title: "B", date: "Feb 2025", category: "Design" },
  ]);

  assert.equal(filterEventsByCategory(events, "all").length, 2);
  assert.equal(filterEventsByCategory(events, "Release").length, 1);
  assert.equal(filterEventsByCategory(events, "Unknown").length, 0);
});

test("paginateEvents returns bounded slices", () => {
  const events = normalizeTimelineEvents([
    { title: "A", date: "Jan 2025" },
    { title: "B", date: "Feb 2025" },
    { title: "C", date: "Mar 2025" },
  ]);

  assert.equal(paginateEvents(events, 0, 2).length, 2);
  assert.equal(paginateEvents(events, 2, 2).length, 1);
  assert.equal(paginateEvents(events, 99, 2).length, 0);
});

test("getCurrentEventId prioritizes explicit current event", () => {
  const events = normalizeTimelineEvents([
    { id: "old", title: "Old", date: "Jan 2025" },
    { id: "current", title: "Current", date: "Feb 2025", isCurrent: true },
  ]);

  assert.equal(getCurrentEventId(events), "current");
});

test("getCurrentEventId falls back to closest dated event", () => {
  const events = normalizeTimelineEvents([
    { id: "early", title: "Early", date: "Jan 2020" },
    { id: "near", title: "Near", date: "Jan 2026" },
    { id: "late", title: "Late", date: "Jan 2030" },
  ]);

  const now = new Date("2026-02-01T00:00:00Z").getTime();
  assert.equal(getCurrentEventId(events, now), "near");
});
