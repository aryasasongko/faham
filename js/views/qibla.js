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
  const cards = P(['N', 'E', 'S', 'W'], ['U', 'T', 'S', 'B'], ['북', '동', '남', '서']);
  const cardEls = cards.map((c, i) => {
    const a = (i * 90 * Math.PI) / 180;
    const rr = 72;
    return '<text class="card' + (i === 0 ? ' n' : '') + '" x="' + (120 + rr * Math.sin(a)).toFixed(1) +
      '" y="' + (120 - rr * Math.cos(a) + 5).toFixed(1) + '" text-anchor="middle">' + c + '</text>';
  }).join('');

  return '<svg class="dial" id="qDial" viewBox="0 0 240 240" role="img" aria-label="' +
    esc(P('Qibla compass', 'Kompas kiblat', '키블라 나침반')) + '">' +
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
  'Kompas ponsel gampang terganggu oleh logam, casing, mobil, dan kalibrasi yang meleset — selisihnya bisa sampai puluhan derajat. Kalau jarumnya goyang terus, menjauhlah dari laptop lalu gerakkan ponsel membentuk angka delapan untuk mengkalibrasi ulang. Di masjid, ikuti saf. Di rumah, kira-kira benar pun sudah cukup — sejak dulu para ulama berpendapat bahwa menghadap ke arah kiblat secara umum sudah memadai kalau kepastiannya memang tidak bisa didapat.',
  '휴대폰 나침반은 금속, 케이스, 자동차, 잘못된 보정에 쉽게 영향을 받아 수십 도까지 어긋날 수 있습니다. 바늘이 흔들리면 노트북에서 떨어져 휴대폰을 8자로 움직여 보정하세요. 마스지드에서는 줄을 따르세요. 집에서 혼자 드릴 때는 대략 맞으면 된다고 오래전부터 받아들여져 왔습니다. 확실히 알 수 없을 때는 대체로 그 방향을 향하는 것으로 충분하다는 것이 오랜 견해입니다.'
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
      '<p class="sub">' + esc(P('from north — roughly ', 'dari utara — kira-kira ke arah ', '북쪽 기준 — 대략 ')) +
      esc(Qibla.compassPoint(bearing)) + '. ' +
      esc(P('Mecca is about ', 'Mekah berjarak sekitar ', '메카까지 약 ')) + esc(distance.toLocaleString()) + ' km' +
      esc(P(' away', '', ' 떨어져 있습니다')) + '.' +
      (state.location.label ? ' <span class="muted">(' + esc(state.location.label) + ')</span>' : '') + '</p>' +
      '<p class="qqual" id="qQuality" hidden></p>' +
      '<p class="qcal" id="qCalibrate" hidden></p>' +
      '<p class="qhint" id="qHint" role="status">' + esc(P('Waiting for the compass…', 'Menunggu kompas…', '나침반을 기다리는 중…')) + '</p>';
    if (Qibla.compass.status !== 'live') {
      body += '<button class="qbtn" type="button" data-compass="1">' +
        esc(P('Turn on the compass', 'Nyalakan kompas', '나침반 켜기')) + '</button>';
    }
  }

  body += '</div><div class="callout" style="margin-top:14px"><b>' +
    esc(P('Treat this as an aid, not an authority', 'Anggap ini alat bantu, bukan penentu', '참고 도구이지 판정 기준이 아닙니다')) + '</b>' +
    '<span>' + esc(P(CAUTION[0], CAUTION[1], CAUTION[2])) + '</span></div>';

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
          'Akses gerak ditolak — jarum menunjukkan arah dari utara saja.', '동작 센서 권한이 거부됐습니다 — 대신 바늘이 북쪽 기준 방위를 가리킵니다.')
      : (Qibla.compass.status === 'none'
        ? P('No compass on this device — the needle shows the bearing from north instead.',
            'Tidak ada kompas di perangkat ini — jarum menunjukkan arah dari utara saja.', '이 기기에는 나침반이 없습니다 — 대신 바늘이 북쪽 기준 방위를 가리킵니다.')
        : P('No compass reading yet — the needle shows the bearing from north. Line it up with a compass, or match the rows in your mosque.',
            'Belum ada pembacaan kompas — jarum menunjukkan arah dari utara. Sesuaikan dengan kompas, atau ikuti saf di masjidmu.', '나침반 값이 아직 없습니다 — 바늘은 북쪽 기준 방위를 가리킵니다. 나침반 앱으로 맞추거나, 마스지드에서는 줄을 따르세요.'));
    hint.className = 'qhint';
    return;
  }

  /* Say how much the reading can be trusted. A phone that needs calibrating
     swings while lying still, and a confident needle would be a lie. */
  const chip = $('qQuality');
  if (chip) {
    const q = Qibla.compass.quality;
    chip.className = 'qqual ' + (q === 'unsteady' ? 'bad' : q === 'steady' ? 'ok' : '');
    chip.textContent = q === 'unsteady' ? t('q_unsteady') : q === 'steady' ? t('q_steady') : '';
    chip.hidden = q === 'unknown';
  }
  const cal = $('qCalibrate');
  if (cal) {
    cal.hidden = Qibla.compass.quality !== 'unsteady';
    cal.textContent = t('q_calibrate');
  }

  const delta = ((bearing - heading + 540) % 360) - 180;   // −180…180, + means turn right
  if (Math.abs(delta) <= 5) {
    hint.textContent = P('Facing the qibla.', 'Sudah menghadap kiblat.', '키블라를 향하고 있습니다.');
    hint.className = 'qhint ok';
  } else {
    const dir = delta > 0 ? P('right', 'ke kanan', '오른쪽으로') : P('left', 'ke kiri', '왼쪽으로');
    const amt = Math.round(Math.abs(delta)) + '°';
    /* Korean puts the verb last: 왼쪽으로 40° 도세요 */
    hint.textContent = state.language === 'ko'
      ? dir + ' ' + amt + ' 도세요'
      : P('Turn ', 'Putar ') + dir + ' ' + amt;
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
