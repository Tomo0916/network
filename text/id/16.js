/* id: the text of lesson 16 (js/lessons.js) */
export default {
  "ls.16.lead": "[[ethernet:Ethernet]] adalah standar Layer 1 dan Layer 2 yang paling banyak dipakai untuk LAN. Di pelajaran ini Anda belajar bentuk frame Ethernet, cara menemukan frame rusak, dan aturan untuk berbagi kabel.",
  "ls.16.h1": "Frame Ethernet",
  "ls.16.p1": "Frame Ethernet terdiri dari, dari depan: [[preamble:preamble]] (8 byte), alamat MAC tujuan (6 byte), alamat MAC asal (6 byte), tipe (2 byte), data (46–1500 byte), dan [[fcs:FCS]] (4 byte). Tipe menunjukkan isi data, misalnya IP atau ARP.",
  "ls.16.cap1": "Bentuk frame Ethernet. MAC tujuan, MAC asal, dan tipe membentuk header.",
  "ls.16.h2": "Menemukan kesalahan dengan FCS",
  "ls.16.p2": "Pengirim menghitung sebuah nilai dari isi frame dan menambahkannya di belakang sebagai [[fcs:FCS]]. Penerima melakukan perhitungan yang sama. Jika hasilnya sama dengan FCS, frame tiba dengan benar. Jika tidak, penerima menganggap frame rusak di jalan, misalnya karena [[noise:noise]], lalu membuangnya.",
  "ls.16.cap2": "Atas: hasilnya sama dengan FCS, jadi diterima. Bawah: data rusak dan hasilnya berbeda, jadi dibuang.",
  "ls.16.h3": "CSMA/CD: aturan berbagi kabel",
  "ls.16.p3": "Ethernet yang berbagi satu kabel, misalnya lewat hub, mengirim dengan aturan [[csmacd:CSMA/CD]]. (1) Sebelum mengirim, dengarkan kabel dan pastikan tidak ada yang mengirim. (2) Siapa pun boleh memakai kabel yang sama. (3) Jika tahu ada tabrakan saat mengirim, segera berhenti, tunggu waktu acak, lalu kirim ulang. Karena setiap perangkat menunggu waktu yang berbeda, kemungkinan mengirim bersamaan lagi menjadi kecil.",
  "ls.16.cap3": "Alur CSMA/CD: dengarkan sebelum kirim; setelah tabrakan, tunggu waktu acak lalu dengarkan lagi.",
  "ls.16.pt1": "Frame Ethernet: preamble, MAC tujuan, MAC asal, tipe, data, FCS.",
  "ls.16.pt2": "[[fcs:FCS]] menemukan frame rusak agar bisa dibuang.",
  "ls.16.pt3": "[[csmacd:CSMA/CD]]: dengarkan sebelum kirim; setelah tabrakan, tunggu waktu acak lalu kirim ulang."
};
