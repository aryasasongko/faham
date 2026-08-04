/* Wudhu, in order.
   Base text is written school-neutral; every genuine difference between the four
   schools is expressed as an override in `data/madhhab-data.js` under
   `wudhu[<key>]`, never inline here. `ob` is the *base* ruling and may be
   overridden per school (Hanafi, for instance, treats intention and order as
   sunnah rather than obligatory). */
export const WUDHU = [
{key:"niyyah", t:"Intention", tid:"Niat", tko:"니야(의도)", d:"Formed in the heart as you begin — that this washing is for purification before worship.", id:"Dibentuk dalam hati saat memulai — bahwa bersuci ini untuk ibadah.", dko:"씻기 시작할 때 마음속으로 정합니다. 이 씻는 일이 예배를 위한 정결이라는 것을요.", ob:true},

{key:"hands", t:"Wash both hands to the wrists", tid:"Membasuh kedua tangan sampai pergelangan", tko:"두 손을 손목까지 씻기", d:"Three times. Sunnah, and the natural first move.", id:"Tiga kali. Sunnah, dan gerakan pembuka yang wajar.", dko:"세 번. 순나이며, 자연스러운 첫 동작입니다.", ob:false},

{key:"mouth-nose", t:"Rinse the mouth and nose", tid:"Berkumur dan menghirup air ke hidung", tko:"입을 헹구고 코에 물을 넣기", d:"Three times each. Sunnah; water taken into the mouth and lightly into the nose, then expelled.", id:"Masing-masing tiga kali. Sunnah; berkumur dan memasukkan air ke hidung dengan ringan, lalu dikeluarkan.", dko:"각각 세 번. 순나입니다. 입에 물을 머금었다 뱉고, 코에 가볍게 넣었다 풀어냅니다.", ob:false},

{key:"face", t:"Wash the face", tid:"Membasuh wajah", tko:"얼굴 씻기", d:"Three times, from the hairline to below the chin, ear to ear. Obligatory.", id:"Tiga kali, dari batas rambut sampai bawah dagu, dari telinga ke telinga. Wajib.", dko:"세 번. 머리카락이 시작되는 곳에서 턱 아래까지, 귀에서 귀까지. 의무입니다.", ob:true},

{key:"arms", t:"Wash both arms to the elbows", tid:"Membasuh kedua lengan sampai siku", tko:"두 팔을 팔꿈치까지 씻기", d:"Three times, right then left, including the elbows. Obligatory.", id:"Tiga kali, kanan lalu kiri, termasuk sikunya. Wajib.", dko:"세 번. 오른쪽 다음 왼쪽, 팔꿈치를 포함해서. 의무입니다.", ob:true},

{key:"head", t:"Wipe part of the head", tid:"Mengusap sebagian kepala", tko:"머리의 일부를 쓸기", d:"With wet hands. Obligatory — in Shafi'i (and Hanafi) practice wiping any part suffices, though most wipe the whole head. Maliki and Hanbali require the whole head.", id:"Dengan tangan basah. Wajib — dalam mazhab Syafi'i (dan Hanafi) mengusap sebagian saja sudah cukup, meski umumnya diusap seluruhnya. Maliki dan Hanbali mewajibkan seluruh kepala.", dko:"젖은 손으로. 의무입니다 — 샤피이와 하나피 학파에서는 일부만 쓸어도 되지만, 대개는 머리 전체를 쓸어냅니다. 말리키와 한발리 학파는 전체를 요구합니다.", ob:true},

{key:"ears", t:"Wipe the ears", tid:"Mengusap kedua telinga", tko:"두 귀를 쓸기", d:"Inside and out, with wet hands. Sunnah.", id:"Bagian dalam dan luar, dengan tangan basah. Sunnah.", dko:"젖은 손으로 안팎을. 순나입니다.", ob:false},

{key:"feet", t:"Wash both feet to the ankles", tid:"Membasuh kedua kaki sampai mata kaki", tko:"두 발을 복사뼈까지 씻기", d:"Three times, right then left, between the toes. Obligatory.", id:"Tiga kali, kanan lalu kiri, termasuk sela-sela jari. Wajib.", dko:"세 번. 오른쪽 다음 왼쪽, 발가락 사이도 빠뜨리지 않고. 의무입니다.", ob:true},

{key:"tartib", t:"In order (tartib)", tid:"Berurutan (tertib)", tko:"순서대로(타르티브)", d:"The obligatory acts must follow this sequence. Obligatory. The intention from step 1 is what carries you here: it must still be present at the moment you begin washing the face, not only before you started.", id:"Rukun-rukun wajib harus dilakukan berurutan. Wajib — dan niat harus hadir pada saat mulai membasuh wajah, bukan sekadar sebelumnya.", dko:"의무 동작은 이 순서를 따라야 합니다. 의무입니다 — 그리고 의도는 얼굴을 씻기 시작하는 그 순간에 있어야 합니다.", ob:true},

{key:"muwalat", t:"Without long gaps (muwalat)", tid:"Tanpa jeda panjang (muwalat)", tko:"끊김 없이(무왈라)", d:"Doing it continuously, so one limb has not dried before the next is washed. In the Shafi'i school this is sunnah, not obligatory — your wudhu is still valid if you were interrupted. Maliki and Hanbali hold it obligatory.", id:"Melakukannya berkesinambungan, sehingga satu anggota belum kering sebelum yang berikutnya dibasuh. Dalam mazhab Syafi'i ini sunnah, bukan wajib — wudhumu tetap sah meski sempat terputus. Maliki dan Hanbali mewajibkannya.", dko:"한 부위가 마르기 전에 다음 부위를 씻는 것처럼, 끊지 않고 이어서 하는 것입니다. 샤피이 학파에서는 의무가 아니라 순나로 보기 때문에, 중간에 끊겼더라도 우두는 유효합니다. 말리키와 한발리 학파는 의무로 봅니다.", ob:false}
];
