/* ============================================================================
   Central application state.
   ----------------------------------------------------------------------------
   One object, one place to change it, one subscription list. Views never write
   to `state` directly — they call the setters below, which persist what should
   be persisted and then notify.

   Persisted (faham.settings.v1)  : language, madhhab, calculation, reciter,
                                    onboarded, rememberLocation, savedLocation
   Persisted (faham.prayers.v1)   : the habit tracker — owned by js/tracker.js
   Runtime only                   : resolved coordinates when the user has not
                                    asked for them to be remembered, the
                                    computed prayer times (written by
                                    js/prayer-times.js#refresh, silently),
                                    audio playback state
   ========================================================================== */

import { readJSON, writeJSON, removeKey, pick } from './storage.js';
import { MADHHAB_KEYS } from '../data/madhhab-data.js';

export const SETTINGS_KEY = 'faham.settings.v1';

export const LANGUAGES = ['en', 'id', 'ko'];
export const THEMES = ['auto', 'light', 'dark'];
export const CALC_METHODS = ['auto', 'kemenag', 'mwl', 'isna', 'egypt', 'karachi', 'makkah'];
export const ASR_METHODS = ['auto', 'standard', 'hanafi'];

const PERSISTED = [
  'language', 'pair', 'madhhab', 'calculationMethod', 'asrMethod',
  'reciter', 'theme', 'onboarded', 'rememberLocation', 'savedLocation'
];

const DEFAULTS = {
  language: 'en',
  pair: false,            // show a second language underneath the first
  madhhab: null,          // null = first run, onboarding not completed
  calculationMethod: 'auto',
  asrMethod: 'auto',      // 'auto' follows the selected madhhab
  reciter: 'husary',
  theme: 'auto',          // 'auto' follows the device; 'light'/'dark' force it
  onboarded: false,
  rememberLocation: false,
  savedLocation: null     // only written when rememberLocation is true
};

export const state = {
  language: DEFAULTS.language,
  pair: DEFAULTS.pair,
  madhhab: DEFAULTS.madhhab,
  calculationMethod: DEFAULTS.calculationMethod,
  asrMethod: DEFAULTS.asrMethod,
  reciter: DEFAULTS.reciter,
  theme: DEFAULTS.theme,
  onboarded: DEFAULTS.onboarded,
  rememberLocation: DEFAULTS.rememberLocation,
  savedLocation: null,

  /* runtime */
  location: null,         // { lat, lng, label, source:'device'|'city'|'saved' }
  prayerTimes: null,      // resolved by js/prayer-times.js
  locationStatus: 'idle', // idle | locating | ready | denied | timeout | unsupported | failed
  audio: { playingId: null, status: 'idle' }
};

const listeners = new Set();

/** Subscribe to any state change. Returns an unsubscribe function. */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** `reason` lets a listener re-render only what actually changed. */
export function notify(reason) {
  listeners.forEach((fn) => {
    try { fn(reason, state); } catch (e) { /* one bad listener must not stop the rest */ }
  });
}

function isNum(n) { return typeof n === 'number' && isFinite(n); }

function sanitiseLocation(loc) {
  if (!loc || typeof loc !== 'object') return null;
  if (!isNum(loc.lat) || !isNum(loc.lng)) return null;
  if (loc.lat < -90 || loc.lat > 90 || loc.lng < -180 || loc.lng > 180) return null;
  return {
    lat: loc.lat,
    lng: loc.lng,
    label: typeof loc.label === 'string' ? loc.label : null,
    /* Kept so a remembered city still resolves in its own zone after a trip. */
    tz: typeof loc.tz === 'string' ? loc.tz : null,
    source: typeof loc.source === 'string' ? loc.source : 'device'
  };
}

/** Coordinates are rounded to ~1 km before they are ever written to disk. */
function coarse(loc) {
  if (!loc) return null;
  return {
    lat: Math.round(loc.lat * 100) / 100,
    lng: Math.round(loc.lng * 100) / 100,
    label: loc.label || null,
    source: 'saved'
  };
}

export function loadSettings() {
  const raw = pick(readJSON(SETTINGS_KEY, {}), PERSISTED);

  /* 'both' was the old name for English-with-Indonesian-underneath; it is now
     a language plus a separate pair flag, so migrate any stored value. */
  if (raw.language === 'both') { state.language = 'en'; state.pair = true; }
  else {
    state.language = LANGUAGES.indexOf(raw.language) > -1 ? raw.language : DEFAULTS.language;
    state.pair = raw.pair === true;
  }
  state.madhhab = MADHHAB_KEYS.indexOf(raw.madhhab) > -1 ? raw.madhhab : DEFAULTS.madhhab;
  state.calculationMethod = CALC_METHODS.indexOf(raw.calculationMethod) > -1
    ? raw.calculationMethod : DEFAULTS.calculationMethod;
  state.asrMethod = ASR_METHODS.indexOf(raw.asrMethod) > -1 ? raw.asrMethod : DEFAULTS.asrMethod;
  state.reciter = typeof raw.reciter === 'string' ? raw.reciter : DEFAULTS.reciter;
  state.theme = THEMES.indexOf(raw.theme) > -1 ? raw.theme : DEFAULTS.theme;
  state.onboarded = raw.onboarded === true && state.madhhab !== null;
  state.rememberLocation = raw.rememberLocation === true;

  const saved = state.rememberLocation ? sanitiseLocation(raw.savedLocation) : null;
  state.savedLocation = saved;
  if (saved) {
    state.location = saved;
    state.locationStatus = 'ready';
  }
  return state;
}

function persist() {
  writeJSON(SETTINGS_KEY, {
    language: state.language,
    pair: state.pair,
    madhhab: state.madhhab,
    calculationMethod: state.calculationMethod,
    asrMethod: state.asrMethod,
    reciter: state.reciter,
    theme: state.theme,
    onboarded: state.onboarded,
    rememberLocation: state.rememberLocation,
    savedLocation: state.rememberLocation ? state.savedLocation : null
  });
}

/* ---- setters ------------------------------------------------------------ */

export function setLanguage(lang) {
  if (LANGUAGES.indexOf(lang) === -1 || lang === state.language) return;
  state.language = lang;
  /* the pair block shows the English underneath a translation; in English
     itself it shows the Indonesian, which is only useful to a bilingual
     reader, so switching back to English drops it. */
  if (lang === 'en') state.pair = false;
  persist();
  notify('language');
}

/** The second-language block under each passage. Independent of `language`. */
export function setPair(on) {
  const next = !!on;
  if (next === state.pair) return;
  state.pair = next;
  persist();
  notify('language');
}

/** Changing the school never touches the language, and vice versa. */
export function setMadhhab(key) {
  if (MADHHAB_KEYS.indexOf(key) === -1 || key === state.madhhab) return;
  state.madhhab = key;
  state.prayerTimes = null;   // the Asr convention may have moved
  persist();
  notify('madhhab');
}

/** Undo a school choice, so onboarding can offer "not sure yet" as a real state. */
export function clearMadhhab() {
  if (state.madhhab === null) return;
  state.madhhab = null;
  state.prayerTimes = null;
  persist();
  notify('madhhab');
}

export function setOnboarded(done) {
  state.onboarded = !!done;
  persist();
  notify('onboarding');
}

export function setCalculation({ method, asr }) {
  let changed = false;
  if (method && CALC_METHODS.indexOf(method) > -1 && method !== state.calculationMethod) {
    state.calculationMethod = method; changed = true;
  }
  if (asr && ASR_METHODS.indexOf(asr) > -1 && asr !== state.asrMethod) {
    state.asrMethod = asr; changed = true;
  }
  if (!changed) return;
  state.prayerTimes = null;
  persist();
  notify('calculation');
}

export function setTheme(theme) {
  if (THEMES.indexOf(theme) === -1 || theme === state.theme) return;
  state.theme = theme;
  persist();
  notify('theme');
}

export function setReciter(key) {
  if (typeof key !== 'string' || key === state.reciter) return;
  state.reciter = key;
  persist();
  notify('reciter');
}

export function setLocation(loc) {
  const clean = sanitiseLocation(loc);
  state.location = clean;
  state.prayerTimes = null;
  if (state.rememberLocation && clean) {
    state.savedLocation = coarse(clean);
    persist();
  }
  notify('location');
}

export function setLocationStatus(status) {
  if (state.locationStatus === status) return;
  state.locationStatus = status;
  notify('location');
}

export function setRememberLocation(on) {
  state.rememberLocation = !!on;
  state.savedLocation = state.rememberLocation ? coarse(state.location) : null;
  persist();
  notify('location');
}

export function setAudio(patch) {
  Object.assign(state.audio, patch);
  notify('audio');
}

/** Settings → "Reset preferences". Habit history is cleared separately. */
export function resetSettings() {
  removeKey(SETTINGS_KEY);
  Object.assign(state, DEFAULTS, {
    savedLocation: null, location: null, prayerTimes: null, locationStatus: 'idle'
  });
  notify('reset');
}

/**
 * Erase everything Faham has put on this device: settings, the prayer log, the
 * remembered location, and the caches — including downloaded Quran audio, where
 * the browser exposes the Cache API. Deliberately one action, because "clear my
 * data" that leaves a remembered location behind is not what anyone means.
 *
 * Resolves once the storage is gone. The caller reloads.
 */
export async function clearAllData() {
  try { window.localStorage.removeItem(SETTINGS_KEY); } catch (e) { /* nothing to do */ }
  try { window.localStorage.removeItem('faham.prayers.v1'); } catch (e) { /* nothing to do */ }
  /* Anything else this app has ever written, so an old key cannot survive. */
  try {
    const doomed = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.indexOf('faham.') === 0) doomed.push(k);
    }
    doomed.forEach((k) => window.localStorage.removeItem(k));
  } catch (e) { /* nothing to do */ }

  if (typeof caches !== 'undefined' && caches.keys) {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.indexOf('faham-') === 0).map((k) => caches.delete(k)));
    } catch (e) { /* the shell will simply be refetched */ }
  }
}
