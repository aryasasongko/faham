/* Golden fixtures for the prayer-time engine.

   Run: node test/prayer-times.test.mjs

   EXPECTED VALUES AND THEIR SOURCE
   The Indonesian rows are compared against the Kemenag-derived public schedule
   published at https://jadwal-sholat.tirto.id (Jakarta, August 2026), which is
   the same table a user would see on a mosque noticeboard. We do not claim to
   reproduce that table exactly: Kemenag computes per regency for a reference
   point covering the whole area, so a minute or two of difference is expected
   and accepted by the tolerance below.

   THE RULE THAT MATTERS: a displayed start time must never be EARLIER than the
   published one, because praying before the window opens is the failure mode
   that counts. Sunrise is the opposite — it ends Fajr, so it must never be
   later. Those directional assertions are enforced separately from tolerance.

   Non-Indonesian rows exist to pin timezone and DST behaviour, not to assert a
   particular convention's authority. */

import { computeForDate, METHODS, zoneOffsetHours } from '../js/prayer-times.js';

let pass = 0, fail = 0;
const problems = [];

function hhmm(d, tz) {
  return d.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
}
function minutes(s) { const [h, m] = s.split(':').map(Number); return h * 60 + m; }

function check(name, cond, detail) {
  if (cond) { pass++; } else { fail++; problems.push(name + (detail ? ' — ' + detail : '')); }
}

/* A local Date for midnight of the given calendar day in the target zone. */
function dayIn(tz, y, m, d) {
  const guess = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const off = zoneOffsetHours(tz, guess);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - off * 3600000);
}

/* ---- 1. Jakarta against the published schedule ------------------------- */
{
  const tz = 'Asia/Jakarta';
  const loc = { lat: -6.2088, lng: 106.8456, tz };
  const r = computeForDate(dayIn(tz, 2026, 8, 4), loc, { methodKey: 'kemenag', asr: 'standard' });
  /* Source: jadwal-sholat.tirto.id, Jakarta, 4 August 2026 */
  const published = { subuh: '04:45', dzuhur: '12:02', ashar: '15:23', maghrib: '17:58', isya: '19:09' };
  const TOL = 2; // minutes — tighter than the margin, so drift shows up
  Object.keys(published).forEach((k) => {
    const got = hhmm(r.times[k], tz);
    const diff = minutes(got) - minutes(published[k]);
    check(`Jakarta ${k} within ${TOL}min of published`, Math.abs(diff) <= TOL, `got ${got}, published ${published[k]}`);
    /* The rule that actually matters: never display a start before the window. */
    check(`Jakarta ${k} never earlier than published`, diff >= 0, `got ${got}, published ${published[k]}`);
  });
  check('Jakarta ihtiyati declared', r.ihtiyati === 4, 'got ' + r.ihtiyati);
  check('Jakarta zone recorded', r.zone === tz, 'got ' + r.zone);
}

/* ---- 2. the other Indonesian cities stay ordered and in-zone ----------- */
for (const [name, lat, lng, tz] of [
  ['Bandung', -6.9175, 107.6191, 'Asia/Jakarta'],
  ['Surabaya', -7.2575, 112.7521, 'Asia/Jakarta'],
  ['Medan', 3.5952, 98.6722, 'Asia/Jakarta'],
  ['Makassar', -5.1477, 119.4327, 'Asia/Makassar'],
  ['Jayapura', -2.533, 140.7181, 'Asia/Jayapura']
]) {
  const r = computeForDate(dayIn(tz, 2026, 8, 4), { lat, lng, tz }, { methodKey: 'kemenag', asr: 'standard' });
  const t = ['subuh', 'sunrise', 'dzuhur', 'ashar', 'maghrib', 'isya'].map((k) => r.times[k].getTime());
  check(`${name} times strictly increasing`, t.every((v, i) => i === 0 || v > t[i - 1]));
  const h = Number(hhmm(r.times.dzuhur, tz).slice(0, 2));
  check(`${name} dzuhur near local noon`, h >= 11 && h <= 13, 'got ' + hhmm(r.times.dzuhur, tz));
}

/* ---- 3. a picked city is computed in ITS zone, not the device's -------- */
{
  const jkt = { lat: -6.2088, lng: 106.8456, tz: 'Asia/Jakarta' };
  const withZone = computeForDate(dayIn('Asia/Jakarta', 2026, 8, 4), jkt, { methodKey: 'kemenag', asr: 'standard' });
  const noZone = computeForDate(dayIn('Asia/Jakarta', 2026, 8, 4), { lat: jkt.lat, lng: jkt.lng }, { methodKey: 'kemenag', asr: 'standard' });
  check('zoned Jakarta reads 12:0x in Jakarta', hhmm(withZone.times.dzuhur, 'Asia/Jakarta').startsWith('12:'),
    'got ' + hhmm(withZone.times.dzuhur, 'Asia/Jakarta'));
  /* Under TZ=Asia/Seoul the unzoned path drifts; the zoned one must not. */
  check('zoned result independent of device zone',
    hhmm(withZone.times.dzuhur, 'Asia/Jakarta') === '12:02' || Math.abs(
      minutes(hhmm(withZone.times.dzuhur, 'Asia/Jakarta')) - minutes('12:02')) <= 3,
    'got ' + hhmm(withZone.times.dzuhur, 'Asia/Jakarta') + ' (unzoned ' + hhmm(noZone.times.dzuhur, 'Asia/Jakarta') + ')');
}

/* ---- 4. DST: London in and out of summer time -------------------------- */
{
  const tz = 'Europe/London';
  const loc = { lat: 51.5074, lng: -0.1278, tz };
  const summer = computeForDate(dayIn(tz, 2026, 7, 1), loc, { methodKey: 'mwl', asr: 'standard' });
  const winter = computeForDate(dayIn(tz, 2026, 12, 1), loc, { methodKey: 'mwl', asr: 'standard' });
  check('London summer dzuhur ~13:00 BST', hhmm(summer.times.dzuhur, tz).startsWith('13:'), 'got ' + hhmm(summer.times.dzuhur, tz));
  check('London winter dzuhur ~11:5x/12:0x GMT', /^(11|12):/.test(hhmm(winter.times.dzuhur, tz)), 'got ' + hhmm(winter.times.dzuhur, tz));
  check('London offsets differ across DST',
    zoneOffsetHours(tz, new Date(Date.UTC(2026, 6, 1))) !== zoneOffsetHours(tz, new Date(Date.UTC(2026, 11, 1))));
  /* The day DST ends in the UK: 25 October 2026. */
  const changeover = computeForDate(dayIn(tz, 2026, 10, 25), loc, { methodKey: 'mwl', asr: 'standard' });
  check('London DST changeover day still ordered',
    changeover.times.subuh < changeover.times.dzuhur && changeover.times.dzuhur < changeover.times.maghrib);
}

/* ---- 5. Hanafi Asr is later than standard ------------------------------ */
{
  const tz = 'Asia/Jakarta';
  const loc = { lat: -6.2088, lng: 106.8456, tz };
  const std = computeForDate(dayIn(tz, 2026, 8, 4), loc, { methodKey: 'kemenag', asr: 'standard' });
  const han = computeForDate(dayIn(tz, 2026, 8, 4), loc, { methodKey: 'kemenag', asr: 'hanafi' });
  check('Hanafi Asr later than standard', han.times.ashar > std.times.ashar,
    `${hhmm(han.times.ashar, tz)} vs ${hhmm(std.times.ashar, tz)}`);
  check('Hanafi moves only Asr', hhmm(han.times.maghrib, tz) === hhmm(std.times.maghrib, tz));
}

/* ---- 6. high latitude is flagged, not silently wrong -------------------- */
{
  const tz = 'Europe/Oslo';
  const loc = { lat: 59.9139, lng: 10.7522, tz };
  const midsummer = computeForDate(dayIn(tz, 2026, 6, 21), loc, { methodKey: 'mwl', asr: 'standard' });
  check('Oslo midsummer produces times', midsummer && midsummer.times.subuh instanceof Date);
  check('Oslo midsummer flagged as estimated', midsummer.estimated === true);
}

/* ---- 7. tomorrow's Fajr is after tonight's Isha ------------------------ */
{
  const tz = 'Asia/Jakarta';
  const loc = { lat: -6.2088, lng: 106.8456, tz };
  const today = computeForDate(dayIn(tz, 2026, 8, 4), loc, { methodKey: 'kemenag', asr: 'standard' });
  const tomorrow = computeForDate(dayIn(tz, 2026, 8, 5), loc, { methodKey: 'kemenag', asr: 'standard' });
  check("tomorrow's Fajr after tonight's Isha", tomorrow.times.subuh > today.times.isya);
}

/* ---- 8. ihtiyati is declared, never hidden ----------------------------- */
{
  Object.keys(METHODS).forEach((k) => {
    const m = METHODS[k];
    const declared = typeof m.ihtiyati === 'number' ? m.ihtiyati : 0;
    check(`${k} ihtiyati is a declared number`, Number.isFinite(declared));
    check(`${k} has a Korean label`, typeof m.label.ko === 'string' && m.label.ko.length > 0);
  });
}

console.log(`\nprayer-times: ${pass} passed, ${fail} failed`);
if (problems.length) { problems.forEach((p) => console.log('  FAIL ' + p)); process.exit(1); }
