/* id: the text of lesson 22 (js/lessons.js) */
export default {
  "ls.22.lead": "Bagaimana kita tahu sampai mana bagian jaringan dari alamat IP? Cara pertama yang dibuat adalah \"kelas\". Selain itu, ada alamat IP yang memiliki arti khusus.",
  "ls.22.h1": "Kelas alamat IP",
  "ls.22.p1": "Pada [[ipclass:kelas alamat IP]], angka pertama menentukan panjang bagian jaringan. Pada kelas A, 8 bit pertama adalah bagian jaringan; kelas B, 16 bit pertama; kelas C, 24 bit pertama. Kelas A untuk jaringan besar, kelas C untuk jaringan kecil.",
  "ls.22.cap1": "Panjang bagian jaringan dan bagian host pada kelas A, B, dan C, serta rentang angka pertama.",
  "ls.22.h2": "Bagian host semua 0 atau semua 1",
  "ls.22.p2": "Alamat yang bit bagian host-nya semua 0 adalah [[netaddr:alamat jaringan]], yang mewakili jaringan itu sendiri. Alamat yang semuanya 1 adalah [[bcastaddr:alamat broadcast]], dipakai untuk mengirim ke semua perangkat di jaringan. Keduanya tidak bisa diberikan ke perangkat, jadi jumlah yang bisa dipakai adalah jumlah kombinasi bagian host dikurangi 2.",
  "ls.22.cap2": "Jaringan 192.168.1.0–255. Perangkat dapat memakai 1–254, yaitu 254 alamat.",
  "ls.22.h3": "Alamat untuk diri sendiri",
  "ls.22.p3": "Alamat yang diawali 127 adalah [[loopback:alamat loopback]] yang berarti perangkat itu sendiri. Yang paling sering dipakai adalah 127.0.0.1. Data yang dikirim ke alamat ini tidak keluar ke jaringan, tetapi kembali ke diri sendiri, sehingga berguna untuk mencoba program di komputer sendiri.",
  "ls.22.cap3": "Data yang dikirim ke 127.0.0.1 tidak keluar, tetapi kembali ke komputer yang sama.",
  "ls.22.pt1": "Pada [[ipclass:kelas]] A, B, dan C, bagian jaringan 8, 16, dan 24 bit.",
  "ls.22.pt2": "Bagian host semua 0 adalah [[netaddr:alamat jaringan]], semua 1 adalah [[bcastaddr:alamat broadcast]].",
  "ls.22.pt3": "[[loopback:Alamat loopback]] seperti 127.0.0.1 berarti diri sendiri."
};
