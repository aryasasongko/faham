# Scholarly review checklist

Everything in this file is **written and shipping, but not yet approved by a
qualified reviewer.** Nothing in the app claims otherwise: no entry anywhere is
labelled "scholar reviewed", and the areas that vary by school say so in place.

When a reviewer signs off on an item, record their name, role and the date in
the "Reviewed by" column and set `review: true` on the corresponding block in
`data/madhhab-data.js` (or remove the item from this file if it lives elsewhere).

## How content is classed in this app

| Class | Where it appears | What it claims |
|---|---|---|
| Quranic text | `data/surahs.js`, the `v` arrays in `data/stories.js` | Verbatim Arabic, checked word by word against the Uthmani text on Quran.com |
| Translation of Quran | the `en` / `id` / `ko` beside each verse | A plain rendering for comprehension. Not an authorised translation and carries no authority |
| Hadith-derived wording | `data/parts.js` (iftitah, tashahhud, salawat), `data/madhhab-data.js` | Transmitted formulas with more than one valid narration. **Not verified against a primary source in this repository** |
| School-specific fiqh | `data/madhhab-data.js` | Attributed to a named school; the app never presents one school as universal |
| Disputed questions | `data/faq.js` entries carrying a `d` field | Marked disputed in the UI rather than settled |
| Editorial reflection | `data/concepts.js`, `data/islam.js`, `data/stories.js`, the `why` fields | The app's own explanatory voice. Not a ruling |

## Awaiting review

### Prayer formulas (Arabic wording and transliteration)
- [ ] Doa Iftitah — Shafi'i wording (`data/parts.js`)
- [ ] Thanā — Hanafi / Hanbali wording (`js/walkthrough.js`, `data/madhhab-data.js`)
- [ ] Tashahhud — Ibn Mas'ud narration (Hanafi, Hanbali)
- [ ] Tashahhud — Ibn Abbas narration (Shafi'i)
- [ ] Tashahhud — narration attributed to Umar (Maliki)
- [ ] Salawat, short and full forms
- [ ] Qunut (Fajr, and the Witr forms in each school)
- [ ] Ruku', I'tidal, Sujud and the sitting between prostrations
- [ ] All transliterations, and the transliteration scheme itself

### Fiqh claims
- [ ] Every row of `data/madhhab-data.js` currently flagged `review: true`
- [ ] The obligatory core listed in `data/faq.js` (the "is that all?" answer)
- [ ] Wudhu: which acts are obligatory vs sunnah in each school (`data/wudhu.js`)
- [ ] Muwalat treated as sunnah in the Shafi'i school
- [ ] Only the first salam being a rukn in the Shafi'i school
- [ ] Head-wiping: partial vs whole, by school
- [ ] Masbuq — joining after the imam has bowed
- [ ] Qasr and Jumat, as summarised under "Fridays and travelling"
- [ ] Sujud sahwi in `data/sahwi.js`, including whether the two prostrations
      fall before or after the salam in each school
- [ ] The Asr shadow conventions driving the calculation (`js/madhhab.js`)

### Duas
- [ ] All thirteen entries in `data/duas.js`: Arabic, attribution and rendering
- [ ] The three drawn from Quranic verses, where only a fragment is quoted

### Prayer times
- [ ] The four-minute ihtiyāṭ applied to the Kemenag-angle method
      (`js/prayer-times.js`) — the reasoning is documented in the file and the
      margin is surfaced in the UI, but the choice deserves a knowledgeable eye
- [ ] The high-latitude fallback (one-seventh of the night)

### Translations
- [ ] Indonesian throughout — reviewed by a native speaker, not by a scholar
- [ ] Korean throughout — **not yet reviewed by a Korean Muslim.** The app says
      so on the Today screen in Korean
- [ ] The nine essays, ten stories and vocabulary notes are English-only in
      Korean and carry an on-screen "not translated yet" banner

## Explicitly NOT claimed anywhere in the app
- That any content has been approved by a scholar or an institution
- That the prayer times reproduce the published Kemenag table (the method is
  labelled "Kemenag angles", not "Kemenag")
- That the hadith-derived prayer texts have been checked against a primary source
- That the Korean has been reviewed by a Korean Muslim
