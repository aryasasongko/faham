/* Everyday duas, grouped by when they are used.

   Duas are not Quran, so their play buttons resolve to local files only (see
   data/audio-map.js). Where a recording has not been added the button is simply
   not rendered, rather than appearing and then failing. */

import { DUAS } from '../../data/duas.js';
import { P, idBlock } from '../i18n.js';
import { $, esc, setHTML } from '../dom.js';
import { whyNote } from './common.js';
import { playButton, duaAudioId } from '../audio.js';

export function renderDuas() {
  let html = '';
  let lastGroup = null;

  DUAS.forEach((d) => {
    if (d.g !== lastGroup) {
      html += '<h3 class="dua-g">' + esc(P(d.g, d.gid)) + '</h3>';
      lastGroup = d.g;
    }
    const audio = playButton(duaAudioId(d), 'local', null, { small: true });
    html += '<div class="card srch"><div class="card-h"><h4 class="card-t">' + esc(P(d.t, d.tid)) + '</h4></div>' +
      '<div class="ar-row">' + (audio ? '<span class="ar-audio">' + audio + '</span>' : '') +
      '<p class="ar" lang="ar" dir="rtl">' + d.ar + '</p></div>' +
      '<p class="tl">' + d.tl + '</p>' +
      '<p class="en">' + P(d.en, d.id) + '</p>' + idBlock(d.id) +
      whyNote('why', d.w, d.wid) + '</div>';
  });

  setHTML($('duaList'), html);
}
