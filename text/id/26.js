/* id: the text of lesson 26 (js/lessons.js) */
export default {
  "ls.26.lead": "Meskipun tahu alamat IP, untuk mengirim frame di Ethernet dibutuhkan alamat MAC penerima. [[arp:ARP]] adalah protokol untuk mencari alamat MAC dari alamat IP.",
  "ls.26.h1": "Alamat IP saja tidak cukup",
  "ls.26.p1": "Saat komputer mengirim paket IP, paket itu dibawa di dalam frame Ethernet. Tujuan frame harus berupa [[mac:alamat MAC]]. Tetapi komputer hanya tahu alamat IP penerima. Karena itu, alamat MAC harus dicari dari alamat IP.",
  "ls.26.cap1": "Alamat IP tujuan diketahui, tetapi alamat MAC tujuan untuk frame tidak diketahui.",
  "ls.26.h2": "Cara kerja ARP",
  "ls.26.p2": "Pertama, ARP mengirim permintaan ARP ke semua perangkat dengan [[broadcast:broadcast]]: \"Siapa yang punya 192.168.1.20? Beri tahu alamat MAC-mu.\" Hanya perangkat yang punya alamat IP itu yang mengirim balasan ARP berisi alamat MAC-nya, dengan [[unicast:unicast]]. Perangkat lain membuang permintaan itu.",
  "ls.26.cap2": "Permintaan ke semua (broadcast), balasan hanya dari pemiliknya (unicast).",
  "ls.26.h3": "Tabel ARP",
  "ls.26.p3": "Hasilnya disimpan sebentar di [[arptable:tabel ARP]]. Lain kali cukup melihat tabel, jadi tidak perlu mengirim ARP setiap kali. Tetapi perangkat bisa berganti, jadi entri dihapus setelah beberapa waktu. Jika tujuan berada di jaringan lain, yang dicari adalah alamat MAC default gateway, bukan penerima.",
  "ls.26.cap3": "Tabel ARP berisi pasangan alamat IP dan alamat MAC.",
  "ls.26.pt1": "[[arp:ARP]] mencari alamat MAC dari alamat IP.",
  "ls.26.pt2": "Permintaan berupa broadcast, balasan berupa unicast.",
  "ls.26.pt3": "Hasilnya disimpan sebentar di [[arptable:tabel ARP]]."
};
