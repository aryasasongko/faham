/* Hash routing over a single document.

   Faham is one page with a set of sections; a "view" is a named group of them.
   Routes are hash-based (`#/prayer`, `#words`) which is what makes the app
   deployable to GitHub Pages with no server rewrite rules, and what makes a
   refresh land back where the user was rather than on a 404.
   ========================================================================== */

import { state } from './state.js';
import { t } from './i18n.js';
import { $, esc, qsa, setHTML } from './dom.js';
import { icon } from './icons.js';

export const VIEWS = [
  { v: 'today', labelKey: 'nav_today', secs: ['today', 'tracker'] },
  { v: 'prayer', labelKey: 'nav_prayer', secs: ['rakaat', 'words', 'wudhu'] },
  { v: 'qibla', labelKey: 'nav_qibla', secs: ['times', 'qibla'] },
  { v: 'duas', labelKey: 'nav_duas', secs: ['duas'] },
  { v: 'ask', labelKey: 'nav_ask', secs: ['ask'] },
  { v: 'read', labelKey: 'nav_read', secs: ['why', 'islam', 'stories', 'surah', 'kata'] },
  { v: 'settings', labelKey: 'nav_settings', secs: ['settings'] }
];

export const SECTION_NAMES = {
  today: ['Today', 'Hari ini'],
  tracker: ['Prayer log', 'Catatan salat'],
  why: ['Start here', 'Mulai'],
  islam: ['Islam', 'Islam'],
  stories: ['Stories', 'Kisah'],
  rakaat: ['Rakaat', 'Rakaat'],
  words: ['In the prayer', 'Dalam sholat'],
  duas: ['Duas', 'Doa'],
  surah: ['Surahs', 'Surah'],
  wudhu: ['Wudhu', 'Wudhu'],
  qibla: ['Qibla', 'Kiblat'],
  times: ['Prayer times', 'Waktu sholat'],
  ask: ['Questions', 'Tanya'],
  kata: ['Vocabulary', 'Kosakata'],
  settings: ['Settings', 'Pengaturan']
};

export const router = {
  view: 'today',
  searchMode: false
};

function sectionName(id) {
  const pair = SECTION_NAMES[id];
  if (!pair) return id;
  return state.language === 'id' ? pair[1] : pair[0];
}

function viewFor(sectionId) {
  for (let i = 0; i < VIEWS.length; i++) {
    if (VIEWS[i].secs.indexOf(sectionId) > -1) return VIEWS[i].v;
  }
  return 'read';
}

export function renderTabs() {
  setHTML($('tabs'), VIEWS.map((V) => (
    '<a href="#/' + V.v + '" data-view="' + V.v + '"' +
    (V.v === router.view && !router.searchMode
      ? ' class="on" aria-current="page"' : '') + '>' +
    icon(V.v === 'settings' ? 'settings' : V.v) + esc(t(V.labelKey)) + '</a>'
  )).join(''));
}

export function renderSubnav() {
  const el = $('subnav');
  const V = VIEWS.filter((x) => x.v === router.view)[0];
  if (router.searchMode || !V || V.secs.length < 2) { setHTML(el, ''); return; }
  setHTML(el, V.secs.map((sid) => (
    '<a href="#' + sid + '" data-section="' + sid + '">' + esc(sectionName(sid)) + '</a>'
  )).join(''));
}

export function applyView() {
  const V = VIEWS.filter((x) => x.v === router.view)[0] || VIEWS[0];
  qsa('section[id]').forEach((sec) => {
    sec.classList.toggle('vhide', V.secs.indexOf(sec.id) === -1);
  });
  renderTabs();
  renderSubnav();
}

export function setView(view, sectionId, noScroll) {
  const known = VIEWS.some((x) => x.v === view);
  router.view = known ? view : 'today';
  router.searchMode = false;

  const search = $('q');
  if (search && search.value) search.value = '';
  setHTML($('results'), '');
  qsa('.srch').forEach((el) => el.classList.remove('hidden'));

  applyView();

  if (sectionId && $(sectionId)) $(sectionId).scrollIntoView();
  else if (!noScroll) window.scrollTo(0, 0);
}

export function routeFromHash(noScroll) {
  const hash = (window.location.hash || '').replace('#', '');
  if (hash.indexOf('/') === 0) { setView(hash.slice(1), null, noScroll); return; }
  if (hash && SECTION_NAMES[hash]) { setView(viewFor(hash), hash, noScroll); return; }
  setView('today', null, noScroll);
}

export function bindRouter() {
  $('tabs').addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    window.location.hash = '#/' + a.dataset.view;
  });

  $('subnav').addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    const el = $(a.dataset.section);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });

  /* In-content links like <a href="#words"> should switch view, not just jump. */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    if (a.closest('#tabs') || a.closest('#subnav')) return;
    const id = a.getAttribute('href').slice(1);
    if (id.indexOf('/') === 0) { window.location.hash = a.getAttribute('href'); e.preventDefault(); return; }
    if (!SECTION_NAMES[id]) return;
    e.preventDefault();
    window.location.hash = '#' + id;
  });

  window.addEventListener('hashchange', () => routeFromHash());
}
