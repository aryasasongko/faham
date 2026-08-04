/* Today: one encouragement, one practice suggestion, one verse, one word, one
   dua and one story, rotating on the local calendar day. Nothing here is
   random — the same day gives the same card, so a person can talk about "the
   word today" with someone else. */

import { PROMPTS, ENCOURAGE } from '../../data/today.js';
import { VOCAB } from '../../data/vocab.js';
import { STORIES } from '../../data/stories.js';
import { SURAHS } from '../../data/surahs.js';
import { DUAS } from '../../data/duas.js';
import { P, pairBlock } from '../i18n.js';
import { state } from '../state.js';
import { languageNotice } from './common.js';
import { t } from '../i18n.js';
import { PRAYERS } from '../../data/prayers.js';
import { currentPrayer } from '../prayer-times.js';
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

  /* One button that answers the only question a beginner has in the moment:
     how do I pray the one coming up. It opens the walkthrough already set to
     that prayer, so Today is a way in rather than a reading page. */
  let nowId = null;
  try { nowId = currentPrayer(state.prayerTimes, new Date()); } catch (e) { nowId = null; }
  if (!nowId) {
    const h = new Date().getHours();
    nowId = h < 5 ? 'subuh' : h < 12 ? 'dzuhur' : h < 16 ? 'ashar' : h < 18 ? 'maghrib' : 'isya';
  }
  const nowPrayer = PRAYERS.filter((x) => x.id === nowId)[0];
  const prayName = nowPrayer
    ? (state.language === 'ko' && nowPrayer.nko ? nowPrayer.nko : nowPrayer.name)
    : '';
  const prayNow = nowPrayer
    ? '<a class="praynow" href="#/prayer" data-pray-now="' + esc(nowId) + '">' +
        '<span class="pn-t">' + esc(t('pray_now')) + ' · ' + esc(prayName) + '</span>' +
        '<span class="pn-s">' + esc(t('pray_now_sub')) + '</span></a>'
    : '';

  setHTML($('todayPanel'),
    languageNotice() + prayNow +
    '<div class="today srch">' +
      '<p class="date">' + esc(dateStr) + '</p>' +
      '<p class="enc">' + esc(P(enc[0], enc[1], enc[2])) + '</p>' + pairBlock(esc(enc[0]), esc(enc[1])) +
      '<div class="today-grid">' +
        cell(P('Try this today', 'Coba hari ini', '오늘 해 볼 것'),
          '<p>' + esc(P(prompt[0], prompt[1], prompt[2])) + '</p>' + pairBlock(esc(prompt[0]), esc(prompt[1]))) +
        cell(P('A verse', 'Satu ayat', '한 구절'),
          '<p class="ar" lang="ar" dir="rtl">' + pick.v.ar + '</p>' +
          '<p class="tl small">' + esc(pick.v.tl) + '</p>' +
          '<p>' + esc(P(pick.v.en, pick.v.id, pick.v.ko)) + '</p>' +
          '<p class="src">' + esc(pick.s.name) + '</p>' + pairBlock(esc(pick.v.en), esc(pick.v.id))) +
        cell(P('A word', 'Satu kata', '한 단어'),
          '<p class="ar" lang="ar" dir="rtl">' + word.ar + '</p>' +
          '<p class="lead-t">' + esc(word.tl) + ' — ' + esc(P(word.en, word.id, word.ko)) + '</p>' +
          '<p>' + esc(P(word.noteen, word.note, word.noteko)) + '</p>' + pairBlock(esc(word.noteen), esc(word.note))) +
        cell(P('A dua for today', 'Doa untuk hari ini', '오늘의 두아'),
          '<p class="lead-t">' + esc(P(dua.t, dua.tid, dua.tko)) + '</p>' +
          '<p class="tl small">' + esc(dua.tl) + '</p>' +
          '<p>' + esc(P(dua.en, dua.id, dua.enko)) + '</p>' + pairBlock(esc(dua.en), esc(dua.id))) +
        cell(P('If you have ten minutes', 'Kalau punya sepuluh menit', '10분이 있다면'),
          '<p class="lead-t">' + esc(P(story.t, story.tid, story.tko)) + ' · ' + esc(P(story.mins, story.minsid, story.minsko)) + '</p>' +
          '<p>' + esc(P(story.hook, story.hookid, story.hookko)) + '</p>' + pairBlock(esc(story.hook), esc(story.hookid))) +
      '</div>' +
    '</div>');
}
