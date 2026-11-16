/* vi: the text of lesson 16 (js/lessons.js) */
export default {
  "ls.16.lead": "[[ethernet:Ethernet]] là chuẩn tầng 1 và tầng 2 được dùng rộng rãi nhất cho LAN. Bài này học hình dạng frame Ethernet, cách phát hiện frame hỏng và quy tắc dùng chung cáp.",
  "ls.16.h1": "Frame Ethernet",
  "ls.16.p1": "Frame Ethernet gồm, từ trước ra sau: [[preamble:preamble]] (8 byte), địa chỉ MAC đích (6 byte), địa chỉ MAC nguồn (6 byte), loại (2 byte), dữ liệu (46–1500 byte) và [[fcs:FCS]] (4 byte). Trường loại cho biết dữ liệu bên trong là gì, ví dụ IP hay ARP.",
  "ls.16.cap1": "Hình dạng frame Ethernet. MAC đích, MAC nguồn và loại tạo thành header.",
  "ls.16.h2": "Phát hiện lỗi bằng FCS",
  "ls.16.p2": "Bên gửi tính một giá trị từ nội dung frame và thêm vào cuối làm [[fcs:FCS]]. Bên nhận tính lại giống vậy. Nếu kết quả bằng FCS thì frame tới đúng. Nếu khác, bên nhận cho rằng frame đã hỏng trên đường, ví dụ do [[noise:nhiễu]], và bỏ frame đó.",
  "ls.16.cap2": "Trên: kết quả bằng FCS nên nhận. Dưới: dữ liệu bị hỏng, kết quả khác nên bỏ.",
  "ls.16.h3": "CSMA/CD: quy tắc dùng chung cáp",
  "ls.16.p3": "Ethernet dùng chung một cáp, ví dụ qua hub, gửi theo quy tắc [[csmacd:CSMA/CD]]. (1) Trước khi gửi, nghe đường cáp và chắc chắn không ai đang gửi. (2) Ai cũng có thể dùng chung cáp. (3) Nếu phát hiện xung đột khi đang gửi, dừng ngay, chờ một khoảng thời gian ngẫu nhiên rồi gửi lại. Vì mỗi máy chờ thời gian khác nhau nên ít khi lại gửi cùng lúc.",
  "ls.16.cap3": "Trình tự CSMA/CD: nghe trước khi gửi; sau khi xung đột, chờ thời gian ngẫu nhiên rồi nghe lại.",
  "ls.16.pt1": "Frame Ethernet: preamble, MAC đích, MAC nguồn, loại, dữ liệu, FCS.",
  "ls.16.pt2": "[[fcs:FCS]] phát hiện frame hỏng để bỏ đi.",
  "ls.16.pt3": "[[csmacd:CSMA/CD]]: nghe trước khi gửi; khi xung đột thì chờ thời gian ngẫu nhiên rồi gửi lại."
};
