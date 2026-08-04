/* First run.

   Two decisions, in the order that makes them answerable: language first (so
   the second question is readable), then madhhab. Location is deliberately not
   asked for here — the educational content works without it, and permission
   prompts land better attached to the feature that needs them.

   The panel is a full-screen dialog with focus held inside it, so it works with
   a keyboard and does not leave the page behind it reachable by tab. */

import { setLanguage, setMadhhab, setOnboarded, state, clearMadhhab } from '../state.js';
import { t, pickLang } from '../i18n.js';
import { $, esc, setHTML, qsa } from '../dom.js';
import { MADHHAB_KEYS, MADHHAB_META } from '../madhhab.js';
import { brandLogo } from '../icons.js';

let step = 0;                 // 0 = language, 1 = madhhab
let onFinish = null;
let lastFocused = null;

function languageStep() {
  const options = [
    { key: 'en', label: 'English', sub: 'English' },
    { key: 'id', label: 'Bahasa Indonesia', sub: 'Bahasa Indonesia' },
    { key: 'ko', label: '한국어', sub: 'Korean' }
  ];
  return '<h2 id="obTitle">' + esc(t('ob_lang_h')) + '</h2>' +
    '<p class="ob-s">' + esc(t('ob_lang_s')) + '</p>' +
    '<div class="ob-grid">' + options.map((o) => (
      '<button type="button" class="ob-card' + (state.language === o.key ? ' on' : '') +
      '" data-ob-lang="' + esc(o.key) + '" aria-pressed="' + (state.language === o.key) + '">' +
      '<b>' + esc(o.label) + '</b><i>' + esc(o.sub) + '</i></button>'
    )).join('') + '</div>' +
    '<button type="button" class="ob-next" data-ob-next="1">' + esc(t('ob_continue')) + '</button>';
}

function madhhabStep() {
  /* A beginner should never be blocked here. "Not sure yet" is offered first
     and preselected, because a newcomer genuinely does not know the answer and
     making them guess is a worse outcome than starting them on the school
     their mosque most likely follows — which the app then says openly wherever
     a school-specific instruction appears, with a link to change it. */
  const unsure = !state.madhhab;
  const cards = '<button type="button" class="ob-card' + (unsure ? ' on' : '') +
    '" data-ob-madhhab="unsure" aria-pressed="' + unsure + '">' +
    '<b>' + esc(t('ob_unsure_t')) + '</b><i>' + esc(t('ob_unsure_s')) + '</i></button>' +
    MADHHAB_KEYS.map((k) => {
      const m = MADHHAB_META[k];
      return '<button type="button" class="ob-card' + (state.madhhab === k ? ' on' : '') +
        '" data-ob-madhhab="' + esc(k) + '" aria-pressed="' + (state.madhhab === k) + '">' +
        '<b>' + esc(m.name) + '</b><i>' + esc(pickLang(m.blurb)) + '</i></button>';
    }).join('');
  return '<h2 id="obTitle">' + esc(t('ob_madhhab_h')) + '</h2>' +
    '<p class="ob-s">' + esc(t('ob_madhhab_s')) + '</p>' +
    '<div class="ob-grid">' + cards + '</div>' +
    '<p class="ob-hint">' + esc(t('ob_unsure')) + '</p>' +
    '<button type="button" class="ob-next" data-ob-done="1">' + esc(t('ob_start')) + '</button>';
}

function render() {
  const host = $('onboarding');
  setHTML(host,
    '<div class="ob-panel" role="dialog" aria-modal="true" aria-labelledby="obTitle">' +
      /* The mark is decorative beside its own name, so it is hidden from
         assistive tech rather than read out twice. */
      '<div class="ob-head">' +
        '<span class="ob-logo-wrap" aria-hidden="true">' + brandLogo(56, 'ob-logo') + '</span>' +
        '<p class="ob-brand">' + esc(t('ob_welcome_h')) + '</p>' +
      '</div>' +
      '<p class="ob-lede">' + esc(t('ob_welcome_s')) + '</p>' +
      '<p class="ob-step">' + esc(t('ob_step')) + ' ' + (step + 1) + '/2</p>' +
      (step === 0 ? languageStep() : madhhabStep()) +
    '</div>');
  const first = host.querySelector('.ob-card');
  if (first) first.focus();
}

function close() {
  const host = $('onboarding');
  host.classList.add('hidden');
  setHTML(host, '');
  document.body.classList.remove('ob-open');
  if (lastFocused && lastFocused.focus) lastFocused.focus();
  if (onFinish) onFinish();
}

/** Keep tabbing inside the dialog while it is open. */
function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const host = $('onboarding');
  if (host.classList.contains('hidden')) return;
  const focusable = qsa('button:not([disabled])', host);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

export function isNeeded() {
  return !state.onboarded || !state.madhhab;
}

export function startOnboarding(finishCallback) {
  onFinish = finishCallback || null;
  lastFocused = document.activeElement;
  step = 0;
  const host = $('onboarding');
  host.classList.remove('hidden');
  document.body.classList.add('ob-open');
  render();
}

export function bindOnboarding() {
  const host = $('onboarding');
  document.addEventListener('keydown', trapFocus);

  host.addEventListener('click', (e) => {
    const lang = e.target.closest('[data-ob-lang]');
    if (lang) { setLanguage(lang.dataset.obLang); render(); return; }

    const madhhab = e.target.closest('[data-ob-madhhab]');
    if (madhhab) {
      const key = madhhab.dataset.obMadhhab;
      /* "Not sure" clears the choice; the default is applied at Start. */
      if (key === 'unsure') { clearMadhhab(); } else { setMadhhab(key); }
      render();
      return;
    }

    if (e.target.closest('[data-ob-next]')) { step = 1; render(); return; }

    if (e.target.closest('[data-ob-done]')) {
      /* Never a dead end. Undecided starts on Shafi'i — the school most
         Indonesian mosques follow — and every school-specific passage in the
         app already carries "Showing <school> · Change". */
      if (!state.madhhab) setMadhhab('shafii');
      setOnboarded(true);
      close();
    }
  });
}
