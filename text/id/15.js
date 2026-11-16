/* id: the text of lesson 15 (js/lessons.js) */
export default {
  "ls.15.lead": "Jika banyak perangkat ada di satu jaringan, setiap frame perlu alamat yang menunjukkan untuk siapa. Alamat Layer 2 adalah [[mac:alamat MAC]]. Di pelajaran ini Anda belajar susunan alamat MAC dan tiga jenis tujuan.",
  "ls.15.h1": "Susunan alamat MAC",
  "ls.15.p1": "[[mac:Alamat MAC]] adalah nomor 48 bit yang ditulis di pabrik ke setiap NIC. Biasanya ditulis dalam enam kelompok dua digit heksadesimal, seperti 00:1A:2B:3C:4D:5E. 24 bit pertama adalah nomor pembuat (OUI), dan 24 bit terakhir adalah nomor seri dari pembuat.",
  "ls.15.cap1": "Alamat MAC 48 bit. Tiga byte pertama nomor pembuat, tiga byte terakhir nomor seri.",
  "ls.15.h2": "Tiga jenis tujuan",
  "ls.15.p2": "Mengirim ke satu perangkat disebut [[unicast:unicast]], ke semua di jaringan yang sama disebut [[broadcast:broadcast]], dan hanya ke kelompok tertentu disebut [[multicast:multicast]]. Alamat MAC tujuan untuk broadcast adalah FF:FF:FF:FF:FF:FF, semua 48 bitnya 1.",
  "ls.15.cap2": "Dari kiri: unicast (satu perangkat), broadcast (semua), multicast (kelompok). Yang hijau menerima.",
  "ls.15.h3": "NIC memutuskan menerima atau tidak",
  "ls.15.p3": "Header frame [[ethernet:Ethernet]] berisi alamat MAC tujuan dan alamat MAC asal. NIC melihat tujuan setiap frame yang tiba. Jika itu alamat MAC-nya sendiri, broadcast, atau kelompok multicast yang diikutinya, frame diterima. Selain itu, frame dibuang.",
  "ls.15.cap3": "NIC hanya melihat alamat MAC tujuan untuk memutuskan menerima atau membuang frame.",
  "ls.15.pt1": "[[mac:Alamat MAC]] 48 bit: 24 bit nomor pembuat dan 24 bit nomor seri.",
  "ls.15.pt2": "Ke satu = [[unicast:unicast]], ke semua = [[broadcast:broadcast]], ke kelompok = [[multicast:multicast]].",
  "ls.15.pt3": "NIC melihat alamat MAC tujuan dan membuang frame yang bukan untuknya."
};
