/* Shared render fragments.
   These are the pieces every section repeats — the "Why it is there" note, the
   "Go deeper" disclosure, the Indonesian block in Both mode. Keeping them here
   is what stops the same markup being retyped in nine files and drifting. */

import { P, t, idBlock, isBoth } from '../i18n.js';
import { esc } from '../dom.js';

/** Paragraphs from an array of already-trusted content strings. */
export function paragraphs(list) {
  return (list || []).map((p) => '<p>' + p + '</p>').join('');
}

/** The collapsible "Go deeper" block, with the Indonesian half in Both mode. */
export function deeper(bodyEn, bodyId) {
  const body = paragraphs(isBoth() ? bodyEn : (P(bodyEn, bodyId) || bodyEn));
  const second = isBoth()
    ? '<div class="id-txt show"><span class="lbl">Bahasa Indonesia</span>' + paragraphs(bodyId) + '</div>'
    : '';
  if (!body && !second) return '';
  return '<details class="more"><summary>' + esc(t('deeper')) + '</summary>' +
    '<div class="more-body">' + body + second + '</div></details>';
}

/** The bordered note under a card. `label` is a string key from i18n. */
export function whyNote(labelKey, en, id, extra) {
  return '<div class="why"><span class="lbl">' + esc(t(labelKey)) + '</span>' +
    '<p>' + P(en, id) + '</p>' + idBlock(id) + (extra || '') + '</div>';
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
