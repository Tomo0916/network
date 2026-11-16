/* vi: the text of lesson 14 (js/lessons.js) */
export default {
  "ls.14.lead": "Tầng 2 (tầng liên kết dữ liệu) chuyển dữ liệu chính xác tới thiết bị kế bên trong cùng một mạng. Để làm vậy, nó chia dòng bit thành các đơn vị gọi là frame.",
  "ls.14.h1": "Vai trò của tầng 2",
  "ls.14.p1": "Tầng 1 chỉ mang tín hiệu. Nó không biết một khối dữ liệu bắt đầu và kết thúc ở đâu, hay gửi cho ai. Tầng 2 ghi đích và nguồn lên dữ liệu, đánh dấu điểm đầu và cuối của từng khối, rồi chuyển tới thiết bị khác trong cùng mạng. Chuyển qua các mạng tới nơi xa là việc của tầng 3.",
  "ls.14.cap1": "Tầng 2 chỉ chuyển tới thiết bị kế bên trong cùng mạng. Chuyển qua mạng khác là việc của tầng 3.",
  "ls.14.h2": "Đóng khung (framing)",
  "ls.14.p2": "Chia dòng bit thành các khối có ý nghĩa gọi là [[framing:đóng khung (framing)]], và mỗi khối gọi là frame. Frame gồm [[header:header]] ghi đích và thông tin khác, dữ liệu cần mang, và trailer chứa [[fcs:FCS]] để phát hiện lỗi.",
  "ls.14.cap2": "Hình dạng cơ bản của frame: header ở trước, trailer ở sau, dữ liệu ở giữa.",
  "ls.14.cap3": "Dòng bit kéo dài mãi (trên) được chia thành các đơn vị gọi là frame (dưới).",
  "ls.14.h3": "Truyền thông bất đồng bộ và đồng bộ thời gian",
  "ls.14.p3": "Bên gửi và bên nhận không dùng chung đồng hồ. Vì vậy Ethernet gửi trước mỗi frame một tín hiệu cố định lặp lại \"1010...\", gọi là [[preamble:preamble]]. Bên nhận dựa vào nó để đồng bộ thời gian rồi mới bắt đầu đọc dữ liệu. Cách đồng bộ mỗi lần như vậy mà không dùng chung đồng hồ gọi là [[async:truyền thông bất đồng bộ]].",
  "ls.14.cap4": "\"1010...\" của preamble đồng bộ thời gian, sau đó bắt đầu đọc dữ liệu.",
  "ls.14.pt1": "Tầng 2 chuyển dữ liệu tới thiết bị kế bên trong cùng một mạng.",
  "ls.14.pt2": "Chia dòng bit là [[framing:đóng khung]]. Frame = header + dữ liệu + trailer.",
  "ls.14.pt3": "Trong [[async:truyền thông bất đồng bộ]], [[preamble:preamble]] đồng bộ thời gian trước khi đọc."
};
