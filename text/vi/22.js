/* vi: the text of lesson 22 (js/lessons.js) */
export default {
  "ls.22.lead": "Làm sao biết phần mạng của địa chỉ IP dài tới đâu? Cách đầu tiên là dùng \"lớp\". Ngoài ra, có những địa chỉ IP mang ý nghĩa đặc biệt.",
  "ls.22.h1": "Lớp địa chỉ IP",
  "ls.22.p1": "Với [[ipclass:lớp địa chỉ IP]], số đầu tiên quyết định độ dài phần mạng. Lớp A có 8 bit đầu là phần mạng, lớp B có 16 bit đầu, lớp C có 24 bit đầu. Lớp A dành cho mạng lớn, lớp C cho mạng nhỏ.",
  "ls.22.cap1": "Độ dài phần mạng và phần host của lớp A, B, C, và khoảng của số đầu tiên.",
  "ls.22.h2": "Phần host toàn 0 và toàn 1",
  "ls.22.p2": "Địa chỉ có các bit phần host đều là 0 là [[netaddr:địa chỉ mạng]], đại diện cho chính mạng đó. Địa chỉ toàn 1 là [[bcastaddr:địa chỉ quảng bá]], dùng để gửi cho tất cả trong mạng. Hai địa chỉ này không gán được cho thiết bị, nên số dùng được bằng số tổ hợp của phần host trừ 2.",
  "ls.22.cap2": "Mạng 192.168.1.0–255. Thiết bị dùng được 1–254, tức 254 địa chỉ.",
  "ls.22.h3": "Địa chỉ chỉ chính mình",
  "ls.22.p3": "Các địa chỉ bắt đầu bằng 127 là [[loopback:địa chỉ loopback]], chỉ chính thiết bị đó. Hay dùng nhất là 127.0.0.1. Dữ liệu gửi tới địa chỉ này không ra mạng mà quay về chính mình, nên rất tiện để thử chương trình trên máy tính của mình.",
  "ls.22.cap3": "Dữ liệu gửi tới 127.0.0.1 không đi ra ngoài mà quay về chính máy đó.",
  "ls.22.pt1": "Ở [[ipclass:lớp]] A, B, C, phần mạng lần lượt là 8, 16, 24 bit.",
  "ls.22.pt2": "Phần host toàn 0 là [[netaddr:địa chỉ mạng]], toàn 1 là [[bcastaddr:địa chỉ quảng bá]].",
  "ls.22.pt3": "[[loopback:Địa chỉ loopback]] như 127.0.0.1 chỉ chính mình."
};
