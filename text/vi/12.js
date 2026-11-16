/* vi: the text of lesson 12 (js/lessons.js) */
export default {
  "ls.12.lead": "Tín hiệu đi trong cáp không phải lúc nào cũng tới nơi sạch sẽ. Bài này học ba sự cố: tín hiệu yếu đi, bị nhiễu, và va nhau, cùng cách khắc phục.",
  "ls.12.h1": "Suy hao: càng xa càng yếu",
  "ls.12.p1": "Tín hiệu yếu dần khi đi trong cáp. Hiện tượng này gọi là [[attenuation:suy hao]]. Nếu quá yếu, bên nhận không phân biệt được 0 và 1. Vì vậy cáp LAN có chiều dài tối đa (100 m với loại thông dụng).",
  "ls.12.cap1": "Tín hiệu lớn lúc vừa gửi sẽ nhỏ dần khi đi xa và cuối cùng không đọc được.",
  "ls.12.h2": "Nhiễu: xáo trộn từ bên ngoài",
  "ls.12.p2": "Dòng điện thừa lọt vào từ xung quanh như động cơ hay dây điện gọi là [[noise:nhiễu]]. Khi nhiễu chồng lên tín hiệu, hình dạng bị méo và sinh lỗi, ví dụ 0 trông như 1. Các dây trong cáp LAN được xoắn từng đôi để giảm nhiễu.",
  "ls.12.cap2": "Khi nhiễu chồng lên tín hiệu sạch (trên), hình dạng bị méo và đọc sai (dưới).",
  "ls.12.h3": "Xung đột: tín hiệu va nhau",
  "ls.12.p3": "Khi nhiều thiết bị dùng chung một dây và hai máy gửi cùng lúc, tín hiệu chồng lên nhau và bị hỏng. Đó là [[collision:xung đột (collision)]]. Không ai đọc đúng được tín hiệu đã xung đột.",
  "ls.12.cap3": "Khi tín hiệu từ trái và phải chồng lên nhau, kết quả không phải tín hiệu nào cả và không đọc được.",
  "ls.12.h4": "Cách khắc phục: bộ lặp",
  "ls.12.p4": "Giải pháp cho suy hao là [[repeater:bộ lặp (repeater)]]. Bộ lặp nhận tín hiệu đã yếu, đưa nó về cường độ và hình dạng ban đầu rồi gửi tiếp. Nhờ vậy tín hiệu đi được xa hơn. Nhưng bộ lặp chỉ chỉnh và gửi lại tín hiệu nên không ngăn được xung đột.",
  "ls.12.cap4": "Bộ lặp đưa tín hiệu đã yếu về cường độ ban đầu rồi gửi tiếp.",
  "ls.12.pt1": "[[attenuation:Suy hao]]: tín hiệu càng đi xa càng yếu, nên cáp có chiều dài tối đa.",
  "ls.12.pt2": "[[noise:Nhiễu]]: dòng điện thừa từ bên ngoài làm méo tín hiệu.",
  "ls.12.pt3": "[[collision:Xung đột]]: tín hiệu gửi cùng lúc chồng lên nhau và hỏng. Khắc phục suy hao bằng [[repeater:bộ lặp]]."
};
