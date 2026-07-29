/* The Prayer view: how many rakaat and what changes, the walkthrough (including
   Witr), everything you say, and wudhu.

   This is the section the madhhab choice actually moves, so almost every render
   here goes through MadhhabService rather than reading the data files raw. */

import { PRAYERS } from '../../data/prayers.js';
import { PARTS } from '../../data/parts.js';
import { WUDHU } from '../../data/wudhu.js';
import { CYCLE } from '../../data/cycle.js';
import { state } from '../state.js';
import { P, t, idBlock, isBoth, pickLang, pickLangId } from '../i18n.js';
import { $, esc, setHTML, delegate } from '../dom.js';
import { poseSVG } from '../poses.js';
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
  return P(p.nameEn || p.name, p.name);
}

/* ---- the summary table -------------------------------------------------- */

export function renderTable() {
  setHTML($('prayerTable'), PRAYERS.map((p) => {
    let extra = P(p.diff, p.diffid);
    if (p.id === 'subuh') {
      const q = Madhhab.fajrQunut();
      if (q) extra += ' <em>' + esc(pickLang(q.note)) + '</em>';
    }
    return '<tr class="srch"><td>' + esc(prayerName(p)) +
      '<div class="tbl-sub">' + esc(P(p.time, p.timeid)) + '</div></td>' +
      '<td class="n">' + p.rak + '</td>' +
      '<td class="tbl-voice">' + esc(P(p.aloud, p.aloudid)) + '</td>' +
      '<td class="tbl-diff">' + extra + '</td></tr>';
  }).join(''));
}

/* ---- the day arc -------------------------------------------------------- */

/* When a location is known the arc is drawn from the real calculated times for
   today; otherwise it falls back to a representative shape, clearly marked as
   such, because the point of the picture is the spacing rather than the minute. */
function arcPoints() {
  const pt = state.prayerTimes;
  const ids = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  const labels = {
    subuh: ['Fajr', 'Subuh'], dzuhur: ['Dhuhr', 'Dzuhur'], ashar: ['Asr', 'Ashar'],
    maghrib: ['Maghrib', 'Maghrib'], isya: ['Isha', 'Isya']
  };
  if (pt && pt.times && ids.every((id) => pt.times[id] instanceof Date)) {
    const startOfDayMs = new Date(pt.times.subuh).setHours(0, 0, 0, 0);
    return {
      real: true,
      points: ids.map((id) => {
        const d = pt.times[id];
        const hours = (d.getTime() - startOfDayMs) / 3600000;
        return { id, n: P(labels[id][0], labels[id][1]), time: formatClock(d), x: Math.min(0.97, Math.max(0.03, hours / 24)) };
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
      id: f.id, n: P(labels[f.id][0], labels[f.id][1]), time: '', x: f.x
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
        'Digambar dari waktu hasil perhitungan untuk lokasimu hari ini. Dua yang di tengah jatuh di dalam jam kerja — itulah sebabnya keduanya paling sering terlewat.')
    : P('A representative shape, not your local times. Open Prayer times and allow location to see today’s real spacing. The two in the middle fall inside the working day, which is why they are the ones people miss.',
        'Bentuk gambaran, bukan waktu setempatmu. Buka Waktu sholat dan izinkan lokasi untuk melihat jarak sebenarnya hari ini. Dua yang di tengah jatuh di dalam jam kerja, itulah sebabnya keduanya paling sering terlewat.');

  return '<div class="arc srch">' +
    '<svg viewBox="0 0 ' + W + ' ' + H + '" class="arcsvg" role="img" aria-label="' +
    esc(P('The five prayers across the day', 'Lima sholat sepanjang hari')) + '">' +
    '<line class="horizon" x1="14" y1="' + y0 + '" x2="' + (W - 14) + '" y2="' + y0 + '"/>' +
    '<path class="sun" d="' + path + '"/>' + dots + '</svg>' +
    '<div class="dlwrap">' + labels + '</div>' +
    '<p class="arcnote">' + esc(note) + '</p></div>';
}

/* ---- the rakaat map ----------------------------------------------------- */

function rakaatMap() {
  const showQunut = Madhhab.hasFajrQunut();
  const head = '<div class="rmap-head"><span></span>' +
    [1, 2, 3, 4].map((n) => '<span>' + esc(t('rakaat')) + ' ' + n + '</span>').join('') + '</div>';

  const rows = PRAYERS.map((p) => {
    let cells = '';
    for (let r = 1; r <= 4; r++) {
      if (r > p.rak) { cells += '<span class="rc empty"></span>'; continue; }
      const aloud = p.aloud !== 'Silent' && r <= 2;
      let chips = '<b class="chip f">Fatihah</b>';
      if (r <= 2) chips += '<b class="chip s">+ surah</b>';
      if (p.id === 'subuh' && r === 2 && showQunut) chips += '<b class="chip q">qunut</b>';
      let sit = '';
      if (r === 2 && p.rak > 2) sit = '<b class="chip sit">' + esc(P('sit', 'duduk')) + '</b>';
      if (r === p.rak) sit = '<b class="chip sit end">' + esc(P('sit + salam', 'duduk + salam')) + '</b>';
      cells += '<span class="rc' + (aloud ? ' aloud' : '') + '">' + chips + sit + '</span>';
    }
    return '<div class="rmap-row"><span class="rn">' + esc(prayerName(p)) +
      '<i>' + p.rak + ' rakaat · ' + esc(P(p.aloud, p.aloudid).toLowerCase()) + '</i></span>' + cells + '</div>';
  }).join('');

  const key = '<div class="rmap-key">' +
    '<span><i class="sw aloud"></i>' + esc(P('recited aloud', 'dibaca keras')) + '</span>' +
    '<span><i class="sw"></i>' + esc(P('recited silently', 'dibaca pelan')) + '</span>' +
    '<span><b class="chip s"></b>' + esc(P('extra surah — first two rakaat only', 'surah tambahan — hanya dua rakaat pertama')) + '</span>' +
    (showQunut ? '<span><b class="chip q"></b>' + esc(pickLang(Madhhab.fajrQunut().label)) + '</span>' : '') +
    '</div>';

  return '<div class="rmap srch">' + head + rows + key + '</div>';
}

export function renderRakaatVisuals() {
  setHTML($('rakaatVisuals'), dayArc() + rakaatMap());
}

export function renderCycle() {
  setHTML($('cycle'), CYCLE.map((c, i) => (
    '<div class="cyc"><span class="n">' + (i + 1) + '</span>' + poseSVG(c.k, 88) +
    '<b>' + esc(P(c.t, c.tid)) + '</b><i>' + esc(P(c.d, c.did)) + '</i></div>'
  )).join(''));
}

/* ---- walkthrough -------------------------------------------------------- */

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
    esc(pickLang(plan.summary)) + idBlock(esc(pickLangId(plan.summary))),
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
  let extra = P(prayer.diff, prayer.diffid);
  if (prayer.id === 'subuh') {
    const q = Madhhab.fajrQunut();
    if (q) extra += ' <em>' + esc(pickLang(q.note)) + '</em>';
  }

  let html = callout(
    esc(prayerName(prayer)) + ' — ' + prayer.rak + ' rakaat, ' + esc(P(prayer.aloud, prayer.aloudid).toLowerCase()),
    extra + idBlock(prayer.diffid),
    'green'
  );
  html += '<p class="walk-note">' + esc(t('md_selected')) + ' <b>' + esc(Madhhab.name()) + '</b> · ' +
    '<a href="#/settings">' + esc(t('md_change')) + '</a></p>';
  html += buildWalk(prayer).map(stepsHTML).join('');
  setHTML($('walk'), html);
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
    body += '<p class="en">' + P(p.en, p.id) + '</p>' + idBlock(p.id);

    let extra = '';
    if (p.schoolNote) {
      extra += '<p class="school-note"><span class="lbl">' + esc(Madhhab.name()) + ' ' + esc(t('md_practice')) +
        '</span>' + esc(pickLang(p.schoolNote)) + '</p>' + idBlock(esc(pickLangId(p.schoolNote)));
    }
    const more = (isBoth() ? p.more : P(p.more, p.moreid)) || [];
    const moreId = p.moreid || [];
    const appended = p.schoolMore ? [pickLang(p.schoolMore)] : [];
    extra += deeper(more.concat(appended), moreId.concat(p.schoolMore ? [pickLangId(p.schoolMore)] : []));

    body += whyNote('why', p.why, p.whyid, extra);

    const figure = p.fig ? '<div class="pose-box">' + poseSVG(p.fig, 86) + '</div>' : '';
    return '<div class="card srch"><div class="card-top"><div class="card-txt">' +
      '<p class="step-n">' + esc(P(p.n, p.nid)) + '</p><div class="card-h"><h3>' + P(p.t, p.tid) +
      (p.times ? '<span class="times">' + P(p.times, p.timesid) + '</span>' : '') + '</h3>' +
      '<span class="pos">' + esc(P(p.pos, p.posid)) + '</span></div></div>' + figure + '</div>' +
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
    idBlock(esc(Madhhab.practiceTextId(row.key))) + '</div>'
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
    Object.assign({ mx: 154, my: 20, tx: 113, ty: 29, l: ['Head', 'Kepala'] }, at('head')),
    Object.assign({ mx: 166, my: 54, tx: 120, ty: 46, l: ['Ears', 'Telinga'] }, at('ears')),
    Object.assign({ mx: 44, my: 24, tx: 84, ty: 34, l: ['Face', 'Wajah'] }, at('face')),
    Object.assign({ mx: 34, my: 58, tx: 88, ty: 50, l: ['Mouth & nose', 'Mulut & hidung'] }, at('mouth-nose')),
    Object.assign({ mx: 30, my: 122, tx: 56, ty: 126, l: ['Arms to elbows', 'Lengan sampai siku'] }, at('arms')),
    Object.assign({ mx: 170, my: 150, tx: 146, ty: 157, l: ['Hands', 'Tangan'] }, at('hands')),
    Object.assign({ mx: 100, my: 238, tx: 100, ty: 212, l: ['Feet to ankles', 'Kaki sampai mata kaki'] }, at('feet'))
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
    '<span class="wleg' + (m.ob ? ' ob' : '') + '"><b>' + m.n + '</b>' + esc(P(m.l[0], m.l[1])) + '</span>'
  )).join('');

  return '<div class="wdiag srch">' +
    '<svg viewBox="0 0 200 252" class="wsvg" aria-hidden="true" focusable="false">' + leaders + fig + dots + '</svg>' +
    '<div class="wlegend">' + legend + '</div>' +
    '<p class="arcnote">' + esc(P('Filled numbers are obligatory in the school you have selected; outlined ones are sunnah. Numbering follows the list below.',
                                  'Nomor yang terisi penuh wajib menurut mazhab yang kamu pilih; yang bergaris saja sunnah. Penomoran mengikuti daftar di bawah.')) + '</p></div>';
}

export function renderWudhu() {
  const list = WUDHU.map((base, i) => {
    const w = Madhhab.resolveWudhu(base);
    const tone = w.ob ? 'ob' : 'sn';
    return '<div class="card srch wcard"><div class="card-h"><h3 class="wtitle">' +
      (i + 1) + '. ' + esc(P(w.t, w.tid || w.t)) +
      '<span class="times ' + tone + '">' + esc(w.ob ? t('oblig') : t('sunnah')) + '</span>' +
      (w.schoolVaries ? variationChip(Madhhab.name()) : '') + '</h3></div>' +
      '<p class="en" style="margin-top:6px">' + esc(P(w.d, w.id)) + '</p>' + idBlock(esc(w.id)) + '</div>';
  }).join('');
  setHTML($('wudhuList'), wudhuDiagram() + list);
}

/* ---- wiring ------------------------------------------------------------- */

export function bindPrayer() {
  delegate($('picker'), 'button[data-prayer]', 'click', (e, el) => {
    selected = el.dataset.prayer;
    renderPicker();
    renderWalk();
  });
}

export function renderPrayerView() {
  renderTable();
  renderRakaatVisuals();
  renderCycle();
  renderPicker();
  renderWalk();
  renderParts();
  renderPractice();
  renderWudhu();
}
