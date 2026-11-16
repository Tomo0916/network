/* vi: the text of lesson 11 (js/lessons.js) */
export default {
  "ls.11.lead": "Tầng 1 (tầng vật lý) biến dữ liệu gồm 0 và 1 thành tín hiệu có thể đi qua cáp hoặc không khí, rồi đưa tới thiết bị kế bên. Nó nằm dưới cùng của mạng và hỗ trợ mọi liên lạc.",
  "ls.11.h1": "Vai trò của tầng 1",
  "ls.11.p1": "Trong máy tính, dữ liệu là một dãy 0 và 1 ([[bit:bit]]). Nhưng những con số 0 và 1 không chạy trong cáp. Tầng 1 biến bit thành tín hiệu như dòng điện mạnh yếu, ánh sáng nhấp nháy hay thay đổi của sóng vô tuyến, rồi gửi đi. Bên nhận biến tín hiệu trở lại thành bit.",
  "ls.11.cap1": "Tầng 1 nằm dưới cùng mô hình OSI. Nó biến bit từ các tầng trên thành tín hiệu và gửi đi.",
  "ls.11.cap2": "Ví dụ bit thành tín hiệu điện: 1 là điện áp cao, 0 là điện áp thấp (cách thực tế phức tạp hơn).",
  "ls.11.h2": "Môi trường truyền",
  "ls.11.p2": "Thứ mang tín hiệu gọi là [[media:môi trường truyền]]. Có ba loại chính: cáp LAN bằng đồng (tín hiệu điện), cáp quang bằng sợi thủy tinh mảnh (tín hiệu ánh sáng) và sóng vô tuyến truyền trong không khí (LAN không dây). Cáp quang gửi nhanh và xa. Sóng vô tuyến không cần cáp nhưng dễ bị ảnh hưởng bởi tường và sóng khác.",
  "ls.11.cap3": "Các môi trường truyền thường gặp. Từ trái: cáp LAN (điện), cáp quang (ánh sáng), không dây (sóng vô tuyến).",
  "ls.11.h3": "Giao diện và NIC",
  "ls.11.p3": "Chỗ thiết bị cắm cáp gọi là [[interface:giao diện (interface)]]. Trong máy tính, [[nic:NIC]] làm việc này và chuyển đổi giữa bit và tín hiệu. Tốc độ được biểu thị bằng [[bps:bps]], số bit gửi được trong một giây.",
  "ls.11.cap4": "NIC bên gửi biến bit thành tín hiệu; NIC bên nhận biến tín hiệu trở lại thành bit.",
  "ls.11.pt1": "Tầng 1 biến bit thành tín hiệu và đưa tới thiết bị kế bên.",
  "ls.11.pt2": "Thứ mang tín hiệu là [[media:môi trường truyền]]: cáp LAN, cáp quang, sóng vô tuyến...",
  "ls.11.pt3": "[[nic:NIC]] chuyển đổi giữa bit và tín hiệu. Tốc độ biểu thị bằng [[bps:bps]]."
};
