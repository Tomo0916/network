/* id: the text of lesson 23 (js/lessons.js) */
export default {
  "ls.23.lead": "Jika hanya memakai kelas, satu jaringan bisa menjadi sangat besar. [[subnetting:Subnetting]] adalah cara membagi satu jaringan menjadi jaringan-jaringan yang lebih kecil (subnet).",
  "ls.23.h1": "Meminjam bit bagian host",
  "ls.23.p1": "Dalam subnetting, bit-bit awal bagian host dipinjam untuk memperpanjang bagian jaringan. Misalnya, jaringan kelas B 172.16.0.0, jika tiga angka pertamanya dijadikan bagian jaringan, dapat dibagi menjadi banyak jaringan kecil seperti 172.16.1.0, 172.16.2.0, dan seterusnya. Membagi jaringan per bagian kantor membuatnya lebih mudah dikelola.",
  "ls.23.cap1": "Jaringan kelas B yang besar dibagi menjadi subnet kecil untuk tiap bagian kantor.",
  "ls.23.h2": "Subnet mask",
  "ls.23.p2": "[[subnetmask:Subnet mask]] menunjukkan sampai mana bagian jaringan. Bilangan 32 bit ini bernilai 1 pada bit bagian jaringan dan 0 pada bit bagian host, ditulis dalam desimal seperti alamat IP. Dengan 255.255.255.0, 24 bit pertama adalah bagian jaringan.",
  "ls.23.cap2": "Bagian mask yang bernilai 1 adalah bagian jaringan; yang 0 adalah bagian host.",
  "ls.23.h3": "Menghitung alamat jaringan",
  "ls.23.p3": "Jika alamat IP dan subnet mask dihitung bit per bit dengan AND (1 hanya jika keduanya 1), hasilnya adalah alamat jaringan. Jika alamat jaringan kita dan tujuan sama, penerima ada di jaringan yang sama. Jika berbeda, perlu dibawa oleh router.",
  "ls.23.cap3": "192.168.1.130 AND 255.255.255.192 menghasilkan 192.168.1.128.",
  "ls.23.pt1": "[[subnetting:Subnetting]] meminjam bagian host untuk membagi jaringan menjadi lebih kecil.",
  "ls.23.pt2": "[[subnetmask:Subnet mask]] bernilai 1 untuk bagian jaringan dan 0 untuk bagian host.",
  "ls.23.pt3": "Alamat IP AND mask menghasilkan alamat jaringan."
};
