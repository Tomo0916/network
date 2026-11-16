/* id: the text of lesson 17 (js/lessons.js) */
export default {
  "ls.17.lead": "[[switch:Switch]] terlihat mirip hub, tetapi ia membaca alamat MAC tujuan setiap frame dan hanya mengirimnya ke port yang membutuhkan. Untuk itu, switch belajar sendiri perangkat mana ada di port mana.",
  "ls.17.h1": "Mempelajari tabel alamat MAC",
  "ls.17.p1": "Setiap kali frame tiba, switch menulis alamat MAC asal dan nomor port tempat frame masuk ke [[mactable:tabel alamat MAC]]. Dengan cara ini, sambil berkomunikasi, switch otomatis belajar siapa ada di port mana.",
  "ls.17.cap1": "Saat frame datang dari PC A, switch menulis \"A ada di port 1\" di tabelnya.",
  "ls.17.h2": "Filtering dan flooding",
  "ls.17.p2": "Jika alamat MAC tujuan ada di tabel, switch hanya mengirim frame ke port itu. Karena tidak dikirim ke port lain, ini disebut [[macfilter:filtering]]. Jika tujuan belum ada di tabel, switch terpaksa mengirim frame ke semua port kecuali port asal. Inilah [[flooding:flooding]]. Broadcast juga dikirim ke semua port.",
  "ls.17.cap2": "Kiri: switch tahu tujuannya, jadi hanya mengirim ke port C. Kanan: tidak tahu, jadi mengirim ke semua port.",
  "ls.17.h3": "Satu collision domain untuk setiap port",
  "ls.17.p3": "Switch menerima sinyal di setiap port secara terpisah, menyimpannya sebentar, lalu meneruskannya. Jadi setiap port punya [[colldomain:collision domain]] sendiri, dan tabrakan tidak menyebar ke seluruh jaringan seperti pada hub. Switch adalah perangkat Layer 2 yang memakai alamat MAC.",
  "ls.17.cap3": "Pada hub semua ada di satu collision domain; pada switch setiap port terpisah.",
  "ls.17.pt1": "Switch mengingat alamat MAC asal dan port di [[mactable:tabel alamat MAC]].",
  "ls.17.pt2": "Jika tahu tujuan, satu port ([[macfilter:filtering]]); jika tidak, semua port ([[flooding:flooding]]).",
  "ls.17.pt3": "Switch adalah perangkat Layer 2. Setiap port punya collision domain sendiri."
};
