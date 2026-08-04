/* Shared render fragments.
   These are the pieces every section repeats — the "Why it is there" note, the
   "Go deeper" disclosure, the Indonesian block in Both mode. Keeping them here
   is what stops the same markup being retyped in nine files and drifting. */

import { P, t, pairBlock, isPair, untranslated } from '../i18n.js';
import { esc } from '../dom.js';

/** Paragraphs from an array of already-trusted content strings. */
export function paragraphs(list) {
  return (list || []).map((p) => '<p>' + p + '</p>').join('');
}

/** The collapsible "Go deeper" block, with the second language in pair mode. */
export function deeper(bodyEn, bodyId, bodyKo) {
  const body = paragraphs(P(bodyEn, bodyId, bodyKo) || bodyEn);
  const second = isPair()
    ? pairBlock(paragraphs(bodyEn), paragraphs(bodyId), true)
    : '';
  if (!body && !second) return '';
  return '<details class="more"><summary>' + esc(t('deeper')) + '</summary>' +
    '<div class="more-body">' + body + second + '</div></details>';
}

/** The bordered note under a card. `label` is a string key from i18n. */
export function whyNote(labelKey, en, id, ko, extra) {
  return '<div class="why"><span class="lbl">' + esc(t(labelKey)) + '</span>' +
    '<p>' + P(en, id, ko) + '</p>' + pairBlock(en, id) + (extra || '') + '</div>';
}

/** A small inline chip marking a school-specific step. */
export function variationChip(text) {
  if (!text) return '';
  return '<span class="flag school">' + esc(text) + '</span>';
}

/** A callout box. `tone` is '', 'blue' or 'green'. */
export function callout(title, body, tone) {
  return '<div class="callout ' + esc(tone || '') + '"><b>' + title + '</b><span>' + body + '</span></div>';
}

export function sectionEmpty(message) {
  return '<p class="hit-none">' + esc(message) + '</p>';
}

/** The banner shown above a section that has no translation in this language. */
export function untranslatedNote() {
  if (!untranslated()) return '';
  return '<div class="callout untr"><b>' + esc(t('untr_t')) + '</b><span>' + esc(t('untr_b')) + '</span></div>';
}

/** The one-off notice about the state of the Korean, shown on Today. */
export function languageNotice() {
  if (!untranslated()) return '';
  return '<div class="callout notice"><b>' + esc(t('ko_notice_t')) + '</b><span>' + t('ko_notice_b') + '</span></div>';
}
