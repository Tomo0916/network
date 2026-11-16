/* id: the text of lesson 12 (js/lessons.js) */
export default {
  "ls.12.lead": "Sinyal yang berjalan di kabel tidak selalu tiba dengan bersih. Di pelajaran ini Anda belajar tiga masalah, yaitu sinyal melemah, terganggu, dan bertabrakan, serta cara mengatasinya.",
  "ls.12.h1": "Atenuasi: makin jauh makin lemah",
  "ls.12.p1": "Sinyal sedikit demi sedikit melemah saat berjalan di kabel. Ini disebut [[attenuation:atenuasi]]. Jika terlalu lemah, penerima tidak bisa lagi membedakan 0 dan 1. Karena itu kabel LAN punya panjang maksimum (100 m untuk jenis yang umum).",
  "ls.12.cap1": "Sinyal yang besar saat baru dikirim makin kecil saat makin jauh, sampai tidak bisa dibaca.",
  "ls.12.h2": "Noise: gangguan dari luar",
  "ls.12.p2": "Listrik tambahan yang masuk dari sekitar, misalnya dari motor atau kabel listrik, disebut [[noise:noise]]. Jika noise bercampur dengan sinyal, bentuknya rusak dan terjadi kesalahan, misalnya 0 terlihat seperti 1. Kawat di dalam kabel LAN dipilin berpasangan untuk mengurangi noise.",
  "ls.12.cap2": "Jika noise bercampur dengan sinyal bersih (atas), bentuknya rusak dan salah dibaca (bawah).",
  "ls.12.h3": "Tabrakan: sinyal saling bertabrakan",
  "ls.12.p3": "Jika beberapa perangkat berbagi satu kabel dan dua perangkat mengirim bersamaan, sinyal saling tumpang tindih dan rusak. Inilah [[collision:tabrakan (collision)]]. Sinyal yang bertabrakan tidak bisa dibaca dengan benar oleh siapa pun.",
  "ls.12.cap3": "Jika sinyal dari kiri dan kanan bertumpuk, hasilnya bukan keduanya dan tidak bisa dibaca.",
  "ls.12.h4": "Solusinya: repeater",
  "ls.12.p4": "Jawaban untuk atenuasi adalah [[repeater:repeater]]. Repeater menerima sinyal yang melemah, mengembalikannya ke kekuatan dan bentuk aslinya, lalu mengirimkannya. Dengan begitu sinyal bisa sampai lebih jauh. Tetapi repeater hanya merapikan dan meneruskan sinyal, jadi tidak bisa mencegah tabrakan.",
  "ls.12.cap4": "Repeater mengembalikan sinyal yang melemah ke kekuatan aslinya lalu meneruskannya.",
  "ls.12.pt1": "[[attenuation:Atenuasi]]: sinyal makin lemah saat makin jauh, jadi kabel punya panjang maksimum.",
  "ls.12.pt2": "[[noise:Noise]]: listrik tambahan dari luar merusak bentuk sinyal.",
  "ls.12.pt3": "[[collision:Tabrakan]]: sinyal yang dikirim bersamaan bertumpuk dan rusak. Solusi untuk atenuasi adalah [[repeater:repeater]]."
};
