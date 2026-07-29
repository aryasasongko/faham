/* Today: one encouragement, one practice suggestion, one verse, one word, one
   dua and one story, rotating on the local calendar day. Nothing here is
   random — the same day gives the same card, so a person can talk about "the
   word today" with someone else. */

import { PROMPTS, ENCOURAGE } from '../../data/today.js';
import { VOCAB } from '../../data/vocab.js';
import { STORIES } from '../../data/stories.js';
import { SURAHS } from '../../data/surahs.js';
import { DUAS } from '../../data/duas.js';
import { P, idBlock } from '../i18n.js';
import { state } from '../state.js';
import { $, esc, setHTML } from '../dom.js';
import { formatLongDate } from '../dates.js';

/** Days since the epoch, rolling over at LOCAL midnight. */
function dayIndex(now) {
  const d = now || new Date();
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
}

function cell(label, body) {
  return '<div class="tcell"><span class="k">' + esc(label) + '</span>' + body + '</div>';
}

export function renderToday(now) {
  const n = dayIndex(now);
  const enc = ENCOURAGE[n % ENCOURAGE.length];
  const prompt = PROMPTS[n % PROMPTS.length];
  const word = VOCAB[n % VOCAB.length];
  const story = STORIES[n % STORIES.length];
  const dua = DUAS[n % DUAS.length];

  const flat = [];
  SURAHS.forEach((su) => su.v.forEach((v) => flat.push({ s: su, v })));
  const pick = flat[n % flat.length];

  const dateStr = formatLongDate(now || new Date(), state.language);

  setHTML($('todayPanel'),
    '<div class="today srch">' +
      '<p class="date">' + esc(dateStr) + '</p>' +
      '<p class="enc">' + esc(P(enc[0], enc[1])) + '</p>' + idBlock(esc(enc[1])) +
      '<div class="today-grid">' +
        cell(P('Try this today', 'Coba hari ini'),
          '<p>' + esc(P(prompt[0], prompt[1])) + '</p>' + idBlock(esc(prompt[1]))) +
        cell(P('A verse', 'Satu ayat'),
          '<p class="ar" lang="ar" dir="rtl">' + pick.v.ar + '</p>' +
          '<p class="tl small">' + esc(pick.v.tl) + '</p>' +
          '<p>' + esc(P(pick.v.en, pick.v.id)) + '</p>' +
          '<p class="src">' + esc(pick.s.name) + '</p>' + idBlock(esc(pick.v.id))) +
        cell(P('A word', 'Satu kata'),
          '<p class="ar" lang="ar" dir="rtl">' + word.ar + '</p>' +
          '<p class="lead-t">' + esc(word.tl) + ' — ' + esc(P(word.en, word.id)) + '</p>' +
          '<p>' + esc(P(word.noteen, word.note)) + '</p>' + idBlock(esc(word.note))) +
        cell(P('A dua for today', 'Doa untuk hari ini'),
          '<p class="lead-t">' + esc(P(dua.t, dua.tid)) + '</p>' +
          '<p class="tl small">' + esc(dua.tl) + '</p>' +
          '<p>' + esc(P(dua.en, dua.id)) + '</p>' + idBlock(esc(dua.id))) +
        cell(P('If you have ten minutes', 'Kalau punya sepuluh menit'),
          '<p class="lead-t">' + esc(P(story.t, story.tid)) + ' · ' + esc(P(story.mins, story.minsid)) + '</p>' +
          '<p>' + esc(P(story.hook, story.hookid)) + '</p>' + idBlock(esc(story.hookid))) +
      '</div>' +
    '</div>');
}
