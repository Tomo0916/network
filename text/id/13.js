/* id: the text of lesson 13 (js/lessons.js) */
export default {
  "ls.13.lead": "[[hub:Hub]] adalah perangkat yang mengumpulkan banyak komputer di satu tempat dan menghubungkannya dengan kabel LAN. Cara kerjanya sangat sederhana, dan kesederhanaan itu juga menjadi kelemahannya.",
  "ls.13.h1": "Cara kerja hub: ke semua port",
  "ls.13.p1": "Hub mengirim sinyal yang datang di satu port ke semua port lain apa adanya. Hub tidak melihat siapa tujuannya. Merapikan sinyal lalu meneruskannya adalah tugas yang sama dengan [[repeater:repeater]], jadi hub bisa dianggap sebagai repeater dengan banyak port. Karena tidak melihat alamat, hub adalah perangkat Layer 1.",
  "ls.13.cap1": "Saat PC A mengirim ke PC C, hub mengirim ke B, C, dan D. B dan D membuangnya karena bukan untuk mereka.",
  "ls.13.h2": "Kelemahan hub: tabrakan",
  "ls.13.p2": "Perangkat pada hub seperti berbagi satu kabel bersama. Jika dua perangkat mengirim bersamaan, sinyal bertabrakan di dalam hub dan rusak. Ini disebut [[collision:tabrakan (collision)]]. Karena itu perangkat pada hub tidak bisa mengirim dan menerima pada saat yang sama. Komunikasi seperti ini disebut [[halfduplex:half duplex]].",
  "ls.13.cap2": "Jika A dan C mengirim bersamaan, sinyal bertabrakan. B dan D hanya mendapat sinyal rusak, dan A serta C harus mengirim ulang.",
  "ls.13.h3": "Collision domain",
  "ls.13.p3": "Wilayah yang terkena dampak tabrakan disebut [[colldomain:collision domain]]. Semua perangkat pada satu hub membentuk satu collision domain. Makin banyak perangkat, makin sering tabrakan terjadi, dan seluruh jaringan menjadi lambat. Masalah ini diatasi oleh [[switch:switch]] (pelajaran 17).",
  "ls.13.cap3": "Pada hub, keempat PC adalah satu collision domain. Pada switch, setiap port terpisah, jadi ada empat.",
  "ls.13.h4": "Periksa dengan animasi",
  "ls.13.p4": "Biarkan \"hub\" terpilih, pilih pengirim dan tujuan, lalu kirim. Perhatikan frame yang juga sampai ke PC yang bukan tujuan, dan jumlah frame yang terkirim sia-sia. Lalu ganti ke \"switch\" dan kirim dengan cara yang sama untuk melihat perbedaannya.",
  "ls.13.pt1": "Hub mengirim sinyal yang diterima ke semua port lain. Hub tidak melihat tujuan.",
  "ls.13.pt2": "Hub adalah perangkat Layer 1, bisa dianggap sebagai [[repeater:repeater]] dengan banyak port.",
  "ls.13.pt3": "Semua perangkat pada hub membentuk satu [[colldomain:collision domain]]. Makin banyak perangkat, makin banyak tabrakan.",
  "ls.13.cap4": "Repeater punya dua port. Hub melakukan tugas yang sama dengan banyak port."
};
