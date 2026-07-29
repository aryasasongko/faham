/* ============================================================================
   AUDIO MAP — every playable clip in the app, in one place.
   ----------------------------------------------------------------------------
   Two kinds of audio exist in Faham and they are deliberately kept apart:

   1. QURAN VERSES  — resolved by surah:ayah against a recitation CDN (see
      js/audio.js, RECITERS). Nothing in this file is involved. A Quran
      recitation API is only ever asked for Quran.

   2. EVERYTHING ELSE — the prayer formulas, the everyday duas and the
      vocabulary. These are not Quran, so they are never fetched from a Quran
      API. They resolve to a local MP3 listed below and to nothing else. If the
      file has not been added yet, the button shows "Audio unavailable" and the
      rest of the app carries on.

   Filenames are the contract. Drop a file with the listed name into
   assets/audio/ and it starts working with no code change. Adding a new
   playable line means adding a row here, not touching a view.

   `variants` holds school-specific recordings for a line whose wording differs
   by school; the resolver falls back to the base file when a variant is absent.
   ========================================================================== */

export const AUDIO_BASE = 'assets/audio/';

export const AUDIO_MAP = {
  /* ---- the prayer, in order (section: In the prayer / walkthrough) ---- */
  'part:takbir': {
    file: 'takbir.mp3',
    label: { en: 'Takbiratul Ihram', id: 'Takbiratul Ihram' },
    ar: 'اللَّهُ أَكْبَرُ'
  },
  'part:iftitah': {
    file: 'iftitah-wajjahtu.mp3',
    label: { en: 'Doa Iftitah', id: 'Doa Iftitah' },
    ar: 'اللَّهُ أَكْبَرُ كَبِيرًا…',
    variants: {
      hanafi: 'iftitah-subhanaka.mp3',
      hanbali: 'iftitah-subhanaka.mp3'
    }
  },
  'part:ruku': {
    file: 'ruku.mp3',
    label: { en: "Ruku' — the bow", id: 'Rukuk' },
    ar: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ'
  },
  'part:itidal': {
    file: 'itidal.mp3',
    label: { en: "I'tidal — rising", id: "I'tidal" },
    ar: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ…'
  },
  'part:sujud': {
    file: 'sujud.mp3',
    label: { en: 'Sujud — prostration', id: 'Sujud' },
    ar: 'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ وَبِحَمْدِهِ'
  },
  'part:duduk': {
    file: 'duduk-antara-dua-sujud.mp3',
    label: { en: 'Between the two prostrations', id: 'Duduk di antara dua sujud' },
    ar: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي…'
  },
  'part:tasyahud': {
    file: 'tasyahud-ibn-abbas.mp3',
    label: { en: 'Tashahhud', id: 'Tasyahud' },
    ar: 'التَّحِيَّاتُ الْمُبَارَكَاتُ…',
    variants: {
      hanafi: 'tasyahud-ibn-masud.mp3',
      hanbali: 'tasyahud-ibn-masud.mp3',
      maliki: 'tasyahud-umar.mp3'
    }
  },
  'part:salawat': {
    file: 'salawat-ibrahimiyah.mp3',
    label: { en: 'Salawat', id: 'Sholawat' },
    ar: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ…'
  },
  'part:salam': {
    file: 'salam.mp3',
    label: { en: 'Salam — the closing', id: 'Salam' },
    ar: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ'
  },

  /* ---- everyday duas (section: Duas) ----------------------------------
     The id is a slug of the English title, built by js/audio.js#duaAudioId, so
     reordering data/duas.js cannot silently repoint a recording. */
  'dua:on-waking': { file: 'dua-bangun-tidur.mp3', label: { en: 'On waking', id: 'Saat bangun tidur' } },
  'dua:leaving-the-house': { file: 'dua-keluar-rumah.mp3', label: { en: 'Leaving the house', id: 'Keluar rumah' } },
  'dua:before-eating': { file: 'dua-sebelum-makan.mp3', label: { en: 'Before eating', id: 'Sebelum makan' } },
  'dua:after-eating': { file: 'dua-setelah-makan.mp3', label: { en: 'After eating', id: 'Setelah makan' } },
  'dua:entering-the-bathroom': { file: 'dua-masuk-kamar-mandi.mp3', label: { en: 'Entering the bathroom', id: 'Masuk kamar mandi' } },
  'dua:leaving-the-bathroom': { file: 'dua-keluar-kamar-mandi.mp3', label: { en: 'Leaving the bathroom', id: 'Keluar kamar mandi' } },
  'dua:setting-out-on-a-journey': { file: 'dua-memulai-perjalanan.mp3', label: { en: 'Setting out on a journey', id: 'Memulai perjalanan' } },
  'dua:entering-the-masjid': { file: 'dua-masuk-masjid.mp3', label: { en: 'Entering the masjid', id: 'Masuk masjid' } },
  'dua:leaving-the-masjid': { file: 'dua-keluar-masjid.mp3', label: { en: 'Leaving the masjid', id: 'Keluar masjid' } },
  'dua:anxiety-and-grief': { file: 'dua-cemas-dan-sedih.mp3', label: { en: 'Anxiety and grief', id: 'Cemas dan sedih' } },
  'dua:when-something-is-beyond-you': { file: 'dua-di-luar-kemampuan.mp3', label: { en: 'When something is beyond you', id: 'Saat sesuatu di luar kemampuanmu' } },
  'dua:for-your-parents': { file: 'dua-untuk-orang-tua.mp3', label: { en: 'For your parents', id: 'Untuk orang tuamu' } },
  'dua:before-sleeping': { file: 'dua-sebelum-tidur.mp3', label: { en: 'Before sleeping', id: 'Sebelum tidur' } }
};

/* The thirty vocabulary words share one naming rule rather than thirty rows:
   assets/audio/vocab/<transliteration-slug>.mp3 — e.g. vocab/rabb.mp3.
   js/audio.js builds the path; nothing else needs to know. */
export const VOCAB_AUDIO_DIR = 'vocab/';
