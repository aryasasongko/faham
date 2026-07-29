/* The five obligatory prayers: structure only. School-specific notes live in madhhab-data.js. */
/* `name` is the Indonesian name used across Indonesia; `nameEn` is the form an
   English-speaking learner will meet elsewhere. Views render whichever matches
   the active language. */
export const PRAYERS = [
 {id:"subuh", nameEn:"Fajr", name:"Subuh", time:"Dawn", timeid:"Fajar", rak:2, aloud:"Aloud", aloudid:"Keras",
  diffid:"Sholat terpendek. Dua rakaat, dibaca keras, dan tanpa tasyahud awal — kamu duduk sekali saja, di akhir. Apakah qunut ditambahkan pada rakaat kedua adalah titik perbedaan antarmazhab; catatan di bawah mengikuti mazhab yang kamu pilih.", diff:"The shortest prayer. Two rakaat, recited aloud, and no middle tashahhud — you sit once, at the end. Whether a qunut supplication is added in the second rakaat is where the schools part company; the note below follows the one you have selected."},
 {id:"dzuhur", nameEn:"Dhuhr", name:"Dzuhur", time:"Midday", timeid:"Tengah hari", rak:4, aloud:"Silent", aloudid:"Pelan",
  diffid:"Dibaca pelan — termasuk Al-Fatihah. Tasyahud awal setelah rakaat 2. Rakaat 3 dan 4 hanya Al-Fatihah, tanpa surah tambahan.", diff:"Recited silently — even Al-Fatihah. Middle tashahhud after rakaat 2. Rakaat 3 and 4 are Al-Fatihah only, no extra surah."},
 {id:"ashar", nameEn:"Asr", name:"Ashar", time:"Afternoon", timeid:"Sore", rak:4, aloud:"Silent", aloudid:"Pelan",
  diffid:"Strukturnya sama persis dengan Dzuhur. Pelan seluruhnya, tasyahud awal setelah rakaat 2, tanpa surah tambahan di rakaat 3 dan 4.", diff:"Identical in structure to Dzuhur. Silent throughout, middle tashahhud after rakaat 2, no extra surah in rakaat 3 and 4."},
 {id:"maghrib", nameEn:"Maghrib", name:"Maghrib", time:"Just after sunset", timeid:"Setelah matahari terbenam", rak:3, aloud:"Aloud in 1–2", aloudid:"Keras di 1–2",
  diffid:"Satu-satunya sholat dengan jumlah ganjil tiga rakaat. Keras di rakaat 1 dan 2, pelan di rakaat 3. Tasyahud awal setelah rakaat 2, lalu satu rakaat dengan Al-Fatihah saja.", diff:"The only prayer with an odd three rakaat. Aloud in rakaat 1 and 2, silent in rakaat 3. Middle tashahhud after rakaat 2, then a single rakaat with Al-Fatihah only."},
 {id:"isya", nameEn:"Isha", name:"Isya", time:"Night", timeid:"Malam", rak:4, aloud:"Aloud in 1–2", aloudid:"Keras di 1–2",
  diffid:"Keras di rakaat 1 dan 2, pelan di rakaat 3 dan 4. Tasyahud awal setelah rakaat 2. Rakaat 3 dan 4 hanya Al-Fatihah.", diff:"Aloud in rakaat 1 and 2, silent in 3 and 4. Middle tashahhud after rakaat 2. Rakaat 3 and 4 are Al-Fatihah only."}
];
