/* Settings.

   Language and madhhab are independent, and the code enforces that: they are
   separate setters on separate keys, and neither clears the other. Calculation
   settings sit under their own heading because a beginner never needs them.

   Clearing prayer history is a two-step action with an explicit confirmation,
   and it is not reachable from anywhere else in the app. */

import { state, setLanguage, setPair, setMadhhab, setCalculation, setTheme, clearAllData } from '../state.js';
import { isPersistent } from '../storage.js';
import { t, pickLang, pairBlock } from '../i18n.js';
import { $, esc, setHTML, delegate, announce } from '../dom.js';
import { MADHHAB_KEYS, MADHHAB_META, PRACTICE_ROWS } from '../madhhab.js';
import * as Madhhab from '../madhhab.js';
import { METHODS } from '../prayer-times.js';
import * as Tracker from '../tracker.js';

let confirmingClear = false;
let confirmingWipe = false;

const LANG_OPTIONS = [
  { key: 'en', label: 'English' },
  { key: 'id', label: 'Bahasa Indonesia' },
  { key: 'ko', label: '한국어' }
];

function group(title, note, body) {
  return '<section class="setgrp"><h3>' + esc(title) + '</h3>' +
    (note ? '<p class="setnote">' + esc(note) + '</p>' : '') + body + '</section>';
}

function choiceList(name, options, current, dataAttr) {
  return '<div class="choices" role="group" aria-label="' + esc(name) + '">' +
    options.map((o) => (
      '<button type="button" class="choice' + (o.key === current ? ' on' : '') + '"' +
      ' ' + dataAttr + '="' + esc(o.key) + '" aria-pressed="' + (o.key === current) + '">' +
      '<b>' + esc(o.label) + '</b>' + (o.sub ? '<i>' + esc(o.sub) + '</i>' : '') + '</button>'
    )).join('') + '</div>';
}

export function renderSettings() {
  const host = $('settingsPanel');
  if (!host) return;

  const madhhabOptions = MADHHAB_KEYS.map((k) => ({
    key: k, label: MADHHAB_META[k].name, sub: pickLang(MADHHAB_META[k].blurb)
  }));

  /* "Automatic" picks the national convention where the coordinates make one
     obvious (Indonesia) and the Muslim World League angles everywhere else. */
  const methodOptions = [{
    key: 'auto',
    label: state.language === 'id' ? 'Otomatis' : 'Automatic',
    sub: state.language === 'id' ? 'Berdasarkan lokasi' : 'Chosen from your location'
  }].concat(Object.keys(METHODS).map((k) => ({ key: k, label: pickLang(METHODS[k].label), sub: '' })));

  const themeOptions = [
    { key: 'auto', label: t('set_theme_auto'), sub: t('set_theme_note') },
    { key: 'light', label: t('set_theme_light'), sub: '' },
    { key: 'dark', label: t('set_theme_dark'), sub: '' }
  ];

  const asrOptions = [
    { key: 'auto', label: t('set_asr_auto'), sub: Madhhab.name() },
    { key: 'standard', label: t('set_asr_standard'), sub: '' },
    { key: 'hanafi', label: t('set_asr_hanafi'), sub: '' }
  ];

  const practice = PRACTICE_ROWS.map((row) => (
    '<div class="prow"><span class="pk">' + esc(pickLang(row.label)) + '</span>' +
    '<span class="pv">' + esc(Madhhab.practiceText(row.key)) + '</span>' +
    pairBlock(esc(Madhhab.practiceTextEn(row.key)), esc(Madhhab.practiceTextId(row.key))) + '</div>'
  )).join('');

  const clearBlock = confirmingClear
    ? '<div class="danger"><p>' + esc(t('set_clear_confirm')) + '</p>' +
      '<div class="danger-row">' +
      '<button type="button" class="btn danger-btn" data-clear-confirm="1">' + esc(t('set_clear_yes')) + '</button>' +
      '<button type="button" class="btn" data-clear-cancel="1">' + esc(t('set_cancel')) + '</button>' +
      '</div></div>'
    : '<button type="button" class="btn" data-clear="1">' + esc(t('set_clear')) + '</button>';

  /* Two separate erasures: the log alone, and everything. Both confirm first. */
  const wipeBlock = confirmingWipe
    ? '<div class="danger"><p>' + esc(t('set_clearall_confirm')) + '</p>' +
      '<div class="danger-row">' +
      '<button type="button" class="btn danger-btn" data-wipe-confirm="1">' + esc(t('set_clearall_yes')) + '</button>' +
      '<button type="button" class="btn" data-wipe-cancel="1">' + esc(t('set_cancel')) + '</button>' +
      '</div></div>'
    : '<button type="button" class="btn" data-wipe="1">' + esc(t('set_clearall')) + '</button>' +
      '<p class="setnote">' + esc(t('set_clearall_note')) + '</p>';

  setHTML(host,
    '<div class="srch">' +
    (isPersistent() ? '' : '<div class="callout"><b>' + esc(t('set_nostore')) + '</b><span></span></div>') +

    group(t('set_language'), '',
      choiceList(t('set_language'), LANG_OPTIONS, state.language, 'data-set-lang') +
      '<label class="togrow"><input type="checkbox" data-set-pair="1"' + (state.pair ? ' checked' : '') + '>' +
      '<span>' + esc(t('set_pair')) + '</span></label>' +
      '<p class="setnote">' + esc(t('set_pair_note')) + '</p>') +

    group(t('set_theme'), '', choiceList(t('set_theme'), themeOptions, state.theme, 'data-set-theme')) +

    group(t('set_madhhab'), t('set_madhhab_note'),
      choiceList(t('set_madhhab'), madhhabOptions, Madhhab.currentKey(), 'data-set-madhhab')) +

    group(t('set_differ'), t('set_differ_note'), '<div class="ptable">' + practice + '</div>') +

    group(t('set_advanced'), t('set_adv_note'),
      '<p class="setsub">' + esc(t('set_method')) + '</p>' +
      choiceList(t('set_method'), methodOptions, state.calculationMethod, 'data-set-method') +
      '<p class="setsub">' + esc(t('set_asr')) + '</p>' +
      choiceList(t('set_asr'), asrOptions, state.asrMethod, 'data-set-asr')) +

    group(t('set_data'), t('set_privacy'),
      '<p class="setsub">' + esc(t('set_days_logged').replace('{n}', Tracker.loggedDayCount())) + '</p>' +
      clearBlock + wipeBlock) +

    '</div>');
}

/* Each setter notifies, and app.js decides what re-renders — no callback is
   threaded through here, so a settings tap cannot trigger a double render. */
export function bindSettings() {
  const host = $('settingsPanel');

  delegate(host, '[data-set-lang]', 'click', (e, el) => {
    setLanguage(el.dataset.setLang);
  });

  delegate(host, '[data-wipe]', 'click', () => { confirmingWipe = true; renderSettings(); });
  delegate(host, '[data-wipe-cancel]', 'click', () => { confirmingWipe = false; renderSettings(); });
  delegate(host, '[data-wipe-confirm]', 'click', () => {
    clearAllData().then(() => { window.location.replace(window.location.pathname); });
  });

  delegate(host, '[data-set-pair]', 'change', (e, el) => {
    setPair(el.checked);
  });

  delegate(host, '[data-set-theme]', 'click', (e, el) => {
    setTheme(el.dataset.setTheme);
  });

  delegate(host, '[data-set-madhhab]', 'click', (e, el) => {
    setMadhhab(el.dataset.setMadhhab);
    announce(t('md_selected') + ' ' + Madhhab.name());
  });

  delegate(host, '[data-set-method]', 'click', (e, el) => {
    setCalculation({ method: el.dataset.setMethod });
  });

  delegate(host, '[data-set-asr]', 'click', (e, el) => {
    setCalculation({ asr: el.dataset.setAsr });
  });

  delegate(host, '[data-clear]', 'click', () => { confirmingClear = true; renderSettings(); });
  delegate(host, '[data-clear-cancel]', 'click', () => { confirmingClear = false; renderSettings(); });
  delegate(host, '[data-clear-confirm]', 'click', () => {
    /* Reset the flag FIRST: clearAll() notifies, and the re-render that the
       notification triggers must not repaint the confirmation state. */
    confirmingClear = false;
    Tracker.clearAll();
    announce(t('set_cleared'));
  });
}
