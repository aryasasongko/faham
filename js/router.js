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
  today:    ['Today', 'Hari ini', '오늘'],
  tracker:  ['Prayer log', 'Catatan sholat', '예배 기록'],
  why:      ['Start here', 'Mulai', '시작하기'],
  islam:    ['Islam', 'Islam', '이슬람'],
  stories:  ['Stories', 'Kisah', '이야기'],
  rakaat:   ['Rakaat', 'Rakaat', '라카아'],
  words:    ['In the prayer', 'Dalam sholat', '예배 안에서'],
  duas:     ['Duas', 'Doa', '두아'],
  surah:    ['Surahs', 'Surah', '수라'],
  wudhu:    ['Wudhu', 'Wudhu', '우두'],
  qibla:    ['Qibla', 'Kiblat', '키블라'],
  times:    ['Prayer times', 'Waktu sholat', '예배 시간'],
  ask:      ['Questions', 'Tanya', '질문'],
  kata:     ['Vocabulary', 'Kosakata', '어휘'],
  settings: ['Settings', 'Pengaturan', '설정']
};

export const router = {
  view: 'today',
  searchMode: false
};

function sectionName(id) {
  const row = SECTION_NAMES[id];
  if (!row) return id;
  const i = state.language === 'id' ? 1 : state.language === 'ko' ? 2 : 0;
  return row[i] || row[0];
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

  /* The title carries the route, so browser history entries are distinguishable
     and a screen reader announces where a back/forward step landed. */
  document.title = t(V.labelKey) + ' · Faham';
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
