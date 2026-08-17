const DEFAULT_CATEGORY = "General";

export function sanitizeText(value, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed || fallback;
}

export function slugify(value) {
  const normalized = sanitizeText(value, "item").toLowerCase();
  return (
    normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item"
  );
}

export function parseEventDate(rawDate) {
  const input = sanitizeText(rawDate);
  if (!input) {
    return null;
  }

  const direct = Date.parse(input);
  if (!Number.isNaN(direct)) {
    return new Date(direct);
  }

  const monthYearMatch = input.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
  if (monthYearMatch) {
    const safeDate = Date.parse(`${monthYearMatch[1]} 1, ${monthYearMatch[2]}`);
    if (!Number.isNaN(safeDate)) {
      return new Date(safeDate);
    }
  }

  const quarterMatch = input.match(/^Q([1-4])\s+(\d{4})$/i);
  if (quarterMatch) {
    const quarter = Number(quarterMatch[1]);
    const year = Number(quarterMatch[2]);
    return new Date(Date.UTC(year, (quarter - 1) * 3, 1));
  }

  return null;
}

export function formatEventDate(rawDate, locale = "en-ZA") {
  const parsed = parseEventDate(rawDate);
  if (!parsed) {
    return sanitizeText(rawDate, "Date TBD");
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function normalizeTimelineEvent(rawEvent, index) {
  const title = sanitizeText(rawEvent?.title, `Untitled event ${index + 1}`);
  const summary = sanitizeText(rawEvent?.summary, "No summary provided.");
  const details = sanitizeText(rawEvent?.details, "No additional details.");
  const category = sanitizeText(rawEvent?.category, DEFAULT_CATEGORY);
  const image = sanitizeText(rawEvent?.image);
  const imageAlt = sanitizeText(rawEvent?.imageAlt, title);
  const rawDate = sanitizeText(rawEvent?.date, "Date TBD");

  const parsedDate = parseEventDate(rawDate);
  const timestamp = parsedDate
    ? parsedDate.getTime()
    : Number.POSITIVE_INFINITY;

  return {
    id: rawEvent?.id
      ? sanitizeText(String(rawEvent.id))
      : `event-${index + 1}-${slugify(title)}`,
    title,
    summary,
    details,
    category,
    image,
    imageAlt,
    rawDate,
    displayDate: formatEventDate(rawDate),
    timestamp,
    isCurrent: Boolean(rawEvent?.isCurrent),
  };
}

export function normalizeTimelineEvents(rawEvents) {
  if (!Array.isArray(rawEvents)) {
    return [];
  }

  return rawEvents.map(normalizeTimelineEvent);
}

export function getCategoryOptions(events) {
  const categories = Array.from(
    new Set(events.map((event) => event.category)),
  ).sort((a, b) => a.localeCompare(b));
  return ["all", ...categories];
}

export function filterEventsByCategory(events, selectedCategory) {
  if (!selectedCategory || selectedCategory === "all") {
    return [...events];
  }

  return events.filter((event) => event.category === selectedCategory);
}

export function paginateEvents(events, startIndex, size) {
  return events.slice(startIndex, startIndex + size);
}

export function getCurrentEventId(events, now = Date.now()) {
  if (!events.length) {
    return null;
  }

  const explicitCurrent = events.find((event) => event.isCurrent);
  if (explicitCurrent) {
    return explicitCurrent.id;
  }

  const datedEvents = events.filter((event) =>
    Number.isFinite(event.timestamp),
  );
  if (!datedEvents.length) {
    return events[0].id;
  }

  let closest = datedEvents[0];
  let closestDistance = Math.abs(closest.timestamp - now);

  for (const event of datedEvents.slice(1)) {
    const distance = Math.abs(event.timestamp - now);
    if (distance < closestDistance) {
      closest = event;
      closestDistance = distance;
    }
  }

  return closest.id;
}
