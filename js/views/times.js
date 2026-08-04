/* Prayer times.

   Sits beside the qibla compass and shares its location. Everything on this
   card is computed on the device (js/prayer-times.js) — there is no request to
   any prayer-time service, so it works offline and no coordinates are sent
   anywhere. Sunrise is shown because it is what ends the Subuh window, and is
   labelled so it is never mistaken for a sixth prayer. */

import { PRAYERS } from '../../data/prayers.js';
import { state, setRememberLocation } from '../state.js';
import { P, t, pickLang } from '../i18n.js';
import { $, esc, setHTML, delegate, announce } from '../dom.js';
import { formatClock, minutesBetween, formatDuration } from '../dates.js';
import * as Location from '../location.js';
import * as PrayerTimes from '../prayer-times.js';
import { icon } from '../icons.js';

const ORDER = [
  { id: 'subuh', obligatory: true },
  { id: 'sunrise', obligatory: false },
  { id: 'dzuhur', obligatory: true },
  { id: 'ashar', obligatory: true },
  { id: 'maghrib', obligatory: true },
  { id: 'isya', obligatory: true }
];

function label(id) {
  if (id === 'sunrise') return t('pt_sunrise');
  const p = PRAYERS.filter((x) => x.id === id)[0];
  return p ? P(p.nameEn || p.name, p.name, p.nko || p.name) : id;
}

function askPanel(leadError) {
  const message = leadError || Location.statusMessage();
  const busy = state.locationStatus === 'locating';
  return '<div class="ptimes empty srch">' +
    '<p class="k">' + esc(t('pt_h')) + '</p>' +
    '<p class="pt-why">' + esc(t('pt_why')) + '</p>' +
    (message ? '<p class="pt-err" role="status">' + esc(message) + '</p>' : '') +
    '<button class="qbtn" type="button" data-locate="1"' + (busy ? ' disabled' : '') + '>' +
    icon('location') + ' ' + esc(busy ? t('pt_locating') : t('pt_use')) + '</button>' +
    '<p class="st">' + esc(t('pt_or_city')) + ' ' +
    Location.CITIES.map((c, i) => (
      '<button type="button" class="linkish" data-city="' + i + '">' + esc(c.n) + '</button>'
    )).join(' · ') + '</p></div>';
}

export function renderTimes() {
  const host = $('timesPanel');
  if (!host) return;

  if (!state.location) { setHTML(host, askPanel()); return; }

  if (PrayerTimes.isStale()) PrayerTimes.refresh();
  const pt = state.prayerTimes;
  if (!pt) {
    /* Location known but the computation failed — legitimately possible at
       polar latitudes. Offer the recovery actions rather than a dead card. */
    setHTML(host, askPanel(t('pt_unavailable')));
    return;
  }

  /* Times for a city the user picked are read on that city's clock, not the
     device's. A device fix has no zone and correctly uses the device clock. */
  const zone = pt.zone;

  const next = PrayerTimes.nextPrayer(pt, state.location, new Date());
  const rows = ORDER.map((entry) => {
    const when = pt.times[entry.id];
    const isNext = !!(next && !next.tomorrow && next.id === entry.id);
    return '<div class="ptrow' + (isNext ? ' next' : '') + (entry.obligatory ? '' : ' minor') + '">' +
      '<span class="ptn">' + esc(label(entry.id)) + '</span>' +
      '<span class="ptt">' + esc(formatClock(when, zone)) + '</span></div>';
  }).join('');

  let nextBlock = '';
  if (next && next.at) {
    const mins = minutesBetween(new Date(), next.at);
    nextBlock = '<div class="ptnext" role="status">' +
      '<span class="k">' + esc(t('pt_next')) + '</span>' +
      '<b>' + esc(label(next.id)) + (next.tomorrow ? ' · ' + esc(t('pt_tomorrow')) : '') + '</b>' +
      '<span class="ptnext-t">' + esc(formatClock(next.at, zone)) + ' · ' +
      esc(t('pt_in')) + ' ' + esc(formatDuration(mins, state.language)) + '</span></div>';
  }

  const method = PrayerTimes.METHODS[pt.methodKey];
  const asrNote = pt.asr === 'hanafi' ? ' · ' + esc(t('set_asr_hanafi')) : '';

  setHTML(host,
    '<div class="ptimes srch">' +
      '<div class="pthead">' +
        '<p class="ptloc">' + icon('location') + ' ' + esc(Location.locationLabel()) + '</p>' +
        '<button class="iconbtn" type="button" data-locate="1" aria-label="' + esc(t('pt_refresh')) + '">' +
        icon('clock') + '</button>' +
      '</div>' +
      nextBlock +
      '<div class="ptlist">' + rows + '</div>' +
      '<p class="ptmeta">' + esc(t('pt_method')) + ': ' + esc(pickLang(method.label)) + asrNote + '</p>' +
      (zone ? '<p class="ptmeta">' + esc(t('pt_zone')) + ': ' + esc(zone) + '</p>' : '') +
      (pt.ihtiyati ? '<p class="ptmeta">' + esc(t('pt_ihtiyati')) + ': +' + pt.ihtiyati + ' ' +
        esc(t('pt_minutes')) + '</p>' : '') +
      (pt.estimated ? '<p class="ptmeta warn">' + esc(t('pt_polar')) + '</p>' : '') +
      '<p class="ptmeta">' + esc(t('pt_approx')) + '</p>' +
      '<label class="switch"><input type="checkbox" data-remember="1"' +
        (state.rememberLocation ? ' checked' : '') + '>' +
        '<span>' + esc(t('pt_remember')) + '</span></label>' +
      '<p class="ptmeta small">' + esc(t('pt_remember_note')) + '</p>' +
      '<p class="ptmeta small">' + esc(t('pt_sunrise_note')) + '</p>' +
    '</div>');
}

/**
 * One place asks for a position, and both the qibla and the times redraw from
 * it. `onLocated` is supplied by app.js so this view does not import the
 * renderer of another view.
 */
export function bindTimes(onLocated) {
  const host = $('timesPanel');

  delegate(host, '[data-locate]', 'click', () => {
    Location.request().then((loc) => {
      if (loc) {
        PrayerTimes.refresh();
        announce(t('pt_h') + ' — ' + Location.locationLabel());
      }
      if (onLocated) onLocated();
    });
    if (onLocated) onLocated();
  });

  delegate(host, '[data-city]', 'click', (e, el) => {
    Location.useCity(Number(el.dataset.city));
    PrayerTimes.refresh();
    if (onLocated) onLocated();
  });

  delegate(host, '[data-remember]', 'change', (e, el) => {
    setRememberLocation(el.checked);
  });
}

/**
 * Called every 30 s by app.js. Re-renders only when what is on screen can have
 * changed — the countdown minute ticking over, or the date rolling — so the
 * interval cannot interrupt a tap on the card's controls twice a minute.
 */
let lastTickKey = '';
export function tickTimes() {
  if (!state.location) return;
  if (PrayerTimes.isStale()) PrayerTimes.refresh();
  const pt = state.prayerTimes;
  const next = pt ? PrayerTimes.nextPrayer(pt, state.location, new Date()) : null;
  const key = (pt ? pt.dateKey : 'none') + '|' +
    (next ? next.id + ':' + minutesBetween(new Date(), next.at) : 'none');
  if (key === lastTickKey) return;
  lastTickKey = key;
  renderTimes();
}
