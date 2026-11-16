/* vi: the text of lesson 26 (js/lessons.js) */
export default {
  "ls.26.lead": "Dù biết địa chỉ IP, để gửi frame trên Ethernet vẫn cần địa chỉ MAC của người nhận. [[arp:ARP]] là giao thức tìm địa chỉ MAC từ địa chỉ IP.",
  "ls.26.h1": "Chỉ có địa chỉ IP thì chưa gửi được",
  "ls.26.p1": "Khi máy tính gửi gói tin IP, gói tin được đặt trong frame Ethernet để chở đi. Đích của frame phải ghi [[mac:địa chỉ MAC]]. Nhưng máy chỉ biết địa chỉ IP của người nhận. Vì vậy cần tìm địa chỉ MAC từ địa chỉ IP.",
  "ls.26.cap1": "Biết địa chỉ IP đích, nhưng không biết địa chỉ MAC đích để ghi vào frame.",
  "ls.26.h2": "Cách ARP hoạt động",
  "ls.26.p2": "Trước tiên, ARP gửi yêu cầu ARP tới mọi người bằng [[broadcast:quảng bá]]: \"Ai có 192.168.1.20, hãy cho tôi biết địa chỉ MAC.\" Chỉ thiết bị có địa chỉ IP đó trả lời ARP kèm địa chỉ MAC của mình, bằng [[unicast:unicast]]. Các thiết bị khác bỏ yêu cầu.",
  "ls.26.cap2": "Yêu cầu gửi tới tất cả (quảng bá), trả lời chỉ từ đúng người (unicast).",
  "ls.26.h3": "Bảng ARP",
  "ls.26.p3": "Kết quả được lưu một thời gian trong [[arptable:bảng ARP]]. Lần sau chỉ cần xem bảng, không phải gửi ARP mỗi lần. Nhưng thiết bị có thể thay đổi, nên sau một thời gian mục đó bị xóa. Khi đích ở mạng khác, máy tìm địa chỉ MAC của default gateway chứ không phải của người nhận.",
  "ls.26.cap3": "Bảng ARP chứa các cặp địa chỉ IP và địa chỉ MAC.",
  "ls.26.pt1": "[[arp:ARP]] tìm địa chỉ MAC từ địa chỉ IP.",
  "ls.26.pt2": "Yêu cầu là quảng bá, trả lời là unicast.",
  "ls.26.pt3": "Kết quả được lưu một thời gian trong [[arptable:bảng ARP]]."
};
