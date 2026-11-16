/* vi: the text of lesson 24 (js/lessons.js) */
export default {
  "ls.24.lead": "Với cách chia lớp, mạng chỉ có 3 kích cỡ. Vì vậy, người ta dùng cách tự do quyết định độ dài phần mạng mà không bị lớp ràng buộc. Đó là [[cidr:CIDR]] (định địa chỉ không phân lớp).",
  "ls.24.h1": "Chia lớp gây lãng phí",
  "ls.24.p1": "Lớp C dùng được 254 thiết bị, lớp B khoảng 65.000. Khi muốn làm mạng 500 thiết bị, lớp C không đủ, còn lớp B thì phần lớn địa chỉ bị bỏ không. Địa chỉ IPv4 có giới hạn, nên sự lãng phí này trở thành vấn đề lớn.",
  "ls.24.cap1": "Dùng lớp B cho 500 thiết bị sẽ lãng phí hơn 65.000 địa chỉ.",
  "ls.24.h2": "Viết bằng độ dài prefix",
  "ls.24.p2": "Trong CIDR, độ dài phần mạng được viết sau địa chỉ bằng \"/\" và một con số. Con số này là [[prefix:độ dài prefix]]. Ví dụ 192.168.1.0/26 nghĩa là 26 bit đầu là phần mạng, mask là 255.255.255.192. Phần host có 6 bit, nên thiết bị dùng được 62 địa chỉ.",
  "ls.24.cap2": "/26 là mask có 26 số 1 liên tiếp. Phần host là 6 bit còn lại.",
  "ls.24.h3": "Gộp lại thành một",
  "ls.24.p3": "CIDR còn có thể gộp các mạng liền kề và viết thành một. Ví dụ 4 mạng từ 192.168.0.0/24 đến 192.168.3.0/24 có thể viết là 192.168.0.0/22. Router phải nhớ ít tuyến hơn, giúp giữ cho bảng tuyến của cả Internet nhỏ gọn.",
  "ls.24.cap3": "Gộp 4 mạng /24 liền nhau thành một mạng /22.",
  "ls.24.pt1": "[[cidr:CIDR]] quyết định độ dài phần mạng mà không bị lớp ràng buộc.",
  "ls.24.pt2": "[[prefix:Độ dài prefix]] như \"/26\" cho biết số bit của phần mạng.",
  "ls.24.pt3": "Có thể gộp các mạng liền kề để giảm số tuyến."
};
