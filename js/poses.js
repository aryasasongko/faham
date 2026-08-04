/* Pose figures.
   The geometry lives in data/poses.js; this turns one entry into an SVG.
   Each pose is normalised to its own bounding box so every figure fills its
   frame rather than floating inside a fixed 200×200 field, and every limb is
   drawn twice — a background-coloured halo first, then the stroke — so
   overlapping limbs read as "in front of" instead of merging into a blob. */

import { POSES } from '../data/poses.js';
import { esc } from './dom.js';

export function poseSVG(key, size) {
  const p = POSES[key];
  if (!p) return '';
  const s = size || 92;

  const xs = [];
  const ys = [];
  p.limbs.forEach((l) => {
    for (let i = 0; i < l.length; i += 2) { xs.push(l[i]); ys.push(l[i + 1]); }
  });
  xs.push(p.head.cx - p.head.r, p.head.cx + p.head.r);
  ys.push(p.head.cy - p.head.r, p.head.cy + p.head.r);

  const pad = 14;
  let x0 = Math.min.apply(null, xs) - pad;
  const x1 = Math.max.apply(null, xs) + pad;
  let y0 = Math.min.apply(null, ys) - pad;
  let y1 = Math.max.apply(null, ys) + pad;
  if (y1 < 190) y1 = 190;                       // always show the ground line

  const w = x1 - x0;
  const h = y1 - y0;
  const side = Math.max(w, h);
  x0 -= (side - w) / 2;
  y0 -= (side - h) / 2;
  const viewBox = x0.toFixed(1) + ' ' + y0.toFixed(1) + ' ' + side.toFixed(1) + ' ' + side.toFixed(1);

  const head = () =>
    '<circle class="halo" cx="' + p.head.cx + '" cy="' + p.head.cy + '" r="' + p.head.r + '"/>' +
    '<circle class="fig" cx="' + p.head.cx + '" cy="' + p.head.cy + '" r="' + p.head.r + '"/>';

  let out = '<svg class="pose" viewBox="' + viewBox + '" width="' + s + '" height="' + s +
    '" role="img" aria-label="' + esc(p.label) + ' position">';
  out += '<line class="ground" x1="' + (x0 + 4).toFixed(1) + '" y1="182" x2="' +
    (x0 + side - 4).toFixed(1) + '" y2="182"/>';

  const headIndex = (typeof p.headAfter === 'number') ? p.headAfter : p.limbs.length;
  p.limbs.forEach((l, i) => {
    if (i === headIndex) out += head();
    const pts = [];
    for (let j = 0; j < l.length; j += 2) pts.push(l[j] + ',' + l[j + 1]);
    out += '<polyline class="halo" points="' + pts.join(' ') + '"/>';
    out += '<polyline class="fig" points="' + pts.join(' ') + '"/>';
  });
  if (headIndex >= p.limbs.length) out += head();

  if (p.turn) {
    out += '<path class="turn" d="M126 70 q14 -4 22 6"/>' +
      '<path class="turn-head" d="M150 68 l1 12 l-11 -3 z"/>';
  }
  return out + '</svg>';
}
