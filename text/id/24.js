/* id: the text of lesson 24 (js/lessons.js) */
export default {
  "ls.24.lead": "Dengan kelas, ukuran jaringan hanya ada tiga macam. Karena itu mulai dipakai cara menentukan panjang bagian jaringan dengan bebas tanpa terikat kelas. Inilah [[cidr:CIDR]] (pengalamatan tanpa kelas).",
  "ls.24.h1": "Kelas membuang alamat",
  "ls.24.p1": "Kelas C dapat dipakai 254 perangkat, kelas B sekitar 65.000. Untuk jaringan 500 perangkat, kelas C tidak cukup, sedangkan dengan kelas B sebagian besar alamat tidak terpakai. Alamat IPv4 terbatas, jadi pemborosan ini menjadi masalah besar.",
  "ls.24.cap1": "Memakai kelas B untuk 500 perangkat membuang lebih dari 65.000 alamat.",
  "ls.24.h2": "Menulis dengan panjang prefix",
  "ls.24.p2": "Dalam CIDR, panjang bagian jaringan ditulis setelah alamat dengan \"/\" dan angka. Angka ini disebut [[prefix:panjang prefix]]. Misalnya 192.168.1.0/26 berarti 26 bit pertama adalah bagian jaringan, dan mask-nya 255.255.255.192. Bagian host 6 bit, jadi perangkat dapat memakai 62 alamat.",
  "ls.24.cap2": "/26 adalah mask dengan 26 angka 1 berturut-turut. Bagian host adalah 6 bit sisanya.",
  "ls.24.h3": "Digabung menjadi satu",
  "ls.24.p3": "CIDR juga dapat menulis jaringan-jaringan yang bersebelahan sebagai satu. Misalnya, empat jaringan 192.168.0.0/24 sampai 192.168.3.0/24 dapat ditulis sebagai 192.168.0.0/22. Router mengingat lebih sedikit rute, sehingga rute seluruh Internet tetap kecil.",
  "ls.24.cap3": "Empat jaringan /24 yang berurutan digabung menjadi satu /22.",
  "ls.24.pt1": "[[cidr:CIDR]] menentukan panjang bagian jaringan tanpa terikat kelas.",
  "ls.24.pt2": "[[prefix:Panjang prefix]] seperti \"/26\" menunjukkan jumlah bit bagian jaringan.",
  "ls.24.pt3": "Jaringan yang bersebelahan dapat digabung untuk mengurangi jumlah rute."
};
