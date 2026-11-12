/* Release dates and times are the label's local time (Birmingham, AL). */
export const LABEL_TIME_ZONE = "America/Chicago";

/** Minutes the zone is ahead of UTC at a given moment (negative in the US). */
function zoneOffsetMinutes(ms: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(ms));
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(n("year"), n("month") - 1, n("day"), n("hour"), n("minute"), n("second"));
  return Math.round((asUtc - ms) / 60000);
}

/**
 * "2026-11-20" (+ optional "18:00") in the label's time zone -> ISO instant.
 * No time means midnight, the start of release day.
 */
export function releaseInstant(date: unknown, time?: unknown): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(typeof date === "string" ? date.trim() : "");
  if (!m) return null;
  const t = /^([01]\d|2[0-3]):([0-5]\d)/.exec(typeof time === "string" ? time.trim() : "");
  const wall = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), t ? Number(t[1]) : 0, t ? Number(t[2]) : 0);
  if (Number.isNaN(wall)) return null;
  // Two passes settle the offset, including on daylight-saving change days.
  let ms = wall - zoneOffsetMinutes(wall, LABEL_TIME_ZONE) * 60000;
  ms = wall - zoneOffsetMinutes(ms, LABEL_TIME_ZONE) * 60000;
  return new Date(ms).toISOString();
}
