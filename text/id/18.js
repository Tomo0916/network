/* id: the text of lesson 18 (js/lessons.js) */
export default {
  "ls.18.lead": "Dengan switch, perangkat bisa memakai full duplex: mengirim dan menerima bersamaan. Di pelajaran ini Anda belajar perbedaan half duplex dan full duplex, serta buffering yang mendukungnya.",
  "ls.18.h1": "Half duplex dan full duplex",
  "ls.18.p1": "Komunikasi yang tidak bisa mengirim dan menerima bersamaan, dan melakukannya satu per satu, disebut [[halfduplex:half duplex]]. Seperti walkie-talkie, yang berbicara dan yang mendengar bergantian. Komunikasi yang bisa melakukan keduanya sekaligus disebut [[fullduplex:full duplex]]. Seperti telepon, Anda tetap mendengar lawan bicara walaupun sedang berbicara.",
  "ls.18.cap1": "Kiri: half duplex memakai satu jalan bergantian. Kanan: full duplex punya jalan pergi dan pulang terpisah, jadi bisa dipakai bersamaan.",
  "ls.18.h2": "Mengapa full duplex tidak bertabrakan",
  "ls.18.p2": "Di dalam kabel LAN ada kawat terpisah untuk mengirim dan menerima. Jika dua perangkat dihubungkan satu lawan satu, sinyal kirim dan sinyal terima lewat kawat yang berbeda, jadi tidak pernah bertabrakan. Jika banyak perangkat berbagi kawat yang sama seperti pada hub, pemisahan ini tidak bisa dilakukan, sehingga menjadi half duplex.",
  "ls.18.cap2": "Kawat kirim (TX) PC tersambung ke sisi terima (RX) switch, dan kawat kirim switch ke sisi terima PC.",
  "ls.18.h3": "Buffering",
  "ls.18.p3": "Kadang frame untuk tujuan yang sama tiba di switch dari port yang berbeda pada saat yang sama. Switch menyimpan frame sebentar di memori dan mengirimnya bergantian. Ini disebut [[buffering:buffering]]. Berkat buffering, tidak ada tabrakan di dalam switch. Dengan full duplex, [[csmacd:CSMA/CD]] juga tidak diperlukan.",
  "ls.18.cap3": "Frame untuk C yang tiba bersamaan dari A dan B disimpan di buffer lalu dikirim satu per satu.",
  "ls.18.pt1": "[[halfduplex:Half duplex]]: kirim atau terima, satu per satu. [[fullduplex:Full duplex]]: keduanya bersamaan.",
  "ls.18.pt2": "Pada full duplex, kawat kirim dan terima terpisah, jadi tidak ada tabrakan dan tidak perlu [[csmacd:CSMA/CD]].",
  "ls.18.pt3": "Switch memakai [[buffering:buffering]] untuk mengirim bergantian frame yang tiba bersamaan."
};
