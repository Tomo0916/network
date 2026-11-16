/* vi: the text of lesson 18 (js/lessons.js) */
export default {
  "ls.18.lead": "Với switch, thiết bị có thể dùng song công: gửi và nhận cùng lúc. Bài này học sự khác nhau giữa bán song công và song công, và việc đệm (buffering) giúp điều đó.",
  "ls.18.h1": "Bán song công và song công",
  "ls.18.p1": "Liên lạc không thể gửi và nhận cùng lúc, mà làm từng việc một, gọi là [[halfduplex:bán song công]]. Giống bộ đàm, người nói và người nghe thay phiên. Liên lạc làm được cả hai cùng lúc là [[fullduplex:song công]]. Giống điện thoại, đang nói vẫn nghe được người kia.",
  "ls.18.cap1": "Trái: bán song công dùng một đường thay phiên. Phải: song công có đường đi và đường về riêng nên dùng được cùng lúc.",
  "ls.18.h2": "Vì sao song công không xung đột",
  "ls.18.p2": "Trong cáp LAN có dây riêng để gửi và dây riêng để nhận. Khi nối hai thiết bị một-một, tín hiệu gửi và tín hiệu nhận đi trên các dây khác nhau nên không bao giờ va nhau. Khi nhiều thiết bị dùng chung dây như với hub thì không tách được như vậy, nên thành bán song công.",
  "ls.18.cap2": "Dây gửi (TX) của PC nối với phía nhận (RX) của switch, và dây gửi của switch nối với phía nhận của PC.",
  "ls.18.h3": "Đệm (buffering)",
  "ls.18.p3": "Đôi khi các frame cho cùng một đích tới switch từ các cổng khác nhau cùng lúc. Switch giữ các frame trong bộ nhớ một chút rồi gửi lần lượt. Việc này gọi là [[buffering:đệm (buffering)]]. Nhờ đệm, trong switch không có xung đột. Với song công, cũng không cần [[csmacd:CSMA/CD]].",
  "ls.18.cap3": "Các frame cho C tới cùng lúc từ A và B được giữ trong bộ đệm rồi gửi từng cái một.",
  "ls.18.pt1": "[[halfduplex:Bán song công]]: gửi hoặc nhận, từng việc một. [[fullduplex:Song công]]: cả hai cùng lúc.",
  "ls.18.pt2": "Song công có dây gửi và dây nhận riêng nên không xung đột, không cần [[csmacd:CSMA/CD]].",
  "ls.18.pt3": "Switch dùng [[buffering:đệm]] để gửi lần lượt các frame tới cùng lúc."
};
