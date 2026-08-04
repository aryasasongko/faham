/* Translation parity — with one deliberate exception.

   English and Indonesian must be complete: every interface key, every content
   field. Korean is intentionally partial — the nine essays, ten stories and
   vocabulary notes are not translated, and the app says so in an on-screen
   banner rather than pretending otherwise. This test therefore enforces
   completeness for EN/ID, and for Korean enforces only that the sections which
   CLAIM to be translated actually are. A blanket "every key in every language"
   check would fail by design and teach us to ignore it.

   Run: node test/translation-parity.test.mjs */

import { STRINGS } from '../js/i18n.js';
import { KO_STRINGS } from '../js/i18n-ko.js';
import { PARTS } from '../data/parts.js';
import { DUAS } from '../data/duas.js';
import { FAQ } from '../data/faq.js';
import { SURAHS } from '../data/surahs.js';
import { WUDHU } from '../data/wudhu.js';
import { PRAYERS } from '../data/prayers.js';
import { CYCLE } from '../data/cycle.js';
import { SAHWI } from '../data/sahwi.js';
import { PROMPTS, ENCOURAGE } from '../data/today.js';

let pass = 0; const problems = [];
const check = (name, ok, detail) => ok ? pass++ : problems.push(name + (detail ? ' — ' + detail : ''));

/* ---- interface strings: EN and ID complete ----------------------------- */
Object.keys(STRINGS).forEach((k) => {
  const row = STRINGS[k];
  check(`i18n ${k} has English`, typeof row[0] === 'string' && row[0].length > 0);
  check(`i18n ${k} has Indonesian`, typeof row[1] === 'string', 'missing id');
});

/* ---- the Korean overlay must not carry keys that no longer exist -------- */
Object.keys(KO_STRINGS).forEach((k) => {
  check(`ko overlay key ${k} still exists in STRINGS`, Object.prototype.hasOwnProperty.call(STRINGS, k));
});
/* ...and must cover every interface key, because the CHROME is claimed as
   translated. Content sections are exempt; interface is not. */
Object.keys(STRINGS).forEach((k) => {
  check(`i18n ${k} has Korean`, typeof KO_STRINGS[k] === 'string', 'missing ko');
});

/* ---- content fields, per section ---------------------------------------- */
function fields(rows, name, spec) {
  rows.forEach((row, i) => {
    Object.keys(spec).forEach((base) => {
      const [idKey, koKey] = spec[base];
      if (row[base] === undefined) return;      // optional field, absent entirely
      check(`${name}[${i}].${idKey}`, row[idKey] !== undefined, 'Indonesian missing');
      if (koKey) check(`${name}[${i}].${koKey}`, row[koKey] !== undefined, 'Korean missing');
    });
  });
}

/* Sections the app presents as fully trilingual. */
fields(PARTS, 'PARTS', { t: ['tid', 'tko'], n: ['nid', 'nko'], pos: ['posid', 'posko'],
  en: ['id', 'enko'], why: ['whyid', 'whyko'] });
fields(DUAS, 'DUAS', { g: ['gid', 'gko'], t: ['tid', 'tko'], en: ['id', 'enko'], w: ['wid', 'wko'] });
fields(FAQ, 'FAQ', { g: ['gid', 'gko'], q: ['qid', 'qko'], a: ['aid', 'ako'] });
fields(SURAHS, 'SURAHS', { meta: ['metaid', 'metako'], intro: ['introid', 'introko'], why: ['whyid', 'whyko'] });
fields(WUDHU, 'WUDHU', { t: ['tid', 'tko'], d: ['id', 'dko'] });
fields(PRAYERS, 'PRAYERS', { time: ['timeid', 'timeko'], aloud: ['aloudid', 'aloudko'], diff: ['diffid', 'diffko'] });
fields(CYCLE, 'CYCLE', { t: ['tid', 'tko'], d: ['did', 'dko'] });

/* Every Quranic verse carries all three, since the surahs are claimed. */
SURAHS.forEach((s, i) => s.v.forEach((v, j) => {
  check(`SURAHS[${i}].v[${j}].id`, typeof v.id === 'string');
  check(`SURAHS[${i}].v[${j}].ko`, typeof v.ko === 'string', 'Korean verse missing');
}));

/* Sahwi is new and fully trilingual by construction. */
SAHWI.forEach((row, i) => {
  ['q', 'a'].forEach((f) => ['en', 'id', 'ko'].forEach((l) => {
    check(`SAHWI[${i}].${f}.${l}`, typeof row[f][l] === 'string' && row[f][l].length > 0);
  }));
});

/* Daily prompts are [en, id, ko] triples. */
[['PROMPTS', PROMPTS], ['ENCOURAGE', ENCOURAGE]].forEach(([name, rows]) => {
  rows.forEach((r, i) => check(`${name}[${i}] is a full triple`, r.length === 3 && r.every((x) => typeof x === 'string' && x.length)));
});

console.log(`\ntranslation parity: ${pass} passed, ${problems.length} failed`);
if (problems.length) { problems.slice(0, 25).forEach((p) => console.log('  FAIL ' + p)); process.exit(1); }
