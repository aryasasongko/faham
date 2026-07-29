/* ============================================================================
   AudioService — one player, one queue, one source of truth.
   ----------------------------------------------------------------------------
   Design notes worth keeping:

   * ONE `Audio` element for the whole app. Dozens of independent players is the
     usual cause of two clips overlapping and of buttons stuck in a "playing"
     state after a re-render. Starting anything stops whatever came before.

   * TWO SOURCES, NEVER MIXED. Quran verses resolve against a recitation CDN by
     surah:ayah. Everything else — takbir, tashahhud, duas, vocabulary — is not
     Quran, so it is never requested from a Quran API; it resolves to a local
     file listed in data/audio-map.js and to nothing else. Where a local file
     has not been added yet the button reports "Audio unavailable" and the app
     carries on.

   * NOTHING PRELOADS. `preload` is left at 'none' and a source is only assigned
     on an explicit tap, so opening a section costs no bandwidth.

   * NOTHING SPINS FOREVER. A load that has not produced playable data inside
     LOAD_TIMEOUT_MS is abandoned and reported.

   Button state is repainted in place rather than by re-rendering the list, so
   rapid repeated taps cannot desynchronise the DOM from the player.
   ========================================================================== */

import { state, setAudio } from './state.js';
import { t } from './i18n.js';
import { AUDIO_BASE, AUDIO_MAP, VOCAB_AUDIO_DIR } from '../data/audio-map.js';
import { currentKey } from './madhhab.js';
import { esc, qsa, announce } from './dom.js';

const LOAD_TIMEOUT_MS = 12000;

export const RECITERS = [
  {
    k: 'husary', n: 'Husary', sub: ['teaching pace', 'tempo belajar'],
    base: 'https://mirrors.quranicaudio.com/everyayah/Husary_Muallim_128kbps/',
    alt: 'https://everyayah.com/data/Husary_Muallim_128kbps/'
  },
  {
    k: 'afasy', n: 'Al-Afasy', sub: ['natural pace', 'tempo biasa'],
    base: 'https://verses.quran.com/Alafasy/mp3/',
    alt: 'https://everyayah.com/data/Alafasy_128kbps/'
  }
];

let player = null;
let queue = [];
let queueIndex = 0;
let activeId = null;
let usingMirror = false;
let timeoutHandle = null;
let sequence = 0;          // guards against a late event from an abandoned load

/* ---- URL building ------------------------------------------------------- */

function pad3(n) {
  const s = String(n);
  return s.length >= 3 ? s : ('000' + s).slice(-3);
}

function reciter() {
  return RECITERS.filter((r) => r.k === state.reciter)[0] || RECITERS[0];
}

/** 'surah:ayah' → a recitation URL. Quran only. */
function ayahUrl(key) {
  const parts = String(key).split(':');
  const r = reciter();
  return (usingMirror ? r.alt : r.base) + pad3(parts[0]) + pad3(parts[1]) + '.mp3';
}

export function slug(text) {
  return String(text)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Stable id for a dua row, derived from its English title. */
export function duaAudioId(dua) {
  return 'dua:' + slug(dua.t);
}

export function vocabAudioId(word) {
  return 'vocab:' + slug(word.tl);
}

/** Local (non-Quran) id → path, honouring a school-specific recording. */
function localUrl(id) {
  if (id.indexOf('vocab:') === 0) {
    return AUDIO_BASE + VOCAB_AUDIO_DIR + id.slice(6) + '.mp3';
  }
  const entry = AUDIO_MAP[id];
  if (!entry) return null;
  const variant = entry.variants && entry.variants[currentKey()];
  return AUDIO_BASE + (variant || entry.file);
}

/* ---- the player --------------------------------------------------------- */

function ensurePlayer() {
  if (player) return player;
  player = new Audio();
  player.preload = 'none';

  player.addEventListener('playing', () => {
    clearTimeout(timeoutHandle);
    setAudio({ status: 'playing' });
    paintButtons();
  });

  player.addEventListener('ended', () => {
    queueIndex += 1;
    if (queueIndex < queue.length) {
      playCurrent();
      return;
    }
    stop();
  });

  player.addEventListener('error', () => handleFailure());

  return player;
}

function playCurrent() {
  const mySequence = ++sequence;
  const a = ensurePlayer();
  const item = queue[queueIndex];
  const url = item.kind === 'quran' ? ayahUrl(item.key) : localUrl(item.key);

  if (!url) { handleFailure(); return; }

  setAudio({ status: 'loading' });
  paintButtons();

  clearTimeout(timeoutHandle);
  timeoutHandle = window.setTimeout(() => {
    if (mySequence === sequence && state.audio.status === 'loading') handleFailure();
  }, LOAD_TIMEOUT_MS);

  a.src = url;
  const attempt = a.play();
  if (attempt && typeof attempt.catch === 'function') {
    attempt.catch(() => {
      if (mySequence === sequence) handleFailure();
    });
  }
}

/**
 * One quiet retry on the mirror for Quran audio, then a visible failure.
 * Local files get no retry — a missing file will not appear on a second try.
 */
function handleFailure() {
  clearTimeout(timeoutHandle);
  if (activeId === null) return;   // a late event from an already-reset load
  const item = queue[queueIndex];
  if (item && item.kind === 'quran' && !usingMirror) {
    usingMirror = true;
    playCurrent();
    return;
  }
  const failedId = activeId;
  const wasQuran = !!(item && item.kind === 'quran');
  resetPlayer();
  setAudio({ playingId: null, status: 'error' });
  paintButtons(failedId);
  const message = wasQuran ? t('aud_recerr') : t('aud_missing');
  showError(failedId, message);
  announce(message);
}

function resetPlayer() {
  if (player) { try { player.pause(); } catch (e) { /* already stopped */ } }
  queue = [];
  queueIndex = 0;
  activeId = null;
  sequence += 1;
  clearTimeout(timeoutHandle);
}

/** Stop whatever is playing and clear every button back to idle. */
export function stop() {
  resetPlayer();
  setAudio({ playingId: null, status: 'idle' });
  paintButtons();
}

/**
 * Toggle a clip. Tapping the clip that is already playing stops it; tapping a
 * different one replaces it. Both paths go through the same reset, so a burst
 * of taps can only ever leave one clip active.
 */
export function toggle(id, kind, keys) {
  if (activeId === id) { stop(); return; }
  resetPlayer();
  clearError();

  activeId = id;
  usingMirror = false;
  queue = (kind === 'quran' ? keys : [id]).map((k) => ({ kind, key: k }));
  queueIndex = 0;

  setAudio({ playingId: id, status: 'loading' });
  playCurrent();
}

/* ---- buttons ------------------------------------------------------------ */

const ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
  '<polygon class="ply" points="8,5 19,12 8,19"/>' +
  '<rect class="stp" x="7" y="6" width="4" height="12" rx="1"/>' +
  '<rect class="stp" x="13" y="6" width="4" height="12" rx="1"/>' +
  '<circle class="ldg" cx="12" cy="12" r="7"/></svg>';

/**
 * Markup for one play control.
 *   kind 'quran' → keys is an array of 'surah:ayah'
 *   kind 'local' → the id itself resolves through data/audio-map.js
 * Returns '' when nothing could ever play, so no dead control is rendered.
 */
export function playButton(id, kind, keys, opts) {
  const options = opts || {};
  if (kind === 'quran' && (!keys || !keys.length)) return '';
  if (kind === 'local' && !localUrl(id)) return '';

  const label = options.label || (kind === 'quran' ? t('aud_playrec') : t('aud_play'));
  return '<button class="playb' + (options.small ? ' sm' : '') + '" type="button"' +
    ' data-audio-id="' + esc(id) + '"' +
    ' data-audio-kind="' + esc(kind) + '"' +
    (kind === 'quran' ? ' data-audio-keys="' + esc(keys.join(',')) + '"' : '') +
    ' aria-label="' + esc(label) + '" aria-pressed="false">' + ICON + '</button>';
}

/** Repaint every button from player state without touching the surrounding DOM. */
export function paintButtons(failedId) {
  qsa('.playb').forEach((b) => {
    const id = b.dataset.audioId;
    const isActive = id === state.audio.playingId;
    const loading = isActive && state.audio.status === 'loading';
    b.classList.toggle('on', isActive && state.audio.status === 'playing');
    b.classList.toggle('loading', loading);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    if (failedId && id === failedId) b.setAttribute('data-failed', '1');
    else if (!isActive) b.removeAttribute('data-failed');
    b.setAttribute('aria-label',
      loading ? t('aud_loading') : (isActive ? t('aud_stop')
        : (b.dataset.audioKind === 'quran' ? t('aud_playrec') : t('aud_play'))));
  });
}

/* ---- inline, non-blocking error message --------------------------------- */

/* Attribute-selector escaping without relying on CSS.escape, which is absent
   from some older Android WebViews. */
function findButton(id) {
  return qsa('.playb').filter((b) => b.dataset.audioId === id)[0] || null;
}

function showError(id, message) {
  const button = id ? findButton(id) : null;
  const host = (button && button.closest('.card, .vrow, .word, .rk')) || null;
  clearError();
  const note = document.createElement('p');
  note.className = 'auderr';
  note.id = 'audioErr';
  note.setAttribute('role', 'status');
  note.textContent = message;
  if (host) host.appendChild(note);
}

function clearError() {
  const existing = document.getElementById('audioErr');
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
}

/** The reciter chooser above the surahs. Quran audio only. */
export function reciterSwitch(note) {
  return '<div class="recsw"><span class="k">' + esc(t('reciter')) + '</span>' +
    '<div class="recrow" role="group" aria-label="' + esc(t('reciter')) + '">' +
    RECITERS.map((r) => (
      '<button type="button" class="rec' + (r.k === state.reciter ? ' on' : '') +
      '" data-rec="' + esc(r.k) + '" aria-pressed="' + (r.k === state.reciter) + '">' +
      esc(r.n) + '<i>' + esc(state.language === 'id' ? r.sub[1] : r.sub[0]) + '</i></button>'
    )).join('') + '</div>' +
    '<p class="recn">' + esc(note) + '</p></div>';
}
