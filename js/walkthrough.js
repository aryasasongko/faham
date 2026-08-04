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
    ? P('Hands to ear height.', 'Tangan setinggi telinga.', '두 손을 귀 높이로 올립니다.')
    : P('Hands to shoulder height.', 'Tangan setinggi bahu.', '두 손을 어깨 높이로 올립니다.');
  return {
    t: P('Niat, then <a href="#words">Takbiratul Ihram</a>', 'Niat, lalu <a href="#words">Takbiratul Ihram</a>', '니야, 그다음 <a href="#words">타크비라툴 이흐람</a>'),
    d: height + ' ' + P('From here you are inside the prayer.', 'Sejak titik ini kamu sudah di dalam sholat.', '여기서부터는 예배 안입니다.'),
    say: 'Allāhu akbar'
  };
}

function openingSupplicationStep() {
  const key = Madhhab.currentKey();
  if (key === 'maliki') {
    return {
      t: P('Straight into Al-Fatihah', 'Langsung ke Al-Fatihah', '바로 알파티하로'),
      d: P('This school adds no opening supplication and no basmalah — after the takbir you begin the recitation itself.',
           'Mazhab ini tidak menambahkan doa iftitah maupun basmalah — setelah takbir kamu langsung memulai bacaannya.', '이 학파는 여는 두아도 바스말라도 더하지 않습니다 — 타크비르 뒤에 바로 낭송을 시작합니다.'),
      say: '',
      badge: badge()
    };
  }
  if (key === 'hanafi' || key === 'hanbali') {
    return {
      t: P('<a href="#words">Thanā</a> — the opening supplication', '<a href="#words">Tsana</a> — doa pembuka', '<a href="#words">사나</a> — 여는 두아'),
      d: P('Silently, first rakaat only.', 'Dibaca pelan, hanya rakaat pertama.', '조용히, 첫 라카아에서만.'),
      say: 'Subḥānakallāhumma wa biḥamdik…',
      badge: badge()
    };
  }
  return {
    t: P('<a href="#words">Doa Iftitah</a>', '<a href="#words">Doa Iftitah</a>', '<a href="#words">이프티타흐 두아</a>'),
    d: P('Silently, first rakaat only. Sunnah — skipping it does not invalidate anything.',
         'Dibaca pelan, hanya rakaat pertama. Sunnah — meninggalkannya tidak membatalkan apa pun.', '조용히, 첫 라카아에서만. 순나이므로 생략해도 무효가 되지 않습니다.'),
    say: 'Allāhu akbar kabīrā…'
  };
}

function fatihahStep(voiceFlag) {
  const key = Madhhab.currentKey();
  let note = P('Every rakaat, without exception.', 'Setiap rakaat, tanpa kecuali.', '모든 라카아, 예외 없이.');
  if (key === 'shafii') {
    note += ' ' + P('The basmalah counts as its first verse and is said aloud where the recitation is aloud.',
                    'Basmalah terhitung ayat pertamanya dan dibaca keras pada bagian yang dikeraskan.', '바스말라가 알파티하의 첫 구절로 들어가며, 소리 내어 낭송하는 부분에서는 바스말라도 소리 내어 읽습니다.');
  } else if (key === 'maliki') {
    note += ' ' + P('Begin at "al-ḥamdu lillāh" — this school does not recite the basmalah in the obligatory prayer.',
                    'Mulai dari "al-ḥamdu lillāh" — mazhab ini tidak membaca basmalah dalam sholat wajib.', '“알함두 릴라”에서 시작합니다 — 이 학파는 의무 예배에서 바스말라를 낭송하지 않습니다.');
  } else {
    note += ' ' + P('The basmalah is said silently before it, even where the recitation is aloud.',
                    'Basmalah dibaca pelan sebelumnya, bahkan pada bagian yang dikeraskan.', '바스말라는 알파티하 앞에 조용히 읽습니다. 소리 내어 낭송하는 부분에서도 마찬가지입니다.');
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
        ' Tangan diangkat lagi saat turun dan saat bangkit kembali.', ' 내려갈 때와 다시 올라올 때 두 손을 다시 올립니다.')
    : '';
  return {
    t: P("<a href=\"#words\">Ruku'</a> — bow", '<a href="#words">Rukuk</a> — membungkuk', '<a href="#words">루쿠</a> — 허리 굽힘'),
    d: P('Takbir as you go down, then the words three times.', 'Takbir saat turun, lalu bacaannya tiga kali.', '내려가면서 타크비르를 하고, 낭송을 세 번 합니다.') + extra,
    say: "Subḥāna rabbiyal-'aẓīmi wa biḥamdih ×3"
  };
}

function itidalStep() {
  return {
    t: P("<a href=\"#words\">I'tidal</a> — stand up straight", "<a href=\"#words\">I'tidal</a> — berdiri tegak", '<a href="#words">이티달</a> — 곧게 서기'),
    d: P('Fully upright and still before going down again.', 'Tegak sepenuhnya dan tenang sejenak sebelum turun lagi.', '다시 내려가기 전에 완전히 곧게 서서 잠시 멈춥니다.'),
    say: "Sami'allāhu liman ḥamidah — Rabbanā lakal-ḥamd…"
  };
}

function sujudSteps() {
  return [
    {
      t: P('<a href="#words">Sujud</a> — first prostration', '<a href="#words">Sujud</a> — sujud pertama', '<a href="#words">수주드</a> — 첫 번째 엎드림'),
      d: P('Seven parts on the ground. The words three times.', 'Tujuh anggota menyentuh lantai. Bacaannya tiga kali.', '일곱 부위가 바닥에 닿습니다. 낭송은 세 번 합니다.'),
      say: "Subḥāna rabbiyal-a'lā wa biḥamdih ×3"
    },
    {
      t: P('<a href="#words">Sit between the two prostrations</a>', '<a href="#words">Duduk di antara dua sujud</a>', '<a href="#words">두 번의 수주드 사이에 앉기</a>'),
      d: P('Brief, but it holds eight requests. Do not rush it.', 'Singkat, tapi memuat delapan permohonan. Jangan diburu-buru.', '짧지만 여덟 가지 간구가 담겨 있습니다. 서두르지 마세요.'),
      say: 'Rabbighfir lī warḥamnī…'
    },
    {
      t: P('<a href="#words">Sujud</a> — second prostration', '<a href="#words">Sujud</a> — sujud kedua', '<a href="#words">수주드</a> — 두 번째 엎드림'),
      d: P('Identical to the first. This completes the rakaat.', 'Sama persis dengan yang pertama. Ini menyempurnakan rakaat.', '첫 번째와 같습니다. 이로써 한 라카아가 끝납니다.'),
      say: "Subḥāna rabbiyal-a'lā wa biḥamdih ×3"
    }
  ];
}

function middleSittingStep() {
  const key = Madhhab.currentKey();
  const seat = key === 'maliki'
    ? P('Sitting tawarruk, as in every sitting in this school.', 'Duduk tawarruk, seperti pada setiap duduk dalam mazhab ini.', '타와루크로 앉습니다. 이 학파의 모든 앉기가 그렇습니다.')
    : P('Sitting iftirash — on the left foot, right foot upright.', 'Duduk iftirasy — di atas telapak kaki kiri, kaki kanan ditegakkan.', '이프티라시로 앉습니다 — 왼발 위에 앉고 오른발은 세웁니다.');
  return {
    t: P('Sit for the <b>middle tashahhud</b>', 'Duduk untuk <b>tasyahud awal</b>', '<b>중간 타샤후드</b>를 위해 앉기') +
       ' <span class="flag only">' + t('only34') + '</span>',
    d: P('Because this prayer has more than two rakaat, you sit here, recite the tashahhud, then stand again for rakaat 3.',
         'Karena sholat ini lebih dari dua rakaat, kamu duduk di sini, membaca tasyahud, lalu berdiri lagi untuk rakaat 3.', '이 예배는 라카아가 세 번 이상이므로, 여기서 앉아 타샤후드를 낭송한 뒤 3번째 라카아를 위해 다시 섭니다.') +
       ' ' + seat,
    say: 'At-taḥiyyāt…'
  };
}

function finalStepsFor() {
  const key = Madhhab.currentKey();
  const seat = key === 'hanafi'
    ? P('Sitting iftirash, as in every sitting in this school.', 'Duduk iftirasy, seperti pada setiap duduk dalam mazhab ini.', '이프티라시로 앉습니다. 이 학파의 모든 앉기가 그렇습니다.')
    : P('Sitting tawarruk — the left foot passes under the right leg.', 'Duduk tawarruk — kaki kiri dikeluarkan ke bawah kaki kanan.', '타와루크로 앉습니다 — 왼발을 오른쪽 다리 아래로 뺍니다.');

  const salamOnce = key === 'maliki';
  return [
    {
      t: P('Sit for the <b>final tashahhud</b>', 'Duduk untuk <b>tasyahud akhir</b>', '<b>마지막 타샤후드</b>를 위해 앉기'),
      d: P('The full tashahhud, then the salawat. Personal supplication belongs here, before the salam.',
           'Tasyahud lengkap, lalu sholawat. Doa pribadi tempatnya di sini, sebelum salam.', '타샤후드 전문을 읽고, 이어서 살라와트를 읽습니다. 개인적인 두아는 살람 전에 여기서 합니다.') + ' ' + seat,
      say: "At-taḥiyyāt… Allāhumma ṣalli 'alā Muḥammad…",
      badge: key === 'shafii' ? null : badge()
    },
    {
      t: salamOnce
        ? P('<a href="#words">Salam</a> — once, to the right', '<a href="#words">Salam</a> — sekali, ke kanan', '<a href="#words">살람</a> — 한 번, 오른쪽으로')
        : P('<a href="#words">Salam</a> — right, then left', '<a href="#words">Salam</a> — ke kanan, lalu ke kiri', '<a href="#words">살람</a> — 오른쪽, 그다음 왼쪽'),
      d: salamOnce
        ? P('Praying alone, this school teaches a single salam. The prayer is finished.',
            'Saat sholat sendiri, mazhab ini mengajarkan satu salam. Sholat selesai.', '혼자 드릴 때 이 학파는 살람을 한 번만 합니다. 예배가 끝났습니다.')
        : P('Turn the head to the right, then the left. The prayer is finished.',
            'Menoleh ke kanan, lalu ke kiri. Sholat selesai.', '고개를 오른쪽으로, 그다음 왼쪽으로 돌립니다. 예배가 끝났습니다.'),
      say: salamOnce ? "As-salāmu 'alaikum wa raḥmatullāh" : "As-salāmu 'alaikum wa raḥmatullāh ×2",
      badge: salamOnce ? badge() : null
    }
  ];
}

/** The qunut step for Subuh, or null when this school does not add one. */
function fajrQunutSteps(rakaatNumber) {
  const q = Madhhab.fajrQunut();
  if (!q || q.mode !== 'always' || rakaatNumber !== 2) return null;
  const note = P(q.note.en, q.note.id, q.note.ko);

  if (q.position === 'before-ruku') {
    return {
      before: {
        t: P('<b>Qunut</b>, still standing', '<b>Qunut</b>, masih berdiri', '<b>쿠누트</b>, 선 채로') +
           ' <span class="flag only">' + Madhhab.name() + '</span>',
        d: note,
        say: P('the qunut supplication', 'doa qunut', '쿠누트 두아'),
        badge: badge()
      },
      after: null
    };
  }
  return {
    before: null,
    after: {
      t: P("<a href=\"#words\">I'tidal</a>, then <b>qunut</b>", "<a href=\"#words\">I'tidal</a>, lalu <b>qunut</b>", '<a href="#words">이티달</a>, 그다음 <b>쿠누트</b>') +
         ' <span class="flag only">' + Madhhab.name() + '</span>',
      d: note,
      say: "Sami'allāhu liman ḥamidah… " + P('then qunut', 'lalu qunut', '그다음 쿠누트'),
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
        t: P('Stand for rakaat ' + r, 'Berdiri untuk rakaat ' + r, r + '번째 라카아를 위해 서기'),
        d: P('Said as you rise into the standing position.', 'Diucapkan saat kamu bangkit ke posisi berdiri.', '일어서면서 타크비르를 합니다.'),
        say: 'Allāhu akbar'
      });
    }

    steps.push(fatihahStep(voice));

    if (firstTwo) {
      steps.push({
        t: P('A short surah', 'Satu surah pendek', '짧은 수라 하나') + ' <span class="flag only">' + t('only12') + '</span>',
        d: P('Al-Ikhlas, Al-Falaq or An-Nas is the usual beginner choice.',
             'Al-Ikhlas, Al-Falaq, atau An-Nas adalah pilihan pemula yang lazim.', '처음에는 보통 알이클라스, 알팔라끄, 안나스를 읽습니다.'),
        say: 'Qul huwallāhu aḥad…'
      });
    } else {
      steps.push({
        t: P('No extra surah', 'Tanpa surah tambahan', '추가 수라 없음'),
        d: P('From rakaat 3 onward it is Al-Fatihah alone. This is the single most common point of confusion.',
             'Mulai rakaat ke-3 hanya Al-Fatihah saja. Inilah titik yang paling sering membingungkan.', '3번째 라카아부터는 알파티하만 낭송합니다. 가장 많이 헷갈리는 지점입니다.'),
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
          t: P('Stand for rakaat ' + r, 'Berdiri untuk rakaat ' + r, r + '번째 라카아를 위해 서기'),
          d: P('Said as you rise into the standing position.', 'Diucapkan saat kamu bangkit ke posisi berdiri.', '일어서면서 타크비르를 합니다.'),
          say: 'Allāhu akbar'
        });
      }

      /* Whether Witr is recited aloud or quietly varies with circumstance and
         school; the walkthrough makes no claim either way. */
      steps.push(fatihahStep(''));
      steps.push({
        t: P('A short surah', 'Satu surah pendek', '짧은 수라 하나'),
        d: unit.surahEveryRakaat
          ? P('A surah is added in every rakaat of Witr in this school.',
              'Surah ditambahkan pada setiap rakaat Witir dalam mazhab ini.', '이 학파에서는 위트르의 모든 라카아에 수라를 더합니다.')
          : P('Any passage you know. Al-Ikhlas is the usual choice.',
              'Bacaan apa pun yang kamu hafal. Al-Ikhlas adalah pilihan yang lazim.', '외우고 있는 구절이면 무엇이든 됩니다. 보통 알이클라스를 읽습니다.'),
        say: 'Qul huwallāhu aḥad…'
      });

      if (isQunutRakaat && unit.qunut.position === 'before-ruku') {
        steps.push({
          t: P('Takbir, hands raised, then <b>qunut</b>', 'Takbir, angkat tangan, lalu <b>qunut</b>', '타크비르, 두 손 올리기, 그다음 <b>쿠누트</b>'),
          d: P(unit.qunut.scope.en, unit.qunut.scope.id, unit.qunut.scope.ko),
          say: P('the qunut supplication', 'doa qunut', '쿠누트 두아'),
          badge: badge()
        });
      }

      steps.push(rukuStep());

      if (isQunutRakaat && unit.qunut.position === 'after-ruku') {
        steps.push({
          t: P("I'tidal, then <b>qunut</b>", "I'tidal, lalu <b>qunut</b>", '이티달, 그다음 <b>쿠누트</b>'),
          d: P(unit.qunut.scope.en, unit.qunut.scope.id, unit.qunut.scope.ko),
          say: "Sami'allāhu liman ḥamidah… " + P('then qunut', 'lalu qunut', '그다음 쿠누트'),
          badge: badge()
        });
      } else {
        steps.push(itidalStep());
      }

      sujudSteps().forEach((s) => steps.push(s));

      if (unit.middleSitting && r === 2 && !last) {
        steps.push({
          t: P('Sit for the tashahhud — then <b>stand back up</b>', 'Duduk tasyahud — lalu <b>berdiri lagi</b>', '타샤후드를 위해 앉기 — 그다음 <b>다시 서기</b>'),
          d: P('You do not say the salam here. This is what makes the three rakaat one prayer rather than two.',
               'Kamu tidak mengucapkan salam di sini. Inilah yang membuat tiga rakaat itu menjadi satu sholat, bukan dua.', '여기서는 살람을 하지 않습니다. 그래서 세 라카아가 둘이 아니라 하나의 예배가 됩니다.'),
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
