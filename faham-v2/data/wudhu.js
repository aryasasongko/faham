/* Wudhu, in order.
   Base text is written school-neutral; every genuine difference between the four
   schools is expressed as an override in `data/madhhab-data.js` under
   `wudhu[<key>]`, never inline here. `ob` is the *base* ruling and may be
   overridden per school (Hanafi, for instance, treats intention and order as
   sunnah rather than obligatory). */
export const WUDHU = [
 {key:"niyyah", t:"Intention", tid:"Niat",
  d:"Formed in the heart as you begin — that this washing is for purification before worship.",
  id:"Dibentuk dalam hati saat memulai — bahwa bersuci ini untuk ibadah.", ob:true},

 {key:"hands", t:"Wash both hands to the wrists", tid:"Membasuh kedua tangan sampai pergelangan",
  d:"Three times. Sunnah, and the natural first move.",
  id:"Tiga kali. Sunnah, dan gerakan pembuka yang wajar.", ob:false},

 {key:"mouth-nose", t:"Rinse the mouth and nose", tid:"Berkumur dan menghirup air ke hidung",
  d:"Three times each. Sunnah; water taken into the mouth and lightly into the nose, then expelled.",
  id:"Masing-masing tiga kali. Sunnah; berkumur dan memasukkan air ke hidung dengan ringan, lalu dikeluarkan.", ob:false},

 {key:"face", t:"Wash the face", tid:"Membasuh wajah",
  d:"Three times, from the hairline to below the chin, ear to ear. Obligatory.",
  id:"Tiga kali, dari batas rambut sampai bawah dagu, dari telinga ke telinga. Wajib.", ob:true},

 {key:"arms", t:"Wash both arms to the elbows", tid:"Membasuh kedua lengan sampai siku",
  d:"Three times, right then left, including the elbows. Obligatory.",
  id:"Tiga kali, kanan lalu kiri, termasuk sikunya. Wajib.", ob:true},

 {key:"head", t:"Wipe the head", tid:"Mengusap kepala",
  d:"With wet hands. Obligatory — how much of the head must be wiped is the one point the schools differ on.",
  id:"Dengan tangan basah. Wajib — seberapa banyak bagian kepala yang harus diusap adalah satu-satunya titik yang diperselisihkan antarmazhab.", ob:true},

 {key:"ears", t:"Wipe the ears", tid:"Mengusap kedua telinga",
  d:"Inside and out, with wet hands. Sunnah.",
  id:"Bagian dalam dan luar, dengan tangan basah. Sunnah.", ob:false},

 {key:"feet", t:"Wash both feet to the ankles", tid:"Membasuh kedua kaki sampai mata kaki",
  d:"Three times, right then left, between the toes. Obligatory.",
  id:"Tiga kali, kanan lalu kiri, termasuk sela-sela jari. Wajib.", ob:true},

 {key:"tartib", t:"In order (tartib)", tid:"Berurutan (tertib)",
  d:"The obligatory acts follow this sequence rather than any order you like.",
  id:"Rukun-rukun wajib dikerjakan berurutan seperti ini, bukan sembarang urutan.", ob:true},

 {key:"muwalat", t:"Without long gaps (muwalat)", tid:"Tanpa jeda panjang (muwalat)",
  d:"Doing it continuously, so one limb has not dried before the next is washed.",
  id:"Melakukannya berkesinambungan, sehingga satu anggota belum kering sebelum yang berikutnya dibasuh.", ob:false}
];
