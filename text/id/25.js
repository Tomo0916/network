/* id: the text of lesson 25 (js/lessons.js) */
export default {
  "ls.25.lead": "Perangkat di jaringan membutuhkan pengaturan seperti alamat IP. Mengatur satu per satu dengan tangan merepotkan dan sering salah. [[dhcp:DHCP]] adalah protokol yang membagikan pengaturan ini secara otomatis.",
  "ls.25.h1": "Yang dibagikan DHCP",
  "ls.25.p1": "Server DHCP memberikan satu set pengaturan kepada perangkat yang terhubung: [[ipaddress:alamat IP]], [[subnetmask:subnet mask]], [[gateway:default gateway]], alamat server DNS, dan lain-lain. Di rumah, biasanya router berperan sebagai server DHCP.",
  "ls.25.cap1": "Server DHCP membagikan pengaturan yang dibutuhkan untuk komunikasi dalam satu set.",
  "ls.25.h2": "Empat pesan",
  "ls.25.p2": "Sebelum mendapat pengaturan, ada empat pesan yang dipertukarkan. ① DISCOVER: perangkat mencari \"Ada server DHCP?\". ② OFFER: server menawarkan \"Bagaimana dengan alamat ini?\". ③ REQUEST: perangkat meminta \"Saya pakai itu\". ④ ACK: server menyetujui \"Silakan\". Perangkat belum punya alamat IP, jadi DISCOVER dikirim dengan [[broadcast:broadcast]].",
  "ls.25.cap2": "Empat kali pertukaran dengan urutan DISCOVER → OFFER → REQUEST → ACK.",
  "ls.25.h3": "Alamat dipinjamkan",
  "ls.25.p3": "Alamat dari DHCP tidak diberikan, tetapi dipinjamkan untuk waktu terbatas. Jangka waktu ini disebut lease. Perangkat yang terus memakainya meminta perpanjangan sebelum masa berakhir. Alamat yang tidak dipakai lagi kembali ke server dan dapat dipinjamkan ke perangkat lain.",
  "ls.25.cap3": "Minta perpanjangan sekitar separuh masa lease. Kembalikan jika tidak dipakai lagi.",
  "ls.25.pt1": "[[dhcp:DHCP]] membagikan pengaturan seperti alamat IP secara otomatis.",
  "ls.25.pt2": "Empat pesan: DISCOVER → OFFER → REQUEST → ACK.",
  "ls.25.pt3": "Alamat dipinjamkan untuk waktu terbatas (lease)."
};
