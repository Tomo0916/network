/* id: the text of lesson 27 (js/lessons.js) */
export default {
  "ls.27.lead": "Alamat IP berupa angka, sehingga sulit diingat manusia. Karena itu kita memakai nama seperti \"www.example.com\". [[dns:DNS]] adalah sistem yang menghubungkan nama dan alamat IP.",
  "ls.27.h1": "Dari nama ke alamat IP",
  "ls.27.p1": "Manusia memakai [[domain:nama domain]], sedangkan komputer berkomunikasi dengan alamat IP. Saat nama domain diketik di browser, komputer lebih dulu bertanya ke server DNS: \"Apa alamat IP nama ini?\". Mencari alamat IP dari nama disebut resolusi nama.",
  "ls.27.cap1": "Komputer menanyakan nama, server DNS menjawab dengan alamat IP.",
  "ls.27.h2": "Tingkatan nama domain",
  "ls.27.p2": "Nama domain adalah tingkatan berbentuk pohon yang dipisahkan titik. Makin ke kanan, makin tinggi tingkatannya. Paling atas adalah root, di bawahnya \"jp\" dan \"com\", lalu \"co.jp\", lalu nama organisasi, dan seterusnya. Setiap tingkatan dikelola oleh server DNS yang berbeda.",
  "ls.27.cap2": "www.example.co.jp ditelusuri: root → jp → co → example → www.",
  "ls.27.h3": "Alur resolusi nama",
  "ls.27.p3": "Jika server DNS yang ditanya tidak tahu jawabannya, ia bertanya berurutan mulai dari server root. Root berkata \"untuk jp, tanya server ini\", server jp menunjuk server berikutnya, dan seterusnya sampai jawaban ditemukan. Jawaban disimpan sebentar, jadi pada kali kedua bisa langsung dijawab.",
  "ls.27.cap3": "Server DNS bertanya berurutan ke server root → jp → example.co.jp.",
  "ls.27.pt1": "[[dns:DNS]] menghubungkan [[domain:nama domain]] dan alamat IP.",
  "ls.27.pt2": "Nama domain berupa tingkatan pohon; makin ke kanan makin tinggi.",
  "ls.27.pt3": "Jawaban dicari dengan menelusuri dari root, lalu disimpan sebentar."
};
