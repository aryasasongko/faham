/* The qibla compass.

   Two layers, deliberately separated:
     * a static shell (dial, bearing, distance) re-rendered only when the state
       or the language changes;
     * a live layer that touches two SVG transforms and one line of text on each
       compass reading, so a 60 Hz sensor never rebuilds the DOM.

   The position comes from LocationService, shared with prayer times. The
   motion permission is asked for separately, on its own button, because it is a
   separate grant and refusing it must still leave a usable static bearing. */

import { state } from '../state.js';
import { P, t } from '../i18n.js';
import { $, esc, setHTML, delegate } from '../dom.js';
import * as Location from '../location.js';
import * as Qibla from '../qibla.js';
import { icon } from '../icons.js';

let bearing = null;
let distance = null;

function recompute() {
  const loc = state.location;
  if (!loc) { bearing = null; distance = null; return; }
  bearing = Qibla.bearingTo(loc.lat, loc.lng);
  distance = Qibla.distanceKm(loc.lat, loc.lng);
}

function dialSVG() {
  let ring = '';
  for (let i = 0; i < 72; i++) {
    const a = (i * 5 * Math.PI) / 180;
    const long = i % 9 === 0;
    const r1 = long ? 86 : 92;
    const r2 = 100;
    ring += '<line class="tick" x1="' + (120 + r1 * Math.sin(a)).toFixed(1) +
      '" y1="' + (120 - r1 * Math.cos(a)).toFixed(1) +
      '" x2="' + (120 + r2 * Math.sin(a)).toFixed(1) +
      '" y2="' + (120 - r2 * Math.cos(a)).toFixed(1) +
      '" opacity="' + (long ? 1 : 0.45) + '"/>';
  }
  const cards = P(['N', 'E', 'S', 'W'], ['U', 'T', 'S', 'B']);
  const cardEls = cards.map((c, i) => {
    const a = (i * 90 * Math.PI) / 180;
    const rr = 72;
    return '<text class="card' + (i === 0 ? ' n' : '') + '" x="' + (120 + rr * Math.sin(a)).toFixed(1) +
      '" y="' + (120 - rr * Math.cos(a) + 5).toFixed(1) + '" text-anchor="middle">' + c + '</text>';
  }).join('');

  return '<svg class="dial" id="qDial" viewBox="0 0 240 240" role="img" aria-label="' +
    esc(P('Qibla compass', 'Kompas kiblat')) + '">' +
    '<circle class="ring" cx="120" cy="120" r="100"/>' +
    '<g id="qRing">' + ring + cardEls + '</g>' +
    '<g id="qNeedle" style="display:none">' +
      '<polygon class="needle" points="120,26 133,120 120,104 107,120"/>' +
      '<polygon class="needle-tail" points="120,214 107,120 120,136 133,120"/>' +
      '<rect class="kaaba" x="112" y="10" width="16" height="16" rx="2.5"/>' +
    '</g>' +
    '<circle cx="120" cy="120" r="6" fill="var(--surface)" stroke="var(--rule)" stroke-width="2"/>' +
    '</svg>';
}

const CAUTION = [
  'Phone compasses are thrown off by metal, cases, cars and poor calibration, and can be wrong by tens of degrees. If the needle drifts, move away from your laptop and wave the phone in a figure of eight to recalibrate. In a mosque, follow the rows. At home, being roughly right is accepted — scholars have long held that facing the general direction suffices when certainty is not available.',
  'Kompas ponsel mudah terganggu logam, casing, mobil, dan kalibrasi yang buruk, dan bisa meleset puluhan derajat. Kalau jarumnya bergeser-geser, menjauhlah dari laptop dan gerakkan ponsel membentuk angka delapan untuk mengkalibrasi ulang. Di masjid, ikuti saf. Di rumah, mendekati arah yang benar sudah diterima — para ulama sejak lama berpendapat menghadap ke arah umumnya mencukupi ketika kepastian tidak bisa diperoleh.'
];

export function renderQibla() {
  const host = $('qiblaPanel');
  if (!host) return;
  recompute();

  let body = '<div class="qib">' + dialSVG();

  if (bearing === null) {
    const message = Location.statusMessage();
    body += '<p class="sub">' + esc(message || t('pt_why')) + '</p>' +
      '<button class="qbtn" type="button" data-locate-qibla="1">' + icon('location') + ' ' +
      esc(t('pt_use')) + '</button>' +
      '<p class="st">' + esc(t('pt_or_city')) + ' ' +
      Location.CITIES.map((c, i) => (
        '<button type="button" class="linkish" data-city-qibla="' + i + '">' + esc(c.n) + '</button>'
      )).join(' · ') + '</p>';
  } else {
    body += '<p class="big">' + bearing.toFixed(0) + '°</p>' +
      '<p class="sub">' + esc(P('from north — roughly ', 'dari utara — kira-kira ke arah ')) +
      esc(Qibla.compassPoint(bearing)) + '. ' +
      esc(P('Mecca is about ', 'Mekah berjarak sekitar ')) + esc(distance.toLocaleString()) + ' km' +
      esc(P(' away', '')) + '.' +
      (state.location.label ? ' <span class="muted">(' + esc(state.location.label) + ')</span>' : '') + '</p>' +
      '<p class="qhint" id="qHint" role="status">' + esc(P('Waiting for the compass…', 'Menunggu kompas…')) + '</p>';
    if (Qibla.compass.status !== 'live') {
      body += '<button class="qbtn" type="button" data-compass="1">' +
        esc(P('Turn on the compass', 'Nyalakan kompas')) + '</button>';
    }
  }

  body += '</div><div class="callout" style="margin-top:14px"><b>' +
    esc(P('Treat this as an aid, not an authority', 'Anggap ini alat bantu, bukan penentu')) + '</b>' +
    '<span>' + esc(P(CAUTION[0], CAUTION[1])) + '</span></div>';

  setHTML(host, body);
  paintNeedle();
}

/** The live layer: two transforms and one sentence. No DOM is rebuilt here. */
export function paintNeedle(structuralChange) {
  if (structuralChange) { renderQibla(); return; }

  const needle = $('qNeedle');
  const ring = $('qRing');
  if (!needle || !ring) return;

  if (bearing === null) { needle.style.display = 'none'; return; }
  needle.style.display = '';

  const heading = Qibla.compass.heading;
  const rot = heading === null ? bearing : bearing - heading;
  needle.setAttribute('transform', 'rotate(' + rot.toFixed(1) + ' 120 120)');
  ring.setAttribute('transform', 'rotate(' + (heading === null ? 0 : -heading).toFixed(1) + ' 120 120)');

  const hint = $('qHint');
  if (!hint) return;

  if (heading === null) {
    hint.textContent = Qibla.compass.status === 'denied'
      ? P('Motion access was refused — the needle shows the bearing from north instead.',
          'Akses gerak ditolak — jarum menunjukkan arah dari utara saja.')
      : (Qibla.compass.status === 'none'
        ? P('No compass on this device — the needle shows the bearing from north instead.',
            'Tidak ada kompas di perangkat ini — jarum menunjukkan arah dari utara saja.')
        : P('No compass reading yet — the needle shows the bearing from north. Line it up with a compass, or match the rows in your mosque.',
            'Belum ada pembacaan kompas — jarum menunjukkan arah dari utara. Sesuaikan dengan kompas, atau ikuti saf di masjidmu.'));
    hint.className = 'qhint';
    return;
  }

  const delta = ((bearing - heading + 540) % 360) - 180;   // −180…180, + means turn right
  if (Math.abs(delta) <= 5) {
    hint.textContent = P('Facing the qibla.', 'Sudah menghadap kiblat.');
    hint.className = 'qhint ok';
  } else {
    const dir = delta > 0 ? P('right', 'ke kanan') : P('left', 'ke kiri');
    hint.textContent = P('Turn ', 'Putar ') + dir + ' ' + Math.round(Math.abs(delta)) + '°';
    hint.className = 'qhint';
  }
}

export function bindQibla(onLocated) {
  const host = $('qiblaPanel');

  delegate(host, '[data-locate-qibla]', 'click', () => {
    Location.request().then(() => {
      if (onLocated) onLocated();
      if (state.location) Qibla.startCompass(paintNeedle);
    });
    renderQibla();
  });

  delegate(host, '[data-city-qibla]', 'click', (e, el) => {
    Location.useCity(Number(el.dataset.cityQibla));
    if (onLocated) onLocated();
    Qibla.startCompass(paintNeedle);
  });

  delegate(host, '[data-compass]', 'click', () => {
    Qibla.startCompass(paintNeedle);
  });
}
