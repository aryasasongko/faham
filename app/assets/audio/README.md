# assets/audio

Drop MP3 files here using the exact filenames below, then list them in
`AUDIO_AVAILABLE` (see the note below) and they start working with no other code
change. Until a filename is listed, no play control is drawn for it anywhere —
so the app never offers a button that cannot play.

Filenames are declared in `data/audio-map.js`. That file is the contract; this
README is a copy of it for whoever is recording.

> **Two steps, not one.** Dropping the file in is not enough — add its filename
> to the `AUDIO_AVAILABLE` array in `data/audio-map.js` as well, then bump
> `VERSION` in `sw.js`. That array is what the app checks before drawing a play
> control, which is how it avoids offering buttons for recordings that do not
> exist yet. With the array empty (the shipped state) no local play controls
> appear anywhere; Quran recitation in the Surahs section is unaffected.

Recording guidance: 128 kbps mono MP3 is ample. Keep a short silence (~200 ms)
at the head and tail so playback does not clip. Record the prayer formulas at a
teaching pace rather than a performance pace.

## The prayer — `assets/audio/`

| Content ID | Arabic | Filename | Used in |
|---|---|---|---|
| `part:takbir` | اللَّهُ أَكْبَرُ | `takbir.mp3` | In the prayer |
| `part:iftitah` | اللَّهُ أَكْبَرُ كَبِيرًا… | `iftitah-wajjahtu.mp3` | In the prayer (Shafi'i, Maliki) |
| `part:iftitah` (variant) | سُبْحَانَكَ اللَّهُمَّ… | `iftitah-subhanaka.mp3` | In the prayer (Hanafi, Hanbali) |
| `part:ruku` | سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ | `ruku.mp3` | In the prayer |
| `part:itidal` | سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ… | `itidal.mp3` | In the prayer |
| `part:sujud` | سُبْحَانَ رَبِّيَ الْأَعْلَىٰ وَبِحَمْدِهِ | `sujud.mp3` | In the prayer |
| `part:duduk` | رَبِّ اغْفِرْ لِي وَارْحَمْنِي… | `duduk-antara-dua-sujud.mp3` | In the prayer |
| `part:tasyahud` | التَّحِيَّاتُ الْمُبَارَكَاتُ… | `tasyahud-ibn-abbas.mp3` | In the prayer (Shafi'i) |
| `part:tasyahud` (variant) | التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ… | `tasyahud-ibn-masud.mp3` | In the prayer (Hanafi, Hanbali) |
| `part:tasyahud` (variant) | التَّحِيَّاتُ لِلَّهِ، الزَّاكِيَاتُ لِلَّهِ… | `tasyahud-umar.mp3` | In the prayer (Maliki) |
| `part:salawat` | اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ… | `salawat-ibrahimiyah.mp3` | In the prayer |
| `part:salam` | السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ | `salam.mp3` | In the prayer |

## Everyday duas — `assets/audio/`

| Content ID | Filename |
|---|---|
| `dua:on-waking` | `dua-bangun-tidur.mp3` |
| `dua:leaving-the-house` | `dua-keluar-rumah.mp3` |
| `dua:before-eating` | `dua-sebelum-makan.mp3` |
| `dua:after-eating` | `dua-setelah-makan.mp3` |
| `dua:entering-the-bathroom` | `dua-masuk-kamar-mandi.mp3` |
| `dua:leaving-the-bathroom` | `dua-keluar-kamar-mandi.mp3` |
| `dua:setting-out-on-a-journey` | `dua-memulai-perjalanan.mp3` |
| `dua:entering-the-masjid` | `dua-masuk-masjid.mp3` |
| `dua:leaving-the-masjid` | `dua-keluar-masjid.mp3` |
| `dua:anxiety-and-grief` | `dua-cemas-dan-sedih.mp3` |
| `dua:when-something-is-beyond-you` | `dua-di-luar-kemampuan.mp3` |
| `dua:for-your-parents` | `dua-untuk-orang-tua.mp3` |
| `dua:before-sleeping` | `dua-sebelum-tidur.mp3` |

## Vocabulary — `assets/audio/vocab/`

One file per word, named from the transliteration slug (lowercase, diacritics
stripped, non-alphanumerics collapsed to `-`):

```
allah.mp3   akbar.mp3   al-hamd.mp3   rabb.mp3   al-alamin.mp3
ar-rahman.mp3   ar-rahim.mp3   malik.mp3   yawm.mp3   ad-din.mp3
… one per entry in data/vocab.js, thirty in total …
```

Run this in the browser console on the running app to print the exact list:

```js
import('./data/vocab.js').then(async (m) => {
  const { slug } = await import('./js/audio.js');
  console.log(m.VOCAB.map((v) => 'vocab/' + slug(v.tl) + '.mp3').join('\n'));
});
```

## Quran recitation is *not* stored here

Verse audio in the Surahs section is fetched by surah:ayah from a recitation
CDN and cached on demand by the service worker. A Quran API is only ever asked
for Quran; nothing in this folder is involved.
