/* id: the text of lesson 19 (js/lessons.js) */
export default {
  "ls.19.lead": "Sejauh ini kita sudah melihat cara data berjalan di dalam satu jaringan. Lapisan 3 adalah lapisan yang menghubungkan jaringan satu dengan yang lain dan mengantar data ke penerima yang jauh.",
  "ls.19.h1": "Menghubungkan jaringan",
  "ls.19.p1": "LAN adalah jaringan di dalam satu gedung atau ruangan. Jika banyak LAN dihubungkan dengan [[router:router]], terbentuklah jaringan dari jaringan-jaringan, yang disebut [[internetwork:internetwork]]. Internet, yang menghubungkan jaringan di seluruh dunia, adalah contoh terbesarnya.",
  "ls.19.cap1": "Tiga LAN yang dihubungkan dua router menjadi satu internetwork besar.",
  "ls.19.h2": "Pembagian tugas lapisan 2 dan lapisan 3",
  "ls.19.p2": "Lapisan 2 (Ethernet dan lain-lain) hanya dapat mengantar data ke perangkat sebelah di jaringan yang sama. Lapisan 3 mengantar data dari pengirim ke tujuan akhir, melewati banyak jaringan. Lapisan 2 membawa data per bagian, sedangkan lapisan 3 menentukan arah seluruh perjalanan.",
  "ls.19.cap2": "Lapisan 2 membawa per bagian. Lapisan 3 mengurus seluruh jalan dari pengirim ke tujuan.",
  "ls.19.h3": "Alamat dan petunjuk jalan",
  "ls.19.p3": "Untuk mengantar jauh, dibutuhkan dua hal. Pertama, alamat yang membedakan penerima di seluruh dunia: [[ipaddress:alamat IP]]. Kedua, memilih jalan ke tujuan. Ini disebut [[routing:routing]], dan dikerjakan oleh router.",
  "ls.19.pt1": "Jaringan-jaringan yang dihubungkan [[router:router]] membentuk [[internetwork:internetwork]].",
  "ls.19.pt2": "Lapisan 2 mengantar ke perangkat sebelah, lapisan 3 ke tujuan akhir.",
  "ls.19.pt3": "Lapisan 3 membutuhkan alamat ([[ipaddress:alamat IP]]) dan petunjuk jalan ([[routing:routing]])."
};
