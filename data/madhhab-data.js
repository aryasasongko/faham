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
      id: 'Mazhab yang diikuti di sebagian besar Indonesia, Malaysia, India selatan, dan Afrika Timur.',
      ko: '인도네시아 대부분 지역과 말레이시아, 남인도, 동아프리카에서 따르는 학파입니다.'
    }
  },
  hanafi: {
    key: 'hanafi',
    name: 'Hanafi',
    blurb: {
      en: 'The school followed across Turkey, the Balkans, Central and South Asia, and much of the Levant.',
      id: 'Mazhab yang diikuti di Turki, Balkan, Asia Tengah dan Selatan, serta sebagian besar Syam.',
      ko: '터키와 발칸반도, 중앙아시아와 남아시아, 그리고 레반트 지역 대부분에서 따르는 학파입니다.'
    }
  },
  maliki: {
    key: 'maliki',
    name: 'Maliki',
    blurb: {
      en: 'The school followed across North and West Africa, and in parts of the Gulf.',
      id: 'Mazhab yang diikuti di Afrika Utara dan Barat, serta sebagian kawasan Teluk.',
      ko: '북아프리카와 서아프리카, 그리고 걸프 지역 일부에서 따르는 학파입니다.'
    }
  },
  hanbali: {
    key: 'hanbali',
    name: 'Hanbali',
    blurb: {
      en: 'The school followed most widely in the Arabian Peninsula.',
      id: 'Mazhab yang paling luas diikuti di Semenanjung Arab.',
      ko: '아라비아반도에서 가장 널리 따르는 학파입니다.'
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
        id: 'Tangan bersedekap, kanan di atas kiri, di bawah dada dan di atas pusar.',
      ko: '오른손을 왼손 위에 포개어 가슴 아래, 배꼽 위에 둡니다.'
      },
      raiseHands: {
        en: 'Hands are raised to shoulder height in four places: the opening takbir, going down into the bow, rising from it, and standing up from the middle sitting.',
        id: 'Tangan diangkat setinggi bahu di empat tempat: takbiratul ihram, saat turun rukuk, saat bangkit darinya, dan saat berdiri dari tasyahud awal.',
      ko: '네 곳에서 손을 어깨 높이까지 듭니다. 시작 타크비르, 루쿠로 내려갈 때, 루쿠에서 일어설 때, 그리고 중간 앉기에서 일어설 때입니다.'
      },
      basmalah: {
        en: 'Bismillāh is counted as the first verse of Al-Fatihah and is recited aloud in the prayers that are said aloud.',
        id: 'Bismillah dihitung sebagai ayat pertama Al-Fatihah dan dibaca keras pada sholat yang dikeraskan.',
      ko: '바스말라를 알파티하의 첫 구절로 세며, 소리 내어 읽는 예배에서는 소리 내어 낭송합니다.'
      },
      amin: {
        en: 'Āmīn is said aloud after Al-Fatihah in the prayers recited aloud.',
        id: 'Amin diucapkan keras setelah Al-Fatihah pada sholat yang dikeraskan.',
      ko: '소리 내어 읽는 예배에서는 알파티하 뒤에 아민을 소리 내어 말합니다.'
      },
      sitting: {
        en: 'Iftirash in the middle sitting — sitting on the left foot with the right upright. Tawarruk in the final sitting: the left foot passes under the right leg and you sit on the floor.',
        id: 'Iftirasy pada duduk pertengahan — duduk di atas telapak kaki kiri dengan kaki kanan ditegakkan. Tawarruk pada duduk terakhir: kaki kiri dikeluarkan ke bawah kaki kanan dan kamu duduk di lantai.',
      ko: '중간 앉기에서는 이프티라시(왼발 위에 앉고 오른발은 세우는 자세)를 취합니다. 마지막 앉기에서는 타와루크입니다. 왼발을 오른쪽 다리 아래로 빼고 바닥에 앉습니다.'
      },
      finger: {
        en: 'The index finger is raised at "illallāh" and then held still, pointing toward the qibla.',
        id: 'Telunjuk diangkat pada "illallāh" lalu ditahan tidak digerakkan, mengarah ke kiblat.',
      ko: '검지는 “일랄라”에서 들어 올린 뒤 움직이지 않고 키블라 쪽을 향하게 둡니다.'
      },
      follower: {
        en: 'Behind an imam you still recite Al-Fatihah yourself, in every rakaat, quietly.',
        id: 'Saat bermakmum kamu tetap membaca Al-Fatihah sendiri, di setiap rakaat, dengan lirih.',
      ko: '이맘 뒤에서 예배할 때에도 매 라카아마다 알파티하를 직접 조용히 낭송합니다.'
      }
    },

    /* Overrides merged over the matching entry in data/parts.js by `key`. */
    parts: {
      takbir: {
        appendMore: {
          en: 'Hands go up to shoulder height as you say it — and in this school they come up again three more times later in the prayer.',
          id: 'Tangan naik setinggi bahu saat mengucapkannya — dan dalam mazhab ini tangan diangkat tiga kali lagi di bagian berikutnya.',
      ko: '이 말을 하면서 손을 어깨 높이까지 듭니다 — 이 학파에서는 예배 뒷부분에서 손을 세 번 더 듭니다.'
        }
      },
      /* Opening supplication: the "wajjahtu wajhiya" wording, which is what
         data/parts.js already carries. No override needed. */
      itidal: {
        appendMore: {
          en: 'In Subuh, this is the standing position where the qunut is added in the second rakaat.',
          id: 'Di sholat Subuh, di posisi berdiri inilah qunut ditambahkan pada rakaat kedua.',
      ko: '파즈르 예배에서는 둘째 라카아의 이 이티달에서 쿠누트를 더합니다.'
        }
      },
      tasyahud: {
        note: {
          en: "This is the wording of Ibn 'Abbas, which is the one the Shafi'i school teaches.",
          id: "Ini lafal riwayat Ibnu Abbas, yang diajarkan dalam mazhab Syafi'i.",
      ko: '이것은 이븐 압바스가 전한 문구로, 샤피이 학파에서 가르치는 문구입니다.'
        }
      },
      salam: {
        note: {
          en: 'Two salams, right then left. Only the first is a pillar of the prayer; the second is sunnah.',
          id: 'Dua salam, ke kanan lalu ke kiri. Hanya yang pertama merupakan rukun; yang kedua sunnah.',
      ko: '살람을 두 번, 오른쪽 다음 왼쪽으로 합니다. 첫 번째만 예배의 필수 요소이고, 두 번째는 순나입니다.'
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
        label: { en: 'Qunut in Subuh', id: 'Qunut Subuh',
      ko: '파즈르의 쿠누트' },
        note: {
          en: 'Said standing after you rise from the bow in the second rakaat of Subuh. Sunnah in this school, and the usual practice in NU-affiliated mosques in Indonesia; Muhammadiyah generally omits it. Follow the mosque you pray in.',
          id: 'Dibaca sambil berdiri setelah bangkit dari rukuk pada rakaat kedua Subuh. Sunnah dalam mazhab ini dan lazim di masjid NU; Muhammadiyah umumnya tidak membacanya. Ikuti kebiasaan masjid tempat kamu sholat.',
      ko: '파즈르 둘째 라카아에서 루쿠에서 일어선 뒤 선 채로 읽습니다. 이 학파에서는 순나이며, 인도네시아의 NU 계열 마스지드에서 흔히 하는 관행입니다. 무함마디야는 대체로 읽지 않습니다. 예배드리는 마스지드의 관행을 따르세요.'
        }
      }
    },

    witr: {
      obligation: { en: 'Emphasised sunnah', id: 'Sunnah muakkad',
      ko: '강조된 순나' },
      summary: {
        en: 'Anywhere from one to eleven rakaat; three is the common practice, prayed as two rakaat with a salam, then one on its own.',
        id: 'Antara satu sampai sebelas rakaat; tiga adalah praktik yang umum, dikerjakan dua rakaat dengan salam, lalu satu rakaat sendiri.',
      ko: '한 라카아에서 열한 라카아까지 가능하며, 세 라카아가 일반적인 관행입니다. 두 라카아를 드리고 살람을 한 뒤, 한 라카아를 따로 드립니다.'
      },
      units: [
        { rak: 2, label: { en: 'Two rakaat, then salam', id: 'Dua rakaat, lalu salam',
      ko: '두 라카아, 그다음 살람' } },
        {
          rak: 1,
          label: { en: 'One rakaat, then salam', id: 'Satu rakaat, lalu salam',
      ko: '한 라카아, 그다음 살람' },
          qunut: {
            position: 'after-ruku',
            scope: {
              en: 'Qunut is added here in the second half of Ramadan only.',
              id: 'Qunut ditambahkan di sini hanya pada paruh kedua Ramadan.',
      ko: '여기에서는 라마단 후반부에만 쿠누트를 더합니다.'
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
        id: 'Tangan bersedekap, kanan di atas kiri, diletakkan di bawah pusar bagi laki-laki. Perempuan meletakkannya di dada.',
      ko: '오른손을 왼손 위에 포개어, 남성은 배꼽 아래에 둡니다. 여성은 가슴 위에 둡니다.'
      },
      raiseHands: {
        en: 'Hands are raised to ear height at the opening takbir and at no other point in the obligatory prayer. They are also raised for the qunut in Witr.',
        id: 'Tangan diangkat setinggi telinga hanya pada takbiratul ihram, tidak di tempat lain dalam sholat wajib. Tangan juga diangkat untuk qunut dalam Witir.',
      ko: '의무 예배에서는 시작 타크비르에서만 손을 귀 높이까지 들고, 다른 곳에서는 들지 않습니다. 위트르의 쿠누트에서도 손을 듭니다.'
      },
      basmalah: {
        en: 'Bismillāh is recited silently before Al-Fatihah, including in the prayers said aloud, and is not counted as a verse of the surah.',
        id: 'Bismillah dibaca pelan sebelum Al-Fatihah, termasuk pada sholat yang dikeraskan, dan tidak dihitung sebagai ayat surah.',
      ko: '바스말라는 소리 내어 읽는 예배에서도 알파티하 앞에서 조용히 낭송하며, 수라의 구절로 세지 않습니다.'
      },
      amin: {
        en: 'Āmīn is said silently.',
        id: 'Amin diucapkan pelan.',
      ko: '아민은 조용히 말합니다.'
      },
      sitting: {
        en: 'Iftirash in every sitting — sitting on the left foot with the right upright, for men. Women sit with both legs to the right side.',
        id: 'Iftirasy di setiap duduk — duduk di atas telapak kaki kiri dengan kaki kanan ditegakkan, bagi laki-laki. Perempuan duduk dengan kedua kaki dikeluarkan ke sisi kanan.',
      ko: '모든 앉기에서 이프티라시를 취합니다. 남성은 왼발 위에 앉고 오른발은 세웁니다. 여성은 두 다리를 모두 오른쪽으로 빼고 앉습니다.'
      },
      finger: {
        en: 'The remaining fingers are closed into a ring; the index finger lifts at "lā ilāha" and is lowered at "illallāh".',
        id: 'Jari-jari lain dikepalkan membentuk lingkaran; telunjuk diangkat pada "lā ilāha" dan diturunkan pada "illallāh".',
      ko: '나머지 손가락은 고리 모양으로 모으고, 검지는 “라 일라하”에서 들었다가 “일랄라”에서 내립니다.'
      },
      follower: {
        en: 'Behind an imam you do not recite at all — not Al-Fatihah, not a surah. His recitation counts for you.',
        id: 'Saat bermakmum kamu tidak membaca apa pun — tidak Al-Fatihah, tidak surah. Bacaan imam sudah mewakilimu.',
      ko: '이맘 뒤에서는 알파티하도, 수라도 전혀 낭송하지 않습니다. 이맘의 낭송으로 충분합니다.'
      }
    },

    parts: {
      takbir: {
        appendMore: {
          en: 'Hands go up to ear height, thumbs level with the earlobes, and in this school that is the only place in the obligatory prayer where they are raised.',
          id: 'Tangan diangkat setinggi telinga, ibu jari sejajar cuping, dan dalam mazhab ini itulah satu-satunya tempat tangan diangkat dalam sholat wajib.',
      ko: '손은 귀 높이까지 들어 엄지를 귓불과 나란히 두며, 이 학파에서는 의무 예배 중 손을 드는 곳이 이곳뿐입니다.'
        }
      },
      'fatihah-ref': {
        note: {
          en: 'Praying behind an imam, this school teaches that you do not recite it yourself — the imam’s recitation counts for you.',
          id: 'Saat bermakmum, mazhab ini mengajarkan kamu tidak membacanya sendiri — bacaan imam sudah mewakilimu.',
      ko: '이맘 뒤에서 예배할 때 이 학파에서는 직접 낭송하지 않는다고 가르칩니다 — 이맘의 낭송으로 충분합니다.'
        }
      },
      itidal: {
        appendMore: {
          en: 'There is no regular Subuh qunut in this school — the standing supplication belongs to Witr.',
          id: 'Tidak ada qunut Subuh rutin dalam mazhab ini — doa qunut tempatnya di Witir.',
      ko: '이 학파에는 정례적인 파즈르 쿠누트가 없습니다 — 선 채로 하는 두아는 위트르에 속합니다.'
        }
      },
      iftitah: {
        t: 'Thanā — the opening supplication', tid: 'Tsana — doa pembuka',
        ar: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ',
        tl: 'Subḥānakallāhumma wa biḥamdika wa tabārakasmuka wa ta\'ālā jadduka wa lā ilāha ghayruk',
        en: 'Glory be to You, O God, and praise. Blessed is Your name, exalted is Your majesty, and there is no god but You.',
        id: 'Maha Suci Engkau ya Allah, dan segala puji bagi-Mu. Maha Berkah nama-Mu, Maha Tinggi keagungan-Mu, dan tidak ada tuhan selain Engkau.',
      ko: '알라시여, 당신께 영광과 찬미를 드립니다. 당신의 이름은 복되고 당신의 위엄은 높으며, 당신 외에 신은 없습니다.',
        why: {
          en: 'Shorter than the wording used further west, and it does the same work: it opens with praise before a single request is made.',
          id: 'Lebih pendek daripada lafal yang dipakai di barat, dan fungsinya sama: membuka dengan pujian sebelum satu permintaan pun diucapkan.',
      ko: '서쪽에서 쓰이는 문구보다 짧지만 하는 일은 같습니다. 어떤 청원도 꺼내기 전에 찬미로 시작합니다.'
        },
        note: {
          en: 'Said silently in the first rakaat only, before the taʿawwudh and Al-Fatihah.',
          id: 'Dibaca pelan hanya di rakaat pertama, sebelum taawudz dan Al-Fatihah.',
      ko: '첫째 라카아에서만, 타아우우드와 알파티하에 앞서 조용히 읽습니다.'
        },
        more: ['It is said in the gap between the opening takbir and the recitation. If your teacher gives you a different transmitted wording, use theirs — it is not a correction, just a different valid narration.'],
        moreid: ['Dibaca di sela antara takbiratul ihram dan bacaan. Kalau gurumu memberi lafal riwayat yang berbeda, pakai versi beliau — itu bukan koreksi, hanya riwayat sah yang lain.']
      },
      tasyahud: {
        ar: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ۝ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۝ السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ ۝ أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        tl: "At-taḥiyyātu lillāhi waṣ-ṣalawātu waṭ-ṭayyibāt. As-salāmu 'alaika ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu 'alainā wa 'alā 'ibādillāhiṣ-ṣāliḥīn. Asyhadu allā ilāha illallāh, wa asyhadu anna Muḥammadan 'abduhū wa rasūluh.",
        en: 'All greetings, prayers and good things belong to God. Peace be upon you, O Prophet, and the mercy of God and His blessings. Peace be upon us and upon the righteous servants of God. I bear witness that there is no god but God, and I bear witness that Muhammad is His servant and His Messenger.',
        id: 'Segala penghormatan, sholawat, dan kebaikan adalah milik Allah. Semoga keselamatan atasmu, wahai Nabi, beserta rahmat Allah dan berkah-Nya. Semoga keselamatan atas kami dan atas hamba-hamba Allah yang saleh. Aku bersaksi bahwa tiada tuhan selain Allah, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.',
      ko: '모든 인사와 살라와트와 좋은 것은 알라께 속합니다. 예언자시여, 당신께 평안과 알라의 자비와 축복이 있기를 빕니다. 우리와 알라의 의로운 종들에게 평안이 있기를 빕니다. 저는 알라 외에 신이 없음을 증언하며, 무함마드가 그분의 종이자 사도임을 증언합니다.',
        note: {
          en: "This is the wording of Ibn Mas'ud, which is the one this school teaches. Note the closing phrase: \"His servant and His Messenger\".",
          id: 'Ini lafal riwayat Ibnu Mas\'ud, yang diajarkan dalam mazhab ini. Perhatikan penutupnya: "hamba dan utusan-Nya".',
      ko: '이것은 이븐 마스우드가 전한 문구로, 이 학파에서 가르치는 문구입니다. 맺음말에 주목하세요. “그분의 종이자 사도”입니다.'
        }
      },
      salam: {
        note: {
          en: 'Two salams, right then left.',
          id: 'Dua salam, ke kanan lalu ke kiri.',
      ko: '살람을 두 번, 오른쪽 다음 왼쪽으로 합니다.'
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
        label: { en: 'No qunut in Subuh', id: 'Tanpa qunut Subuh',
      ko: '파즈르 쿠누트 없음' },
        note: {
          en: 'There is no regular qunut in Subuh in this school. The standing supplication belongs to Witr instead, and a qunut for calamity may be led by the imam when circumstances call for it.',
          id: 'Tidak ada qunut rutin di Subuh dalam mazhab ini. Doa qunut tempatnya di Witir, dan qunut nazilah dapat dipimpin imam ketika keadaan menuntutnya.',
      ko: '이 학파에는 파즈르에 정례적인 쿠누트가 없습니다. 선 채로 하는 두아는 위트르에 속하며, 상황이 요구할 때는 이맘이 재난 시의 쿠누트를 인도할 수 있습니다.'
        }
      }
    },

    witr: {
      obligation: { en: 'Wajib', id: 'Wajib',
      ko: '와집 (필수에 가까운 순나)' },
      summary: {
        en: 'Three rakaat prayed as one unit with a single salam at the end — you sit for a tashahhud after the second rakaat but stand back up rather than finishing. Qunut is said in the third rakaat, standing, before the bow.',
        id: 'Tiga rakaat dikerjakan sebagai satu kesatuan dengan satu salam di akhir — kamu duduk tasyahud setelah rakaat kedua lalu berdiri lagi, bukan menyelesaikannya. Qunut dibaca pada rakaat ketiga, sambil berdiri, sebelum rukuk.',
      ko: '세 라카아를 하나로 이어서 드리고 마지막에 살람을 한 번만 합니다 — 둘째 라카아 뒤에 앉아 타샤후드를 읽지만, 끝내지 않고 다시 일어섭니다. 쿠누트는 셋째 라카아에서 루쿠 앞에 선 채로 읽습니다.'
      },
      units: [
        {
          rak: 3,
          joined: true,
          middleSitting: true,
          surahEveryRakaat: true,
          label: { en: 'Three rakaat, one salam', id: 'Tiga rakaat, satu salam',
      ko: '세 라카아, 살람 한 번' },
          qunut: {
            position: 'before-ruku',
            rakaat: 3,
            scope: {
              en: 'Qunut is said in the third rakaat all year, after the recitation and before the bow, preceded by a takbir with the hands raised.',
              id: 'Qunut dibaca pada rakaat ketiga sepanjang tahun, setelah bacaan dan sebelum rukuk, didahului takbir dengan mengangkat tangan.',
      ko: '쿠누트는 일 년 내내 셋째 라카아에서, 낭송 뒤 루쿠 앞에 읽으며, 손을 들며 하는 타크비르가 그 앞에 옵니다.'
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
        id: 'Tangan diluruskan di samping badan pada sholat wajib adalah praktik yang dikenal dari mazhab ini. Bersedekap juga diriwayatkan di dalam mazhab dan banyak dilakukan; keduanya tidak membatalkan sholat.',
      ko: '의무 예배에서 팔을 몸 옆으로 내리는 것이 이 학파로 알려진 관행입니다. 손을 포개는 것도 이 학파 안에서 전해지며 널리 행해집니다. 어느 쪽도 예배를 무효로 만들지 않습니다.'
      },
      raiseHands: {
        en: 'Hands are raised at the opening takbir. Raising them elsewhere is reported within the school but is not the taught default.',
        id: 'Tangan diangkat pada takbiratul ihram. Mengangkatnya di tempat lain diriwayatkan dalam mazhab ini, tetapi bukan yang diajarkan sebagai kebiasaan.',
      ko: '손은 시작 타크비르에서 듭니다. 다른 곳에서 드는 것도 이 학파 안에서 전해지지만, 기본으로 가르치는 방식은 아닙니다.'
      },
      basmalah: {
        en: 'Bismillāh is not recited before Al-Fatihah in the obligatory prayer — neither aloud nor silently. Al-Fatihah begins at "al-ḥamdu lillāh".',
        id: 'Bismillah tidak dibaca sebelum Al-Fatihah dalam sholat wajib — tidak keras maupun pelan. Al-Fatihah dimulai dari "al-ḥamdu lillāh".',
      ko: '의무 예배에서는 알파티하 앞에 바스말라를 낭송하지 않습니다 — 소리 내어서도, 조용히도 읽지 않습니다. 알파티하는 “알함두 릴라”에서 시작합니다.'
      },
      amin: {
        en: 'The person praying alone and the follower say āmīn quietly; the imam does not say it aloud in the taught practice.',
        id: 'Orang yang sholat sendiri dan makmum mengucapkan amin dengan lirih; imam tidak mengeraskannya dalam praktik yang diajarkan.',
      ko: '혼자 예배하는 사람과 따르는 사람은 아민을 조용히 말하며, 가르치는 관행에서 이맘은 소리 내어 말하지 않습니다.'
      },
      sitting: {
        en: 'Tawarruk in every sitting — the left foot passes under the right leg and you sit on the floor, including the middle sitting.',
        id: 'Tawarruk di setiap duduk — kaki kiri dikeluarkan ke bawah kaki kanan dan kamu duduk di lantai, termasuk pada duduk pertengahan.',
      ko: '모든 앉기에서 타와루크를 취합니다. 왼발을 오른쪽 다리 아래로 빼고 바닥에 앉으며, 중간 앉기에서도 그렇게 합니다.'
      },
      finger: {
        en: 'The index finger is moved gently from side to side through the tashahhud rather than held still.',
        id: 'Telunjuk digerakkan perlahan ke kanan dan kiri sepanjang tasyahud, bukan ditahan diam.',
      ko: '검지는 타샤후드 내내 가만히 두지 않고 좌우로 부드럽게 움직입니다.'
      },
      follower: {
        en: 'Behind an imam you recite Al-Fatihah in the silent prayers and stay quiet in the ones recited aloud, listening to his recitation.',
        id: 'Saat bermakmum kamu membaca Al-Fatihah pada sholat yang pelan, dan diam mendengarkan pada sholat yang dikeraskan.',
      ko: '이맘 뒤에서는 조용히 읽는 예배에서 알파티하를 낭송하고, 소리 내어 읽는 예배에서는 이맘의 낭송을 들으며 조용히 있습니다.'
      }
    },

    parts: {
      takbir: {
        appendMore: {
          en: 'Hands go up at this takbir. In this school that is the only place they are raised.',
          id: 'Tangan diangkat pada takbir ini. Dalam mazhab ini hanya di sinilah tangan diangkat.',
      ko: '이 타크비르에서 손을 듭니다. 이 학파에서는 손을 드는 곳이 여기뿐입니다.'
        }
      },
      itidal: {
        appendMore: {
          en: 'In this school the Subuh qunut is said quietly before the bow, so nothing extra is added at this standing.',
          id: 'Dalam mazhab ini qunut Subuh dibaca lirih sebelum rukuk, jadi tidak ada tambahan pada berdiri ini.',
      ko: '이 학파에서는 파즈르 쿠누트를 루쿠 앞에서 조용히 읽으므로, 이 이티달에서는 따로 더하는 것이 없습니다.'
        }
      },
      iftitah: {
        omit: true,
        times: '', timesid: '',
        more: [], moreid: [],
        t: 'Straight into Al-Fatihah', tid: 'Langsung ke Al-Fatihah',
        en: 'This school does not add an opening supplication. After the takbir you begin Al-Fatihah directly — and without the basmalah.',
        id: 'Mazhab ini tidak menambahkan doa iftitah. Setelah takbir kamu langsung memulai Al-Fatihah — dan tanpa basmalah.',
      ko: '이 학파는 여는 두아를 더하지 않습니다. 타크비르 뒤에 곧바로 알파티하를 시작합니다 — 바스말라도 없이 시작합니다.',
        why: {
          en: 'The reasoning is that the prayer as transmitted in the school\'s practice moves from the takbir to the recitation without a pause, so nothing is inserted between them.',
          id: 'Alasannya, sholat sebagaimana diamalkan dalam mazhab ini berpindah dari takbir langsung ke bacaan tanpa jeda, sehingga tidak ada yang disisipkan di antaranya.',
      ko: '이 학파의 관행으로 전해진 예배는 타크비르에서 낭송으로 멈춤 없이 이어지므로, 그 사이에 아무것도 끼워 넣지 않는다는 것이 그 근거입니다.'
        }
      },
      tasyahud: {
        ar: 'التَّحِيَّاتُ لِلَّهِ ۝ الزَّاكِيَاتُ لِلَّهِ ۝ الطَّيِّبَاتُ الصَّلَوَاتُ لِلَّهِ ۝ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۝ السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ ۝ أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        tl: "At-taḥiyyātu lillāh, az-zākiyātu lillāh, aṭ-ṭayyibātuṣ-ṣalawātu lillāh. As-salāmu 'alaika ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu 'alainā wa 'alā 'ibādillāhiṣ-ṣāliḥīn. Asyhadu allā ilāha illallāhu waḥdahū lā syarīka lah, wa asyhadu anna Muḥammadan 'abduhū wa rasūluh.",
        en: 'All greetings belong to God; all pure things belong to God; all good things and prayers belong to God. Peace be upon you, O Prophet, and the mercy of God and His blessings. Peace be upon us and upon the righteous servants of God. I bear witness that there is no god but God alone, with no partner, and I bear witness that Muhammad is His servant and His Messenger.',
        id: 'Segala penghormatan milik Allah; segala yang suci milik Allah; segala kebaikan dan sholawat milik Allah. Semoga keselamatan atasmu, wahai Nabi, beserta rahmat Allah dan berkah-Nya. Semoga keselamatan atas kami dan atas hamba-hamba Allah yang saleh. Aku bersaksi bahwa tiada tuhan selain Allah semata, tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.',
      ko: '모든 인사는 알라께 속하고, 모든 순수한 것은 알라께 속하며, 모든 좋은 것과 살라와트는 알라께 속합니다. 예언자시여, 당신께 평안과 알라의 자비와 축복이 있기를 빕니다. 우리와 알라의 의로운 종들에게 평안이 있기를 빕니다. 저는 알라 외에 신이 없고 그분께 동반자가 없음을 증언하며, 무함마드가 그분의 종이자 사도임을 증언합니다.',
        note: {
          en: "This is the wording transmitted from 'Umar, which is the one this school teaches.",
          id: 'Ini lafal yang diriwayatkan dari Umar, yang diajarkan dalam mazhab ini.',
      ko: '이것은 우마르에게서 전해진 문구로, 이 학파에서 가르치는 문구입니다.'
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
          id: 'Saat sholat sendiri, satu salam ke kanan itulah yang diajarkan mazhab ini. Saat bermakmum ditambahkan salam kepada imam, dan ke kiri bila ada orang di sana.',
      ko: '혼자 예배할 때는 오른쪽으로 살람을 한 번 하는 것이 이 학파에서 가르치는 방식입니다. 이맘 뒤에서 예배할 때는 이맘 쪽으로 한 번 더 하고, 왼쪽에 사람이 있으면 그쪽으로 세 번째 살람을 합니다.'
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
        label: { en: 'Qunut in Subuh', id: 'Qunut Subuh',
      ko: '파즈르의 쿠누트' },
        note: {
          en: 'Recommended in the second rakaat of Subuh, said quietly while still standing, before you bow. Saying it after rising from the bow is also permitted in the school, but before the bow is the taught practice.',
          id: 'Dianjurkan pada rakaat kedua Subuh, dibaca lirih sambil masih berdiri, sebelum rukuk. Membacanya setelah bangkit dari rukuk juga dibolehkan dalam mazhab ini, tetapi sebelum rukuk adalah yang diajarkan.',
      ko: '파즈르 둘째 라카아에서 권장되며, 아직 선 채로 루쿠 앞에서 조용히 읽습니다. 루쿠에서 일어선 뒤에 읽는 것도 이 학파에서 허용되지만, 가르치는 관행은 루쿠 앞입니다.'
        }
      }
    },

    witr: {
      obligation: { en: 'Emphasised sunnah', id: 'Sunnah muakkad',
      ko: '강조된 순나' },
      summary: {
        en: 'One rakaat, preceded by two rakaat called the shafʿ with a salam between them. Witr itself is that single closing rakaat, and no qunut is added to it.',
        id: 'Satu rakaat, didahului dua rakaat yang disebut syaf\' dengan salam di antaranya. Witir sendiri adalah satu rakaat penutup itu, dan tidak ditambahkan qunut padanya.',
      ko: '한 라카아이며, 그에 앞서 샤프으라고 부르는 두 라카아를 드리고 그 사이에 살람을 합니다. 위트르 자체는 그 마지막 한 라카아이며, 여기에는 쿠누트를 더하지 않습니다.'
      },
      units: [
        { rak: 2, label: { en: "Shafʿ — two rakaat, then salam", id: "Syaf' — dua rakaat, lalu salam",
      ko: '샤프으 — 두 라카아, 그다음 살람' } },
        { rak: 1, label: { en: 'Witr — one rakaat, then salam', id: 'Witir — satu rakaat, lalu salam',
      ko: '위트르 — 한 라카아, 그다음 살람' } }
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
        id: 'Tangan bersedekap, kanan di atas kiri, diletakkan di bawah pusar.',
      ko: '오른손을 왼손 위에 포개어 배꼽 아래에 둡니다.'
      },
      raiseHands: {
        en: 'Hands are raised to shoulder height in three places: the opening takbir, going down into the bow, and rising from it.',
        id: 'Tangan diangkat setinggi bahu di tiga tempat: takbiratul ihram, saat turun rukuk, dan saat bangkit darinya.',
      ko: '세 곳에서 손을 어깨 높이까지 듭니다. 시작 타크비르, 루쿠로 내려갈 때, 그리고 루쿠에서 일어설 때입니다.'
      },
      basmalah: {
        en: 'Bismillāh is recited silently before Al-Fatihah, including in the prayers said aloud.',
        id: 'Bismillah dibaca pelan sebelum Al-Fatihah, termasuk pada sholat yang dikeraskan.',
      ko: '바스말라는 소리 내어 읽는 예배에서도 알파티하 앞에서 조용히 낭송합니다.'
      },
      amin: {
        en: 'Āmīn is said aloud after Al-Fatihah in the prayers recited aloud.',
        id: 'Amin diucapkan keras setelah Al-Fatihah pada sholat yang dikeraskan.',
      ko: '소리 내어 읽는 예배에서는 알파티하 뒤에 아민을 소리 내어 말합니다.'
      },
      sitting: {
        en: 'Iftirash in the middle sitting, tawarruk in the final sitting of any prayer that has two sittings.',
        id: 'Iftirasy pada duduk pertengahan, tawarruk pada duduk terakhir sholat yang punya dua kali duduk.',
      ko: '중간 앉기에서는 이프티라시를, 앉기가 두 번 있는 예배의 마지막 앉기에서는 타와루크를 취합니다.'
      },
      finger: {
        en: "The index finger points at each mention of God's name through the tashahhud, without being moved side to side.",
        id: 'Telunjuk menunjuk setiap kali nama Allah disebut sepanjang tasyahud, tanpa digerakkan ke kanan-kiri.',
      ko: '검지는 타샤후드 내내 알라의 이름이 언급될 때마다 가리키며, 좌우로 움직이지는 않습니다.'
      },
      follower: {
        en: 'Behind an imam it is recommended to recite Al-Fatihah in the pauses of the loud prayers, and you recite it yourself in the silent ones.',
        id: 'Saat bermakmum dianjurkan membaca Al-Fatihah di sela-sela bacaan imam pada sholat yang dikeraskan, dan kamu membacanya sendiri pada sholat yang pelan.',
      ko: '이맘 뒤에서는 소리 내어 읽는 예배에서 이맘이 멈추는 사이에 알파티하를 낭송하는 것이 권장되며, 조용히 읽는 예배에서는 직접 낭송합니다.'
      }
    },

    parts: {
      takbir: {
        appendMore: {
          en: 'Hands go up to shoulder height as you say it, and again twice more around the bow.',
          id: 'Tangan naik setinggi bahu saat mengucapkannya, dan naik dua kali lagi di sekitar rukuk.',
      ko: '이 말을 하면서 손을 어깨 높이까지 들고, 루쿠 앞뒤로 두 번 더 듭니다.'
        }
      },
      itidal: {
        appendMore: {
          en: 'There is no regular Subuh qunut in this school — the qunut belongs to Witr, after this same rising.',
          id: 'Tidak ada qunut Subuh rutin dalam mazhab ini — qunut tempatnya di Witir, setelah bangkit yang sama.',
      ko: '이 학파에는 정례적인 파즈르 쿠누트가 없습니다 — 쿠누트는 위트르에서 이와 같은 이티달 뒤에 옵니다.'
        }
      },
      iftitah: {
        t: 'The opening supplication', tid: 'Doa pembuka',
        ar: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ',
        tl: 'Subḥānakallāhumma wa biḥamdika wa tabārakasmuka wa ta\'ālā jadduka wa lā ilāha ghayruk',
        en: 'Glory be to You, O God, and praise. Blessed is Your name, exalted is Your majesty, and there is no god but You.',
        id: 'Maha Suci Engkau ya Allah, dan segala puji bagi-Mu. Maha Berkah nama-Mu, Maha Tinggi keagungan-Mu, dan tidak ada tuhan selain Engkau.',
      ko: '알라시여, 당신께 영광과 찬미를 드립니다. 당신의 이름은 복되고 당신의 위엄은 높으며, 당신 외에 신은 없습니다.',
        why: {
          en: 'The wording this school teaches. Short, said once, and entirely praise before any request is made.',
          id: 'Lafal yang diajarkan mazhab ini. Pendek, dibaca sekali, dan seluruhnya pujian sebelum ada permintaan.',
      ko: '이 학파에서 가르치는 문구입니다. 짧고, 한 번만 읽으며, 어떤 청원보다 앞서 온전히 찬미로만 이루어져 있습니다.'
        },
        note: {
          en: 'Said silently in the first rakaat only.',
          id: 'Dibaca pelan hanya di rakaat pertama.',
      ko: '첫째 라카아에서만 조용히 읽습니다.'
        },
        more: ['It is said in the gap between the opening takbir and the recitation. If your teacher gives you a different transmitted wording, use theirs — it is not a correction, just a different valid narration.'],
        moreid: ['Dibaca di sela antara takbiratul ihram dan bacaan. Kalau gurumu memberi lafal riwayat yang berbeda, pakai versi beliau — itu bukan koreksi, hanya riwayat sah yang lain.']
      },
      tasyahud: {
        ar: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ۝ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۝ السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ ۝ أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        tl: "At-taḥiyyātu lillāhi waṣ-ṣalawātu waṭ-ṭayyibāt. As-salāmu 'alaika ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu 'alainā wa 'alā 'ibādillāhiṣ-ṣāliḥīn. Asyhadu allā ilāha illallāh, wa asyhadu anna Muḥammadan 'abduhū wa rasūluh.",
        en: 'All greetings, prayers and good things belong to God. Peace be upon you, O Prophet, and the mercy of God and His blessings. Peace be upon us and upon the righteous servants of God. I bear witness that there is no god but God, and I bear witness that Muhammad is His servant and His Messenger.',
        id: 'Segala penghormatan, sholawat, dan kebaikan adalah milik Allah. Semoga keselamatan atasmu, wahai Nabi, beserta rahmat Allah dan berkah-Nya. Semoga keselamatan atas kami dan atas hamba-hamba Allah yang saleh. Aku bersaksi bahwa tiada tuhan selain Allah, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.',
      ko: '모든 인사와 살라와트와 좋은 것은 알라께 속합니다. 예언자시여, 당신께 평안과 알라의 자비와 축복이 있기를 빕니다. 우리와 알라의 의로운 종들에게 평안이 있기를 빕니다. 저는 알라 외에 신이 없음을 증언하며, 무함마드가 그분의 종이자 사도임을 증언합니다.',
        note: {
          en: "This is the wording of Ibn Mas'ud, which is the one this school teaches.",
          id: "Ini lafal riwayat Ibnu Mas'ud, yang diajarkan dalam mazhab ini.",
      ko: '이것은 이븐 마스우드가 전한 문구로, 이 학파에서 가르치는 문구입니다.'
        }
      },
      salam: {
        note: {
          en: 'Two salams, right then left.',
          id: 'Dua salam, ke kanan lalu ke kiri.',
      ko: '살람을 두 번, 오른쪽 다음 왼쪽으로 합니다.'
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
        label: { en: 'No qunut in Subuh', id: 'Tanpa qunut Subuh',
      ko: '파즈르 쿠누트 없음' },
        note: {
          en: 'There is no regular qunut in Subuh in this school. The standing supplication belongs to Witr, and a qunut for calamity may be led by the imam when circumstances call for it.',
          id: 'Tidak ada qunut rutin di Subuh dalam mazhab ini. Doa qunut tempatnya di Witir, dan qunut nazilah dapat dipimpin imam ketika keadaan menuntutnya.',
      ko: '이 학파에는 파즈르에 정례적인 쿠누트가 없습니다. 선 채로 하는 두아는 위트르에 속하며, 상황이 요구할 때는 이맘이 재난 시의 쿠누트를 인도할 수 있습니다.'
        }
      }
    },

    witr: {
      obligation: { en: 'Emphasised sunnah', id: 'Sunnah muakkad',
      ko: '강조된 순나' },
      summary: {
        en: 'Commonly three rakaat: two with a salam, then one on its own. Qunut is said in that final rakaat after you rise from the bow, throughout the year.',
        id: 'Umumnya tiga rakaat: dua rakaat dengan salam, lalu satu rakaat sendiri. Qunut dibaca pada rakaat terakhir itu setelah bangkit dari rukuk, sepanjang tahun.',
      ko: '보통 세 라카아입니다. 두 라카아를 드리고 살람을 한 뒤, 한 라카아를 따로 드립니다. 쿠누트는 일 년 내내 그 마지막 라카아에서 루쿠에서 일어선 뒤에 읽습니다.'
      },
      units: [
        { rak: 2, label: { en: 'Two rakaat, then salam', id: 'Dua rakaat, lalu salam',
      ko: '두 라카아, 그다음 살람' } },
        {
          rak: 1,
          label: { en: 'One rakaat, then salam', id: 'Satu rakaat, lalu salam',
      ko: '한 라카아, 그다음 살람' },
          qunut: {
            position: 'after-ruku',
            scope: {
              en: 'Qunut is said here all year, after rising from the bow.',
              id: 'Qunut dibaca di sini sepanjang tahun, setelah bangkit dari rukuk.',
      ko: '여기에서는 일 년 내내 루쿠에서 일어선 뒤에 쿠누트를 읽습니다.'
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
  { key: 'stance',      label: { en: 'Hands while standing',   id: 'Posisi tangan saat berdiri',
      ko: '서 있을 때의 손' } },
  { key: 'raiseHands',  label: { en: 'Raising the hands',      id: 'Mengangkat tangan',
      ko: '손 들기' } },
  { key: 'basmalah',    label: { en: 'Basmalah',               id: 'Basmalah',
      ko: '바스말라' } },
  { key: 'amin',        label: { en: 'Saying āmīn',            id: 'Mengucapkan amin',
      ko: '아민 말하기' } },
  { key: 'sitting',     label: { en: 'How you sit',            id: 'Cara duduk',
      ko: '앉는 방법' } },
  { key: 'finger',      label: { en: 'The index finger',       id: 'Telunjuk',
      ko: '검지' } },
  { key: 'follower',    label: { en: 'Behind an imam',         id: 'Saat bermakmum',
      ko: '이맘 뒤에서' } }
];
