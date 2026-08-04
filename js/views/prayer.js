/* The Prayer view: how many rakaat and what changes, the walkthrough (including
   Witr), everything you say, and wudhu.

   This is the section the madhhab choice actually moves, so almost every render
   here goes through MadhhabService rather than reading the data files raw. */

import { PRAYERS } from '../../data/prayers.js';
import { PARTS } from '../../data/parts.js';
import { WUDHU } from '../../data/wudhu.js';
import { CYCLE } from '../../data/cycle.js';
import { SAHWI, SAHWI_LEDE } from '../../data/sahwi.js';
import { state } from '../state.js';
import { P, t, pairBlock, isPair, pickLang, pickLangId, pickLangEn } from '../i18n.js';
import { $, esc, setHTML, delegate } from '../dom.js';
import { poseSVG } from '../poses.js';
import { currentPrayer } from '../prayer-times.js';
import { deeper, whyNote, callout, variationChip } from './common.js';
import * as Madhhab from '../madhhab.js';
import { buildWalk, buildWitr } from '../walkthrough.js';
import { playButton } from '../audio.js';
import { formatClock } from '../dates.js';

/* `WITR` is a pseudo-prayer in the picker: it has no fixed rakaat count of its
   own because the count is a property of the school, not of the prayer. */
export const WITR_ID = 'witr';

let selected = 'maghrib';

export function prayerName(p) {
  return P(p.nameEn || p.name, p.name, p.nko || p.name);
}

/* ---- the summary table -------------------------------------------------- */


/* ---- the day arc -------------------------------------------------------- */

/* When a location is known the arc is drawn from the real calculated times for
   today; otherwise it falls back to a representative shape, clearly marked as
   such, because the point of the picture is the spacing rather than the minute. */
function arcPoints() {
  const pt = state.prayerTimes;
  const ids = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  const labels = {
    subuh: ['Fajr', 'Subuh', '파즈르'], dzuhur: ['Dhuhr', 'Dzuhur', '주흐르'],
    ashar: ['Asr', 'Ashar', '아스르'], maghrib: ['Maghrib', 'Maghrib', '마그립'],
    isya: ['Isha', 'Isya', '이샤']
  };
  if (pt && pt.times && ids.every((id) => pt.times[id] instanceof Date)) {
    const startOfDayMs = new Date(pt.times.subuh).setHours(0, 0, 0, 0);
    return {
      real: true,
      points: ids.map((id) => {
        const d = pt.times[id];
        const hours = (d.getTime() - startOfDayMs) / 3600000;
        return { id, n: P(labels[id][0], labels[id][1], labels[id][2]), time: formatClock(d), x: Math.min(0.97, Math.max(0.03, hours / 24)) };
      })
    };
  }
  /* Roughly equatorial spacing, used only until a real location exists. */
  const fallback = [
    { id: 'subuh', x: 0.19 }, { id: 'dzuhur', x: 0.50 }, { id: 'ashar', x: 0.64 },
    { id: 'maghrib', x: 0.75 }, { id: 'isya', x: 0.86 }
  ];
  return {
    real: false,
    points: fallback.map((f) => ({
      id: f.id, n: P(labels[f.id][0], labels[f.id][1], labels[f.id][2]), time: '', x: f.x
    }))
  };
}

function dayArc() {
  const data = arcPoints();
  const W = 320;
  const H = 150;
  const y0 = 112;
  const px = (x) => 22 + x * (W - 44);
  const py = (x) => y0 - Math.sin(x * Math.PI) * 72;

  let path = 'M' + px(0) + ',' + py(0);
  for (let i = 1; i <= 40; i++) {
    const x = i / 40;
    path += ' L' + px(x).toFixed(1) + ',' + py(x).toFixed(1);
  }
  const dots = data.points.map((p) => (
    '<g><line class="drop" x1="' + px(p.x).toFixed(1) + '" y1="' + py(p.x).toFixed(1) +
    '" x2="' + px(p.x).toFixed(1) + '" y2="' + y0 + '"/>' +
    '<circle class="pdot" cx="' + px(p.x).toFixed(1) + '" cy="' + py(p.x).toFixed(1) + '" r="6"/></g>'
  )).join('');
  const labels = data.points.map((p, i) => (
    '<div class="dl" style="left:' + (p.x * 100).toFixed(1) + '%;top:' + (i % 2 ? 20 : 0) + 'px">' +
    '<b>' + esc(p.n) + '</b><i>' + esc(p.time) + '</i></div>'
  )).join('');

  const note = data.real
    ? P('Drawn from today’s calculated times for your location. The two in the middle fall inside the working day — which is why they are the ones people miss.',
        'Digambar dari waktu hasil perhitungan untuk lokasimu hari ini. Dua yang di tengah jatuh di dalam jam kerja — itulah sebabnya keduanya paling sering terlewat.', '오늘 이 위치에서 계산된 예배 시각을 바탕으로 그렸습니다. 가운데 두 예배는 일하는 시간에 걸립니다 — 그래서 사람들이 가장 많이 놓칩니다.')
    : P('A representative shape, not your local times. Open Prayer times and allow location to see today’s real spacing. The two in the middle fall inside the working day, which is why they are the ones people miss.',
        'Bentuk gambaran, bukan waktu setempatmu. Buka Waktu sholat dan izinkan lokasi untuk melihat jarak sebenarnya hari ini. Dua yang di tengah jatuh di dalam jam kerja, itulah sebabnya keduanya paling sering terlewat.', '실제 이 지역의 시각이 아니라 대략적인 모양입니다. 오늘의 실제 간격을 보려면 예배 시간을 열고 위치 사용을 허용하세요. 가운데 두 예배는 일하는 시간에 걸립니다. 그래서 사람들이 가장 많이 놓칩니다.');

  return '<div class="arc srch">' +
    '<svg viewBox="0 0 ' + W + ' ' + H + '" class="arcsvg" role="img" aria-label="' +
    esc(P('The five prayers across the day', 'Lima sholat sepanjang hari', '하루의 다섯 예배')) + '">' +
    '<line class="horizon" x1="14" y1="' + y0 + '" x2="' + (W - 14) + '" y2="' + y0 + '"/>' +
    '<path class="sun" d="' + path + '"/>' + dots + '</svg>' +
    '<div class="dlwrap">' + labels + '</div>' +
    '<p class="arcnote">' + esc(note) + '</p></div>';
}

/* ---- the rakaat map ----------------------------------------------------- */


export function renderRakaatVisuals() {
  /* The day arc only. The per-rakaat matrix that used to sit here is now the
     unfoldable prayer cards below, which say the same thing without asking the
     reader to scroll a grid sideways on a phone. */
  const el = $('rakaatVisuals');
  if (el) setHTML(el, dayArc());
}

export function renderCycle() {
  setHTML($('cycle'), CYCLE.map((c, i) => (
    '<div class="cyc"><span class="n">' + (i + 1) + '</span>' + poseSVG(c.k, 88) +
    '<b>' + esc(P(c.t, c.tid, c.tko)) + '</b><i>' + esc(P(c.d, c.did, c.dko)) + '</i></div>'
  )).join(''));
}

/* ---- walkthrough -------------------------------------------------------- */

/** Point the walkthrough (and the open card) at a specific prayer. */
export function selectPrayer(id) {
  if (!PRAYERS.some((p) => p.id === id)) return;
  selected = id;
  openPrayer = id;
  renderRakaatCards();
  renderPicker();
  renderWalk();
}

export function renderPicker() {
  const buttons = PRAYERS.map((p) => (
    '<button type="button" data-prayer="' + esc(p.id) + '"' +
    (p.id === selected ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + '>' +
    esc(prayerName(p)) + '<small>' + p.rak + ' rakaat</small></button>'
  )).join('');

  const witr = Madhhab.witr();
  const witrCount = witr ? witr.units.reduce((n, u) => n + u.rak, 0) : 0;
  const witrButton = witr
    ? '<button type="button" data-prayer="' + WITR_ID + '"' +
      (selected === WITR_ID ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + '>' +
      esc(t('md_witr')) + '<small>' + witrCount + ' rakaat</small></button>'
    : '';

  setHTML($('picker'), buttons + witrButton);
}

function stepsHTML(block) {
  return '<div class="rk"><div class="rk-h">' + esc(t('rakaat')) + ' ' + block.r +
    ' <em>— ' + esc(block.note) + '</em></div><ol class="seq">' +
    block.steps.map((s) => (
      '<li><div class="seq-b"><p class="seq-t">' + s.t + variationChip(s.badge) + '</p>' +
      (s.d ? '<p class="seq-d">' + s.d + '</p>' : '') +
      (s.say ? '<p class="seq-say">' + esc(s.say) + '</p>' : '') + '</div></li>'
    )).join('') + '</ol></div>';
}

function renderWitrWalk() {
  const plan = Madhhab.witr();
  if (!plan) { setHTML($('walk'), ''); return; }

  let html = callout(
    esc(t('md_witr')) + ' — ' + esc(pickLang(plan.obligation)) + ' · ' + esc(Madhhab.name()),
    esc(pickLang(plan.summary)) + pairBlock(esc(pickLangEn(plan.summary)), esc(pickLangId(plan.summary))),
    'green'
  );
  html += '<p class="sec-lede">' + esc(t('md_witr_lede')) + '</p>';

  buildWitr().forEach((unit) => {
    html += '<p class="unit-h">' + esc(pickLang(unit.label)) + '</p>';
    unit.rakaat.forEach((block) => { html += stepsHTML(block); });
  });
  setHTML($('walk'), html);
}

export function renderWalk() {
  if (selected === WITR_ID) { renderWitrWalk(); return; }

  const prayer = PRAYERS.filter((p) => p.id === selected)[0] || PRAYERS[3];
  let extra = P(prayer.diff, prayer.diffid, prayer.diffko);
  if (prayer.id === 'subuh') {
    const q = Madhhab.fajrQunut();
    if (q) extra += ' <em>' + esc(pickLang(q.note)) + '</em>';
  }

  let html = callout(
    esc(prayerName(prayer)) + ' — ' + prayer.rak + ' rakaat, ' + esc(P(prayer.aloud, prayer.aloudid, prayer.aloudko).toLowerCase()),
    extra + pairBlock(prayer.diff, prayer.diffid),
    'green'
  );
  html += '<p class="walk-note">' + esc(t('md_selected')) + ' <b>' + esc(Madhhab.name()) + '</b> · ' +
    '<a href="#/settings">' + esc(t('md_change')) + '</a></p>';
  html += buildWalk(prayer).map(stepsHTML).join('');
  setHTML($('walk'), html);
}


/* ---- the rakaat cards ---------------------------------------------------
   A beginner's question is never "what are the counts" but "how do I pray the
   one coming up". So the table is a list of prayers that unfold into one card
   per rakaat, and the prayer whose window we are currently inside opens by
   itself. Everything here is derived from PRAYERS plus the selected school —
   there is no second source of truth to keep in step.
   ------------------------------------------------------------------------ */

let openPrayer = null;      // null = follow the clock

function nowPrayerId() {
  try {
    const real = currentPrayer(state.prayerTimes, new Date());
    if (real) return { id: real, exact: true };
  } catch (e) { /* fall through to the clock guess */ }
  /* No location yet, which is the normal first-run state. A rough guess from
     the clock still opens the right card most of the time; it just does not
     claim to know, so no "now" badge is shown. */
  const h = new Date().getHours();
  const id = h < 5 ? 'subuh' : h < 12 ? 'dzuhur' : h < 16 ? 'ashar' : h < 18 ? 'maghrib' : 'isya';
  return { id: id, exact: false };
}

function rakaatCard(p, r, showQunut) {
  const aloud = p.aloud !== 'Silent' && r <= 2;
  let chips = '<b class="chip f">' + esc(P('Al-Fatihah', 'Al-Fatihah', '알파티하')) + '</b>';
  if (r <= 2) chips += '<b class="chip s">' + esc(P('+ short surah', '+ surah pendek', '+ 짧은 수라')) + '</b>';
  if (p.id === 'subuh' && r === 2 && showQunut) chips += '<b class="chip q">' + esc(t('md_qunut')) + '</b>';
  if (r === 2 && p.rak > 2) chips += '<b class="chip sit">' + esc(P('middle tashahhud', 'tasyahud awal', '중간 타샤후드')) + '</b>';
  if (r === p.rak) chips += '<b class="chip sit end">' + esc(P('final tashahhud + salam', 'tasyahud akhir + salam', '마지막 타샤후드 + 살람')) + '</b>';
  return '<div class="rcard' + (aloud ? ' aloud' : '') + '">' +
    '<p class="rcard-h">' + esc(t('rakaat')) + ' ' + r +
    '<span>' + esc(aloud ? t('aloud') : t('silent')) + '</span></p>' +
    '<div class="rcard-b">' + chips + '</div></div>';
}

export function renderRakaatCards() {
  const host = $('prayerCards');
  if (!host) return;
  const showQunut = Madhhab.hasFajrQunut();
  const guess = nowPrayerId();
  const now = guess.exact ? guess.id : null;
  const active = (openPrayer === null) ? guess.id : openPrayer;
  const isFriday = new Date().getDay() === 5;

  const rows = PRAYERS.map((p) => {
    const open = p.id === active;
    let cards = '';
    for (let r = 1; r <= p.rak; r++) cards += rakaatCard(p, r, showQunut);

    let diff = P(p.diff, p.diffid, p.diffko);
    if (p.id === 'subuh') {
      const q = Madhhab.fajrQunut();
      if (q) diff += ' <em>' + esc(pickLang(q.note)) + '</em>';
    }
    const jumat = (p.id === 'dzuhur' && isFriday)
      ? '<p class="rcard-note">' + esc(P(
          'Today is Friday: Jumat prayer replaces Dzuhur — 2 rakaat, after the khutbah.',
          'Hari ini Jumat: sholat Jumat menggantikan Dzuhur — 2 rakaat, setelah khutbah.',
          '오늘은 금요일입니다. 주무아 예배가 주흐르를 대신합니다 — 쿠트바 뒤에 2라카아입니다.')) + '</p>'
      : '';

    return '<div class="pfold' + (open ? ' open' : '') + '">' +
      '<button type="button" class="pfold-h" data-prayer-fold="' + esc(p.id) + '"' +
        ' aria-expanded="' + (open ? 'true' : 'false') + '">' +
        '<span class="pf-n">' + esc(prayerName(p)) + '</span>' +
        '<span class="pf-m">' + p.rak + ' ' + esc(t('rakaat').toLowerCase()) + ' · ' +
          esc(P(p.aloud, p.aloudid, p.aloudko).toLowerCase()) + '</span>' +
        (p.id === now ? '<span class="pf-now">' + esc(P('now', 'sekarang', '지금')) + '</span>' : '') +
        '<span class="pf-c" aria-hidden="true"></span>' +
      '</button>' +
      '<div class="pfold-b">' + jumat + '<div class="rcards">' + cards + '</div>' +
        '<p class="rcard-diff">' + diff + '</p>' + pairBlock(p.diff, p.diffid) + '</div>' +
    '</div>';
  }).join('');

  setHTML(host, rows);
}


/* ---- if you make a mistake ----------------------------------------------
   The reviewer's point, and it is the right one: "what if I get it wrong" is
   where beginners freeze, and no app explains it at their level. It lives in
   the Rakaat section, next to the counts, because that is where the fear is.
   ------------------------------------------------------------------------ */

export function renderSahwi() {
  const host = $('sahwiBody');
  if (!host) return;
  const items = SAHWI.map((row) => (
    '<div class="sahwi-row"><p class="sahwi-q">' + esc(pickLang(row.q)) + '</p>' +
    '<p class="sahwi-a">' + esc(pickLang(row.a)) + '</p>' +
    pairBlock(esc(row.q.en + ' — ' + row.a.en), esc(row.q.id + ' — ' + row.a.id)) + '</div>'
  )).join('');
  setHTML(host, '<p class="sahwi-lede">' + esc(pickLang(SAHWI_LEDE)) + '</p>' + items);
}

/* ---- everything you say ------------------------------------------------- */

export function renderParts() {
  setHTML($('parts'), PARTS.map((base) => {
    const p = Madhhab.resolvePart(base);
    let body = '';
    if (p.ar) {
      const audio = playButton('part:' + p.key, 'local', null, { small: true });
      body += '<div class="ar-row">' + (audio ? '<span class="ar-audio">' + audio + '</span>' : '') +
        '<p class="ar" lang="ar" dir="rtl">' + p.ar + '</p></div>';
    }
    if (p.tl) body += '<p class="tl">' + p.tl + '</p>';
    body += '<p class="en">' + P(p.en, p.id, p.enko) + '</p>' + pairBlock(p.en, p.id);

    let extra = '';
    if (p.schoolNote) {
      extra += '<p class="school-note"><span class="lbl">' + esc(Madhhab.name()) + ' ' + esc(t('md_practice')) +
        '</span>' + esc(pickLang(p.schoolNote)) + '</p>' + pairBlock(esc(pickLangEn(p.schoolNote)), esc(pickLangId(p.schoolNote)));
    }
    const more = P(p.more, p.moreid, p.moreko) || [];
    const moreId = p.moreid || [];
    const appended = p.schoolMore ? [pickLang(p.schoolMore)] : [];
    extra += deeper((p.more || []).concat(p.schoolMore ? [pickLangEn(p.schoolMore)] : []),
                    moreId.concat(p.schoolMore ? [pickLangId(p.schoolMore)] : []),
                    (p.moreko || []).concat(p.schoolMore ? [pickLang(p.schoolMore)] : []));

    body += whyNote('why', p.why, p.whyid, p.whyko, extra);

    const figure = p.fig ? '<div class="pose-box">' + poseSVG(p.fig, 86) + '</div>' : '';
    return '<div class="card srch"><div class="card-top"><div class="card-txt">' +
      '<p class="step-n">' + esc(P(p.n, p.nid, p.nko)) + '</p><div class="card-h"><h3>' + P(p.t, p.tid, p.tko) +
      (p.times ? '<span class="times">' + P(p.times, p.timesid, p.timesko) + '</span>' : '') + '</h3>' +
      '<span class="pos">' + esc(P(p.pos, p.posid, p.posko)) + '</span></div></div>' + figure + '</div>' +
      body + '</div>';
  }).join(''));
}

/* ---- how this school prays ---------------------------------------------- */

export function renderPractice() {
  const host = $('practicePanel');
  if (!host) return;
  const rows = Madhhab.PRACTICE_ROWS.map((row) => (
    '<div class="prow"><span class="pk">' + esc(pickLang(row.label)) + '</span>' +
    '<span class="pv">' + esc(Madhhab.practiceText(row.key)) + '</span>' +
    pairBlock(esc(Madhhab.practiceTextEn(row.key)), esc(Madhhab.practiceTextId(row.key))) + '</div>'
  )).join('');
  setHTML(host,
    '<div class="card srch"><div class="card-h"><h3>' + esc(Madhhab.name()) + ' — ' +
    esc(t('set_differ')) + '</h3></div>' +
    '<p class="en" style="margin-top:6px">' + esc(t('set_differ_note')) + '</p>' +
    '<div class="ptable">' + rows + '</div></div>');
}

/* ---- wudhu -------------------------------------------------------------- */

function wudhuDiagram() {
  /* `n` is the row number in the list below; whether a marker is filled comes
     from the resolved ruling for the selected school, so the diagram and the
     list can never disagree. */
  const obligatory = {};
  WUDHU.forEach((base, i) => {
    const resolved = Madhhab.resolveWudhu(base);
    obligatory[base.key] = { ob: !!resolved.ob, n: i + 1 };
  });
  const at = (key) => obligatory[key] || { ob: false, n: 0 };

  const marks = [
    Object.assign({ mx: 154, my: 20, tx: 113, ty: 29, l: ['Head', 'Kepala', '머리'] }, at('head')),
    Object.assign({ mx: 166, my: 54, tx: 120, ty: 46, l: ['Ears', 'Telinga', '귀'] }, at('ears')),
    Object.assign({ mx: 44, my: 24, tx: 84, ty: 34, l: ['Face', 'Wajah', '얼굴'] }, at('face')),
    Object.assign({ mx: 34, my: 58, tx: 88, ty: 50, l: ['Mouth & nose', 'Mulut & hidung', '입과 코'] }, at('mouth-nose')),
    Object.assign({ mx: 30, my: 122, tx: 56, ty: 126, l: ['Arms to elbows', 'Lengan sampai siku', '팔(팔꿈치까지)'] }, at('arms')),
    Object.assign({ mx: 170, my: 150, tx: 146, ty: 157, l: ['Hands', 'Tangan', '두 손'] }, at('hands')),
    Object.assign({ mx: 100, my: 238, tx: 100, ty: 212, l: ['Feet to ankles', 'Kaki sampai mata kaki', '발(복사뼈까지)'] }, at('feet'))
  ];
  const fig =
    '<circle class="wf" cx="100" cy="40" r="20"/>' +
    '<path class="wf" d="M100 60 L100 76"/>' +
    '<path class="wf" d="M68 86 Q100 76 132 86 L126 150 L74 150 Z"/>' +
    '<path class="wf" d="M70 90 L54 128 L58 152"/>' +
    '<path class="wf" d="M130 90 L146 128 L142 152"/>' +
    '<circle class="wf" cx="58" cy="158" r="6"/>' +
    '<circle class="wf" cx="142" cy="158" r="6"/>' +
    '<path class="wf" d="M84 150 L82 205"/><path class="wf" d="M116 150 L118 205"/>' +
    '<path class="wf" d="M72 208 L92 208"/><path class="wf" d="M108 208 L128 208"/>';
  const leaders = marks.map((m) => (
    '<line class="wl" x1="' + m.mx + '" y1="' + m.my + '" x2="' + m.tx + '" y2="' + m.ty + '"/>' +
    '<circle class="wp" cx="' + m.tx + '" cy="' + m.ty + '" r="2.6"/>'
  )).join('');
  const dots = marks.map((m) => (
    '<g><circle class="wm' + (m.ob ? ' ob' : '') + '" cx="' + m.mx + '" cy="' + m.my + '" r="11"/>' +
    '<text class="wt' + (m.ob ? ' ob' : '') + '" x="' + m.mx + '" y="' + (m.my + 4) +
    '" text-anchor="middle">' + m.n + '</text></g>'
  )).join('');
  const legend = marks.slice().sort((a, b) => a.n - b.n).map((m) => (
    '<span class="wleg' + (m.ob ? ' ob' : '') + '"><b>' + m.n + '</b>' + esc(P(m.l[0], m.l[1], m.l[2])) + '</span>'
  )).join('');

  return '<div class="wdiag srch">' +
    '<svg viewBox="0 0 200 252" class="wsvg" aria-hidden="true" focusable="false">' + leaders + fig + dots + '</svg>' +
    '<div class="wlegend">' + legend + '</div>' +
    '<p class="arcnote">' + esc(P('Filled numbers are obligatory in the school you have selected; outlined ones are sunnah. Numbering follows the list below.',
                                  'Nomor yang terisi penuh wajib menurut mazhab yang kamu pilih; yang bergaris saja sunnah. Penomoran mengikuti daftar di bawah.', '채워진 번호는 선택한 학파에서 의무이고, 테두리만 있는 번호는 순나입니다. 번호는 아래 목록을 따릅니다.')) + '</p></div>';
}

export function renderWudhu() {
  const list = WUDHU.map((base, i) => {
    const w = Madhhab.resolveWudhu(base);
    const tone = w.ob ? 'ob' : 'sn';
    return '<div class="card srch wcard"><div class="card-h"><h3 class="wtitle">' +
      (i + 1) + '. ' + esc(P(w.t, w.tid || w.t, w.tko)) +
      '<span class="times ' + tone + '">' + esc(w.ob ? t('oblig') : t('sunnah')) + '</span>' +
      (w.schoolVaries ? variationChip(Madhhab.name()) : '') + '</h3></div>' +
      '<p class="en" style="margin-top:6px">' + esc(P(w.d, w.id, w.dko)) + '</p>' + pairBlock(esc(w.d), esc(w.id)) + '</div>';
  }).join('');
  setHTML($('wudhuList'), wudhuDiagram() + list);
}

/* ---- wiring ------------------------------------------------------------- */

export function bindPrayer() {
  delegate($('prayerCards'), '[data-prayer-fold]', 'click', (e, el) => {
    const id = el.dataset.prayerFold;
    openPrayer = (openPrayer === id) ? '' : id;   /* '' = all closed */
    renderRakaatCards();
  });

  delegate($('picker'), 'button[data-prayer]', 'click', (e, el) => {
    selected = el.dataset.prayer;
    renderPicker();
    renderWalk();
  });
}

export function renderPrayerView() {
  renderRakaatCards();
  renderSahwi();
  renderRakaatVisuals();
  renderCycle();
  renderPicker();
  renderWalk();
  renderParts();
  renderPractice();
  renderWudhu();
}
