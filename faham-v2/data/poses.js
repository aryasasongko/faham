/* Side-profile pose geometry, facing right (qibla). viewBox 0 0 200 200, ground at y=182. */
export const POSES = {

 takbir: { label:"Takbiratul Ihram", head:{cx:100,cy:44,r:13}, headAfter:3,
   limbs:[
     [96,118, 94,150, 92,181],
     [100,62, 100,118],
     [104,118, 105,150, 107,181],
     [97,68, 78,90, 74,58],               // far arm: elbow low, hand up beside ear
     [103,68, 122,90, 126,58]             // near arm
   ]},

 qiyam: { label:"Standing", head:{cx:100,cy:44,r:13},
   limbs:[
     [96,118, 94,150, 92,181],
     [100,62, 100,118],
     [104,118, 105,150, 107,181],
     [103,68, 119,100, 96,92]             // one arm, folded across the body
   ]},

 ruku: { label:"Bowing", head:{cx:168,cy:104,r:13},
   limbs:[
     [96,117, 95,150, 93,181],
     [100,114, 148,108],
     [106,119, 107,150, 109,181],
     [148,111, 110,144]
   ]},

 itidal: { label:"Standing again", head:{cx:100,cy:44,r:13},
   limbs:[
     [96,118, 94,150, 92,181],
     [100,62, 100,118],
     [104,118, 105,150, 107,181],
     [94,69, 82,98, 84,122],              // far arm, held clear of the body
     [106,69, 118,98, 116,122]            // near arm
   ]},

 sujud: { label:"Prostration", head:{cx:157,cy:167,r:12},
   limbs:[
     [70,181, 98,178],
     [98,178, 106,133],
     [106,133, 138,155],
     [138,155, 152,133, 178,176]          // arm: raised elbow, forearm passing behind the head, palm on the ground
   ]},

 duduk: { label:"Sitting", head:{cx:105,cy:84,r:13},
   limbs:[
     [96,158, 74,178],
     [96,158, 102,100],
     [96,158, 136,162],
     [136,162, 140,181],
     [103,105, 113,133, 131,158]
   ]},

 tashahhud: { label:"Tashahhud", head:{cx:105,cy:84,r:13},
   limbs:[
     [96,158, 74,178],
     [96,158, 102,100],
     [96,158, 136,162],
     [136,162, 140,181],
     [103,105, 113,132, 129,153],
     [129,153, 143,140]
   ]},

 salam: { label:"Salam", head:{cx:105,cy:84,r:13},
   limbs:[
     [96,158, 74,178],
     [96,158, 102,100],
     [96,158, 136,162],
     [136,162, 140,181],
     [103,105, 113,133, 131,158]
   ], turn:true }
};
