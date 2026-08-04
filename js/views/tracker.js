/* The habit dashboard.

   Design intent: calm, not gamified. No accounts, no leaderboards, no
   guilt-shaped copy. An unfinished day is shown as unfinished and nothing more;
   the only positive reinforcement is a quiet count and, when it exists, a
   streak. Everything is on-device — see js/tracker.js.

   Accessibility: each prayer is a real <button> with aria-pressed, the ring
   carries its own textual label, and toggling announces the result rather than
   relying on the tick mark alone. */

import { PRAYERS } from '../../data/prayers.js';
import * as Tracker from '../tracker.js';
import { state } from '../state.js';
import { P, t } from '../i18n.js';
import { $, esc, setHTML, delegate, announce, tick } from '../dom.js';
import { todayKey, formatLongDate, formatWeekdayShort } from '../dates.js';
import { icon } from '../icons.js';

function prayerLabel(id) {
  const p = PRAYERS.filter((x) => x.id === id)[0];
  if (!p) return id;
  return P(p.nameEn || p.name, p.name, p.nko || p.name);
}

/* A five-segment ring. CSS and one SVG circle rather than a chart library. */
function progressRing(done, total) {
  const R = 26;
  const C = 2 * Math.PI * R;
  const filled = total ? (done / total) * C : 0;
  return '<svg class="ring" viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
    '<circle class="ring-bg" cx="32" cy="32" r="' + R + '"/>' +
    '<circle class="ring-fg" cx="32" cy="32" r="' + R +
    '" stroke-dasharray="' + filled.toFixed(1) + ' ' + C.toFixed(1) + '"/>' +
    '<text class="ring-n" x="32" y="37" text-anchor="middle">' + done + '</text></svg>';
}

function dayDot(entry) {
  const level = entry.complete ? 'full' : (entry.count > 0 ? 'part' : 'none');
  const label = formatWeekdayShort(entry.date, state.language);
  return '<div class="dday">' +
    '<span class="ddot ' + level + '" style="--fill:' + (entry.count / 5) + '"></span>' +
    '<span class="dlab">' + esc(label.slice(0, 2)) + '</span>' +
    '<span class="dnum">' + entry.date.getDate() + '</span></div>';
}

export function renderTracker(now) {
  const host = $('trackerPanel');
  if (!host) return;

  const key = todayKey();
  const done = Tracker.countFor(key);
  const total = Tracker.TRACKED.length;
  const streak = Tracker.currentStreak();

  const rows = Tracker.TRACKED.map((id) => {
    const logged = Tracker.isLogged(id, key);
    return '<button type="button" class="prow-btn' + (logged ? ' on' : '') + '"' +
      ' data-prayer-toggle="' + esc(id) + '" aria-pressed="' + (logged ? 'true' : 'false') + '">' +
      '<span class="pname">' + esc(prayerLabel(id)) + '</span>' +
      '<span class="pmark" aria-hidden="true">' + (logged ? icon('check') : '') + '</span>' +
      '<span class="sr-only">' + esc(logged ? t('tr_done') : t('tr_notdone')) + '</span>' +
      '</button>';
  }).join('');

  const week = Tracker.history(7).map(dayDot).join('');

  /* 'tr_streak' is a suffix in both languages ('-day streak' / ' hari
     berturut-turut'), so one concatenation covers them. */
  let streakLine = t('tr_streak_none');
  if (streak === 1) streakLine = t('tr_streak_one');
  else if (streak > 1) streakLine = streak + t('tr_streak');

  setHTML(host,
    '<div class="track srch">' +
      '<div class="track-top">' +
        progressRing(done, total) +
        '<div class="track-h">' +
          '<p class="date">' + esc(formatLongDate(now || new Date(), state.language)) + '</p>' +
          '<p class="count" aria-label="' + esc(done + ' ' + t('tr_of') + ' ' + total + ' ' + t('tr_prayers')) + '">' +
            done + ' ' + esc(t('tr_of')) + ' ' + total + ' ' + esc(t('tr_prayers')) + '</p>' +
          '<p class="streak">' + esc(done === total ? t('tr_complete') + ' ' + streakLine : streakLine) + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="prows">' + rows + '</div>' +
      '<p class="track-hint">' + esc(t('tr_tap')) + '</p>' +
      '<div class="track-week">' +
        '<p class="k">' + esc(t('tr_week')) + '</p>' +
        '<div class="dstrip">' + week + '</div>' +
      '</div>' +
      '<p class="track-private">' + esc(t('tr_private')) + '</p>' +
    '</div>');
}

export function bindTracker() {
  delegate($('trackerPanel'), '[data-prayer-toggle]', 'click', (e, el) => {
    const id = el.dataset.prayerToggle;
    const nowLogged = Tracker.toggle(id);
    tick(nowLogged ? 10 : [4, 30, 4]);
    announce(prayerLabel(id) + ' — ' + (nowLogged ? t('tr_done') : t('tr_notdone')));
  });
}
