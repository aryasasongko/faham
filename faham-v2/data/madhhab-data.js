/* ============================================================================
   MADHHAB DATA — the single place where school-specific content lives.
   ----------------------------------------------------------------------------
   Nothing else in the codebase may branch on the selected school. If you need a
   new variation, add a field here and read it through `js/madhhab.js`.

   HOW TO READ THIS FILE (for a content reviewer)
   ----------------------------------------------
   Every entry is the *mainstream instructional position* of the school as it is
   normally taught to beginners. Where a school contains more than one respected
   opinion, the alternative is stated inside the same string rather than being
   silently dropped, and the wording avoids "correct/incorrect" framing.

   `review:true` on a block means: a qualified reviewer should confirm this
   before a production release. It does NOT mean the code is unfinished — every
   field below is populated and rendered.

   Arabic text policy: the tashahhud and opening-supplication wordings differ by
   school because the schools follow different narrations. The Arabic given for
   each is the narration that school is known for. These have NOT been collated
   against a printed primary source inside this codebase and are flagged for
   review. The Quranic text elsewhere in the app is untouched.
   ========================================================================== */

export const MADHHAB_KEYS = ['shafii', 'hanafi', 'maliki', 'hanbali'];

export const MADHHAB_META = {
  shafii: {
    key: 'shafii',
    name: "Shafi'i",
    blurb: {
      en: 'The school followed across most of Indonesia, Malaysia, southern India and East Africa.',
      id: 'Mazhab yang diikuti di sebagian besar Indonesia, Malaysia, India selatan, dan Afrika Timur.'
    }
  },
  hanafi: {
    key: 'hanafi',
    name: 'Hanafi',
    blurb: {
      en: 'The school followed across Turkey, the Balkans, Central and South Asia, and much of the Levant.',
      id: 'Mazhab yang diikuti di Turki, Balkan, Asia Tengah dan Selatan, serta sebagian besar Syam.'
    }
  },
  maliki: {
    key: 'maliki',
    name: 'Maliki',
    blurb: {
      en: 'The school followed across North and West Africa, and in parts of the Gulf.',
      id: 'Mazhab yang diikuti di Afrika Utara dan Barat, serta sebagian kawasan Teluk.'
    }
  },
  hanbali: {
    key: 'hanbali',
    name: 'Hanbali',
    blurb: {
      en: 'The school followed most widely in the Arabian Peninsula.',
      id: 'Mazhab yang paling luas diikuti di Semenanjung Arab.'
    }
  }
};

/* ---------------------------------------------------------------------------
   Shared base. A school's entry only needs to state where it departs from this.
   Resolution is a shallow merge per top-level section (see js/madhhab.js).
   ------------------------------------------------------------------------- */

export const MADHHAB_RULES = {

  /* ======================================================================
     SHAFI'I
     ==================================================================== */
  shafii: {
    /* Asr begins when an object's shadow equals its own length plus the
       shadow it cast at noon. Used by the prayer-time engine. */
    asrJuristicMethod: 'standard',

    practice: {
      stance: {
        en: 'Hands folded, right over left, resting below the chest and above the navel.',
        id: 'Tangan bersedekap, kanan di atas kiri, di bawah dada dan di atas pusar.'
      },
      raiseHands: {
        en: 'Hands are raised to shoulder height in four places: the opening takbir, going down into the bow, rising from it, and standing up from the middle sitting.',
        id: 'Tangan diangkat setinggi bahu di empat tempat: takbiratul ihram, saat turun rukuk, saat bangkit darinya, dan saat berdiri dari tasyahud awal.'
      },
      basmalah: {
        en: 'Bismillāh is counted as the first verse of Al-Fatihah and is recited aloud in the prayers that are said aloud.',
        id: 'Bismillah dihitung sebagai ayat pertama Al-Fatihah dan dibaca keras pada sholat yang dikeraskan.'
      },
      amin: {
        en: 'Āmīn is said aloud after Al-Fatihah in the prayers recited aloud.',
        id: 'Amin diucapkan keras setelah Al-Fatihah pada sholat yang dikeraskan.'
      },
      sitting: {
        en: 'Iftirash in the middle sitting — sitting on the left foot with the right upright. Tawarruk in the final sitting: the left foot passes under the right leg and you sit on the floor.',
        id: 'Iftirasy pada duduk pertengahan — duduk di atas telapak kaki kiri dengan kaki kanan ditegakkan. Tawarruk pada duduk terakhir: kaki kiri dikeluarkan ke bawah kaki kanan dan kamu duduk di lantai.'
      },
      finger: {
        en: 'The index finger is raised at "illallāh" and then held still, pointing toward the qibla.',
        id: 'Telunjuk diangkat pada "illallāh" lalu ditahan tidak digerakkan, mengarah ke kiblat.'
      },
      follower: {
        en: 'Behind an imam you still recite Al-Fatihah yourself, in every rakaat, quietly.',
        id: 'Saat bermakmum kamu tetap membaca Al-Fatihah sendiri, di setiap rakaat, dengan lirih.'
      }
    },

    /* Overrides merged over the matching entry in data/parts.js by `key`. */
    parts: {
      takbir: {
        appendMore: {
          en: 'Hands go up to shoulder height as you say it — and in this school they come up again three more times later in the prayer.',
          id: 'Tangan naik setinggi bahu saat mengucapkannya — dan dalam mazhab ini tangan diangkat tiga kali lagi di bagian berikutnya.'
        }
      },
      /* Opening supplication: the "wajjahtu wajhiya" wording, which is what
         data/parts.js already carries. No override needed. */
      itidal: {
        appendMore: {
          en: 'In Subuh, this is the standing position where the qunut is added in the second rakaat.',
          id: 'Di sholat Subuh, di posisi berdiri inilah qunut ditambahkan pada rakaat kedua.'
        }
      },
      tasyahud: {
        note: {
          en: "This is the wording of Ibn 'Abbas, which is the one the Shafi'i school teaches.",
          id: "Ini lafal riwayat Ibnu Abbas, yang diajarkan dalam mazhab Syafi'i."
        }
      },
      salam: {
        note: {
          en: 'Two salams, right then left. Only the first is a pillar of the prayer; the second is sunnah.',
          id: 'Dua salam, ke kanan lalu ke kiri. Hanya yang pertama merupakan rukun; yang kedua sunnah.'
        }
      }
    },

    wudhu: {
      head: {
        d: 'With wet hands. Wiping any part of the head is enough, although most people wipe the whole head. Obligatory.',
        id: 'Dengan tangan basah. Mengusap sebagian kepala saja sudah mencukupi, meski umumnya diusap seluruhnya. Wajib.',
        ob: true
      },
      muwalat: {
        d: 'Doing it continuously. Sunnah in this school, not obligatory — your wudhu is still valid if you were interrupted.',
        id: 'Melakukannya berkesinambungan. Sunnah dalam mazhab ini, bukan wajib — wudhumu tetap sah meski sempat terputus.',
        ob: false
      },
      tartib: {
        d: 'The obligatory acts must follow this sequence. Obligatory — and the intention must be present at the moment you begin washing the face, not merely beforehand.',
        id: 'Rukun-rukun wajib harus dilakukan berurutan. Wajib — dan niat harus hadir pada saat mulai membasuh wajah, bukan sekadar sebelumnya.',
        ob: true
      }
    },

    qunut: {
      /* Standing supplication after rising from the bow. */
      fajr: {
        mode: 'always',
        position: 'after-ruku',
        label: { en: 'Qunut in Subuh', id: 'Qunut Subuh' },
        note: {
          en: 'Said standing after you rise from the bow in the second rakaat of Subuh. Sunnah in this school, and the usual practice in NU-affiliated mosques in Indonesia; Muhammadiyah generally omits it. Follow the mosque you pray in.',
          id: 'Dibaca sambil berdiri setelah bangkit dari rukuk pada rakaat kedua Subuh. Sunnah dalam mazhab ini dan lazim di masjid NU; Muhammadiyah umumnya tidak membacanya. Ikuti kebiasaan masjid tempat kamu sholat.'
        }
      }
    },

    witr: {
      obligation: { en: 'Emphasised sunnah', id: 'Sunnah muakkad' },
      summary: {
        en: 'Anywhere from one to eleven rakaat; three is the common practice, prayed as two rakaat with a salam, then one on its own.',
        id: 'Antara satu sampai sebelas rakaat; tiga adalah praktik yang umum, dikerjakan dua rakaat dengan salam, lalu satu rakaat sendiri.'
      },
      units: [
        { rak: 2, label: { en: 'Two rakaat, then salam', id: 'Dua rakaat, lalu salam' } },
        {
          rak: 1,
          label: { en: 'One rakaat, then salam', id: 'Satu rakaat, lalu salam' },
          qunut: {
            position: 'after-ruku',
            scope: {
              en: 'Qunut is added here in the second half of Ramadan only.',
              id: 'Qunut ditambahkan di sini hanya pada paruh kedua Ramadan.'
            }
          }
        }
      ]
    },

    review: true
  },

  /* ======================================================================
     HANAFI
     ==================================================================== */
  hanafi: {
    /* Asr begins when an object's shadow equals twice its own length plus the
       noon shadow — the single place the school choice touches the clock. */
    asrJuristicMethod: 'hanafi',

    practice: {
      stance: {
        en: 'Hands folded, right over left, held below the navel for men. Women fold them on the chest.',
        id: 'Tangan bersedekap, kanan di atas kiri, diletakkan di bawah pusar bagi laki-laki. Perempuan meletakkannya di dada.'
      },
      raiseHands: {
        en: 'Hands are raised to ear height at the opening takbir and at no other point in the obligatory prayer. They are also raised for the qunut in Witr.',
        id: 'Tangan diangkat setinggi telinga hanya pada takbiratul ihram, tidak di tempat lain dalam sholat wajib. Tangan juga diangkat untuk qunut dalam Witir.'
      },
      basmalah: {
        en: 'Bismillāh is recited silently before Al-Fatihah, including in the prayers said aloud, and is not counted as a verse of the surah.',
        id: 'Bismillah dibaca pelan sebelum Al-Fatihah, termasuk pada sholat yang dikeraskan, dan tidak dihitung sebagai ayat surah.'
      },
      amin: {
        en: 'Āmīn is said silently.',
        id: 'Amin diucapkan pelan.'
      },
      sitting: {
        en: 'Iftirash in every sitting — sitting on the left foot with the right upright, for men. Women sit with both legs to the right side.',
        id: 'Iftirasy di setiap duduk — duduk di atas telapak kaki kiri dengan kaki kanan ditegakkan, bagi laki-laki. Perempuan duduk dengan kedua kaki dikeluarkan ke sisi kanan.'
      },
      finger: {
        en: 'The remaining fingers are closed into a ring; the index finger lifts at "lā ilāha" and is lowered at "illallāh".',
        id: 'Jari-jari lain dikepalkan membentuk lingkaran; telunjuk diangkat pada "lā ilāha" dan diturunkan pada "illallāh".'
      },
      follower: {
        en: 'Behind an imam you do not recite at all — not Al-Fatihah, not a surah. His recitation counts for you.',
        id: 'Saat bermakmum kamu tidak membaca apa pun — tidak Al-Fatihah, tidak surah. Bacaan imam sudah mewakilimu.'
      }
    },

    parts: {
      takbir: {
        appendMore: {
          en: 'Hands go up to ear height, thumbs level with the earlobes, and in this school that is the only place in the obligatory prayer where they are raised.',
          id: 'Tangan diangkat setinggi telinga, ibu jari sejajar cuping, dan dalam mazhab ini itulah satu-satunya tempat tangan diangkat dalam sholat wajib.'
        }
      },
      'fatihah-ref': {
        note: {
          en: 'Praying behind an imam, this school teaches that you do not recite it yourself — the imam’s recitation counts for you.',
          id: 'Saat bermakmum, mazhab ini mengajarkan kamu tidak membacanya sendiri — bacaan imam sudah mewakilimu.'
        }
      },
      itidal: {
        appendMore: {
          en: 'There is no regular Subuh qunut in this school — the standing supplication belongs to Witr.',
          id: 'Tidak ada qunut Subuh rutin dalam mazhab ini — doa qunut tempatnya di Witir.'
        }
      },
      iftitah: {
        t: 'Thanā — the opening supplication', tid: 'Tsana — doa pembuka',
        ar: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ',
        tl: 'Subḥānakallāhumma wa biḥamdika wa tabārakasmuka wa ta\'ālā jadduka wa lā ilāha ghayruk',
        en: 'Glory be to You, O God, and praise. Blessed is Your name, exalted is Your majesty, and there is no god but You.',
        id: 'Maha Suci Engkau ya Allah, dan segala puji bagi-Mu. Maha Berkah nama-Mu, Maha Tinggi keagungan-Mu, dan tidak ada tuhan selain Engkau.',
        why: {
          en: 'Shorter than the wording used further west, and it does the same work: it opens with praise before a single request is made.',
          id: 'Lebih pendek daripada lafal yang dipakai di barat, dan fungsinya sama: membuka dengan pujian sebelum satu permintaan pun diucapkan.'
        },
        note: {
          en: 'Said silently in the first rakaat only, before the taʿawwudh and Al-Fatihah.',
          id: 'Dibaca pelan hanya di rakaat pertama, sebelum taawudz dan Al-Fatihah.'
        },
        more: ['It is said in the gap between the opening takbir and the recitation. If your teacher gives you a different transmitted wording, use theirs — it is not a correction, just a different valid narration.'],
        moreid: ['Dibaca di sela antara takbiratul ihram dan bacaan. Kalau gurumu memberi lafal riwayat yang berbeda, pakai versi beliau — itu bukan koreksi, hanya riwayat sah yang lain.']
      },
      tasyahud: {
        ar: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ۝ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۝ السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ ۝ أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        tl: "At-taḥiyyātu lillāhi waṣ-ṣalawātu waṭ-ṭayyibāt. As-salāmu 'alaika ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu 'alainā wa 'alā 'ibādillāhiṣ-ṣāliḥīn. Asyhadu allā ilāha illallāh, wa asyhadu anna Muḥammadan 'abduhū wa rasūluh.",
        en: 'All greetings, prayers and good things belong to God. Peace be upon you, O Prophet, and the mercy of God and His blessings. Peace be upon us and upon the righteous servants of God. I bear witness that there is no god but God, and I bear witness that Muhammad is His servant and His Messenger.',
        id: 'Segala penghormatan, sholawat, dan kebaikan adalah milik Allah. Semoga keselamatan atasmu, wahai Nabi, beserta rahmat Allah dan berkah-Nya. Semoga keselamatan atas kami dan atas hamba-hamba Allah yang saleh. Aku bersaksi bahwa tiada tuhan selain Allah, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.',
        note: {
          en: "This is the wording of Ibn Mas'ud, which is the one this school teaches. Note the closing phrase: \"His servant and His Messenger\".",
          id: 'Ini lafal riwayat Ibnu Mas\'ud, yang diajarkan dalam mazhab ini. Perhatikan penutupnya: "hamba dan utusan-Nya".'
        }
      },
      salam: {
        note: {
          en: 'Two salams, right then left.',
          id: 'Dua salam, ke kanan lalu ke kiri.'
        }
      }
    },

    wudhu: {
      niyyah: {
        d: 'Formed in the heart as you begin. In this school the intention is a strong sunnah rather than a condition of validity — the washing itself is what the obligation attaches to.',
        id: 'Dibentuk dalam hati saat memulai. Dalam mazhab ini niat adalah sunnah yang kuat, bukan syarat sah — kewajibannya melekat pada basuhannya sendiri.',
        ob: false
      },
      head: {
        d: 'With wet hands, over at least a quarter of the head. Obligatory.',
        id: 'Dengan tangan basah, sekurang-kurangnya seperempat kepala. Wajib.',
        ob: true
      },
      tartib: {
        d: 'Following this sequence is a sunnah in this school rather than an obligation, though there is no reason to depart from it.',
        id: 'Mengikuti urutan ini sunnah dalam mazhab ini, bukan kewajiban, meski tidak ada alasan untuk menyalahinya.',
        ob: false
      },
      muwalat: {
        d: 'Doing it continuously. Sunnah in this school, not obligatory.',
        id: 'Melakukannya berkesinambungan. Sunnah dalam mazhab ini, bukan wajib.',
        ob: false
      }
    },

    qunut: {
      fajr: {
        mode: 'nazilah',
        position: null,
        label: { en: 'No qunut in Subuh', id: 'Tanpa qunut Subuh' },
        note: {
          en: 'There is no regular qunut in Subuh in this school. The standing supplication belongs to Witr instead, and a qunut for calamity may be led by the imam when circumstances call for it.',
          id: 'Tidak ada qunut rutin di Subuh dalam mazhab ini. Doa qunut tempatnya di Witir, dan qunut nazilah dapat dipimpin imam ketika keadaan menuntutnya.'
        }
      }
    },

    witr: {
      obligation: { en: 'Wajib', id: 'Wajib' },
      summary: {
        en: 'Three rakaat prayed as one unit with a single salam at the end — you sit for a tashahhud after the second rakaat but stand back up rather than finishing. Qunut is said in the third rakaat, standing, before the bow.',
        id: 'Tiga rakaat dikerjakan sebagai satu kesatuan dengan satu salam di akhir — kamu duduk tasyahud setelah rakaat kedua lalu berdiri lagi, bukan menyelesaikannya. Qunut dibaca pada rakaat ketiga, sambil berdiri, sebelum rukuk.'
      },
      units: [
        {
          rak: 3,
          joined: true,
          middleSitting: true,
          surahEveryRakaat: true,
          label: { en: 'Three rakaat, one salam', id: 'Tiga rakaat, satu salam' },
          qunut: {
            position: 'before-ruku',
            rakaat: 3,
            scope: {
              en: 'Qunut is said in the third rakaat all year, after the recitation and before the bow, preceded by a takbir with the hands raised.',
              id: 'Qunut dibaca pada rakaat ketiga sepanjang tahun, setelah bacaan dan sebelum rukuk, didahului takbir dengan mengangkat tangan.'
            }
          }
        }
      ]
    },

    review: true
  },

  /* ======================================================================
     MALIKI
     ==================================================================== */
  maliki: {
    asrJuristicMethod: 'standard',

    practice: {
      stance: {
        en: 'Arms let down at the sides in the obligatory prayers is the practice this school is known for. Folding the hands is also reported within the school and is widely done; neither is treated as invalidating the prayer.',
        id: 'Tangan diluruskan di samping badan pada sholat wajib adalah praktik yang dikenal dari mazhab ini. Bersedekap juga diriwayatkan di dalam mazhab dan banyak dilakukan; keduanya tidak membatalkan sholat.'
      },
      raiseHands: {
        en: 'Hands are raised at the opening takbir. Raising them elsewhere is reported within the school but is not the taught default.',
        id: 'Tangan diangkat pada takbiratul ihram. Mengangkatnya di tempat lain diriwayatkan dalam mazhab ini, tetapi bukan yang diajarkan sebagai kebiasaan.'
      },
      basmalah: {
        en: 'Bismillāh is not recited before Al-Fatihah in the obligatory prayer — neither aloud nor silently. Al-Fatihah begins at "al-ḥamdu lillāh".',
        id: 'Bismillah tidak dibaca sebelum Al-Fatihah dalam sholat wajib — tidak keras maupun pelan. Al-Fatihah dimulai dari "al-ḥamdu lillāh".'
      },
      amin: {
        en: 'The person praying alone and the follower say āmīn quietly; the imam does not say it aloud in the taught practice.',
        id: 'Orang yang sholat sendiri dan makmum mengucapkan amin dengan lirih; imam tidak mengeraskannya dalam praktik yang diajarkan.'
      },
      sitting: {
        en: 'Tawarruk in every sitting — the left foot passes under the right leg and you sit on the floor, including the middle sitting.',
        id: 'Tawarruk di setiap duduk — kaki kiri dikeluarkan ke bawah kaki kanan dan kamu duduk di lantai, termasuk pada duduk pertengahan.'
      },
      finger: {
        en: 'The index finger is moved gently from side to side through the tashahhud rather than held still.',
        id: 'Telunjuk digerakkan perlahan ke kanan dan kiri sepanjang tasyahud, bukan ditahan diam.'
      },
      follower: {
        en: 'Behind an imam you recite Al-Fatihah in the silent prayers and stay quiet in the ones recited aloud, listening to his recitation.',
        id: 'Saat bermakmum kamu membaca Al-Fatihah pada sholat yang pelan, dan diam mendengarkan pada sholat yang dikeraskan.'
      }
    },

    parts: {
      takbir: {
        appendMore: {
          en: 'Hands go up at this takbir. In this school that is the only place they are raised.',
          id: 'Tangan diangkat pada takbir ini. Dalam mazhab ini hanya di sinilah tangan diangkat.'
        }
      },
      itidal: {
        appendMore: {
          en: 'In this school the Subuh qunut is said quietly before the bow, so nothing extra is added at this standing.',
          id: 'Dalam mazhab ini qunut Subuh dibaca lirih sebelum rukuk, jadi tidak ada tambahan pada berdiri ini.'
        }
      },
      iftitah: {
        omit: true,
        times: '', timesid: '',
        more: [], moreid: [],
        t: 'Straight into Al-Fatihah', tid: 'Langsung ke Al-Fatihah',
        en: 'This school does not add an opening supplication. After the takbir you begin Al-Fatihah directly — and without the basmalah.',
        id: 'Mazhab ini tidak menambahkan doa iftitah. Setelah takbir kamu langsung memulai Al-Fatihah — dan tanpa basmalah.',
        why: {
          en: 'The reasoning is that the prayer as transmitted in the school\'s practice moves from the takbir to the recitation without a pause, so nothing is inserted between them.',
          id: 'Alasannya, sholat sebagaimana diamalkan dalam mazhab ini berpindah dari takbir langsung ke bacaan tanpa jeda, sehingga tidak ada yang disisipkan di antaranya.'
        }
      },
      tasyahud: {
        ar: 'التَّحِيَّاتُ لِلَّهِ ۝ الزَّاكِيَاتُ لِلَّهِ ۝ الطَّيِّبَاتُ الصَّلَوَاتُ لِلَّهِ ۝ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۝ السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ ۝ أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        tl: "At-taḥiyyātu lillāh, az-zākiyātu lillāh, aṭ-ṭayyibātuṣ-ṣalawātu lillāh. As-salāmu 'alaika ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu 'alainā wa 'alā 'ibādillāhiṣ-ṣāliḥīn. Asyhadu allā ilāha illallāhu waḥdahū lā syarīka lah, wa asyhadu anna Muḥammadan 'abduhū wa rasūluh.",
        en: 'All greetings belong to God; all pure things belong to God; all good things and prayers belong to God. Peace be upon you, O Prophet, and the mercy of God and His blessings. Peace be upon us and upon the righteous servants of God. I bear witness that there is no god but God alone, with no partner, and I bear witness that Muhammad is His servant and His Messenger.',
        id: 'Segala penghormatan milik Allah; segala yang suci milik Allah; segala kebaikan dan sholawat milik Allah. Semoga keselamatan atasmu, wahai Nabi, beserta rahmat Allah dan berkah-Nya. Semoga keselamatan atas kami dan atas hamba-hamba Allah yang saleh. Aku bersaksi bahwa tiada tuhan selain Allah semata, tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.',
        note: {
          en: "This is the wording transmitted from 'Umar, which is the one this school teaches.",
          id: 'Ini lafal yang diriwayatkan dari Umar, yang diajarkan dalam mazhab ini.'
        }
      },
      salam: {
        times: 'Once', timesid: 'Sekali',
        more: ['This is what releases you from the boundary the opening takbir created. After the salam, everything that was closed off is open again.',
               'In this school a single salam to the right completes the prayer when praying alone. Behind an imam you also return his salam, and greet to the left when someone is praying there.',
               'The design is worth sitting with: a private act of worship is not allowed to end privately. It ends by wishing peace on whoever is beside you.'],
        moreid: ['Inilah yang melepaskanmu dari batas yang diciptakan takbiratul ihram. Setelah salam, semua yang tadi tertutup kembali terbuka.',
                 'Dalam mazhab ini, satu salam ke kanan menyempurnakan sholat saat kamu sholat sendiri. Saat bermakmum kamu juga menjawab salam imam, dan memberi salam ke kiri bila ada orang yang sholat di sana.',
                 'Rancangan ini layak direnungkan: ibadah yang bersifat pribadi tidak dibiarkan berakhir secara pribadi. Ia berakhir dengan mendoakan keselamatan bagi siapa pun yang ada di sebelahmu.'],
        note: {
          en: 'Praying alone, one salam to the right is what this school teaches. Behind an imam a second is added toward him, and a third to the left if someone is there.',
          id: 'Saat sholat sendiri, satu salam ke kanan itulah yang diajarkan mazhab ini. Saat bermakmum ditambahkan salam kepada imam, dan ke kiri bila ada orang di sana.'
        }
      }
    },

    wudhu: {
      head: {
        d: 'With wet hands, over the whole head, front to back and back again. Obligatory.',
        id: 'Dengan tangan basah, seluruh kepala, dari depan ke belakang lalu kembali. Wajib.',
        ob: true
      },
      muwalat: {
        d: 'Doing it continuously, so one limb has not dried before the next is washed. Obligatory in this school.',
        id: 'Melakukannya berkesinambungan, sehingga satu anggota belum kering sebelum yang berikutnya dibasuh. Wajib dalam mazhab ini.',
        ob: true
      },
      hands: {
        d: 'Three times. Sunnah — and this school adds rubbing (dalk): passing the hand over each limb as the water runs, which is itself obligatory here.',
        id: 'Tiga kali. Sunnah — dan mazhab ini menambahkan dalk: menggosok setiap anggota saat air mengalir, yang di sini hukumnya wajib.',
        ob: false
      }
    },

    qunut: {
      fajr: {
        mode: 'always',
        position: 'before-ruku',
        label: { en: 'Qunut in Subuh', id: 'Qunut Subuh' },
        note: {
          en: 'Recommended in the second rakaat of Subuh, said quietly while still standing, before you bow. Saying it after rising from the bow is also permitted in the school, but before the bow is the taught practice.',
          id: 'Dianjurkan pada rakaat kedua Subuh, dibaca lirih sambil masih berdiri, sebelum rukuk. Membacanya setelah bangkit dari rukuk juga dibolehkan dalam mazhab ini, tetapi sebelum rukuk adalah yang diajarkan.'
        }
      }
    },

    witr: {
      obligation: { en: 'Emphasised sunnah', id: 'Sunnah muakkad' },
      summary: {
        en: 'One rakaat, preceded by two rakaat called the shafʿ with a salam between them. Witr itself is that single closing rakaat, and no qunut is added to it.',
        id: 'Satu rakaat, didahului dua rakaat yang disebut syaf\' dengan salam di antaranya. Witir sendiri adalah satu rakaat penutup itu, dan tidak ditambahkan qunut padanya.'
      },
      units: [
        { rak: 2, label: { en: "Shafʿ — two rakaat, then salam", id: "Syaf' — dua rakaat, lalu salam" } },
        { rak: 1, label: { en: 'Witr — one rakaat, then salam', id: 'Witir — satu rakaat, lalu salam' } }
      ]
    },

    review: true
  },

  /* ======================================================================
     HANBALI
     ==================================================================== */
  hanbali: {
    asrJuristicMethod: 'standard',

    practice: {
      stance: {
        en: 'Hands folded, right over left, held below the navel.',
        id: 'Tangan bersedekap, kanan di atas kiri, diletakkan di bawah pusar.'
      },
      raiseHands: {
        en: 'Hands are raised to shoulder height in three places: the opening takbir, going down into the bow, and rising from it.',
        id: 'Tangan diangkat setinggi bahu di tiga tempat: takbiratul ihram, saat turun rukuk, dan saat bangkit darinya.'
      },
      basmalah: {
        en: 'Bismillāh is recited silently before Al-Fatihah, including in the prayers said aloud.',
        id: 'Bismillah dibaca pelan sebelum Al-Fatihah, termasuk pada sholat yang dikeraskan.'
      },
      amin: {
        en: 'Āmīn is said aloud after Al-Fatihah in the prayers recited aloud.',
        id: 'Amin diucapkan keras setelah Al-Fatihah pada sholat yang dikeraskan.'
      },
      sitting: {
        en: 'Iftirash in the middle sitting, tawarruk in the final sitting of any prayer that has two sittings.',
        id: 'Iftirasy pada duduk pertengahan, tawarruk pada duduk terakhir sholat yang punya dua kali duduk.'
      },
      finger: {
        en: "The index finger points at each mention of God's name through the tashahhud, without being moved side to side.",
        id: 'Telunjuk menunjuk setiap kali nama Allah disebut sepanjang tasyahud, tanpa digerakkan ke kanan-kiri.'
      },
      follower: {
        en: 'Behind an imam it is recommended to recite Al-Fatihah in the pauses of the loud prayers, and you recite it yourself in the silent ones.',
        id: 'Saat bermakmum dianjurkan membaca Al-Fatihah di sela-sela bacaan imam pada sholat yang dikeraskan, dan kamu membacanya sendiri pada sholat yang pelan.'
      }
    },

    parts: {
      takbir: {
        appendMore: {
          en: 'Hands go up to shoulder height as you say it, and again twice more around the bow.',
          id: 'Tangan naik setinggi bahu saat mengucapkannya, dan naik dua kali lagi di sekitar rukuk.'
        }
      },
      itidal: {
        appendMore: {
          en: 'There is no regular Subuh qunut in this school — the qunut belongs to Witr, after this same rising.',
          id: 'Tidak ada qunut Subuh rutin dalam mazhab ini — qunut tempatnya di Witir, setelah bangkit yang sama.'
        }
      },
      iftitah: {
        t: 'The opening supplication', tid: 'Doa pembuka',
        ar: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ',
        tl: 'Subḥānakallāhumma wa biḥamdika wa tabārakasmuka wa ta\'ālā jadduka wa lā ilāha ghayruk',
        en: 'Glory be to You, O God, and praise. Blessed is Your name, exalted is Your majesty, and there is no god but You.',
        id: 'Maha Suci Engkau ya Allah, dan segala puji bagi-Mu. Maha Berkah nama-Mu, Maha Tinggi keagungan-Mu, dan tidak ada tuhan selain Engkau.',
        why: {
          en: 'The wording this school teaches. Short, said once, and entirely praise before any request is made.',
          id: 'Lafal yang diajarkan mazhab ini. Pendek, dibaca sekali, dan seluruhnya pujian sebelum ada permintaan.'
        },
        note: {
          en: 'Said silently in the first rakaat only.',
          id: 'Dibaca pelan hanya di rakaat pertama.'
        },
        more: ['It is said in the gap between the opening takbir and the recitation. If your teacher gives you a different transmitted wording, use theirs — it is not a correction, just a different valid narration.'],
        moreid: ['Dibaca di sela antara takbiratul ihram dan bacaan. Kalau gurumu memberi lafal riwayat yang berbeda, pakai versi beliau — itu bukan koreksi, hanya riwayat sah yang lain.']
      },
      tasyahud: {
        ar: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ۝ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۝ السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ ۝ أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        tl: "At-taḥiyyātu lillāhi waṣ-ṣalawātu waṭ-ṭayyibāt. As-salāmu 'alaika ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu 'alainā wa 'alā 'ibādillāhiṣ-ṣāliḥīn. Asyhadu allā ilāha illallāh, wa asyhadu anna Muḥammadan 'abduhū wa rasūluh.",
        en: 'All greetings, prayers and good things belong to God. Peace be upon you, O Prophet, and the mercy of God and His blessings. Peace be upon us and upon the righteous servants of God. I bear witness that there is no god but God, and I bear witness that Muhammad is His servant and His Messenger.',
        id: 'Segala penghormatan, sholawat, dan kebaikan adalah milik Allah. Semoga keselamatan atasmu, wahai Nabi, beserta rahmat Allah dan berkah-Nya. Semoga keselamatan atas kami dan atas hamba-hamba Allah yang saleh. Aku bersaksi bahwa tiada tuhan selain Allah, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.',
        note: {
          en: "This is the wording of Ibn Mas'ud, which is the one this school teaches.",
          id: "Ini lafal riwayat Ibnu Mas'ud, yang diajarkan dalam mazhab ini."
        }
      },
      salam: {
        note: {
          en: 'Two salams, right then left.',
          id: 'Dua salam, ke kanan lalu ke kiri.'
        }
      }
    },

    wudhu: {
      head: {
        d: 'With wet hands, over the whole head including the ears. Obligatory — the ears are counted as part of the head here rather than as a separate sunnah.',
        id: 'Dengan tangan basah, seluruh kepala termasuk kedua telinga. Wajib — telinga dihitung bagian kepala di sini, bukan sunnah tersendiri.',
        ob: true
      },
      ears: {
        d: 'Wiped together with the head rather than as a separate step. Obligatory in this school.',
        id: 'Diusap bersama kepala, bukan sebagai langkah terpisah. Wajib dalam mazhab ini.',
        ob: true
      },
      muwalat: {
        d: 'Doing it continuously, so one limb has not dried before the next is washed. Obligatory in this school.',
        id: 'Melakukannya berkesinambungan, sehingga satu anggota belum kering sebelum yang berikutnya dibasuh. Wajib dalam mazhab ini.',
        ob: true
      }
    },

    qunut: {
      fajr: {
        mode: 'nazilah',
        position: null,
        label: { en: 'No qunut in Subuh', id: 'Tanpa qunut Subuh' },
        note: {
          en: 'There is no regular qunut in Subuh in this school. The standing supplication belongs to Witr, and a qunut for calamity may be led by the imam when circumstances call for it.',
          id: 'Tidak ada qunut rutin di Subuh dalam mazhab ini. Doa qunut tempatnya di Witir, dan qunut nazilah dapat dipimpin imam ketika keadaan menuntutnya.'
        }
      }
    },

    witr: {
      obligation: { en: 'Emphasised sunnah', id: 'Sunnah muakkad' },
      summary: {
        en: 'Commonly three rakaat: two with a salam, then one on its own. Qunut is said in that final rakaat after you rise from the bow, throughout the year.',
        id: 'Umumnya tiga rakaat: dua rakaat dengan salam, lalu satu rakaat sendiri. Qunut dibaca pada rakaat terakhir itu setelah bangkit dari rukuk, sepanjang tahun.'
      },
      units: [
        { rak: 2, label: { en: 'Two rakaat, then salam', id: 'Dua rakaat, lalu salam' } },
        {
          rak: 1,
          label: { en: 'One rakaat, then salam', id: 'Satu rakaat, lalu salam' },
          qunut: {
            position: 'after-ruku',
            scope: {
              en: 'Qunut is said here all year, after rising from the bow.',
              id: 'Qunut dibaca di sini sepanjang tahun, setelah bangkit dari rukuk.'
            }
          }
        }
      ]
    },

    review: true
  }
};

/* Rows rendered in Settings → "Where the schools differ", and the source of the
   review table in the accompanying notes. `key` indexes into rules.practice. */
export const PRACTICE_ROWS = [
  { key: 'stance',      label: { en: 'Hands while standing',   id: 'Posisi tangan saat berdiri' } },
  { key: 'raiseHands',  label: { en: 'Raising the hands',      id: 'Mengangkat tangan' } },
  { key: 'basmalah',    label: { en: 'Basmalah',               id: 'Basmalah' } },
  { key: 'amin',        label: { en: 'Saying āmīn',            id: 'Mengucapkan amin' } },
  { key: 'sitting',     label: { en: 'How you sit',            id: 'Cara duduk' } },
  { key: 'finger',      label: { en: 'The index finger',       id: 'Telunjuk' } },
  { key: 'follower',    label: { en: 'Behind an imam',         id: 'Saat bermakmum' } }
];
