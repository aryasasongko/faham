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

import { state, loadSettings, setLanguage, setReciter, subscribe } from './js/state.js';
import { $, qsa, delegate } from './js/dom.js';
import { bindRouter, routeFromHash, renderTabs, renderSubnav } from './js/router.js';
import { bindSearch, refreshSearch } from './js/search.js';
import * as Audio from './js/audio.js';
import * as PrayerTimes from './js/prayer-times.js';
import * as Times from './js/views/times.js';
import * as QiblaView from './js/views/qibla.js';
import { renderToday } from './js/views/today.js';
import { renderTracker, bindTracker } from './js/views/tracker.js';
import { renderConcepts, renderIslam, renderStories, renderSurahs, renderVocab, bindRead } from './js/views/read.js';
import { renderPrayerView, renderRakaatVisuals, bindPrayer } from './js/views/prayer.js';
import { renderDuas } from './js/views/duas.js';
import { renderFaq } from './js/views/faq.js';
import { renderSettings, bindSettings } from './js/views/settings.js';
import { isNeeded as onboardingNeeded, startOnboarding, bindOnboarding } from './js/views/onboarding.js';
import { todayKey } from './js/dates.js';

let lastDayKey = todayKey();

/* ---- static chrome ------------------------------------------------------ */

/**
 * Swap any element in index.html carrying a `data-id` translation.
 * The English original is captured once into `data-en` on first run so the
 * swap is reversible however many times the language changes.
 */
function applyChrome() {
  qsa('[data-id]').forEach((el) => {
    if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML);
    el.innerHTML = state.language === 'id' ? el.getAttribute('data-id') : el.getAttribute('data-en');
  });
  const box = $('q');
  if (box) {
    box.placeholder = state.language === 'id'
      ? box.getAttribute('data-id-ph') : box.getAttribute('data-en-ph');
  }
  qsa('#seg button').forEach((b) => {
    const on = b.dataset.lang === state.language;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  document.documentElement.lang = state.language === 'id' ? 'id' : 'en';
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

  /* every play control in the app, wherever it was rendered */
  document.addEventListener('click', (e) => {
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

  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded) return;
    reloaded = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
      .then((reg) => {
        reg.update();
        window.setInterval(() => reg.update(), 60 * 60 * 1000);
        if (reg.waiting) reg.waiting.postMessage('skipWaiting');
        reg.addEventListener('updatefound', () => {
          const next = reg.installing;
          if (!next) return;
          next.addEventListener('statechange', () => {
            if (next.state === 'installed' && navigator.serviceWorker.controller) {
              next.postMessage('skipWaiting');
            }
          });
        });
      })
      .catch(() => { /* the app works uncached */ });
  });
}

/* ---- start -------------------------------------------------------------- */

function start() {
  loadSettings();
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
