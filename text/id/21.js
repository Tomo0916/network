/* id: the text of lesson 21 (js/lessons.js) */
export default {
  "ls.21.lead": "[[ipaddress:Alamat IP]] adalah nomor untuk membedakan perangkat di dalam internetwork. Di sini kita melihat cara menulis alamat IPv4 dan isinya.",
  "ls.21.h1": "32 bit dibagi empat",
  "ls.21.p1": "Alamat IPv4 panjangnya 32 bit. Tiga puluh dua angka 0 dan 1 sulit dibaca, jadi dibagi menjadi empat kelompok 8 bit, tiap kelompok ditulis dalam desimal, lalu disambung dengan titik. 8 bit dapat menyatakan 0 sampai 255, jadi setiap angka bernilai 0–255.",
  "ls.21.cap1": "Jika ditulis dalam biner, 192.168.1.10 menjadi empat kelompok 8 bit.",
  "ls.21.h2": "Bagian jaringan dan bagian host",
  "ls.21.p2": "Alamat IP terbagi menjadi bagian depan dan bagian belakang. Bagian depan adalah [[netpart:bagian jaringan]] yang menunjukkan jaringan mana. Bagian belakang adalah [[hostpart:bagian host]] yang menunjukkan perangkat mana di jaringan itu. Perangkat di jaringan yang sama memiliki bagian jaringan yang sama.",
  "ls.21.cap2": "Semua perangkat di LAN kiri memiliki bagian jaringan 192.168.1. Bagian host membedakan satu per satu.",
  "ls.21.h3": "Seperti alamat rumah",
  "ls.21.p3": "Bagian jaringan seperti nama kota, dan bagian host seperti nomor rumah. Surat dibawa dulu ke kota, lalu rumah dicari dengan nomornya. [[router:Router]] juga melihat bagian jaringan terlebih dahulu dan membawa paket ke jaringan tujuan.",
  "ls.21.pt1": "[[ipaddress:Alamat IP]] IPv4 panjangnya 32 bit, ditulis sebagai empat angka desimal 8 bit.",
  "ls.21.pt2": "Depan: [[netpart:bagian jaringan]] (jaringan mana). Belakang: [[hostpart:bagian host]] (perangkat mana).",
  "ls.21.pt3": "Router melihat bagian jaringan terlebih dahulu."
};
