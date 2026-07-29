/* ============================================================================
   TrackerService — the daily prayer log.
   ----------------------------------------------------------------------------
   Stored under `faham.prayers.v1` as { 'YYYY-MM-DD': { fajr: true, … } }, keyed
   by LOCAL calendar day (see js/dates.js for why that matters). Nothing here
   ever leaves the device: there is no network call in this file, and no other
   module is allowed to read the record for the purpose of sending it anywhere.

   The streak is derived from the stored days every time it is asked for rather
   than being kept as an incrementing counter, because a stored counter drifts
   the moment a day is edited, cleared, or logged out of order.
   ========================================================================== */

import { readJSON, writeJSON, removeKey } from './storage.js';
import { dateKey, todayKey, addDays, isValidDateKey, startOfDay } from './dates.js';
import { notify } from './state.js';

export const TRACKER_KEY = 'faham.prayers.v1';

/** Ids match data/prayers.js so one prayer means the same thing everywhere. */
export const TRACKED = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

let record = null;

/** Drop anything that is not a known date holding known boolean prayer flags. */
function sanitise(raw) {
  const clean = {};
  if (!raw || typeof raw !== 'object') return clean;
  Object.keys(raw).forEach((key) => {
    if (!isValidDateKey(key)) return;
    const day = raw[key];
    if (!day || typeof day !== 'object') return;
    const kept = {};
    TRACKED.forEach((p) => { if (day[p] === true) kept[p] = true; });
    if (Object.keys(kept).length) clean[key] = kept;
  });
  return clean;
}

function load() {
  if (record) return record;
  record = sanitise(readJSON(TRACKER_KEY, {}));
  return record;
}

function persist() {
  writeJSON(TRACKER_KEY, record);
}

/** The flags for one day. Never returns null, so callers need no guard. */
export function dayFlags(key) {
  const all = load();
  return all[key || todayKey()] || {};
}

export function isLogged(prayerId, key) {
  return dayFlags(key)[prayerId] === true;
}

export function countFor(key) {
  const day = dayFlags(key);
  return TRACKED.reduce((n, p) => n + (day[p] ? 1 : 0), 0);
}

export function isComplete(key) {
  return countFor(key) === TRACKED.length;
}

/** Mark done / undo. Returns the resulting boolean so the caller can announce it. */
export function toggle(prayerId, key) {
  if (TRACKED.indexOf(prayerId) === -1) return false;
  const all = load();
  const dayKey = key || todayKey();
  const day = Object.assign({}, all[dayKey]);

  const next = !day[prayerId];
  if (next) day[prayerId] = true;
  else delete day[prayerId];

  if (Object.keys(day).length) all[dayKey] = day;
  else delete all[dayKey];

  persist();
  notify('tracker');
  return next;
}

/** The last `count` local days, oldest first, each with its own count. */
export function history(count) {
  const end = startOfDay(new Date());
  const out = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = addDays(end, -i);
    const key = dateKey(d);
    out.push({ date: d, key, count: countFor(key), complete: isComplete(key) });
  }
  return out;
}

/**
 * A streak day is a local calendar day on which all five were logged.
 * Today is only counted once it is complete — an unfinished today does not
 * break a streak that ran up to yesterday, and it does not inflate one either.
 */
export function currentStreak() {
  const today = startOfDay(new Date());
  let cursor = isComplete(dateKey(today)) ? today : addDays(today, -1);
  let streak = 0;
  /* 3660 days is a decade — a hard stop so a corrupted clock cannot loop. */
  for (let guard = 0; guard < 3660; guard++) {
    if (!isComplete(dateKey(cursor))) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Settings → Clear prayer history. Requires explicit confirmation upstream. */
export function clearAll() {
  record = {};
  removeKey(TRACKER_KEY);
  notify('tracker');
}

/** Total days with at least one prayer logged — used for the empty state. */
export function loggedDayCount() {
  return Object.keys(load()).length;
}
