/* id: the text of lesson 14 (js/lessons.js) */
export default {
  "ls.14.lead": "Layer 2 (data link layer) mengantar data dengan benar ke perangkat sebelah di dalam jaringan yang sama. Untuk itu, layer ini membagi aliran bit menjadi satuan yang disebut frame.",
  "ls.14.h1": "Tugas Layer 2",
  "ls.14.p1": "Layer 1 hanya membawa sinyal. Ia tidak tahu di mana satu data mulai dan berakhir, atau untuk siapa data itu. Layer 2 menulis tujuan dan asal pada data, menandai awal dan akhir setiap bagian, lalu mengantarnya ke perangkat lain di jaringan yang sama. Mengantar melewati jaringan ke tempat jauh adalah tugas Layer 3.",
  "ls.14.cap1": "Layer 2 hanya mengantar sampai perangkat sebelah di jaringan yang sama. Pengiriman antarjaringan adalah tugas Layer 3.",
  "ls.14.h2": "Framing",
  "ls.14.p2": "Membagi aliran bit menjadi bagian yang bermakna disebut [[framing:framing]], dan setiap bagian disebut frame. Frame terdiri dari [[header:header]] berisi tujuan dan informasi lain, data yang dibawa, dan trailer berisi [[fcs:FCS]] untuk menemukan kesalahan.",
  "ls.14.cap2": "Bentuk dasar frame: header di depan, trailer di belakang, data di tengah.",
  "ls.14.cap3": "Aliran bit yang tidak berujung (atas) dibagi menjadi satuan yang disebut frame (bawah).",
  "ls.14.h3": "Komunikasi asinkron dan penyamaan waktu",
  "ls.14.p3": "Pengirim dan penerima tidak berbagi jam. Karena itu Ethernet mengirim sinyal tetap yang berulang \"1010…\", yaitu [[preamble:preamble]], sebelum setiap frame. Penerima memakainya untuk menyamakan waktu, lalu mulai membaca data. Cara seperti ini, yang menyamakan waktu setiap kali tanpa berbagi jam, disebut [[async:komunikasi asinkron]].",
  "ls.14.cap4": "\"1010…\" dari preamble menyamakan waktu, lalu pembacaan data dimulai.",
  "ls.14.pt1": "Layer 2 mengantar data ke perangkat sebelah di dalam jaringan yang sama.",
  "ls.14.pt2": "Membagi aliran bit disebut [[framing:framing]]. Frame = header + data + trailer.",
  "ls.14.pt3": "Dalam [[async:komunikasi asinkron]], [[preamble:preamble]] menyamakan waktu sebelum membaca."
};
