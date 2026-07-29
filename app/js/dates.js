/* Local-calendar date helpers.

   Everything the tracker stores is keyed by the user's *local* calendar day.
   `new Date().toISOString().slice(0,10)` is wrong for this: at 06:00 in
   Jakarta (UTC+7) it still returns yesterday's date in UTC, so a Subuh logged
   at dawn would land on the wrong day. All keys below are built from the local
   year/month/day fields instead, and all arithmetic goes through the Date
   constructor so month, year and DST boundaries are handled by the platform. */

function two(n) { return n < 10 ? '0' + n : String(n); }

/** 'YYYY-MM-DD' in the device's own timezone. */
export function dateKey(date) {
  const d = date instanceof Date ? date : new Date();
  return d.getFullYear() + '-' + two(d.getMonth() + 1) + '-' + two(d.getDate());
}

export function todayKey() {
  return dateKey(new Date());
}

/** Midnight local time on the day `date` falls in. */
export function startOfDay(date) {
  const d = date instanceof Date ? date : new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * `n` calendar days from `date` (negative goes back). Built by incrementing
 * the day field rather than subtracting 86 400 000 ms, so a DST shift cannot
 * skip or repeat a day.
 */
export function addDays(date, n) {
  const d = startOfDay(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

/** The last `count` calendar days, oldest first, ending with today. */
export function lastNDays(count, from) {
  const end = startOfDay(from || new Date());
  const out = [];
  for (let i = count - 1; i >= 0; i--) out.push(addDays(end, -i));
  return out;
}

export function isValidDateKey(key) {
  return typeof key === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(key);
}

const LOCALE = { en: 'en-GB', id: 'id-ID' };

function localeFor(lang) {
  return LOCALE[lang === 'id' ? 'id' : 'en'];
}

export function formatLongDate(date, lang) {
  try {
    return date.toLocaleDateString(localeFor(lang), {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  } catch (e) {
    return dateKey(date);
  }
}

/** One-letter-ish weekday used by the seven-day strip. */
export function formatWeekdayShort(date, lang) {
  try {
    return date.toLocaleDateString(localeFor(lang), { weekday: 'short' });
  } catch (e) {
    return '';
  }
}

/** 'HH:MM' in the device's own timezone, 24-hour, from a Date. */
export function formatClock(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '--:--';
  return two(date.getHours()) + ':' + two(date.getMinutes());
}

/** Minutes between two Dates, rounded down, never negative. */
export function minutesBetween(from, to) {
  const ms = to.getTime() - from.getTime();
  return ms <= 0 ? 0 : Math.floor(ms / 60000);
}

/** '1h 24m' / '24m' — used for the countdown to the next prayer. */
export function formatDuration(minutes, lang) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) return m + 'm';
  if (lang === 'id') return h + 'j ' + m + 'm';
  return h + 'h ' + m + 'm';
}
