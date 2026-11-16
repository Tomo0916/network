/* vi: the text of lesson 13 (js/lessons.js) */
export default {
  "ls.13.lead": "[[hub:Hub]] là thiết bị gom nhiều máy tính về một chỗ và nối chúng bằng cáp LAN. Cách hoạt động của nó rất đơn giản, và chính sự đơn giản đó cũng là điểm yếu.",
  "ls.13.h1": "Cách hub hoạt động: gửi ra mọi cổng",
  "ls.13.p1": "Hub gửi nguyên tín hiệu đến ở một cổng ra tất cả các cổng khác. Nó không xem đích là ai. Việc chỉnh lại tín hiệu rồi gửi đi giống công việc của [[repeater:bộ lặp (repeater)]], nên có thể xem hub là một bộ lặp có nhiều cổng. Vì không xem địa chỉ, hub là thiết bị tầng 1.",
  "ls.13.cap1": "Khi PC A gửi cho PC C, hub gửi tới cả B, C và D. B và D bỏ đi vì không phải gửi cho mình.",
  "ls.13.h2": "Điểm yếu của hub: xung đột",
  "ls.13.p2": "Các thiết bị nối vào hub giống như cùng dùng chung một sợi dây. Nếu hai máy gửi cùng lúc, tín hiệu va nhau trong hub và bị hỏng. Đó là [[collision:xung đột (collision)]]. Vì vậy thiết bị nối vào hub không thể gửi và nhận cùng lúc. Kiểu liên lạc này gọi là [[halfduplex:bán song công (half duplex)]].",
  "ls.13.cap2": "Nếu A và C gửi cùng lúc, tín hiệu xung đột. B và D chỉ nhận tín hiệu hỏng, còn A và C phải gửi lại.",
  "ls.13.h3": "Miền xung đột",
  "ls.13.p3": "Phạm vi chịu ảnh hưởng của xung đột gọi là [[colldomain:miền xung đột]]. Mọi thiết bị nối vào một hub tạo thành một miền xung đột. Càng nhiều thiết bị thì xung đột càng hay xảy ra, và cả mạng chậm đi. [[switch:Switch]] giải quyết vấn đề này (bài 17).",
  "ls.13.cap3": "Với hub, cả bốn PC là một miền xung đột. Với switch, mỗi cổng tách riêng nên có bốn miền.",
  "ls.13.h4": "Kiểm tra bằng hoạt hình",
  "ls.13.p4": "Để nguyên \"hub\", chọn máy gửi và đích rồi gửi. Hãy để ý frame tới cả những PC không phải đích, và số frame bị gửi vô ích. Sau đó đổi sang \"switch\" và gửi giống vậy để thấy sự khác nhau.",
  "ls.13.pt1": "Hub gửi tín hiệu nhận được ra mọi cổng khác. Nó không xem đích.",
  "ls.13.pt2": "Hub là thiết bị tầng 1, có thể xem là [[repeater:bộ lặp]] nhiều cổng.",
  "ls.13.pt3": "Mọi thiết bị nối vào hub tạo thành một [[colldomain:miền xung đột]]. Càng nhiều thiết bị, càng nhiều xung đột.",
  "ls.13.cap4": "Bộ lặp có hai cổng. Hub làm cùng việc đó với nhiều cổng."
};
