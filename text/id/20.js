/* id: the text of lesson 20 (js/lessons.js) */
export default {
  "ls.20.lead": "[[ip:IP]] (Internet Protocol) adalah protokol utama lapisan 3. Hampir semua perangkat yang terhubung ke Internet berkomunikasi dengan IP.",
  "ls.20.h1": "IP berjalan di berbagai jaringan",
  "ls.20.p1": "Di bawah IP ada berbagai lapisan 2, seperti Ethernet dan LAN nirkabel. IP bekerja sama saja di atas semuanya. Selain itu, IP hanya \"berusaha sebaik mungkin\" mengantar dan tidak memeriksa apakah data sudah sampai. Jika perlu diperiksa, TCP di lapisan atas yang melakukannya.",
  "ls.20.cap1": "IP bekerja dengan cara yang sama di atas berbagai lapisan 2.",
  "ls.20.h2": "Bentuk paket IP",
  "ls.20.p2": "Satu kumpulan data yang dikirim dengan IP disebut [[packet:paket]] IP. Di depan paket ada [[header:header]] yang berisi alamat IP sumber, alamat IP tujuan, [[ttl:TTL]] (berapa router lagi yang boleh dilewati), dan lain-lain. Router membaca header ini untuk menentukan ke mana paket dikirim.",
  "ls.20.cap2": "Paket IP terdiri dari header IP dan data.",
  "ls.20.h3": "Paket dibawa di dalam frame",
  "ls.20.p3": "Paket IP tidak bisa berjalan sendiri di kabel. Paket dimasukkan ke dalam frame lapisan 2 ([[encap:enkapsulasi]]) lalu dibawa. Setiap melewati router, frame luar dibuat ulang, tetapi tujuan paket IP di dalamnya tetap sama sampai akhir.",
  "ls.20.cap3": "Router membuka frame, mengeluarkan paket, lalu memasukkannya ke frame baru untuk bagian berikutnya.",
  "ls.20.pt1": "[[ip:IP]] adalah protokol utama lapisan 3. IP tidak memeriksa apakah data sampai.",
  "ls.20.pt2": "[[header:Header]] [[packet:paket]] IP berisi alamat IP sumber dan tujuan, dan lain-lain.",
  "ls.20.pt3": "Frame dibuat ulang di setiap bagian, tetapi tujuan paket IP tidak berubah."
};
