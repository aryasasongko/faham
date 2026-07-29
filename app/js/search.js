/* Search across every section at once.

   Rendered content carries the class `srch` on each searchable unit. Searching
   hides the units that do not match and any section left with none, then
   restores the normal view when the box is cleared. Matching is done on the
   rendered text, which means it searches whichever language is on screen — and
   in Both mode, both. */

import { t, P } from './i18n.js';
import { $, esc, qsa, setHTML } from './dom.js';
import { router, applyView, renderTabs, renderSubnav } from './router.js';

let debounce = null;

function run() {
  const box = $('q');
  const term = box.value.trim().toLowerCase();
  const items = qsa('.srch');

  if (!term) {
    router.searchMode = false;
    items.forEach((el) => el.classList.remove('hidden'));
    setHTML($('results'), '');
    applyView();
    return;
  }

  router.searchMode = true;
  let hits = 0;
  items.forEach((el) => {
    const match = el.textContent.toLowerCase().indexOf(term) > -1;
    el.classList.toggle('hidden', !match);
    if (match) hits += 1;
  });
  qsa('section[id]').forEach((sec) => {
    sec.classList.toggle('vhide', sec.querySelectorAll('.srch:not(.hidden)').length === 0);
  });
  renderTabs();
  renderSubnav();

  const heading = hits + ' ' + (P('match' + (hits === 1 ? '' : 'es') + ' for', 'hasil untuk')) +
    ' “' + box.value + '”';
  setHTML($('results'),
    '<div class="callout blue" role="status"><b>' + esc(heading) + '</b>' +
    '<span>' + esc(t('searchNote')) + '</span></div>');
}

export function refreshSearch() {
  const box = $('q');
  if (box && box.value.trim()) run();
}

export function bindSearch() {
  const box = $('q');
  if (!box) return;
  box.addEventListener('input', () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(run, 120);
  });
}
