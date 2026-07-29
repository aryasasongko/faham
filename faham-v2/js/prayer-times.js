/* ============================================================================
   PrayerTimesService — prayer times computed on the device.
   ----------------------------------------------------------------------------
   WHY LOCAL CALCULATION RATHER THAN AN API
   Prayer times are a solar-geometry problem with a closed-form answer, so there
   is no reason to send a user's coordinates to a third party to get one. Doing
   it here means: the coordinates never leave the phone, the feature works with
   no connection, there is no service to be down, and there is no key to leak.
   The whole engine is about 150 lines and has no dependencies.

   THE ALGORITHM
   Standard low-precision solar position (declination and the equation of time),
   then the hour angle at which the sun sits at a given altitude:

       cos(H) = (sin(a) − sin(δ)·sin(φ)) / (cos(δ)·cos(φ))

   Sunrise and sunset use a = −0.833° (refraction plus the solar radius); Fajr
   and Isha use the twilight angles of the selected convention; Asr uses the
   altitude at which an object's shadow reaches the school's multiple of its own
   length. Times come out as hours after local midnight and are then shifted by
   the device's own UTC offset, so no fixed timezone is ever assumed.

   MADHHAB vs METHOD — these are deliberately separate:
     * the calculation METHOD is regional (Kemenag, MWL, ISNA…) and sets the
       Fajr/Isha twilight angles;
     * the MADHHAB sets only the Asr shadow factor.
   Selecting Hanafi therefore moves Asr and nothing else.
   ========================================================================== */

import { state } from './state.js';
import { asrJuristicMethod } from './madhhab.js';
import { startOfDay, addDays, dateKey } from './dates.js';

const DEG = Math.PI / 180;
const sin = (d) => Math.sin(d * DEG);
const cos = (d) => Math.cos(d * DEG);
const tan = (d) => Math.tan(d * DEG);
const asin = (x) => Math.asin(x) / DEG;
const acos = (x) => Math.acos(x) / DEG;
const atan2 = (y, x) => Math.atan2(y, x) / DEG;
const acot = (x) => Math.atan(1 / x) / DEG;

function fixAngle(a) { const r = a - 360 * Math.floor(a / 360); return r < 0 ? r + 360 : r; }
function fixHour(a) { const r = a - 24 * Math.floor(a / 24); return r < 0 ? r + 24 : r; }

/* ---- calculation conventions ------------------------------------------- */

export const METHODS = {
  kemenag: {
    label: { en: 'Indonesia (Kemenag)', id: 'Indonesia (Kemenag)' },
    fajr: 20, isha: 18
  },
  mwl: {
    label: { en: 'Muslim World League', id: 'Liga Muslim Dunia' },
    fajr: 18, isha: 17
  },
  isna: {
    label: { en: 'ISNA (North America)', id: 'ISNA (Amerika Utara)' },
    fajr: 15, isha: 15
  },
  egypt: {
    label: { en: 'Egyptian General Authority', id: 'Otoritas Umum Mesir' },
    fajr: 19.5, isha: 17.5
  },
  karachi: {
    label: { en: 'University of Karachi', id: 'Universitas Karachi' },
    fajr: 18, isha: 18
  },
  makkah: {
    label: { en: 'Umm al-Qura, Makkah', id: 'Umm al-Qura, Makkah' },
    fajr: 18.5, ishaMinutes: 90
  }
};

/** Indonesia gets the national convention; everywhere else gets MWL. */
export function resolveMethodKey(loc) {
  if (state.calculationMethod !== 'auto') return state.calculationMethod;
  if (loc && loc.lat > -11.5 && loc.lat < 7 && loc.lng > 94 && loc.lng < 142) return 'kemenag';
  return 'mwl';
}

/* ---- solar position ----------------------------------------------------- */

function julianDay(year, month, day) {
  let y = year;
  let m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

/** Declination (degrees) and equation of time (hours) for a Julian day. */
function sunPosition(jd) {
  const d = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  const l = fixAngle(q + 1.915 * sin(g) + 0.020 * sin(2 * g));
  const e = 23.439 - 0.00000036 * d;
  const ra = fixHour(atan2(cos(e) * sin(l), cos(l)) / 15);
  return {
    declination: asin(sin(e) * sin(l)),
    equation: q / 15 - ra
  };
}

/* ---- the engine --------------------------------------------------------- */

function makeCalculator(jdate, lat) {
  function decl(t) { return sunPosition(jdate + t).declination; }
  function noon(t) { return fixHour(12 - sunPosition(jdate + t).equation); }

  /**
   * Hours after local midnight at which the sun's altitude is `angle`.
   * Returns null when the sun never reaches that altitude — the caller then
   * applies the high-latitude fallback rather than printing NaN.
   */
  function angleTime(angle, t, before) {
    const d = decl(t);
    const numerator = -sin(angle) - sin(d) * sin(lat);
    const denominator = cos(d) * cos(lat);
    if (denominator === 0) return null;
    const ratio = numerator / denominator;
    if (ratio > 1 || ratio < -1) return null;
    const hours = acos(ratio) / 15;
    return noon(t) + (before ? -hours : hours);
  }

  /** Asr: shadow length equals `factor` × object height plus the noon shadow. */
  function asrTime(factor, t) {
    const d = decl(t);
    const angle = -acot(factor + tan(Math.abs(lat - d)));
    return angleTime(angle, t, false);
  }

  return { angleTime, asrTime, noon };
}

/**
 * Compute one local day's times.
 * `date` is a local Date; the result carries local Date objects plus flags for
 * the states a caller has to render differently.
 */
export function computeForDate(date, loc, options) {
  if (!loc) return null;
  const opts = options || {};
  const day = startOfDay(date);
  const lat = loc.lat;
  const lng = loc.lng;

  const methodKey = opts.methodKey || resolveMethodKey(loc);
  const method = METHODS[methodKey] || METHODS.mwl;
  const asrFactor = (opts.asr || asrJuristicMethod()) === 'hanafi' ? 2 : 1;

  /* The device's own offset for THIS date, so DST is handled by the platform. */
  const timeZone = -day.getTimezoneOffset() / 60;
  const jdate = julianDay(day.getFullYear(), day.getMonth() + 1, day.getDate()) - lng / (15 * 24);
  const calc = makeCalculator(jdate, lat);

  /* Three refinement passes. Each time is evaluated at its own portion of the
     day rather than at noon, which matters at high latitudes and is free here.
     `portions` are fractions of a day; `hours` are hours after local midnight. */
  let portions = { fajr: 5 / 24, sunrise: 6 / 24, dhuhr: 0.5, asr: 13 / 24, maghrib: 18 / 24, isha: 18 / 24 };
  let hours = null;

  for (let pass = 0; pass < 3; pass++) {
    const maghrib = calc.angleTime(0.833, portions.maghrib, false);
    hours = {
      fajr: calc.angleTime(method.fajr, portions.fajr, true),
      sunrise: calc.angleTime(0.833, portions.sunrise, true),
      dhuhr: calc.noon(portions.dhuhr),
      asr: calc.asrTime(asrFactor, portions.asr),
      maghrib,
      isha: method.ishaMinutes != null
        ? (maghrib == null ? null : maghrib + method.ishaMinutes / 60)
        : calc.angleTime(method.isha, portions.isha, false)
    };
    Object.keys(portions).forEach((k) => {
      if (hours[k] != null) portions[k] = hours[k] / 24;
    });
  }

  const times = hours;
  const estimated = times.fajr == null || times.isha == null;

  /* High latitude fallback: split the night into sevenths — Fajr one seventh
     before sunrise, Isha one seventh after sunset. Only used when the sun never
     reaches the twilight angle, and always surfaced to the user as estimated. */
  if (times.sunrise != null && times.maghrib != null) {
    const night = 24 - (times.maghrib - times.sunrise);
    if (times.fajr == null) times.fajr = times.sunrise - night / 7;
    if (times.isha == null) times.isha = times.maghrib + night / 7;
  }
  if (times.dhuhr == null || times.sunrise == null || times.maghrib == null) return null;

  /* Hours → local Date. `timeZone - lng/15` converts from local solar time. */
  const shift = timeZone - lng / 15;
  const toDate = (hours) => {
    if (hours == null) return null;
    const total = hours + shift;
    const ms = day.getTime() + Math.round(total * 3600 * 1000);
    return new Date(ms);
  };

  return {
    dateKey: dateKey(day),
    methodKey,
    asr: asrFactor === 2 ? 'hanafi' : 'standard',
    estimated,
    times: {
      subuh: toDate(times.fajr),
      sunrise: toDate(times.sunrise),
      dzuhur: toDate(times.dhuhr),
      ashar: toDate(times.asr),
      maghrib: toDate(times.maghrib),
      isya: toDate(times.isha)
    }
  };
}

/** The five obligatory prayers, in order. Sunrise is deliberately absent. */
export const OBLIGATORY = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

/**
 * Which prayer comes next, comparing real Date objects against the clock —
 * never sorted strings. After Isha the answer is tomorrow's Subuh, which is
 * computed rather than assumed.
 */
export function nextPrayer(today, loc, now) {
  const at = now || new Date();
  if (!today || !today.times) return null;

  for (let i = 0; i < OBLIGATORY.length; i++) {
    const id = OBLIGATORY[i];
    const when = today.times[id];
    if (when instanceof Date && when.getTime() > at.getTime()) {
      return { id, at: when, tomorrow: false };
    }
  }
  const tomorrow = computeForDate(addDays(at, 1), loc, {
    methodKey: today.methodKey,
    asr: today.asr
  });
  if (!tomorrow) return null;
  return { id: 'subuh', at: tomorrow.times.subuh, tomorrow: true };
}

/**
 * Recompute and store. Cheap enough (sub-millisecond) that it is called on any
 * change to location, madhhab, method or the calendar day instead of caching.
 *
 * Deliberately does NOT notify. renderTimes() calls this lazily whenever its
 * stored result is stale, and a notify from inside a render would re-enter the
 * render — an infinite loop in the one case where the computation legitimately
 * keeps returning null (polar latitudes in mid-winter or mid-summer). Callers
 * that need a repaint render afterwards; every existing call site already does.
 */
export function refresh() {
  const loc = state.location;
  state.prayerTimes = loc ? computeForDate(new Date(), loc, {}) : null;
  return state.prayerTimes;
}

/** True when the stored result is for a day that is no longer today. */
export function isStale() {
  const pt = state.prayerTimes;
  return !pt || pt.dateKey !== dateKey(new Date());
}
