/* ============================================================================
   MadhhabService — the only module that reads data/madhhab-data.js.
   ----------------------------------------------------------------------------
   Views ask this module questions ("what does the selected school say about the
   hands?", "what shape is Witr?") and never branch on `state.madhhab`
   themselves. Adding a fifth school, or a new axis of variation, is a change to
   the data file plus, at most, one resolver here.
   ========================================================================== */

import { state } from './state.js';
import { MADHHAB_KEYS, MADHHAB_META, MADHHAB_RULES, PRACTICE_ROWS } from '../data/madhhab-data.js';
import { pickLang, pickLangId } from './i18n.js';

export { MADHHAB_KEYS, MADHHAB_META, PRACTICE_ROWS };

/** The selected school, falling back to Shafi'i before onboarding completes. */
export function currentKey() {
  return MADHHAB_KEYS.indexOf(state.madhhab) > -1 ? state.madhhab : 'shafii';
}

export function meta(key) {
  return MADHHAB_META[key || currentKey()];
}

export function rules(key) {
  return MADHHAB_RULES[key || currentKey()];
}

export function name(key) {
  const m = meta(key);
  return m ? m.name : '';
}

/** e.g. "Hanafi variation" — used for the small inline badge on a step. */
export function variationLabel(word) {
  return name() + ' ' + word;
}

/* ---- prayer times ------------------------------------------------------- */

/**
 * The Asr convention actually in force. The school proposes it; an explicit
 * choice in Settings overrides it. Selecting a school never changes the Fajr or
 * Isha twilight angles — those follow the calculation method, which is a
 * regional convention rather than a juristic one.
 */
export function asrJuristicMethod() {
  if (state.asrMethod === 'standard' || state.asrMethod === 'hanafi') return state.asrMethod;
  const r = rules();
  return r && r.asrJuristicMethod === 'hanafi' ? 'hanafi' : 'standard';
}

/* ---- practice notes ----------------------------------------------------- */

/** A `{en, id}` pair from rules().practice, e.g. practice('stance'). */
export function practice(rowKey, key) {
  const r = rules(key);
  return (r && r.practice && r.practice[rowKey]) || null;
}

export function practiceText(rowKey, key) {
  return pickLang(practice(rowKey, key));
}

export function practiceTextId(rowKey, key) {
  return pickLangId(practice(rowKey, key));
}

/* ---- content resolution ------------------------------------------------- */

/**
 * Merge a school's override over one entry of data/parts.js.
 * The base entry is never mutated. Only the fields the school actually
 * restates are replaced, so a school that agrees inherits everything.
 */
export function resolvePart(part) {
  const r = rules();
  const override = r && r.parts && r.parts[part.key];
  if (!override) return part;

  const merged = Object.assign({}, part);
  ['t', 'tid', 'ar', 'tl', 'en', 'id', 'times', 'timesid', 'pos', 'posid', 'more', 'moreid'].forEach((f) => {
    if (Object.prototype.hasOwnProperty.call(override, f)) merged[f] = override[f];
  });
  if (override.why) {
    merged.why = pickLang(override.why);
    merged.whyid = pickLangId(override.why) || merged.whyid;
  }
  if (override.omit) {
    merged.omitted = true;
    merged.ar = ''; merged.tl = '';
  }
  merged.schoolNote = override.note || null;
  merged.schoolMore = override.appendMore || null;
  merged.schoolVaries = !!(override.ar || override.omit || override.note || override.times);
  return merged;
}

/** Merge a school's override over one entry of data/wudhu.js. */
export function resolveWudhu(item) {
  const r = rules();
  const override = r && r.wudhu && r.wudhu[item.key];
  if (!override) return item;
  const merged = Object.assign({}, item);
  ['d', 'id', 'ob'].forEach((f) => {
    if (Object.prototype.hasOwnProperty.call(override, f)) merged[f] = override[f];
  });
  merged.schoolVaries = true;
  return merged;
}

/* ---- qunut and Witr ----------------------------------------------------- */

/**
 * How the selected school treats the standing supplication in Subuh.
 * `{ mode: 'always'|'nazilah', position: 'after-ruku'|'before-ruku'|null, ... }`
 */
export function fajrQunut() {
  const r = rules();
  return (r && r.qunut && r.qunut.fajr) || null;
}

/** The school's Witr plan: obligation, one-line summary, and its units. */
export function witr() {
  const r = rules();
  return (r && r.witr) || null;
}

/** True when this school adds anything to Subuh that others do not. */
export function hasFajrQunut() {
  const q = fajrQunut();
  return !!(q && q.mode === 'always' && q.position);
}

/** Every school's answer on one practice row — used by the review table. */
export function comparePractice(rowKey) {
  return MADHHAB_KEYS.map((k) => ({
    key: k,
    name: MADHHAB_META[k].name,
    text: pickLang(practice(rowKey, k))
  }));
}
