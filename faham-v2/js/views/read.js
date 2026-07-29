/* The Read view: framing pieces, the Islam essays, the stories, the surahs and
   the vocabulary. All of these are content-only sections — they do not vary by
   school, so nothing here consults MadhhabService. */

import { CONCEPTS } from '../../data/concepts.js';
import { ISLAM } from '../../data/islam.js';
import { STORIES } from '../../data/stories.js';
import { SURAHS } from '../../data/surahs.js';
import { VOCAB } from '../../data/vocab.js';
import { P, t, idBlock, isBoth } from '../i18n.js';
import { $, esc, setHTML, delegate } from '../dom.js';
import { deeper, whyNote, paragraphs } from './common.js';
import { playButton, reciterSwitch, vocabAudioId } from '../audio.js';

let openStoryIndex = null;

export function renderConcepts() {
  setHTML($('concepts'), CONCEPTS.map((c) => (
    '<div class="card srch"><div class="card-h"><h3>' + P(c.t, c.tid || c.t) + '</h3></div>' +
    '<p class="en" style="margin-top:9px">' + P(c.s, c.sid) + '</p>' + idBlock(c.sid) +
    deeper(c.l, c.lid) + '</div>'
  )).join(''));
}

export function renderIslam() {
  setHTML($('islamList'), ISLAM.map((c) => (
    '<div class="card srch"><div class="card-h"><h3>' + P(c.t, c.tid) + '</h3></div>' +
    '<p class="isl-sub">' + P(c.sub, c.subid) + '</p>' +
    '<p class="en" style="margin-top:11px">' + P(c.s, c.sid) + '</p>' + idBlock(c.sid) +
    deeper(c.l, c.lid) + '</div>'
  )).join(''));
}

/* ---- stories ------------------------------------------------------------ */

export function renderStories() {
  setHTML($('storyIndex'), STORIES.map((s, i) => (
    '<button type="button" class="story-row srch" data-story="' + i + '">' +
    '<span class="mins">' + esc(P(s.mins, s.minsid)) + '</span>' +
    '<span class="st"><span class="story-h">' + P(s.t, s.tid) + '</span>' +
    '<span class="story-p">' + P(s.hook, s.hookid) + '</span>' +
    '<span class="ref">' + P(s.ref, s.refid) + '</span></span></button>'
  )).join(''));
  if (openStoryIndex !== null) openStory(openStoryIndex);
}

export function openStory(i) {
  const s = STORIES[i];
  if (!s) return;
  openStoryIndex = i;

  const source = P(s.p, s.pid);
  const prose = source.map((par, k) => '<p' + (k === 0 ? ' class="lead"' : '') + '>' + par + '</p>').join('');
  const verses = s.v.map((v) => (
    '<div class="anchor"><span class="lbl">' + esc(t('quran')) + '</span>' +
    '<p class="vref">' + esc(v.ref) + '</p>' +
    '<p class="ar" lang="ar" dir="rtl">' + v.ar + '</p><p class="tl">' + v.tl + '</p>' +
    '<p class="en">' + P(v.en, v.id) + '</p>' + idBlock(v.id) + '</div>'
  )).join('');

  const reader = $('reader');
  setHTML(reader,
    '<button class="back" type="button" data-story-back="1">' + esc(t('back')) + '</button>' +
    '<article class="read"><h3>' + P(s.t, s.tid) + '</h3>' +
    '<p class="meta">' + esc(P(s.mins, s.minsid)) + ' · ' + esc(P(s.ref, s.refid)) + '</p>' +
    '<div class="prose">' + prose + '</div>' +
    idBlock(paragraphs(s.pid), true) + verses +
    whyNote('howtold', s.why, s.whyid) + '</article>');

  $('storyIndex').classList.add('hidden');
  reader.classList.remove('hidden');
  const section = $('stories');
  if (section) section.scrollIntoView();
}

export function closeStory() {
  openStoryIndex = null;
  const reader = $('reader');
  reader.classList.add('hidden');
  setHTML(reader, '');
  $('storyIndex').classList.remove('hidden');
  const section = $('stories');
  if (section) section.scrollIntoView();
}

/* ---- surahs ------------------------------------------------------------- */

const RECITER_NOTE = [
  'Streams the first time, then plays offline. Recitation audio appears only here, where each line on screen is a complete verse and what you hear matches what you read. The verses quoted inside the stories are excerpts of longer verses, so a recording would play words that are not in front of you — those stay silent.',
  'Distreaming saat pertama kali, lalu bisa diputar offline. Audio bacaan hanya ada di sini, karena tiap baris di layar adalah ayat utuh dan yang kamu dengar sama dengan yang kamu baca. Ayat yang dikutip di dalam kisah hanyalah penggalan dari ayat yang lebih panjang, sehingga rekamannya akan memperdengarkan kata-kata yang tidak ada di hadapanmu — bagian itu dibiarkan tanpa suara.'
];

export function renderSurahs() {
  const html = reciterSwitch(P(RECITER_NOTE[0], RECITER_NOTE[1])) + SURAHS.map((s) => {
    const verses = s.v.map((v, i) => {
      const id = 's' + s.no + '-' + (i + 1);
      return '<div class="vrow">' +
        '<div class="vhead">' + playButton(id, 'quran', [s.no + ':' + (i + 1)], { small: true }) +
        '<span class="vno">' + (i + 1) + '</span></div>' +
        '<p class="ar" lang="ar" dir="rtl">' + v.ar + '</p><p class="tl">' + v.tl + '</p>' +
        '<p class="en">' + P(v.en, v.id) + '</p>' + idBlock(v.id) + '</div>';
    }).join('');

    return '<div class="card srch"><div class="card-h"><h3>' + esc(s.name) + '</h3>' +
      '<span class="pos">' + esc(P(s.meta, s.metaid)) + '</span></div>' +
      '<p class="en" style="margin-top:7px">' + P(s.intro, s.introid) + '</p>' + idBlock(s.introid) +
      '<div class="vhead-all">' +
      playButton('surah' + s.no, 'quran', s.v.map((v, i) => s.no + ':' + (i + 1))) +
      '<span>' + esc(t('playWhole')) + '</span></div>' + verses +
      whyNote('doing', s.why, s.whyid) + '</div>';
  }).join('');
  setHTML($('surahs'), html);
}

/* ---- vocabulary --------------------------------------------------------- */

export function renderVocab() {
  setHTML($('vocabList'), VOCAB.map((v, i) => {
    const audio = playButton(vocabAudioId(v), 'local', null, { small: true });
    return '<div class="word srch" data-word="' + i + '">' +
      '<button type="button" class="word-main" aria-expanded="false">' +
      '<span class="w-ar" lang="ar" dir="rtl">' + v.ar + '</span>' +
      '<span class="w-b"><span class="w-tl">' + esc(v.tl) + '</span>' +
      '<span class="w-en">' + esc(P(v.en, v.id)) + '</span>' +
      (isBoth() ? '<span class="w-id">' + esc(v.id) + '</span>' : '') +
      '<span class="w-note">' + esc(P(v.noteen, v.note)) + '</span></span></button>' +
      (audio ? '<span class="w-audio">' + audio + '</span>' : '') + '</div>';
  }).join(''));
}

/** Wired once at start-up; the lists themselves are replaced on every render. */
export function bindRead() {
  delegate($('storyIndex'), '[data-story]', 'click', (e, el) => {
    openStory(Number(el.dataset.story));
  });
  delegate($('reader'), '[data-story-back]', 'click', () => closeStory());
  delegate($('vocabList'), '.word-main', 'click', (e, el) => {
    const word = el.closest('.word');
    const open = word.classList.toggle('open');
    el.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}
