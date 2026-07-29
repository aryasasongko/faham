/* Questions beginners actually ask.
   Answers that are genuinely disputed are marked as disputed rather than
   presented as settled — that marking is part of the content, not decoration. */

import { FAQ } from '../../data/faq.js';
import { P, idBlock } from '../i18n.js';
import { $, esc, setHTML } from '../dom.js';

export function renderFaq() {
  const host = $('faqList');
  if (!host) return;

  let html = '';
  let lastGroup = null;

  FAQ.forEach((f) => {
    if (f.g !== lastGroup) {
      html += '<h3 class="dua-g">' + esc(P(f.g, f.gid)) + '</h3>';
      lastGroup = f.g;
    }
    html += '<details class="qa srch"><summary>' + P(f.q, f.qid) + '</summary>' +
      '<div class="qa-b"><p>' + P(f.a, f.aid) + '</p>' + idBlock(f.aid) +
      (f.d
        ? '<div class="disp"><b>' + esc(P('Disputed', 'Diperselisihkan')) + '</b><span>' +
          P(f.d, f.did) + '</span></div>' + idBlock(f.did)
        : '') +
      '</div></details>';
  });

  setHTML(host, html);
}
