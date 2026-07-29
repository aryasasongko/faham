/* ============================================================================
   The step-by-step walkthrough engine.
   ----------------------------------------------------------------------------
   One engine, four schools. It builds a rakaat as a sequence of steps and asks
   MadhhabService for the handful of places where the schools actually diverge —
   it does not keep four copies of the prayer.

   A step may carry `badge`, which renders as a small "Hanafi variation" chip.
   Badges are applied sparingly and only where the difference changes what the
   learner physically does; agreement is left unmarked so the page does not turn
   into a comparison table.
   ========================================================================== */

import { P, t } from './i18n.js';
import * as Madhhab from './madhhab.js';

function badge() {
  return Madhhab.name() + ' ' + t('md_variation');
}

/** Schools that raise the hands again around the bow. */
function raisesAtRuku() {
  const key = Madhhab.currentKey();
  return key === 'shafii' || key === 'hanbali';
}

function openingStep() {
  const key = Madhhab.currentKey();
  const height = key === 'hanafi'
    ? P('Hands to ear height.', 'Tangan setinggi telinga.')
    : P('Hands to shoulder height.', 'Tangan setinggi bahu.');
  return {
    t: P('Niat, then <a href="#words">Takbiratul Ihram</a>', 'Niat, lalu <a href="#words">Takbiratul Ihram</a>'),
    d: height + ' ' + P('From here you are inside the prayer.', 'Sejak titik ini kamu sudah di dalam sholat.'),
    say: 'Allāhu akbar'
  };
}

function openingSupplicationStep() {
  const key = Madhhab.currentKey();
  if (key === 'maliki') {
    return {
      t: P('Straight into Al-Fatihah', 'Langsung ke Al-Fatihah'),
      d: P('This school adds no opening supplication and no basmalah — after the takbir you begin the recitation itself.',
           'Mazhab ini tidak menambahkan doa iftitah maupun basmalah — setelah takbir kamu langsung memulai bacaannya.'),
      say: '',
      badge: badge()
    };
  }
  if (key === 'hanafi' || key === 'hanbali') {
    return {
      t: P('<a href="#words">Thanā</a> — the opening supplication', '<a href="#words">Tsana</a> — doa pembuka'),
      d: P('Silently, first rakaat only.', 'Dibaca pelan, hanya rakaat pertama.'),
      say: 'Subḥānakallāhumma wa biḥamdik…',
      badge: badge()
    };
  }
  return {
    t: P('<a href="#words">Doa Iftitah</a>', '<a href="#words">Doa Iftitah</a>'),
    d: P('Silently, first rakaat only. Sunnah — skipping it does not invalidate anything.',
         'Dibaca pelan, hanya rakaat pertama. Sunnah — meninggalkannya tidak membatalkan apa pun.'),
    say: 'Allāhu akbar kabīrā…'
  };
}

function fatihahStep(voiceFlag) {
  const key = Madhhab.currentKey();
  let note = P('Every rakaat, without exception.', 'Setiap rakaat, tanpa kecuali.');
  if (key === 'shafii') {
    note += ' ' + P('The basmalah counts as its first verse and is said aloud where the recitation is aloud.',
                    'Basmalah terhitung ayat pertamanya dan dibaca keras pada bagian yang dikeraskan.');
  } else if (key === 'maliki') {
    note += ' ' + P('Begin at "al-ḥamdu lillāh" — this school does not recite the basmalah in the obligatory prayer.',
                    'Mulai dari "al-ḥamdu lillāh" — mazhab ini tidak membaca basmalah dalam sholat wajib.');
  } else {
    note += ' ' + P('The basmalah is said silently before it, even where the recitation is aloud.',
                    'Basmalah dibaca pelan sebelumnya, bahkan pada bagian yang dikeraskan.');
  }
  return {
    t: '<a href="#surah">Al-Fatihah</a>' + (voiceFlag ? ' ' + voiceFlag : ''),
    d: note,
    say: "Al-ḥamdu lillāhi rabbil-'ālamīn…"
  };
}

function rukuStep() {
  const extra = raisesAtRuku()
    ? P(' Hands are raised again as you go down and as you come back up.',
        ' Tangan diangkat lagi saat turun dan saat bangkit kembali.')
    : '';
  return {
    t: P("<a href=\"#words\">Ruku'</a> — bow", '<a href="#words">Rukuk</a> — membungkuk'),
    d: P('Takbir as you go down, then the words three times.', 'Takbir saat turun, lalu bacaannya tiga kali.') + extra,
    say: "Subḥāna rabbiyal-'aẓīmi wa biḥamdih ×3"
  };
}

function itidalStep() {
  return {
    t: P("<a href=\"#words\">I'tidal</a> — stand up straight", "<a href=\"#words\">I'tidal</a> — berdiri tegak"),
    d: P('Fully upright and still before going down again.', 'Tegak sepenuhnya dan tenang sejenak sebelum turun lagi.'),
    say: "Sami'allāhu liman ḥamidah — Rabbanā lakal-ḥamd…"
  };
}

function sujudSteps() {
  return [
    {
      t: P('<a href="#words">Sujud</a> — first prostration', '<a href="#words">Sujud</a> — sujud pertama'),
      d: P('Seven parts on the ground. The words three times.', 'Tujuh anggota menyentuh lantai. Bacaannya tiga kali.'),
      say: "Subḥāna rabbiyal-a'lā wa biḥamdih ×3"
    },
    {
      t: P('<a href="#words">Sit between the two prostrations</a>', '<a href="#words">Duduk di antara dua sujud</a>'),
      d: P('Brief, but it holds eight requests. Do not rush it.', 'Singkat, tapi memuat delapan permohonan. Jangan diburu-buru.'),
      say: 'Rabbighfir lī warḥamnī…'
    },
    {
      t: P('<a href="#words">Sujud</a> — second prostration', '<a href="#words">Sujud</a> — sujud kedua'),
      d: P('Identical to the first. This completes the rakaat.', 'Sama persis dengan yang pertama. Ini menyempurnakan rakaat.'),
      say: "Subḥāna rabbiyal-a'lā wa biḥamdih ×3"
    }
  ];
}

function middleSittingStep() {
  const key = Madhhab.currentKey();
  const seat = key === 'maliki'
    ? P('Sitting tawarruk, as in every sitting in this school.', 'Duduk tawarruk, seperti pada setiap duduk dalam mazhab ini.')
    : P('Sitting iftirash — on the left foot, right foot upright.', 'Duduk iftirasy — di atas telapak kaki kiri, kaki kanan ditegakkan.');
  return {
    t: P('Sit for the <b>middle tashahhud</b>', 'Duduk untuk <b>tasyahud awal</b>') +
       ' <span class="flag only">' + t('only34') + '</span>',
    d: P('Because this prayer has more than two rakaat, you sit here, recite the tashahhud, then stand again for rakaat 3.',
         'Karena sholat ini lebih dari dua rakaat, kamu duduk di sini, membaca tasyahud, lalu berdiri lagi untuk rakaat 3.') +
       ' ' + seat,
    say: 'At-taḥiyyāt…'
  };
}

function finalStepsFor() {
  const key = Madhhab.currentKey();
  const seat = key === 'hanafi'
    ? P('Sitting iftirash, as in every sitting in this school.', 'Duduk iftirasy, seperti pada setiap duduk dalam mazhab ini.')
    : P('Sitting tawarruk — the left foot passes under the right leg.', 'Duduk tawarruk — kaki kiri dikeluarkan ke bawah kaki kanan.');

  const salamOnce = key === 'maliki';
  return [
    {
      t: P('Sit for the <b>final tashahhud</b>', 'Duduk untuk <b>tasyahud akhir</b>'),
      d: P('The full tashahhud, then the salawat. Personal supplication belongs here, before the salam.',
           'Tasyahud lengkap, lalu sholawat. Doa pribadi tempatnya di sini, sebelum salam.') + ' ' + seat,
      say: "At-taḥiyyāt… Allāhumma ṣalli 'alā Muḥammad…",
      badge: key === 'shafii' ? null : badge()
    },
    {
      t: salamOnce
        ? P('<a href="#words">Salam</a> — once, to the right', '<a href="#words">Salam</a> — sekali, ke kanan')
        : P('<a href="#words">Salam</a> — right, then left', '<a href="#words">Salam</a> — ke kanan, lalu ke kiri'),
      d: salamOnce
        ? P('Praying alone, this school teaches a single salam. The prayer is finished.',
            'Saat sholat sendiri, mazhab ini mengajarkan satu salam. Sholat selesai.')
        : P('Turn the head to the right, then the left. The prayer is finished.',
            'Menoleh ke kanan, lalu ke kiri. Sholat selesai.'),
      say: salamOnce ? "As-salāmu 'alaikum wa raḥmatullāh" : "As-salāmu 'alaikum wa raḥmatullāh ×2",
      badge: salamOnce ? badge() : null
    }
  ];
}

/** The qunut step for Subuh, or null when this school does not add one. */
function fajrQunutSteps(rakaatNumber) {
  const q = Madhhab.fajrQunut();
  if (!q || q.mode !== 'always' || rakaatNumber !== 2) return null;
  const note = P(q.note.en, q.note.id);

  if (q.position === 'before-ruku') {
    return {
      before: {
        t: P('<b>Qunut</b>, still standing', '<b>Qunut</b>, masih berdiri') +
           ' <span class="flag only">' + Madhhab.name() + '</span>',
        d: note,
        say: P('the qunut supplication', 'doa qunut'),
        badge: badge()
      },
      after: null
    };
  }
  return {
    before: null,
    after: {
      t: P("<a href=\"#words\">I'tidal</a>, then <b>qunut</b>", "<a href=\"#words\">I'tidal</a>, lalu <b>qunut</b>") +
         ' <span class="flag only">' + Madhhab.name() + '</span>',
      d: note,
      say: "Sami'allāhu liman ḥamidah… " + P('then qunut', 'lalu qunut'),
      badge: badge()
    }
  };
}

/**
 * Build one obligatory prayer.
 * `prayer` is an entry from data/prayers.js. Returns an array of rakaat, each
 * with `{ r, last, note, steps }`.
 */
export function buildWalk(prayer) {
  const out = [];
  const aloudFirstTwo = prayer.aloud !== 'Silent';

  for (let r = 1; r <= prayer.rak; r++) {
    const steps = [];
    const last = r === prayer.rak;
    const first = r === 1;
    const firstTwo = r <= 2;
    const voice = (firstTwo && aloudFirstTwo)
      ? '<span class="flag aloud">' + t('aloud') + '</span>'
      : '<span class="flag silent">' + t('silent') + '</span>';

    if (first) {
      steps.push(openingStep());
      steps.push(openingSupplicationStep());
    } else {
      steps.push({
        t: P('Stand for rakaat ', 'Berdiri untuk rakaat ') + r,
        d: P('Said as you rise into the standing position.', 'Diucapkan saat kamu bangkit ke posisi berdiri.'),
        say: 'Allāhu akbar'
      });
    }

    steps.push(fatihahStep(voice));

    if (firstTwo) {
      steps.push({
        t: P('A short surah', 'Satu surah pendek') + ' <span class="flag only">' + t('only12') + '</span>',
        d: P('Al-Ikhlas, Al-Falaq or An-Nas is the usual beginner choice.',
             'Al-Ikhlas, Al-Falaq, atau An-Nas adalah pilihan pemula yang lazim.'),
        say: 'Qul huwallāhu aḥad…'
      });
    } else {
      steps.push({
        t: P('No extra surah', 'Tanpa surah tambahan'),
        d: P('From rakaat 3 onward it is Al-Fatihah alone. This is the single most common point of confusion.',
             'Mulai rakaat ke-3 hanya Al-Fatihah saja. Inilah titik yang paling sering membingungkan.'),
        say: ''
      });
    }

    const qunut = prayer.id === 'subuh' ? fajrQunutSteps(r) : null;
    if (qunut && qunut.before) steps.push(qunut.before);

    steps.push(rukuStep());
    steps.push(qunut && qunut.after ? qunut.after : itidalStep());
    sujudSteps().forEach((s) => steps.push(s));

    if (r === 2 && !last) steps.push(middleSittingStep());
    if (last) finalStepsFor().forEach((s) => steps.push(s));

    out.push({
      r,
      last,
      steps,
      note: first ? t('opening') : (last ? t('final') : t('middle'))
    });
  }
  return out;
}

/**
 * Build Witr for the selected school. Returns an array of *units*, because
 * Witr is not always one continuous prayer: three of the four schools pray it
 * as two rakaat with a salam followed by one on its own, and the Hanafi school
 * prays three joined under a single salam with the qunut before the bow.
 */
export function buildWitr() {
  const plan = Madhhab.witr();
  if (!plan) return [];

  return plan.units.map((unit, unitIndex) => {
    const blocks = [];
    for (let r = 1; r <= unit.rak; r++) {
      const steps = [];
      const first = r === 1;
      const last = r === unit.rak;
      const isQunutRakaat = unit.qunut && (!unit.qunut.rakaat || unit.qunut.rakaat === r) && last;

      if (first && unitIndex === 0) {
        steps.push(openingStep());
        steps.push(openingSupplicationStep());
      } else if (first) {
        steps.push(openingStep());
      } else {
        steps.push({
          t: P('Stand for rakaat ', 'Berdiri untuk rakaat ') + r,
          d: P('Said as you rise into the standing position.', 'Diucapkan saat kamu bangkit ke posisi berdiri.'),
          say: 'Allāhu akbar'
        });
      }

      /* Whether Witr is recited aloud or quietly varies with circumstance and
         school; the walkthrough makes no claim either way. */
      steps.push(fatihahStep(''));
      steps.push({
        t: P('A short surah', 'Satu surah pendek'),
        d: unit.surahEveryRakaat
          ? P('A surah is added in every rakaat of Witr in this school.',
              'Surah ditambahkan pada setiap rakaat Witir dalam mazhab ini.')
          : P('Any passage you know. Al-Ikhlas is the usual choice.',
              'Bacaan apa pun yang kamu hafal. Al-Ikhlas adalah pilihan yang lazim.'),
        say: 'Qul huwallāhu aḥad…'
      });

      if (isQunutRakaat && unit.qunut.position === 'before-ruku') {
        steps.push({
          t: P('Takbir, hands raised, then <b>qunut</b>', 'Takbir, angkat tangan, lalu <b>qunut</b>'),
          d: P(unit.qunut.scope.en, unit.qunut.scope.id),
          say: P('the qunut supplication', 'doa qunut'),
          badge: badge()
        });
      }

      steps.push(rukuStep());

      if (isQunutRakaat && unit.qunut.position === 'after-ruku') {
        steps.push({
          t: P("I'tidal, then <b>qunut</b>", "I'tidal, lalu <b>qunut</b>"),
          d: P(unit.qunut.scope.en, unit.qunut.scope.id),
          say: "Sami'allāhu liman ḥamidah… " + P('then qunut', 'lalu qunut'),
          badge: badge()
        });
      } else {
        steps.push(itidalStep());
      }

      sujudSteps().forEach((s) => steps.push(s));

      if (unit.middleSitting && r === 2 && !last) {
        steps.push({
          t: P('Sit for the tashahhud — then <b>stand back up</b>', 'Duduk tasyahud — lalu <b>berdiri lagi</b>'),
          d: P('You do not say the salam here. This is what makes the three rakaat one prayer rather than two.',
               'Kamu tidak mengucapkan salam di sini. Inilah yang membuat tiga rakaat itu menjadi satu sholat, bukan dua.'),
          say: 'At-taḥiyyāt…',
          badge: badge()
        });
      }

      if (last) finalStepsFor().forEach((s) => steps.push(s));

      blocks.push({
        r,
        last,
        steps,
        note: first ? t('opening') : (last ? t('final') : t('middle'))
      });
    }

    return { label: unit.label, rakaat: blocks };
  });
}
