/* ============================================================================
   Strings.
   ----------------------------------------------------------------------------
   Every user-facing string that is not content lives here, in both languages.
   Views call `t('key')`; nothing outside this file compares `state.language`
   to decide what words to print.

   Three language modes are supported, carried over from the original app:
     'en'   — English
     'id'   — Bahasa Indonesia
     'both' — English, with the Indonesian rendered underneath in a marked block
   In 'both' mode `t()` returns English and `idBlock()` supplies the second half.
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
  ob_lang_both:   ['Both, side by side', 'Keduanya, berdampingan'],
  ob_madhhab_h:   ['Choose your madhhab', 'Pilih mazhabmu'],
  ob_madhhab_s:   ['Prayer details vary slightly between the schools of jurisprudence. Choose the one you normally follow — you can change it anytime in Settings.',
                   'Rincian sholat sedikit berbeda antarmazhab. Pilih yang biasa kamu ikuti — bisa diubah kapan saja di Pengaturan.'],
  ob_unsure:      ['Not sure? Most Indonesian mosques follow the Shafi’i school.',
                   'Belum yakin? Sebagian besar masjid di Indonesia mengikuti mazhab Syafi’i.'],
  ob_continue:    ['Continue', 'Lanjut'],
  ob_start:       ['Start', 'Mulai'],
  ob_step:        ['Step', 'Langkah'],

  /* ---- settings ---- */
  set_h:            ['Settings', 'Pengaturan'],
  set_lede:         ['Language and school are separate preferences. Changing one never resets the other.',
                     'Bahasa dan mazhab adalah dua pilihan terpisah. Mengubah satu tidak pernah mengatur ulang yang lain.'],
  set_language:     ['Language', 'Bahasa'],
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
  set_data:         ['Your data', 'Datamu'],
  set_privacy:      ['Your prayer history stays on this device. Faham has no account, no server and no analytics.',
                     'Riwayat salat tersimpan di perangkat ini. Faham tidak punya akun, server, maupun analitik.'],
  set_clear:        ['Clear prayer history', 'Hapus riwayat salat'],
  set_clear_confirm:['This permanently deletes every prayer you have logged on this device. It cannot be undone.',
                     'Ini menghapus permanen seluruh catatan salat di perangkat ini. Tidak bisa dibatalkan.'],
  set_clear_yes:    ['Delete history', 'Hapus riwayat'],
  set_cancel:       ['Cancel', 'Batal'],
  set_cleared:      ['Prayer history cleared.', 'Riwayat salat telah dihapus.'],
  set_nostore:      ['This browser is not letting Faham save anything, so your settings will reset when you close the tab.',
                     'Peramban ini tidak mengizinkan Faham menyimpan apa pun, jadi pengaturanmu akan kembali seperti semula setelah tab ditutup.'],

  /* ---- habit tracker ---- */
  tr_h:          ['Prayer log', 'Catatan salat'],
  tr_progress:   ['Today', 'Hari ini'],
  tr_of:         ['of', 'dari'],
  tr_prayers:    ['prayers', 'salat'],
  tr_tap:        ['Tap a prayer to log it. Tap again to undo.',
                  'Ketuk salat untuk mencatatnya. Ketuk lagi untuk membatalkan.'],
  tr_week:       ['Last seven days', 'Tujuh hari terakhir'],
  tr_streak_one: ['1-day streak', '1 hari berturut-turut'],
  tr_streak:     ['-day streak', ' hari berturut-turut'],
  tr_streak_none:['Your streak starts with the next complete day.',
                  'Runtunmu dimulai dari hari lengkap berikutnya.'],
  tr_done:       ['logged', 'tercatat'],
  tr_notdone:    ['not logged', 'belum dicatat'],
  tr_private:    ['Your prayer history stays on this device.',
                  'Riwayat salat tersimpan di perangkat ini.'],
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
  install_h:     ['Keeping Faham on your phone', 'Menyimpan Faham di ponselmu'],
  install_b:     ['Open the site in Chrome or Safari, then use the browser menu — “Add to Home screen” on Android, Share → “Add to Home Screen” on iPhone. After the first visit it works with no connection.',
                  'Buka situsnya di Chrome atau Safari, lalu gunakan menu peramban — “Tambahkan ke layar utama” di Android, Bagikan → “Tambahkan ke Layar Utama” di iPhone. Setelah kunjungan pertama, ia bekerja tanpa koneksi.']
};

function index() { return state.language === 'id' ? 1 : 0; }

/** The string for `key` in the active language. In 'both' mode, English. */
export function t(key) {
  const row = STRINGS[key];
  if (!row) return '';
  return row[index()];
}

/** Inline two-language literal, for content strings that live in data files. */
export function P(en, id) {
  return state.language === 'id' ? id : en;
}

/** The Indonesian half, rendered only in 'both' mode. */
export function idBlock(html, raw) {
  if (state.language !== 'both') return '';
  return '<div class="id-txt show"><span class="lbl">Bahasa Indonesia</span>' +
    (raw ? html : '<p>' + html + '</p>') + '</div>';
}

/** Pick from a `{en, id}` pair coming out of a data file. */
export function pickLang(pair) {
  if (!pair) return '';
  return state.language === 'id' ? (pair.id || pair.en || '') : (pair.en || pair.id || '');
}

/** The Indonesian half of an `{en, id}` pair, for 'both' mode. */
export function pickLangId(pair) {
  return pair ? (pair.id || '') : '';
}

export function isBoth() { return state.language === 'both'; }
