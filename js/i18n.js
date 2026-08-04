/* ============================================================================
   Strings.
   ----------------------------------------------------------------------------
   Every user-facing string that is not content lives here, in both languages.
   Views call `t('key')`; nothing outside this file compares `state.language`
   to decide what words to print.

   Three languages are supported:
     'en'   — English
     'id'   — Bahasa Indonesia
     'ko'   — 한국어
   Independently of those, `state.pair` renders a second language underneath
   each passage: the English under a translation, the Indonesian under English.
   `pairBlock()` supplies that second half.
   ========================================================================== */

import { state } from './state.js';

export const STRINGS = {
  /* ---- carried over from the original UI table ---- */
  deeper:      ['Go deeper', 'Selami lebih dalam'],
  why:         ['Why it is there', 'Mengapa ia ada di sana'],
  quran:       ["In the Quran's own words", 'Dalam redaksi Al-Quran sendiri'],
  howtold:     ['How the Quran tells it', 'Bagaimana Al-Quran menuturkannya'],
  doing:       ['What it is doing', 'Apa yang sedang dikerjakannya'],
  back:        ['← All stories', '← Semua kisah'],
  oblig:       ['Obligatory', 'Wajib'],
  sunnah:      ['Sunnah', 'Sunnah'],
  rakaat:      ['Rakaat', 'Rakaat'],
  middle:      ['Middle rakaat', 'Rakaat tengah'],
  opening:     ['Opening rakaat', 'Rakaat pembuka'],
  final:       ['Final rakaat', 'Rakaat terakhir'],
  aloud:       ['aloud', 'keras'],
  silent:      ['silent', 'pelan'],
  only12:      ['rakaat 1–2 only', 'hanya rakaat 1–2'],
  only34:      ['3 & 4 rakaat prayers', 'sholat 3 & 4 rakaat'],
  playWhole:   ['Play the whole surah', 'Putar seluruh surah'],
  reciter:     ['Reciter', 'Qari'],
  searchNote:  ['Searching across every section. Clear the box to go back.',
                'Mencari di seluruh bagian. Kosongkan kotaknya untuk kembali.'],

  /* ---- navigation ---- */
  nav_today:    ['Today', 'Hari ini'],
  nav_prayer:   ['Prayer', 'Sholat'],
  nav_qibla:    ['Qibla', 'Kiblat'],
  nav_duas:     ['Duas', 'Doa'],
  nav_ask:      ['Questions', 'Tanya'],
  nav_read:     ['Read', 'Bacaan'],
  nav_settings: ['Settings', 'Pengaturan'],

  /* ---- onboarding ---- */
  ob_welcome_h:   ['Welcome to Faham', 'Selamat datang di Faham'],
  ob_welcome_s:   ['Understand what you say. Know what you are doing. Build the habit slowly.',
                   'Pahami apa yang kamu ucapkan. Ketahui apa yang kamu kerjakan. Bangun kebiasaannya perlahan.'],
  ob_lang_h:      ['Choose your language', 'Pilih bahasamu'],
  ob_lang_s:      ['You can change this at any time, and switch language on any single line as you read.',
                   'Kamu bisa mengubahnya kapan saja, dan mengganti bahasa pada tiap baris saat membaca.'],
  ob_madhhab_h:   ['Choose your madhhab', 'Pilih mazhabmu'],
  ob_madhhab_s:   ['Prayer details vary slightly between the schools of jurisprudence. Choose the one you normally follow — you can change it anytime in Settings.',
                   'Rincian sholat sedikit berbeda antarmazhab. Pilih yang biasa kamu ikuti — bisa diubah kapan saja di Pengaturan.'],
  ob_unsure_t:    ['I\u2019m not sure yet', 'Belum tahu'],
  ob_unsure_s:    ['Start anyway \u2014 you can set this later', 'Mulai saja \u2014 bisa diatur nanti'],
  ob_unsure:      ['If you are not sure, Faham starts with the Shafi\u2019i school \u2014 the one most Indonesian mosques follow. Every instruction that depends on the school says which one it is showing, and you can change it in Settings whenever you find out.',
                    'Kalau belum tahu, Faham memakai mazhab Syafi\u2019i \u2014 yang diikuti kebanyakan masjid di Indonesia. Setiap panduan yang bergantung pada mazhab menyebutkan mazhab mana yang sedang ditampilkan, dan kamu bisa mengubahnya di Pengaturan kapan saja.'],
  ob_continue:    ['Continue', 'Lanjut'],
  ob_start:       ['Start', 'Mulai'],
  ob_step:        ['Step', 'Langkah'],

  /* ---- settings ---- */
  set_h:            ['Settings', 'Pengaturan'],
  set_lede:         ['Language and school are separate preferences. Changing one never resets the other.',
                     'Bahasa dan mazhab adalah dua pilihan terpisah. Mengubah satu tidak pernah mengatur ulang yang lain.'],
  set_language:     ['Language', 'Bahasa'],
  set_pair:         ['Show a second language underneath', 'Tampilkan bahasa kedua di bawah'],
  set_pair_note:    ['While reading a translation, each passage also shows the English. While reading English, it shows the Indonesian.',
                     'Saat membaca terjemahan, tiap bagian juga menampilkan teks Inggrisnya. Saat membaca bahasa Inggris, yang tampil bahasa Indonesia.'],
  set_madhhab:      ['Madhhab', 'Mazhab'],
  set_madhhab_note: ['The prayer walkthrough, the Witr guidance and the Asr calculation all follow this choice.',
                     'Panduan sholat, tuntunan Witir, dan perhitungan Asar semuanya mengikuti pilihan ini.'],
  set_differ:       ['Where the schools differ', 'Titik perbedaan antarmazhab'],
  set_differ_note:  ['Shown for the school you have selected. Where a school contains more than one respected opinion, the alternative is stated rather than hidden.',
                     'Ditampilkan untuk mazhab yang kamu pilih. Bila di dalam satu mazhab ada lebih dari satu pendapat yang dihormati, alternatifnya disebutkan, bukan disembunyikan.'],
  set_advanced:     ['Prayer time calculation', 'Perhitungan waktu sholat'],
  set_adv_note:     ['Leave these on automatic unless your local mosque publishes a different convention.',
                     'Biarkan otomatis kecuali masjid setempat memakai ketentuan yang berbeda.'],
  set_method:       ['Calculation method', 'Metode perhitungan'],
  set_asr:          ['Asr convention', 'Ketentuan Asar'],
  set_asr_auto:     ['Follow my madhhab', 'Ikuti mazhabku'],
  set_asr_standard: ['Standard (shadow ×1)', 'Standar (bayangan ×1)'],
  set_asr_hanafi:   ['Hanafi (shadow ×2)', 'Hanafi (bayangan ×2)'],
  set_theme:        ['Appearance', 'Tampilan'],
  set_theme_note:   ['Automatic follows your device\u2019s light or dark setting.',
                     'Otomatis mengikuti setelan terang/gelap perangkatmu.'],
  set_theme_auto:   ['Automatic', 'Otomatis'],
  set_theme_light:  ['Light', 'Terang'],
  set_theme_dark:   ['Dark', 'Gelap'],
  set_data:         ['Your data', 'Datamu'],
  set_privacy:      ['Your prayer log and settings stay in this browser. Faham has no account, no backend of its own and no analytics — but the page is served by GitHub Pages, and Quran recitation is fetched from a public audio host, so those two do see a request. Anyone else using this browser profile can open the app and see the same local data.',
                     'Catatan sholat dan pengaturanmu tersimpan di peramban ini. Faham tidak punya akun, server sendiri, maupun analitik — tapi halamannya disajikan oleh GitHub Pages, dan bacaan Al-Quran diambil dari layanan audio publik, jadi keduanya menerima permintaan. Siapa pun yang memakai profil peramban ini bisa membuka aplikasi dan melihat data lokal yang sama.'],
  set_days_logged:  ['{n} days logged on this device', '{n} hari tercatat di perangkat ini'],
  set_clearall:     ['Clear all Faham data', 'Hapus semua data Faham'],
  set_clearall_note:['Settings, prayer log, remembered location and downloaded recitation. The app reopens as if you had never visited.',
                     'Pengaturan, catatan sholat, lokasi tersimpan, dan bacaan yang sudah diunduh. Aplikasi terbuka lagi seolah kamu belum pernah berkunjung.'],
  set_clearall_confirm:['This deletes everything Faham has stored on this device, including downloaded recitation. It cannot be undone.',
                     'Ini menghapus semua yang disimpan Faham di perangkat ini, termasuk bacaan yang sudah diunduh. Tidak bisa dibatalkan.'],
  set_clearall_yes: ['Delete everything', 'Hapus semuanya'],
  set_clear:        ['Clear prayer history', 'Hapus riwayat sholat'],
  set_clear_confirm:['This permanently deletes every prayer you have logged on this device. It cannot be undone.',
                     'Ini menghapus permanen seluruh catatan sholat di perangkat ini. Tidak bisa dibatalkan.'],
  set_clear_yes:    ['Delete history', 'Hapus riwayat'],
  set_cancel:       ['Cancel', 'Batal'],
  set_cleared:      ['Prayer history cleared.', 'Riwayat sholat telah dihapus.'],
  set_nostore:      ['This browser is not letting Faham save anything, so your settings will reset when you close the tab.',
                     'Peramban ini tidak mengizinkan Faham menyimpan apa pun, jadi pengaturanmu akan kembali seperti semula setelah tab ditutup.'],

  /* ---- habit tracker ---- */
  tr_h:          ['Prayer log', 'Catatan sholat'],
  tr_progress:   ['Today', 'Hari ini'],
  tr_of:         ['of', 'dari'],
  tr_prayers:    ['prayers', 'sholat'],
  tr_tap:        ['Tap a prayer to log it. Tap again to undo.',
                  'Ketuk sholat untuk mencatatnya. Ketuk lagi untuk membatalkan.'],
  tr_week:       ['Last seven days', 'Tujuh hari terakhir'],
  tr_streak_one: ['1-day streak', '1 hari berturut-turut'],
  tr_streak:     ['-day streak', ' hari berturut-turut'],
  tr_streak_none:['Your streak starts with the next complete day.',
                  'Runtunmu dimulai dari hari lengkap berikutnya.'],
  tr_done:       ['logged', 'tercatat'],
  tr_notdone:    ['not logged', 'belum dicatat'],
  tr_private:    ['Your prayer history stays on this device.',
                  'Riwayat sholat tersimpan di perangkat ini.'],
  tr_complete:   ['All five today.', 'Lima-limanya hari ini.'],

  /* ---- prayer times ---- */
  pt_h:          ['Prayer times', 'Waktu sholat'],
  pt_next:       ['Next', 'Berikutnya'],
  pt_in:         ['in', 'dalam'],
  pt_tomorrow:   ['tomorrow', 'besok'],
  pt_sunrise:    ['Sunrise', 'Terbit'],
  pt_sunrise_note:['Sunrise is not a prayer — it marks the end of the Subuh window.',
                   'Terbit bukan waktu sholat — ia menandai berakhirnya waktu Subuh.'],
  pt_use:        ['Use my location', 'Gunakan lokasi saya'],
  pt_why:        ['Your location is used on this device to calculate prayer times and the qibla direction. The calculation runs here; nothing is sent anywhere.',
                  'Lokasimu dipakai di perangkat ini untuk menghitung waktu sholat dan arah kiblat. Perhitungannya berjalan di sini; tidak ada yang dikirim ke mana pun.'],
  pt_refresh:    ['Refresh location', 'Perbarui lokasi'],
  pt_or_city:    ['Or pick a city:', 'Atau pilih kota:'],
  pt_locating:   ['Finding your location…', 'Mencari lokasimu…'],
  pt_method:     ['Method', 'Metode'],
  pt_remember:   ['Remember this location on this device', 'Ingat lokasi ini di perangkat ini'],
  pt_remember_note:['Off by default. When on, only an approximate position is stored — rounded to about a kilometre — and it never leaves this device.',
                    'Mati secara bawaan. Bila dinyalakan, hanya posisi kira-kira yang disimpan — dibulatkan sekitar satu kilometer — dan tidak pernah keluar dari perangkat ini.'],
  pt_approx:     ['Times are calculated on this device and are approximate. Follow your local mosque where they differ.',
                  'Waktu dihitung di perangkat ini dan bersifat perkiraan. Ikuti masjid setempat bila berbeda.'],
  pt_zone:       ['Timezone', 'Zona waktu'],
  pt_ihtiyati:   ['Precaution margin (ihtiyāṭ)', 'Selisih kehati-hatian (ihtiyati)'],
  pt_minutes:    ['minutes, applied to every prayer time', 'menit, ditambahkan ke setiap waktu sholat'],
  pt_unavailable:['Prayer times are temporarily unavailable.', 'Waktu sholat sementara tidak tersedia.'],
  pt_polar:      ['At this latitude the sun does not reach the required angle on some days, so Subuh and Isya are estimated. Follow a local convention where one exists.',
                  'Pada garis lintang ini matahari tidak mencapai sudut yang diperlukan pada hari-hari tertentu, sehingga Subuh dan Isya diperkirakan. Ikuti ketentuan setempat bila ada.'],

  /* ---- location errors ---- */
  loc_unsupported:['Location is not supported on this device.', 'Lokasi tidak didukung di perangkat ini.'],
  loc_denied:     ['Location access was denied. Enable location permission to calculate local prayer times.',
                   'Izin lokasi ditolak. Aktifkan izin lokasi untuk menghitung waktu sholat setempat.'],
  loc_timeout:    ['We couldn’t determine your location. Please try again.',
                   'Kami tidak berhasil menentukan lokasimu. Silakan coba lagi.'],
  loc_failed:     ['We couldn’t determine your location. Please try again, or pick the nearest city.',
                   'Kami tidak berhasil menentukan lokasimu. Coba lagi, atau pilih kota terdekat.'],

  /* ---- audio ---- */
  verse_n:       ['verse {n}', 'ayat {n}'],
  aud_play:      ['Play pronunciation', 'Putar pelafalan'],
  aud_stop:      ['Stop', 'Hentikan'],
  aud_loading:   ['Loading audio', 'Memuat audio'],
  aud_missing:   ['Audio unavailable', 'Audio tidak tersedia'],
  aud_playrec:   ['Play recitation', 'Putar bacaan'],
  aud_recerr:    ['Could not load that recitation — check your connection, then try again.',
                  'Tidak bisa memuat bacaan itu — periksa koneksimu, lalu coba lagi.'],

  /* ---- madhhab-aware prayer content ---- */
  md_variation:  ['variation', 'perbedaan'],
  md_practice:   ['practice', 'praktik'],
  md_witr:       ['Witr', 'Witir'],
  md_witr_lede:  ['The night prayer that closes the day with an odd number of rakaat. Its shape is the clearest difference between the schools, so this section follows the one you selected.',
                  'Sholat malam yang menutup hari dengan jumlah rakaat ganjil. Bentuknya adalah perbedaan paling jelas antarmazhab, jadi bagian ini mengikuti pilihanmu.'],
  md_qunut:      ['Qunut', 'Qunut'],
  md_in_school:  ['In the', 'Dalam mazhab'],
  md_school:     ['school', ''],
  md_selected:   ['Showing', 'Menampilkan'],
  md_change:     ['Change', 'Ubah'],

  /* ---- misc ---- */
  q_steady:      ['Compass steady', 'Kompas stabil'],
  q_unsteady:    ['Compass unsteady', 'Kompas belum stabil'],
  q_calibrate:   ['Move away from metal and your laptop, then trace a figure of eight with the phone.',
                  'Menjauhlah dari logam dan laptop, lalu gerakkan ponsel membentuk angka delapan.'],
  pray_now:      ['Pray now', 'Sholat sekarang'],
  pray_now_sub:  ['Open the walkthrough for this prayer', 'Buka panduan untuk sholat ini'],
  ko_notice_t:   ['About the Korean', 'Tentang bahasa Korea'],
  ko_notice_b:   ['This app was written in Indonesia for one person. The Korean covers what you need in order to pray.',
                  'Aplikasi ini ditulis di Indonesia untuk satu orang. Bahasa Koreanya mencakup yang kamu perlukan untuk sholat.'],
  untr_t:        ['Not translated yet', 'Belum diterjemahkan'],
  untr_b:        ['This section has not been put into Korean yet. What follows is in English.',
                  'Bagian ini belum dialihbahasakan. Isinya di bawah dalam bahasa Inggris.'],
  upd_ready:     ['A new version of Faham is ready.', 'Versi baru Faham sudah siap.'],
  upd_reload:    ['Reload', 'Muat ulang'],
  pwa_ready:     ['Ready to use offline.', 'Siap dipakai tanpa koneksi.'],
  install_h:     ['Keeping Faham on your phone', 'Menyimpan Faham di ponselmu'],
  install_b:     ['Open the site in Chrome or Safari, then use the browser menu — “Add to Home screen” on Android, Share → “Add to Home Screen” on iPhone. Once the first visit finishes loading, everything written here works with no connection. Quran recitation is the exception: each verse is stored the first time you play it, so it is available offline only after you have heard it once.',
                  'Buka situsnya di Chrome atau Safari, lalu gunakan menu peramban — “Tambahkan ke layar utama” di Android, Bagikan → “Tambahkan ke Layar Utama” di iPhone. Begitu kunjungan pertama selesai dimuat, semua teks di sini bisa dipakai tanpa koneksi. Kecuali bacaan Al-Quran: tiap ayat tersimpan saat pertama kali kamu memutarnya, jadi baru bisa diputar offline setelah pernah kamu dengar.']
};

/* ---- Korean overlay -----------------------------------------------------
   The table above is the English/Indonesian original. Korean is layered on
   top by key so the two-language table stays readable and the Korean can be
   reviewed as one block. A key with no Korean entry falls back to English.
   ------------------------------------------------------------------------ */
import { KO_STRINGS } from './i18n-ko.js';

Object.keys(KO_STRINGS).forEach((k) => {
  if (STRINGS[k]) STRINGS[k][2] = KO_STRINGS[k];
});

function index() {
  if (state.language === 'id') return 1;
  if (state.language === 'ko') return 2;
  return 0;
}

/** The string for `key` in the active language, falling back to English. */
export function t(key) {
  const row = STRINGS[key];
  if (!row) return '';
  const v = row[index()];
  /* '' is a deliberate choice in some languages (a connective English needs
     and Korean does not), so only fall back when the entry is absent. */
  return (v === undefined || v === null) ? row[0] : v;
}

/** Inline literal for content strings that live in data files. */
export function P(en, id, ko) {
  if (state.language === 'id') return (id === undefined || id === null) ? en : id;
  if (state.language === 'ko') return (ko === undefined || ko === null) ? en : ko;
  return en;
}

/**
 * The second-language block under a passage, shown only when pair mode is on.
 * Reading a translation, the block carries the English; reading English, it
 * carries the Indonesian. Callers pass both halves and this decides.
 */
export function pairBlock(en, id, raw) {
  if (!state.pair) return '';
  const showEnglish = state.language !== 'en';
  const html = showEnglish ? en : id;
  if (!html) return '';
  const label = showEnglish ? 'English' : 'Bahasa Indonesia';
  /* lang= on the block so a screen reader switches pronunciation for the second
     language instead of reading Indonesian with an English voice. */
  const tag = showEnglish ? 'en' : 'id';
  return '<div class="id-txt show" lang="' + tag + '"><span class="lbl">' + label + '</span>' +
    (raw ? html : '<p>' + html + '</p>') + '</div>';
}

/** Pick from an `{en, id, ko}` set coming out of a data file. */
export function pickLang(set) {
  if (!set) return '';
  if (state.language === 'id') return set.id || set.en || '';
  if (state.language === 'ko') return set.ko || set.en || '';
  return set.en || set.id || '';
}

/** The English half of such a set, for the pair block. */
export function pickLangEn(set) { return set ? (set.en || '') : ''; }
/** The Indonesian half, for the pair block while reading English. */
export function pickLangId(set) { return set ? (set.id || '') : ''; }

export function isPair() { return state.pair; }

/** True where the active language has no translation for long-form content. */
export function untranslated() { return state.language === 'ko'; }

/** Language tag for <html lang>, and for Intl date formatting. */
export function localeTag() {
  if (state.language === 'id') return 'id-ID';
  if (state.language === 'ko') return 'ko-KR';
  return 'en-GB';
}
