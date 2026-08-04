/* ============================================================================
   Faham — application entry point.
   ----------------------------------------------------------------------------
   Responsibilities, and nothing else:
     * load persisted settings before the first paint;
     * wire the delegated listeners once;
     * decide what to re-render when state changes;
     * keep two slow timers alive (the countdown, and the local-midnight roll).

   Everything that draws lives in js/views/*, everything that decides lives in
   js/*.js. This file is the seam between them.
   ========================================================================== */

import { state, loadSettings, setLanguage, setPair, setReciter, subscribe } from './js/state.js';
import { $, qsa, delegate } from './js/dom.js';
import { t } from './js/i18n.js';
import { bindRouter, routeFromHash, renderTabs, renderSubnav } from './js/router.js';
import { bindSearch, refreshSearch } from './js/search.js';
import * as Audio from './js/audio.js';
import * as PrayerTimes from './js/prayer-times.js';
import * as Times from './js/views/times.js';
import * as QiblaView from './js/views/qibla.js';
import { renderToday } from './js/views/today.js';
import { renderTracker, bindTracker } from './js/views/tracker.js';
import { renderConcepts, renderIslam, renderStories, renderSurahs, renderVocab, bindRead } from './js/views/read.js';
import { renderPrayerView, renderRakaatVisuals, bindPrayer, selectPrayer } from './js/views/prayer.js';
import { renderDuas } from './js/views/duas.js';
import { renderFaq } from './js/views/faq.js';
import { renderSettings, bindSettings } from './js/views/settings.js';
import { isNeeded as onboardingNeeded, startOnboarding, bindOnboarding } from './js/views/onboarding.js';
import { todayKey } from './js/dates.js';

let lastDayKey = todayKey();

/* ---- theme -------------------------------------------------------------- */

const THEME_COLORS = { light: '#fcfcfb', dark: '#0d0d0d' };

/**
 * Reflect the Appearance setting. 'auto' removes the attribute so the CSS
 * media query decides; 'light'/'dark' force the token set. The theme-color
 * metas are updated too, so the browser/system chrome matches a forced theme
 * instead of following the device. A tiny inline script in index.html sets the
 * attribute before first paint; this keeps it correct from then on.
 */
function applyTheme() {
  const root = document.documentElement;
  const forced = state.theme === 'light' || state.theme === 'dark';
  if (forced) root.setAttribute('data-theme', state.theme);
  else root.removeAttribute('data-theme');

  qsa('meta[name="theme-color"]').forEach((meta) => {
    if (forced) {
      meta.setAttribute('content', THEME_COLORS[state.theme]);
    } else {
      const media = meta.getAttribute('media') || '';
      meta.setAttribute('content', media.indexOf('dark') > -1 ? THEME_COLORS.dark : THEME_COLORS.light);
    }
  });
}

/* ---- static chrome ------------------------------------------------------ */

/**
 * Swap any element in index.html carrying a `data-id` translation.
 * The English original is captured once into `data-en` on first run so the
 * swap is reversible however many times the language changes.
 */
function applyChrome() {
  const attr = state.language === 'id' ? 'data-id' : state.language === 'ko' ? 'data-ko' : null;
  qsa('[data-id]').forEach((el) => {
    if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML);
    const translated = attr ? el.getAttribute(attr) : null;
    el.innerHTML = translated || el.getAttribute('data-en');
  });
  /* Accessible names are content too: a Korean screen-reader user should not
     hear "Search" and "Sections" in English. */
  qsa('[data-aria-id]').forEach((el) => {
    if (!el.hasAttribute('data-aria-en')) el.setAttribute('data-aria-en', el.getAttribute('aria-label') || '');
    const alt = state.language === 'id' ? el.getAttribute('data-aria-id')
      : state.language === 'ko' ? el.getAttribute('data-aria-ko') : null;
    el.setAttribute('aria-label', alt || el.getAttribute('data-aria-en'));
  });

  const box = $('q');
  if (box) {
    box.placeholder = (state.language === 'id' && box.getAttribute('data-id-ph')) ||
      (state.language === 'ko' && box.getAttribute('data-ko-ph')) ||
      box.getAttribute('data-en-ph');
  }
  qsa('#seg button[data-lang]').forEach((b) => {
    const on = b.dataset.lang === state.language;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  /* the pair toggle is only meaningful once there are two languages to pair */
  const pairBtn = $('pairBtn');
  if (pairBtn) {
    pairBtn.classList.toggle('avail', true);
    pairBtn.classList.toggle('on', state.pair);
    pairBtn.setAttribute('aria-pressed', state.pair ? 'true' : 'false');
    pairBtn.textContent = state.language === 'en' ? '+ID' : '+EN';
  }
  document.documentElement.lang =
    state.language === 'id' ? 'id' : state.language === 'ko' ? 'ko' : 'en';
}

/* ---- rendering ---------------------------------------------------------- */

function renderAll() {
  applyChrome();
  renderToday();
  renderTracker();
  renderConcepts();
  renderIslam();
  renderStories();
  renderPrayerView();
  renderDuas();
  renderFaq();
  renderSurahs();
  renderVocab();
  Times.renderTimes();
  QiblaView.renderQibla();
  renderSettings();
  renderTabs();
  renderSubnav();
  Audio.paintButtons();
  refreshSearch();
}

/** After a location change only these need redrawing.
    The day arc inside the Prayer view is drawn from the calculated times, so it
    follows too — but only that block, not the whole (long) prayer view. */
function renderLocationDependent() {
  Times.renderTimes();
  QiblaView.renderQibla();
  renderRakaatVisuals();
  Audio.paintButtons();
}

function onStateChange(reason) {
  if (reason === 'language') { renderAll(); return; }
  if (reason === 'theme') { applyTheme(); renderSettings(); return; }
  if (reason === 'madhhab' || reason === 'calculation') {
    PrayerTimes.refresh();
    renderPrayerView();
    Times.renderTimes();
    renderSettings();
    renderTabs();
    Audio.paintButtons();
    refreshSearch();
    return;
  }
  if (reason === 'location') { renderLocationDependent(); return; }
  if (reason === 'tracker') { renderTracker(); renderSettings(); return; }
  if (reason === 'reciter') { renderSurahs(); Audio.paintButtons(); return; }
}

/* ---- global delegated listeners ----------------------------------------- */

function bindGlobal() {
  /* language segmented control in the top bar */
  delegate($('seg'), 'button[data-lang]', 'click', (e, el) => setLanguage(el.dataset.lang));
  delegate($('seg'), '#pairBtn', 'click', () => setPair(!state.pair));

  /* every play control in the app, wherever it was rendered */
  document.addEventListener('click', (e) => {
    /* "Pray now" on Today: jump to the Prayer view with that prayer opened. */
    const pray = e.target.closest('[data-pray-now]');
    if (pray) { selectPrayer(pray.dataset.prayNow); return; }

    const play = e.target.closest('.playb');
    if (play) {
      const keys = play.dataset.audioKeys ? play.dataset.audioKeys.split(',') : null;
      Audio.toggle(play.dataset.audioId, play.dataset.audioKind, keys);
      return;
    }
    const rec = e.target.closest('.rec');
    if (rec) { Audio.stop(); setReciter(rec.dataset.rec); }
  });

  bindRouter();
  bindSearch();
  bindRead();
  bindPrayer();
  bindTracker();
  bindOnboarding();
  bindSettings();
  Times.bindTimes(() => { renderLocationDependent(); });
  QiblaView.bindQibla(() => { renderLocationDependent(); });
}

/* ---- timers ------------------------------------------------------------- */

/**
 * One slow interval covers both jobs that depend on the wall clock: refreshing
 * the countdown to the next prayer, and noticing that the local calendar day
 * has rolled over while the app was left open overnight.
 */
function startClock() {
  window.setInterval(() => {
    const key = todayKey();
    if (key !== lastDayKey) {
      /* Midnight rolled over with the app open: the Today card, the tracker's
         "today", the times and the day arc all move — re-render everything. */
      lastDayKey = key;
      PrayerTimes.refresh();
      renderAll();
      return;
    }
    Times.tickTimes();
  }, 30000);

  /* A tab restored from the background can be hours out of date. */
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    const key = todayKey();
    if (key !== lastDayKey) { lastDayKey = key; PrayerTimes.refresh(); renderAll(); return; }
    Times.tickTimes();
  });
}

/* ---- service worker ----------------------------------------------------- */

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (window.location.protocol.indexOf('http') !== 0) return;

  /* Never reload out from under the reader. A new worker taking control in the
     middle of a walkthrough, a recitation or a dua would lose their place for
     no reason they can see. The new version waits; we offer it, and the reload
     happens when they say so.

     The offer must be able to FAIL SAFELY, which the first version of this did
     not. Three things go wrong in the wild:
       * `controllerchange` is unreliable on iOS, so a reload that waits only
         for that event may never happen — leaving a dead button under a bar
         that never goes away;
       * with two tabs open, accepting in one makes the other tab's waiting
         worker redundant, so its button would post a message to nothing;
       * an update can activate on its own, leaving the bar advertising an
         update that has already been applied.
     So: the reload is driven by a timer as well as the event, the button is
     never left permanently disabled, and the bar re-syncs with the real
     registration state on every load and every time the tab is shown. */
  let userAskedToReload = false;
  let pending = null;              // the worker currently being offered

  function hideUpdate() {
    const bar = $('updateBar');
    if (!bar) return;
    bar.hidden = true;
    const button = bar.querySelector('button');
    if (button) button.disabled = false;
    pending = null;
  }

  function doReload() {
    if (!userAskedToReload) return;
    userAskedToReload = false;
    window.location.reload();
  }

  navigator.serviceWorker.addEventListener('controllerchange', doReload);

  function offerUpdate(worker) {
    const bar = $('updateBar');
    if (!bar || !worker) { hideUpdate(); return; }
    /* Already gone, or already in charge: there is nothing to offer. */
    if (worker.state === 'redundant' || worker === navigator.serviceWorker.controller) {
      hideUpdate();
      return;
    }
    pending = worker;
    bar.hidden = false;
    bar.querySelector('.upd-t').textContent = t('upd_ready');
    const button = bar.querySelector('button');
    button.textContent = t('upd_reload');
    button.disabled = false;
    button.onclick = () => {
      userAskedToReload = true;
      button.disabled = true;
      try { worker.postMessage('skipWaiting'); } catch (e) { /* already gone */ }
      /* Belt and braces: reload even if controllerchange never arrives. */
      window.setTimeout(doReload, 1500);
    };
    worker.addEventListener('statechange', () => {
      if (worker.state === 'activated') { doReload(); hideUpdate(); }
      else if (worker.state === 'redundant') {
        /* Another tab accepted it, or the install was superseded. */
        if (userAskedToReload) doReload(); else hideUpdate();
      }
    });
  }

  /* The bar is a claim about the registration, so the registration decides. */
  function syncUpdateBar(reg) {
    if (!reg) { hideUpdate(); return; }
    if (reg.waiting) offerUpdate(reg.waiting);
    else if (!reg.installing) hideUpdate();
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
      .then((reg) => {
        reg.update();
        window.setInterval(() => reg.update(), 60 * 60 * 1000);
        syncUpdateBar(reg);
        reg.addEventListener('updatefound', () => {
          const next = reg.installing;
          if (!next) return;
          next.addEventListener('statechange', () => {
            /* An install with no existing controller is the FIRST install:
               nothing to offer, the page is already running the new code. */
            if (next.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(next);
            else if (next.state === 'installed') hideUpdate();
          });
        });
        /* Coming back to a backgrounded tab: the world may have moved on. */
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState !== 'visible') return;
          reg.update().then(() => syncUpdateBar(reg)).catch(() => syncUpdateBar(reg));
        });
      })
      .catch(() => { /* the app works uncached */ });
  });

  /* "Ready offline" is only true once the worker says the critical shell is in
     the cache — not merely once it registered. */
  navigator.serviceWorker.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'shell-ready') {
      const el = $('offlineState');
      if (el) { el.hidden = false; el.textContent = t('pwa_ready'); }
    }
  });
}

/* ---- start -------------------------------------------------------------- */

function start() {
  loadSettings();
  applyTheme();
  if (state.location) PrayerTimes.refresh();

  bindGlobal();
  renderAll();
  routeFromHash(true);
  subscribe(onStateChange);
  startClock();
  registerServiceWorker();

  if (onboardingNeeded()) {
    startOnboarding(() => { renderAll(); routeFromHash(true); });
  }
}

start();
