/* vi: the text of lesson 25 (js/lessons.js) */
export default {
  "ls.25.lead": "Thiết bị nối mạng cần các thiết lập như địa chỉ IP. Cài tay từng máy rất vất vả và dễ sai. [[dhcp:DHCP]] là giao thức tự động cấp các thiết lập này.",
  "ls.25.h1": "DHCP cấp những gì",
  "ls.25.p1": "Máy chủ DHCP đưa cho thiết bị vừa kết nối cả bộ thiết lập: [[ipaddress:địa chỉ IP]], [[subnetmask:subnet mask]], [[gateway:default gateway]], địa chỉ máy chủ DNS, v.v. Ở nhà, router thường đóng vai máy chủ DHCP.",
  "ls.25.cap1": "Máy chủ DHCP cấp trọn bộ các thiết lập cần cho việc giao tiếp.",
  "ls.25.h2": "Bốn thông điệp",
  "ls.25.p2": "Trước khi nhận được thiết lập, hai bên trao đổi 4 thông điệp. ① DISCOVER: thiết bị tìm \"Có máy chủ DHCP không?\". ② OFFER: máy chủ đề nghị \"Địa chỉ này thì sao?\". ③ REQUEST: thiết bị xin \"Tôi dùng địa chỉ đó\". ④ ACK: máy chủ đồng ý \"Được\". Thiết bị chưa có địa chỉ IP nên gửi DISCOVER bằng [[broadcast:quảng bá]].",
  "ls.25.cap2": "Trao đổi 4 lần theo thứ tự DISCOVER → OFFER → REQUEST → ACK.",
  "ls.25.h3": "Địa chỉ được cho mượn",
  "ls.25.p3": "Địa chỉ cấp bằng DHCP không phải được tặng mà là cho mượn có thời hạn. Thời hạn này gọi là lease. Thiết bị muốn dùng tiếp sẽ xin gia hạn trước khi hết hạn. Địa chỉ không còn dùng sẽ trả về máy chủ và có thể cho thiết bị khác mượn.",
  "ls.25.cap3": "Xin gia hạn khi được khoảng nửa thời hạn. Trả lại khi không dùng nữa.",
  "ls.25.pt1": "[[dhcp:DHCP]] tự động cấp các thiết lập như địa chỉ IP.",
  "ls.25.pt2": "Bốn thông điệp DISCOVER → OFFER → REQUEST → ACK.",
  "ls.25.pt3": "Địa chỉ được cho mượn có thời hạn (lease)."
};
